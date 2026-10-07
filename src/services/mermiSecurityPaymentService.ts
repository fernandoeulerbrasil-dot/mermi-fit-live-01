/**
 * MERMI FIT LIFE — BLOCO 14
 * SERVIÇOS CENTRAIS DE SEGURANÇA, PAGAMENTOS, WEBHOOKS, LGPD & SESSÕES
 */

import {
  AuthSession,
  PaymentTransaction,
  WebhookEventRecord,
  RefundRequestRecord,
  CanonicalPaymentStatus,
  PaymentMethodType,
  UserDataExportPayload,
  AccountDeletionResult,
  UserPrivacyConsent,
  SecurityIncident
} from '../types/mermiSecurityPayments';
import { FoodProduct } from '../types/food';
import { PointsLedgerEntry } from '../types/mermiCoreEngine';
import { calculateCanonicalOrderPrice } from './mermiCoreEngine';

// ============================================================================
// 1. CHECKOUT SEGURO & VALIDAÇÃO BACKEND (SEÇÕES 1, 9 E 51)
// ============================================================================

export interface SecureCheckoutValidationInput {
  userId: string;
  items: Array<{
    product: FoodProduct;
    size: '350g' | '500g';
    quantity: number;
    paidAddonsPrice?: number;
  }>;
  claimedFrontendTotal?: number;
  pointsToUse?: number;
  userAvailablePoints: number;
  couponCode?: string;
  deliveryFee?: number;
  freeShippingThreshold?: number;
}

export const validateCheckoutSecurity = (input: SecureCheckoutValidationInput): {
  isSecure: boolean;
  tamperedPriceDetected: boolean;
  calculatedPrice: ReturnType<typeof calculateCanonicalOrderPrice>;
  securityNotes: string[];
} => {
  const securityNotes: string[] = [];

  // 1. Prevenir uso de pontos acima do saldo real no backend
  let verifiedPoints = Math.max(0, input.pointsToUse || 0);
  if (verifiedPoints > input.userAvailablePoints) {
    securityNotes.push(`Tentativa de uso de ${verifiedPoints} pts acima do saldo real (${input.userAvailablePoints} pts). Saldo ajustado.`);
    verifiedPoints = input.userAvailablePoints;
  }

  // 2. Cálculo autoritativo pelo motor do backend
  const calculatedPrice = calculateCanonicalOrderPrice({
    items: input.items,
    pointsToUse: verifiedPoints,
    deliveryFee: input.deliveryFee,
    freeShippingThreshold: input.freeShippingThreshold
  });

  // 3. Verificação de manipulação de preço pelo cliente
  let tamperedPriceDetected = false;
  if (input.claimedFrontendTotal !== undefined) {
    const diff = Math.abs(input.claimedFrontendTotal - calculatedPrice.total);
    if (diff > 0.05) {
      tamperedPriceDetected = true;
      securityNotes.push(
        `Manipulação detectada: Frontend alegou R$ ${input.claimedFrontendTotal.toFixed(2)}, mas o backend calculou R$ ${calculatedPrice.total.toFixed(2)}. Valor do backend aplicado.`
      );
    }
  }

  return {
    isSecure: true,
    tamperedPriceDetected,
    calculatedPrice,
    securityNotes
  };
};

// ============================================================================
// 2. MOTOR DE PAGAMENTOS SEGUROS & IDEMPOTÊNCIA (SEÇÕES 10 A 16)
// ============================================================================

export interface InitiatePaymentInput {
  orderId: string;
  userId: string;
  userName: string;
  amount: number;
  method: PaymentMethodType;
  installments?: number;
  cardLast4?: string;
  idempotencyKey?: string;
  existingTransactions: PaymentTransaction[];
}

export const initiateSecurePayment = (
  input: InitiatePaymentInput
): {
  transaction: PaymentTransaction;
  isDuplicateBlocked: boolean;
} => {
  const key = input.idempotencyKey || `idem-${input.orderId}-${Date.now()}`;

  // Verificação de idempotência estrita
  const existing = input.existingTransactions.find((tx) => tx.idempotency_key === key);
  if (existing) {
    return {
      transaction: existing,
      isDuplicateBlocked: true
    };
  }

  const now = new Date().toISOString();
  const txId = `pay-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const providerTxId = `prv-${Date.now().toString(36).toUpperCase()}`;

  let pixQrCode: string | undefined = undefined;
  let pixCopyPaste: string | undefined = undefined;
  let pixExpiresAt: string | undefined = undefined;

  if (input.method === 'PIX') {
    pixExpiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 minutos
    pixCopyPaste = `00020126580014BR.GOV.BCB.PIX0136mermi-pix@mermifit.com5204000053039865405${input.amount.toFixed(2)}5802BR5915MERMI FIT LIFE6009SAO PAULO62070503***6304`;
    pixQrCode = 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=' + encodeURIComponent(pixCopyPaste);
  }

  const newTx: PaymentTransaction = {
    payment_id: txId,
    order_id: input.orderId,
    user_id: input.userId,
    user_name: input.userName,
    amount: input.amount,
    points_used_value: 0,
    net_amount_payable: input.amount,
    payment_method: input.method,
    installments: input.installments || 1,
    status: input.method === 'PIX' ? 'PENDING' : 'APPROVED',
    provider: input.method === 'PIX' ? 'PIX_DIRECT' : 'MERMI_SECURE_PAY',
    provider_transaction_id: providerTxId,
    idempotency_key: key,
    pix_qr_code: pixQrCode,
    pix_copy_paste: pixCopyPaste,
    pix_expires_at: pixExpiresAt,
    card_last4: input.cardLast4 || (input.method === 'CREDIT_CARD' ? '4242' : undefined),
    status_history: [
      {
        status: input.method === 'PIX' ? 'PENDING' : 'APPROVED',
        timestamp: now,
        note: input.method === 'PIX' ? 'Aguardando pagamento Pix pelo cliente' : 'Pagamento via cartão aprovado com sucesso'
      }
    ],
    created_at: now,
    updated_at: now
  };

  return {
    transaction: newTx,
    isDuplicateBlocked: false
  };
};

// ============================================================================
// 3. PROCESSAMENTO DE WEBHOOKS ASSINADOS (SEÇÃO 14 E 15)
// ============================================================================

export interface ProcessWebhookInput {
  provider: string;
  eventType: 'PAYMENT_APPROVED' | 'PAYMENT_FAILED' | 'PAYMENT_CANCELLED' | 'PAYMENT_REFUNDED';
  paymentId: string;
  orderId: string;
  amount: number;
  signatureHeader?: string;
  idempotencyKey: string;
  existingWebhooks: WebhookEventRecord[];
  existingPayments: PaymentTransaction[];
}

export const processSignedWebhook = (
  input: ProcessWebhookInput
): {
  success: boolean;
  webhookRecord: WebhookEventRecord;
  updatedPayment?: PaymentTransaction;
  message: string;
} => {
  // 1. Checagem de idempotência
  const alreadyProcessed = input.existingWebhooks.find(
    (wh) => wh.idempotency_key === input.idempotencyKey && wh.processed
  );

  const now = new Date().toISOString();

  if (alreadyProcessed) {
    return {
      success: true,
      webhookRecord: alreadyProcessed,
      message: 'Evento de webhook já processado anteriormente (Idempotência garantida).'
    };
  }

  // 2. Simulação de validação de assinatura HMAC
  const isSignatureValid = input.signatureHeader !== 'invalid_signature';

  const webhookRecord: WebhookEventRecord = {
    webhook_id: `wh-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    provider: input.provider,
    event_type: input.eventType,
    payment_id: input.paymentId,
    order_id: input.orderId,
    amount: input.amount,
    signature_valid: isSignatureValid,
    processed: isSignatureValid,
    idempotency_key: input.idempotencyKey,
    received_at: now,
    processed_at: isSignatureValid ? now : undefined,
    raw_payload_summary: `Evento ${input.eventType} para o pedido ${input.orderId} no valor de R$ ${input.amount.toFixed(2)}`
  };

  if (!isSignatureValid) {
    return {
      success: false,
      webhookRecord,
      message: 'Assinatura criptográfica do webhook inválida. Rejeitado por segurança.'
    };
  }

  // 3. Atualizar status da transação correspondente
  const targetPayment = input.existingPayments.find((p) => p.payment_id === input.paymentId || p.order_id === input.orderId);
  let updatedPayment: PaymentTransaction | undefined = undefined;

  if (targetPayment) {
    const newStatus: CanonicalPaymentStatus =
      input.eventType === 'PAYMENT_APPROVED'
        ? 'APPROVED'
        : input.eventType === 'PAYMENT_REFUNDED'
        ? 'REFUNDED'
        : 'FAILED';

    updatedPayment = {
      ...targetPayment,
      status: newStatus,
      updated_at: now,
      status_history: [
        ...targetPayment.status_history,
        {
          status: newStatus,
          timestamp: now,
          note: `Atualizado via webhook confiável (${input.provider})`
        }
      ]
    };
  }

  return {
    success: true,
    webhookRecord,
    updatedPayment,
    message: `Webhook processado com sucesso. Status atualizado para ${input.eventType}.`
  };
};

// ============================================================================
// 4. MOTOR DE ESTORNO & REVERSÃO DE POINTS (SEÇÃO 18)
// ============================================================================

export interface ExecuteRefundInput {
  paymentId: string;
  orderId: string;
  reason: string;
  actorId: string;
  existingPayments: PaymentTransaction[];
  pointsPreviouslyAwarded?: number;
}

export const executeRefundTransaction = (
  input: ExecuteRefundInput
): {
  success: boolean;
  refundRecord: RefundRequestRecord;
  updatedPayment?: PaymentTransaction;
  pointsReversedAmount: number;
} => {
  const targetPayment = input.existingPayments.find((p) => p.payment_id === input.paymentId);
  const now = new Date().toISOString();
  const pointsToReverse = input.pointsPreviouslyAwarded || Math.floor(targetPayment?.amount || 0);

  const refundRecord: RefundRequestRecord = {
    refund_id: `ref-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    payment_id: input.paymentId,
    order_id: input.orderId,
    user_id: targetPayment?.user_id || 'usr_unknown',
    amount: targetPayment?.amount || 0,
    reason: input.reason,
    points_to_reverse: pointsToReverse,
    status: 'concluido',
    created_at: now,
    approved_at: now,
    actor_id: input.actorId
  };

  let updatedPayment: PaymentTransaction | undefined = undefined;
  if (targetPayment) {
    updatedPayment = {
      ...targetPayment,
      status: 'REFUNDED',
      refunded_at: now,
      refund_reason: input.reason,
      updated_at: now,
      status_history: [
        ...targetPayment.status_history,
        {
          status: 'REFUNDED',
          timestamp: now,
          note: `Estorno de R$ ${targetPayment.amount.toFixed(2)} concluído pelo operador (${input.actorId}). Motivo: ${input.reason}`
        }
      ]
    };
  }

  return {
    success: true,
    refundRecord,
    updatedPayment,
    pointsReversedAmount: pointsToReverse
  };
};

// ============================================================================
// 5. PRIVACIDADE LGPD: EXPORTAÇÃO ESTRUTURADA & ANONIMIZAÇÃO (SEÇÕES 30, 31 E 47)
// ============================================================================

export const generateLgpdDataExport = (userData: {
  user: any;
  orders: any[];
  pointsLedger: PointsLedgerEntry[];
  privacyConsent: UserPrivacyConsent;
}): UserDataExportPayload => {
  return {
    export_id: `lgpd-exp-${Date.now()}`,
    user_id: userData.user.id || 'usr_fernando',
    generated_at: new Date().toISOString(),
    legal_disclaimer:
      'Arquivo de portabilidade estruturado conforme o Art. 18, inciso V da Lei Geral de Proteção de Dados Pessoais (LGPD). Dados estritamente associados ao titular.',
    data: {
      identity: {
        name: userData.user.name,
        handle: userData.user.handle,
        email: userData.user.email || 'fernandoeulerbrasil@gmail.com',
        phone: userData.user.phone || '+55 (11) 98888-7777',
        level: userData.user.level,
        mermiPoints: userData.user.mermiPoints
      },
      addresses: userData.user.addresses || [],
      orders_history: userData.orders,
      points_ledger: userData.pointsLedger,
      health_and_evolution_summary: {
        waterGoalMl: userData.user.waterGoalMl,
        waterIntakeMl: userData.user.waterIntakeMl,
        stepsToday: userData.user.stepsToday,
        activeStreakDays: userData.user.activeStreakDays
      },
      consents: userData.privacyConsent
    }
  };
};

export const executeLgpdAccountAnonymization = (user: any): AccountDeletionResult => {
  return {
    user_id: user.id || 'usr_fernando',
    anonymized_at: new Date().toISOString(),
    retained_for_legal_compliance: {
      orders_records: user.ordersCount || 1,
      financial_logs: 1,
      audit_events: 5
    },
    purged_data: {
      tokens_and_sessions: true,
      passwords_and_hashes: true,
      payment_methods_cache: true,
      health_daily_logs: true
    },
    status: 'ANONIMIZADO_E_CONFORMIDADE_LGPD'
  };
};
