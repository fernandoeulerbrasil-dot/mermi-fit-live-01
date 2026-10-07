/**
 * MERMI FIT LIFE — API CLIENT CENTRAL
 * Comunica com o backend real do ecossistema via REST com Bearer Token.
 */

const TOKEN_STORAGE_KEY = 'mermi_auth_token_session';

class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        this.token = sessionStorage.getItem(TOKEN_STORAGE_KEY);
      } catch {
        this.token = null;
      }
    }
  }

  public setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      try {
        if (token) {
          sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
        } else {
          sessionStorage.removeItem(TOKEN_STORAGE_KEY);
        }
      } catch {
        // Ignora erro em iframes restritos
      }
    }
  }

  public getToken(): string | null {
    return this.token;
  }

  private async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {})
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(endpoint, {
      ...options,
      headers
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg = data?.error || `Erro HTTP ${response.status} ao comunicar com o servidor.`;
      throw new Error(errorMsg);
    }

    return data as T;
  }

  // --- 1. AUTENTICAÇÃO & OWNER ---
  public auth = {
    getOwnerStatus: () => this.request<{ hasOwner: boolean }>('/api/auth/owner-status'),

    setupFirstOwner: (body: { name: string; email: string; password: string }) =>
      this.request<{ success: boolean; message: string; user: any; token: string }>('/api/auth/setup-first-owner', {
        method: 'POST',
        body: JSON.stringify(body)
      }),

    login: (body: { email: string; password: string }) =>
      this.request<{ success: boolean; user: any; token: string }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(body)
      }),

    register: (body: { name: string; email: string; password: string }) =>
      this.request<{ success: boolean; user: any; token: string }>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(body)
      }),

    getMe: () => this.request<any>('/api/auth/me'),

    createStaff: (body: { name: string; email: string; password?: string; role: string }) =>
      this.request<{ success: boolean; message: string; user: any }>('/api/auth/create-staff', {
        method: 'POST',
        body: JSON.stringify(body)
      }),

    getUsers: () => this.request<{ users: any[] }>('/api/auth/users')
  };

  // --- 2. PRODUTOS & PREÇOS ---
  public products = {
    getProducts: () => this.request<{ products: any[]; basePrices: any }>('/api/products'),

    getPricing: () => this.request<{ basePrices: any; delivery: any }>('/api/products/pricing'),

    updatePricing: (body: { fit_350?: number; fit_500?: number; premium_350?: number; premium_500?: number; deliveryFee?: number; freeThreshold?: number }) =>
      this.request<{ success: boolean; message: string; basePrices: any }>('/api/products/pricing', {
        method: 'PUT',
        body: JSON.stringify(body)
      }),

    createProduct: (body: any) =>
      this.request<{ success: boolean; message: string; id: string }>('/api/products', {
        method: 'POST',
        body: JSON.stringify(body)
      }),

    linkImageAsset: (productId: string, assetId: string | null) =>
      this.request<{ success: boolean; message: string; product: any }>(`/api/products/${productId}/asset`, {
        method: 'PUT',
        body: JSON.stringify({ assetId })
      })
  };

  // --- 3. PEDIDOS ---
  public orders = {
    create: (body: { items: any[]; address: any; paymentMethod: string; couponCode?: string; notes?: string; pointsToUse?: number; deliveryType?: string }) =>
      this.request<{ success: boolean; message: string; orderId: string; subtotal: number; total: number; delivery_fee: number; discount: number; points_earned: number; order_status: string; payment_status: string }>('/api/orders', {
        method: 'POST',
        body: JSON.stringify(body)
      }),

    getById: (orderId: string) =>
      this.request<{ success: boolean; order: any; payment: any }>(`/api/orders/${orderId}`),

    getMyOrders: () => this.request<{ orders: any[] }>('/api/orders/my-orders'),

    getAllOrders: () => this.request<{ orders: any[] }>('/api/orders'),

    updateStatus: (orderId: string, status: string) =>
      this.request<{ success: boolean; message: string }>(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      }),

    cancel: (orderId: string, reason?: string) =>
      this.request<{ success: boolean; message: string }>(`/api/orders/${orderId}/cancel`, {
        method: 'POST',
        body: JSON.stringify({ reason })
      })
  };

  // --- 4. SISTEMA REAL DE PAGAMENTOS (MERCADO PAGO) ---
  public payments = {
    create: (body: {
      orderId: string;
      method: string;
      payer?: any;
      cardDetails?: any;
      idempotencyKey?: string;
      testScenario?: string;
    }) =>
      this.request<{
        success: boolean;
        message: string;
        reused?: boolean;
        payment: any;
        pix?: { qrCode: string; qrCodeBase64?: string; copyPaste: string; expiresAt: string; ticketUrl?: string };
        card?: { lastFour?: string; brand?: string; installments?: number };
      }>('/api/payments/create', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    getStatus: (paymentIdOrOrderId: string) =>
      this.request<{
        success: boolean;
        payment: any;
        order?: any;
      }>(`/api/payments/${paymentIdOrOrderId}/status`),

    getConfig: () =>
      this.request<{
        success: boolean;
        config: {
          gateway: string;
          environment: 'sandbox' | 'production';
          enabledMethods: { pix: boolean; creditCard: boolean; debitCard: boolean };
          webhookUrl: string;
          isConfigured: boolean;
          hasAccessToken: boolean;
          hasPublicKey: boolean;
          hasWebhookSecret: boolean;
          maskedPublicKey?: string;
          lastSyncAt?: string;
        };
      }>('/api/payments/config'),

    updateConfig: (body: {
      environment?: 'sandbox' | 'production';
      enabledMethods?: { pix?: boolean; creditCard?: boolean; debitCard?: boolean };
      credentials?: { accessToken?: string; publicKey?: string; webhookSecret?: string };
    }) =>
      this.request<{
        success: boolean;
        message: string;
        config: any;
      }>('/api/payments/config', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    getTransactions: () =>
      this.request<{ success: boolean; transactions: any[] }>('/api/payments/transactions'),

    getWebhooks: () =>
      this.request<{ success: boolean; logs: any[] }>('/api/payments/webhooks'),

    getRefunds: () =>
      this.request<{ success: boolean; refunds: any[] }>('/api/payments/refunds'),

    refund: (paymentId: string, body: { reason: string; amount?: number }) =>
      this.request<{
        success: boolean;
        message: string;
        refundId: string;
        orderId: string;
      }>(`/api/payments/${paymentId}/refund`, {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    simulateSandboxWebhook: (body: { paymentId?: string; orderId?: string; scenario: string }) =>
      this.request<{
        success: boolean;
        message: string;
        status: string;
        paymentId: string;
        orderId: string;
      }>('/api/payments/sandbox/simulate-webhook', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
  };

  // --- 5. POINTS & LEDGER ---
  public points = {
    getMyLedger: () => this.request<{ balance: number; entries: any[] }>('/api/points/my-ledger'),

    getUserLedger: (userId: string) => this.request<{ userId: string; balance: number; entries: any[] }>(`/api/points/user/${userId}`),

    adjustPoints: (body: { userId: string; amount: number; reason: string }) =>
      this.request<{ success: boolean; message: string; newBalance: number }>('/api/points/adjust', {
        method: 'POST',
        body: JSON.stringify(body)
      }),

    redeemReward: (body: { rewardId: string; rewardTitle?: string; pointsCost: number; idempotencyKey?: string }) =>
      this.request<{ success: boolean; message: string; newBalance: number; entries: any[] }>('/api/points/redeem', {
        method: 'POST',
        body: JSON.stringify(body)
      }),
  };

  // --- 6. OWNER ASSET MANAGER ---
  public assets = {
    getAll: () => this.request<{ assets: any[]; mappings: any[] }>('/api/assets'),

    getHistory: (assetId: string) => this.request<{ history: any[] }>(`/api/assets/${assetId}/history`),

    getUsage: (assetId: string) => this.request<{ assetId: string; usageCount: number; mappings: any[] }>(`/api/assets/${assetId}/usage`),

    upload: (fileName: string, fileBase64: string, mimeType?: string) =>
      this.request<{ success: boolean; fileUrl: string; storagePath: string; fileSize: number; mimeType: string }>('/api/assets/upload', {
        method: 'POST',
        body: JSON.stringify({ fileName, fileBase64, mimeType })
      }),

    create: (body: { name: string; description?: string; file_url: string; storage_path?: string; category: string; page?: string; component?: string; slot?: string; order_num?: number; status?: string; is_official?: boolean; mime_type?: string; file_size?: number }) =>
      this.request<{ success: boolean; message: string; asset_id: string; assetId?: string; file_url: string; fileUrl?: string; name?: string; category?: string; version: number }>('/api/assets', {
        method: 'POST',
        body: JSON.stringify(body)
      }),

    update: (assetId: string, body: { name?: string; description?: string; category?: string; page?: string; component?: string; status?: string; is_official?: boolean }) =>
      this.request<{ success: boolean; message: string; asset_id: string }>(`/api/assets/${assetId}`, {
        method: 'PUT',
        body: JSON.stringify(body)
      }),

    toggleStatus: (assetId: string, status: string) =>
      this.request<{ success: boolean; message: string; status: string }>(`/api/assets/${assetId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      }),

    replace: (assetId: string, body: { newFileUrl: string; newStoragePath?: string; reason?: string }) =>
      this.request<{ success: boolean; message: string; asset_id: string; version: number; file_url: string; affectedComponentsCount?: number }>(`/api/assets/${assetId}/replace`, {
        method: 'PUT',
        body: JSON.stringify(body)
      }),

    rollback: (assetId: string, targetVersion: number) =>
      this.request<{ success: boolean; message: string; file_url: string; version: number }>(`/api/assets/${assetId}/rollback`, {
        method: 'POST',
        body: JSON.stringify({ targetVersion })
      }),

    addMapping: (assetId: string, body: { page: string; component: string; slot?: string; order_num?: number; status?: string }) =>
      this.request<{ success: boolean; message: string; mapping_id: string }>(`/api/assets/${assetId}/mapping`, {
        method: 'POST',
        body: JSON.stringify(body)
      }),

    deleteMapping: (assetId: string, mappingId: string) =>
      this.request<{ success: boolean; message: string; mapping_id: string }>(`/api/assets/${assetId}/mapping/${mappingId}`, {
        method: 'DELETE'
      }),

    updateMapping: (assetId: string, body: { page: string; component: string; slot?: string }) =>
      this.request<{ success: boolean; message: string }>(`/api/assets/${assetId}/mapping`, {
        method: 'POST',
        body: JSON.stringify(body)
      }),

    delete: (assetId: string) =>
      this.request<{ success: boolean; message: string }>(`/api/assets/${assetId}`, {
        method: 'DELETE'
      })
  };

  // --- 7. MERMI IA VIA PROXY SEGURO NO BACKEND ---
  public ai = {
    chat: (question: string, conversationHistory?: any[]) =>
      this.request<{ text: string; role: string; timestamp: string }>('/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ question, conversationHistory })
      })
  };
}

export const apiClient = new ApiClient();
