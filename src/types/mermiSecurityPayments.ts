/**
 * MERMI FIT LIFE — BLOCO 14
 * SEGURANÇA, AUTENTICAÇÃO, PAGAMENTOS, INTEGRAÇÕES EXTERNAS E PROTEÇÃO DE DADOS (LGPD)
 */

// ============================================================================
// 1. SESSÕES & AUTENTICAÇÃO SEGURA (SEÇÕES 2, 3, 4 E 5)
// ============================================================================

export interface AuthSession {
  session_id: string;
  user_id: string;
  user_name: string;
  device_info: string;
  platform: 'web' | 'mobile_web' | 'ios' | 'android';
  ip_masked: string;
  location_approx?: string;
  status: 'active' | 'revoked' | 'expired';
  created_at: string;
  last_activity_at: string;
  expires_at: string;
}

export interface PasswordResetRecord {
  request_id: string;
  email: string;
  token_hash: string;
  created_at: string;
  expires_at: string;
  status: 'pending' | 'used' | 'expired';
  used_at?: string;
}

// ============================================================================
// 2. PAGAMENTOS, WEBHOOKS & ESTORNO (SEÇÕES 10 A 18)
// ============================================================================

export type CanonicalPaymentStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'APPROVED'
  | 'FAILED'
  | 'CANCELLED'
  | 'REFUNDED'
  | 'PARTIALLY_REFUNDED';

export type PaymentMethodType =
  | 'PIX'
  | 'CREDIT_CARD'
  | 'POINTS_FULL'
  | 'CASH_ON_DELIVERY';

export interface PaymentTransaction {
  payment_id: string;
  order_id: string;
  user_id: string;
  user_name: string;
  amount: number;
  points_used_value: number;
  net_amount_payable: number;
  payment_method: PaymentMethodType;
  installments: number;
  status: CanonicalPaymentStatus;
  provider: string; // Ex: 'MERMI_PAY_BRASIL' / 'PIX_DIRECT' / 'GATEWAY_MOCK'
  provider_transaction_id: string;
  idempotency_key: string;
  pix_qr_code?: string;
  pix_copy_paste?: string;
  pix_expires_at?: string;
  card_last4?: string;
  card_brand?: string;
  status_history: Array<{
    status: CanonicalPaymentStatus;
    timestamp: string;
    note: string;
  }>;
  created_at: string;
  updated_at: string;
  refunded_at?: string;
  refund_reason?: string;
}

export interface WebhookEventRecord {
  webhook_id: string;
  provider: string;
  event_type:
    | 'PAYMENT_CREATED'
    | 'PAYMENT_APPROVED'
    | 'PAYMENT_FAILED'
    | 'PAYMENT_CANCELLED'
    | 'PAYMENT_REFUNDED';
  payment_id: string;
  order_id: string;
  amount: number;
  signature_valid: boolean;
  processed: boolean;
  idempotency_key: string;
  received_at: string;
  processed_at?: string;
  raw_payload_summary: string;
}

export interface RefundRequestRecord {
  refund_id: string;
  payment_id: string;
  order_id: string;
  user_id: string;
  amount: number;
  reason: string;
  points_to_reverse: number;
  status: 'solicitado' | 'processando' | 'concluido' | 'rejeitado';
  created_at: string;
  approved_at?: string;
  actor_id: string;
}

// ============================================================================
// 3. INTEGRAÇÕES EXTERNAS & HEALTHCHECK (SEÇÃO 24, 42, 54 E 55)
// ============================================================================

export type IntegrationCategory =
  | 'PAYMENT'
  | 'DELIVERY'
  | 'MAPS_GEO'
  | 'NOTIFICATIONS'
  | 'HEALTH_SYNC'
  | 'STORAGE'
  | 'ANALYTICS';

export interface ExternalIntegrationConfig {
  integration_id: string;
  name: string;
  category: IntegrationCategory;
  provider_name: string;
  status: 'ONLINE' | 'ATENÇÃO' | 'OFFLINE';
  mode: 'SANDBOX' | 'PRODUCTION';
  latency_ms: number;
  success_rate_percent: number;
  timeout_ms: number;
  max_retry_attempts: number;
  last_healthcheck: string;
  masked_endpoint: string;
  notes: string;
}

// ============================================================================
// 4. RATE LIMITING & INCIDENTES DE SEGURANÇA (SEÇÃO 21, 22 E 43)
// ============================================================================

export interface SecurityIncident {
  incident_id: string;
  type:
    | 'EXCESSIVE_LOGIN_FAILURES'
    | 'SUSPICIOUS_PAYMENT_REPETITION'
    | 'COUPON_ABUSE_ATTEMPT'
    | 'WEBHOOK_SIGNATURE_MISMATCH'
    | 'UNAUTHORIZED_ADMIN_ACCESS'
    | 'MALFORMED_REQUEST_PAYLOAD';
  severity: 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  actor_ip_masked: string;
  actor_user_id?: string;
  endpoint: string;
  description: string;
  blocked_automatically: boolean;
  status: 'investigando' | 'bloqueado' | 'resolvido' | 'falso_positivo';
  timestamp: string;
}

export interface RateLimitRule {
  endpoint: string;
  max_requests: number;
  window_seconds: number;
  block_duration_minutes: number;
}

// ============================================================================
// 5. PRIVACIDADE, LGPD & TERMOS VERSIONADOS (SEÇÕES 30, 31, 47, 48, 49 E 50)
// ============================================================================

export interface UserPrivacyConsent {
  user_id: string;
  health_data_consent: boolean;
  activity_sync_consent: boolean;
  marketing_consent: boolean;
  geolocation_consent: boolean;
  crash_reporting_consent: boolean;
  last_updated_at: string;
  consent_version: string;
}

export interface LegalPolicy {
  policy_id: string;
  version: string;
  title: string;
  category:
    | 'TERMOS_USO'
    | 'PRIVACIDADE_LGPD'
    | 'CANCELAMENTO_REEMBOLSO'
    | 'REGRAS_POINTS'
    | 'REGULAMENTO_RUN';
  summary: string;
  content: string;
  published_at: string;
  status: 'vigente' | 'arquivado';
  mandatory_acceptance: boolean;
}

export interface UserDataExportPayload {
  export_id: string;
  user_id: string;
  generated_at: string;
  legal_disclaimer: string;
  data: {
    identity: Record<string, any>;
    addresses: any[];
    orders_history: any[];
    points_ledger: any[];
    health_and_evolution_summary: Record<string, any>;
    consents: UserPrivacyConsent;
  };
}

export interface AccountDeletionResult {
  user_id: string;
  anonymized_at: string;
  retained_for_legal_compliance: {
    orders_records: number;
    financial_logs: number;
    audit_events: number;
  };
  purged_data: {
    tokens_and_sessions: boolean;
    passwords_and_hashes: boolean;
    payment_methods_cache: boolean;
    health_daily_logs: boolean;
  };
  status: 'ANONIMIZADO_E_CONFORMIDADE_LGPD';
}
