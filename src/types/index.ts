export interface AssetRegistryItem {
  asset_id: string;
  nome: string;
  arquivo_original: string;
  caminho_real?: string;
  categoria: string;
  tipo?: string;
  subcategoria?: string;
  proporcao?: string;
  finalidade: string;
  pagina: string;
  componente: string;
  ordem: number;
  status: 'Ativo' | 'Em Uso' | 'Oficial' | 'Disponível' | 'Pendente' | 'ATIVO_OFICIAL';
  versao: string;
  oficial: true;
  editavel: false;
  imutavel: true;
  immutable?: true;
  origem?: string;
  descricao_visual: string;
  data_upload?: string;
  url_imagem?: string;
  arquivo_existe?: boolean;
}

export type MarmitaSize = '350g' | '500g';
export type MarmitaCategory = 'fit' | 'fit_premium';

export interface MarmitaPricing {
  category: MarmitaCategory;
  categoryName: string;
  size: MarmitaSize;
  price: number;
}

export interface CustomizationOption {
  id: string;
  name: string;
  category: 'proteina' | 'carboidrato' | 'legumes' | 'verduras' | 'sementes' | 'extras';
  extraPrice: number; // default 0; customization doesn't alter base price unless explicitly marked
  calories: number;
}

export interface MarmitaProduct {
  id: string;
  name: string;
  description: string;
  category: MarmitaCategory;
  baseCalories350g: number;
  baseProtein350g: number;
  baseCarbs350g: number;
  tags: string[];
}

export interface RewardItem {
  id: string;
  title: string;
  pointsCost: number;
  description: string;
  category: 'marmita' | 'desconto' | 'acessorio' | 'combo' | 'exclusivo';
  stock: number;
  imageHint: string;
  expiresInDays?: number;
}

export interface WeeklyMember {
  id: string;
  handle: string;
  name: string;
  points: number;
  ordersCount: number;
  statusText: string;
  weekPeriod: string;
  motivationMessage: string;
  photoUrl: string;
  isVerified: boolean;
  active?: boolean;
  published?: boolean;
  featuredOnHome?: boolean;
  benefits?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  email?: string;
  phone?: string;
  mermiPoints: number;
  level: number;
  nextLevelPoints: number;
  ordersCount: number;
  stepsToday: number;
  waterIntakeMl: number;
  waterGoalMl: number;
  sleepHours: string;
  activeStreakDays: number;
}

export interface RedemptionRecord {
  id: string;
  rewardId: string;
  rewardTitle: string;
  pointsSpent: number;
  date: string;
  code: string;
  status: 'Disponível' | 'Utilizado' | 'Enviado';
}

export interface MermiAiAction {
  id: string;
  label: string;
  type: 'navigate' | 'open_customize' | 'open_cart' | 'repeat_order' | 'quick_water' | 'confirm_action';
  tabTarget?: string;
  payload?: any;
  requiresConfirmation?: boolean;
  confirmationMessage?: string;
}

export interface MermiChatMessage {
  id: string;
  sender: 'user' | 'mermi_ia';
  text: string;
  timestamp: string;
  actions?: MermiAiAction[];
  pendingConfirmation?: {
    action: MermiAiAction;
    confirmed?: boolean;
  };
}

export interface IntelligenceMetric {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  impact: string;
}

export interface IntelligenceInsight {
  id: string;
  dado: string;
  analise: string;
  possivelCausa: string;
  sugestao: string;
  impactoEsperado: string;
}
