export type AdminRole =
  | 'OWNER'
  | 'ADMIN'
  | 'GERENTE'
  | 'OPERACIONAL'
  | 'FINANCEIRO'
  | 'MARKETING'
  | 'PRODUÇÃO'
  | 'ATENDIMENTO';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  permissions: string[];
  active: boolean;
  lastLogin?: string;
  avatarUrl?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  adminName: string;
  adminRole: AdminRole;
  action: string;
  entity:
    | 'preco'
    | 'produto'
    | 'pedido'
    | 'estoque'
    | 'points'
    | 'campanha'
    | 'banner'
    | 'drop'
    | 'recompensa'
    | 'asset'
    | 'configuracao'
    | 'usuario'
    | 'corrida'
    | 'desafio'
    | 'sistema'
    | 'notificacao'
    | 'automacao';
  entityId: string;
  previousValue: string;
  newValue: string;
  reason?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'ingrediente' | 'embalagem' | 'insumo';
  currentStock: number;
  minStock: number;
  unit: 'kg' | 'un' | 'pct' | 'litro' | 'g';
  costPerUnit: number;
  supplier?: string;
  expiryDate?: string;
  status: 'normal' | 'baixo' | 'critico';
}

export interface ProductionPlanItem {
  id: string;
  dishId: string;
  dishName: string;
  line: 'fit' | 'fit_premium';
  quantity350g: number;
  quantity500g: number;
  proteinRequiredKg: number;
  proteinType: string;
  carbRequiredKg: number;
  carbType: string;
  vegRequiredKg: number;
  packagingRequiredUn: number;
  status: 'planejado' | 'em_preparo' | 'embalado' | 'concluido';
  priority: 'normal' | 'alta' | 'urgente';
  targetShift: 'manha' | 'tarde' | 'noite';
}

export interface CustomerCrmProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  registerDate: string;
  lastOrderDate: string;
  ordersCount: number;
  totalSpent: number;
  averageTicket: number;
  purchaseFrequencyDays: number;
  favoriteDishes: string[];
  pointsBalance: number;
  level: number;
  participatedRunEvents: number;
  challengesCompleted: number;
  couponsUsed: number;
  segment: 'novo' | 'ativo' | 'frequente' | 'inativo' | 'vip' | 'alto_ticket';
  isVip: boolean;
  relationshipStatus: 'excelente' | 'estavel' | 'em_risco' | 'inativo';
  daysSinceLastOrder: number;
  notes?: string;
}

export interface CampaignItem {
  id: string;
  nome: string;
  imagem: string;
  titulo: string;
  descricao: string;
  cta: string;
  destino: string;
  dataInicial: string;
  dataFinal: string;
  publico: 'todos' | 'novos' | 'vip' | 'inativos' | 'run';
  ordem: number;
  status: 'ativa' | 'agendada' | 'pausada' | 'encerrada';
  viewsCount: number;
  clicksCount: number;
  ordersCount: number;
  revenueGenerated: number;
}

export interface BannerItem {
  id: string;
  targetPage: 'home' | 'cardapio' | 'points' | 'run' | 'promocao';
  imagem: string;
  titulo: string;
  texto: string;
  botaoTexto: string;
  linkInterno: string;
  ordem: number;
  dataInicio: string;
  dataTermino: string;
  status: 'ativo' | 'inativo';
}

export interface PostItem {
  id: string;
  imagem: string;
  titulo: string;
  descricao: string;
  categoria:
    | 'NOVIDADES'
    | 'ALIMENTAÇÃO'
    | 'TREINO'
    | 'MERMI RUN'
    | 'MERMI POINTS'
    | 'DESAFIOS'
    | 'COMUNIDADE'
    | 'CAMPANHAS'
    | 'MOTIVAÇÃO'
    | 'EVENTOS';
  data: string;
  horario: string;
  status: 'publicado' | 'rascunho' | 'arquivado';
  ordem: number;
  cta?: string;
  destino?: string;
  publico: string;
  validade?: string;
}

export interface NotificationAdminItem {
  id: string;
  title: string;
  message: string;
  category:
    | 'PEDIDOS'
    | 'POINTS'
    | 'RUN'
    | 'DESAFIOS'
    | 'PROMOCOES'
    | 'CAMPANHAS'
    | 'COMUNIDADE'
    | 'CONTEUDO';
  targetAudience: string;
  scheduledFor?: string;
  status: 'enviada' | 'agendada' | 'rascunho' | 'pausada';
  sentAt?: string;
  readCount: number;
}

export interface MermiIntelligenceInsightFull {
  id: string;
  category: 'vendas' | 'produtos' | 'financeiro' | 'estoque' | 'campanhas' | 'points';
  dado: string;
  analise: string;
  possivelCausa: string;
  sugestao: string;
  impactoEstimado: string;
  isHighImpactAction?: boolean;
  highImpactActionType?: 'alterar_preco' | 'pausar_produto' | 'ajustar_estoque' | 'disparar_reativacao';
  highImpactPayload?: any;
  status: 'sugerido' | 'em_revisao' | 'confirmado' | 'cancelado';
}

export interface AdminAlert {
  id: string;
  type:
    | 'ESTOQUE_BAIXO'
    | 'QUEDA_VENDAS'
    | 'AUMENTO_CANCELAMENTOS'
    | 'PRODUTO_BAIXA_SAIDA'
    | 'CAMPANHA_BAIXA_CONVERSAO'
    | 'AUMENTO_DEMANDA'
    | 'RECOMPENSA_ESGOTANDO'
    | 'EVENTO_PROXIMO';
  severity: 'aviso' | 'alerta' | 'critico';
  title: string;
  description: string;
  timestamp: string;
  resolved: boolean;
}

export interface FinancialSummary {
  revenue: number;
  ingredientsCost: number;
  packagingCost: number;
  deliveryCost: number;
  operationalCost: number;
  taxes: number;
  netProfit: number;
  profitMarginPercent: number;
}

export interface SystemSettings {
  companyName: string;
  cnpj: string;
  contactEmail: string;
  contactWhatsApp: string;
  operatingHours: string;
  kitchenAddress: string;
  instagramHandle: string;
  deliveryRadiusKm: number;
  minOrderValue: number;
  pointsPerRealSpent: number;
  pointsPerRunEvent: number;
  pointsPerChallenge: number;
  pointsPerReview: number;
  pointsPerReferral: number;
  pointsPerDailyStreak: number;
  vipMinSpending: number;
  vipMinOrders: number;
  aiMode: 'ativo' | 'pausado' | 'educativo_estrito';
}

export * from './mermiFinanceOperations';
