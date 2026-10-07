import { MarmitaCategory, MarmitaSize } from './index';

export type MenuCategoryType =
  | 'todos'
  | 'fit'
  | 'fit_premium'
  | 'proteinas'
  | 'carboidratos'
  | 'vegetais'
  | 'saladas'
  | 'extras'
  | 'bebidas'
  | 'combos'
  | 'sobremesas'
  | 'mais_pedidos'
  | 'novidades'
  | 'promocoes'
  | 'favoritos'
  | string;

export interface NutritionalInfo {
  calories: number;
  protein_grams: number;
  carbohydrate_grams: number;
  fat_grams: number;
  fiber_grams: number;
  sodium_mg: number;
}

export interface ProductPhotoConfig {
  main?: string;
  size350g?: string;
  size500g?: string;
  composition?: string;
  additional?: string[];
  isOfficial?: boolean;
  isImmutable?: boolean;
}

export interface FoodProduct {
  id: string;
  name: string;
  description: string;
  category: string; // e.g. 'proteinas', 'prato_pronto', 'combos'
  line: MarmitaCategory; // 'fit' | 'fit_premium'
  availableSizes: MarmitaSize[];
  defaultSize: MarmitaSize;
  image?: string;
  imageUrl?: string;
  primaryImageAssetId?: string | null;
  assetName?: string;
  photos?: ProductPhotoConfig;
  ingredients: string[];
  protein: string;
  carbohydrate: string;
  vegetables: string[];
  nutrition: NutritionalInfo;
  allergens: string[];
  tags: string[];
  points_earned: number;
  // Campos exclusivos do MERMI CONTROL
  cost?: number;
  margin?: number;
  stock?: number;
  availability: boolean;
  active: boolean;
  featured?: boolean;
  created_at: string;
  updated_at: string;
}

export interface CustomIngredientOption {
  id: string;
  name: string;
  type: 'proteina' | 'carboidrato' | 'vegetal' | 'adicional_pago';
  lineEligible?: MarmitaCategory | 'ambas'; // 'fit', 'fit_premium' or 'ambas'
  extraPrice: number; // 0 for base ingredients; > 0 ONLY for adicionais pagos
  calories: number;
  protein_grams?: number;
  carbs_grams?: number;
  description?: string;
  available: boolean;
}

export interface CustomMarmitaItem {
  id: string;
  line: MarmitaCategory;
  size: MarmitaSize;
  protein: CustomIngredientOption;
  carbohydrate: CustomIngredientOption;
  vegetables: CustomIngredientOption[];
  paidAddons: CustomIngredientOption[];
  points_earned: number;
  basePrice: number;
  addonsPrice: number;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  customNotes?: string;
}

export interface CartItemProduct {
  id: string;
  isCustomMarmita: boolean;
  customMarmita?: CustomMarmitaItem;
  productId?: string;
  name: string;
  line: MarmitaCategory;
  size: MarmitaSize;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  points_earned: number;
  summary: string;
  image?: string;
}

export interface DeliveryAddress {
  id: string;
  recipientName: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  reference?: string;
  isDefault: boolean;
}

export interface CouponRule {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  validUntil: string;
  usageLimit: number;
  usageCount: number;
  eligibleLines?: ('fit' | 'fit_premium')[];
  active: boolean;
}

export type OrderStatus =
  | 'pedido_recebido'
  | 'pagamento_confirmado'
  | 'em_preparacao'
  | 'em_producao'
  | 'embalado'
  | 'saiu_para_entrega'
  | 'entregue'
  | 'cancelado'
  | 'pagamento_recusado'
  | 'problema_entrega';

export type PaymentMethod = 'pix' | 'cartao_credito' | 'cartao_debito' | 'mermi_points_resgate';

export interface OrderTimelineEvent {
  status: OrderStatus;
  label: string;
  description: string;
  timestamp: string;
  completed: boolean;
}

export interface OrderEntity {
  order_id: string;
  user_id: string;
  items: CartItemProduct[];
  subtotal: number;
  discount: number;
  delivery_fee: number;
  total: number;
  points_earned: number;
  points_used: number;
  coupon_id?: string;
  coupon_code?: string;
  address: DeliveryAddress;
  delivery_type: 'entrega' | 'retirada';
  estimated_delivery_time: string;
  payment_method: PaymentMethod;
  payment_status: 'pendente' | 'aprovado' | 'recusado' | 'estornado';
  order_status: OrderStatus;
  timeline: OrderTimelineEvent[];
  created_at: string;
  updated_at: string;
}
