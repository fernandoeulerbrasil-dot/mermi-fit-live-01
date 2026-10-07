/**
 * MERMI FIT LIFE — BLOCO 13
 * NÚCLEO DE DADOS, RELACIONAMENTOS, REGRAS DE NEGÓCIO, PERMISSÕES E INTEGRIDADE
 */

// ============================================================================
// 1. RBAC — ROLES & PERMISSÕES GRANULARES
// ============================================================================

export type RoleType =
  | 'OWNER'
  | 'ADMIN'
  | 'MANAGER'
  | 'FINANCE'
  | 'CRM'
  | 'KITCHEN'
  | 'STOCK'
  | 'DELIVERY'
  | 'CONTENT'
  | 'MODERATOR'
  | 'SUPPORT'
  | 'CUSTOMER';

export type GranularPermission =
  // Usuários
  | 'users.view'
  | 'users.edit'
  | 'users.delete'
  // Pedidos
  | 'orders.view'
  | 'orders.create'
  | 'orders.edit'
  | 'orders.cancel'
  | 'orders.transition_state'
  // Produtos & Cardápio
  | 'products.view'
  | 'products.edit'
  // Preços
  | 'prices.view'
  | 'prices.edit'
  // Estoque & Insumos
  | 'inventory.view'
  | 'inventory.edit'
  | 'inventory.move'
  // Financeiro & DRE
  | 'finance.view'
  | 'finance.edit'
  // MerMi Points
  | 'points.view'
  | 'points.manage'
  | 'points.adjust'
  // Corridas & Eventos
  | 'runs.view'
  | 'runs.manage'
  // Campanhas & Comunicações
  | 'campaigns.view'
  | 'campaigns.manage'
  | 'campaigns.publish'
  // Assets & Mapeamento
  | 'assets.view'
  | 'assets.manage'
  // Comunidade
  | 'community.view'
  | 'community.moderate'
  // Relatórios
  | 'reports.view'
  // Configurações & Auditoria
  | 'settings.manage'
  | 'audit.view'
  | 'system.integrity_test'
  | 'system.backup';

export const ROLE_PERMISSIONS_MATRIX: Record<RoleType, GranularPermission[]> = {
  OWNER: [
    'users.view', 'users.edit', 'users.delete',
    'orders.view', 'orders.create', 'orders.edit', 'orders.cancel', 'orders.transition_state',
    'products.view', 'products.edit',
    'prices.view', 'prices.edit',
    'inventory.view', 'inventory.edit', 'inventory.move',
    'finance.view', 'finance.edit',
    'points.view', 'points.manage', 'points.adjust',
    'runs.view', 'runs.manage',
    'campaigns.view', 'campaigns.manage', 'campaigns.publish',
    'assets.view', 'assets.manage',
    'community.view', 'community.moderate',
    'reports.view',
    'settings.manage', 'audit.view', 'system.integrity_test', 'system.backup'
  ],
  ADMIN: [
    'users.view', 'users.edit',
    'orders.view', 'orders.create', 'orders.edit', 'orders.cancel', 'orders.transition_state',
    'products.view', 'products.edit',
    'prices.view', 'prices.edit',
    'inventory.view', 'inventory.edit', 'inventory.move',
    'finance.view',
    'points.view', 'points.manage',
    'runs.view', 'runs.manage',
    'campaigns.view', 'campaigns.manage', 'campaigns.publish',
    'assets.view', 'assets.manage',
    'community.view', 'community.moderate',
    'reports.view',
    'settings.manage', 'audit.view', 'system.integrity_test'
  ],
  MANAGER: [
    'users.view',
    'orders.view', 'orders.create', 'orders.edit', 'orders.transition_state',
    'products.view', 'products.edit',
    'prices.view',
    'inventory.view', 'inventory.move',
    'points.view',
    'runs.view',
    'campaigns.view',
    'community.view', 'community.moderate',
    'reports.view',
    'audit.view'
  ],
  FINANCE: [
    'orders.view',
    'prices.view', 'prices.edit',
    'finance.view', 'finance.edit',
    'inventory.view',
    'reports.view',
    'audit.view'
  ],
  CRM: [
    'users.view', 'users.edit',
    'orders.view',
    'points.view', 'points.manage',
    'campaigns.view', 'campaigns.manage',
    'community.view',
    'reports.view'
  ],
  KITCHEN: [
    'orders.view', 'orders.transition_state',
    'products.view',
    'inventory.view', 'inventory.move'
  ],
  STOCK: [
    'inventory.view', 'inventory.edit', 'inventory.move',
    'products.view'
  ],
  DELIVERY: [
    'orders.view', 'orders.transition_state'
  ],
  CONTENT: [
    'campaigns.view', 'campaigns.manage', 'campaigns.publish',
    'assets.view', 'assets.manage',
    'community.view'
  ],
  MODERATOR: [
    'community.view', 'community.moderate',
    'users.view'
  ],
  SUPPORT: [
    'users.view',
    'orders.view',
    'points.view',
    'community.view'
  ],
  CUSTOMER: [
    'orders.create',
    'community.view'
  ]
};

// ============================================================================
// 2. IDENTIDADE DO USUÁRIO & SEPARAÇÃO CONCEITUAL (SEÇÃO 3)
// ============================================================================

export interface UserIdentity {
  user_id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  birth_date?: string;
  status: 'ativo' | 'bloqueado' | 'pendente' | 'arquivado';
  role: RoleType;
  created_at: string;
  updated_at: string;
  last_login_at: string;
  deleted_at?: string | null;
}

export interface UserPreferencesData {
  language: 'pt-BR';
  theme: 'light' | 'dark' | 'auto';
  notifications_enabled: boolean;
  marketing_emails_allowed: boolean;
  health_sync_allowed: boolean;
  quiet_hours_start: string;
  quiet_hours_end: string;
}

export interface UserPermissionsData {
  role: RoleType;
  custom_granted: GranularPermission[];
  custom_revoked: GranularPermission[];
}

export interface UserBusinessData {
  customer_segment: 'novo' | 'ativo' | 'frequente' | 'inativo' | 'vip' | 'alto_ticket';
  lifetime_orders_count: number;
  lifetime_spent: number;
  average_ticket: number;
  first_order_date?: string;
  last_order_date?: string;
  points_balance: number;
  completed_challenges_count: number;
  participated_runs_count: number;
}

export interface CentralUserProfile {
  identity: UserIdentity;
  preferences: UserPreferencesData;
  permissions: UserPermissionsData;
  business: UserBusinessData;
}

// ============================================================================
// 3. PRODUTOS & HISTÓRICO DE PREÇOS (SEÇÕES 5 E 6)
// ============================================================================

export interface NutritionData {
  caloriesKcal: number;
  proteinG: number;
  carbsG: number;
  fatsG: number;
  sodiumMg: number;
}

export interface CentralProductEntity {
  product_id: string;
  name: string;
  description: string;
  category: 'fit' | 'fit_premium';
  subcategory: 'marmita' | 'combo' | 'snack' | 'bebida';
  type: 'pronto' | 'customizavel';
  menu_type: 'semanal' | 'fixo' | 'temporario';
  size: '350g' | '500g';
  current_price: number;
  estimated_cost: number;
  status: 'ativo' | 'inativo' | 'esgotado' | 'arquivado';
  availability: boolean;
  stock_control: boolean;
  nutrition_data: NutritionData;
  asset_id: string;
  points_earn_factor: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface PriceHistoryRecord {
  price_id: string;
  product_id: string;
  size: '350g' | '500g';
  price: number;
  valid_from: string;
  valid_until?: string | null;
  status: 'vigente' | 'encerrado' | 'agendado';
  created_by: string;
  created_at: string;
  notes?: string;
}

// ============================================================================
// 4. MÁQUINA DE ESTADOS DO PEDIDO & PEDIDOS (SEÇÕES 7, 27 E 28)
// ============================================================================

export type CanonicalOrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export const ORDER_VALID_TRANSITIONS: Record<CanonicalOrderStatus, CanonicalOrderStatus[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PREPARING', 'CANCELLED'],
  PREPARING: ['READY', 'CANCELLED'],
  READY: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: [], // Estado final
  CANCELLED: []  // Estado final
};

export interface OrderItemRecord {
  item_id: string;
  product_id: string;
  product_name: string;
  size: '350g' | '500g';
  quantity: number;
  unit_price: number;
  paid_addons_total: number;
  selected_custom_options?: string[];
  total_price: number;
}

export interface OrderPriceCalculationResult {
  subtotal: number;
  paid_addons: number;
  discount: number;
  shipping: number;
  fees: number;
  points_discount: number;
  points_used: number;
  coupon_discount: number;
  coupon_code?: string;
  total: number;
  points_earned: number;
  calculation_timestamp: string;
  calculation_source: 'SERVER_ENGINE';
}

export interface CentralOrderEntity {
  order_id: string;
  user_id: string;
  items: OrderItemRecord[];
  calculation: OrderPriceCalculationResult;
  payment_method: string;
  payment_status: 'pendente' | 'aprovado' | 'estornado' | 'falha';
  order_status: CanonicalOrderStatus;
  status_history: Array<{
    status: CanonicalOrderStatus;
    timestamp: string;
    actor_id: string;
    note?: string;
  }>;
  delivery_address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    zipCode: string;
  };
  idempotency_key: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

// ============================================================================
// 5. MERMI POINTS — LEDGER & TRANSAÇÕES IMUTÁVEIS (SEÇÃO 10)
// ============================================================================

export type PointsTransactionType =
  | 'COMPRA'
  | 'DESAFIO'
  | 'STREAK'
  | 'BONUS'
  | 'MERMI_RUN'
  | 'RESGATE_RECOMPENSA'
  | 'DESCONTO_PEDIDO'
  | 'EXPIRADO'
  | 'ESTORNO'
  | 'AJUSTE_AUDITADO';

export interface PointsLedgerEntry {
  entry_id: string;
  user_id: string;
  type: PointsTransactionType;
  amount: number; // Positivo para créditos, negativo para débitos
  balance_before: number;
  balance_after: number;
  reference_id: string; // ID do pedido, ID da corrida, ID da recompensa
  source: string;
  description: string;
  idempotency_key?: string;
  created_at: string;
  expires_at?: string | null;
}

export interface PointsAccount {
  user_id: string;
  current_balance: number; // Deve sempre bater com o somatório de ledger_entries
  total_earned_lifetime: number;
  total_spent_lifetime: number;
  last_transaction_at: string;
  updated_at: string;
}

// ============================================================================
// 6. ESTOQUE & MOVIMENTAÇÕES CONTROLADAS (SEÇÃO 12)
// ============================================================================

export type StockMovementType =
  | 'ENTRADA'
  | 'SAIDA'
  | 'PRODUCAO'
  | 'CONSUMO'
  | 'PERDA'
  | 'VENCIMENTO'
  | 'AJUSTE'
  | 'DEVOLUCAO';

export interface InventoryMovementRecord {
  movement_id: string;
  item_id: string;
  item_name: string;
  type: StockMovementType;
  quantity: number;
  unit: string;
  balance_before: number;
  balance_after: number;
  unit_cost: number;
  total_cost: number;
  batch_number?: string;
  reason: string;
  order_id?: string;
  actor_id: string;
  created_at: string;
}

// ============================================================================
// 7. IDEMPOTÊNCIA & PREVENÇÃO DE DUPLICIDADE (SEÇÃO 11)
// ============================================================================

export interface IdempotencyRecord {
  idempotency_key: string;
  operation_type:
    | 'CRIAR_PEDIDO'
    | 'PROCESSAR_PAGAMENTO'
    | 'RESGATE_RECOMPENSA'
    | 'CLAIM_DROP'
    | 'INSCRICAO_RUN'
    | 'APLICAR_CUPOM'
    | 'DEBITAR_POINTS';
  user_id: string;
  request_hash: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  response_payload?: any;
  created_at: string;
  expires_at: string;
}

// ============================================================================
// 8. AUDITORIA CENTRALIZADA (SEÇÃO 26)
// ============================================================================

export interface CanonicalAuditLog {
  log_id: string;
  actor_user_id: string;
  actor_name: string;
  actor_role: RoleType;
  action: string;
  entity_type:
    | 'PEDIDO'
    | 'PRECO'
    | 'PRODUTO'
    | 'POINTS'
    | 'ESTOQUE'
    | 'FINANCEIRO'
    | 'RECOMPENSA'
    | 'CAMPANHA'
    | 'PERMISSAO'
    | 'ASSET'
    | 'CUPOM'
    | 'RUN'
    | 'DESAFIO'
    | 'SISTEMA';
  entity_id: string;
  old_value?: any;
  new_value?: any;
  reason?: string;
  ip_address?: string;
  device_metadata?: string;
  timestamp: string;
}

// ============================================================================
// 9. EVENT BUS INTERNO (SEÇÃO 47)
// ============================================================================

export type SystemEventType =
  | 'ORDER_CREATED'
  | 'ORDER_PAID'
  | 'ORDER_PREPARING'
  | 'ORDER_SHIPPED'
  | 'ORDER_DELIVERED'
  | 'ORDER_CANCELLED'
  | 'POINTS_EARNED'
  | 'POINTS_REDEEMED'
  | 'REWARD_REDEEMED'
  | 'DROP_CLAIMED'
  | 'RUN_REGISTERED'
  | 'RUN_COMPLETED'
  | 'CHALLENGE_COMPLETED'
  | 'STREAK_INCREASED'
  | 'INVENTORY_LOW'
  | 'PRICE_CHANGED'
  | 'SECURITY_ALERT';

export interface SystemEventPayload {
  event_id: string;
  event_type: SystemEventType;
  entity_id: string;
  user_id?: string;
  payload: Record<string, any>;
  timestamp: string;
}

// ============================================================================
// 10. ERROS PADRONIZADOS DO SISTEMA (SEÇÃO 43)
// ============================================================================

export type CanonicalErrorCode =
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'INSUFFICIENT_POINTS'
  | 'INSUFFICIENT_STOCK'
  | 'INVALID_COUPON'
  | 'PAYMENT_ERROR'
  | 'DUPLICATE_OPERATION'
  | 'INVALID_STATE_TRANSITION'
  | 'SYSTEM_ERROR';

export class CanonicalAppError extends Error {
  code: CanonicalErrorCode;
  details?: any;

  constructor(code: CanonicalErrorCode, message: string, details?: any) {
    super(message);
    this.name = 'CanonicalAppError';
    this.code = code;
    this.details = details;
  }
}

// ============================================================================
// 11. RELATÓRIO DO TESTE DE INTEGRIDADE (SEÇÕES 57, 58 E 59)
// ============================================================================

export interface IntegrityCheckItem {
  id: string;
  category: 'AUTORIZACAO' | 'LEDGER_POINTS' | 'ESTOQUE' | 'PEDIDOS' | 'PRECOS' | 'ASSETS' | 'IDEMPOTENCIA';
  title: string;
  description: string;
  status: 'PASSED' | 'FAILED' | 'WARNING';
  details: string;
  execution_ms: number;
}

export interface IntegrityReportResult {
  executed_at: string;
  total_checks: number;
  passed_checks: number;
  failed_checks: number;
  checks: IntegrityCheckItem[];
  overall_status: 'INTEGRITY_100_PERCENT' | 'ISSUES_DETECTED';
}
