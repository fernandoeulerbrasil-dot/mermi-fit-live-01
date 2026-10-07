/**
 * MERMI FIT LIFE — BLOCO 14
 * SEED DATA & INITIAL REPOSITORIES FOR SECURITY, PAYMENTS, WEBHOOKS & POLICIES
 */

import {
  AuthSession,
  ExternalIntegrationConfig,
  LegalPolicy,
  PaymentTransaction,
  SecurityIncident,
  UserPrivacyConsent,
  WebhookEventRecord
} from '../types/mermiSecurityPayments';

export const INITIAL_LEGAL_POLICIES: LegalPolicy[] = [
  {
    policy_id: 'pol-termos-uso-v2',
    version: '2.1.0',
    title: 'Termos de Uso do Ecossistema MERMI FIT LIFE',
    category: 'TERMOS_USO',
    summary: 'Regras de utilização do aplicativo, pedidos, cardápio, entregas e conduta na comunidade.',
    content: `TERMOS DE USO — MERMI FIT LIFE (Versão 2.1.0)
1. ACEITAÇÃO: Ao acessar ou utilizar o aplicativo MERMI FIT LIFE, o usuário concorda com estes termos em sua totalidade.
2. OBJETO: O aplicativo fornece serviço de pedidos de alimentação saudável, acompanhamento de hábitos saudáveis, programa de fidelidade MerMi Points e eventos MERMI RUN.
3. CONTA E SEGURANÇA: O usuário é o único responsável pela guarda e confidencialidade de suas credenciais de acesso.
4. PEDIDOS E PREÇOS: Todos os preços são calculados pelo servidor no momento do checkout, prevalecendo os valores vigentes da tabela oficial.
5. PROPRIEDADE INTELECTUAL: Todos os logos, ilustrações, marcas e a personagem oficial MerMi IA são propriedade exclusiva e imutável da MERMI FIT LIFE.`,
    published_at: '2026-01-15T00:00:00Z',
    status: 'vigente',
    mandatory_acceptance: true
  },
  {
    policy_id: 'pol-lgpd-privacidade-v2',
    version: '2.1.0',
    title: 'Política de Privacidade & Proteção de Dados (LGPD)',
    category: 'PRIVACIDADE_LGPD',
    summary: 'Compromisso com a Lei Geral de Proteção de Dados (Lei 13.709/2018), finalidade, tratamento de dados de saúde e direitos do titular.',
    content: `POLÍTICA DE PRIVACIDADE E PROTEÇÃO DE DADOS — MERMI FIT LIFE
1. BASE LEGAL & PRINCÍPIOS: O tratamento de dados pessoais baseia-se nos princípios de finalidade, necessidade, adequação, transparência e segurança previstos na LGPD.
2. DADOS COLETADOS:
   - Dados cadastrais: nome, e-mail, telefone e endereços de entrega.
   - Dados de saúde e bem-estar (opcionais com consentimento): consumo hídrico, registro de sono, passos e hábitos diários para suporte ao estilo de vida do usuário (sem finalidade de diagnóstico médico).
3. DIREITOS DO TITULAR: O titular pode a qualquer momento exportar seus dados em formato estruturado (JSON), revogar consentimentos específicos ou solicitar anonimização da conta.
4. RETENÇÃO OBRIGATÓRIA: Registros fiscais de pedidos e transações financeiras são mantidos pelo prazo prescricional legalmente exigido pelo Código Civil e legislação tributária.`,
    published_at: '2026-01-15T00:00:00Z',
    status: 'vigente',
    mandatory_acceptance: true
  },
  {
    policy_id: 'pol-reembolso-cancelamento-v1',
    version: '1.4.0',
    title: 'Política Oficial de Cancelamento e Reembolso',
    category: 'CANCELAMENTO_REEMBOLSO',
    summary: 'Procedimentos para estornos, cancelamento antes da produção e reversão contábil de pontos.',
    content: `POLÍTICA DE CANCELAMENTO E REEMBOLSO — MERMI FIT LIFE
1. PRAZO DE CANCELAMENTO: O cliente pode cancelar o pedido sem custo enquanto o mesmo estiver nos status 'PENDING' ou 'CONFIRMED' (antes do início do preparo na cozinha).
2. PROCESSAMENTO DO ESTORNO:
   - Pagamentos via Pix: estorno processado em até 2 horas úteis para a mesma chave de origem.
   - Cartão de Crédito: solicitação enviada à adquirente em até 1 dia útil, refletindo na fatura conforme regras da operadora.
3. REVERSÃO DE MERMI POINTS: Quaisquer pontos concedidos pelo pedido cancelado serão debitados no Points Ledger com histórico auditado. Pontos utilizados como desconto serão integralmente devolvidos ao saldo do usuário.`,
    published_at: '2026-02-01T00:00:00Z',
    status: 'vigente',
    mandatory_acceptance: true
  },
  {
    policy_id: 'pol-regras-points-v2',
    version: '2.0.0',
    title: 'Regulamento do Programa MerMi Points & Resgates',
    category: 'REGRAS_POINTS',
    summary: 'Regras de acúmulo contábil, validade, paridade e limites de desconto no checkout.',
    content: `REGULAMENTO OFICIAL — MERMI POINTS
1. ACÚMULO: 1 MerMi Point concedido a cada R$ 1,00 pago em marmitas e produtos fit após confirmação do pagamento.
2. PARIDADE & UTILIZAÇÃO: 100 MerMi Points = R$ 1,00 de desconto no checkout, limitado a 30% do valor dos itens do pedido.
3. LEDGER IMUTÁVEL: Todo crédito e débito é registrado em livro-razão imutável com verificação de saldo não-negativo.
4. VALIDADE: Pontos expiram em 365 dias caso não haja movimentação na conta do titular.`,
    published_at: '2026-02-10T00:00:00Z',
    status: 'vigente',
    mandatory_acceptance: false
  },
  {
    policy_id: 'pol-regulamento-run-v1',
    version: '1.2.0',
    title: 'Regulamento Oficial do Circuito MERMI RUN',
    category: 'REGULAMENTO_RUN',
    summary: 'Normas de inscrição, retirada de kits, check-in, segurança médica e pontuação no ranking.',
    content: `REGULAMENTO OFICIAL — CIRCUITO MERMI RUN
1. INSCRIÇÕES: Inscrições pessoais e intransferíveis via checkout oficial.
2. RETIRADA DE KITS: Exibição obrigatória de documento com foto ou QR Code do app.
3. SAÚDE DO ATLETA: O participante declara estar em plenas condições físicas e de saúde para a prática desportiva.
4. CRONOMETRAGEM & CERTIFICADOS: Tempos validados pela organização com emissão de certificado digital e pontuação no ranking público com opção de privacidade.`,
    published_at: '2026-03-01T00:00:00Z',
    status: 'vigente',
    mandatory_acceptance: false
  }
];

export const INITIAL_EXTERNAL_INTEGRATIONS: ExternalIntegrationConfig[] = [
  {
    integration_id: 'int-gateway-pagamentos',
    name: 'Gateway de Pagamentos Brasil (Pix & Cartão)',
    category: 'PAYMENT',
    provider_name: 'MerMi SecurePay / Pix Direct',
    status: 'ONLINE',
    mode: 'SANDBOX',
    latency_ms: 84,
    success_rate_percent: 99.8,
    timeout_ms: 8000,
    max_retry_attempts: 2,
    last_healthcheck: '2026-09-28T02:30:00Z',
    masked_endpoint: 'https://api.securepay.mermifit.com/v2/***',
    notes: 'Suporta emissão instantânea de QR Code Pix e autorização de cartão com antifraude'
  },
  {
    integration_id: 'int-webhooks-engine',
    name: 'Serviço de Webhooks Assinados',
    category: 'PAYMENT',
    provider_name: 'MerMi Event Broker',
    status: 'ONLINE',
    mode: 'SANDBOX',
    latency_ms: 42,
    success_rate_percent: 100.0,
    timeout_ms: 5000,
    max_retry_attempts: 3,
    last_healthcheck: '2026-09-28T02:35:00Z',
    masked_endpoint: 'https://webhook.mermifit.com/events/v1/***',
    notes: 'Validação de HMAC-SHA256 e fila de reprocessamento com idempotency_key'
  },
  {
    integration_id: 'int-delivery-routing',
    name: 'Roteirizador & Gestão de Entregas',
    category: 'DELIVERY',
    provider_name: 'MerMi Express Fleet',
    status: 'ONLINE',
    mode: 'PRODUCTION',
    latency_ms: 120,
    success_rate_percent: 99.1,
    timeout_ms: 10000,
    max_retry_attempts: 2,
    last_healthcheck: '2026-09-28T02:20:00Z',
    masked_endpoint: 'https://fleet.logistica.mermifit.com/dispatch/***',
    notes: 'Cálculo de rotas térmicas para marmitas congeladas e frescas'
  },
  {
    integration_id: 'int-push-notifications',
    name: 'Motor de Notificações Push & Transacionais',
    category: 'NOTIFICATIONS',
    provider_name: 'WebPush & In-App Engine',
    status: 'ONLINE',
    mode: 'PRODUCTION',
    latency_ms: 65,
    success_rate_percent: 99.9,
    timeout_ms: 4000,
    max_retry_attempts: 2,
    last_healthcheck: '2026-09-28T02:40:00Z',
    masked_endpoint: 'https://fcm.googleapis.com/v1/projects/***',
    notes: 'Entrega de avisos de pedidos, streaks e campanhas segmentadas'
  },
  {
    integration_id: 'int-health-sync',
    name: 'Sincronizador de Dispositivos e Bem-Estar',
    category: 'HEALTH_SYNC',
    provider_name: 'Apple Health / Google Fit / Garmin Hub',
    status: 'ATENÇÃO',
    mode: 'SANDBOX',
    latency_ms: 240,
    success_rate_percent: 96.5,
    timeout_ms: 12000,
    max_retry_attempts: 3,
    last_healthcheck: '2026-09-28T02:15:00Z',
    masked_endpoint: 'https://healthhub.mermifit.com/v1/sync/***',
    notes: 'Latência pontual na sincronização de passos de wearables em background'
  }
];

export const INITIAL_AUTH_SESSIONS: AuthSession[] = [
  {
    session_id: 'sess-current-01',
    user_id: 'usr_fernando',
    user_name: 'Fernando Brasil (OWNER)',
    device_info: 'Chrome 128 / macOS Desktop',
    platform: 'web',
    ip_masked: '189.102.***.45',
    location_approx: 'São Paulo, SP - Brasil',
    status: 'active',
    created_at: '2026-09-28T01:30:00Z',
    last_activity_at: '2026-09-28T02:40:00Z',
    expires_at: '2026-10-05T01:30:00Z'
  },
  {
    session_id: 'sess-mobile-02',
    user_id: 'usr_fernando',
    user_name: 'Fernando Brasil (OWNER)',
    device_info: 'MerMi App / iPhone 15 Pro',
    platform: 'ios',
    ip_masked: '177.68.***.12',
    location_approx: 'São Paulo, SP - Brasil',
    status: 'active',
    created_at: '2026-09-27T18:10:00Z',
    last_activity_at: '2026-09-27T22:45:00Z',
    expires_at: '2026-10-27T18:10:00Z'
  }
];

export const INITIAL_PAYMENT_TRANSACTIONS: PaymentTransaction[] = [
  {
    payment_id: 'pay-tx-1021',
    order_id: 'PED-1021',
    user_id: 'usr_fernando',
    user_name: 'Fernando Brasil',
    amount: 149.50,
    points_used_value: 0.00,
    net_amount_payable: 149.50,
    payment_method: 'PIX',
    installments: 1,
    status: 'APPROVED',
    provider: 'PIX_DIRECT',
    provider_transaction_id: 'E904128472026091014300000',
    idempotency_key: 'idem-pay-PED-1021',
    pix_qr_code: '00020126580014BR.GOV.BCB.PIX...',
    pix_copy_paste: '00020126580014BR.GOV.BCB.PIX0136mermi-pix@mermifit.com5204000053039865405149.505802BR',
    status_history: [
      { status: 'PENDING', timestamp: '2026-09-10T14:30:00Z', note: 'Cobrança Pix gerada pelo checkout' },
      { status: 'APPROVED', timestamp: '2026-09-10T14:31:05Z', note: 'Confirmação recebida via webhook oficial' }
    ],
    created_at: '2026-09-10T14:30:00Z',
    updated_at: '2026-09-10T14:31:05Z'
  },
  {
    payment_id: 'pay-tx-1022',
    order_id: 'PED-1022',
    user_id: 'usr-002',
    user_name: 'Mariana Silva',
    amount: 89.90,
    points_used_value: 10.00,
    net_amount_payable: 79.90,
    payment_method: 'CREDIT_CARD',
    installments: 1,
    status: 'APPROVED',
    provider: 'MERMI_SECURE_PAY',
    provider_transaction_id: 'ch_3N8eB72eZvKYlo2C1g9J4z8a',
    idempotency_key: 'idem-pay-PED-1022',
    card_last4: '4242',
    card_brand: 'Mastercard',
    status_history: [
      { status: 'PROCESSING', timestamp: '2026-09-12T11:15:00Z', note: 'Submetido à operadora com 3DS' },
      { status: 'APPROVED', timestamp: '2026-09-12T11:15:20Z', note: 'Captura autorizada sem contestação' }
    ],
    created_at: '2026-09-12T11:15:00Z',
    updated_at: '2026-09-12T11:15:20Z'
  }
];

export const INITIAL_WEBHOOK_EVENTS: WebhookEventRecord[] = [
  {
    webhook_id: 'wh-evt-001',
    provider: 'PIX_DIRECT',
    event_type: 'PAYMENT_APPROVED',
    payment_id: 'pay-tx-1021',
    order_id: 'PED-1021',
    amount: 149.50,
    signature_valid: true,
    processed: true,
    idempotency_key: 'idem-wh-E904128472026091014300000',
    received_at: '2026-09-10T14:31:05Z',
    processed_at: '2026-09-10T14:31:06Z',
    raw_payload_summary: 'Pix recebido Banco Central -> status: CONCLUIDA, endToEndId: E90412847...'
  },
  {
    webhook_id: 'wh-evt-002',
    provider: 'MERMI_SECURE_PAY',
    event_type: 'PAYMENT_APPROVED',
    payment_id: 'pay-tx-1022',
    order_id: 'PED-1022',
    amount: 79.90,
    signature_valid: true,
    processed: true,
    idempotency_key: 'idem-wh-ch_3N8eB72eZvKYlo2C1g9J4z8a',
    received_at: '2026-09-12T11:15:20Z',
    processed_at: '2026-09-12T11:15:21Z',
    raw_payload_summary: 'Cartão de crédito capturado -> tid: 8941249, authCode: 094182'
  }
];

export const INITIAL_SECURITY_INCIDENTS: SecurityIncident[] = [
  {
    incident_id: 'inc-001',
    type: 'COUPON_ABUSE_ATTEMPT',
    severity: 'BAIXA',
    actor_ip_masked: '177.135.***.89',
    actor_user_id: 'usr_anon_982',
    endpoint: '/api/v1/coupons/validate',
    description: 'Tentativa automatizada de brute-force de cupons promocionais bloqueada por rate limiting.',
    blocked_automatically: true,
    status: 'resolvido',
    timestamp: '2026-09-25T16:20:00Z'
  },
  {
    incident_id: 'inc-002',
    type: 'SUSPICIOUS_PAYMENT_REPETITION',
    severity: 'MEDIA',
    actor_ip_masked: '189.44.***.112',
    actor_user_id: 'usr_991',
    endpoint: '/api/v1/checkout/process',
    description: 'Três tentativas de checkout consecutivo com mesmo hash de cartão em menos de 10 segundos. Idempotência acionada.',
    blocked_automatically: true,
    status: 'resolvido',
    timestamp: '2026-09-26T19:40:00Z'
  }
];

export const INITIAL_USER_PRIVACY_CONSENT: UserPrivacyConsent = {
  user_id: 'usr_fernando',
  health_data_consent: true,
  activity_sync_consent: true,
  marketing_consent: true,
  geolocation_consent: true,
  crash_reporting_consent: true,
  last_updated_at: '2026-09-28T01:30:00Z',
  consent_version: '2.1.0'
};
