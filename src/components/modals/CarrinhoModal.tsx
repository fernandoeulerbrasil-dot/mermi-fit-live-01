import React, { useState } from 'react';
import { Modal } from '../../design-system/components/Feedback';
import { useMermiStore } from '../../context/MermiStoreContext';
import { calculateOrderPrice } from '../../services/pricingService';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Award,
  Truck,
  Store,
  Tag,
  X,
  Check,
  Sparkles,
  Edit3
} from 'lucide-react';
import { CheckoutModal } from '../checkout/CheckoutModal';

interface CarrinhoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckoutSuccess?: (orderId?: string) => void;
  onEditCustomMarmita?: (item: any) => void;
}

export const CarrinhoModal: React.FC<CarrinhoModalProps> = ({
  isOpen,
  onClose,
  onCheckoutSuccess,
  onEditCustomMarmita
}) => {
  const {
    cartItems,
    updateCartQuantity,
    removeCartItem,
    clearCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    deliveryType,
    setDeliveryType,
    deliveryFeeSetting,
    freeDeliveryThreshold,
    recordCartAbandonment,
    showToast
  } = useMermiStore();

  const [couponInput, setCouponInput] = useState('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  if (!isOpen) return null;

  // CÁLCULO CENTRALIZADO DE PREÇO & PONTOS (BLOCO 04, Seção 13 & 15)
  const priceCalc = calculateOrderPrice(
    cartItems,
    appliedCoupon,
    deliveryType,
    deliveryFeeSetting,
    freeDeliveryThreshold
  );

  const handleCloseCart = () => {
    if (cartItems.length > 0) {
      recordCartAbandonment(cartItems, priceCalc.total);
    }
    onClose();
  };

  const remainingForFreeShipping = Math.max(
    0,
    freeDeliveryThreshold - priceCalc.subtotal
  );
  const freeShippingProgress = Math.min(
    100,
    Math.round((priceCalc.subtotal / freeDeliveryThreshold) * 100)
  );

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput.trim());
    if (res.success) {
      setCouponInput('');
    } else {
      showToast(res.message);
    }
  };

  const handleOpenCheckout = () => {
    if (cartItems.length === 0) {
      showToast('Adicione ao menos um item ao carrinho.');
      return;
    }
    setIsCheckoutOpen(true);
  };

  const handleOrderFinished = (orderId: string) => {
    setIsCheckoutOpen(false);
    onClose();
    if (onCheckoutSuccess) {
      onCheckoutSuccess(orderId);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen && !isCheckoutOpen}
        onClose={handleCloseCart}
        title="Meu Carrinho & Marmitas"
        maxWidth="max-w-lg"
      >
        <div className="space-y-4">
          {cartItems.length === 0 ? (
            <div className="py-10 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <h4 className="font-black text-sm text-stone-900 font-['Outfit'] uppercase">
                Seu carrinho está vazio
              </h4>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Explore o Cardápio Fit ou monte sua marmita personalizada com ingredientes frescos e balanceados.
              </p>
            </div>
          ) : (
            <>
              {/* Opção de Entrega / Retirada */}
              <div className="bg-stone-100 p-1 rounded-2xl flex items-center gap-1 border border-stone-200">
                <button
                  type="button"
                  onClick={() => setDeliveryType('entrega')}
                  className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    deliveryType === 'entrega'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  <Truck className="w-3.5 h-3.5" /> Entrega Expressa
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryType('retirada')}
                  className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    deliveryType === 'retirada'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  <Store className="w-3.5 h-3.5" /> Retirada no Local
                </button>
              </div>

              {/* Barra de Progresso Frete Grátis */}
              {deliveryType === 'entrega' && (
                <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-200/80 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    {remainingForFreeShipping > 0 ? (
                      <span className="text-stone-700">
                        Faltam apenas <strong className="text-emerald-700">R$ {remainingForFreeShipping.toFixed(2).replace('.', ',')}</strong> para frete grátis!
                      </span>
                    ) : (
                      <span className="text-[#0EB24A] font-black uppercase tracking-wider flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Parabéns! Você ganhou Frete Grátis
                      </span>
                    )}
                    <span className="text-emerald-800 font-bold">{freeShippingProgress}%</span>
                  </div>
                  <div className="w-full bg-emerald-200/60 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#0EB24A] h-full transition-all duration-300 rounded-full"
                      style={{ width: `${freeShippingProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Lista de Itens */}
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-white border border-stone-200 flex flex-col justify-between space-y-2 text-xs shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase ${
                            item.line === 'fit_premium'
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          }`}>
                            {item.line === 'fit_premium' ? 'Premium' : 'Fit'} · {item.size}
                          </span>
                          <h4 className="font-black text-stone-900 font-['Outfit']">
                            {item.name}
                          </h4>
                        </div>
                        <p className="text-[10px] text-stone-500 leading-tight">
                          {item.summary}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {item.isCustomMarmita && onEditCustomMarmita && (
                          <button
                            onClick={() => onEditCustomMarmita(item)}
                            title="Editar Marmita"
                            className="text-stone-400 hover:text-emerald-600 p-1 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => removeCartItem(item.id)}
                          title="Remover Item"
                          className="text-stone-400 hover:text-rose-500 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                      <div>
                        <span className="font-black text-[#0EB24A] font-['Outfit'] text-sm">
                          R$ {item.totalPrice.toFixed(2).replace('.', ',')}
                        </span>
                        <span className="text-[9px] text-stone-400 block">
                          (R$ {item.unitPrice.toFixed(2).replace('.', ',')} cada)
                        </span>
                      </div>

                      {/* Controles de Quantidade */}
                      <div className="flex items-center gap-2 bg-stone-100 px-2 py-0.5 rounded-full border border-stone-200">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.id, -1)}
                          className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-stone-200 cursor-pointer text-stone-700"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-bold text-xs w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.id, 1)}
                          className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-stone-200 cursor-pointer text-stone-700"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cupom de Desconto */}
              <div className="pt-2 border-t border-stone-200">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-[#0EB24A]" />
                      <div>
                        <span className="font-black text-stone-900 font-['Outfit']">
                          Cupom {appliedCoupon.code}
                        </span>
                        <span className="text-[10px] text-emerald-700 block">
                          Desconto de R$ {priceCalc.discount.toFixed(2).replace('.', ',')} aplicado
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-stone-400 hover:text-rose-500 p-1 cursor-pointer"
                      title="Remover cupom"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Cupom de desconto (Ex: BEMVINDO)"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-stone-300 bg-white uppercase font-bold text-stone-800 placeholder:normal-case placeholder:font-normal focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-3 py-2 rounded-xl bg-stone-900 text-white text-xs font-black uppercase tracking-wider hover:bg-stone-800 transition-colors cursor-pointer shrink-0"
                    >
                      Aplicar
                    </button>
                  </form>
                )}
              </div>

              {/* Destaque MerMi Points (BLOCO 04, Seção 15) */}
              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs font-bold shadow-xs">
                <span className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>Você ganhará neste pedido:</span>
                </span>
                <span className="font-black text-amber-800 font-['Outfit'] text-sm">
                  +{priceCalc.pointsEarned} MerMi Points
                </span>
              </div>

              {/* Resumo Financeiro */}
              <div className="space-y-1 text-xs text-stone-600 pt-2 border-t border-stone-200">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>R$ {priceCalc.subtotal.toFixed(2).replace('.', ',')}</span>
                </div>

                {priceCalc.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Desconto ({appliedCoupon?.code}):</span>
                    <span>- R$ {priceCalc.discount.toFixed(2).replace('.', ',')}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Taxa de Entrega:</span>
                  <span>
                    {priceCalc.deliveryFee === 0 ? (
                      <span className="text-[#0EB24A] font-bold uppercase">Grátis</span>
                    ) : (
                      `R$ ${priceCalc.deliveryFee.toFixed(2).replace('.', ',')}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-center text-base font-black text-stone-950 pt-2 border-t border-stone-200 font-['Outfit']">
                  <span>TOTAL:</span>
                  <span className="text-xl text-[#0EB24A]">
                    R$ {priceCalc.total.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              {/* Botão de Finalização */}
              <button
                type="button"
                onClick={handleOpenCheckout}
                className="w-full py-3 rounded-2xl bg-[#0EB24A] hover:bg-emerald-600 active:scale-98 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <span>Continuar para Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </Modal>

      {/* Checkout Modal Conectado */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={handleOrderFinished}
      />
    </>
  );
};
