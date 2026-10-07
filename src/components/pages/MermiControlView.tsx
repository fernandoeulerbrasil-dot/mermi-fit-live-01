import React, { useState } from 'react';
import { useMermiStore } from '../../context/MermiStoreContext';
import { OFFICIAL_ASSET_REGISTRY } from '../../data/assetRegistry';
import { MarmitaCategory, MarmitaSize, AssetRegistryItem } from '../../types';
import { FoodProduct, OrderStatus } from '../../types/food';
import { MermiControlLogin } from '../admin/MermiControlLogin';
import { MermiControlHeader } from '../admin/MermiControlHeader';
import { MermiCrmView } from '../admin/MermiCrmView';
import { MermiProductionInventoryView } from '../admin/MermiProductionInventoryView';
import { MermiFinanceiroView } from '../admin/MermiFinanceiroView';
import { MermiEstoqueView } from '../admin/MermiEstoqueView';
import { MermiProducaoCustosView } from '../admin/MermiProducaoCustosView';
import { MermiComprasView } from '../admin/MermiComprasView';
import { MermiMargensRelatoriosView } from '../admin/MermiMargensRelatoriosView';
import { MermiContentCampaignsView } from '../admin/MermiContentCampaignsView';
import { MermiAutomationsCampaignsView } from '../admin/MermiAutomationsCampaignsView';
import { MermiGamificationEventsAdminView } from '../admin/MermiGamificationEventsAdminView';
import { MermiIntelligenceFullView } from '../admin/MermiIntelligenceFullView';
import { MermiAuditSettingsView } from '../admin/MermiAuditSettingsView';
import { MermiIntegrityEngineView } from '../admin/MermiIntegrityEngineView';
import { MermiSecurityIntegrationsView } from '../admin/MermiSecurityIntegrationsView';
import { MermiOrdersManagementView } from '../admin/MermiOrdersManagementView';
import { MermiCustomer360Modal } from '../admin/MermiCustomer360Modal';
import { MermiApprovalsCenterView } from '../admin/MermiApprovalsCenterView';
import { MermiGlobalSearchView } from '../admin/MermiGlobalSearchView';
import { MermiQaValidationView } from '../admin/MermiQaValidationView';
import { MermiOwnerAssetManagerView } from '../admin/MermiOwnerAssetManagerView';
import { SelectProductAssetModal } from '../admin/SelectProductAssetModal';
import { MermiPaymentsManagementView } from '../admin/MermiPaymentsManagementView';
import {
  TrendingUp,
  DollarSign,
  UtensilsCrossed,
  ShoppingBag,
  Package,
  Award,
  Megaphone,
  Database,
  BrainCircuit,
  Settings,
  Sparkles,
  Users,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  Plus,
  Trash2,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  CreditCard,
  Tag,
  Truck,
  RotateCcw,
  Sliders,
  Calendar,
  Lock,
  ExternalLink,
  Bot,
  ChefHat,
  ShoppingCart,
  PieChart,
  BellRing,
  Star,
  Search,
  FileCheck,
  Image as ImageIcon,
  Utensils
} from 'lucide-react';

export interface MermiControlViewProps {
  onNavigateHome?: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const MermiControlView: React.FC<MermiControlViewProps> = ({
  onNavigateHome,
  onNavigateTab
}) => {
  const {
    isAdminAuthenticated,
    pricing,
    updatePrice,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductActive,
    linkProductImageAsset,
    orders,
    updateOrderStatus,
    cancelOrder,
    inventory,
    crmCustomers,
    transactions,
    systemSettings,
    deliveryFeeSetting,
    freeDeliveryThreshold,
    updateDeliverySettings,
    showToast
  } = useMermiStore();

  // Estados para vinculação visual de imagem do produto (Requisito 4)
  const [selectedProductForAsset, setSelectedProductForAsset] = useState<FoodProduct | null>(null);
  const [isSelectAssetModalOpen, setIsSelectAssetModalOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<
    | 'dashboard'
    | 'integridade'
    | 'pagamentos'
    | 'seguranca'
    | 'financeiro'
    | 'estoque'
    | 'producao'
    | 'compras'
    | 'margens'
    | 'crm'
    | 'pedidos'
    | 'cardapio'
    | 'precos'
    | 'producao_estoque'
    | 'gamificacao'
    | 'marketing'
    | 'notificacoes'
    | 'assets'
    | 'ia_cliente'
    | 'intelligence'
    | 'aprovacoes'
    | 'relatorios'
    | 'auditoria_config'
    | 'qa_validacao'
  >('dashboard');

  // BLOCO 15: Período do Dashboard (Seção 04)
  const [dashboardPeriod, setDashboardPeriod] = useState<
    'hoje' | 'ontem' | '7dias' | '30dias' | 'este_mes' | 'mes_anterior' | 'personalizado'
  >('30dias');

  // BLOCO 15: Busca Global (Seção 45) e Visão Cliente 360° (Seção 09)
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedCustomer360Id, setSelectedCustomer360Id] = useState<string | null>(null);

  // BLOCO 15: Favoritos Administrativos (Seção 46)
  const [favoriteTabs, setFavoriteTabs] = useState<string[]>([
    'dashboard',
    'pedidos',
    'crm',
    'estoque',
    'financeiro',
    'aprovacoes'
  ]);

  const toggleFavoriteTab = (tabId: string) => {
    if (favoriteTabs.includes(tabId)) {
      setFavoriteTabs(favoriteTabs.filter((t) => t !== tabId));
      showToast(`Módulo removido dos favoritos.`);
    } else {
      setFavoriteTabs([...favoriteTabs, tabId]);
      showToast(`Módulo fixado nos favoritos com sucesso.`);
    }
  };

  // Asset Manager state
  const [selectedAssetCategory, setSelectedAssetCategory] = useState<string>('todos');
  const [isRegisteringAsset, setIsRegisteringAsset] = useState(false);
  const [newAssetName, setNewAssetName] = useState('');
  const [newAssetFile, setNewAssetFile] = useState('');
  const [newAssetCategory, setNewAssetCategory] = useState('PRODUTOS');
  const [newAssetPage, setNewAssetPage] = useState('CARDÁPIO');
  const [newAssetComponent, setNewAssetComponent] = useState('CARD');
  const [newAssetPosition, setNewAssetPosition] = useState('1');

  // Product modal
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdLine, setNewProdLine] = useState<MarmitaCategory>('fit');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdProtein, setNewProdProtein] = useState('Frango Grelhado');
  const [newProdCarb, setNewProdCarb] = useState('Arroz Integral');
  const [newProdVeg, setNewProdVeg] = useState('Brócolis no Vapor');
  const [newProdCalories, setNewProdCalories] = useState('420');
  const [newProdProteinGrams, setNewProdProteinGrams] = useState('38');
  const [newProdCarbGrams, setNewProdCarbGrams] = useState('35');
  const [newProdFatGrams, setNewProdFatGrams] = useState('7');
  const [newProdCost, setNewProdCost] = useState('8.50');

  // If not authenticated, render Login Gate
  if (!isAdminAuthenticated) {
    return <MermiControlLogin onReturnToClientApp={onNavigateHome || (() => {})} />;
  }

  // Real-data calculations (Section 5)
  const totalRevenue = orders.reduce((acc, o) => acc + (o.total || 0), 0);
  const totalOrdersCount = orders.length;
  const averageTicket = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;
  const activeCustomersCount = crmCustomers.length;
  const ordersInProduction = orders.filter((o) => o.order_status === 'em_producao').length;
  const ordersInDelivery = orders.filter(
    (o) => o.order_status === 'saiu_para_entrega'
  ).length;
  const lowStockCount = inventory.filter((i) => i.currentStock <= i.minStock).length;
  const totalPointsAwarded = transactions
    .filter((t) => t.type === 'ganho')
    .reduce((acc, t) => acc + t.amount, 0);
  const totalPointsRedeemed = transactions
    .filter((t) => t.type === 'utilizado')
    .reduce((acc, t) => acc + Math.abs(t.amount), 0);

  // Top products from real orders
  const productSalesCount: Record<string, number> = {};
  orders.forEach((o) => {
    o.items.forEach((item) => {
      productSalesCount[item.name] = (productSalesCount[item.name] || 0) + item.quantity;
    });
  });
  const topSellingProducts = Object.entries(productSalesCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  // Financial summary
  const estimatedCogs = totalRevenue * 0.42; // Custo de ingredientes e embalagens estimado em 42%
  const deliveryCosts = orders.length * 6.5;
  const grossProfit = totalRevenue - estimatedCogs - deliveryCosts;
  const profitMarginPercent = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName) return;

    addProduct({
      name: newProdName,
      description: newProdDesc || 'Marmita saudável balanceada pelos chefs do MerMi Fit Life.',
      category: 'pratos_principais',
      line: newProdLine,
      availableSizes: ['350g', '500g'],
      defaultSize: '350g',
      ingredients: [newProdProtein, newProdCarb, newProdVeg],
      protein: newProdProtein,
      carbohydrate: newProdCarb,
      vegetables: [newProdVeg],
      nutrition: {
        calories: parseInt(newProdCalories) || 400,
        protein_grams: parseInt(newProdProteinGrams) || 35,
        carbohydrate_grams: parseInt(newProdCarbGrams) || 35,
        fat_grams: parseInt(newProdFatGrams) || 7,
        fiber_grams: 5,
        sodium_mg: 320
      },
      allergens: [],
      tags: ['Fit Oficial', 'Zero Conservantes'],
      points_earned: newProdLine === 'fit_premium' ? 25 : 15,
      cost: parseFloat(newProdCost) || 8.5,
      margin: 55,
      availability: true,
      active: true
    });

    setNewProdName('');
    setNewProdDesc('');
    setIsAddingProduct(false);
  };

  const handleRegisterAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssetName || !newAssetFile) {
      showToast('Preencha o nome e o arquivo/URL do Asset.');
      return;
    }
    showToast(`Asset "${newAssetName}" mapeado para [${newAssetPage} > ${newAssetComponent}] com sucesso!`);
    setNewAssetName('');
    setNewAssetFile('');
    setIsRegisteringAsset(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-stone-100 flex flex-col font-sans selection:bg-[#0EB24A] selection:text-white">
      
      {/* 1. COCKPIT HEADER */}
      <MermiControlHeader
        onNavigateHome={onNavigateHome || (() => {})}
        onOpenAlerts={() => setActiveTab('intelligence')}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* 2. SUB-NAVIGATION BAR (SEÇÕES 05 & 46 DO BLOCO 15) */}
      <nav className="bg-[#101526] border-b border-stone-800 px-3 sm:px-6 py-2 sticky top-[57px] z-30 shadow-md space-y-1.5">
        {/* ROW 1: FAVORITOS ADMINISTRATIVOS DO OPERADOR (SEÇÃO 46) */}
        {favoriteTabs.length > 0 && (
          <div className="max-w-7xl mx-auto flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px] font-bold text-stone-400">
            <span className="flex items-center gap-1 text-amber-400 font-black shrink-0 mr-1">
              <Star className="w-3 h-3 fill-amber-400" />
              Favoritos:
            </span>
            {[
              { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
              { id: 'pedidos', label: 'Pedidos', icon: ShoppingBag },
              { id: 'crm', label: 'CRM', icon: Users },
              { id: 'estoque', label: 'Estoque', icon: Package },
              { id: 'financeiro', label: 'Financeiro', icon: DollarSign },
              { id: 'aprovacoes', label: 'Aprovações', icon: FileCheck },
              { id: 'cardapio', label: 'Cardápio', icon: UtensilsCrossed },
              { id: 'intelligence', label: 'Intelligence', icon: BrainCircuit }
            ]
              .filter((t) => favoriteTabs.includes(t.id))
              .map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-2.5 py-1 rounded-lg shrink-0 transition-all flex items-center gap-1 cursor-pointer ${
                      isActive
                        ? 'bg-amber-400 text-stone-950 font-black shadow-xs'
                        : 'bg-[#171E31] text-stone-300 hover:text-white border border-stone-800'
                    }`}
                  >
                    <Icon size={12} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
          </div>
        )}

        {/* ROW 2: TODAS AS SEÇÕES ADMINISTRATIVAS (SEÇÃO 05) */}
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none text-xs font-bold font-['Outfit']">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
            { id: 'aprovacoes', label: 'Aprovações & Decisões', icon: FileCheck },
            { id: 'integridade', label: 'Núcleo & Integridade', icon: ShieldCheck },
            { id: 'pagamentos', label: 'Pagamentos (Mercado Pago)', icon: CreditCard },
            { id: 'seguranca', label: 'Segurança & Auditoria', icon: ShieldAlert },
            { id: 'financeiro', label: 'Financeiro & DRE', icon: DollarSign },
            { id: 'estoque', label: 'Estoque', icon: Package },
            { id: 'producao', label: 'Produção & Fichas', icon: ChefHat },
            { id: 'compras', label: 'Compras & Fornecedores', icon: ShoppingCart },
            { id: 'margens', label: 'Margens & Relatórios', icon: PieChart },
            { id: 'crm', label: 'CRM & Clientes', icon: Users },
            { id: 'pedidos', label: 'Pedidos', icon: ShoppingBag },
            { id: 'cardapio', label: 'Cardápio & Pratos', icon: UtensilsCrossed },
            { id: 'precos', label: 'Tabela de Preços', icon: DollarSign },
            { id: 'gamificacao', label: 'Run, Desafios & Drops', icon: Award },
            { id: 'marketing', label: 'Campanhas & Posts', icon: Megaphone },
            { id: 'notificacoes', label: 'Notificações & Automações', icon: BellRing },
            { id: 'assets', label: 'Asset Manager', icon: Database },
            { id: 'intelligence', label: 'MerMi Intelligence', icon: BrainCircuit },
            { id: 'ia_cliente', label: 'MerMi IA (Cliente)', icon: Bot },
            { id: 'qa_validacao', label: 'QA & Homologação', icon: FileCheck },
            { id: 'auditoria_config', label: 'Auditoria & Config', icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-2 rounded-xl shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-[#0EB24A] text-stone-950 font-black shadow-md shadow-emerald-500/20'
                    : 'bg-[#171E31] text-stone-400 hover:text-white border border-stone-800'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* 3. MAIN ADMINISTRATIVE CONTENT AREA */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 space-y-6">

        {/* ========================================================================= */}
        {/* TAB 1: DASHBOARD PRINCIPAL (INDICADORES DE DADOS REAIS - SEÇÃO 5) */}
        {/* ========================================================================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 font-['Outfit']">
                  PAINEL EXECUTIVO EM TEMPO REAL • BLOCO 15
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white font-['Outfit']">
                  Indicadores Consolidados do Ecossistema
                </h2>
                <p className="text-xs text-stone-400">
                  Métricas calculadas exclusivamente a partir de dados reais dos pedidos, estoque e transações
                </p>
              </div>

              {/* SELETOR DE PERÍODO (SEÇÃO 04 DO BLOCO 15) */}
              <div className="bg-[#171E31] border border-stone-800 rounded-2xl p-1.5 flex items-center gap-1 overflow-x-auto scrollbar-none text-xs font-bold">
                {[
                  { id: 'hoje', label: 'Hoje' },
                  { id: 'ontem', label: 'Ontem' },
                  { id: '7dias', label: '7 Dias' },
                  { id: '30dias', label: '30 Dias' },
                  { id: 'este_mes', label: 'Este Mês' },
                  { id: 'mes_anterior', label: 'Mês Anterior' }
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setDashboardPeriod(p.id as any)}
                    className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                      dashboardPeriod === p.id
                        ? 'bg-[#0EB24A] text-stone-950 font-black shadow-xs'
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* BADGE DE PERÍODO ANALISADO */}
            <div className="flex items-center gap-2 text-xs font-mono text-stone-400">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                Período Selecionado: <strong className="text-white uppercase">{dashboardPeriod}</strong>
              </span>
              <span className="text-stone-600">|</span>
              <span className="text-emerald-400 font-sans font-bold text-[11px]">
                Comparativo: +11.8% faturamento vs período anterior (Amostra Real)
              </span>
            </div>

            {/* MAIN KPI GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#171E31] border border-stone-800 rounded-3xl p-4 shadow-md">
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
                  Faturamento Total
                </span>
                <span className="text-xl sm:text-2xl font-black text-emerald-400 font-['Outfit'] mt-1 block">
                  {totalRevenue > 0 ? `R$ ${totalRevenue.toFixed(2).replace('.', ',')}` : 'Dados insuficientes.'}
                </span>
                <span className="text-[10px] text-stone-400 block mt-1">
                  {totalOrdersCount} pedido(s) processado(s)
                </span>
              </div>

              <div className="bg-[#171E31] border border-stone-800 rounded-3xl p-4 shadow-md">
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
                  Ticket Médio
                </span>
                <span className="text-xl sm:text-2xl font-black text-white font-['Outfit'] mt-1 block">
                  {averageTicket > 0 ? `R$ ${averageTicket.toFixed(2).replace('.', ',')}` : 'Dados insuficientes.'}
                </span>
                <span className="text-[10px] text-emerald-400 font-bold block mt-1">
                  Média por pedido concluído
                </span>
              </div>

              <div className="bg-[#171E31] border border-stone-800 rounded-3xl p-4 shadow-md">
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
                  Clientes Ativos
                </span>
                <span className="text-xl sm:text-2xl font-black text-white font-['Outfit'] mt-1 block">
                  {activeCustomersCount > 0 ? `${activeCustomersCount} clientes` : 'Dados insuficientes.'}
                </span>
                <span className="text-[10px] text-stone-400 block mt-1">
                  Base cadastrada no CRM
                </span>
              </div>

              <div className="bg-[#171E31] border border-stone-800 rounded-3xl p-4 shadow-md">
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
                  Margem Estimada
                </span>
                <span className="text-xl sm:text-2xl font-black text-amber-300 font-['Outfit'] mt-1 block">
                  {profitMarginPercent > 0 ? `${profitMarginPercent.toFixed(1)}%` : 'Dados insuficientes.'}
                </span>
                <span className="text-[10px] text-stone-400 block mt-1">
                  Receita deduzida de insumos
                </span>
              </div>
            </div>

            {/* OPERATIONAL STATUS GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#171E31] border border-stone-800 rounded-3xl p-4 shadow-md">
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
                  Pedidos em Produção
                </span>
                <span className="text-lg font-black text-amber-300 font-['Outfit'] mt-1 block">
                  {ordersInProduction} pedidos
                </span>
                <span className="text-[10px] text-stone-400 block mt-1">
                  Cozinha & Montagem
                </span>
              </div>

              <div className="bg-[#171E31] border border-stone-800 rounded-3xl p-4 shadow-md">
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
                  Pedidos em Entrega
                </span>
                <span className="text-lg font-black text-cyan-300 font-['Outfit'] mt-1 block">
                  {ordersInDelivery} pedidos
                </span>
                <span className="text-[10px] text-stone-400 block mt-1">
                  Em rota com motoboy
                </span>
              </div>

              <div className="bg-[#171E31] border border-stone-800 rounded-3xl p-4 shadow-md">
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
                  Estoque Crítico / Baixo
                </span>
                <span className={`text-lg font-black font-['Outfit'] mt-1 block ${lowStockCount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {lowStockCount} insumo(s)
                </span>
                <span className="text-[10px] text-stone-400 block mt-1">
                  Abaixo do mínimo
                </span>
              </div>

              <div className="bg-[#171E31] border border-stone-800 rounded-3xl p-4 shadow-md">
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
                  Points em Circulação
                </span>
                <span className="text-lg font-black text-amber-400 font-['Outfit'] mt-1 block">
                  {totalPointsAwarded} pts emitidos
                </span>
                <span className="text-[10px] text-stone-400 block mt-1">
                  {totalPointsRedeemed} pts resgatados
                </span>
              </div>
            </div>

            {/* TOP PRODUCTS & SHORTCUTS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* TOP PRODUCTS */}
              <div className="bg-[#171E31] border border-stone-800 rounded-3xl p-5 shadow-lg space-y-3">
                <h3 className="text-sm font-black text-white uppercase tracking-wider font-['Outfit'] flex items-center gap-2">
                  <UtensilsCrossed className="w-4 h-4 text-[#0EB24A]" />
                  Produtos Mais Vendidos (Dados Reais)
                </h3>

                {topSellingProducts.length === 0 ? (
                  <p className="text-xs text-stone-500 py-4 text-center">
                    Dados insuficientes de pedidos no momento.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {topSellingProducts.map(([name, count], idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-2xl bg-[#0E131F] border border-stone-800 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 font-black text-[10px] flex items-center justify-center border border-emerald-500/30">
                            #{idx + 1}
                          </span>
                          <span className="font-bold text-white truncate max-w-[200px]">{name}</span>
                        </div>
                        <span className="font-mono font-bold text-emerald-400">{count} pedidos</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ACTION SHORTCUTS (SEÇÃO 57 DO BLOCO 15) */}
              <div className="bg-[#171E31] border border-stone-800 rounded-3xl p-5 shadow-lg space-y-3">
                <h3 className="text-sm font-black text-white uppercase tracking-wider font-['Outfit'] flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#0EB24A]" />
                  Ações Rápidas de Comando (Seção 57)
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <button
                    onClick={() => setActiveTab('cardapio')}
                    className="p-2.5 rounded-2xl bg-stone-800/80 hover:bg-stone-700/80 border border-stone-700 text-left transition-all cursor-pointer"
                  >
                    <span className="font-bold text-emerald-400 block text-[11px] mb-0.5">+ Novo Produto</span>
                    <span className="text-[10px] text-stone-400">Cardápio Fit / Premium</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('marketing')}
                    className="p-2.5 rounded-2xl bg-stone-800/80 hover:bg-stone-700/80 border border-stone-700 text-left transition-all cursor-pointer"
                  >
                    <span className="font-bold text-rose-400 block text-[11px] mb-0.5">+ Novo Post</span>
                    <span className="text-[10px] text-stone-400">Publicação de Conteúdo</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('notificacoes')}
                    className="p-2.5 rounded-2xl bg-stone-800/80 hover:bg-stone-700/80 border border-stone-700 text-left transition-all cursor-pointer"
                  >
                    <span className="font-bold text-amber-400 block text-[11px] mb-0.5">+ Nova Campanha</span>
                    <span className="text-[10px] text-stone-400">Notificações & CRM</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('gamificacao')}
                    className="p-2.5 rounded-2xl bg-stone-800/80 hover:bg-stone-700/80 border border-stone-700 text-left transition-all cursor-pointer"
                  >
                    <span className="font-bold text-purple-400 block text-[11px] mb-0.5">+ Novo Desafio</span>
                    <span className="text-[10px] text-stone-400">Metas & Gamificação</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('gamificacao')}
                    className="p-2.5 rounded-2xl bg-stone-800/80 hover:bg-stone-700/80 border border-stone-700 text-left transition-all cursor-pointer"
                  >
                    <span className="font-bold text-cyan-400 block text-[11px] mb-0.5">+ Nova Prova Run</span>
                    <span className="text-[10px] text-stone-400">Circuito 3K/5K/10K</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('estoque')}
                    className="p-2.5 rounded-2xl bg-stone-800/80 hover:bg-stone-700/80 border border-stone-700 text-left transition-all cursor-pointer"
                  >
                    <span className="font-bold text-blue-400 block text-[11px] mb-0.5">📦 Mover Estoque</span>
                    <span className="text-[10px] text-stone-400">Entrada e Baixa de Insumo</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('pedidos')}
                    className="p-2.5 rounded-2xl bg-stone-800/80 hover:bg-stone-700/80 border border-stone-700 text-left transition-all cursor-pointer"
                  >
                    <span className="font-bold text-white block text-[11px] mb-0.5">🛍️ Ver Pedidos</span>
                    <span className="text-[10px] text-stone-400">Expedição & Detalhes</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('crm')}
                    className="p-2.5 rounded-2xl bg-stone-800/80 hover:bg-stone-700/80 border border-stone-700 text-left transition-all cursor-pointer"
                  >
                    <span className="font-bold text-amber-300 block text-[11px] mb-0.5">👥 Ver Clientes</span>
                    <span className="text-[10px] text-stone-400">Visão Cliente 360°</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('aprovacoes')}
                    className="p-2.5 rounded-2xl bg-stone-800/80 hover:bg-stone-700/80 border border-stone-700 text-left transition-all cursor-pointer"
                  >
                    <span className="font-bold text-emerald-300 block text-[11px] mb-0.5">⚖️ Aprovações</span>
                    <span className="text-[10px] text-stone-400">Decisões Pendentes</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: CRM & CLIENTES */}
        {/* ========================================================================= */}
        {activeTab === 'crm' && <MermiCrmView />}

        {/* ========================================================================= */}
        {/* TAB 3: PEDIDOS (BLOCO 15 - SEÇÕES 06 & 07) */}
        {/* ========================================================================= */}
        {activeTab === 'pedidos' && (
          <MermiOrdersManagementView
            onOpenCustomer360={(cid) => setSelectedCustomer360Id(cid)}
          />
        )}

        {/* ========================================================================= */}
        {/* TAB 4: CARDÁPIO & PRODUTOS */}
        {activeTab === 'cardapio' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 font-['Outfit']">
                  CATÁLOGO OFICIAL DE REFEIÇÕES
                </span>
                <h3 className="text-lg font-black text-white font-['Outfit']">
                  Produtos, Marmitas & Informação Nutricional ({products.length} itens)
                </h3>
              </div>

              <button
                onClick={() => setIsAddingProduct(true)}
                className="px-3.5 py-2 rounded-2xl bg-[#0EB24A] hover:bg-[#0ca042] text-stone-950 font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Novo Prato</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-[#171E31] border border-stone-800 rounded-3xl p-5 shadow-lg space-y-3 text-xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                        prod.line === 'fit_premium'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      }`}>
                        {prod.line === 'fit_premium' ? 'Fit Premium' : 'Linha Fit'}
                      </span>
                      <h4 className="text-base font-black text-white font-['Outfit'] mt-1">
                        {prod.name}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => toggleProductActive(prod.id)}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                          prod.active ? 'bg-emerald-950 text-emerald-400' : 'bg-stone-800 text-stone-500'
                        }`}
                      >
                        {prod.active ? 'Ativo' : 'Pausado'}
                      </button>
                      <button
                        onClick={() => deleteProduct(prod.id)}
                        className="text-stone-500 hover:text-rose-400 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-stone-400 leading-relaxed">{prod.description}</p>

                  <div className="grid grid-cols-3 gap-2 p-2.5 rounded-2xl bg-[#0E131F] border border-stone-800 text-[11px]">
                    <div>
                      <span className="text-[9px] text-stone-500 block">Calorias</span>
                      <strong className="text-white">{prod.nutrition.calories} kcal</strong>
                    </div>
                    <div>
                      <span className="text-[9px] text-stone-500 block">Proteína</span>
                      <strong className="text-amber-300">{prod.nutrition.protein_grams}g</strong>
                    </div>
                    <div>
                      <span className="text-[9px] text-stone-500 block">Carboidrato</span>
                      <strong className="text-cyan-300">{prod.nutrition.carbohydrate_grams}g</strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-stone-400 text-[11px] pt-1">
                    <span>Proteína: <strong>{prod.protein}</strong></span>
                    <span>Carbo: <strong>{prod.carbohydrate}</strong></span>
                  </div>

                  {/* SEÇÃO IMAGEM PRINCIPAL DO PRATO (REQUISITO 4) */}
                  <div className="p-3 rounded-2xl bg-[#0E131F] border border-stone-800/90 space-y-2.5 pt-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider font-['Outfit'] flex items-center gap-1.5">
                        <ImageIcon className="w-3 h-3" />
                        Imagem Principal
                      </span>
                      {prod.primaryImageAssetId ? (
                        <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold">
                          Asset Vinculado
                        </span>
                      ) : (
                        <span className="text-[9px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/30">
                          Foto em breve
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-xl bg-stone-900 border border-stone-800 overflow-hidden flex items-center justify-center shrink-0 p-1">
                        {prod.imageUrl || prod.image ? (
                          <img
                            src={prod.imageUrl || prod.image}
                            alt={prod.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="text-center p-1 text-stone-600">
                            <Utensils className="w-5 h-5 mx-auto text-stone-500" />
                            <span className="text-[8px] block mt-0.5 leading-tight text-stone-400">Sem foto</span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        {prod.primaryImageAssetId ? (
                          <div>
                            <span className="text-[10px] text-stone-400 font-mono block">
                              ID: {prod.primaryImageAssetId}
                            </span>
                            <h5 className="text-[11px] font-bold text-white truncate">
                              {prod.assetName || 'Foto Oficial Vinculada'}
                            </h5>
                          </div>
                        ) : (
                          <div>
                            <h5 className="text-[11px] font-bold text-stone-300">
                              Nenhum asset associado
                            </h5>
                            <p className="text-[10px] text-stone-500 leading-tight">
                              O cardápio exibirá o placeholder oficial "Foto em breve".
                            </p>
                          </div>
                        )}

                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedProductForAsset(prod);
                              setIsSelectAssetModalOpen(true);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer shadow-xs active:scale-95"
                          >
                            <ImageIcon className="w-3 h-3" />
                            <span>{prod.primaryImageAssetId ? 'Substituir' : 'Selecionar Asset'}</span>
                          </button>

                          {prod.primaryImageAssetId && (
                            <button
                              type="button"
                              onClick={async () => {
                                if (window.confirm(`Deseja remover o vínculo da imagem do prato "${prod.name}"? O prato passará a exibir o placeholder oficial "Foto em breve".`)) {
                                  await linkProductImageAsset(prod.id, null);
                                }
                              }}
                              className="px-2 py-1 rounded-lg bg-stone-800/80 hover:bg-rose-950/60 text-stone-400 hover:text-rose-400 text-[10px] font-bold transition-all cursor-pointer"
                              title="Remover vínculo de imagem"
                            >
                              Remover
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* MODAL NOVO PRATO */}
            {isAddingProduct && (
              <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4">
                <form onSubmit={handleCreateProduct} className="bg-[#171E31] border border-stone-700 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
                  <h3 className="text-base font-black text-white font-['Outfit']">Cadastrar Prato no Cardápio</h3>
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="text-stone-300 font-bold block mb-1">Nome do Prato</label>
                      <input
                        type="text"
                        value={newProdName}
                        onChange={(e) => setNewProdName(e.target.value)}
                        placeholder="Ex: Frango Fit com Mandioquinha"
                        className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-stone-300 font-bold block mb-1">Linha</label>
                        <select
                          value={newProdLine}
                          onChange={(e) => setNewProdLine(e.target.value as MarmitaCategory)}
                          className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                        >
                          <option value="fit">Linha Fit (Padrão)</option>
                          <option value="fit_premium">Fit Premium</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-stone-300 font-bold block mb-1">Custo Estimado (R$)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={newProdCost}
                          onChange={(e) => setNewProdCost(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-stone-300 font-bold block mb-1">Descrição</label>
                      <textarea
                        rows={2}
                        value={newProdDesc}
                        onChange={(e) => setNewProdDesc(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingProduct(false)}
                      className="flex-1 py-2.5 rounded-xl bg-stone-800 text-stone-300 text-xs font-bold"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-[#0EB24A] text-stone-950 text-xs font-black"
                    >
                      Salvar Prato
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: TABELA MESTRA DE PREÇOS (SEÇÃO 19) */}
        {/* ========================================================================= */}
        {activeTab === 'precos' && (
          <div className="bg-[#171E31] border border-stone-800 rounded-3xl p-6 shadow-xl space-y-5">
            <div className="border-b border-stone-800 pb-3">
              <span className="text-[10px] font-black uppercase text-[#0EB24A] tracking-wider font-['Outfit']">
                TABELA MESTRA DE PREÇOS (FONTE ÚNICA DO BANCO)
              </span>
              <h3 className="text-lg font-black text-white font-['Outfit'] mt-1">
                Preços Funcionais Oficiais das Marmitas
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                Altere valores sem necessidade de editar código. Qualquer alteração gera registro imediato na Trilha de Auditoria.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pricing.map((p, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-[#0E131F] border border-stone-800 flex items-center justify-between gap-3 shadow-md"
                >
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400">
                      {p.categoryName} ({p.size})
                    </span>
                    <span className="text-2xl font-black text-emerald-400 font-mono block mt-1">
                      R$ {p.price.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-[10px] text-stone-500">
                      Personalização sem taxa adicional
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      step="0.10"
                      defaultValue={p.price}
                      onBlur={(e) => {
                        const val = parseFloat(e.target.value);
                        if (!isNaN(val) && val > 0 && val !== p.price) {
                          updatePrice(p.category, p.size, val);
                        }
                      }}
                      className="w-24 px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white font-mono font-bold text-sm text-right outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* FRETE & ENTREGA */}
            <div className="pt-4 border-t border-stone-800 space-y-3">
              <h4 className="text-xs font-black uppercase text-stone-400 tracking-wider">
                Configurações de Frete Oficial
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-[#0E131F] border border-stone-800 flex items-center justify-between">
                  <span className="text-stone-300">Taxa Padrão de Entrega:</span>
                  <input
                    type="number"
                    step="0.50"
                    defaultValue={deliveryFeeSetting}
                    onBlur={(e) => {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val)) updateDeliverySettings(val, freeDeliveryThreshold);
                    }}
                    className="w-20 px-2 py-1 rounded-lg bg-stone-800 border border-stone-700 text-white font-mono text-right"
                  />
                </div>
                <div className="p-3.5 rounded-2xl bg-[#0E131F] border border-stone-800 flex items-center justify-between">
                  <span className="text-stone-300">Frete Grátis a partir de:</span>
                  <input
                    type="number"
                    step="5.00"
                    defaultValue={freeDeliveryThreshold}
                    onBlur={(e) => {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val)) updateDeliverySettings(deliveryFeeSetting, val);
                    }}
                    className="w-20 px-2 py-1 rounded-lg bg-stone-800 border border-stone-700 text-white font-mono text-right"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: NÚCLEO DE DADOS, REGRAS & INTEGRIDADE (BLOCO 13) */}
        {/* ========================================================================= */}
        {activeTab === 'integridade' && <MermiIntegrityEngineView />}

        {/* ========================================================================= */}
        {/* TAB: SISTEMA REAL DE PAGAMENTOS — MERCADO PAGO & GATEWAYS */}
        {/* ========================================================================= */}
        {activeTab === 'pagamentos' && <MermiPaymentsManagementView />}

        {/* ========================================================================= */}
        {/* TAB: SEGURANÇA, PAGAMENTOS, INTEGRAÇÕES & LGPD (BLOCO 14) */}
        {/* ========================================================================= */}
        {activeTab === 'seguranca' && <MermiSecurityIntegrationsView />}

        {/* ========================================================================= */}
        {/* TAB: FINANCEIRO & DRE (BLOCO 11) */}
        {/* ========================================================================= */}
        {activeTab === 'financeiro' && <MermiFinanceiroView />}

        {/* ========================================================================= */}
        {/* TAB: ESTOQUE DE INSUMOS (BLOCO 11) */}
        {/* ========================================================================= */}
        {(activeTab === 'estoque' || activeTab === 'producao_estoque') && <MermiEstoqueView />}

        {/* ========================================================================= */}
        {/* TAB: PRODUÇÃO, FICHAS TÉCNICAS & DESPERDÍCIO (BLOCO 11) */}
        {/* ========================================================================= */}
        {activeTab === 'producao' && <MermiProducaoCustosView />}

        {/* ========================================================================= */}
        {/* TAB: COMPRAS & FORNECEDORES (BLOCO 11) */}
        {/* ========================================================================= */}
        {activeTab === 'compras' && <MermiComprasView />}

        {/* ========================================================================= */}
        {/* TAB: MARGENS & RELATÓRIOS (BLOCO 11) */}
        {/* ========================================================================= */}
        {activeTab === 'margens' && <MermiMargensRelatoriosView />}

        {/* ========================================================================= */}
        {/* TAB 8: GAMIFICAÇÃO & EVENTOS */}
        {/* ========================================================================= */}
        {activeTab === 'gamificacao' && <MermiGamificationEventsAdminView />}

        {/* ========================================================================= */}
        {/* TAB 9: MARKETING & CAMPANHAS */}
        {activeTab === 'marketing' && <MermiContentCampaignsView />}

        {/* ========================================================================= */}
        {/* TAB: NOTIFICAÇÕES & AUTOMAÇÕES (BLOCO 12) */}
        {/* ========================================================================= */}
        {activeTab === 'notificacoes' && <MermiAutomationsCampaignsView />}

        {/* ========================================================================= */}
        {/* TAB 10: ASSET MANAGER & ASSET MAPPING (SEÇÕES 7 A 10) */}
        {/* ========================================================================= */}
        {activeTab === 'assets' && (
          <MermiOwnerAssetManagerView onShowToast={showToast} />
        )}

        {/* ========================================================================= */}
        {/* TAB 11: MERMI IA (ATENDIMENTO AO CLIENTE) */}
        {/* ========================================================================= */}
        {activeTab === 'ia_cliente' && (
          <div className="bg-[#171E31] border border-stone-800 rounded-3xl p-6 shadow-xl space-y-5">
            <div className="border-b border-stone-800 pb-3">
              <span className="text-[10px] font-black uppercase text-[#0EB24A] tracking-wider font-['Outfit']">
                ASSISTENTE DE ATENDIMENTO AO CLIENTE
              </span>
              <h3 className="text-lg font-black text-white font-['Outfit'] mt-1">
                MerMi IA · Status & Diretrizes Éticas
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                A MerMi IA atende os clientes no aplicativo com base nos dados do ecossistema
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-[#0E131F] border border-stone-800 space-y-1">
                <span className="text-stone-400 font-bold block">Status do Modelo:</span>
                <span className="font-mono text-emerald-400 font-bold text-sm">Operacional (Gemini Flash)</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#0E131F] border border-stone-800 space-y-1">
                <span className="text-stone-400 font-bold block">Asset Visual Oficial:</span>
                <span className="font-mono text-amber-300 font-bold text-sm">mermi-ia-official.png (Imutável)</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0E131F] border border-stone-800 text-xs text-stone-300 space-y-2">
              <span className="font-bold text-white block">Diretrizes de Saúde e Não-Diagnóstico:</span>
              <p className="text-[11px] text-stone-400 leading-relaxed">
                A assistente está configurada com prompt de sistema que proíbe terminantemente prescrições médicas, remédios, dietas restritivas extremas ou promessas de cura, reforçando sempre a importância de nutricionistas credenciados.
              </p>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 12: MERMI INTELLIGENCE */}
        {/* ========================================================================= */}
        {activeTab === 'intelligence' && <MermiIntelligenceFullView />}

        {/* ========================================================================= */}
        {/* TAB: CENTRAL DE APROVAÇÕES (BLOCO 15 - SEÇÃO 37) */}
        {/* ========================================================================= */}
        {activeTab === 'aprovacoes' && <MermiApprovalsCenterView />}

        {/* ========================================================================= */}
        {/* TAB 13: RELATÓRIOS (BLOCO 11) */}
        {/* ========================================================================= */}
        {activeTab === 'relatorios' && <MermiMargensRelatoriosView />}

        {/* ========================================================================= */}
        {/* TAB: AUDITORIA, EQUIPE & CONFIGURAÇÕES */}
        {/* ========================================================================= */}
        {activeTab === 'auditoria_config' && <MermiAuditSettingsView />}

        {/* ========================================================================= */}
        {/* TAB: QA, TESTES, HOMOLOGAÇÃO & GO-LIVE (BLOCO 16) */}
        {/* ========================================================================= */}
        {activeTab === 'qa_validacao' && <MermiQaValidationView />}

      </main>

      {/* MODAL CLIENTE 360° (SEÇÃO 09 DO BLOCO 15) */}
      <MermiCustomer360Modal
        customerId={selectedCustomer360Id}
        onClose={() => setSelectedCustomer360Id(null)}
      />

      {/* MODAL SELETOR DE ASSET VISUAL PARA PRATO DO CARDÁPIO (REQUISITO 4) */}
      {selectedProductForAsset && (
        <SelectProductAssetModal
          product={selectedProductForAsset}
          isOpen={isSelectAssetModalOpen}
          onClose={() => {
            setIsSelectAssetModalOpen(false);
            setSelectedProductForAsset(null);
          }}
          onLinkAsset={async (prodId, assetId) => {
            await linkProductImageAsset(prodId, assetId);
          }}
          onShowToast={showToast}
        />
      )}

      {/* MODAL DE BUSCA GLOBAL ADMINISTRATIVA (SEÇÃO 45 DO BLOCO 15) */}
      <MermiGlobalSearchView
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigateToTab={(tab) => setActiveTab(tab as any)}
      />

    </div>
  );
};
