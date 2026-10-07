import { Request } from 'express';

export type PaymentMethodType = 'pix' | 'credit_card' | 'debit_card';

export type CanonicalPaymentStatus =
  | 'PAYMENT_PENDING'
  | 'PAYMENT_APPROVED'
  | 'PAYMENT_REJECTED'
  | 'PAYMENT_CANCELLED'
  | 'PAYMENT_EXPIRED'
  | 'PAYMENT_REFUNDED';

export type CanonicalOrderStatus =
  | 'PENDING_PAYMENT'
  | 'PAID'
  | 'PREPARING'
  | 'READY'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export interface PixDetails {
  qrCode: string;
  qrCodeBase64?: string;
  copyPaste: string;
  expiresAt: string;
  ticketUrl?: string;
}

export interface CardDetails {
  token?: string;
  lastFour?: string;
  brand?: string;
  installments?: number;
  holderName?: string;
  identificationNumber?: string;
}

export interface PayerInfo {
  email: string;
  name?: string;
  identification?: {
    type: string;
    number: string;
  };
}

export interface CreatePaymentInput {
  orderId: string;
  amount: number;
  currency?: string;
  method: PaymentMethodType;
  description: string;
  payer: PayerInfo;
  pixDetails?: {
    expiresInMinutes?: number;
  };
  cardDetails?: CardDetails;
  idempotencyKey?: string;
  testScenario?: 'APPROVED' | 'REJECTED' | 'PENDING' | 'CANCELLED' | 'EXPIRED';
}

export interface GatewayPaymentResult {
  success: boolean;
  gateway: string;
  gatewayPaymentId: string;
  externalReference: string;
  status: CanonicalPaymentStatus;
  statusDetail?: string;
  amount: number;
  currency: string;
  method: PaymentMethodType;
  environment: 'sandbox' | 'production';
  pix?: PixDetails;
  card?: {
    lastFour?: string;
    brand?: string;
    installments?: number;
  };
  rawResponse?: any;
  error?: string;
}

export interface RefundPaymentInput {
  paymentId: string;
  gatewayPaymentId?: string;
  orderId: string;
  amount?: number;
  reason?: string;
  requestedBy: {
    userId: string;
    userName: string;
  };
}

export interface GatewayRefundResult {
  success: boolean;
  gateway: string;
  refundId: string;
  paymentId: string;
  orderId: string;
  amount: number;
  status: 'APPROVED' | 'PENDING' | 'FAILED';
  createdAt: string;
  error?: string;
}

export interface WebhookVerificationResult {
  isValid: boolean;
  isTestEvent?: boolean;
  eventId: string;
  eventType: string;
  gatewayPaymentId?: string;
  orderId?: string;
  status?: CanonicalPaymentStatus;
  statusDetail?: string;
  amount?: number;
  rawPayload: any;
  error?: string;
}

export interface GatewayConfig {
  gateway: string;
  environment: 'sandbox' | 'production';
  enabledMethods: {
    pix: boolean;
    creditCard: boolean;
    debitCard: boolean;
  };
  webhookUrl: string;
  isConfigured: boolean;
  hasAccessToken: boolean;
  hasPublicKey: boolean;
  hasWebhookSecret: boolean;
  maskedPublicKey?: string;
  lastSyncAt?: string;
}

export interface IPaymentGateway {
  name: string;
  isConfigured(): boolean;
  getEnvironment(): 'sandbox' | 'production';
  createPayment(input: CreatePaymentInput): Promise<GatewayPaymentResult>;
  getPayment(gatewayPaymentId: string): Promise<GatewayPaymentResult>;
  refundPayment(input: RefundPaymentInput): Promise<GatewayRefundResult>;
  cancelPayment(gatewayPaymentId: string): Promise<{ success: boolean; status: CanonicalPaymentStatus }>;
  verifyWebhook(req: Request): Promise<WebhookVerificationResult>;
}
