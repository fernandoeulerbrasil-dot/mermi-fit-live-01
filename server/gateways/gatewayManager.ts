import { IPaymentGateway, GatewayConfig, CreatePaymentInput, GatewayPaymentResult, RefundPaymentInput, GatewayRefundResult, WebhookVerificationResult } from './types';
import { MercadoPagoGateway } from './mercadopago';
import { Request } from 'express';

class GatewayManager {
  private gateways: Map<string, IPaymentGateway> = new Map();
  private activeGatewayName: string = 'mercadopago';
  private environment: 'sandbox' | 'production' = 'sandbox';
  private enabledMethods = {
    pix: true,
    creditCard: true,
    debitCard: false,
  };
  private lastSyncAt: string = new Date().toISOString();

  constructor() {
    const mp = new MercadoPagoGateway();
    this.gateways.set('mercadopago', mp);
    this.environment = mp.getEnvironment();
  }

  public getActiveGateway(): IPaymentGateway {
    const gw = this.gateways.get(this.activeGatewayName);
    if (!gw) {
      const defaultGw = this.gateways.get('mercadopago')!;
      return defaultGw;
    }
    return gw;
  }

  public setActiveGateway(name: string): boolean {
    if (this.gateways.has(name)) {
      this.activeGatewayName = name;
      return true;
    }
    return false;
  }

  public getEnvironment(): 'sandbox' | 'production' {
    return this.environment;
  }

  public setEnvironment(env: 'sandbox' | 'production'): void {
    this.environment = env;
    for (const gw of this.gateways.values()) {
      if ('setEnvironment' in gw && typeof (gw as any).setEnvironment === 'function') {
        (gw as any).setEnvironment(env);
      }
    }
    this.lastSyncAt = new Date().toISOString();
  }

  public setEnabledMethods(methods: { pix?: boolean; creditCard?: boolean; debitCard?: boolean }): void {
    if (methods.pix !== undefined) this.enabledMethods.pix = Boolean(methods.pix);
    if (methods.creditCard !== undefined) this.enabledMethods.creditCard = Boolean(methods.creditCard);
    if (methods.debitCard !== undefined) this.enabledMethods.debitCard = Boolean(methods.debitCard);
    this.lastSyncAt = new Date().toISOString();
  }

  public getEnabledMethods() {
    return { ...this.enabledMethods };
  }

  public updateCredentials(gatewayName: string, creds: {
    accessToken?: string;
    publicKey?: string;
    webhookSecret?: string;
    environment?: 'sandbox' | 'production';
  }): void {
    const gw = this.gateways.get(gatewayName);
    if (gw && 'setCredentials' in gw && typeof (gw as any).setCredentials === 'function') {
      (gw as any).setCredentials(creds);
    }
    if (creds.environment) {
      this.environment = creds.environment;
    }
    this.lastSyncAt = new Date().toISOString();
  }

  /**
   * Retorna a configuração segura para o Painel Administrativo MERMI CONTROL
   * REGRA 1 & 2: "NÃO mostrar tokens secretos na interface."
   */
  public getConfig(baseUrl?: string): GatewayConfig {
    const gw = this.getActiveGateway();
    const appUrl = baseUrl || process.env.APP_URL || 'https://mermifitlife.com.br';
    const webhookUrl = `${appUrl}/api/payments/webhook`;

    let maskedPublicKey = '';
    let hasAccessToken = false;
    let hasWebhookSecret = false;

    if (gw instanceof MercadoPagoGateway) {
      maskedPublicKey = gw.getMaskedPublicKey();
      hasAccessToken = gw.hasAccessToken();
      hasWebhookSecret = gw.hasWebhookSecret();
    }

    return {
      gateway: this.activeGatewayName,
      environment: this.environment,
      enabledMethods: { ...this.enabledMethods },
      webhookUrl,
      isConfigured: gw.isConfigured() || this.environment === 'sandbox',
      hasAccessToken,
      hasPublicKey: Boolean(maskedPublicKey),
      hasWebhookSecret,
      maskedPublicKey,
      lastSyncAt: this.lastSyncAt,
    };
  }

  public async createPayment(input: CreatePaymentInput): Promise<GatewayPaymentResult> {
    const gw = this.getActiveGateway();
    return await gw.createPayment(input);
  }

  public async getPayment(gatewayPaymentId: string): Promise<GatewayPaymentResult> {
    const gw = this.getActiveGateway();
    return await gw.getPayment(gatewayPaymentId);
  }

  public async refundPayment(input: RefundPaymentInput): Promise<GatewayRefundResult> {
    const gw = this.getActiveGateway();
    return await gw.refundPayment(input);
  }

  public async cancelPayment(gatewayPaymentId: string): Promise<{ success: boolean; status: any }> {
    const gw = this.getActiveGateway();
    return await gw.cancelPayment(gatewayPaymentId);
  }

  public async verifyWebhook(req: Request): Promise<WebhookVerificationResult> {
    const gw = this.getActiveGateway();
    return await gw.verifyWebhook(req);
  }
}

export const gatewayManager = new GatewayManager();
