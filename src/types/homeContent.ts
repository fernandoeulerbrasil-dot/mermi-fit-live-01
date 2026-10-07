export type BannerPriority = 'alta' | 'media' | 'baixa';
export type BannerAudience =
  | 'all'
  | 'new_users'
  | 'frequent'
  | 'challenge_active'
  | 'points_ready'
  | 'race_ready'
  | 'inactive';

export interface BannerItem {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  buttonText: string;
  destination: string;
  order: number;
  active: boolean;
  startDate?: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
  audience: BannerAudience;
  priority: BannerPriority;
  assetRefId?: string;
  assetPath?: string;
  visualTheme: 'green' | 'dark' | 'amber' | 'crimson' | 'emerald';
  imagePlaceholderTitle?: string;
}

export type PostCategory =
  | 'Alimentação'
  | 'Receitas'
  | 'Fitness'
  | 'Corrida'
  | 'Hidratação'
  | 'Sono'
  | 'Hábitos'
  | 'Motivação'
  | 'Lifestyle'
  | 'MerMi News';

export interface PostItem {
  id: string;
  title: string;
  text: string;
  category: PostCategory;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  date: string;
  readTimeMinutes?: number;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  savesCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  actionButtonText?: string;
  destination?: string;
  isFeatured?: boolean; // DESTAQUE (Home, Feed, Campanhas)
  status: 'published' | 'draft' | 'archived';
  order: number;
  tags: string[];
  assetRefId?: string;
  comments?: Array<{
    id: string;
    userName: string;
    userAvatar: string;
    text: string;
    timestamp: string;
  }>;
}

export type CampaignType =
  | 'PROMOÇÃO'
  | 'LANÇAMENTO'
  | 'POINTS'
  | 'CORRIDA'
  | 'DESAFIO'
  | 'CONTEÚDO'
  | 'PRODUTO'
  | 'COMUNIDADE'
  | 'INSTITUCIONAL';

export interface CampaignItem {
  id: string;
  name: string;
  title: string;
  description: string;
  cta: string;
  destination: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'scheduled' | 'expired' | 'paused';
  audience: BannerAudience;
  priority: BannerPriority;
  type: CampaignType;
  assetRefId?: string;
}

export interface PromotionOffer {
  id: string;
  name: string;
  description: string;
  originalPrice?: number;
  discountedPrice?: number;
  discountPercent?: number;
  pointsReward?: number;
  validity: string;
  badge?: string;
  buttonText: string;
  destination: string;
  active: boolean;
  order: number;
  category: 'marmita' | 'combo' | 'plano' | 'points';
}

export interface ContentArticle {
  id: string;
  title: string;
  subtitle: string;
  category: PostCategory;
  description: string;
  content: string[];
  author: string;
  date: string;
  readTime: string;
  status: 'published' | 'draft';
  order: number;
  tags: string[];
  featured?: boolean;
  assetRefId?: string;
  likes: number;
}

export type PublicationType =
  | 'post'
  | 'campanha'
  | 'promocao'
  | 'novidade'
  | 'aviso'
  | 'membro_semana'
  | 'evento'
  | 'mermi_run'
  | 'desafio'
  | 'produto_destaque';

export type PublicationDisplayFormat = 'banner' | 'card' | 'carrossel' | 'destaque';

export type PublicationStatus = 'published' | 'draft' | 'archived';

export interface ContentPublication {
  id: string;
  imagem: string;
  titulo: string;
  descricao: string;
  tipo: PublicationType;
  formato: PublicationDisplayFormat;
  botao: string;
  destino: string;
  ordem: number;
  status: PublicationStatus;
  dataInicial?: string;
  dataFinal?: string;
  publico: BannerAudience;
  ativo: boolean;
  badge?: string;
  autor?: string;
  likes?: number;
  precoDestaque?: string;
  beneficios?: string;
  visualTheme?: 'green' | 'dark' | 'amber' | 'crimson' | 'emerald' | 'blue';
}

export interface HomeBlockConfig {
  id: string;
  key:
    | 'greeting_header'
    | 'main_highlight'
    | 'posts_campanhas'
    | 'featured_products'
    | 'mermi_points'
    | 'quick_actions'
    | 'evolution_summary'
    | 'drop_surpresa'
    | 'mermi_ia'
    | 'active_challenge'
    // Legacy keys for backwards compatibility:
    | 'hero_carousel'
    | 'next_race'
    | 'promotions'
    | 'content_feed'
    | 'community';
  title: string;
  subtitle?: string;
  order: number;
  enabled: boolean;
}

export interface AnalyticsEvent {
  id: string;
  type:
    | 'banner_view'
    | 'banner_click'
    | 'post_view'
    | 'post_click'
    | 'campaign_view'
    | 'campaign_click'
    | 'promotion_view'
    | 'promotion_click'
    | 'content_view'
    | 'content_save'
    | 'content_share'
    | 'quick_action_click'
    | 'ai_click';
  targetId: string;
  targetTitle: string;
  timestamp: string;
  userId: string;
}

export type AudienceProfileType =
  | 'standard'
  | 'new_user'
  | 'frequent_user'
  | 'challenge_user'
  | 'points_ready_user'
  | 'race_user'
  | 'inactive_user';
