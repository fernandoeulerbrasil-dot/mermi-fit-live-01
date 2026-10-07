export type NotificationCategory =
  | 'PEDIDO'
  | 'PAGAMENTO'
  | 'ENTREGA'
  | 'POINTS'
  | 'RECOMPENSA'
  | 'GAMIFICACAO'
  | 'MERMI_RUN'
  | 'DESAFIOS'
  | 'COMUNIDADE'
  | 'SAUDE_BEM_ESTAR'
  | 'PROMOÇÃO'
  | 'CAMPANHA'
  | 'CONTEUDO'
  | 'SISTEMA';

export type NotificationType =
  | 'push'
  | 'in_app'
  | 'banner'
  | 'ai_message'
  | 'email'
  | 'whatsapp';

export type NotificationPriority = 'baixa' | 'normal' | 'alta' | 'urgente';

export type NotificationStatus =
  | 'pendente'
  | 'enviada'
  | 'entregue'
  | 'lida'
  | 'clicada'
  | 'arquivada'
  | 'falha';

export type NotificationActionType =
  | 'deep_link'
  | 'modal'
  | 'interactive'
  | 'external_url'
  | 'dismiss';

export type NotificationChannel = 'app' | 'push' | 'email' | 'whatsapp';

export type NotificationSource =
  | 'sistema'
  | 'automacao'
  | 'campanha'
  | 'admin'
  | 'mermi_ia';

export interface InteractiveActionOption {
  label: string;
  action_target: string;
  payload?: any;
  variant?: 'primary' | 'secondary' | 'neutral';
}

export interface AppNotification {
  notification_id: string;
  user_id: string;
  type: NotificationType;
  category: NotificationCategory;
  title: string;
  message: string;
  image_asset_id?: string;
  icon?: string;
  action_type: NotificationActionType;
  action_target: string; // e.g. 'pedidos', 'points', 'resgate', 'agua', 'drop_surpresa', etc.
  interactive_actions?: InteractiveActionOption[];
  metadata?: Record<string, any>;
  priority: NotificationPriority;
  status: NotificationStatus;
  created_at: string;
  scheduled_at?: string;
  read_at?: string;
  expires_at?: string;
  campaign_id?: string;
  source: NotificationSource;
  channel: NotificationChannel;
}

export interface NotificationPreferences {
  user_id: string;
  channels: {
    in_app: boolean;
    push: boolean;
    email: boolean;
    whatsapp: boolean;
  };
  categories: {
    pedidos: boolean;
    pagamentos: boolean;
    entregas: boolean;
    points: boolean;
    recompensas: boolean;
    gamificacao: boolean;
    mermi_run: boolean;
    desafios: boolean;
    comunidade: boolean;
    saude_bem_estar: boolean;
    promocoes: boolean;
    campanhas: boolean;
    conteudo: boolean;
    habitos: boolean;
    resumo_diario: boolean;
    resumo_semanal: boolean;
  };
  quiet_hours: {
    enabled: boolean;
    start: string; // e.g. "22:00"
    end: string;   // e.g. "07:00"
    days: number[]; // 0 = Domingo, 1 = Segunda, etc.
    allow_urgent: boolean; // Transacionais críticos (saída para entrega, pedido)
  };
}

export type AutomationTriggerEvent =
  | 'ORDER_CREATED'
  | 'PAYMENT_APPROVED'
  | 'ORDER_SHIPPED'
  | 'ORDER_DELIVERED'
  | 'POINTS_EARNED'
  | 'POINTS_REDEEMED'
  | 'POINTS_EXPIRING'
  | 'LEVEL_UP'
  | 'CHALLENGE_COMPLETED'
  | 'STREAK_MAINTAINED'
  | 'STREAK_LOST'
  | 'DROP_UNLOCKED'
  | 'RUN_REGISTERED'
  | 'RUN_REMINDER'
  | 'WATER_REMINDER'
  | 'SLEEP_REMINDER'
  | 'CART_ABANDONED'
  | 'CUSTOMER_INACTIVE'
  | 'NEW_PRODUCT'
  | 'COUPON_EXPIRING';

export type AutomationApprovalLevel = 1 | 2 | 3 | 4;

export interface AutomationCondition {
  field: string;
  operator: 'equals' | 'greater_than' | 'less_than' | 'contains' | 'days_since_greater_than';
  value: any;
}

export interface NotificationAutomation {
  automation_id: string;
  name: string;
  description: string;
  status: 'ativa' | 'pausada';
  trigger_event: AutomationTriggerEvent;
  conditions: AutomationCondition[];
  audience: string; // 'todos' | 'novos' | 'ativos' | 'inativos' | 'run' | 'carrinho_abandonado'
  channel: NotificationChannel;
  template_title: string;
  template_message: string;
  image_asset_id?: string;
  action_type: NotificationActionType;
  action_target: string;
  approval_level: AutomationApprovalLevel;
  priority: NotificationPriority;
  frequency_limit_hours: number; // Anti-spam interval
  created_at: string;
  updated_at: string;
  campaign_id?: string;
  metrics: {
    triggered_count: number;
    sent_count: number;
    opened_count: number;
    converted_count: number;
  };
}

export type SmartCampaignObjective =
  | 'venda'
  | 'lancamento'
  | 'promocao'
  | 'reativacao'
  | 'points'
  | 'gamificacao'
  | 'mermi_run'
  | 'desafio'
  | 'conteudo'
  | 'recompensa'
  | 'relacionamento'
  | 'carrinho_abandonado'
  | 'produto_especifico';

export interface SmartCampaign {
  campaign_id: string;
  name: string;
  description: string;
  objective: SmartCampaignObjective;
  audience_segment: string;
  status: 'rascunho' | 'agendada' | 'ativa' | 'pausada' | 'finalizada';
  channels: NotificationChannel[];
  title_template: string;
  message_template: string;
  image_asset_id?: string;
  deep_link: string;
  start_at: string;
  end_at?: string;
  approval_level: AutomationApprovalLevel;
  anti_spam_daily_limit: number;
  metrics: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    converted: number;
    attributed_revenue: number;
    points_used?: number;
    cupons_used?: number;
  };
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CartAbandonmentRecord {
  user_id: string;
  user_name: string;
  user_email: string;
  cart_items_count: number;
  cart_total_value: number;
  items_summary: string[];
  abandoned_at: string;
  recovery_notification_sent: boolean;
  recovered: boolean;
}

export interface NotificationTemplate {
  template_key: string;
  name: string;
  category: NotificationCategory;
  default_title: string;
  default_message: string;
  supported_variables: string[];
  suggested_action_target: string;
}

export interface NotificationProvider {
  name: string;
  sendPush: (notif: AppNotification) => Promise<boolean>;
  sendInApp: (notif: AppNotification) => Promise<boolean>;
  sendEmail?: (to: string, subject: string, body: string) => Promise<boolean>;
  sendWhatsApp?: (phone: string, text: string) => Promise<boolean>;
}

export interface NotificationAuditLog {
  id: string;
  action: 'create' | 'update' | 'pause' | 'activate' | 'test_send' | 'broadcast';
  entity_type: 'automation' | 'campaign' | 'notification' | 'preferences';
  entity_id: string;
  admin_user: string;
  details: string;
  timestamp: string;
}
