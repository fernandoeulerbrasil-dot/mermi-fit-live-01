import { MarmitaCategory, MarmitaSize, MarmitaPricing } from '../types';
import { CustomIngredientOption, CartItemProduct, CouponRule, DeliveryAddress } from '../types/food';

/**
 * SERVIÇO CENTRAL DE PREÇOS E CÁLCULO — MERMI FIT LIFE (BLOCO 04)
 * 
 * Regra Absoluta do Ecossistema:
 * 1. O Preço Base é ditado exclusivamente pela tabela oficial (consultada do estado/BD):
 *    - FIT: 350g = R$ 19,90 | 500g = R$ 24,90
 *    - FIT PREMIUM: 350g = R$ 32,90 | 500g = R$ 39,90
 * 2. A troca de ingredientes incluídos (proteínas, carboidratos, vegetais da mesma linha)
 *    tem custo adicional ZERO (R$ 0,00).
 * 3. Somente adicionais pagos explícitos somam valor ao preço base.
 * 4. Cálculo centralizado utilizado em todo o aplicativo (Cardápio, Personalização, Carrinho, Checkout, Pedidos, Mermi Control).
 */

export interface OrderPriceCalculation {
  subtotal: number;
  addonsTotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  pointsEarned: number;
  appliedCoupon?: CouponRule | null;
}

export const getBasePrice = (
  pricingList: MarmitaPricing[],
  category: MarmitaCategory,
  size: MarmitaSize
): number => {
  const found = pricingList.find((p) => p.category === category && p.size === size);
  if (found) return found.price;
  
  // Fallbacks de segurança estritos da tabela oficial
  if (category === 'fit') {
    return size === '350g' ? 19.90 : 24.90;
  }
  return size === '350g' ? 32.90 : 39.90;
};

/**
 * Calcula o preço unitário de uma marmita personalizada:
 * Preço = Preço Base (linha + tamanho) + soma dos Adicionais Pagos
 */
export const calculateMarmitaPrice = (
  pricingList: MarmitaPricing[],
  line: MarmitaCategory,
  size: MarmitaSize,
  paidAddons: CustomIngredientOption[] = []
): { basePrice: number; addonsPrice: number; unitPrice: number } => {
  const basePrice = getBasePrice(pricingList, line, size);
  
  // Somente os adicionais do tipo 'adicional_pago' com extraPrice > 0 somam ao total
  const addonsPrice = paidAddons.reduce((sum, item) => sum + (item.extraPrice || 0), 0);
  const unitPrice = Number((basePrice + addonsPrice).toFixed(2));

  return {
    basePrice,
    addonsPrice,
    unitPrice
  };
};

/**
 * Calcula os pontos gerados por uma marmita:
 * Regra: FIT = 15 points (350g) / 20 points (500g)
 * FIT PREMIUM = 25 points (350g) / 30 points (500g)
 */
export const calculateMarmitaPoints = (
  line: MarmitaCategory,
  size: MarmitaSize
): number => {
  if (line === 'fit_premium') {
    return size === '500g' ? 30 : 25;
  }
  return size === '500g' ? 20 : 15;
};

/**
 * Validação segura de cupom de desconto
 */
export const validateCoupon = (
  coupon: CouponRule | null | undefined,
  subtotal: number,
  items: CartItemProduct[]
): { isValid: boolean; discountAmount: number; errorReason?: string } => {
  if (!coupon || !coupon.active) {
    return { isValid: false, discountAmount: 0 };
  }

  // Verificar data de validade
  const now = new Date();
  const validUntilDate = new Date(coupon.validUntil);
  if (now > validUntilDate) {
    return { isValid: false, discountAmount: 0, errorReason: 'Cupom expirado.' };
  }

  // Verificar limite de uso geral
  if (coupon.usageLimit > 0 && coupon.usageCount >= coupon.usageLimit) {
    return { isValid: false, discountAmount: 0, errorReason: 'Limite de utilização do cupom esgotado.' };
  }

  // Verificar valor mínimo do pedido
  if (subtotal < coupon.minOrderValue) {
    return {
      isValid: false,
      discountAmount: 0,
      errorReason: `Pedido mínimo de R$ ${coupon.minOrderValue.toFixed(2).replace('.', ',')} para este cupom.`
    };
  }

  // Verificar elegibilidade de linha (se restrito a FIT ou PREMIUM)
  if (coupon.eligibleLines && coupon.eligibleLines.length > 0) {
    const hasEligibleItem = items.some((item) => coupon.eligibleLines?.includes(item.line));
    if (!hasEligibleItem) {
      return {
        isValid: false,
        discountAmount: 0,
        errorReason: 'Este cupom não é válido para os produtos selecionados no carrinho.'
      };
    }
  }

  // Calcular valor do desconto
  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = (subtotal * coupon.discountValue) / 100;
  } else {
    discount = coupon.discountValue;
  }

  // Respeitar teto máximo de desconto se configurado
  if (coupon.maxDiscount && discount > coupon.maxDiscount) {
    discount = coupon.maxDiscount;
  }

  // Desconto não pode exceder o subtotal
  if (discount > subtotal) {
    discount = subtotal;
  }

  return {
    isValid: true,
    discountAmount: Number(discount.toFixed(2))
  };
};

/**
 * Função central calculateOrderPrice():
 * TOTAL = PREÇO BASE + ADICIONAIS PAGOS - DESCONTOS + TAXA DE ENTREGA
 */
export const calculateOrderPrice = (
  items: CartItemProduct[],
  coupon: CouponRule | null | undefined,
  deliveryType: 'entrega' | 'retirada' = 'entrega',
  deliveryFeeSetting = 7.90,
  freeDeliveryThreshold = 75.00
): OrderPriceCalculation => {
  const subtotal = Number(
    items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0).toFixed(2)
  );

  const addonsTotal = Number(
    items.reduce((sum, item) => {
      if (item.customMarmita) {
        return sum + (item.customMarmita.addonsPrice * item.quantity);
      }
      return sum;
    }, 0).toFixed(2)
  );

  const pointsEarned = items.reduce(
    (sum, item) => sum + item.points_earned * item.quantity,
    0
  );

  const couponValidation = validateCoupon(coupon, subtotal, items);
  const discount = couponValidation.isValid ? couponValidation.discountAmount : 0;

  // Taxa de entrega (0 para retirada ou se atingir o valor de frete grátis)
  let deliveryFee = 0;
  if (deliveryType === 'entrega') {
    deliveryFee = subtotal >= freeDeliveryThreshold ? 0 : deliveryFeeSetting;
  }

  const total = Number(Math.max(0, subtotal - discount + deliveryFee).toFixed(2));

  return {
    subtotal,
    addonsTotal,
    discount,
    deliveryFee,
    total,
    pointsEarned,
    appliedCoupon: couponValidation.isValid ? coupon : null
  };
};
