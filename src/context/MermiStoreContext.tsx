import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  MarmitaCategory,
  MarmitaPricing,
  MarmitaSize,
  RedemptionRecord,
  RewardItem,
  UserProfile,
  WeeklyMember
} from '../types';
import {
  DropClaimRecord,
  DropSurpresaItem
} from '../types/dropSurpresa';
import {
  INITIAL_PRICING
} from '../data/pricingConfig';
import {
  INITIAL_USER,
  INITIAL_WEEKLY_MEMBER,
  OFFICIAL_WEEKLY_REWARDS,
  INITIAL_DROPS_SURPRESA,
  INITIAL_DROP_CLAIMS
} from '../data/defaultData';
import {
  AnalyticsEvent,
  AudienceProfileType,
  BannerItem,
  CampaignItem,
  ContentArticle,
  ContentPublication,
  HomeBlockConfig,
  PostItem,
  PromotionOffer
} from '../types/homeContent';
import {
  INITIAL_ARTICLES,
  INITIAL_BANNERS,
  INITIAL_CAMPAIGNS,
  INITIAL_HOME_BLOCKS,
  INITIAL_POSTS,
  INITIAL_PROMOTIONS,
  INITIAL_PUBLICATIONS
} from '../data/initialHomeContent';
import {
  FoodProduct,
  CustomIngredientOption,
  CouponRule,
  DeliveryAddress,
  OrderEntity,
  OrderStatus,
  PaymentMethod,
  CartItemProduct
} from '../types/food';
import {
  MenuCategoryDef,
  OFFICIAL_MENU_CATEGORIES,
  OFFICIAL_FOOD_PRODUCTS,
  OFFICIAL_CUSTOM_INGREDIENTS,
  INITIAL_COUPONS,
  INITIAL_USER_ADDRESSES,
  INITIAL_ORDERS
} from '../data/menuData';
import { apiClient } from '../services/apiClient';
import {
  calculateOrderPrice,
  calculateMarmitaPrice,
  calculateMarmitaPoints,
  validateCoupon,
  getBasePrice as getPricingBasePrice
} from '../services/pricingService';
import {
  BadgeAchievement,
  EarningRuleConfig,
  GamificationMission,
  PointOrigin,
  PointsSummary,
  PointTransaction,
  PointTransactionType,
  StreakRecord,
  UserLevelConfig
} from '../types/gamification';
import {
  INITIAL_BADGES,
  INITIAL_EARNING_RULES,
  INITIAL_MISSIONS,
  INITIAL_STREAK,
  INITIAL_TRANSACTIONS,
  INITIAL_USER_LEVELS
} from '../data/initialGamificationData';
import {
  calculateOrderEligiblePoints,
  calculatePointsSummary,
  calculateUserLevel
} from '../services/gamificationService';
import {
  RaceEvent,
  RaceKitItem,
  RaceRegistration,
  VirtualChallengeProgress,
  RankingEntry,
  RankingDisplayPrivacy,
  ParticipantCheckInStatus,
  ShirtSize
} from '../types/mermiRun';
import {
  INITIAL_RACE_EVENTS,
  INITIAL_RACE_KITS,
  INITIAL_USER_REGISTRATIONS,
  INITIAL_VIRTUAL_CHALLENGES,
  INITIAL_LEADERBOARD
} from '../data/initialMermiRunData';
import {
  calculatePointsDiscount,
  formatTimeSeconds,
  calculatePace,
  formatRankingDisplayName,
  generateCertificateCode,
  calculateEventFinancialReport
} from '../services/mermiRunService';
import {
  WaterLog,
  WaterSettings,
  StepsLog,
  StepsSettings,
  SleepLog,
  SleepSettings,
  ActivityLog,
  HabitItem,
  HabitCompletion,
  EvolutionGoal,
  ConnectedDevice,
  BodyEvolutionLog,
  EvolutionAdminConfig,
  DataOrigin,
  DevicePlatformKey,
  DevicePermissions
} from '../types/evolution';
import {
  INITIAL_WATER_SETTINGS,
  INITIAL_WATER_LOGS,
  INITIAL_STEPS_SETTINGS,
  INITIAL_STEPS_LOGS,
  INITIAL_SLEEP_SETTINGS,
  INITIAL_SLEEP_LOGS,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_HABITS,
  INITIAL_HABIT_COMPLETIONS,
  INITIAL_EVOLUTION_GOALS,
  INITIAL_CONNECTED_DEVICES,
  INITIAL_BODY_EVOLUTION,
  INITIAL_EVOLUTION_ADMIN_CONFIG,
  TODAY_STR
} from '../data/initialEvolutionData';
import {
  calculateWaterStats,
  calculateStepsStats,
  calculateSleepStats,
  simulateDeviceSyncResult,
  calculateBedtimeDurationMinutes
} from '../services/evolutionService';
import {
  AdminRole,
  AdminUser,
  AuditLog,
  InventoryItem,
  ProductionPlanItem,
  CustomerCrmProfile,
  CampaignItem as CampaignAdminItem,
  BannerItem as BannerAdminItem,
  PostItem as PostAdminItem,
  NotificationAdminItem,
  MermiIntelligenceInsightFull,
  AdminAlert,
  SystemSettings
} from '../types/mermiControl';
import {
  INITIAL_ADMIN_USERS,
  INITIAL_INVENTORY,
  INITIAL_PRODUCTION_PLAN,
  INITIAL_CRM_CUSTOMERS,
  INITIAL_CAMPAIGNS as INITIAL_CAMPAIGNS_ADMIN,
  INITIAL_BANNERS as INITIAL_BANNERS_ADMIN,
  INITIAL_POSTS as INITIAL_POSTS_ADMIN,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_INTELLIGENCE_FULL_INSIGHTS,
  INITIAL_ADMIN_ALERTS,
  INITIAL_SYSTEM_SETTINGS
} from '../data/defaultMermiControlData';
import {
  Insumo,
  InsumoCostHistoryItem,
  StockMovement,
  FichaTecnica,
  Fornecedor,
  PedidoCompra,
  OrdemProducao,
  DesperdicioRegistro,
  TaxaPagamento,
  CustoOperacionalItem,
  DreGerencial,
  FinancialTimeFilter,
  ProdutoMargemItem,
  SugestaoCompraIA
} from '../types/mermiFinanceOperations';
import {
  INITIAL_INSUMOS,
  INITIAL_COST_HISTORY,
  INITIAL_FORNECEDORES,
  INITIAL_FICHAS_TECNICAS,
  INITIAL_COMPRAS,
  INITIAL_ORDENS_PRODUCAO,
  INITIAL_DESPERDICIOS,
  INITIAL_STOCK_MOVEMENTS,
  INITIAL_TAXAS_PAGAMENTO,
  INITIAL_CUSTOS_OPERACIONAIS
} from '../data/mermiFinanceOperationsData';
import {
  calculateDreGerencial,
  calculateProdutosMargem,
  calculateSugestoesCompraIA
} from '../services/mermiFinanceOperationsService';
import {
  AppNotification,
  NotificationPreferences,
  NotificationAutomation,
  SmartCampaign,
  CartAbandonmentRecord,
  NotificationTemplate,
  AutomationTriggerEvent
} from '../types/mermiNotifications';
import {
  INITIAL_USER_NOTIFICATIONS,
  INITIAL_USER_PREFERENCES,
  INITIAL_AUTOMATIONS,
  INITIAL_SMART_CAMPAIGNS,
  INITIAL_CART_ABANDONMENTS,
  INITIAL_NOTIFICATION_TEMPLATES
} from '../data/mermiNotificationsData';
import {
  formatTemplateVariables,
  shouldDeliverNotification,
  MermiInAppNotificationProvider
} from '../services/mermiNotificationService';
import {
  PointsLedgerEntry,
  PriceHistoryRecord,
  RoleType,
  GranularPermission,
  CanonicalOrderStatus,
  IntegrityReportResult
} from '../types/mermiCoreEngine';
import {
  INITIAL_PRICE_HISTORY,
  INITIAL_POINTS_LEDGER_ENTRIES
} from '../data/mermiCoreEngineData';
import {
  validateOrderStateTransition,
  hasGranularPermission,
  runFullSystemIntegrityCheck,
  exportSystemDataSnapshot
} from '../services/mermiCoreEngine';
import {
  LegalPolicy,
  ExternalIntegrationConfig,
  AuthSession,
  PaymentTransaction,
  WebhookEventRecord,
  SecurityIncident,
  UserPrivacyConsent,
  PaymentMethodType,
  AccountDeletionResult
} from '../types/mermiSecurityPayments';
import {
  INITIAL_LEGAL_POLICIES,
  INITIAL_EXTERNAL_INTEGRATIONS,
  INITIAL_AUTH_SESSIONS,
  INITIAL_PAYMENT_TRANSACTIONS,
  INITIAL_WEBHOOK_EVENTS,
  INITIAL_SECURITY_INCIDENTS,
  INITIAL_USER_PRIVACY_CONSENT
} from '../data/mermiSecurityPaymentsData';
import {
  initiateSecurePayment,
  processSignedWebhook,
  executeRefundTransaction,
  generateLgpdDataExport,
  executeLgpdAccountAnonymization
} from '../services/mermiSecurityPaymentService';

interface MermiStoreContextType {
  // Usuário
  user: UserProfile;
  setUserPoints: (points: number) => void;
  addPoints: (amount: number, reason: string) => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  
  // Membro da Semana (Dinâmico)
  weeklyMember: WeeklyMember;
  updateWeeklyMember: (updates: Partial<WeeklyMember>) => void;
  
  // Recompensas & Resgates da Semana
  rewards: RewardItem[];
  redemptions: RedemptionRecord[];
  redeemReward: (rewardId: string) => { success: boolean; message: string; record?: RedemptionRecord };
  
  // MERMI DROP SURPRESA (Gamificação Exclusiva)
  drops: DropSurpresaItem[];
  dropClaims: DropClaimRecord[];
  claimDrop: (dropId: string) => { success: boolean; message: string; reward?: string };
  createDrop: (newDrop: Omit<DropSurpresaItem, 'id' | 'quantityClaimed'>) => void;
  updateDrop: (id: string, updates: Partial<DropSurpresaItem>) => void;
  deleteDrop: (id: string) => void;
  toggleDropStatus: (id: string) => void;

  // Preços oficiais
  pricing: MarmitaPricing[];
  updatePrice: (category: MarmitaCategory, size: MarmitaSize, newPrice: number) => void;
  
  // Quick test switcher (demonstrando separação design x dados)
  presetPoints: (points: number) => void;
  resetToOfficialDefaults: () => void;
  
  // Feedback toast
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // --- BLOCO 03: HOME DINÂMICA & CONTEÚDO ---
  // Blocos da Home
  homeBlocks: HomeBlockConfig[];
  updateHomeBlocks: (blocks: HomeBlockConfig[]) => void;
  toggleHomeBlock: (id: string) => void;
  moveHomeBlock: (id: string, direction: 'up' | 'down') => void;

  // Banners
  banners: BannerItem[];
  addBanner: (banner: Omit<BannerItem, 'id'>) => void;
  updateBanner: (id: string, updates: Partial<BannerItem>) => void;
  deleteBanner: (id: string) => void;
  duplicateBanner: (id: string) => void;
  toggleBannerActive: (id: string) => void;
  reorderBanners: (orderedBanners: BannerItem[]) => void;

  // Campanhas
  campaigns: CampaignItem[];
  addCampaign: (campaign: Omit<CampaignItem, 'id'>) => void;
  updateCampaign: (id: string, updates: Partial<CampaignItem>) => void;
  deleteCampaign: (id: string) => void;

  // Promoções
  promotions: PromotionOffer[];
  updatePromotion: (id: string, updates: Partial<PromotionOffer>) => void;
  addPromotion: (promo: Omit<PromotionOffer, 'id'>) => void;
  deletePromotion: (id: string) => void;

  // Posts & Feed Social
  posts: PostItem[];
  togglePostLike: (postId: string) => void;
  togglePostSave: (postId: string) => void;
  addPostComment: (postId: string, text: string) => void;
  updatePost: (id: string, updates: Partial<PostItem>) => void;
  deletePost: (id: string) => void;
  createPost: (post: Omit<PostItem, 'id'>) => void;

  // Artigos & Conteúdo
  articles: ContentArticle[];
  updateArticle: (id: string, updates: Partial<ContentArticle>) => void;

  // --- POSTS & CAMPANHAS: CENTRO DE CONTEÚDO (AJUSTE FINAL HOME) ---
  publications: ContentPublication[];
  addPublication: (pub: Omit<ContentPublication, 'id'>) => void;
  updatePublication: (id: string, updates: Partial<ContentPublication>) => void;
  deletePublication: (id: string) => void;
  togglePublicationActive: (id: string) => void;

  // Simulação de Público / Perfil
  audienceProfile: AudienceProfileType;
  setAudienceProfile: (profile: AudienceProfileType) => void;

  // Analytics
  analyticsEvents: AnalyticsEvent[];
  trackEvent: (type: AnalyticsEvent['type'], targetId: string, targetTitle: string) => void;
  clearAnalytics: () => void;

  // --- BLOCO 04: CARDÁPIO + PERSONALIZAÇÃO + CARRINHO + PEDIDOS ---
  products: FoodProduct[];
  menuCategories: MenuCategoryDef[];
  customIngredients: CustomIngredientOption[];
  coupons: CouponRule[];
  appliedCoupon: CouponRule | null;
  cartItems: CartItemProduct[];
  orders: OrderEntity[];
  userAddresses: DeliveryAddress[];
  selectedAddress: DeliveryAddress;
  deliveryType: 'entrega' | 'retirada';
  deliveryFeeSetting: number;
  freeDeliveryThreshold: number;

  // Gestão de Produtos & Cardápio
  addProduct: (product: Omit<FoodProduct, 'id' | 'created_at' | 'updated_at'>) => void;
  updateProduct: (id: string, updates: Partial<FoodProduct>) => void;
  deleteProduct: (id: string) => void;
  toggleProductAvailability: (id: string) => void;
  toggleProductActive: (id: string) => void;
  refreshProducts: () => Promise<void>;
  linkProductImageAsset: (productId: string, assetId: string | null) => Promise<{ success: boolean; message: string }>;

  // Categorias do Cardápio (Administráveis)
  createMenuCategory: (cat: MenuCategoryDef) => void;
  updateMenuCategory: (id: string, updates: Partial<MenuCategoryDef>) => void;
  deleteMenuCategory: (id: string) => void;

  // Ingredientes para Personalização
  addCustomIngredient: (ing: Omit<CustomIngredientOption, 'id'>) => void;
  updateCustomIngredient: (id: string, updates: Partial<CustomIngredientOption>) => void;
  toggleIngredientAvailability: (id: string) => void;

  // Carrinho de Compras
  addToCart: (item: Omit<CartItemProduct, 'id'>) => void;
  updateCartQuantity: (id: string, delta: number) => void;
  removeCartItem: (id: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  setDeliveryType: (type: 'entrega' | 'retirada') => void;
  updateDeliverySettings: (fee: number, threshold: number) => void;

  // Endereços do Cliente
  addAddress: (addr: Omit<DeliveryAddress, 'id'>) => void;
  updateAddress: (id: string, updates: Partial<DeliveryAddress>) => void;
  deleteAddress: (id: string) => void;
  setSelectedAddress: (addr: DeliveryAddress) => void;

  // Pedidos, Status e Repetir Pedido
  createOrder: (orderData: { paymentMethod: PaymentMethod; notes?: string }) => { success: boolean; orderId?: string; message: string };
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  repeatOrder: (orderId: string) => { success: boolean; message: string };
  cancelOrder: (orderId: string, reason?: string) => void;

  // Gestão de Cupons (Mermi Control)
  createCoupon: (coupon: Omit<CouponRule, 'id' | 'usageCount'>) => void;
  updateCoupon: (id: string, updates: Partial<CouponRule>) => void;
  deleteCoupon: (id: string) => void;
  toggleCouponActive: (id: string) => void;

  // --- BLOCO 05: MERMI POINTS + GAMIFICAÇÃO + RECOMPENSAS ---
  transactions: PointTransaction[];
  earningRules: EarningRuleConfig[];
  userLevels: UserLevelConfig[];
  badges: BadgeAchievement[];
  missions: GamificationMission[];
  streak: StreakRecord;
  pointsSummary: PointsSummary;
  processedOrderIds: string[];

  // Operações Centrais de Pontos & Transações
  recordTransaction: (txData: {
    amount: number;
    type: PointTransactionType;
    origin: PointOrigin;
    description: string;
    referenceId?: string;
    adminResponsible?: string;
  }) => PointTransaction;
  adjustPointsAdmin: (amount: number, reason: string, adminName: string) => void;
  awardPointsByAction: (
    actionKey: string,
    details?: { referenceId?: string; customDescription?: string; multiplier?: number }
  ) => { success: boolean; pointsAwarded: number; message: string };

  // Regras de Ganho de Points (Configuráveis no Mermi Control)
  createEarningRule: (rule: Omit<EarningRuleConfig, 'id'>) => void;
  updateEarningRule: (id: string, updates: Partial<EarningRuleConfig>) => void;
  deleteEarningRule: (id: string) => void;
  toggleEarningRuleActive: (id: string) => void;

  // Níveis do Usuário (Configuráveis no Mermi Control)
  createUserLevel: (level: UserLevelConfig) => void;
  updateUserLevel: (levelNumber: number, updates: Partial<UserLevelConfig>) => void;
  deleteUserLevel: (levelNumber: number) => void;

  // Badges e Conquistas
  createBadge: (badge: Omit<BadgeAchievement, 'id'>) => void;
  updateBadge: (id: string, updates: Partial<BadgeAchievement>) => void;
  deleteBadge: (id: string) => void;
  unlockBadge: (badgeId: string) => { success: boolean; message: string };

  // Missões (Diárias, Semanais, Especiais)
  createMission: (mission: Omit<GamificationMission, 'id'>) => void;
  updateMission: (id: string, updates: Partial<GamificationMission>) => void;
  deleteMission: (id: string) => void;
  completeMission: (missionId: string) => { success: boolean; message: string };
  updateMissionProgress: (missionId: string, deltaProgress: number) => void;

  // Streak / Constância
  updateStreakDays: (newDays: number) => void;
  claimStreakMilestone: (days: number) => { success: boolean; message: string };

  // --- BLOCO 06: MERMI RUN (CORRIDAS, EVENTOS E EXPERIÊNCIAS) ---
  raceEvents: RaceEvent[];
  raceKits: RaceKitItem[];
  raceRegistrations: RaceRegistration[];
  virtualChallenges: VirtualChallengeProgress[];
  leaderboard: RankingEntry[];
  rankingPrivacy: RankingDisplayPrivacy;

  setRankingPrivacy: (privacy: RankingDisplayPrivacy) => void;
  createRaceEvent: (event: Omit<RaceEvent, 'id' | 'slug' | 'createdAt'>) => RaceEvent;
  updateRaceEvent: (id: string, updates: Partial<RaceEvent>) => void;
  deleteRaceEvent: (id: string) => void;
  createRaceKit: (kit: Omit<RaceKitItem, 'id'>) => void;
  updateRaceKit: (id: string, updates: Partial<RaceKitItem>) => void;
  deleteRaceKit: (id: string) => void;
  registerForRace: (registrationData: {
    eventId: string;
    categoryId: string;
    kitId: string;
    shirtSize?: ShirtSize;
    participantName: string;
    participantDocument: string;
    participantBirthDate?: string;
    participantEmail: string;
    participantPhone: string;
    pointsToUse?: number;
    paymentMethod: 'gratuito' | 'pix' | 'cartao' | 'dinheiro';
  }) => { success: boolean; registration?: RaceRegistration; message: string };
  checkInParticipant: (
    registrationId: string,
    status: ParticipantCheckInStatus,
    adminName?: string
  ) => { success: boolean; message: string; pointsAwarded?: number };
  recordRaceResult: (
    registrationId: string,
    resultData: {
      timeSeconds: number;
      overallRank?: number;
      categoryRank?: number;
      pointsAwarded?: number;
    }
  ) => { success: boolean; message: string };
  updateVirtualChallengeProgress: (
    challengeId: string,
    additionalKm: number
  ) => { success: boolean; message: string; completed?: boolean };
  claimVirtualChallengeReward: (challengeId: string) => { success: boolean; message: string };

  // --- BLOCO 07: SAÚDE, HIDRATAÇÃO, SONO, PASSOS, ATIVIDADES, HÁBITOS, METAS, DISPOSITIVOS & EVOLUÇÃO ---
  waterLogs: WaterLog[];
  waterSettings: WaterSettings;
  sleepLogs: SleepLog[];
  sleepSettings: SleepSettings;
  stepsLogs: StepsLog[];
  stepsSettings: StepsSettings;
  activityLogs: ActivityLog[];
  habits: HabitItem[];
  habitCompletions: HabitCompletion[];
  evolutionGoals: EvolutionGoal[];
  connectedDevices: ConnectedDevice[];
  bodyEvolutionLogs: BodyEvolutionLog[];
  evolutionAdminConfig: EvolutionAdminConfig;

  addWaterLog: (amountMl: number, origin?: DataOrigin) => { success: boolean; newTotal: number; pointsAwarded?: number };
  removeWaterLog: (id: string) => void;
  updateWaterSettings: (settings: Partial<WaterSettings>) => void;
  triggerWaterReminderTest: () => void;
  addSleepLog: (log: Omit<SleepLog, 'id'>) => { success: boolean; message: string; pointsAwarded?: number };
  updateSleepSettings: (settings: Partial<SleepSettings>) => void;
  addStepsLog: (count: number, date?: string, origin?: DataOrigin) => { success: boolean; pointsAwarded?: number };
  updateStepsSettings: (settings: Partial<StepsSettings>) => void;
  addActivityLog: (activity: Omit<ActivityLog, 'id'>) => { success: boolean; pointsAwarded?: number };
  deleteActivityLog: (id: string) => void;
  toggleHabitCompletion: (habitId: string, date?: string) => { completed: boolean; pointsAwarded?: number };
  createHabit: (habit: Omit<HabitItem, 'id' | 'streakDays' | 'createdAt'>) => void;
  updateHabit: (id: string, updates: Partial<HabitItem>) => void;
  deleteHabit: (id: string) => void;
  createEvolutionGoal: (goal: Omit<EvolutionGoal, 'id'>) => void;
  updateEvolutionGoal: (id: string, updates: Partial<EvolutionGoal>) => void;
  deleteEvolutionGoal: (id: string) => void;
  completeEvolutionGoal: (id: string) => { success: boolean; pointsAwarded: number };
  toggleDeviceConnection: (platformKey: DevicePlatformKey, connected: boolean) => void;
  updateDevicePermissions: (platformKey: DevicePlatformKey, permissions: Partial<DevicePermissions>) => void;
  syncDevice: (platformKey: DevicePlatformKey) => { success: boolean; message: string };
  addBodyEvolutionLog: (log: Omit<BodyEvolutionLog, 'id'>) => void;
  deleteBodyEvolutionLog: (id: string) => void;
  updateEvolutionAdminConfig: (updates: Partial<EvolutionAdminConfig>) => void;

  // --- BLOCO 10: MERMI CONTROL + MERMI INTELLIGENCE ---
  currentAdminUser: AdminUser;
  isAdminAuthenticated: boolean;
  setAdminAuthenticated: (auth: boolean) => void;
  setAdminUser: (user: AdminUser) => void;
  adminUsers: AdminUser[];
  loginAdmin: (userOrRole: AdminUser | AdminRole, pin?: string) => { success: boolean; message: string };
  logoutAdmin: () => void;
  switchAdminUser: (userId: string) => void;
  addAdminUser: (user: Omit<AdminUser, 'id'>) => void;
  updateAdminUser: (id: string, updates: Partial<AdminUser>) => void;
  deleteAdminUser: (id: string) => void;

  auditLogs: AuditLog[];
  addAuditLog: (action: string, entity: AuditLog['entity'], entityId: string, previousValue: string, newValue: string, reason?: string) => void;

  inventory: InventoryItem[];
  updateInventoryStock: (id: string, newStock: number) => void;
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: string) => void;

  productionPlan: ProductionPlanItem[];
  addProductionPlanItem: (item: Omit<ProductionPlanItem, 'id'>) => void;
  updateProductionPlanStatus: (id: string, status: ProductionPlanItem['status']) => void;
  deleteProductionPlanItem: (id: string) => void;

  crmCustomers: CustomerCrmProfile[];
  updateCrmCustomer: (id: string, updates: Partial<CustomerCrmProfile>) => void;
  addCrmCustomer: (customer: Omit<CustomerCrmProfile, 'id'>) => void;

  campaignsAdmin: CampaignAdminItem[];
  addCampaignAdmin: (campaign: Omit<CampaignAdminItem, 'id'>) => void;
  updateCampaignAdmin: (id: string, updates: Partial<CampaignAdminItem>) => void;
  deleteCampaignAdmin: (id: string) => void;

  bannersAdmin: BannerAdminItem[];
  addBannerAdmin: (banner: Omit<BannerAdminItem, 'id'>) => void;
  updateBannerAdmin: (id: string, updates: Partial<BannerAdminItem>) => void;
  deleteBannerAdmin: (id: string) => void;

  postsAdmin: PostAdminItem[];
  addPostAdmin: (post: Omit<PostAdminItem, 'id'>) => void;
  updatePostAdmin: (id: string, updates: Partial<PostAdminItem>) => void;
  deletePostAdmin: (id: string) => void;

  notificationsAdmin: NotificationAdminItem[];
  addNotificationAdmin: (notif: Omit<NotificationAdminItem, 'id'>) => void;
  updateNotificationAdmin: (id: string, updates: Partial<NotificationAdminItem>) => void;
  deleteNotificationAdmin: (id: string) => void;

  intelligenceInsightsFull: MermiIntelligenceInsightFull[];
  confirmHighImpactAction: (insightId: string) => { success: boolean; message: string };
  cancelHighImpactAction: (insightId: string) => void;
  adminAlerts: AdminAlert[];
  resolveAdminAlert: (id: string) => void;

  systemSettings: SystemSettings;
  updateSystemSettings: (updates: Partial<SystemSettings>) => void;

  // --- BLOCO 11: FINANCEIRO, ESTOQUE, PRODUÇÃO, COMPRAS, CUSTOS & MARGEM ---
  insumos: Insumo[];
  costHistory: InsumoCostHistoryItem[];
  stockMovements: StockMovement[];
  fichasTecnicas: FichaTecnica[];
  fornecedores: Fornecedor[];
  pedidosCompra: PedidoCompra[];
  ordensProducao: OrdemProducao[];
  desperdicios: DesperdicioRegistro[];
  taxasPagamento: TaxaPagamento[];
  custosOperacionais: CustoOperacionalItem[];
  realDeliveryCostSetting: number;

  addInsumo: (insumo: Omit<Insumo, 'id' | 'data_de_cadastro' | 'data_de_atualizacao'>) => void;
  updateInsumo: (id: string, updates: Partial<Insumo>) => void;
  deleteInsumo: (id: string) => void;
  adjustInsumoStock: (id: string, novaQtd: number, motivo: string, responsavel: string) => void;
  registerInsumoEntry: (
    insumoId: string,
    quantidade: number,
    custoUnitario: number,
    fornecedor: string,
    lote?: string,
    validade?: string,
    notaFiscal?: string,
    responsavel?: string
  ) => void;
  registerInsumoExit: (
    insumoId: string,
    quantidade: number,
    motivo: StockMovement['motivo'],
    responsavel: string,
    observacoes?: string
  ) => void;

  createFichaTecnica: (ft: Omit<FichaTecnica, 'id' | 'data_atualizacao'>) => void;
  updateFichaTecnica: (id: string, updates: Partial<FichaTecnica>) => void;
  deleteFichaTecnica: (id: string) => void;

  addFornecedor: (fornecedor: Omit<Fornecedor, 'id'>) => void;
  updateFornecedor: (id: string, updates: Partial<Fornecedor>) => void;
  deleteFornecedor: (id: string) => void;

  createPedidoCompra: (pedido: Omit<PedidoCompra, 'id'>) => void;
  updatePedidoCompraStatus: (id: string, status: PedidoCompra['status']) => void;
  deletePedidoCompra: (id: string) => void;

  createOrdemProducao: (op: Omit<OrdemProducao, 'id'>) => void;
  updateOrdemProducaoStatus: (
    id: string,
    status: OrdemProducao['status'],
    producedQty?: number,
    lostQty?: number,
    reason?: string
  ) => void;
  deleteOrdemProducao: (id: string) => void;

  registerDesperdicio: (desp: Omit<DesperdicioRegistro, 'id'>) => void;
  deleteDesperdicio: (id: string) => void;

  updateTaxaPagamento: (id: string, updates: Partial<TaxaPagamento>) => void;
  addCustoOperacional: (custo: Omit<CustoOperacionalItem, 'id'>) => void;
  updateCustoOperacional: (id: string, updates: Partial<CustoOperacionalItem>) => void;
  deleteCustoOperacional: (id: string) => void;
  updateRealDeliveryCostSetting: (cost: number) => void;

  getDreGerencial: (filtro: FinancialTimeFilter) => DreGerencial;
  getProdutosMargem: () => ProdutoMargemItem[];
  getSugestoesCompraIA: () => SugestaoCompraIA[];

  // --- BLOCO 12: NOTIFICAÇÕES, AUTOMAÇÕES, GATILHOS E CAMPANHAS INTELIGENTES ---
  notifications: AppNotification[];
  notificationPreferences: NotificationPreferences;
  automations: NotificationAutomation[];
  smartCampaigns: SmartCampaign[];
  cartAbandonments: CartAbandonmentRecord[];
  notificationTemplates: NotificationTemplate[];

  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
  sendAppNotification: (notif: Omit<AppNotification, 'notification_id' | 'created_at' | 'status'>) => void;
  triggerEventNotification: (event: AutomationTriggerEvent, payload?: Record<string, any>) => void;
  updateNotificationPreferences: (updates: Partial<NotificationPreferences>) => void;
  
  createAutomation: (auto: Omit<NotificationAutomation, 'automation_id' | 'created_at' | 'updated_at' | 'metrics'>) => void;
  updateAutomation: (id: string, updates: Partial<NotificationAutomation>) => void;
  deleteAutomation: (id: string) => void;
  toggleAutomationStatus: (id: string) => void;

  createSmartCampaign: (camp: Omit<SmartCampaign, 'campaign_id' | 'created_at' | 'updated_at' | 'metrics'>) => void;
  updateSmartCampaign: (id: string, updates: Partial<SmartCampaign>) => void;
  deleteSmartCampaign: (id: string) => void;
  duplicateSmartCampaign: (id: string) => void;
  sendTestCampaign: (campaignId: string, testTarget?: string) => { success: boolean; message: string };

  recordCartAbandonment: (items: any[], totalValue: number) => void;
  recoverCartAbandonment: (userId: string) => void;

  // --- BLOCO 13: BANCO DE DADOS, RELACIONAMENTOS, REGRAS DE NEGÓCIO, PERMISSÕES E INTEGRIDADE ---
  pointsLedger: PointsLedgerEntry[];
  priceHistory: PriceHistoryRecord[];
  runSystemIntegrityCheck: () => IntegrityReportResult;
  validateOrderStatusTransition: (current: CanonicalOrderStatus, target: CanonicalOrderStatus) => { allowed: boolean; reason?: string };
  checkGranularPermission: (permission: GranularPermission, role?: RoleType) => boolean;
  exportSystemSnapshot: () => string;

  // --- BLOCO 14: SEGURANÇA, AUTENTICAÇÃO, PAGAMENTOS, INTEGRAÇÕES E PROTEÇÃO DE DADOS (LGPD) ---
  legalPolicies: LegalPolicy[];
  externalIntegrations: ExternalIntegrationConfig[];
  authSessions: AuthSession[];
  paymentTransactions: PaymentTransaction[];
  webhookEvents: WebhookEventRecord[];
  securityIncidents: SecurityIncident[];
  userPrivacyConsent: UserPrivacyConsent;
  processSecurePaymentCheckout: (input: {
    orderId: string;
    amount: number;
    method: PaymentMethodType;
    installments?: number;
    cardLast4?: string;
    idempotencyKey?: string;
  }) => { transaction: PaymentTransaction; isDuplicateBlocked: boolean };
  simulateWebhookDispatch: (input: {
    provider: string;
    eventType: 'PAYMENT_APPROVED' | 'PAYMENT_FAILED' | 'PAYMENT_CANCELLED' | 'PAYMENT_REFUNDED';
    paymentId: string;
    orderId: string;
    amount: number;
    idempotencyKey: string;
    signatureHeader?: string;
  }) => { success: boolean; message: string };
  executeRefundAndReversal: (input: {
    paymentId: string;
    orderId: string;
    reason: string;
  }) => { success: boolean; message: string; pointsReversed: number };
  revokeAuthSession: (sessionId: string) => void;
  revokeAllOtherSessions: () => void;
  updatePrivacyConsentSettings: (updates: Partial<UserPrivacyConsent>) => void;
  exportLgpdUserData: () => string;
  requestLgpdAccountAnonymization: () => AccountDeletionResult;
}

const STORAGE_KEYS = {
  USER: 'mermi_user_profile_v2',
  MEMBER: 'mermi_weekly_member_v2',
  REWARDS: 'mermi_weekly_rewards_v2',
  REDEMPTIONS: 'mermi_redemptions_v2',
  PRICING: 'mermi_pricing_v2',
  HOME_BLOCKS: 'mermi_home_blocks_v3',
  PUBLICATIONS: 'mermi_publications_v2',
  BANNERS: 'mermi_banners_v4',
  CAMPAIGNS: 'mermi_campaigns_v2',
  PROMOTIONS: 'mermi_promotions_v2',
  POSTS: 'mermi_posts_v2',
  ARTICLES: 'mermi_articles_v2',
  ANALYTICS: 'mermi_analytics_v2',
  DROPS: 'mermi_drops_surpresa_v2',
  DROP_CLAIMS: 'mermi_drop_claims_v2',
  FOOD_PRODUCTS: 'mermi_food_products_v2',
  MENU_CATEGORIES: 'mermi_menu_categories_v2',
  CUSTOM_INGREDIENTS: 'mermi_custom_ingredients_v2',
  COUPONS: 'mermi_coupons_v2',
  CART: 'mermi_cart_v2',
  ORDERS: 'mermi_orders_v2',
  ADDRESSES: 'mermi_addresses_v2',
  DELIVERY_FEE: 'mermi_delivery_fee_v2',
  FREE_DELIVERY_THRESHOLD: 'mermi_free_delivery_threshold_v2',
  TRANSACTIONS: 'mermi_transactions_v5',
  EARNING_RULES: 'mermi_earning_rules_v5',
  USER_LEVELS: 'mermi_user_levels_v5',
  BADGES: 'mermi_badges_v5',
  MISSIONS: 'mermi_missions_v5',
  STREAK: 'mermi_streak_v8',
  PROCESSED_ORDERS: 'mermi_processed_order_points_v5',
  RACE_EVENTS: 'mermi_race_events_v6',
  RACE_KITS: 'mermi_race_kits_v6',
  RACE_REGISTRATIONS: 'mermi_race_registrations_v6',
  VIRTUAL_CHALLENGES: 'mermi_virtual_challenges_v6',
  LEADERBOARD: 'mermi_leaderboard_v6',
  RANKING_PRIVACY: 'mermi_ranking_privacy_v6',
  WATER_LOGS: 'mermi_water_logs_v8',
  WATER_SETTINGS: 'mermi_water_settings_v8',
  STEPS_LOGS: 'mermi_steps_logs_v8',
  STEPS_SETTINGS: 'mermi_steps_settings_v8',
  SLEEP_LOGS: 'mermi_sleep_logs_v8',
  SLEEP_SETTINGS: 'mermi_sleep_settings_v8',
  ACTIVITY_LOGS: 'mermi_activity_logs_v8',
  HABITS: 'mermi_habits_v8',
  HABIT_COMPLETIONS: 'mermi_habit_completions_v8',
  EVOLUTION_GOALS: 'mermi_evolution_goals_v8',
  CONNECTED_DEVICES: 'mermi_connected_devices_v8',
  BODY_EVOLUTION: 'mermi_body_evolution_v8',
  EVOLUTION_ADMIN: 'mermi_evolution_admin_v8',
  ADMIN_USER: 'mermi_admin_user_v10',
  ADMIN_USERS_LIST: 'mermi_admin_users_list_v10',
  ADMIN_AUTH: 'mermi_admin_auth_v10',
  AUDIT_LOGS: 'mermi_audit_logs_v10',
  INVENTORY: 'mermi_inventory_v10',
  PRODUCTION_PLAN: 'mermi_production_plan_v10',
  CRM_CUSTOMERS: 'mermi_crm_customers_v10',
  CAMPAIGNS_ADMIN: 'mermi_campaigns_admin_v10',
  BANNERS_ADMIN: 'mermi_banners_admin_v10',
  POSTS_ADMIN: 'mermi_posts_admin_v10',
  NOTIFICATIONS_ADMIN: 'mermi_notifications_admin_v10',
  INTELLIGENCE_FULL: 'mermi_intelligence_full_v10',
  ADMIN_ALERTS: 'mermi_admin_alerts_v10',
  SYSTEM_SETTINGS: 'mermi_system_settings_v10',
  INSUMOS: 'mermi_insumos_v11',
  COST_HISTORY: 'mermi_cost_history_v11',
  STOCK_MOVEMENTS: 'mermi_stock_movements_v11',
  FICHAS_TECNICAS: 'mermi_fichas_tecnicas_v11',
  FORNECEDORES: 'mermi_fornecedores_v11',
  PEDIDOS_COMPRA: 'mermi_pedidos_compra_v11',
  ORDENS_PRODUCAO: 'mermi_ordens_producao_v11',
  DESPERDICIOS: 'mermi_desperdicios_v11',
  TAXAS_PAGAMENTO: 'mermi_taxas_pagamento_v11',
  CUSTOS_OPERACIONAIS: 'mermi_custos_operacionais_v11',
  REAL_DELIVERY_COST: 'mermi_real_delivery_cost_v11',
  APP_NOTIFICATIONS: 'mermi_app_notifications_v12',
  NOTIFICATION_PREFERENCES: 'mermi_notification_preferences_v12',
  NOTIFICATION_AUTOMATIONS: 'mermi_notification_automations_v12',
  SMART_CAMPAIGNS: 'mermi_smart_campaigns_v12',
  CART_ABANDONMENTS: 'mermi_cart_abandonments_v12',
  POINTS_LEDGER: 'mermi_points_ledger_v13',
  PRICE_HISTORY: 'mermi_price_history_v13',
  LEGAL_POLICIES: 'mermi_legal_policies_v14',
  EXTERNAL_INTEGRATIONS: 'mermi_external_integrations_v14',
  AUTH_SESSIONS: 'mermi_auth_sessions_v14',
  PAYMENT_TRANSACTIONS: 'mermi_payment_transactions_v14',
  WEBHOOK_EVENTS: 'mermi_webhook_events_v14',
  SECURITY_INCIDENTS: 'mermi_security_incidents_v14',
  USER_PRIVACY_CONSENT: 'mermi_user_privacy_consent_v14',
};

// Limpeza imediata de chaves legadas contendo dados mock de evolução e gamificação
if (typeof window !== 'undefined' && window.localStorage) {
  try {
    const legacyMockKeys = [
      'mermi_water_logs_v7',
      'mermi_steps_logs_v7',
      'mermi_sleep_logs_v7',
      'mermi_activity_logs_v7',
      'mermi_habits_v7',
      'mermi_habit_completions_v7',
      'mermi_evolution_goals_v7',
      'mermi_connected_devices_v7',
      'mermi_body_evolution_v7',
      'mermi_streak_v5',
      'mermi_streak_v6',
      'mermi_streak_v7'
    ];
    legacyMockKeys.forEach(k => localStorage.removeItem(k));
  } catch (err) {
    console.warn('Falha ao purgar chaves legadas de mock', err);
  }
}

const MermiStoreContext = createContext<MermiStoreContextType | undefined>(undefined);

export const MermiStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state with localStorage fallbacks
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_USER,
          ...parsed,
          stepsToday: 0,
          waterIntakeMl: 0,
          sleepHours: '--',
          activeStreakDays: 0,
          mermiPoints: Number(parsed.mermiPoints || 0)
        };
      }
      return INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  });

  const [weeklyMember, setWeeklyMember] = useState<WeeklyMember>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MEMBER);
      return saved ? JSON.parse(saved) : INITIAL_WEEKLY_MEMBER;
    } catch {
      return INITIAL_WEEKLY_MEMBER;
    }
  });

  const [rewards, setRewards] = useState<RewardItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REWARDS);
      return saved ? JSON.parse(saved) : OFFICIAL_WEEKLY_REWARDS;
    } catch {
      return OFFICIAL_WEEKLY_REWARDS;
    }
  });

  const [redemptions, setRedemptions] = useState<RedemptionRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REDEMPTIONS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [drops, setDrops] = useState<DropSurpresaItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DROPS);
      return saved ? JSON.parse(saved) : INITIAL_DROPS_SURPRESA;
    } catch {
      return INITIAL_DROPS_SURPRESA;
    }
  });

  const [dropClaims, setDropClaims] = useState<DropClaimRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DROP_CLAIMS);
      return saved ? JSON.parse(saved) : INITIAL_DROP_CLAIMS;
    } catch {
      return INITIAL_DROP_CLAIMS;
    }
  });

  const [pricing, setPricing] = useState<MarmitaPricing[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRICING);
      return saved ? JSON.parse(saved) : INITIAL_PRICING;
    } catch {
      return INITIAL_PRICING;
    }
  });

  // --- BLOCO 03 STATES ---
  const [homeBlocks, setHomeBlocks] = useState<HomeBlockConfig[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HOME_BLOCKS);
      if (!saved) return INITIAL_HOME_BLOCKS;
      const parsed: HomeBlockConfig[] = JSON.parse(saved);
      const hasNewKeys = parsed.some((b) => b.key === 'posts_campanhas' || b.key === 'drop_surpresa');
      if (!hasNewKeys) return INITIAL_HOME_BLOCKS;
      return parsed;
    } catch {
      return INITIAL_HOME_BLOCKS;
    }
  });

  const [publications, setPublications] = useState<ContentPublication[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PUBLICATIONS);
      return saved ? JSON.parse(saved) : INITIAL_PUBLICATIONS;
    } catch {
      return INITIAL_PUBLICATIONS;
    }
  });

  const [banners, setBanners] = useState<BannerItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BANNERS);
      return saved ? JSON.parse(saved) : INITIAL_BANNERS;
    } catch {
      return INITIAL_BANNERS;
    }
  });

  const [campaigns, setCampaigns] = useState<CampaignItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CAMPAIGNS);
      return saved ? JSON.parse(saved) : INITIAL_CAMPAIGNS;
    } catch {
      return INITIAL_CAMPAIGNS;
    }
  });

  const [promotions, setPromotions] = useState<PromotionOffer[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROMOTIONS);
      return saved ? JSON.parse(saved) : INITIAL_PROMOTIONS;
    } catch {
      return INITIAL_PROMOTIONS;
    }
  });

  const [posts, setPosts] = useState<PostItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.POSTS);
      return saved ? JSON.parse(saved) : INITIAL_POSTS;
    } catch {
      return INITIAL_POSTS;
    }
  });

  const [articles, setArticles] = useState<ContentArticle[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ARTICLES);
      return saved ? JSON.parse(saved) : INITIAL_ARTICLES;
    } catch {
      return INITIAL_ARTICLES;
    }
  });

  const [analyticsEvents, setAnalyticsEvents] = useState<AnalyticsEvent[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ANALYTICS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [audienceProfile, setAudienceProfileState] = useState<AudienceProfileType>('standard');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // --- BLOCO 04: ESTADOS DE ALIMENTAÇÃO, CARDÁPIO, CARRINHO E PEDIDOS ---
  const [products, setProducts] = useState<FoodProduct[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FOOD_PRODUCTS);
      return saved ? JSON.parse(saved) : OFFICIAL_FOOD_PRODUCTS;
    } catch {
      return OFFICIAL_FOOD_PRODUCTS;
    }
  });

  const [menuCategories, setMenuCategories] = useState<MenuCategoryDef[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MENU_CATEGORIES);
      return saved ? JSON.parse(saved) : OFFICIAL_MENU_CATEGORIES;
    } catch {
      return OFFICIAL_MENU_CATEGORIES;
    }
  });

  const [customIngredients, setCustomIngredients] = useState<CustomIngredientOption[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOM_INGREDIENTS);
      return saved ? JSON.parse(saved) : OFFICIAL_CUSTOM_INGREDIENTS;
    } catch {
      return OFFICIAL_CUSTOM_INGREDIENTS;
    }
  });

  const [coupons, setCoupons] = useState<CouponRule[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COUPONS);
      return saved ? JSON.parse(saved) : INITIAL_COUPONS;
    } catch {
      return INITIAL_COUPONS;
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<CouponRule | null>(null);

  const [cartItems, setCartItems] = useState<CartItemProduct[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [
        {
          id: 'cart_demo_1',
          isCustomMarmita: true,
          name: 'Marmita Fit Peito de Frango (350g)',
          line: 'fit',
          size: '350g',
          unitPrice: 19.90,
          quantity: 1,
          totalPrice: 19.90,
          points_earned: 15,
          summary: 'Frango Grelhado em Tiras, Arroz Integral, Brócolis no Vapor'
        }
      ];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<OrderEntity[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [userAddresses, setUserAddresses] = useState<DeliveryAddress[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ADDRESSES);
      return saved ? JSON.parse(saved) : INITIAL_USER_ADDRESSES;
    } catch {
      return INITIAL_USER_ADDRESSES;
    }
  });

  const [selectedAddress, setSelectedAddress] = useState<DeliveryAddress>(() => {
    const saved = userAddresses.find(a => a.isDefault);
    return saved || userAddresses[0] || INITIAL_USER_ADDRESSES[0];
  });

  const [deliveryType, setDeliveryType] = useState<'entrega' | 'retirada'>('entrega');

  const [deliveryFeeSetting, setDeliveryFeeSetting] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DELIVERY_FEE);
      return saved ? JSON.parse(saved) : 7.90;
    } catch {
      return 7.90;
    }
  });

  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FREE_DELIVERY_THRESHOLD);
      return saved ? JSON.parse(saved) : 60.00;
    } catch {
      return 60.00;
    }
  });

  // --- BLOCO 05: ESTADOS CENTRAIS DE GAMIFICAÇÃO & MERMI POINTS ---
  const [transactions, setTransactions] = useState<PointTransaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  const [earningRules, setEarningRules] = useState<EarningRuleConfig[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EARNING_RULES);
      return saved ? JSON.parse(saved) : INITIAL_EARNING_RULES;
    } catch {
      return INITIAL_EARNING_RULES;
    }
  });

  const [userLevels, setUserLevels] = useState<UserLevelConfig[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER_LEVELS);
      return saved ? JSON.parse(saved) : INITIAL_USER_LEVELS;
    } catch {
      return INITIAL_USER_LEVELS;
    }
  });

  const [badges, setBadges] = useState<BadgeAchievement[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BADGES);
      return saved ? JSON.parse(saved) : INITIAL_BADGES;
    } catch {
      return INITIAL_BADGES;
    }
  });

  const [missions, setMissions] = useState<GamificationMission[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MISSIONS);
      return saved ? JSON.parse(saved) : INITIAL_MISSIONS;
    } catch {
      return INITIAL_MISSIONS;
    }
  });

  const [streak, setStreak] = useState<StreakRecord>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STREAK);
      return saved ? JSON.parse(saved) : INITIAL_STREAK;
    } catch {
      return INITIAL_STREAK;
    }
  });

  const [processedOrderIds, setProcessedOrderIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROCESSED_ORDERS);
      return saved ? JSON.parse(saved) : ['PED-1024', 'PED-1055', 'PED-2101'];
    } catch {
      return ['PED-1024', 'PED-1055', 'PED-2101'];
    }
  });

  // --- BLOCO 06: ESTADOS DO MERMI RUN ---
  const [raceEvents, setRaceEvents] = useState<RaceEvent[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RACE_EVENTS);
      return saved ? JSON.parse(saved) : INITIAL_RACE_EVENTS;
    } catch {
      return INITIAL_RACE_EVENTS;
    }
  });

  const [raceKits, setRaceKits] = useState<RaceKitItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RACE_KITS);
      return saved ? JSON.parse(saved) : INITIAL_RACE_KITS;
    } catch {
      return INITIAL_RACE_KITS;
    }
  });

  const [raceRegistrations, setRaceRegistrations] = useState<RaceRegistration[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RACE_REGISTRATIONS);
      return saved ? JSON.parse(saved) : INITIAL_USER_REGISTRATIONS;
    } catch {
      return INITIAL_USER_REGISTRATIONS;
    }
  });

  const [virtualChallenges, setVirtualChallenges] = useState<VirtualChallengeProgress[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VIRTUAL_CHALLENGES);
      return saved ? JSON.parse(saved) : INITIAL_VIRTUAL_CHALLENGES;
    } catch {
      return INITIAL_VIRTUAL_CHALLENGES;
    }
  });

  const [leaderboard, setLeaderboard] = useState<RankingEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LEADERBOARD);
      return saved ? JSON.parse(saved) : INITIAL_LEADERBOARD;
    } catch {
      return INITIAL_LEADERBOARD;
    }
  });

  const [rankingPrivacy, setRankingPrivacy] = useState<RankingDisplayPrivacy>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RANKING_PRIVACY);
      return (saved as RankingDisplayPrivacy) || 'nome_completo';
    } catch {
      return 'nome_completo';
    }
  });

  // --- BLOCO 07: SAÚDE, HIDRATAÇÃO, SONO, PASSOS, ATIVIDADES, HÁBITOS, METAS, DISPOSITIVOS & EVOLUÇÃO ---
  const [waterLogs, setWaterLogs] = useState<WaterLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WATER_LOGS);
      return saved ? JSON.parse(saved) : INITIAL_WATER_LOGS;
    } catch {
      return INITIAL_WATER_LOGS;
    }
  });

  const [waterSettings, setWaterSettings] = useState<WaterSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WATER_SETTINGS);
      return saved ? JSON.parse(saved) : INITIAL_WATER_SETTINGS;
    } catch {
      return INITIAL_WATER_SETTINGS;
    }
  });

  const [stepsLogs, setStepsLogs] = useState<StepsLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STEPS_LOGS);
      return saved ? JSON.parse(saved) : INITIAL_STEPS_LOGS;
    } catch {
      return INITIAL_STEPS_LOGS;
    }
  });

  const [stepsSettings, setStepsSettings] = useState<StepsSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STEPS_SETTINGS);
      return saved ? JSON.parse(saved) : INITIAL_STEPS_SETTINGS;
    } catch {
      return INITIAL_STEPS_SETTINGS;
    }
  });

  const [sleepLogs, setSleepLogs] = useState<SleepLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SLEEP_LOGS);
      return saved ? JSON.parse(saved) : INITIAL_SLEEP_LOGS;
    } catch {
      return INITIAL_SLEEP_LOGS;
    }
  });

  const [sleepSettings, setSleepSettings] = useState<SleepSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SLEEP_SETTINGS);
      return saved ? JSON.parse(saved) : INITIAL_SLEEP_SETTINGS;
    } catch {
      return INITIAL_SLEEP_SETTINGS;
    }
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOGS);
      return saved ? JSON.parse(saved) : INITIAL_ACTIVITY_LOGS;
    } catch {
      return INITIAL_ACTIVITY_LOGS;
    }
  });

  const [habits, setHabits] = useState<HabitItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HABITS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some((h: any) => h.streakDays > 0 && h.createdAt?.startsWith('2026-09'))) {
          return INITIAL_HABITS;
        }
        return parsed;
      }
      return INITIAL_HABITS;
    } catch {
      return INITIAL_HABITS;
    }
  });

  const [habitCompletions, setHabitCompletions] = useState<HabitCompletion[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HABIT_COMPLETIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Filtrar completions mockadas legadas
        if (Array.isArray(parsed) && parsed.some((c: any) => c.habitId === 'hbt_workout' && c.completedAt?.includes('T08:15:00'))) {
          return [];
        }
        return parsed;
      }
      return [];
    } catch {
      return [];
    }
  });

  const [evolutionGoals, setEvolutionGoals] = useState<EvolutionGoal[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EVOLUTION_GOALS);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Descartar metas com os 8.532 passos mockados
        if (Array.isArray(parsed) && parsed.some((g: any) => g.currentValue === 8532 || g.currentValue === 1550)) {
          return INITIAL_EVOLUTION_GOALS;
        }
        return parsed;
      }
      return INITIAL_EVOLUTION_GOALS;
    } catch {
      return INITIAL_EVOLUTION_GOALS;
    }
  });

  const [connectedDevices, setConnectedDevices] = useState<ConnectedDevice[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONNECTED_DEVICES);
      return saved ? JSON.parse(saved) : INITIAL_CONNECTED_DEVICES;
    } catch {
      return INITIAL_CONNECTED_DEVICES;
    }
  });

  const [bodyEvolutionLogs, setBodyEvolutionLogs] = useState<BodyEvolutionLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BODY_EVOLUTION);
      return saved ? JSON.parse(saved) : INITIAL_BODY_EVOLUTION;
    } catch {
      return INITIAL_BODY_EVOLUTION;
    }
  });

  const [evolutionAdminConfig, setEvolutionAdminConfig] = useState<EvolutionAdminConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EVOLUTION_ADMIN);
      return saved ? JSON.parse(saved) : INITIAL_EVOLUTION_ADMIN_CONFIG;
    } catch {
      return INITIAL_EVOLUTION_ADMIN_CONFIG;
    }
  });

  // --- BLOCO 10: MERMI CONTROL STATES ---
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ADMIN_USERS_LIST);
      return saved ? JSON.parse(saved) : INITIAL_ADMIN_USERS;
    } catch {
      return INITIAL_ADMIN_USERS;
    }
  });

  const [currentAdminUser, setCurrentAdminUser] = useState<AdminUser>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ADMIN_USER);
      if (saved) return JSON.parse(saved);
      return INITIAL_ADMIN_USERS[0];
    } catch {
      return INITIAL_ADMIN_USERS[0];
    }
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH);
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INVENTORY);
      return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
    } catch {
      return INITIAL_INVENTORY;
    }
  });

  const [productionPlan, setProductionPlan] = useState<ProductionPlanItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTION_PLAN);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTION_PLAN;
    } catch {
      return INITIAL_PRODUCTION_PLAN;
    }
  });

  const [crmCustomers, setCrmCustomers] = useState<CustomerCrmProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CRM_CUSTOMERS);
      return saved ? JSON.parse(saved) : INITIAL_CRM_CUSTOMERS;
    } catch {
      return INITIAL_CRM_CUSTOMERS;
    }
  });

  const [campaignsAdmin, setCampaignsAdmin] = useState<CampaignAdminItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CAMPAIGNS_ADMIN);
      return saved ? JSON.parse(saved) : INITIAL_CAMPAIGNS_ADMIN;
    } catch {
      return INITIAL_CAMPAIGNS_ADMIN;
    }
  });

  const [bannersAdmin, setBannersAdmin] = useState<BannerAdminItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BANNERS_ADMIN);
      return saved ? JSON.parse(saved) : INITIAL_BANNERS_ADMIN;
    } catch {
      return INITIAL_BANNERS_ADMIN;
    }
  });

  const [postsAdmin, setPostsAdmin] = useState<PostAdminItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.POSTS_ADMIN);
      return saved ? JSON.parse(saved) : INITIAL_POSTS_ADMIN;
    } catch {
      return INITIAL_POSTS_ADMIN;
    }
  });

  const [notificationsAdmin, setNotificationsAdmin] = useState<NotificationAdminItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS_ADMIN);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [intelligenceInsightsFull, setIntelligenceInsightsFull] = useState<MermiIntelligenceInsightFull[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INTELLIGENCE_FULL);
      return saved ? JSON.parse(saved) : INITIAL_INTELLIGENCE_FULL_INSIGHTS;
    } catch {
      return INITIAL_INTELLIGENCE_FULL_INSIGHTS;
    }
  });

  const [adminAlerts, setAdminAlerts] = useState<AdminAlert[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ADMIN_ALERTS);
      return saved ? JSON.parse(saved) : INITIAL_ADMIN_ALERTS;
    } catch {
      return INITIAL_ADMIN_ALERTS;
    }
  });

  const [systemSettings, setSystemSettings] = useState<SystemSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SYSTEM_SETTINGS);
      return saved ? JSON.parse(saved) : INITIAL_SYSTEM_SETTINGS;
    } catch {
      return INITIAL_SYSTEM_SETTINGS;
    }
  });

  // BLOCO 11 STATES: Financeiro, Estoque, Produção, Compras, Custos & Margem
  const [insumos, setInsumos] = useState<Insumo[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INSUMOS);
      return saved ? JSON.parse(saved) : INITIAL_INSUMOS;
    } catch {
      return INITIAL_INSUMOS;
    }
  });

  const [costHistory, setCostHistory] = useState<InsumoCostHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COST_HISTORY);
      return saved ? JSON.parse(saved) : INITIAL_COST_HISTORY;
    } catch {
      return INITIAL_COST_HISTORY;
    }
  });

  const [stockMovements, setStockMovements] = useState<StockMovement[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STOCK_MOVEMENTS);
      return saved ? JSON.parse(saved) : INITIAL_STOCK_MOVEMENTS;
    } catch {
      return INITIAL_STOCK_MOVEMENTS;
    }
  });

  const [fichasTecnicas, setFichasTecnicas] = useState<FichaTecnica[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FICHAS_TECNICAS);
      return saved ? JSON.parse(saved) : INITIAL_FICHAS_TECNICAS;
    } catch {
      return INITIAL_FICHAS_TECNICAS;
    }
  });

  const [fornecedores, setFornecedores] = useState<Fornecedor[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FORNECEDORES);
      return saved ? JSON.parse(saved) : INITIAL_FORNECEDORES;
    } catch {
      return INITIAL_FORNECEDORES;
    }
  });

  const [pedidosCompra, setPedidosCompra] = useState<PedidoCompra[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PEDIDOS_COMPRA);
      return saved ? JSON.parse(saved) : INITIAL_COMPRAS;
    } catch {
      return INITIAL_COMPRAS;
    }
  });

  const [ordensProducao, setOrdensProducao] = useState<OrdemProducao[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDENS_PRODUCAO);
      return saved ? JSON.parse(saved) : INITIAL_ORDENS_PRODUCAO;
    } catch {
      return INITIAL_ORDENS_PRODUCAO;
    }
  });

  const [desperdicios, setDesperdicios] = useState<DesperdicioRegistro[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DESPERDICIOS);
      return saved ? JSON.parse(saved) : INITIAL_DESPERDICIOS;
    } catch {
      return INITIAL_DESPERDICIOS;
    }
  });

  const [taxasPagamento, setTaxasPagamento] = useState<TaxaPagamento[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TAXAS_PAGAMENTO);
      return saved ? JSON.parse(saved) : INITIAL_TAXAS_PAGAMENTO;
    } catch {
      return INITIAL_TAXAS_PAGAMENTO;
    }
  });

  const [custosOperacionais, setCustosOperacionais] = useState<CustoOperacionalItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOS_OPERACIONAIS);
      return saved ? JSON.parse(saved) : INITIAL_CUSTOS_OPERACIONAIS;
    } catch {
      return INITIAL_CUSTOS_OPERACIONAIS;
    }
  });

  const [realDeliveryCostSetting, setRealDeliveryCostSetting] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REAL_DELIVERY_COST);
      return saved ? parseFloat(saved) : 6.5;
    } catch {
      return 6.5;
    }
  });

  // BLOCO 12: Notificações, Automações & Campanhas
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.APP_NOTIFICATIONS);
      return saved ? JSON.parse(saved) : INITIAL_USER_NOTIFICATIONS;
    } catch {
      return INITIAL_USER_NOTIFICATIONS;
    }
  });

  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferences>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATION_PREFERENCES);
      return saved ? JSON.parse(saved) : INITIAL_USER_PREFERENCES;
    } catch {
      return INITIAL_USER_PREFERENCES;
    }
  });

  const [automations, setAutomations] = useState<NotificationAutomation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATION_AUTOMATIONS);
      return saved ? JSON.parse(saved) : INITIAL_AUTOMATIONS;
    } catch {
      return INITIAL_AUTOMATIONS;
    }
  });

  const [smartCampaigns, setSmartCampaigns] = useState<SmartCampaign[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SMART_CAMPAIGNS);
      return saved ? JSON.parse(saved) : INITIAL_SMART_CAMPAIGNS;
    } catch {
      return INITIAL_SMART_CAMPAIGNS;
    }
  });

  const [cartAbandonments, setCartAbandonments] = useState<CartAbandonmentRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART_ABANDONMENTS);
      return saved ? JSON.parse(saved) : INITIAL_CART_ABANDONMENTS;
    } catch {
      return INITIAL_CART_ABANDONMENTS;
    }
  });

  // BLOCO 13: Single Source of Truth — Points Ledger & Histórico de Preços
  const [pointsLedger, setPointsLedger] = useState<PointsLedgerEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.POINTS_LEDGER);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((p: any) => !p.entry_id?.startsWith('ple-init-') && p.user_id !== 'usr_fernando');
        }
      }
      return [];
    } catch {
      return [];
    }
  });

  const [priceHistory, setPriceHistory] = useState<PriceHistoryRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRICE_HISTORY);
      return saved ? JSON.parse(saved) : INITIAL_PRICE_HISTORY;
    } catch {
      return INITIAL_PRICE_HISTORY;
    }
  });

  // BLOCO 14: Segurança, Pagamentos, Webhooks, Sessões, Políticas & Privacidade LGPD
  const [legalPolicies, setLegalPolicies] = useState<LegalPolicy[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LEGAL_POLICIES);
      return saved ? JSON.parse(saved) : INITIAL_LEGAL_POLICIES;
    } catch {
      return INITIAL_LEGAL_POLICIES;
    }
  });

  const [externalIntegrations, setExternalIntegrations] = useState<ExternalIntegrationConfig[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EXTERNAL_INTEGRATIONS);
      return saved ? JSON.parse(saved) : INITIAL_EXTERNAL_INTEGRATIONS;
    } catch {
      return INITIAL_EXTERNAL_INTEGRATIONS;
    }
  });

  const [authSessions, setAuthSessions] = useState<AuthSession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUTH_SESSIONS);
      return saved ? JSON.parse(saved) : INITIAL_AUTH_SESSIONS;
    } catch {
      return INITIAL_AUTH_SESSIONS;
    }
  });

  const [paymentTransactions, setPaymentTransactions] = useState<PaymentTransaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PAYMENT_TRANSACTIONS);
      return saved ? JSON.parse(saved) : INITIAL_PAYMENT_TRANSACTIONS;
    } catch {
      return INITIAL_PAYMENT_TRANSACTIONS;
    }
  });

  const [webhookEvents, setWebhookEvents] = useState<WebhookEventRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WEBHOOK_EVENTS);
      return saved ? JSON.parse(saved) : INITIAL_WEBHOOK_EVENTS;
    } catch {
      return INITIAL_WEBHOOK_EVENTS;
    }
  });

  const [securityIncidents, setSecurityIncidents] = useState<SecurityIncident[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SECURITY_INCIDENTS);
      return saved ? JSON.parse(saved) : INITIAL_SECURITY_INCIDENTS;
    } catch {
      return INITIAL_SECURITY_INCIDENTS;
    }
  });

  const [userPrivacyConsent, setUserPrivacyConsent] = useState<UserPrivacyConsent>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER_PRIVACY_CONSENT);
      return saved ? JSON.parse(saved) : INITIAL_USER_PRIVACY_CONSENT;
    } catch {
      return INITIAL_USER_PRIVACY_CONSENT;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LEGAL_POLICIES, JSON.stringify(legalPolicies));
    } catch (e) {
      console.warn('Erro ao salvar legal policies', e);
    }
  }, [legalPolicies]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EXTERNAL_INTEGRATIONS, JSON.stringify(externalIntegrations));
    } catch (e) {
      console.warn('Erro ao salvar external integrations', e);
    }
  }, [externalIntegrations]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.AUTH_SESSIONS, JSON.stringify(authSessions));
    } catch (e) {
      console.warn('Erro ao salvar auth sessions', e);
    }
  }, [authSessions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PAYMENT_TRANSACTIONS, JSON.stringify(paymentTransactions));
    } catch (e) {
      console.warn('Erro ao salvar payment transactions', e);
    }
  }, [paymentTransactions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WEBHOOK_EVENTS, JSON.stringify(webhookEvents));
    } catch (e) {
      console.warn('Erro ao salvar webhook events', e);
    }
  }, [webhookEvents]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SECURITY_INCIDENTS, JSON.stringify(securityIncidents));
    } catch (e) {
      console.warn('Erro ao salvar security incidents', e);
    }
  }, [securityIncidents]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PRIVACY_CONSENT, JSON.stringify(userPrivacyConsent));
    } catch (e) {
      console.warn('Erro ao salvar user privacy consent', e);
    }
  }, [userPrivacyConsent]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.POINTS_LEDGER, JSON.stringify(pointsLedger));
    } catch (e) {
      console.warn('Erro ao salvar points ledger', e);
    }
  }, [pointsLedger]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRICE_HISTORY, JSON.stringify(priceHistory));
    } catch (e) {
      console.warn('Erro ao salvar price history', e);
    }
  }, [priceHistory]);

  const notificationTemplates = INITIAL_NOTIFICATION_TEMPLATES;

  // BLOCO 10 Persistent effects
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ADMIN_USERS_LIST, JSON.stringify(adminUsers));
    } catch (e) {
      console.warn('Erro ao salvar admin users', e);
    }
  }, [adminUsers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ADMIN_USER, JSON.stringify(currentAdminUser));
    } catch (e) {
      console.warn('Erro ao salvar current admin user', e);
    }
  }, [currentAdminUser]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, JSON.stringify(isAdminAuthenticated));
    } catch (e) {
      console.warn('Erro ao salvar admin auth', e);
    }
  }, [isAdminAuthenticated]);

  // Sincronização inicial com PostgreSQL (Cloud SQL) via API REST
  useEffect(() => {
    let isMounted = true;

    // 1. Sincronizar produtos reais do PostgreSQL
    apiClient.products.getProducts()
      .then((res) => {
        if (!isMounted || !res || !res.products || res.products.length === 0) return;
        setProducts(prev => {
          return prev.map(p => {
            const serverP = res.products.find((sp: any) => sp.id === p.id);
            if (serverP) {
              const resolvedImg = serverP.imageUrl || serverP.image || '';
              return {
                ...p,
                name: serverP.name || p.name,
                image: resolvedImg,
                imageUrl: resolvedImg,
                primaryImageAssetId: serverP.primaryImageAssetId || null,
                assetName: serverP.assetName || undefined,
                description: serverP.description || p.description,
                nutrition: {
                  ...p.nutrition,
                  calories: serverP.calories ?? p.nutrition.calories,
                  protein_grams: serverP.protein ?? p.nutrition.protein_grams,
                  carbohydrate_grams: serverP.carbs ?? p.nutrition.carbohydrate_grams,
                  fat_grams: serverP.fat ?? p.nutrition.fat_grams
                }
              };
            }
            return p;
          });
        });
      })
      .catch((err) => {
        console.warn('Erro ao sincronizar produtos do PostgreSQL:', err);
      });

    // 2. Reconciliar saldo e lançamentos do Points Ledger com o PostgreSQL
    apiClient.points.getMyLedger()
      .then((res) => {
        if (!isMounted || !res) return;
        const realBalance = Number(res.balance || 0);
        setUser((u) => ({
          ...u,
          id: u.id === 'usr_visitante' ? 'usr_owner_dev' : u.id,
          name: u.name === 'Visitante' ? 'Fernando Brasil' : u.name,
          handle: u.handle === '@visitante' ? '@fernando.brasil' : u.handle,
          mermiPoints: realBalance
        }));
        if (Array.isArray(res.entries)) {
          setPointsLedger(res.entries);
          const mappedTransactions: PointTransaction[] = res.entries.map((e: any) => ({
            id: e.id,
            userId: e.user_id || 'usr_owner_dev',
            userName: 'Fernando Brasil',
            amount: e.amount,
            type: e.type === 'estornado' ? 'ajuste_admin' : (e.amount < 0 ? 'utilizado' : 'ganho'),
            origin: (e.source as any) || 'compra',
            description: e.reason || 'Lançamento MerMi Points',
            date: new Date(e.created_at || Date.now()).toLocaleDateString('pt-BR'),
            referenceId: e.idempotency_key || e.id,
            createdAt: e.created_at
          }));
          setTransactions(mappedTransactions);
        }
      })
      .catch((err) => {
        console.warn('Erro ao sincronizar ledger do PostgreSQL:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(auditLogs));
    } catch (e) {
      console.warn('Erro ao salvar audit logs', e);
    }
  }, [auditLogs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
    } catch (e) {
      console.warn('Erro ao salvar inventory', e);
    }
  }, [inventory]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTION_PLAN, JSON.stringify(productionPlan));
    } catch (e) {
      console.warn('Erro ao salvar production plan', e);
    }
  }, [productionPlan]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CRM_CUSTOMERS, JSON.stringify(crmCustomers));
    } catch (e) {
      console.warn('Erro ao salvar crm customers', e);
    }
  }, [crmCustomers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CAMPAIGNS_ADMIN, JSON.stringify(campaignsAdmin));
    } catch (e) {
      console.warn('Erro ao salvar campaigns admin', e);
    }
  }, [campaignsAdmin]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BANNERS_ADMIN, JSON.stringify(bannersAdmin));
    } catch (e) {
      console.warn('Erro ao salvar banners admin', e);
    }
  }, [bannersAdmin]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.POSTS_ADMIN, JSON.stringify(postsAdmin));
    } catch (e) {
      console.warn('Erro ao salvar posts admin', e);
    }
  }, [postsAdmin]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS_ADMIN, JSON.stringify(notificationsAdmin));
    } catch (e) {
      console.warn('Erro ao salvar notifications admin', e);
    }
  }, [notificationsAdmin]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.INTELLIGENCE_FULL, JSON.stringify(intelligenceInsightsFull));
    } catch (e) {
      console.warn('Erro ao salvar intelligence full', e);
    }
  }, [intelligenceInsightsFull]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ADMIN_ALERTS, JSON.stringify(adminAlerts));
    } catch (e) {
      console.warn('Erro ao salvar admin alerts', e);
    }
  }, [adminAlerts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SYSTEM_SETTINGS, JSON.stringify(systemSettings));
    } catch (e) {
      console.warn('Erro ao salvar system settings', e);
    }
  }, [systemSettings]);

  // BLOCO 11 Persistent effects
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.INSUMOS, JSON.stringify(insumos));
    } catch (e) {
      console.warn('Erro ao salvar insumos', e);
    }
  }, [insumos]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COST_HISTORY, JSON.stringify(costHistory));
    } catch (e) {
      console.warn('Erro ao salvar cost history', e);
    }
  }, [costHistory]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STOCK_MOVEMENTS, JSON.stringify(stockMovements));
    } catch (e) {
      console.warn('Erro ao salvar stock movements', e);
    }
  }, [stockMovements]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FICHAS_TECNICAS, JSON.stringify(fichasTecnicas));
    } catch (e) {
      console.warn('Erro ao salvar fichas tecnicas', e);
    }
  }, [fichasTecnicas]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FORNECEDORES, JSON.stringify(fornecedores));
    } catch (e) {
      console.warn('Erro ao salvar fornecedores', e);
    }
  }, [fornecedores]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PEDIDOS_COMPRA, JSON.stringify(pedidosCompra));
    } catch (e) {
      console.warn('Erro ao salvar pedidos compra', e);
    }
  }, [pedidosCompra]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDENS_PRODUCAO, JSON.stringify(ordensProducao));
    } catch (e) {
      console.warn('Erro ao salvar ordens producao', e);
    }
  }, [ordensProducao]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DESPERDICIOS, JSON.stringify(desperdicios));
    } catch (e) {
      console.warn('Erro ao salvar desperdicios', e);
    }
  }, [desperdicios]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TAXAS_PAGAMENTO, JSON.stringify(taxasPagamento));
    } catch (e) {
      console.warn('Erro ao salvar taxas pagamento', e);
    }
  }, [taxasPagamento]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOS_OPERACIONAIS, JSON.stringify(custosOperacionais));
    } catch (e) {
      console.warn('Erro ao salvar custos operacionais', e);
    }
  }, [custosOperacionais]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REAL_DELIVERY_COST, realDeliveryCostSetting.toString());
    } catch (e) {
      console.warn('Erro ao salvar real delivery cost', e);
    }
  }, [realDeliveryCostSetting]);

  // BLOCO 12 Persistent effects
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.APP_NOTIFICATIONS, JSON.stringify(notifications));
    } catch (e) {
      console.warn('Erro ao salvar notificacoes', e);
    }
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATION_PREFERENCES, JSON.stringify(notificationPreferences));
    } catch (e) {
      console.warn('Erro ao salvar preferencias notificacao', e);
    }
  }, [notificationPreferences]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATION_AUTOMATIONS, JSON.stringify(automations));
    } catch (e) {
      console.warn('Erro ao salvar automacoes', e);
    }
  }, [automations]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SMART_CAMPAIGNS, JSON.stringify(smartCampaigns));
    } catch (e) {
      console.warn('Erro ao salvar smart campaigns', e);
    }
  }, [smartCampaigns]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART_ABANDONMENTS, JSON.stringify(cartAbandonments));
    } catch (e) {
      console.warn('Erro ao salvar abandono carrinho', e);
    }
  }, [cartAbandonments]);

  // Resumo financeiro derivado em tempo real
  const pointsSummary = calculatePointsSummary(transactions, userLevels);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WATER_LOGS, JSON.stringify(waterLogs));
    } catch (e) {
      console.warn('Erro ao salvar water logs', e);
    }
  }, [waterLogs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WATER_SETTINGS, JSON.stringify(waterSettings));
    } catch (e) {
      console.warn('Erro ao salvar water settings', e);
    }
  }, [waterSettings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STEPS_LOGS, JSON.stringify(stepsLogs));
    } catch (e) {
      console.warn('Erro ao salvar steps logs', e);
    }
  }, [stepsLogs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STEPS_SETTINGS, JSON.stringify(stepsSettings));
    } catch (e) {
      console.warn('Erro ao salvar steps settings', e);
    }
  }, [stepsSettings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SLEEP_LOGS, JSON.stringify(sleepLogs));
    } catch (e) {
      console.warn('Erro ao salvar sleep logs', e);
    }
  }, [sleepLogs]);

  // Sincronizar metricas do usuario estritamente com os logs reais de passos, agua e sono
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const realSteps = stepsLogs.find(l => l.date === today)?.stepsCount || 0;
    const realWater = waterLogs.filter(l => l.date === today).reduce((acc, l) => acc + l.amountMl, 0);
    const todaySleep = sleepLogs.find(l => l.date === today);
    const sleepHoursStr = todaySleep ? (todaySleep.durationMinutes > 0 ? `${(todaySleep.durationMinutes / 60).toFixed(1)}h` : '--') : '--';
    setUser(u => ({
      ...u,
      stepsToday: realSteps,
      waterIntakeMl: realWater,
      sleepHours: sleepHoursStr,
      activeStreakDays: habitCompletions.length > 0 ? u.activeStreakDays : 0
    }));
  }, [stepsLogs, waterLogs, sleepLogs, habitCompletions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SLEEP_SETTINGS, JSON.stringify(sleepSettings));
    } catch (e) {
      console.warn('Erro ao salvar sleep settings', e);
    }
  }, [sleepSettings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOGS, JSON.stringify(activityLogs));
    } catch (e) {
      console.warn('Erro ao salvar activity logs', e);
    }
  }, [activityLogs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
    } catch (e) {
      console.warn('Erro ao salvar habits', e);
    }
  }, [habits]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.HABIT_COMPLETIONS, JSON.stringify(habitCompletions));
    } catch (e) {
      console.warn('Erro ao salvar habit completions', e);
    }
  }, [habitCompletions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EVOLUTION_GOALS, JSON.stringify(evolutionGoals));
    } catch (e) {
      console.warn('Erro ao salvar evolution goals', e);
    }
  }, [evolutionGoals]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CONNECTED_DEVICES, JSON.stringify(connectedDevices));
    } catch (e) {
      console.warn('Erro ao salvar connected devices', e);
    }
  }, [connectedDevices]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BODY_EVOLUTION, JSON.stringify(bodyEvolutionLogs));
    } catch (e) {
      console.warn('Erro ao salvar body evolution logs', e);
    }
  }, [bodyEvolutionLogs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EVOLUTION_ADMIN, JSON.stringify(evolutionAdminConfig));
    } catch (e) {
      console.warn('Erro ao salvar evolution admin config', e);
    }
  }, [evolutionAdminConfig]);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.RACE_EVENTS, JSON.stringify(raceEvents));
    } catch (e) {
      console.warn('Erro ao salvar race events', e);
    }
  }, [raceEvents]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.RACE_KITS, JSON.stringify(raceKits));
    } catch (e) {
      console.warn('Erro ao salvar race kits', e);
    }
  }, [raceKits]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.RACE_REGISTRATIONS, JSON.stringify(raceRegistrations));
    } catch (e) {
      console.warn('Erro ao salvar race registrations', e);
    }
  }, [raceRegistrations]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.VIRTUAL_CHALLENGES, JSON.stringify(virtualChallenges));
    } catch (e) {
      console.warn('Erro ao salvar virtual challenges', e);
    }
  }, [virtualChallenges]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(leaderboard));
    } catch (e) {
      console.warn('Erro ao salvar leaderboard', e);
    }
  }, [leaderboard]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.RANKING_PRIVACY, rankingPrivacy);
    } catch (e) {
      console.warn('Erro ao salvar ranking privacy', e);
    }
  }, [rankingPrivacy]);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    } catch (e) {
      console.warn('Erro ao salvar transactions no storage', e);
    }
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EARNING_RULES, JSON.stringify(earningRules));
    } catch (e) {
      console.warn('Erro ao salvar earning rules no storage', e);
    }
  }, [earningRules]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_LEVELS, JSON.stringify(userLevels));
    } catch (e) {
      console.warn('Erro ao salvar user levels no storage', e);
    }
  }, [userLevels]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(badges));
    } catch (e) {
      console.warn('Erro ao salvar badges no storage', e);
    }
  }, [badges]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MISSIONS, JSON.stringify(missions));
    } catch (e) {
      console.warn('Erro ao salvar missions no storage', e);
    }
  }, [missions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(streak));
    } catch (e) {
      console.warn('Erro ao salvar streak no storage', e);
    }
  }, [streak]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROCESSED_ORDERS, JSON.stringify(processedOrderIds));
    } catch (e) {
      console.warn('Erro ao salvar processed orders no storage', e);
    }
  }, [processedOrderIds]);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (e) {
      console.warn('Erro ao salvar no storage', e);
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MEMBER, JSON.stringify(weeklyMember));
    } catch (e) {
      console.warn('Erro ao salvar membro no storage', e);
    }
  }, [weeklyMember]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REWARDS, JSON.stringify(rewards));
    } catch (e) {
      console.warn('Erro ao salvar recompensas no storage', e);
    }
  }, [rewards]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REDEMPTIONS, JSON.stringify(redemptions));
    } catch (e) {
      console.warn('Erro ao salvar resgates no storage', e);
    }
  }, [redemptions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRICING, JSON.stringify(pricing));
    } catch (e) {
      console.warn('Erro ao salvar preços no storage', e);
    }
  }, [pricing]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.HOME_BLOCKS, JSON.stringify(homeBlocks));
    } catch (e) {
      console.warn('Erro ao salvar homeBlocks', e);
    }
  }, [homeBlocks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PUBLICATIONS, JSON.stringify(publications));
    } catch (e) {
      console.warn('Erro ao salvar publications', e);
    }
  }, [publications]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BANNERS, JSON.stringify(banners));
    } catch (e) {
      console.warn('Erro ao salvar banners', e);
    }
  }, [banners]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(campaigns));
    } catch (e) {
      console.warn('Erro ao salvar campaigns', e);
    }
  }, [campaigns]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROMOTIONS, JSON.stringify(promotions));
    } catch (e) {
      console.warn('Erro ao salvar promotions', e);
    }
  }, [promotions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
    } catch (e) {
      console.warn('Erro ao salvar posts', e);
    }
  }, [posts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles));
    } catch (e) {
      console.warn('Erro ao salvar articles', e);
    }
  }, [articles]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(analyticsEvents.slice(-200)));
    } catch (e) {
      console.warn('Erro ao salvar analytics', e);
    }
  }, [analyticsEvents]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DROPS, JSON.stringify(drops));
    } catch (e) {
      console.warn('Erro ao salvar drops', e);
    }
  }, [drops]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DROP_CLAIMS, JSON.stringify(dropClaims));
    } catch (e) {
      console.warn('Erro ao salvar drop claims', e);
    }
  }, [dropClaims]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FOOD_PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.warn('Erro ao salvar produtos no storage', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MENU_CATEGORIES, JSON.stringify(menuCategories));
    } catch (e) {
      console.warn('Erro ao salvar categorias no storage', e);
    }
  }, [menuCategories]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_INGREDIENTS, JSON.stringify(customIngredients));
    } catch (e) {
      console.warn('Erro ao salvar ingredientes no storage', e);
    }
  }, [customIngredients]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
    } catch (e) {
      console.warn('Erro ao salvar cupons no storage', e);
    }
  }, [coupons]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cartItems));
    } catch (e) {
      console.warn('Erro ao salvar carrinho no storage', e);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.warn('Erro ao salvar pedidos no storage', e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ADDRESSES, JSON.stringify(userAddresses));
    } catch (e) {
      console.warn('Erro ao salvar endereços no storage', e);
    }
  }, [userAddresses]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3500);
  };

  const unlockBadgeDirect = (badgeId: string) => {
    setBadges((prev) =>
      prev.map((b) => {
        if (b.id === badgeId && !b.unlocked) {
          showToast(`🏆 Conquista Desbloqueada: ${b.name}! (+${b.pointsReward || 0} pts)`);
          return {
            ...b,
            unlocked: true,
            unlockedAt: 'Hoje'
          };
        }
        return b;
      })
    );
  };

  const recordTransaction = (txData: {
    amount: number;
    type: PointTransactionType;
    origin: PointOrigin;
    description: string;
    referenceId?: string;
    adminResponsible?: string;
  }): PointTransaction => {
    const newTx: PointTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: user.id || 'usr_fernando',
      userName: user.name || 'Fernando Euler',
      amount: txData.amount,
      type: txData.type,
      origin: txData.origin,
      description: txData.description,
      date: new Date().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      referenceId: txData.referenceId,
      adminResponsible: txData.adminResponsible,
      createdAt: new Date().toISOString()
    };

    setTransactions((prev) => {
      const updated = [newTx, ...prev];
      const summary = calculatePointsSummary(updated, userLevels);
      setUser((u) => ({
        ...u,
        mermiPoints: summary.currentBalance,
        level: summary.currentLevel.levelNumber,
        nextLevelPoints: summary.nextLevel?.minPoints || summary.currentLevel.minPoints
      }));
      return updated;
    });

    // Check automatic badge unlock for milestone points
    const currentPoints = user.mermiPoints + txData.amount;
    if (currentPoints >= 100) unlockBadgeDirect('bdg_100_points');
    if (currentPoints >= 500) unlockBadgeDirect('bdg_500_points');
    if (currentPoints >= 1000) unlockBadgeDirect('bdg_1000_points');

    // BLOCO 13: Registrar no Points Ledger Imutável
    const ledgerEntry: PointsLedgerEntry = {
      entry_id: `ple_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      user_id: user.id || 'usr_cliente',
      type: txData.amount >= 0 ? 'COMPRA' : 'RESGATE_RECOMPENSA',
      amount: txData.amount,
      balance_before: user.mermiPoints,
      balance_after: user.mermiPoints + txData.amount,
      reference_id: txData.referenceId || newTx.id,
      source: txData.origin,
      description: txData.description,
      created_at: new Date().toISOString()
    };
    setPointsLedger((prev) => [ledgerEntry, ...prev]);

    return newTx;
  };

  const adjustPointsAdmin = (amount: number, reason: string, adminName: string) => {
    recordTransaction({
      amount,
      type: 'ajuste_admin',
      origin: 'admin_manual',
      description: `Ajuste Administrativo: ${reason}`,
      adminResponsible: adminName || 'Administrador MerMi Control'
    });
    showToast(`Ajuste de ${amount >= 0 ? '+' : ''}${amount} Points registrado com sucesso.`);
  };

  const awardPointsByAction = (
    actionKey: string,
    details?: { referenceId?: string; customDescription?: string; multiplier?: number }
  ) => {
    const rule = earningRules.find((r) => r.actionKey === actionKey && r.active);
    if (!rule) {
      return { success: false, pointsAwarded: 0, message: 'Regra de pontos inativa ou não cadastrada.' };
    }
    const mult = details?.multiplier || 1;
    const finalPts = Math.round(rule.pointsAmount * mult);

    recordTransaction({
      amount: finalPts,
      type: 'ganho',
      origin: rule.actionKey as any,
      description: details?.customDescription || `${rule.name}: +${finalPts} Points`,
      referenceId: details?.referenceId
    });

    showToast(`+${finalPts} MerMi Points conquistados! (${rule.name})`);
    return { success: true, pointsAwarded: finalPts, message: `+${finalPts} Points creditados.` };
  };

  const setUserPoints = (points: number) => {
    const diff = points - user.mermiPoints;
    if (diff !== 0) {
      recordTransaction({
        amount: diff,
        type: 'ajuste_admin',
        origin: 'admin_manual',
        description: `Ajuste manual de saldo para ${points} Points`,
        adminResponsible: 'Simulador / Administrador'
      });
    }
  };

  const addPoints = (amount: number, reason: string) => {
    recordTransaction({
      amount,
      type: 'ganho',
      origin: 'admin_manual',
      description: reason
    });
    showToast(`+${amount} MerMi Points conquistados! Motivo: ${reason}`);
  };

  // Regras de Ganho
  const createEarningRule = (newRule: Omit<EarningRuleConfig, 'id'>) => {
    const rule: EarningRuleConfig = {
      ...newRule,
      id: `rule_${Date.now()}`
    };
    setEarningRules((prev) => [rule, ...prev]);
    showToast(`Regra de pontuação "${rule.name}" criada com sucesso.`);
  };

  const updateEarningRule = (id: string, updates: Partial<EarningRuleConfig>) => {
    setEarningRules((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
    showToast('Regra de pontuação atualizada.');
  };

  const deleteEarningRule = (id: string) => {
    setEarningRules((prev) => prev.filter((r) => r.id !== id));
    showToast('Regra de pontuação removida.');
  };

  const toggleEarningRuleActive = (id: string) => {
    setEarningRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r))
    );
  };

  // Níveis de Usuário
  const createUserLevel = (level: UserLevelConfig) => {
    setUserLevels((prev) => [...prev.filter((l) => l.levelNumber !== level.levelNumber), level].sort((a, b) => a.levelNumber - b.levelNumber));
    showToast(`Nível ${level.levelNumber} - ${level.name} cadastrado com sucesso.`);
  };

  const updateUserLevel = (levelNumber: number, updates: Partial<UserLevelConfig>) => {
    setUserLevels((prev) =>
      prev.map((l) => (l.levelNumber === levelNumber ? { ...l, ...updates } : l))
    );
    showToast(`Nível ${levelNumber} atualizado com sucesso.`);
  };

  const deleteUserLevel = (levelNumber: number) => {
    setUserLevels((prev) => prev.filter((l) => l.levelNumber !== levelNumber));
    showToast(`Nível ${levelNumber} removido.`);
  };

  // Badges e Conquistas
  const createBadge = (newBadge: Omit<BadgeAchievement, 'id'>) => {
    const badge: BadgeAchievement = {
      ...newBadge,
      id: `bdg_${Date.now()}`
    };
    setBadges((prev) => [...prev, badge]);
    showToast(`Conquista "${badge.name}" cadastrada.`);
  };

  const updateBadge = (id: string, updates: Partial<BadgeAchievement>) => {
    setBadges((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
    showToast('Conquista atualizada.');
  };

  const deleteBadge = (id: string) => {
    setBadges((prev) => prev.filter((b) => b.id !== id));
    showToast('Conquista removida.');
  };

  const unlockBadge = (badgeId: string): { success: boolean; message: string } => {
    const badge = badges.find((b) => b.id === badgeId);
    if (!badge) return { success: false, message: 'Conquista não encontrada.' };
    if (badge.unlocked) return { success: false, message: 'Conquista já desbloqueada.' };

    setBadges((prev) =>
      prev.map((b) =>
        b.id === badgeId ? { ...b, unlocked: true, unlockedAt: 'Hoje' } : b
      )
    );

    if (badge.pointsReward && badge.pointsReward > 0) {
      recordTransaction({
        amount: badge.pointsReward,
        type: 'ganho',
        origin: 'desafio',
        description: `Conquista Desbloqueada: ${badge.name}`,
        referenceId: badge.id
      });
    }

    showToast(`🎉 Conquista Desbloqueada: ${badge.name}!`);
    return { success: true, message: `Conquista ${badge.name} desbloqueada com sucesso!` };
  };

  // Missões
  const createMission = (newMission: Omit<GamificationMission, 'id'>) => {
    const mission: GamificationMission = {
      ...newMission,
      id: `mis_${Date.now()}`
    };
    setMissions((prev) => [mission, ...prev]);
    showToast(`Missão "${mission.title}" criada.`);
  };

  const updateMission = (id: string, updates: Partial<GamificationMission>) => {
    setMissions((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
    showToast('Missão atualizada.');
  };

  const deleteMission = (id: string) => {
    setMissions((prev) => prev.filter((m) => m.id !== id));
    showToast('Missão removida.');
  };

  const completeMission = (missionId: string): { success: boolean; message: string } => {
    const mission = missions.find((m) => m.id === missionId);
    if (!mission) return { success: false, message: 'Missão não encontrada.' };
    if (mission.status === 'resgatada') {
      return { success: false, message: 'Recompensa desta missão já foi resgatada!' };
    }

    setMissions((prev) =>
      prev.map((m) => (m.id === missionId ? { ...m, status: 'resgatada', progress: m.goal } : m))
    );

    recordTransaction({
      amount: mission.pointsReward,
      type: 'ganho',
      origin: 'missao',
      description: `Missão Concluída: ${mission.title}`,
      referenceId: mission.id
    });

    unlockBadgeDirect('bdg_desafio_concluido');

    showToast(`🎉 Missão concluída! Você ganhou +${mission.pointsReward} MerMi Points.`);
    return { success: true, message: `+${mission.pointsReward} Points conquistados!` };
  };

  const updateMissionProgress = (missionId: string, deltaProgress: number) => {
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id === missionId) {
          const newProgress = Math.min(m.goal, Math.max(0, m.progress + deltaProgress));
          const completed = newProgress >= m.goal;
          return {
            ...m,
            progress: newProgress,
            status: completed && m.status !== 'resgatada' ? 'concluida' : m.status
          };
        }
        return m;
      })
    );
  };

  // Streak / Constância
  const updateStreakDays = (newDays: number) => {
    setStreak((prev) => ({
      ...prev,
      currentStreakDays: newDays,
      bestStreakDays: Math.max(prev.bestStreakDays, newDays)
    }));
    setUser((u) => ({ ...u, activeStreakDays: newDays }));
    showToast(`Sequência de dias atualizada para 🔥 ${newDays} dias.`);
  };

  const claimStreakMilestone = (days: number): { success: boolean; message: string } => {
    const milestone = streak.milestones.find((m) => m.days === days);
    if (!milestone) return { success: false, message: 'Marco de sequência não encontrado.' };
    if (milestone.achieved) {
      return { success: false, message: 'Este marco de sequência já foi resgatado!' };
    }
    if (streak.currentStreakDays < days) {
      return { success: false, message: `Sequência insuficiente (${streak.currentStreakDays}/${days} dias).` };
    }

    setStreak((prev) => ({
      ...prev,
      milestones: prev.milestones.map((m) => (m.days === days ? { ...m, achieved: true } : m))
    }));

    recordTransaction({
      amount: milestone.points,
      type: 'ganho',
      origin: 'streak',
      description: `Marco de Constância: ${milestone.label} (${days} Dias)`,
      referenceId: `streak_${days}d`
    });

    if (days >= 7) unlockBadgeDirect('bdg_7_dias_constancia');

    showToast(`🔥 Incrível! Você resgatou +${milestone.points} Points da sua sequência!`);
    return { success: true, message: `+${milestone.points} Points concedidos!` };
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  const updateWeeklyMember = (updates: Partial<WeeklyMember>) => {
    setWeeklyMember((prev) => ({ ...prev, ...updates }));
    showToast('Dados do Membro da Semana atualizados com sucesso!');
  };

  // --- BLOCO 10 METHODS ---
  const addAuditLog = (
    action: string,
    entity: AuditLog['entity'],
    entityId: string,
    previousValue: string,
    newValue: string,
    reason?: string
  ) => {
    const log: AuditLog = {
      id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }),
      adminName: currentAdminUser.name,
      adminRole: currentAdminUser.role,
      action,
      entity,
      entityId,
      previousValue,
      newValue,
      reason
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  const loginAdmin = (userOrRole: AdminUser | AdminRole, pin?: string) => {
    let targetUser: AdminUser | undefined;
    if (typeof userOrRole === 'string') {
      targetUser = adminUsers.find((u) => u.role === userOrRole);
    } else {
      targetUser = userOrRole;
    }
    if (!targetUser) {
      return { success: false, message: 'Perfil administrativo não localizado.' };
    }
    setCurrentAdminUser(targetUser);
    setIsAdminAuthenticated(true);
    addAuditLog('LOGIN_ADMINISTRATIVO', 'usuario', targetUser.id, 'Sessão anterior', `Autenticado como ${targetUser.role}`);
    showToast(`Bem-vindo ao MERMI CONTROL, ${targetUser.name} (${targetUser.role})!`);
    return { success: true, message: `Autenticado com sucesso como ${targetUser.role}.` };
  };

  const logoutAdmin = () => {
    addAuditLog('LOGOUT_ADMINISTRATIVO', 'usuario', currentAdminUser.id, `Sessão ativa: ${currentAdminUser.role}`, 'Desconectado');
    setIsAdminAuthenticated(false);
    showToast('Sessão administrativa finalizada com segurança.');
  };

  const switchAdminUser = (userId: string) => {
    const found = adminUsers.find((u) => u.id === userId);
    if (found) {
      const prevRole = currentAdminUser.role;
      setCurrentAdminUser(found);
      addAuditLog('TROCA_PERFIL_ADMIN', 'usuario', found.id, `Perfil anterior: ${prevRole}`, `Novo perfil: ${found.role}`);
      showToast(`Perfil alterado para: ${found.name} (${found.role})`);
    }
  };

  const addAdminUser = (userData: Omit<AdminUser, 'id'>) => {
    const newUser: AdminUser = {
      ...userData,
      id: `adm_${Date.now()}`
    };
    setAdminUsers((prev) => [...prev, newUser]);
    addAuditLog('CRIAR_ADMINISTRADOR', 'usuario', newUser.id, 'Inexistente', `${newUser.name} (${newUser.role})`);
    showToast(`Usuário administrativo ${newUser.name} criado com sucesso.`);
  };

  const updateAdminUser = (id: string, updates: Partial<AdminUser>) => {
    setAdminUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          addAuditLog('ATUALIZAR_ADMINISTRADOR', 'usuario', id, `${u.name} - ${u.role}`, `${updates.name || u.name} - ${updates.role || u.role}`);
          return { ...u, ...updates };
        }
        return u;
      })
    );
    showToast('Dados do usuário administrativo atualizados.');
  };

  const deleteAdminUser = (id: string) => {
    const target = adminUsers.find((u) => u.id === id);
    if (target?.role === 'OWNER') {
      showToast('Ação bloqueada: O perfil OWNER mestre não pode ser removido.');
      return;
    }
    setAdminUsers((prev) => prev.filter((u) => u.id !== id));
    addAuditLog('REMOVER_ADMINISTRADOR', 'usuario', id, target?.name || id, 'Removido');
    showToast('Usuário administrativo removido.');
  };

  // Inventory
  const updateInventoryStock = (id: string, newStock: number) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const prevVal = `${item.currentStock} ${item.unit}`;
          const newVal = `${newStock} ${item.unit}`;
          const newStatus: InventoryItem['status'] =
            newStock <= item.minStock * 0.5 ? 'critico' : newStock <= item.minStock ? 'baixo' : 'normal';
          addAuditLog('AJUSTE_ESTOQUE', 'estoque', id, prevVal, newVal, 'Ajuste manual de estoque no Mermi Control');
          return { ...item, currentStock: newStock, status: newStatus };
        }
        return item;
      })
    );
    showToast('Estoque atualizado.');
  };

  const addInventoryItem = (itemData: Omit<InventoryItem, 'id'>) => {
    const newItem: InventoryItem = {
      ...itemData,
      id: `inv_${Date.now()}`
    };
    setInventory((prev) => [...prev, newItem]);
    addAuditLog('CRIAR_ITEM_ESTOQUE', 'estoque', newItem.id, 'Inexistente', `${newItem.name}: ${newItem.currentStock} ${newItem.unit}`);
    showToast(`Item ${newItem.name} adicionado ao controle de estoque.`);
  };

  const updateInventoryItem = (id: string, updates: Partial<InventoryItem>) => {
    setInventory((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...updates } : i))
    );
    showToast('Item de estoque atualizado.');
  };

  const deleteInventoryItem = (id: string) => {
    setInventory((prev) => prev.filter((i) => i.id !== id));
    showToast('Item de estoque removido.');
  };

  // Production
  const addProductionPlanItem = (planData: Omit<ProductionPlanItem, 'id'>) => {
    const newPlan: ProductionPlanItem = {
      ...planData,
      id: `prod_${Date.now()}`
    };
    setProductionPlan((prev) => [...prev, newPlan]);
    addAuditLog('CRIAR_LOTE_PRODUCAO', 'produto', newPlan.id, 'Inexistente', `${newPlan.dishName} (${newPlan.quantity350g + newPlan.quantity500g} un)`);
    showToast(`Lote de produção para "${newPlan.dishName}" agendado.`);
  };

  const updateProductionPlanStatus = (id: string, status: ProductionPlanItem['status']) => {
    setProductionPlan((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          addAuditLog('STATUS_PRODUCAO', 'produto', id, p.status, status);
          return { ...p, status };
        }
        return p;
      })
    );
    showToast(`Status da produção atualizado para: ${status.toUpperCase()}`);
  };

  const deleteProductionPlanItem = (id: string) => {
    setProductionPlan((prev) => prev.filter((p) => p.id !== id));
    showToast('Lote de produção cancelado.');
  };

  // CRM
  const updateCrmCustomer = (id: string, updates: Partial<CustomerCrmProfile>) => {
    setCrmCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    showToast('Ficha de cliente do CRM atualizada.');
  };

  const addCrmCustomer = (custData: Omit<CustomerCrmProfile, 'id'>) => {
    const newCust: CustomerCrmProfile = {
      ...custData,
      id: `crm_${Date.now()}`
    };
    setCrmCustomers((prev) => [...prev, newCust]);
    showToast(`Cliente ${newCust.name} adicionado ao CRM.`);
  };

  // Campaigns Admin
  const addCampaignAdmin = (campData: Omit<CampaignAdminItem, 'id'>) => {
    const newCamp: CampaignAdminItem = {
      ...campData,
      id: `camp_${Date.now()}`
    };
    setCampaignsAdmin((prev) => [newCamp, ...prev]);
    addAuditLog('CRIAR_CAMPANHA', 'campanha', newCamp.id, 'Inexistente', newCamp.nome);
    showToast(`Campanha "${newCamp.nome}" criada com sucesso.`);
  };

  const updateCampaignAdmin = (id: string, updates: Partial<CampaignAdminItem>) => {
    setCampaignsAdmin((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    showToast('Campanha atualizada.');
  };

  const deleteCampaignAdmin = (id: string) => {
    setCampaignsAdmin((prev) => prev.filter((c) => c.id !== id));
    showToast('Campanha removida.');
  };

  // Banners Admin
  const addBannerAdmin = (bannerData: Omit<BannerAdminItem, 'id'>) => {
    const newBanner: BannerAdminItem = {
      ...bannerData,
      id: `ban_${Date.now()}`
    };
    setBannersAdmin((prev) => [...prev, newBanner]);
    addAuditLog('CRIAR_BANNER', 'banner', newBanner.id, 'Inexistente', newBanner.titulo);
    showToast(`Banner "${newBanner.titulo}" criado.`);
  };

  const updateBannerAdmin = (id: string, updates: Partial<BannerAdminItem>) => {
    setBannersAdmin((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
    showToast('Banner atualizado.');
  };

  const deleteBannerAdmin = (id: string) => {
    setBannersAdmin((prev) => prev.filter((b) => b.id !== id));
    showToast('Banner excluído.');
  };

  // Posts Admin
  const addPostAdmin = (postData: Omit<PostAdminItem, 'id'>) => {
    const newPost: PostAdminItem = {
      ...postData,
      id: `post_${Date.now()}`
    };
    setPostsAdmin((prev) => [newPost, ...prev]);
    addAuditLog('CRIAR_POST', 'campanha', newPost.id, 'Inexistente', newPost.titulo);
    showToast(`Post "${newPost.titulo}" publicado com sucesso.`);
  };

  const updatePostAdmin = (id: string, updates: Partial<PostAdminItem>) => {
    setPostsAdmin((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    showToast('Post atualizado.');
  };

  const deletePostAdmin = (id: string) => {
    setPostsAdmin((prev) => prev.filter((p) => p.id !== id));
    showToast('Post removido.');
  };

  // Notifications Admin
  const addNotificationAdmin = (notifData: Omit<NotificationAdminItem, 'id'>) => {
    const newNotif: NotificationAdminItem = {
      ...notifData,
      id: `notif_${Date.now()}`
    };
    setNotificationsAdmin((prev) => [newNotif, ...prev]);
    addAuditLog('CRIAR_NOTIFICACAO', 'configuracao', newNotif.id, 'Inexistente', newNotif.title);
    showToast(`Notificação "${newNotif.title}" programada.`);
  };

  const updateNotificationAdmin = (id: string, updates: Partial<NotificationAdminItem>) => {
    setNotificationsAdmin((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...updates } : n))
    );
    showToast('Notificação atualizada.');
  };

  const deleteNotificationAdmin = (id: string) => {
    setNotificationsAdmin((prev) => prev.filter((n) => n.id !== id));
    showToast('Notificação removida.');
  };

  // Intelligence & High Impact Actions
  const confirmHighImpactAction = (insightId: string) => {
    const insight = intelligenceInsightsFull.find((i) => i.id === insightId);
    if (!insight) return { success: false, message: 'Insight não localizado.' };

    if (insight.highImpactActionType === 'ajustar_estoque' && insight.highImpactPayload) {
      const { itemId, quantityToAdd } = insight.highImpactPayload;
      const target = inventory.find((i) => i.id === itemId);
      if (target) {
        updateInventoryStock(itemId, target.currentStock + quantityToAdd);
      }
    } else if (insight.highImpactActionType === 'disparar_reativacao' && insight.highImpactPayload) {
      addNotificationAdmin({
        title: 'Sentimos sua falta no MerMi Fit Life! 🥗',
        message: 'Utilize o cupom VOLTAFIT e garanta frete grátis no seu próximo pedido.',
        category: 'CAMPANHAS',
        targetAudience: 'Clientes Inativos (+20 dias)',
        status: 'enviada',
        sentAt: 'Agora mesmo',
        readCount: 0
      });
    }

    setIntelligenceInsightsFull((prev) =>
      prev.map((i) => (i.id === insightId ? { ...i, status: 'confirmado' } : i))
    );
    addAuditLog('CONFIRMAR_ACAO_INTELIGENCIA', 'configuracao', insightId, 'Sugerido', 'Confirmado pelo administrador', insight.sugestao);
    showToast(`Ação recomendada pela MerMi Intelligence executada com sucesso!`);
    return { success: true, message: 'Ação confirmada e executada com sucesso.' };
  };

  const cancelHighImpactAction = (insightId: string) => {
    setIntelligenceInsightsFull((prev) =>
      prev.map((i) => (i.id === insightId ? { ...i, status: 'cancelado' } : i))
    );
    addAuditLog('CANCELAR_ACAO_INTELIGENCIA', 'configuracao', insightId, 'Sugerido', 'Cancelado pelo administrador');
    showToast('Ação cancelada pelo administrador.');
  };

  const resolveAdminAlert = (id: string) => {
    setAdminAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, resolved: true } : a))
    );
    showToast('Alerta marcado como resolvido.');
  };

  const updateSystemSettings = (updates: Partial<SystemSettings>) => {
    setSystemSettings((prev) => {
      const updated = { ...prev, ...updates };
      addAuditLog('ATUALIZAR_CONFIGURACOES', 'configuracao', 'settings_global', 'Configurações anteriores', 'Novas configurações salvas');
      return updated;
    });
    showToast('Configurações do ecossistema salvas com sucesso.');
  };

  // --- BLOCO 11 METHODS: FINANCEIRO, ESTOQUE, PRODUÇÃO, COMPRAS, CUSTOS & MARGEM ---
  const addInsumo = (insumoData: Omit<Insumo, 'id' | 'data_de_cadastro' | 'data_de_atualizacao'>) => {
    const today = new Date().toISOString().split('T')[0];
    const newInsumo: Insumo = {
      ...insumoData,
      id: `ins_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      data_de_cadastro: today,
      data_de_atualizacao: today
    };
    setInsumos((prev) => [...prev, newInsumo]);
    addAuditLog('CRIAR_INSUMO', 'estoque', newInsumo.id, 'Inexistente', `${newInsumo.nome} (${newInsumo.quantidade_atual} ${newInsumo.unidade_de_medida})`);
    showToast(`Insumo "${newInsumo.nome}" cadastrado com sucesso.`);
  };

  const updateInsumo = (id: string, updates: Partial<Insumo>) => {
    setInsumos((prev) =>
      prev.map((i) => {
        if (i.id === id) {
          const updated = {
            ...i,
            ...updates,
            data_de_atualizacao: new Date().toISOString().split('T')[0]
          };
          addAuditLog('ATUALIZAR_INSUMO', 'estoque', id, JSON.stringify(i), JSON.stringify(updated));
          return updated;
        }
        return i;
      })
    );
    showToast('Insumo atualizado.');
  };

  const deleteInsumo = (id: string) => {
    const target = insumos.find((i) => i.id === id);
    if (!target) return;
    setInsumos((prev) => prev.filter((i) => i.id !== id));
    addAuditLog('EXCLUIR_INSUMO', 'estoque', id, target.nome, 'Excluído');
    showToast(`Insumo "${target.nome}" excluído.`);
  };

  const adjustInsumoStock = (id: string, novaQtd: number, motivo: string, responsavel: string) => {
    const target = insumos.find((i) => i.id === id);
    if (!target) return;
    const prevQtd = target.quantidade_atual;
    const diff = novaQtd - prevQtd;
    const userResp = responsavel || currentAdminUser.name || 'Fernando Euler';

    setInsumos((prev) =>
      prev.map((i) => {
        if (i.id === id) {
          const newStatus =
            novaQtd <= i.estoque_minimo * 0.5 ? 'critico' : novaQtd <= i.estoque_minimo ? 'baixo' : 'normal';
          return {
            ...i,
            quantidade_atual: novaQtd,
            status: newStatus,
            data_de_atualizacao: new Date().toISOString().split('T')[0]
          };
        }
        return i;
      })
    );

    const mov: StockMovement = {
      id: `mov_adj_${Date.now()}`,
      data: new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }),
      insumo_id: id,
      insumo_nome: target.nome,
      tipo: 'ajuste',
      motivo: 'ajuste_manual',
      quantidade: Math.abs(diff),
      unidade: target.unidade_de_medida,
      quantidade_anterior: prevQtd,
      nova_quantidade: novaQtd,
      diferenca: diff,
      custo_unitario: target.custo_unitario,
      custo_total: Math.abs(diff) * target.custo_unitario,
      responsavel: userResp,
      observacoes: motivo || 'Ajuste manual de inventário'
    };
    setStockMovements((prev) => [mov, ...prev]);

    addAuditLog(
      'AJUSTE_MANUAL_ESTOQUE',
      'estoque',
      id,
      `${prevQtd} ${target.unidade_de_medida}`,
      `${novaQtd} ${target.unidade_de_medida} (${diff >= 0 ? '+' : ''}${diff})`,
      motivo
    );
    showToast(`Estoque de "${target.nome}" ajustado para ${novaQtd} ${target.unidade_de_medida}.`);
  };

  const registerInsumoEntry = (
    insumoId: string,
    quantidade: number,
    custoUnitario: number,
    fornecedor: string,
    lote?: string,
    validade?: string,
    notaFiscal?: string,
    responsavel?: string
  ) => {
    const userResp = responsavel || currentAdminUser.name || 'Fernando Euler';
    let targetNome = 'Insumo';
    let targetUnidade = 'KG';
    let prevCusto = 0;
    let newWeightedAvg = custoUnitario;

    setInsumos((prev) =>
      prev.map((ins) => {
        if (ins.id === insumoId) {
          targetNome = ins.nome;
          targetUnidade = ins.unidade_de_medida;
          prevCusto = ins.custo_unitario;
          const currentTotalVal = ins.quantidade_atual * ins.custo_unitario;
          const addedTotalVal = quantidade * custoUnitario;
          const newQty = ins.quantidade_atual + quantidade;
          newWeightedAvg = newQty > 0 ? (currentTotalVal + addedTotalVal) / newQty : custoUnitario;
          newWeightedAvg = Math.round(newWeightedAvg * 100) / 100;

          const newStatus =
            newQty <= ins.estoque_minimo * 0.5 ? 'critico' : newQty <= ins.estoque_minimo ? 'baixo' : 'normal';

          return {
            ...ins,
            quantidade_atual: newQty,
            custo_unitario: newWeightedAvg,
            fornecedor: fornecedor || ins.fornecedor,
            validade: validade || ins.validade,
            lote: lote || ins.lote,
            status: newStatus,
            data_de_atualizacao: new Date().toISOString().split('T')[0]
          };
        }
        return ins;
      })
    );

    const historyItem: InsumoCostHistoryItem = {
      id: `ch_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      insumo_id: insumoId,
      insumo_nome: targetNome,
      data: new Date().toISOString().split('T')[0],
      fornecedor: fornecedor || 'Fornecedor Oficial',
      quantidade,
      unidade: targetUnidade as any,
      valor_anterior: prevCusto,
      novo_valor: custoUnitario,
      custo_total: quantidade * custoUnitario,
      lote,
      responsavel: userResp
    };
    setCostHistory((prev) => [historyItem, ...prev]);

    const movement: StockMovement = {
      id: `mov_in_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      data: new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }),
      insumo_id: insumoId,
      insumo_nome: targetNome,
      tipo: 'entrada',
      motivo: 'compra',
      quantidade,
      unidade: targetUnidade as any,
      custo_unitario: custoUnitario,
      custo_total: quantidade * custoUnitario,
      lote,
      validade,
      nota_fiscal: notaFiscal,
      fornecedor,
      responsavel: userResp,
      observacoes: `Entrada de compra: ${quantidade} ${targetUnidade} a R$ ${custoUnitario.toFixed(2)}`
    };
    setStockMovements((prev) => [movement, ...prev]);

    addAuditLog(
      'ENTRADA_INSUMO',
      'estoque',
      insumoId,
      `Custo anterior: R$ ${prevCusto.toFixed(2)}`,
      `Entrada +${quantidade} ${targetUnidade} (Novo Custo Médio: R$ ${newWeightedAvg.toFixed(2)})`,
      `Entrada de estoque de ${targetNome}`
    );
  };

  const registerInsumoExit = (
    insumoId: string,
    quantidade: number,
    motivo: StockMovement['motivo'],
    responsavel: string,
    observacoes?: string
  ) => {
    const userResp = responsavel || currentAdminUser.name || 'Fernando Euler';
    let targetNome = 'Insumo';
    let targetUnidade = 'KG';
    let unitCost = 0;

    setInsumos((prev) =>
      prev.map((ins) => {
        if (ins.id === insumoId) {
          targetNome = ins.nome;
          targetUnidade = ins.unidade_de_medida;
          unitCost = ins.custo_unitario;
          const newQty = Math.max(0, ins.quantidade_atual - quantidade);
          const newStatus =
            newQty <= ins.estoque_minimo * 0.5 ? 'critico' : newQty <= ins.estoque_minimo ? 'baixo' : 'normal';

          return {
            ...ins,
            quantidade_atual: newQty,
            status: newStatus,
            data_de_atualizacao: new Date().toISOString().split('T')[0]
          };
        }
        return ins;
      })
    );

    const movement: StockMovement = {
      id: `mov_out_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      data: new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }),
      insumo_id: insumoId,
      insumo_nome: targetNome,
      tipo: 'saida',
      motivo,
      quantidade,
      unidade: targetUnidade as any,
      custo_unitario: unitCost,
      custo_total: quantidade * unitCost,
      responsavel: userResp,
      observacoes: observacoes || `Saída por ${motivo}`
    };
    setStockMovements((prev) => [movement, ...prev]);
  };

  // Fichas Técnicas
  const createFichaTecnica = (ftData: Omit<FichaTecnica, 'id' | 'data_atualizacao'>) => {
    const newFt: FichaTecnica = {
      ...ftData,
      id: `ft_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      data_atualizacao: new Date().toISOString().split('T')[0]
    };
    setFichasTecnicas((prev) => [...prev, newFt]);
    addAuditLog('CRIAR_FICHA_TECNICA', 'produto', newFt.id, 'Inexistente', `${newFt.produto_nome} (${newFt.tamanho}) - Custo: R$ ${newFt.custo_total_estimado.toFixed(2)}`);
    showToast(`Ficha técnica da marmita "${newFt.produto_nome}" (${newFt.tamanho}) salva com sucesso.`);
  };

  const updateFichaTecnica = (id: string, updates: Partial<FichaTecnica>) => {
    setFichasTecnicas((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          const updated = {
            ...f,
            ...updates,
            data_atualizacao: new Date().toISOString().split('T')[0]
          };
          addAuditLog('ATUALIZAR_FICHA_TECNICA', 'produto', id, `R$ ${f.custo_total_estimado.toFixed(2)}`, `R$ ${updated.custo_total_estimado.toFixed(2)}`);
          return updated;
        }
        return f;
      })
    );
    showToast('Ficha técnica atualizada.');
  };

  const deleteFichaTecnica = (id: string) => {
    setFichasTecnicas((prev) => prev.filter((f) => f.id !== id));
    showToast('Ficha técnica removida.');
  };

  // Fornecedores
  const addFornecedor = (fornData: Omit<Fornecedor, 'id'>) => {
    const newForn: Fornecedor = {
      ...fornData,
      id: `forn_${Date.now()}`
    };
    setFornecedores((prev) => [...prev, newForn]);
    addAuditLog('CRIAR_FORNECEDOR', 'configuracao', newForn.id, 'Inexistente', newForn.nome);
    showToast(`Fornecedor "${newForn.nome}" cadastrado com sucesso.`);
  };

  const updateFornecedor = (id: string, updates: Partial<Fornecedor>) => {
    setFornecedores((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
    showToast('Fornecedor atualizado.');
  };

  const deleteFornecedor = (id: string) => {
    setFornecedores((prev) => prev.filter((f) => f.id !== id));
    showToast('Fornecedor excluído.');
  };

  // Pedidos de Compra
  const createPedidoCompra = (pedidoData: Omit<PedidoCompra, 'id'>) => {
    const newPedido: PedidoCompra = {
      ...pedidoData,
      id: `comp_${Date.now()}`
    };
    setPedidosCompra((prev) => [newPedido, ...prev]);
    addAuditLog('CRIAR_PEDIDO_COMPRA', 'configuracao', newPedido.id, 'Inexistente', `${newPedido.numero} - ${newPedido.fornecedor_nome} (R$ ${newPedido.valor_total.toFixed(2)})`);
    showToast(`Pedido de compra ${newPedido.numero} registrado.`);
  };

  const updatePedidoCompraStatus = (id: string, status: PedidoCompra['status']) => {
    const pedido = pedidosCompra.find((p) => p.id === id);
    if (!pedido) return;

    if (status === 'RECEBIDO' && pedido.status !== 'RECEBIDO') {
      pedido.itens.forEach((it) => {
        registerInsumoEntry(
          it.insumo_id,
          it.quantidade,
          it.custo_unitario,
          pedido.fornecedor_nome,
          undefined,
          undefined,
          pedido.numero,
          currentAdminUser.name
        );
      });
      showToast(`Pedido de compra ${pedido.numero} recebido com sucesso! Estoque e custo médio atualizados.`);
    }

    setPedidosCompra((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status,
              data_recebimento: status === 'RECEBIDO' ? new Date().toISOString().split('T')[0] : p.data_recebimento
            }
          : p
      )
    );
    addAuditLog('STATUS_PEDIDO_COMPRA', 'configuracao', id, pedido.status, status);
  };

  const deletePedidoCompra = (id: string) => {
    setPedidosCompra((prev) => prev.filter((p) => p.id !== id));
    showToast('Pedido de compra removido.');
  };

  // Ordens de Produção
  const createOrdemProducao = (opData: Omit<OrdemProducao, 'id'>) => {
    const newOp: OrdemProducao = {
      ...opData,
      id: `op_${Date.now()}`
    };
    setOrdensProducao((prev) => [newOp, ...prev]);
    addAuditLog('CRIAR_ORDEM_PRODUCAO', 'produto', newOp.id, 'Inexistente', `${newOp.numero}: ${newOp.quantidade_planejada}x ${newOp.produto_nome} (${newOp.tamanho})`);
    showToast(`Ordem de produção ${newOp.numero} criada.`);
  };

  const updateOrdemProducaoStatus = (
    id: string,
    status: OrdemProducao['status'],
    producedQty?: number,
    lostQty?: number,
    reason?: string
  ) => {
    const op = ordensProducao.find((o) => o.id === id);
    if (!op) return;

    if (status === 'PRODUZIDA' && op.status !== 'PRODUZIDA') {
      const finalProduced = producedQty !== undefined ? producedQty : op.quantidade_planejada;
      const finalLost = lostQty || 0;

      const ft = fichasTecnicas.find(
        (f) =>
          (f.produto_id === op.produto_id || f.produto_nome.includes(op.produto_nome)) &&
          f.tamanho === op.tamanho
      );

      if (ft) {
        ft.ingredientes.forEach((ing) => {
          const qtyNeeded = ing.quantidade * (finalProduced + finalLost);
          registerInsumoExit(
            ing.insumo_id,
            qtyNeeded,
            'producao',
            op.responsavel,
            `Consumo da OP ${op.numero} (${finalProduced} un de ${op.produto_nome})`
          );
        });

        ft.embalagens.forEach((emb) => {
          const qtyNeeded = emb.quantidade * finalProduced;
          registerInsumoExit(
            emb.insumo_id,
            qtyNeeded,
            'producao',
            op.responsavel,
            `Embalagens da OP ${op.numero}`
          );
        });
      }

      if (finalLost > 0) {
        registerDesperdicio({
          data: new Date().toISOString().split('T')[0],
          item_nome: `${op.produto_nome} (${op.tamanho})`,
          categoria: 'producao',
          quantidade: finalLost,
          unidade: 'UNIDADE',
          custo_estimado: (ft?.custo_total_estimado || 8.5) * finalLost,
          motivo: reason || 'Avaria ou descarte durante montagem/cocção',
          responsavel: op.responsavel
        });
      }

      showToast(`OP ${op.numero} finalizada! Insumos baixados no estoque.`);
    }

    setOrdensProducao((prev) =>
      prev.map((o) =>
        o.id === id
          ? {
              ...o,
              status,
              quantidade_produzida: producedQty !== undefined ? producedQty : o.quantidade_produzida,
              quantidade_perdida: lostQty !== undefined ? lostQty : o.quantidade_perdida,
              motivo_perda: reason || o.motivo_perda,
              horario_fim: status === 'PRODUZIDA' ? new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : o.horario_fim
            }
          : o
      )
    );
    addAuditLog('STATUS_ORDEM_PRODUCAO', 'produto', id, op.status, status);
  };

  const deleteOrdemProducao = (id: string) => {
    setOrdensProducao((prev) => prev.filter((o) => o.id !== id));
    showToast('Ordem de produção cancelada.');
  };

  // Desperdício
  const registerDesperdicio = (despData: Omit<DesperdicioRegistro, 'id'>) => {
    const newDesp: DesperdicioRegistro = {
      ...despData,
      id: `desp_${Date.now()}`
    };
    setDesperdicios((prev) => [newDesp, ...prev]);
    addAuditLog('REGISTRAR_DESPERDICIO', 'estoque', newDesp.id, 'Inexistente', `${newDesp.item_nome}: ${newDesp.quantidade} ${newDesp.unidade} (R$ ${newDesp.custo_estimado.toFixed(2)}) - ${newDesp.motivo}`);
    showToast(`Desperdício de "${newDesp.item_nome}" registrado.`);
  };

  const deleteDesperdicio = (id: string) => {
    setDesperdicios((prev) => prev.filter((d) => d.id !== id));
    showToast('Registro de desperdício removido.');
  };

  // Taxas e Custos Operacionais
  const updateTaxaPagamento = (id: string, updates: Partial<TaxaPagamento>) => {
    setTaxasPagamento((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
    showToast('Taxa de pagamento atualizada.');
  };

  const addCustoOperacional = (custoData: Omit<CustoOperacionalItem, 'id'>) => {
    const newCusto: CustoOperacionalItem = {
      ...custoData,
      id: `cop_${Date.now()}`
    };
    setCustosOperacionais((prev) => [...prev, newCusto]);
    showToast(`Custo operacional "${newCusto.nome}" cadastrado.`);
  };

  const updateCustoOperacional = (id: string, updates: Partial<CustoOperacionalItem>) => {
    setCustosOperacionais((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    showToast('Custo operacional atualizado.');
  };

  const deleteCustoOperacional = (id: string) => {
    setCustosOperacionais((prev) => prev.filter((c) => c.id !== id));
    showToast('Custo operacional excluído.');
  };

  const updateRealDeliveryCostSetting = (cost: number) => {
    setRealDeliveryCostSetting(cost);
    showToast(`Custo real de entrega atualizado para R$ ${cost.toFixed(2)} por entrega.`);
  };

  // Cálculos Gerenciais Derivados
  const getDreGerencial = (filtro: FinancialTimeFilter): DreGerencial => {
    return calculateDreGerencial(
      orders,
      fichasTecnicas,
      taxasPagamento,
      custosOperacionais,
      realDeliveryCostSetting,
      filtro
    );
  };

  const getProdutosMargem = (): ProdutoMargemItem[] => {
    return calculateProdutosMargem(products, pricing, fichasTecnicas, orders);
  };

  const getSugestoesCompraIA = (): SugestaoCompraIA[] => {
    return calculateSugestoesCompraIA(insumos, ordensProducao, fichasTecnicas);
  };

  const updatePrice = (category: MarmitaCategory, size: MarmitaSize, newPrice: number) => {
    const prevItem = pricing.find((item) => item.category === category && item.size === size);
    const prevPriceStr = prevItem ? `R$ ${prevItem.price.toFixed(2).replace('.', ',')}` : 'N/A';
    const newPriceStr = `R$ ${newPrice.toFixed(2).replace('.', ',')}`;

    setPricing((prev) =>
      prev.map((item) =>
        item.category === category && item.size === size
          ? { ...item, price: newPrice }
          : item
      )
    );

    addAuditLog(
      'ALTERAR_PRECO_OFICIAL',
      'preco',
      `${category}_${size}`,
      prevPriceStr,
      newPriceStr,
      `Reajuste de tabela mestre pelo painel MERMI CONTROL (${currentAdminUser.role} - ${currentAdminUser.name})`
    );

    showToast(`Tabela de preço atualizada: ${category.toUpperCase()} ${size} -> ${newPriceStr}`);
  };

  const redeemReward = (rewardId: string) => {
    const reward = rewards.find((r) => r.id === rewardId);
    if (!reward) {
      return { success: false, message: 'Recompensa não encontrada no catálogo da semana.' };
    }

    if (user.mermiPoints < reward.pointsCost) {
      return {
        success: false,
        message: `Saldo insuficiente! Você tem ${user.mermiPoints} Points, mas este resgate custa ${reward.pointsCost} Points.`
      };
    }

    if (reward.stock <= 0) {
      return { success: false, message: 'Ops! O estoque semanal deste item esgotou.' };
    }

    setRewards((prev) =>
      prev.map((r) => (r.id === rewardId ? { ...r, stock: r.stock - 1 } : r))
    );

    const record: RedemptionRecord = {
      id: `red_${Date.now()}`,
      rewardId: reward.id,
      rewardTitle: reward.title,
      pointsSpent: reward.pointsCost,
      date: new Date().toLocaleDateString('pt-BR'),
      code: `MERMI-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      status: 'Disponível',
    };

    setRedemptions((prev) => [record, ...prev]);

    // Registra transação oficial de resgate
    recordTransaction({
      amount: -reward.pointsCost,
      type: 'utilizado',
      origin: 'resgate',
      description: `Resgate de Recompensa: ${reward.title}`,
      referenceId: record.id
    });

    // Persistir débito no Cloud SQL PostgreSQL points_ledger de forma assíncrona
    apiClient.points.redeemReward({
      rewardId: reward.id,
      rewardTitle: reward.title,
      pointsCost: reward.pointsCost,
      idempotencyKey: `red_${record.id}`,
    }).then((res) => {
      if (res && typeof res.newBalance === 'number') {
        setUser((u) => ({ ...u, mermiPoints: res.newBalance }));
      }
    }).catch((err) => {
      console.warn('Erro ao sincronizar resgate de pontos no PostgreSQL:', err);
    });

    unlockBadgeDirect('bdg_primeira_recompensa');

    showToast(`Resgate confirmado! Você utilizou ${reward.pointsCost} Points. Código: ${record.code}`);

    return { success: true, message: 'Resgate realizado com sucesso!', record };
  };

  const presetPoints = (_points: number) => {
    // Proibido bypass de saldo. O saldo de MerMi Points é estritamente derivado dos lançamentos imutáveis no points_ledger
    console.warn('[SECURITY] presetPoints bloqueado: o saldo deve vir exclusivamente do points_ledger.');
  };

  const resetToOfficialDefaults = () => {
    setUser(INITIAL_USER);
    setWeeklyMember(INITIAL_WEEKLY_MEMBER);
    setRewards(OFFICIAL_WEEKLY_REWARDS);
    setPricing(INITIAL_PRICING);
    setRedemptions([]);
    setHomeBlocks(INITIAL_HOME_BLOCKS);
    setBanners(INITIAL_BANNERS);
    setCampaigns(INITIAL_CAMPAIGNS);
    setPromotions(INITIAL_PROMOTIONS);
    setPosts(INITIAL_POSTS);
    setArticles(INITIAL_ARTICLES);
    setPublications(INITIAL_PUBLICATIONS);
    setAnalyticsEvents([]);
    setAudienceProfileState('standard');
    setDrops(INITIAL_DROPS_SURPRESA);
    setDropClaims(INITIAL_DROP_CLAIMS);
    setTransactions(INITIAL_TRANSACTIONS);
    setEarningRules(INITIAL_EARNING_RULES);
    setUserLevels(INITIAL_USER_LEVELS);
    setBadges(INITIAL_BADGES);
    setMissions(INITIAL_MISSIONS);
    setStreak(INITIAL_STREAK);
    setProcessedOrderIds(['PED-1024', 'PED-1055', 'PED-2101']);
    showToast('Dados restaurados para os padrões oficiais do Bloco 01 a 05.');
  };

  // --- MERMI DROP SURPRESA METHODS ---
  const claimDrop = (dropId: string) => {
    const drop = drops.find((d) => d.id === dropId);
    if (!drop) {
      return { success: false, message: 'Drop Surpresa não encontrado ou encerrado.' };
    }
    if (!drop.active) {
      return { success: false, message: 'Este Drop Surpresa não está ativo no momento.' };
    }
    if (drop.quantityClaimed >= drop.quantityTotal) {
      return { success: false, message: 'Lote esgotado! Fique atento ao próximo Drop.' };
    }
    if (user.mermiPoints < drop.minPointsRequired) {
      return {
        success: false,
        message: `Pontos insuficientes! Este Drop exige mínimo de ${drop.minPointsRequired} Points (você tem ${user.mermiPoints}).`
      };
    }
    if (user.ordersCount < drop.minOrdersRequired) {
      return {
        success: false,
        message: `Requisito de pedidos não atingido! Exige ao menos ${drop.minOrdersRequired} pedidos no app.`
      };
    }

    // Se for prêmio em pontos, credita imediatamente via motor de transações
    if (drop.rewardType === 'points' && typeof drop.rewardValue === 'number') {
      recordTransaction({
        amount: Number(drop.rewardValue),
        type: 'ganho',
        origin: 'drop',
        description: `Drop Surpresa: ${drop.title} (+${drop.rewardValue} pts)`,
        referenceId: drop.id
      });
    }

    // Incrementa quantidade resgatada
    setDrops((prev) =>
      prev.map((d) => (d.id === dropId ? { ...d, quantityClaimed: d.quantityClaimed + 1 } : d))
    );

    const newRecord: DropClaimRecord = {
      id: `claim_${Date.now()}`,
      dropId: drop.id,
      dropTitle: drop.title,
      userId: user.id,
      userName: user.name,
      rewardType: drop.rewardType,
      rewardLabel: drop.rewardLabel,
      claimedAt: 'Agora mesmo',
      expiresAt: 'Válido por 14 dias',
      status: 'resgatado',
      codeSnippet: `DROP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    };

    setDropClaims((prev) => [newRecord, ...prev]);
    showToast(`🎉 DROP RESGATADO! Você desbloqueou: ${drop.rewardLabel}!`);

    return {
      success: true,
      message: `Parabéns! Recompensa desbloqueada: ${drop.rewardLabel}`,
      reward: drop.rewardLabel
    };
  };

  const createDrop = (newDropData: Omit<DropSurpresaItem, 'id' | 'quantityClaimed'>) => {
    const newDrop: DropSurpresaItem = {
      ...newDropData,
      id: `drop_${Date.now()}`,
      quantityClaimed: 0
    };
    setDrops((prev) => [newDrop, ...prev]);
    showToast('Novo Drop Surpresa configurado com sucesso!');
  };

  const updateDrop = (id: string, updates: Partial<DropSurpresaItem>) => {
    setDrops((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updates } : d))
    );
    showToast('Drop Surpresa atualizado!');
  };

  const deleteDrop = (id: string) => {
    setDrops((prev) => prev.filter((d) => d.id !== id));
    showToast('Drop Surpresa removido.');
  };

  const toggleDropStatus = (id: string) => {
    setDrops((prev) =>
      prev.map((d) => (d.id === id ? { ...d, active: !d.active } : d))
    );
  };

  // --- BLOCO 03 METHODS ---

  // Home Blocks
  const updateHomeBlocks = (newBlocks: HomeBlockConfig[]) => {
    setHomeBlocks(newBlocks);
    showToast('Ordem dos blocos da Home atualizada.');
  };

  const toggleHomeBlock = (id: string) => {
    setHomeBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, enabled: !b.enabled } : b))
    );
  };

  const moveHomeBlock = (id: string, direction: 'up' | 'down') => {
    setHomeBlocks((prev) => {
      const sorted = [...prev].sort((a, b) => a.order - b.order);
      const index = sorted.findIndex((b) => b.id === id);
      if (index === -1) return prev;
      if (direction === 'up' && index === 0) return prev;
      if (direction === 'down' && index === sorted.length - 1) return prev;

      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      const temp = sorted[index];
      sorted[index] = sorted[targetIndex];
      sorted[targetIndex] = temp;

      return sorted.map((b, idx) => ({ ...b, order: idx + 1 }));
    });
  };

  // Banners
  const addBanner = (bannerData: Omit<BannerItem, 'id'>) => {
    const newBanner: BannerItem = {
      ...bannerData,
      id: `banner_${Date.now()}`,
    };
    setBanners((prev) => [...prev, newBanner]);
    showToast('Banner criado com sucesso!');
  };

  const updateBanner = (id: string, updates: Partial<BannerItem>) => {
    setBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
    showToast('Banner atualizado!');
  };

  const deleteBanner = (id: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));
    showToast('Banner excluído.');
  };

  const duplicateBanner = (id: string) => {
    const original = banners.find((b) => b.id === id);
    if (!original) return;
    const duplicated: BannerItem = {
      ...original,
      id: `banner_${Date.now()}`,
      title: `${original.title} (Cópia)`,
      order: banners.length + 1,
      active: false,
    };
    setBanners((prev) => [...prev, duplicated]);
    showToast('Banner duplicado! (Definido como inativo para edição)');
  };

  const toggleBannerActive = (id: string) => {
    setBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, active: !b.active } : b))
    );
  };

  const reorderBanners = (orderedBanners: BannerItem[]) => {
    setBanners(orderedBanners.map((b, idx) => ({ ...b, order: idx + 1 })));
    showToast('Ordem dos banners atualizada.');
  };

  // Campaigns
  const addCampaign = (campData: Omit<CampaignItem, 'id'>) => {
    const newCamp: CampaignItem = {
      ...campData,
      id: `camp_${Date.now()}`,
    };
    setCampaigns((prev) => [...prev, newCamp]);
    showToast('Campanha criada com sucesso!');
  };

  const updateCampaign = (id: string, updates: Partial<CampaignItem>) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    showToast('Campanha atualizada!');
  };

  const deleteCampaign = (id: string) => {
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
    showToast('Campanha excluída.');
  };

  // Promotions
  const updatePromotion = (id: string, updates: Partial<PromotionOffer>) => {
    setPromotions((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    showToast('Oferta atualizada!');
  };

  const addPromotion = (promoData: Omit<PromotionOffer, 'id'>) => {
    const newPromo: PromotionOffer = {
      ...promoData,
      id: `promo_${Date.now()}`,
    };
    setPromotions((prev) => [...prev, newPromo]);
    showToast('Oferta criada!');
  };

  const deletePromotion = (id: string) => {
    setPromotions((prev) => prev.filter((p) => p.id !== id));
    showToast('Oferta removida.');
  };

  // --- POSTS & CAMPANHAS: CENTRO DE CONTEÚDO ---
  const addPublication = (pubData: Omit<ContentPublication, 'id'>) => {
    const newPub: ContentPublication = {
      ...pubData,
      id: `pub_${Date.now()}`
    };
    setPublications((prev) => [newPub, ...prev]);
    showToast('Publicação criada com sucesso no Centro de Conteúdo!');
  };

  const updatePublication = (id: string, updates: Partial<ContentPublication>) => {
    setPublications((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    showToast('Publicação atualizada!');
  };

  const deletePublication = (id: string) => {
    setPublications((prev) => prev.filter((p) => p.id !== id));
    showToast('Publicação removida.');
  };

  const togglePublicationActive = (id: string) => {
    setPublications((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ativo: !p.ativo } : p))
    );
  };

  // Posts & Social
  const togglePostLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const isLiked = !p.isLiked;
        return {
          ...p,
          isLiked,
          likesCount: isLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1),
        };
      })
    );
  };

  const togglePostSave = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const isSaved = !p.isSaved;
        return {
          ...p,
          isSaved,
          savesCount: isSaved ? p.savesCount + 1 : Math.max(0, p.savesCount - 1),
        };
      })
    );
    showToast('Item salvo na sua lista de favoritos!');
  };

  const addPostComment = (postId: string, text: string) => {
    if (!text.trim()) return;
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const newComment = {
          id: `c_${Date.now()}`,
          userName: user.name,
          userAvatar: user.avatar,
          text: text.trim(),
          timestamp: 'Agora',
        };
        return {
          ...p,
          commentsCount: p.commentsCount + 1,
          comments: [...(p.comments || []), newComment],
        };
      })
    );
    showToast('Comentário publicado no post!');
  };

  const updatePost = (id: string, updates: Partial<PostItem>) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    showToast('Post atualizado!');
  };

  const deletePost = (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
    showToast('Post excluído.');
  };

  const createPost = (postData: Omit<PostItem, 'id'>) => {
    const newPost: PostItem = {
      ...postData,
      id: `post_${Date.now()}`,
    };
    setPosts((prev) => [newPost, ...prev]);
    showToast('Novo post publicado com sucesso!');
  };

  // Articles
  const updateArticle = (id: string, updates: Partial<ContentArticle>) => {
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
    showToast('Artigo atualizado!');
  };

  // Analytics
  const trackEvent = (type: AnalyticsEvent['type'], targetId: string, targetTitle: string) => {
    const event: AnalyticsEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type,
      targetId,
      targetTitle,
      timestamp: new Date().toLocaleTimeString('pt-BR'),
      userId: user.id,
    };
    setAnalyticsEvents((prev) => [event, ...prev].slice(0, 300));
  };

  const clearAnalytics = () => {
    setAnalyticsEvents([]);
    showToast('Histórico de eventos de analytics limpo.');
  };

  // Audience Simulation Switcher
  const setAudienceProfile = (profile: AudienceProfileType) => {
    setAudienceProfileState(profile);
    // Em produção com dados reais: Não injetamos personas ou valores inventados no perfil do usuário real
    showToast(`Visualização ajustada para: ${profile}`);
  };

  // --- BLOCO 04: AÇÕES DE CARDÁPIO, PRODUTOS E CATEGORIAS ---
  const addProduct = (product: Omit<FoodProduct, 'id' | 'created_at' | 'updated_at'>) => {
    const newProd: FoodProduct = {
      ...product,
      id: `prod_${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setProducts(prev => [newProd, ...prev]);
    showToast(`Prato "${newProd.name}" cadastrado com sucesso.`);
  };

  const updateProduct = (id: string, updates: Partial<FoodProduct>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p));
    showToast('Prato atualizado no Cardápio.');
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast('Prato removido do cardápio.');
  };

  const toggleProductAvailability = (id: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const next = !p.availability;
        showToast(`Prato ${next ? 'marcado como Disponível' : 'marcado como Indisponível'}.`);
        return { ...p, availability: next, updated_at: new Date().toISOString() };
      }
      return p;
    }));
  };

  const toggleProductActive = (id: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const next = !p.active;
        showToast(`Prato ${next ? 'ativado no catálogo' : 'desativado do catálogo'}.`);
        return { ...p, active: next, updated_at: new Date().toISOString() };
      }
      return p;
    }));
  };

  const refreshProducts = async (): Promise<void> => {
    try {
      const res = await apiClient.products.getProducts();
      if (!res || !res.products) return;
      setProducts(prev => {
        return prev.map(p => {
          const serverP = res.products.find((sp: any) => sp.id === p.id);
          if (serverP) {
            const resolvedImg = serverP.imageUrl || serverP.image || '';
            return {
              ...p,
              name: serverP.name || p.name,
              image: resolvedImg,
              imageUrl: resolvedImg,
              primaryImageAssetId: serverP.primaryImageAssetId || null,
              assetName: serverP.assetName || undefined,
              description: serverP.description || p.description,
            };
          }
          return p;
        });
      });
    } catch (err) {
      console.warn('Erro ao recarregar produtos do PostgreSQL:', err);
    }
  };

  const linkProductImageAsset = async (
    productId: string,
    assetId: string | null
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await apiClient.products.linkImageAsset(productId, assetId);
      if (res && res.success) {
        const resolvedUrl = res.product?.imageUrl || '';
        setProducts(prev =>
          prev.map(p => {
            if (p.id === productId) {
              return {
                ...p,
                primaryImageAssetId: assetId,
                image: resolvedUrl,
                imageUrl: resolvedUrl,
                assetName: res.product?.assetName,
                updated_at: new Date().toISOString(),
              };
            }
            return p;
          })
        );
        showToast(
          res.message ||
            (assetId
              ? 'Imagem vinculada ao prato com sucesso!'
              : 'Vínculo de imagem removido.')
        );
        // Sincronizar em background
        refreshProducts();
        return { success: true, message: res.message };
      }
      return { success: false, message: 'Falha ao vincular imagem.' };
    } catch (err: any) {
      const msg = err.message || 'Erro ao vincular imagem.';
      showToast(`Erro: ${msg}`);
      throw err;
    }
  };

  // Categorias Administráveis
  const createMenuCategory = (cat: MenuCategoryDef) => {
    setMenuCategories(prev => [...prev, cat]);
    showToast(`Categoria "${cat.name}" criada.`);
  };

  const updateMenuCategory = (id: string, updates: Partial<MenuCategoryDef>) => {
    setMenuCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteMenuCategory = (id: string) => {
    setMenuCategories(prev => prev.filter(c => c.id !== id));
    showToast('Categoria removida.');
  };

  // Ingredientes Personalizáveis
  const addCustomIngredient = (ing: Omit<CustomIngredientOption, 'id'>) => {
    const newIng: CustomIngredientOption = {
      ...ing,
      id: `ing_${Date.now()}`
    };
    setCustomIngredients(prev => [...prev, newIng]);
    showToast(`Ingrediente "${newIng.name}" adicionado.`);
  };

  const updateCustomIngredient = (id: string, updates: Partial<CustomIngredientOption>) => {
    setCustomIngredients(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
  };

  const toggleIngredientAvailability = (id: string) => {
    setCustomIngredients(prev => prev.map(i => i.id === id ? { ...i, available: !i.available } : i));
  };

  // Carrinho de Compras
  const addToCart = (item: Omit<CartItemProduct, 'id'>) => {
    const newItem: CartItemProduct = {
      ...item,
      id: `cart_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
    };
    setCartItems(prev => [newItem, ...prev]);
    showToast(`"${item.name}" adicionado ao carrinho!`);
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCartItems(prev =>
      prev
        .map(item => {
          if (item.id === id) {
            const nextQty = item.quantity + delta;
            if (nextQty <= 0) return null;
            return {
              ...item,
              quantity: nextQty,
              totalPrice: Number((item.unitPrice * nextQty).toFixed(2))
            };
          }
          return item;
        })
        .filter(Boolean) as CartItemProduct[]
    );
  };

  const removeCartItem = (id: string) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
    showToast('Item removido do carrinho.');
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const cleaned = code.trim().toUpperCase();
    const found = coupons.find(c => c.code.toUpperCase() === cleaned);
    if (!found) {
      return { success: false, message: 'Cupom inválido ou não encontrado.' };
    }
    const calculation = calculateOrderPrice(cartItems, found, deliveryType, deliveryFeeSetting, freeDeliveryThreshold);
    const validation = validateCoupon(found, calculation.subtotal, cartItems);
    if (!validation.isValid) {
      return { success: false, message: validation.errorReason || 'Cupom não aplicável a este pedido.' };
    }
    setAppliedCoupon(found);
    showToast(`Cupom ${found.code} aplicado com sucesso! Desconto de R$ ${validation.discountAmount.toFixed(2).replace('.', ',')}.`);
    return { success: true, message: 'Cupom aplicado com sucesso!' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Cupom removido.');
  };

  const updateDeliverySettings = (fee: number, threshold: number) => {
    setDeliveryFeeSetting(fee);
    setFreeDeliveryThreshold(threshold);
    try {
      localStorage.setItem(STORAGE_KEYS.DELIVERY_FEE, JSON.stringify(fee));
      localStorage.setItem(STORAGE_KEYS.FREE_DELIVERY_THRESHOLD, JSON.stringify(threshold));
    } catch {}
    showToast('Configurações de frete atualizadas.');
  };

  // Endereços
  const addAddress = (addr: Omit<DeliveryAddress, 'id'>) => {
    const newAddr: DeliveryAddress = {
      ...addr,
      id: `addr_${Date.now()}`
    };
    setUserAddresses(prev => [newAddr, ...prev]);
    if (newAddr.isDefault) {
      setSelectedAddress(newAddr);
    }
    showToast('Novo endereço cadastrado com sucesso.');
  };

  const updateAddress = (id: string, updates: Partial<DeliveryAddress>) => {
    setUserAddresses(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
    if (selectedAddress.id === id) {
      setSelectedAddress(prev => ({ ...prev, ...updates }));
    }
    showToast('Endereço atualizado.');
  };

  const deleteAddress = (id: string) => {
    setUserAddresses(prev => {
      const filtered = prev.filter(a => a.id !== id);
      if (selectedAddress.id === id && filtered.length > 0) {
        setSelectedAddress(filtered[0]);
      }
      return filtered;
    });
    showToast('Endereço removido.');
  };

  // Pedidos & Checkout (Integrado a MerMi Points Bloco 05)
  const createOrder = (orderData: { paymentMethod: PaymentMethod; notes?: string }): { success: boolean; orderId?: string; message: string } => {
    if (cartItems.length === 0) {
      return { success: false, message: 'Seu carrinho está vazio.' };
    }

    const priceCalc = calculateOrderPrice(cartItems, appliedCoupon, deliveryType, deliveryFeeSetting, freeDeliveryThreshold);
    const newOrderId = `PED-${Math.floor(1000 + Math.random() * 9000)}`;

    // Proteção contra duplicidade de concessão de pontos
    if (processedOrderIds.includes(newOrderId)) {
      return { success: false, message: 'Este pedido já foi registrado anteriormente.' };
    }

    // Regra oficial de pontos do MERMI CONTROL
    const isFirstOrder = (user.ordersCount || 0) === 0;
    const eligibleCalc = calculateOrderEligiblePoints(cartItems.length, priceCalc.subtotal, isFirstOrder, earningRules);
    const finalPointsEarned = eligibleCalc.totalPoints;

    const newOrder: OrderEntity = {
      order_id: newOrderId,
      user_id: user.id || 'user_mermi_official',
      items: [...cartItems],
      subtotal: priceCalc.subtotal,
      discount: priceCalc.discount,
      delivery_fee: priceCalc.deliveryFee,
      total: priceCalc.total,
      points_earned: finalPointsEarned,
      points_used: 0,
      coupon_id: appliedCoupon?.id,
      coupon_code: appliedCoupon?.code,
      address: selectedAddress,
      delivery_type: deliveryType,
      estimated_delivery_time: 'Hoje, previsão de 35 a 45 minutos',
      payment_method: orderData.paymentMethod,
      payment_status: 'pendente',
      order_status: 'pedido_recebido',
      timeline: [
        { status: 'pedido_recebido', label: 'Pedido Recebido', description: 'Recebemos seu pedido com sucesso no sistema', timestamp: 'Agora', completed: true },
        { status: 'pagamento_confirmado', label: 'Aguardando Pagamento', description: `${orderData.paymentMethod === 'pix' ? 'PIX' : 'Cartão'} em processamento com o gateway`, timestamp: 'Agora', completed: false },
        { status: 'em_preparacao', label: 'Em Preparação', description: 'Cozinha separando os ingredientes frescos', timestamp: 'Aguardando', completed: false },
        { status: 'em_producao', label: 'Em Produção', description: 'Marmitas em cozimento saudável', timestamp: 'Aguardando', completed: false },
        { status: 'embalado', label: 'Embalado', description: 'Selagem a vácuo térmica e lacre de segurança oficial', timestamp: 'Aguardando', completed: false },
        { status: 'saiu_para_entrega', label: 'Saiu para Entrega', description: 'Entregador parceiro a caminho', timestamp: 'Aguardando', completed: false },
        { status: 'entregue', label: 'Entregue', description: 'Pedido entregue no destino', timestamp: 'Aguardando', completed: false }
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setOrders(prev => [newOrder, ...prev]);

    // Tentar persistir no backend central SQLite via API
    apiClient.orders.create({
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        line: item.line,
        size: item.size,
        quantity: item.quantity,
        customization: item.customMarmita
      })),
      address: {
        street: selectedAddress.street,
        number: selectedAddress.number,
        complement: selectedAddress.complement,
        neighborhood: selectedAddress.neighborhood,
        city: selectedAddress.city,
        state: selectedAddress.state,
        zipCode: selectedAddress.zipCode
      },
      paymentMethod: orderData.paymentMethod,
      couponCode: appliedCoupon?.code,
      notes: orderData.notes,
      pointsToUse: 0
    }).then((serverRes: any) => {
      if (serverRes && serverRes.orderId) {
        // Atualizar com ID e valores autoritativos calculados pelo backend
        setOrders(current => current.map(o => o.order_id === newOrderId ? { ...o, order_id: serverRes.orderId, total: serverRes.total } : o));
      }
    }).catch((err: any) => {
      console.warn('Backend SQLite indisponível ou offline para pedidos:', err);
    });

    // Registrar transação oficial no histórico de MerMi Points
    recordTransaction({
      amount: finalPointsEarned,
      type: 'ganho',
      origin: isFirstOrder ? 'primeira_compra' : 'compra',
      description: `Pedido ${newOrderId} Realizado (${cartItems.length} marmita${cartItems.length > 1 ? 's' : ''})`,
      referenceId: newOrderId
    });

    // Registra ID para proteção de duplicidade
    setProcessedOrderIds(prev => [...prev, newOrderId]);

    // Desbloquear badges iniciais se primeiro pedido
    if (isFirstOrder) {
      unlockBadgeDirect('bdg_primeira_marmita');
      unlockBadgeDirect('bdg_primeiro_pedido');
    }

    // Incrementar contador de pedidos
    setUser(u => ({ ...u, ordersCount: (u.ordersCount || 0) + 1 }));

    // Atualizar contador do cupom
    if (appliedCoupon) {
      setCoupons(prev => prev.map(c => c.id === appliedCoupon.id ? { ...c, usageCount: c.usageCount + 1 } : c));
    }

    clearCart();

    // Disparar Notificação automática oficial de criação de pedido (Bloco 12)
    triggerEventNotification('ORDER_CREATED', {
      order_number: newOrderId,
      order_total: priceCalc.total.toFixed(2).replace('.', ','),
      items_count: cartItems.length
    });

    showToast(`Pedido #${newOrderId} gerado com sucesso! Aguardando liquidação do pagamento (${orderData.paymentMethod.toUpperCase()}).`);
    return { success: true, orderId: newOrderId, message: 'Pedido gerado! Aguardando pagamento.' };
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    const existing = orders.find(o => o.order_id === orderId);
    if (existing) {
      const canonicalMap: Record<OrderStatus, CanonicalOrderStatus> = {
        'pedido_recebido': 'PENDING',
        'pagamento_confirmado': 'CONFIRMED',
        'em_preparacao': 'PREPARING',
        'em_producao': 'PREPARING',
        'embalado': 'READY',
        'saiu_para_entrega': 'SHIPPED',
        'entregue': 'DELIVERED',
        'cancelado': 'CANCELLED',
        'pagamento_recusado': 'CANCELLED',
        'problema_entrega': 'CANCELLED'
      };
      const fromCan = canonicalMap[existing.order_status] || 'PENDING';
      const toCan = canonicalMap[newStatus] || 'CONFIRMED';
      const transition = validateOrderStateTransition(fromCan, toCan, currentAdminUser?.role === 'OWNER');
      if (!transition.allowed) {
        showToast(`⚠️ Transição bloqueada: ${transition.reason}`);
        return;
      }
      addAuditLog('STATUS_PEDIDO_MAQUINA_ESTADOS', 'pedido', orderId, existing.order_status, newStatus, transition.reason);
    }

    setOrders(prev => prev.map(order => {
      if (order.order_id === orderId) {
        if (newStatus === 'saiu_para_entrega') {
          triggerEventNotification('ORDER_SHIPPED', {
            order_number: order.order_id,
            delivery_address: order.address?.street || 'Seu endereço cadastrado'
          });
        } else if (newStatus === 'entregue') {
          triggerEventNotification('ORDER_DELIVERED', {
            order_number: order.order_id
          });
        }

        const updatedTimeline = order.timeline.map(t => {
          if (t.status === newStatus) {
            return { ...t, completed: true, timestamp: 'Atualizado agora' };
          }
          return t;
        });
        return {
          ...order,
          order_status: newStatus,
          timeline: updatedTimeline,
          updated_at: new Date().toISOString()
        };
      }
      return order;
    }));
    showToast(`Status do pedido ${orderId} atualizado para "${newStatus}".`);
  };

  const repeatOrder = (orderId: string): { success: boolean; message: string } => {
    const targetOrder = orders.find(o => o.order_id === orderId);
    if (!targetOrder) {
      return { success: false, message: 'Pedido não encontrado.' };
    }

    const unavailableItems: string[] = [];
    const validItems: CartItemProduct[] = [];

    targetOrder.items.forEach(item => {
      if (item.productId) {
        const prod = products.find(p => p.id === item.productId);
        if (prod && prod.active && prod.availability) {
          validItems.push({
            ...item,
            id: `cart_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
          });
        } else {
          unavailableItems.push(item.name);
        }
      } else {
        validItems.push({
          ...item,
          id: `cart_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
        });
      }
    });

    if (validItems.length === 0) {
      return { success: false, message: 'Todos os itens deste pedido estão temporariamente indisponíveis no momento.' };
    }

    setCartItems(prev => [...validItems, ...prev]);

    if (unavailableItems.length > 0) {
      showToast(`Pratos adicionados! Atenção: ${unavailableItems.join(', ')} estão indisponíveis.`);
      return { success: true, message: 'Itens adicionados com aviso de indisponibilidade parcial.' };
    }

    showToast(`Pratos do pedido ${orderId} adicionados ao carrinho!`);
    return { success: true, message: 'Itens adicionados com sucesso ao carrinho!' };
  };

  const cancelOrder = (orderId: string, reason?: string) => {
    setOrders(prev => prev.map(o => o.order_id === orderId ? {
      ...o,
      order_status: 'cancelado',
      updated_at: new Date().toISOString()
    } : o));
    showToast(`Pedido ${orderId} cancelado. ${reason ? `Motivo: ${reason}` : ''}`);
  };

  // Cupons Admin
  const createCoupon = (coupon: Omit<CouponRule, 'id' | 'usageCount'>) => {
    const newC: CouponRule = {
      ...coupon,
      id: `coup_${Date.now()}`,
      usageCount: 0
    };
    setCoupons(prev => [newC, ...prev]);
    showToast(`Cupom ${newC.code} criado com sucesso.`);
  };

  const updateCoupon = (id: string, updates: Partial<CouponRule>) => {
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    showToast('Cupom atualizado.');
  };

  const deleteCoupon = (id: string) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
    showToast('Cupom removido.');
  };

  const toggleCouponActive = (id: string) => {
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, active: !c.active } : c));
  };

  // --- BLOCO 06: MERMI RUN METHODS ---
  const createRaceEvent = (eventData: Omit<RaceEvent, 'id' | 'slug' | 'createdAt'>): RaceEvent => {
    const slug = eventData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newEvent: RaceEvent = {
      ...eventData,
      id: `race_${Date.now()}`,
      slug,
      createdAt: new Date().toISOString()
    };
    setRaceEvents(prev => [newEvent, ...prev]);
    showToast(`Corrida "${newEvent.name}" criada com sucesso!`);
    return newEvent;
  };

  const updateRaceEvent = (id: string, updates: Partial<RaceEvent>) => {
    setRaceEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
    showToast('Evento de corrida atualizado com sucesso.');
  };

  const deleteRaceEvent = (id: string) => {
    setRaceEvents(prev => prev.filter(e => e.id !== id));
    showToast('Evento de corrida removido.');
  };

  const createRaceKit = (kitData: Omit<RaceKitItem, 'id'>) => {
    const newKit: RaceKitItem = {
      ...kitData,
      id: `kit_${Date.now()}`
    };
    setRaceKits(prev => [...prev, newKit]);
    showToast(`Kit "${newKit.name}" cadastrado.`);
  };

  const updateRaceKit = (id: string, updates: Partial<RaceKitItem>) => {
    setRaceKits(prev => prev.map(k => k.id === id ? { ...k, ...updates } : k));
    showToast('Kit atualizado.');
  };

  const deleteRaceKit = (id: string) => {
    setRaceKits(prev => prev.filter(k => k.id !== id));
    showToast('Kit removido.');
  };

  const registerForRace = (data: {
    eventId: string;
    categoryId: string;
    kitId: string;
    shirtSize?: ShirtSize;
    participantName: string;
    participantDocument: string;
    participantBirthDate?: string;
    participantEmail: string;
    participantPhone: string;
    pointsToUse?: number;
    paymentMethod: 'gratuito' | 'pix' | 'cartao' | 'dinheiro';
  }): { success: boolean; registration?: RaceRegistration; message: string } => {
    const event = raceEvents.find(e => e.id === data.eventId);
    if (!event) return { success: false, message: 'Evento não encontrado.' };

    const category = event.categories.find(c => c.id === data.categoryId);
    if (!category) return { success: false, message: 'Categoria não encontrada.' };

    const kit = raceKits.find(k => k.id === data.kitId);
    if (!kit) return { success: false, message: 'Kit não encontrado.' };

    const currentRegsForCategory = raceRegistrations.filter(r => r.eventId === data.eventId && r.categoryId === data.categoryId && r.paymentStatus !== 'cancelado').length;
    if (category.maxParticipants && currentRegsForCategory >= category.maxParticipants) {
      return { success: false, message: 'Vagas esgotadas para esta categoria.' };
    }

    const basePrice = category.batches[0]?.price || 0;
    let finalPrice = basePrice;
    const pointsUsed = data.pointsToUse || 0;
    let discountAmount = 0;

    if (pointsUsed > 0) {
      if (user.mermiPoints < pointsUsed) {
        return { success: false, message: `Saldo insuficiente de Points (${user.mermiPoints} disponíveis).` };
      }
      const discount = calculatePointsDiscount(pointsUsed, basePrice, event.pointsConfig);
      finalPrice = discount.finalPrice;
      discountAmount = discount.discountReais;
      recordTransaction({
        amount: -pointsUsed,
        type: 'utilizado',
        origin: 'inscricao_corrida',
        description: `Desconto na inscrição: ${event.name} (${category.distanceLabel})`,
        referenceId: event.id
      });
    }

    const regId = `reg_${Date.now()}`;
    const bibNumber = 100 + raceRegistrations.filter(r => r.eventId === data.eventId).length + 1;
    const pointsEarned = event.pointsConfig.pointsRewardRegistration || category.pointsOnRegistration || 0;

    const newReg: RaceRegistration = {
      id: regId,
      eventId: event.id,
      eventName: event.name,
      eventDate: event.date,
      eventLocation: `${event.locationName}, ${event.city} - ${event.state}`,
      categoryId: category.id,
      categoryName: category.name,
      distanceLabel: category.distanceLabel,
      distanceKm: category.distanceKm,
      userId: user.id || 'usr_fernando',
      participantName: data.participantName,
      participantDocument: data.participantDocument,
      participantBirthDate: data.participantBirthDate,
      participantEmail: data.participantEmail,
      participantPhone: data.participantPhone,
      kitId: kit.id,
      kitName: kit.name,
      kitType: kit.type,
      shirtSize: data.shirtSize || 'M',
      bibNumber: String(bibNumber),
      originalPrice: basePrice,
      discountFromPoints: discountAmount,
      pointsUsed,
      finalPricePaid: finalPrice,
      paymentMethod: data.paymentMethod,
      paymentStatus: finalPrice === 0 ? 'gratuito' : 'pago',
      pointsEarnedOnRegistration: pointsEarned,
      status: 'confirmada',
      checkInStatus: 'ausente',
      completed: false,
      registrationDate: new Date().toISOString(),
      acceptedRegulation: true
    };

    setRaceRegistrations(prev => [newReg, ...prev]);

    setRaceEvents(prev => prev.map(e => {
      if (e.id === event.id) {
        return {
          ...e,
          filledSpots: e.filledSpots + 1,
          categories: e.categories.map(c => c.id === category.id ? { ...c, currentParticipants: (c.currentParticipants || 0) + 1 } : c)
        };
      }
      return e;
    }));

    if (pointsEarned > 0) {
      recordTransaction({
        amount: pointsEarned,
        type: 'ganho',
        origin: 'inscricao_corrida',
        description: `Inscrição confirmada: ${event.name} (+${pointsEarned} pts)`,
        referenceId: regId
      });
    }

    showToast(`🎉 Inscrição confirmada no ${event.name}! Seu número de peito é #${bibNumber}.`);
    return { success: true, registration: newReg, message: 'Inscrição realizada com sucesso!' };
  };

  const checkInParticipant = (registrationId: string, status: ParticipantCheckInStatus, adminName?: string) => {
    const reg = raceRegistrations.find(r => r.id === registrationId);
    if (!reg) return { success: false, message: 'Inscrição não encontrada.' };

    const event = raceEvents.find(e => e.id === reg.eventId);

    setRaceRegistrations(prev => prev.map(r => {
      if (r.id === registrationId) {
        return {
          ...r,
          checkInStatus: status,
          checkInAt: new Date().toISOString(),
          checkInAdmin: adminName || 'Check-in MerMi Control'
        };
      }
      return r;
    }));

    let pts = 0;
    if (status === 'presente' && event?.pointsConfig.pointsRewardCheckIn) {
      pts = event.pointsConfig.pointsRewardCheckIn;
      recordTransaction({
        amount: pts,
        type: 'ganho',
        origin: 'participacao_corrida',
        description: `Presença confirmada no evento: ${reg.eventName}`,
        referenceId: registrationId,
        adminResponsible: adminName || 'Check-in MerMi Control'
      });
      showToast(`Check-in de ${reg.participantName} confirmado! (+${pts} pts concedidos)`);
    } else {
      showToast(`Status de ${reg.participantName} atualizado para "${status}".`);
    }

    return { success: true, message: 'Check-in atualizado.', pointsAwarded: pts };
  };

  const recordRaceResult = (
    registrationId: string,
    resultData: {
      timeSeconds: number;
      overallRank?: number;
      categoryRank?: number;
      pointsAwarded?: number;
    }
  ) => {
    const reg = raceRegistrations.find(r => r.id === registrationId);
    if (!reg) return { success: false, message: 'Inscrição não encontrada.' };

    const pace = calculatePace(resultData.timeSeconds, reg.distanceKm);
    const certCode = generateCertificateCode(reg.eventId, reg.id);

    setRaceRegistrations(prev => prev.map(r => {
      if (r.id === registrationId) {
        return {
          ...r,
          completed: true,
          completedAt: new Date().toISOString(),
          timeSeconds: resultData.timeSeconds,
          timeFormatted: formatTimeSeconds(resultData.timeSeconds),
          overallRank: resultData.overallRank,
          categoryRank: resultData.categoryRank,
          paceFormatted: pace,
          certificateCode: certCode,
          status: 'concluida',
          checkInStatus: 'presente'
        };
      }
      return r;
    }));

    // Sincroniza corrida automaticamente no Bloco 07
    const activityNew: ActivityLog = {
      id: `act_race_${Date.now()}`,
      title: `Corrida Oficial · ${reg.eventName}`,
      category: 'corrida',
      durationMinutes: Math.round(resultData.timeSeconds / 60),
      distanceKm: reg.distanceKm,
      caloriesBurned: Math.round(reg.distanceKm * 65),
      date: reg.eventDate.split('T')[0],
      time: '07:30',
      origin: 'mermi_run',
      intensity: 'alta',
      notes: `Tempo oficial: ${formatTimeSeconds(resultData.timeSeconds)} | Pace: ${pace}/km | Nº ${reg.bibNumber}`
    };
    setActivityLogs(prev => [activityNew, ...prev]);

    const pts = resultData.pointsAwarded || 150;
    recordTransaction({
      amount: pts,
      type: 'ganho',
      origin: 'conclusao_corrida',
      description: `Conclusão da prova: ${reg.eventName} (${reg.distanceKm}K em ${formatTimeSeconds(resultData.timeSeconds)})`,
      referenceId: registrationId
    });

    unlockBadgeDirect('bdg_primeira_corrida');
    showToast(`🏆 Resultado registrado! Parabéns pela conclusão da prova (+${pts} pts)!`);
    return { success: true, message: 'Resultado salvo e certificado emitido com sucesso.' };
  };

  const updateVirtualChallengeProgress = (
    challengeId: string,
    additionalKm: number
  ): { success: boolean; message: string; completed?: boolean } => {
    let completedNow = false;
    let challengeTitle = '';
    let rewardPoints = 0;

    setVirtualChallenges(prev => prev.map(vc => {
      if (vc.challengeId === challengeId) {
        challengeTitle = vc.title;
        rewardPoints = vc.pointsReward;
        const newKm = Math.min(vc.targetKm, Number((vc.currentKm + additionalKm).toFixed(1)));
        const completed = newKm >= vc.targetKm;
        const wasCompleted = vc.status === 'concluido' || vc.status === 'resgatado';
        if (completed && !wasCompleted) {
          completedNow = true;
        }
        return {
          ...vc,
          currentKm: newKm,
          percentage: Math.min(100, Math.round((newKm / vc.targetKm) * 100)),
          status: completed ? 'concluido' : vc.status,
          activitiesCount: vc.activitiesCount + 1,
          lastActivityDate: new Date().toISOString()
        };
      }
      return vc;
    }));

    if (completedNow) {
      recordTransaction({
        amount: rewardPoints,
        type: 'ganho',
        origin: 'desafio_virtual',
        description: `Desafio Virtual Concluído: ${challengeTitle}`,
        referenceId: challengeId
      });
      showToast(`🎉 DESAFIO VIRTUAL CONCLUÍDO! Você bateu a meta de ${challengeTitle} (+${rewardPoints} pts)!`);
      return { success: true, message: 'Desafio concluído com sucesso!', completed: true };
    }

    showToast(`+${additionalKm}km adicionados ao desafio ${challengeTitle}.`);
    return { success: true, message: 'Progresso atualizado.', completed: false };
  };

  const claimVirtualChallengeReward = (challengeId: string) => {
    const ch = virtualChallenges.find(v => v.challengeId === challengeId);
    if (!ch) return { success: false, message: 'Desafio não encontrado.' };
    if (ch.status !== 'concluido') return { success: false, message: 'Desafio ainda não concluído.' };

    setVirtualChallenges(prev => prev.map(vc => vc.challengeId === challengeId ? { ...vc, status: 'resgatado' } : vc));
    showToast(`Recompensa do desafio "${ch.title}" resgatada com sucesso!`);
    return { success: true, message: 'Recompensa resgatada.' };
  };

  // --- BLOCO 07: SAÚDE, HIDRATAÇÃO, SONO, PASSOS, ATIVIDADES, HÁBITOS, METAS & DISPOSITIVOS ---
  const addWaterLog = (amountMl: number, origin: DataOrigin = 'manual') => {
    const today = new Date().toISOString().split('T')[0];
    const newLog: WaterLog = {
      id: `wlog_${Date.now()}`,
      amountMl,
      timestamp: new Date().toISOString(),
      date: today,
      origin
    };

    const updatedLogs = [newLog, ...waterLogs];
    setWaterLogs(updatedLogs);

    const stats = calculateWaterStats(updatedLogs, waterSettings.dailyGoalMl, today);
    setUser(u => ({ ...u, waterIntakeMl: stats.currentMl }));

    let ptsAwarded = 0;
    const prevStats = calculateWaterStats(waterLogs, waterSettings.dailyGoalMl, today);
    if (stats.isGoalMet && !prevStats.isGoalMet) {
      ptsAwarded = evolutionAdminConfig.pointsPerWaterGoalMet || 15;
      recordTransaction({
        amount: ptsAwarded,
        type: 'ganho',
        origin: 'evolucao',
        description: `Meta diária de hidratação atingida (${stats.currentMl} ml)`,
        referenceId: `water_${today}`
      });
      showToast(`💧 Meta de água batida hoje! Você conquistou +${ptsAwarded} MerMi Points.`);
    } else {
      showToast(`+${amountMl}ml de água registrados. (${stats.percentage}% da meta)`);
    }

    return { success: true, newTotal: stats.currentMl, pointsAwarded: ptsAwarded };
  };

  const removeWaterLog = (id: string) => {
    const updated = waterLogs.filter(w => w.id !== id);
    setWaterLogs(updated);
    const today = new Date().toISOString().split('T')[0];
    const stats = calculateWaterStats(updated, waterSettings.dailyGoalMl, today);
    setUser(u => ({ ...u, waterIntakeMl: stats.currentMl }));
    showToast('Registro de água removido.');
  };

  const updateWaterSettings = (settings: Partial<WaterSettings>) => {
    setWaterSettings(prev => {
      const next = { ...prev, ...settings };
      if (settings.dailyGoalMl) {
        setUser(u => ({ ...u, waterGoalMl: settings.dailyGoalMl! }));
      }
      return next;
    });
    showToast('Configurações de hidratação atualizadas.');
  };

  const triggerWaterReminderTest = () => {
    showToast('💧 Hora de beber água! Mantenha a hidratação constante para alta performance e saúde.');
  };

  const addSleepLog = (logData: Omit<SleepLog, 'id'>) => {
    const newLog: SleepLog = {
      ...logData,
      id: `sleep_${Date.now()}`
    };

    const updated = [newLog, ...sleepLogs];
    setSleepLogs(updated);

    const formattedDuration = `${Math.floor(newLog.durationMinutes / 60)}h ${newLog.durationMinutes % 60}min`;
    setUser(u => ({ ...u, sleepHours: formattedDuration }));

    let pts = 0;
    if (newLog.durationMinutes >= (sleepSettings.targetHours * 60)) {
      pts = 15;
      recordTransaction({
        amount: pts,
        type: 'ganho',
        origin: 'evolucao',
        description: `Meta de sono restaurador cumprida (${formattedDuration})`,
        referenceId: newLog.id
      });
    }

    showToast(`Registro de sono salvo (${formattedDuration})! Descanso é regeneração.`);
    return { success: true, message: 'Sono registrado com sucesso.', pointsAwarded: pts };
  };

  const updateSleepSettings = (settings: Partial<SleepSettings>) => {
    setSleepSettings(prev => ({ ...prev, ...settings }));
    showToast('Metas e horários de sono atualizados.');
  };

  const addStepsLog = (count: number, date?: string, origin: DataOrigin = 'manual') => {
    const targetDate = date || new Date().toISOString().split('T')[0];
    const existing = stepsLogs.find(s => s.date === targetDate);
    const newCount = existing ? existing.stepsCount + count : count;

    const newLog: StepsLog = {
      id: existing ? existing.id : `slog_${Date.now()}`,
      date: targetDate,
      stepsCount: newCount,
      goal: stepsSettings.dailyGoal,
      distanceKm: Number(((newCount * 0.75) / 1000).toFixed(1)),
      caloriesBurned: Math.round(newCount * 0.045),
      origin
    };

    const updated = existing
      ? stepsLogs.map(s => s.date === targetDate ? newLog : s)
      : [newLog, ...stepsLogs];

    setStepsLogs(updated);
    if (targetDate === new Date().toISOString().split('T')[0]) {
      setUser(u => ({ ...u, stepsToday: newCount }));
    }

    let ptsAwarded = 0;
    if (newCount >= stepsSettings.dailyGoal && (!existing || existing.stepsCount < stepsSettings.dailyGoal)) {
      ptsAwarded = evolutionAdminConfig.pointsPerStepsGoalMet || 20;
      recordTransaction({
        amount: ptsAwarded,
        type: 'ganho',
        origin: 'evolucao',
        description: `Meta de passos diários batida (${newCount.toLocaleString('pt-BR')} passos)`,
        referenceId: `steps_${targetDate}`
      });
      showToast(`👟 Meta de passos batida! Você ganhou +${ptsAwarded} MerMi Points.`);
    } else {
      showToast(`+${count.toLocaleString('pt-BR')} passos registrados.`);
    }

    return { success: true, pointsAwarded: ptsAwarded };
  };

  const updateStepsSettings = (settings: Partial<StepsSettings>) => {
    setStepsSettings(prev => ({ ...prev, ...settings }));
    showToast('Metas de passos atualizadas.');
  };

  const addActivityLog = (activityData: Omit<ActivityLog, 'id'>) => {
    const newAct: ActivityLog = {
      ...activityData,
      id: `act_${Date.now()}`
    };

    setActivityLogs(prev => [newAct, ...prev]);

    const pts = evolutionAdminConfig.pointsPerWorkoutLogged || 25;
    recordTransaction({
      amount: pts,
      type: 'ganho',
      origin: 'evolucao',
      description: `Treino Registrado: ${newAct.title} (${newAct.durationMinutes} min)`,
      referenceId: newAct.id
    });

    showToast(`💪 Atividade registrada! Parabéns pelo movimento (+${pts} pts).`);
    return { success: true, pointsAwarded: pts };
  };

  const deleteActivityLog = (id: string) => {
    setActivityLogs(prev => prev.filter(a => a.id !== id));
    showToast('Atividade removida.');
  };

  const toggleHabitCompletion = (habitId: string, date?: string) => {
    const targetDate = date || new Date().toISOString().split('T')[0];
    const existing = habitCompletions.find(c => c.habitId === habitId && c.date === targetDate);
    const habit = habits.find(h => h.id === habitId);

    const willBeCompleted = !existing || !existing.completed;

    let pts = 0;
    if (willBeCompleted) {
      setHabitCompletions(prev => {
        const filtered = prev.filter(c => !(c.habitId === habitId && c.date === targetDate));
        return [{ habitId, date: targetDate, completed: true, completedAt: new Date().toISOString() }, ...filtered];
      });

      setHabits(prev => prev.map(h => h.id === habitId ? { ...h, streakDays: h.streakDays + 1 } : h));

      pts = habit?.pointsReward || 10;
      recordTransaction({
        amount: pts,
        type: 'ganho',
        origin: 'habito',
        description: `Hábito cumprido: ${habit?.title || 'Rotina Saudável'}`,
        referenceId: `hbt_${habitId}_${targetDate}`
      });

      showToast(`✓ Hábito concluído! Constância é resultado (+${pts} pts).`);
    } else {
      setHabitCompletions(prev => prev.map(c => c.habitId === habitId && c.date === targetDate ? { ...c, completed: false } : c));
      setHabits(prev => prev.map(h => h.id === habitId ? { ...h, streakDays: Math.max(0, h.streakDays - 1) } : h));
      showToast('Hábito desmarcado para hoje.');
    }

    return { completed: willBeCompleted, pointsAwarded: pts };
  };

  const createHabit = (habitData: Omit<HabitItem, 'id' | 'streakDays' | 'createdAt'>) => {
    const newHbt: HabitItem = {
      ...habitData,
      id: `hbt_${Date.now()}`,
      streakDays: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setHabits(prev => [...prev, newHbt]);
    showToast(`Hábito "${newHbt.title}" adicionado à sua rotina.`);
  };

  const updateHabit = (id: string, updates: Partial<HabitItem>) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, ...updates } : h));
    showToast('Hábito atualizado.');
  };

  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
    showToast('Hábito removido.');
  };

  const createEvolutionGoal = (goalData: Omit<EvolutionGoal, 'id'>) => {
    const newGoal: EvolutionGoal = {
      ...goalData,
      id: `goal_${Date.now()}`
    };
    setEvolutionGoals(prev => [...prev, newGoal]);
    showToast(`Nova meta "${newGoal.title}" criada.`);
  };

  const updateEvolutionGoal = (id: string, updates: Partial<EvolutionGoal>) => {
    setEvolutionGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
    showToast('Meta atualizada.');
  };

  const deleteEvolutionGoal = (id: string) => {
    setEvolutionGoals(prev => prev.filter(g => g.id !== id));
    showToast('Meta removida.');
  };

  const completeEvolutionGoal = (id: string) => {
    const goal = evolutionGoals.find(g => g.id === id);
    if (!goal) return { success: false, pointsAwarded: 0 };

    setEvolutionGoals(prev => prev.map(g => g.id === id ? { ...g, status: 'concluida', currentValue: g.targetValue } : g));

    const pts = goal.pointsReward || 30;
    recordTransaction({
      amount: pts,
      type: 'ganho',
      origin: 'desafio',
      description: `Meta Pessoal Concluída: ${goal.title}`,
      referenceId: goal.id
    });

    showToast(`🎯 Parabéns! Meta "${goal.title}" concluída com sucesso (+${pts} pts)!`);
    return { success: true, pointsAwarded: pts };
  };

  const toggleDeviceConnection = (platformKey: DevicePlatformKey, connected: boolean) => {
    setConnectedDevices(prev => prev.map(d => {
      if (d.platformKey === platformKey) {
        return {
          ...d,
          connected,
          syncStatus: connected ? 'sincronizado' : 'nao_conectado',
          lastSyncAt: connected ? new Date().toISOString() : undefined
        };
      }
      return d;
    }));
    showToast(connected ? `Dispositivo conectado com sucesso!` : `Dispositivo desconectado.`);
  };

  const updateDevicePermissions = (platformKey: DevicePlatformKey, permissions: Partial<DevicePermissions>) => {
    setConnectedDevices(prev => prev.map(d => {
      if (d.platformKey === platformKey) {
        return {
          ...d,
          permissions: { ...d.permissions, ...permissions }
        };
      }
      return d;
    }));
    showToast('Permissões de sincronização atualizadas.');
  };

  const syncDevice = (platformKey: DevicePlatformKey) => {
    const dev = connectedDevices.find(d => d.platformKey === platformKey);
    if (!dev) return { success: false, message: 'Dispositivo não encontrado.' };

    const result = simulateDeviceSyncResult(platformKey);

    if (dev.permissions.steps) {
      const today = new Date().toISOString().split('T')[0];
      setStepsLogs(prev => prev.map(s => s.date === today ? { ...s, stepsCount: Math.max(s.stepsCount, result.syncedSteps), origin: 'dispositivo' } : s));
      setUser(u => ({ ...u, stepsToday: Math.max(u.stepsToday, result.syncedSteps) }));
    }

    setConnectedDevices(prev => prev.map(d => d.platformKey === platformKey ? {
      ...d,
      syncStatus: 'sincronizado',
      lastSyncAt: new Date().toISOString()
    } : d));

    showToast(result.message);
    return { success: true, message: result.message };
  };

  const addBodyEvolutionLog = (logData: Omit<BodyEvolutionLog, 'id'>) => {
    const newLog: BodyEvolutionLog = {
      ...logData,
      id: `body_${Date.now()}`
    };
    setBodyEvolutionLogs(prev => [newLog, ...prev]);
    showToast('Evolução corporal registrada com total privacidade.');
  };

  const deleteBodyEvolutionLog = (id: string) => {
    setBodyEvolutionLogs(prev => prev.filter(b => b.id !== id));
    showToast('Registro de medidas corporais removido.');
  };

  const updateEvolutionAdminConfig = (updates: Partial<EvolutionAdminConfig>) => {
    setEvolutionAdminConfig(prev => ({ ...prev, ...updates }));
    showToast('Configurações administrativas de saúde salvas.');
  };

  // --- BLOCO 12: Funções Centrais de Notificações, Automações & Campanhas ---
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.notification_id === id ? { ...n, status: 'lida', read_at: new Date().toISOString() } : n));
  };

  const markAllNotificationsAsRead = () => {
    const now = new Date().toISOString();
    setNotifications(prev => prev.map(n => ({ ...n, status: 'lida', read_at: n.read_at || now })));
    showToast('Todas as notificações foram marcadas como lidas.');
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.notification_id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    showToast('Histórico de notificações limpo.');
  };

  const sendAppNotification = (notifData: Omit<AppNotification, 'notification_id' | 'created_at' | 'status'>) => {
    const newNotif: AppNotification = {
      ...notifData,
      notification_id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      status: 'enviada',
      created_at: new Date().toISOString()
    };

    const check = shouldDeliverNotification(newNotif, notificationPreferences, 1);
    if (check.deliver) {
      setNotifications(prev => [newNotif, ...prev]);
      const provider = new MermiInAppNotificationProvider();
      provider.sendPush(newNotif);
    }
  };

  const triggerEventNotification = (event: AutomationTriggerEvent, payload: Record<string, any> = {}) => {
    const activeAutos = automations.filter(a => a.status === 'ativa' && a.trigger_event === event);

    activeAutos.forEach(auto => {
      let passed = true;
      for (const cond of auto.conditions) {
        const val = payload[cond.field];
        if (cond.operator === 'equals' && val !== cond.value) passed = false;
        if (cond.operator === 'greater_than' && !(Number(val) > Number(cond.value))) passed = false;
        if (cond.operator === 'less_than' && !(Number(val) < Number(cond.value))) passed = false;
      }
      if (!passed) return;

      const formattedTitle = formatTemplateVariables(auto.template_title, {
        user_name: user.name,
        points_balance: user.mermiPoints,
        ...payload
      });
      const formattedMessage = formatTemplateVariables(auto.template_message, {
        user_name: user.name,
        points_balance: user.mermiPoints,
        ...payload
      });

      const newNotif: AppNotification = {
        notification_id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        user_id: user.id || 'user-001',
        type: auto.channel === 'push' ? 'push' : 'in_app',
        category: auto.trigger_event.includes('ORDER') ? 'PEDIDO'
          : auto.trigger_event.includes('PAYMENT') ? 'PAGAMENTO'
          : auto.trigger_event.includes('POINTS') ? 'POINTS'
          : auto.trigger_event.includes('RUN') ? 'MERMI_RUN'
          : auto.trigger_event.includes('WATER') || auto.trigger_event.includes('SLEEP') ? 'SAUDE_BEM_ESTAR'
          : auto.trigger_event.includes('DROP') || auto.trigger_event.includes('REWARD') ? 'RECOMPENSA'
          : auto.trigger_event.includes('CHALLENGE') ? 'DESAFIOS'
          : 'CAMPANHA',
        title: formattedTitle,
        message: formattedMessage,
        image_asset_id: auto.image_asset_id,
        action_type: auto.action_type,
        action_target: auto.action_target,
        priority: auto.priority,
        status: 'enviada',
        created_at: new Date().toISOString(),
        source: 'automacao',
        channel: auto.channel,
        interactive_actions: auto.action_type === 'interactive' && auto.trigger_event === 'WATER_REMINDER' ? [
          { label: '+250 ml', action_target: 'action:add_water_250', payload: 250, variant: 'primary' },
          { label: '+500 ml', action_target: 'action:add_water_500', payload: 500, variant: 'secondary' }
        ] : undefined
      };

      const check = shouldDeliverNotification(newNotif, notificationPreferences, 1);
      if (check.deliver) {
        setNotifications(prev => [newNotif, ...prev]);
        setAutomations(prev => prev.map(a => a.automation_id === auto.automation_id ? {
          ...a,
          metrics: {
            ...a.metrics,
            triggered_count: a.metrics.triggered_count + 1,
            sent_count: a.metrics.sent_count + 1
          }
        } : a));
      }
    });
  };

  const updateNotificationPreferences = (updates: Partial<NotificationPreferences>) => {
    setNotificationPreferences(prev => ({
      ...prev,
      ...updates,
      channels: { ...prev.channels, ...(updates.channels || {}) },
      categories: { ...prev.categories, ...(updates.categories || {}) },
      quiet_hours: { ...prev.quiet_hours, ...(updates.quiet_hours || {}) }
    }));
    showToast('Preferências de notificação salvas.');
  };

  const createAutomation = (autoData: Omit<NotificationAutomation, 'automation_id' | 'created_at' | 'updated_at' | 'metrics'>) => {
    const newAuto: NotificationAutomation = {
      ...autoData,
      automation_id: `auto-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      metrics: { triggered_count: 0, sent_count: 0, opened_count: 0, converted_count: 0 }
    };
    setAutomations(prev => [newAuto, ...prev]);
    addAuditLog('CRIAR_AUTOMACAO', 'sistema', newAuto.automation_id, 'Inexistente', newAuto.name);
    showToast(`Automação "${newAuto.name}" criada com sucesso!`);
  };

  const updateAutomation = (id: string, updates: Partial<NotificationAutomation>) => {
    setAutomations(prev => prev.map(a => a.automation_id === id ? { ...a, ...updates, updated_at: new Date().toISOString() } : a));
    addAuditLog('ATUALIZAR_AUTOMACAO', 'sistema', id, 'Anterior', JSON.stringify(updates));
    showToast('Automação atualizada.');
  };

  const deleteAutomation = (id: string) => {
    setAutomations(prev => prev.filter(a => a.automation_id !== id));
    addAuditLog('EXCLUIR_AUTOMACAO', 'sistema', id, 'Existente', 'Removido');
    showToast('Automação removida.');
  };

  const toggleAutomationStatus = (id: string) => {
    setAutomations(prev => prev.map(a => a.automation_id === id ? { ...a, status: a.status === 'ativa' ? 'pausada' : 'ativa', updated_at: new Date().toISOString() } : a));
    showToast('Status da automação alterado.');
  };

  const createSmartCampaign = (campData: Omit<SmartCampaign, 'campaign_id' | 'created_at' | 'updated_at' | 'metrics'>) => {
    const newCamp: SmartCampaign = {
      ...campData,
      campaign_id: `camp-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      metrics: { sent: 0, delivered: 0, opened: 0, clicked: 0, converted: 0, attributed_revenue: 0 }
    };
    setSmartCampaigns(prev => [newCamp, ...prev]);
    addAuditLog('CRIAR_CAMPANHA_INTELIGENTE', 'sistema', newCamp.campaign_id, 'Inexistente', newCamp.name);
    showToast(`Campanha "${newCamp.name}" criada.`);
  };

  const updateSmartCampaign = (id: string, updates: Partial<SmartCampaign>) => {
    setSmartCampaigns(prev => prev.map(c => c.campaign_id === id ? { ...c, ...updates, updated_at: new Date().toISOString() } : c));
    addAuditLog('ATUALIZAR_CAMPANHA_INTELIGENTE', 'sistema', id, 'Anterior', JSON.stringify(updates));
    showToast('Campanha atualizada.');
  };

  const deleteSmartCampaign = (id: string) => {
    setSmartCampaigns(prev => prev.filter(c => c.campaign_id !== id));
    addAuditLog('EXCLUIR_CAMPANHA_INTELIGENTE', 'sistema', id, 'Existente', 'Removida');
    showToast('Campanha removida.');
  };

  const duplicateSmartCampaign = (id: string) => {
    const camp = smartCampaigns.find(c => c.campaign_id === id);
    if (!camp) return;
    const duplicated: SmartCampaign = {
      ...camp,
      campaign_id: `camp-${Date.now()}`,
      name: `${camp.name} (Cópia)`,
      status: 'rascunho',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      metrics: { sent: 0, delivered: 0, opened: 0, clicked: 0, converted: 0, attributed_revenue: 0 }
    };
    setSmartCampaigns(prev => [duplicated, ...prev]);
    showToast(`Campanha duplicada como rascunho.`);
  };

  const sendTestCampaign = (campaignId: string, testTarget?: string): { success: boolean; message: string } => {
    const camp = smartCampaigns.find(c => c.campaign_id === campaignId);
    if (!camp) return { success: false, message: 'Campanha não encontrada.' };

    const formattedTitle = formatTemplateVariables(camp.title_template, {
      user_name: user.name || 'Cliente',
      points_balance: user.mermiPoints || 0,
      favorite_dish: 'Marmita Fit'
    });
    const formattedMessage = formatTemplateVariables(camp.message_template, {
      user_name: user.name || 'Cliente',
      points_balance: user.mermiPoints || 0,
      favorite_dish: 'Marmita Fit'
    });

    const testNotif: AppNotification = {
      notification_id: `test-notif-${Date.now()}`,
      user_id: user.id || 'user-001',
      type: 'in_app',
      category: 'CAMPANHA',
      title: `[TESTE] ${formattedTitle}`,
      message: formattedMessage,
      image_asset_id: camp.image_asset_id,
      action_type: 'deep_link',
      action_target: camp.deep_link || 'cardapio',
      priority: 'alta',
      status: 'enviada',
      created_at: new Date().toISOString(),
      source: 'campanha',
      channel: camp.channels[0] || 'app'
    };

    setNotifications(prev => [testNotif, ...prev]);
    addAuditLog('TESTE_CAMPANHA', 'sistema', camp.campaign_id, 'Disparo de Teste', `Destino: ${testTarget || user.email}`);
    showToast(`Envio de teste realizado com sucesso! Verifique a Central de Notificações.`);
    return { success: true, message: 'Disparo de teste concluído com sucesso.' };
  };

  const recordCartAbandonment = (items: any[], totalValue: number) => {
    if (!items || items.length === 0) return;
    const newRecord: CartAbandonmentRecord = {
      user_id: user.id || 'user-001',
      user_name: user.name || 'Usuário Cliente',
      user_email: user.email || 'cliente@mermifit.com',
      cart_items_count: items.reduce((acc, i) => acc + (i.quantity || 1), 0),
      cart_total_value: totalValue,
      items_summary: items.map(i => i.name || 'Marmita Fit'),
      abandoned_at: new Date().toISOString(),
      recovery_notification_sent: false,
      recovered: false
    };
    setCartAbandonments(prev => [newRecord, ...prev.filter(r => r.user_id !== user.id)]);
  };

  const recoverCartAbandonment = (userId: string) => {
    setCartAbandonments(prev => prev.map(c => c.user_id === userId ? { ...c, recovered: true } : c));
  };

  // --- BLOCO 13: BANCO DE DADOS, RELACIONAMENTOS, REGRAS DE NEGÓCIO, PERMISSÕES E INTEGRIDADE ---
  const runSystemIntegrityCheck = (): IntegrityReportResult => {
    return runFullSystemIntegrityCheck({
      products,
      userPoints: user.mermiPoints,
      pointsLedger,
      orders,
      inventory
    });
  };

  const validateOrderStatusTransition = (current: CanonicalOrderStatus, target: CanonicalOrderStatus) => {
    return validateOrderStateTransition(current, target, currentAdminUser?.role === 'OWNER');
  };

  const checkGranularPermission = (permission: GranularPermission, role?: RoleType): boolean => {
    const targetRole = role || (currentAdminUser?.role as RoleType) || 'CUSTOMER';
    return hasGranularPermission(targetRole, permission);
  };

  const exportSystemSnapshot = (): string => {
    return exportSystemDataSnapshot({
      crmCustomers,
      orders,
      products,
      insumos,
      pointsLedger,
      stockMovements,
      auditLogs,
      automations,
      systemSettings
    });
  };

  // --- BLOCO 14: SEGURANÇA, AUTENTICAÇÃO, PAGAMENTOS, INTEGRAÇÕES E PROTEÇÃO DE DADOS (LGPD) ---
  const processSecurePaymentCheckout = (input: {
    orderId: string;
    amount: number;
    method: PaymentMethodType;
    installments?: number;
    cardLast4?: string;
    idempotencyKey?: string;
  }): { transaction: PaymentTransaction; isDuplicateBlocked: boolean } => {
    const result = initiateSecurePayment({
      orderId: input.orderId,
      userId: user.id || 'usr_fernando',
      userName: user.name || 'Fernando Brasil',
      amount: input.amount,
      method: input.method,
      installments: input.installments,
      cardLast4: input.cardLast4,
      idempotencyKey: input.idempotencyKey,
      existingTransactions: paymentTransactions
    });

    if (!result.isDuplicateBlocked) {
      setPaymentTransactions(prev => [result.transaction, ...prev]);
    }
    return result;
  };

  const simulateWebhookDispatch = (input: {
    provider: string;
    eventType: 'PAYMENT_APPROVED' | 'PAYMENT_FAILED' | 'PAYMENT_CANCELLED' | 'PAYMENT_REFUNDED';
    paymentId: string;
    orderId: string;
    amount: number;
    idempotencyKey: string;
    signatureHeader?: string;
  }): { success: boolean; message: string } => {
    const res = processSignedWebhook({
      provider: input.provider,
      eventType: input.eventType,
      paymentId: input.paymentId,
      orderId: input.orderId,
      amount: input.amount,
      signatureHeader: input.signatureHeader,
      idempotencyKey: input.idempotencyKey,
      existingWebhooks: webhookEvents,
      existingPayments: paymentTransactions
    });

    setWebhookEvents(prev => [res.webhookRecord, ...prev]);

    if (res.updatedPayment) {
      setPaymentTransactions(prev =>
        prev.map(p => (p.payment_id === res.updatedPayment!.payment_id ? res.updatedPayment! : p))
      );
    }

    if (res.success && input.eventType === 'PAYMENT_APPROVED') {
      // Confirmação operacional confiável do pedido
      const targetOrder = orders.find(o => o.order_id === input.orderId || (o as any).id === input.orderId);
      if (targetOrder && targetOrder.order_status === 'pedido_recebido') {
        updateOrderStatus(input.orderId, 'pagamento_confirmado');
      }
    }

    return { success: res.success, message: res.message };
  };

  const executeRefundAndReversal = (input: {
    paymentId: string;
    orderId: string;
    reason: string;
  }): { success: boolean; message: string; pointsReversed: number } => {
    const res = executeRefundTransaction({
      paymentId: input.paymentId,
      orderId: input.orderId,
      reason: input.reason,
      actorId: currentAdminUser?.email || 'admin@mermifit.com',
      existingPayments: paymentTransactions
    });

    if (res.updatedPayment) {
      setPaymentTransactions(prev =>
        prev.map(p => (p.payment_id === res.updatedPayment!.payment_id ? res.updatedPayment! : p))
      );
    }

    // Cancelar pedido
    updateOrderStatus(input.orderId, 'cancelado');

    // Reverter pontos se aplicável
    if (res.pointsReversedAmount > 0) {
      const now = new Date().toISOString();
      const currentPts = user.mermiPoints;
      const newPts = Math.max(0, currentPts - res.pointsReversedAmount);
      setUserPoints(newPts);
      const ledgerEntry: PointsLedgerEntry = {
        entry_id: `led-ref-${Date.now()}`,
        user_id: user.id || 'usr_fernando',
        type: 'ESTORNO',
        amount: -res.pointsReversedAmount,
        balance_before: currentPts,
        balance_after: newPts,
        reference_id: input.orderId,
        source: 'ESTORNO_PEDIDO',
        description: `Reversão automática de pontos concedidos por estorno do pedido ${input.orderId}`,
        created_at: now,
        idempotency_key: `idem-ref-${input.orderId}`
      };
      setPointsLedger(prev => [ledgerEntry, ...prev]);
    }

    return {
      success: true,
      message: `Estorno realizado com sucesso. ${res.pointsReversedAmount} pts revertidos no ledger contábil.`,
      pointsReversed: res.pointsReversedAmount
    };
  };

  const revokeAuthSession = (sessionId: string) => {
    setAuthSessions(prev =>
      prev.map(s => (s.session_id === sessionId ? { ...s, status: 'revoked' as const } : s))
    );
  };

  const revokeAllOtherSessions = () => {
    setAuthSessions(prev =>
      prev.map(s => (s.session_id !== 'sess-current-01' ? { ...s, status: 'revoked' as const } : s))
    );
  };

  const updatePrivacyConsentSettings = (updates: Partial<UserPrivacyConsent>) => {
    setUserPrivacyConsent(prev => ({
      ...prev,
      ...updates,
      last_updated_at: new Date().toISOString()
    }));
  };

  const exportLgpdUserData = (): string => {
    const payload = generateLgpdDataExport({
      user,
      orders,
      pointsLedger,
      privacyConsent: userPrivacyConsent
    });
    return JSON.stringify(payload, null, 2);
  };

  const requestLgpdAccountAnonymization = (): AccountDeletionResult => {
    const result = executeLgpdAccountAnonymization(user);
    revokeAllOtherSessions();
    return result;
  };

  return (
    <MermiStoreContext.Provider
      value={{
        user,
        setUserPoints,
        addPoints,
        updateUser,
        weeklyMember,
        updateWeeklyMember,
        rewards,
        redemptions,
        redeemReward,

        // MERMI DROP SURPRESA
        drops,
        dropClaims,
        claimDrop,
        createDrop,
        updateDrop,
        deleteDrop,
        toggleDropStatus,

        pricing,
        updatePrice,
        presetPoints,
        resetToOfficialDefaults,
        toastMessage,
        showToast,

        // BLOCO 03
        homeBlocks,
        updateHomeBlocks,
        toggleHomeBlock,
        moveHomeBlock,
        banners,
        addBanner,
        updateBanner,
        deleteBanner,
        duplicateBanner,
        toggleBannerActive,
        reorderBanners,
        campaigns,
        addCampaign,
        updateCampaign,
        deleteCampaign,
        promotions,
        updatePromotion,
        addPromotion,
        deletePromotion,
        posts,
        togglePostLike,
        togglePostSave,
        addPostComment,
        updatePost,
        deletePost,
        createPost,
        articles,
        updateArticle,
        // Posts & Campanhas Central
        publications,
        addPublication,
        updatePublication,
        deletePublication,
        togglePublicationActive,
        audienceProfile,
        setAudienceProfile,
        analyticsEvents,
        trackEvent,
        clearAnalytics,

        // BLOCO 04
        products,
        menuCategories,
        customIngredients,
        coupons,
        appliedCoupon,
        cartItems,
        orders,
        userAddresses,
        selectedAddress,
        deliveryType,
        deliveryFeeSetting,
        freeDeliveryThreshold,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductAvailability,
        toggleProductActive,
        refreshProducts,
        linkProductImageAsset,
        createMenuCategory,
        updateMenuCategory,
        deleteMenuCategory,
        addCustomIngredient,
        updateCustomIngredient,
        toggleIngredientAvailability,
        addToCart,
        updateCartQuantity,
        removeCartItem,
        clearCart,
        applyCoupon,
        removeCoupon,
        setDeliveryType,
        updateDeliverySettings,
        addAddress,
        updateAddress,
        deleteAddress,
        setSelectedAddress,
        createOrder,
        updateOrderStatus,
        repeatOrder,
        cancelOrder,
        createCoupon,
        updateCoupon,
        deleteCoupon,
        toggleCouponActive,
        // --- BLOCO 05: MERMI POINTS + GAMIFICAÇÃO ---
        transactions,
        earningRules,
        userLevels,
        badges,
        missions,
        streak,
        pointsSummary,
        processedOrderIds,
        recordTransaction,
        adjustPointsAdmin,
        awardPointsByAction,
        createEarningRule,
        updateEarningRule,
        deleteEarningRule,
        toggleEarningRuleActive,
        createUserLevel,
        updateUserLevel,
        deleteUserLevel,
        createBadge,
        updateBadge,
        deleteBadge,
        unlockBadge,
        createMission,
        updateMission,
        deleteMission,
        completeMission,
        updateMissionProgress,
        updateStreakDays,
        claimStreakMilestone,

        // --- BLOCO 06: MERMI RUN ---
        raceEvents,
        raceKits,
        raceRegistrations,
        virtualChallenges,
        leaderboard,
        rankingPrivacy,
        setRankingPrivacy,
        createRaceEvent,
        updateRaceEvent,
        deleteRaceEvent,
        createRaceKit,
        updateRaceKit,
        deleteRaceKit,
        registerForRace,
        checkInParticipant,
        recordRaceResult,
        updateVirtualChallengeProgress,
        claimVirtualChallengeReward,

        // --- BLOCO 07: EVOLUÇÃO, SAÚDE & DISPOSITIVOS ---
        waterLogs,
        waterSettings,
        sleepLogs,
        sleepSettings,
        stepsLogs,
        stepsSettings,
        activityLogs,
        habits,
        habitCompletions,
        evolutionGoals,
        connectedDevices,
        bodyEvolutionLogs,
        evolutionAdminConfig,
        addWaterLog,
        removeWaterLog,
        updateWaterSettings,
        triggerWaterReminderTest,
        addSleepLog,
        updateSleepSettings,
        addStepsLog,
        updateStepsSettings,
        addActivityLog,
        deleteActivityLog,
        toggleHabitCompletion,
        createHabit,
        updateHabit,
        deleteHabit,
        createEvolutionGoal,
        updateEvolutionGoal,
        deleteEvolutionGoal,
        completeEvolutionGoal,
        toggleDeviceConnection,
        updateDevicePermissions,
        syncDevice,
        addBodyEvolutionLog,
        deleteBodyEvolutionLog,
        updateEvolutionAdminConfig,

        // --- BLOCO 10: MERMI CONTROL + MERMI INTELLIGENCE ---
        currentAdminUser,
        isAdminAuthenticated,
        setAdminAuthenticated: setIsAdminAuthenticated,
        setAdminUser: setCurrentAdminUser,
        adminUsers,
        loginAdmin,
        logoutAdmin,
        switchAdminUser,
        addAdminUser,
        updateAdminUser,
        deleteAdminUser,
        auditLogs,
        addAuditLog,
        inventory,
        updateInventoryStock,
        addInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,
        productionPlan,
        addProductionPlanItem,
        updateProductionPlanStatus,
        deleteProductionPlanItem,
        crmCustomers,
        updateCrmCustomer,
        addCrmCustomer,
        campaignsAdmin,
        addCampaignAdmin,
        updateCampaignAdmin,
        deleteCampaignAdmin,
        bannersAdmin,
        addBannerAdmin,
        updateBannerAdmin,
        deleteBannerAdmin,
        postsAdmin,
        addPostAdmin,
        updatePostAdmin,
        deletePostAdmin,
        notificationsAdmin,
        addNotificationAdmin,
        updateNotificationAdmin,
        deleteNotificationAdmin,
        intelligenceInsightsFull,
        confirmHighImpactAction,
        cancelHighImpactAction,
        adminAlerts,
        resolveAdminAlert,
        systemSettings,
        updateSystemSettings,
        // Bloco 11
        insumos,
        costHistory,
        stockMovements,
        fichasTecnicas,
        fornecedores,
        pedidosCompra,
        ordensProducao,
        desperdicios,
        taxasPagamento,
        custosOperacionais,
        realDeliveryCostSetting,
        addInsumo,
        updateInsumo,
        deleteInsumo,
        adjustInsumoStock,
        registerInsumoEntry,
        registerInsumoExit,
        createFichaTecnica,
        updateFichaTecnica,
        deleteFichaTecnica,
        addFornecedor,
        updateFornecedor,
        deleteFornecedor,
        createPedidoCompra,
        updatePedidoCompraStatus,
        deletePedidoCompra,
        createOrdemProducao,
        updateOrdemProducaoStatus,
        deleteOrdemProducao,
        registerDesperdicio,
        deleteDesperdicio,
        updateTaxaPagamento,
        addCustoOperacional,
        updateCustoOperacional,
        deleteCustoOperacional,
        updateRealDeliveryCostSetting,
        getDreGerencial,
        getProdutosMargem,
        getSugestoesCompraIA,
        // --- BLOCO 12: NOTIFICAÇÕES, AUTOMAÇÕES & CAMPANHAS ---
        notifications,
        notificationPreferences,
        automations,
        smartCampaigns,
        cartAbandonments,
        notificationTemplates,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        deleteNotification,
        clearAllNotifications,
        sendAppNotification,
        triggerEventNotification,
        updateNotificationPreferences,
        createAutomation,
        updateAutomation,
        deleteAutomation,
        toggleAutomationStatus,
        createSmartCampaign,
        updateSmartCampaign,
        deleteSmartCampaign,
        duplicateSmartCampaign,
        sendTestCampaign,
        recordCartAbandonment,
        recoverCartAbandonment,
        // --- BLOCO 13: BANCO DE DADOS, RELACIONAMENTOS, REGRAS DE NEGÓCIO, PERMISSÕES E INTEGRIDADE ---
        pointsLedger,
        priceHistory,
        runSystemIntegrityCheck,
        validateOrderStatusTransition,
        checkGranularPermission,
        exportSystemSnapshot,
        // --- BLOCO 14: SEGURANÇA, AUTENTICAÇÃO, PAGAMENTOS, INTEGRAÇÕES E PROTEÇÃO DE DADOS (LGPD) ---
        legalPolicies,
        externalIntegrations,
        authSessions,
        paymentTransactions,
        webhookEvents,
        securityIncidents,
        userPrivacyConsent,
        processSecurePaymentCheckout,
        simulateWebhookDispatch,
        executeRefundAndReversal,
        revokeAuthSession,
        revokeAllOtherSessions,
        updatePrivacyConsentSettings,
        exportLgpdUserData,
        requestLgpdAccountAnonymization,
      }}
    >
      {children}
    </MermiStoreContext.Provider>
  );
};

export const useMermiStore = () => {
  const context = useContext(MermiStoreContext);
  if (!context) {
    throw new Error('useMermiStore deve ser utilizado dentro de MermiStoreProvider');
  }
  return context;
};
