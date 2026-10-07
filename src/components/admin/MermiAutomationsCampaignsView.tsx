import React, { useState } from 'react';
import { useMermiStore } from '../../context/MermiStoreContext';
import {
  NotificationAutomation,
  SmartCampaign,
  AutomationTriggerEvent,
  AutomationApprovalLevel,
  SmartCampaignObjective,
  NotificationChannel
} from '../../types/mermiNotifications';
import { OFFICIAL_ASSET_REGISTRY } from '../../data/assetRegistry';
import {
  Bell,
  Sparkles,
  Zap,
  Send,
  Plus,
  Trash2,
  Edit3,
  Copy,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Users,
  Eye,
  ShieldCheck,
  TrendingUp,
  BrainCircuit,
  ShoppingBag,
  ExternalLink,
  Smartphone,
  Mail,
  MessageSquare,
  Flame,
  Award,
  Filter,
  DollarSign
} from 'lucide-react';

export const MermiAutomationsCampaignsView: React.FC = () => {
  const {
    automations,
    createAutomation,
    updateAutomation,
    deleteAutomation,
    toggleAutomationStatus,
    smartCampaigns,
    createSmartCampaign,
    updateSmartCampaign,
    deleteSmartCampaign,
    duplicateSmartCampaign,
    sendTestCampaign,
    cartAbandonments,
    triggerEventNotification,
    sendAppNotification,
    currentAdminUser,
    showToast
  } = useMermiStore();

  const [activeTab, setActiveTab] = useState<'automacoes' | 'campanhas' | 'carrinho' | 'ia_analise' | 'disparo_manual'>('automacoes');

  // Modal Nova Automação
  const [isCreatingAuto, setIsCreatingAuto] = useState(false);
  const [autoName, setAutoName] = useState('');
  const [autoDesc, setAutoDesc] = useState('');
  const [autoTrigger, setAutoTrigger] = useState<AutomationTriggerEvent>('ORDER_CREATED');
  const [autoAudience, setAutoAudience] = useState('todos');
  const [autoChannel, setAutoChannel] = useState<NotificationChannel>('app');
  const [autoTitle, setAutoTitle] = useState('');
  const [autoMsg, setAutoMsg] = useState('');
  const [autoTarget, setAutoTarget] = useState('pedidos');
  const [autoLevel, setAutoLevel] = useState<AutomationApprovalLevel>(1);
  const [autoLimitHours, setAutoLimitHours] = useState('24');

  // Modal Nova Campanha
  const [isCreatingCamp, setIsCreatingCamp] = useState(false);
  const [campName, setCampName] = useState('');
  const [campDesc, setCampDesc] = useState('');
  const [campObjective, setCampObjective] = useState<SmartCampaignObjective>('lancamento');
  const [campAudience, setCampAudience] = useState('ativos');
  const [campChannel, setCampChannel] = useState<NotificationChannel>('push');
  const [campTitle, setCampTitle] = useState('');
  const [campMsg, setCampMsg] = useState('');
  const [campAssetId, setCampAssetId] = useState('cardapio-banner-official');
  const [campDeepLink, setCampDeepLink] = useState('cardapio');
  const [campDailyLimit, setCampDailyLimit] = useState('1');

  // Modal Teste de Campanha
  const [testingCampId, setTestingCampId] = useState<string | null>(null);

  // Form Disparo Manual
  const [manualTitle, setManualTitle] = useState('');
  const [manualMsg, setManualMsg] = useState('');
  const [manualAudience, setManualAudience] = useState('todos');
  const [manualTarget, setManualTarget] = useState('home');

  // Métricas agregadas de campanhas
  const totalSent = smartCampaigns.reduce((acc, c) => acc + c.metrics.sent, 0);
  const totalOpened = smartCampaigns.reduce((acc, c) => acc + c.metrics.opened, 0);
  const totalConverted = smartCampaigns.reduce((acc, c) => acc + c.metrics.converted, 0);
  const totalRevenueAttributed = smartCampaigns.reduce((acc, c) => acc + c.metrics.attributed_revenue, 0);
  const avgOpenRate = totalSent > 0 ? ((totalOpened / totalSent) * 100).toFixed(1) : '0.0';

  const handleCreateAutoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!autoName || !autoTitle || !autoMsg) {
      showToast('Preencha os campos obrigatórios da automação.');
      return;
    }

    createAutomation({
      name: autoName,
      description: autoDesc || 'Automação configurada pelo administrador.',
      status: 'ativa',
      trigger_event: autoTrigger,
      conditions: [],
      audience: autoAudience,
      channel: autoChannel,
      template_title: autoTitle,
      template_message: autoMsg,
      action_type: 'deep_link',
      action_target: autoTarget,
      approval_level: autoLevel,
      priority: autoTrigger.includes('ORDER') ? 'urgente' : 'normal',
      frequency_limit_hours: parseInt(autoLimitHours) || 24
    });

    setAutoName('');
    setAutoDesc('');
    setAutoTitle('');
    setAutoMsg('');
    setIsCreatingAuto(false);
  };

  const handleCreateCampSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campName || !campTitle || !campMsg) {
      showToast('Preencha os campos obrigatórios da campanha.');
      return;
    }

    createSmartCampaign({
      name: campName,
      description: campDesc || 'Campanha inteligente do ecossistema.',
      objective: campObjective,
      audience_segment: campAudience,
      status: 'ativa',
      channels: [campChannel],
      title_template: campTitle,
      message_template: campMsg,
      image_asset_id: campAssetId,
      deep_link: campDeepLink,
      start_at: new Date().toISOString(),
      approval_level: 3,
      anti_spam_daily_limit: parseInt(campDailyLimit) || 1,
      created_by: currentAdminUser.name
    });

    setCampName('');
    setCampDesc('');
    setCampTitle('');
    setCampMsg('');
    setIsCreatingCamp(false);
  };

  const handleManualBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTitle || !manualMsg) {
      showToast('Preencha o título e mensagem do comunicado.');
      return;
    }

    sendAppNotification({
      user_id: 'broadcast-all',
      type: 'in_app',
      category: 'SISTEMA',
      title: manualTitle,
      message: manualMsg,
      action_type: 'deep_link',
      action_target: manualTarget,
      priority: 'normal',
      source: 'admin',
      channel: 'app'
    });

    showToast(`Comunicado enviado para o público "${manualAudience.toUpperCase()}"!`);
    setManualTitle('');
    setManualMsg('');
  };

  return (
    <div className="space-y-6">
      
      {/* 1. HEADER EXECUTIVO & METRICS */}
      <div className="bg-[#171E31] border border-stone-800 rounded-3xl p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
          <div>
            <span className="text-[10px] font-black uppercase text-[#0EB24A] tracking-wider font-['Outfit']">
              MOTOR DE EVENTOS, GATILHOS & AUTOMAÇÕES · BLOCO 12
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white font-['Outfit'] mt-1">
              Notificações, Automações & Campanhas Inteligentes
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">
              Crie automações dinâmicas sem alterar código. Conectado ao CRM, MerMi Points, MerMi Run, Cardápio e Asset Manager.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCreatingAuto(true)}
              className="px-3.5 py-2 rounded-2xl bg-[#0EB24A] hover:bg-[#0ca042] text-stone-950 font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Zap className="w-4 h-4" />
              <span>Nova Automação</span>
            </button>

            <button
              onClick={() => setIsCreatingCamp(true)}
              className="px-3.5 py-2 rounded-2xl bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer border border-stone-700"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Campanha</span>
            </button>
          </div>
        </div>

        {/* 4 Cards de Métricas Reais */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-[#0E131F] border border-stone-800">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
              Disparos Entregues
            </span>
            <div className="text-xl font-black text-white font-mono mt-1">
              {totalSent.toLocaleString('pt-BR')}
            </div>
            <span className="text-[10px] text-stone-500">Notificações e campanhas</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0E131F] border border-stone-800">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
              Taxa Média de Abertura
            </span>
            <div className="text-xl font-black text-cyan-400 font-mono mt-1">
              {avgOpenRate}%
            </div>
            <span className="text-[10px] text-emerald-400">Alto engajamento</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0E131F] border border-stone-800">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
              Conversões em Pedidos
            </span>
            <div className="text-xl font-black text-amber-300 font-mono mt-1">
              {totalConverted} pedidos
            </div>
            <span className="text-[10px] text-stone-500">Originados por comunicação</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0E131F] border border-stone-800">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
              Receita Atribuída (Estimada)
            </span>
            <div className="text-xl font-black text-emerald-400 font-mono mt-1">
              R$ {totalRevenueAttributed.toFixed(2).replace('.', ',')}
            </div>
            <span className="text-[9px] text-stone-500">Sem correlação falsa</span>
          </div>
        </div>

        {/* Sub-tabs Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-t border-stone-800 pt-3 text-xs font-bold font-['Outfit']">
          {[
            { id: 'automacoes', label: 'Motor de Automações', icon: Zap },
            { id: 'campanhas', label: 'Campanhas Inteligentes', icon: Send },
            { id: 'carrinho', label: 'Abandono de Carrinho', icon: ShoppingBag },
            { id: 'ia_analise', label: 'MerMi Intelligence IA', icon: BrainCircuit },
            { id: 'disparo_manual', label: 'Disparo Manual & Broadcast', icon: Bell }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-2 rounded-xl shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-[#0EB24A] text-stone-950 font-black shadow-md'
                    : 'bg-[#0E131F] text-stone-400 hover:text-white border border-stone-800'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: AUTOMAÇÕES (MOTOR DE EVENTOS) */}
      {/* ========================================================================= */}
      {activeTab === 'automacoes' && (
        <div className="space-y-4">
          
          {/* Alerta de Níveis de Aprovação */}
          <div className="p-4 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-3 text-xs text-blue-200">
            <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-white font-bold">Governança e Níveis de Aprovação:</strong>
              <p className="text-[11px] text-blue-200/90 leading-relaxed mt-0.5">
                Nível 1: Transacionais imediatos (pedidos e pagamentos). Nível 2: Regras prévias (carrinho e hábitos). Nível 3: Requer aprovação gerencial. Nível 4: Alta relevância financeira (somente Owner).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {automations.map((auto) => (
              <div
                key={auto.automation_id}
                className="bg-[#171E31] border border-stone-800 rounded-3xl p-5 shadow-lg space-y-4 text-xs"
              >
                {/* Header card */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold font-mono">
                        {auto.trigger_event}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 text-[10px] font-bold">
                        Nível {auto.approval_level}
                      </span>
                    </div>
                    <h3 className="text-sm font-black text-white font-['Outfit'] mt-1.5">
                      {auto.name}
                    </h3>
                    <p className="text-stone-400 text-[11px] mt-0.5">
                      {auto.description}
                    </p>
                  </div>

                  <button
                    onClick={() => toggleAutomationStatus(auto.automation_id)}
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-black cursor-pointer transition-colors ${
                      auto.status === 'ativa'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-stone-800 text-stone-400 border border-stone-700'
                    }`}
                  >
                    {auto.status === 'ativa' ? 'ATIVA' : 'PAUSADA'}
                  </button>
                </div>

                {/* Template Preview */}
                <div className="p-3 rounded-2xl bg-[#0E131F] border border-stone-800 space-y-1">
                  <div className="text-[10px] text-stone-400 font-bold">Template Configurado:</div>
                  <strong className="text-white text-xs block font-['Outfit']">
                    {auto.template_title}
                  </strong>
                  <p className="text-[11px] text-stone-400 leading-relaxed font-mono">
                    {auto.template_message}
                  </p>
                </div>

                {/* Meta details */}
                <div className="grid grid-cols-3 gap-2 text-[10px] text-stone-400 pt-1">
                  <div>
                    <span>Canal:</span>
                    <strong className="text-white block uppercase">{auto.channel}</strong>
                  </div>
                  <div>
                    <span>Destino:</span>
                    <strong className="text-white block uppercase">{auto.action_target}</strong>
                  </div>
                  <div>
                    <span>Anti-Spam:</span>
                    <strong className="text-amber-300 block">{auto.frequency_limit_hours}h intervalo</strong>
                  </div>
                </div>

                {/* Metrics & Actions */}
                <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-3 text-stone-400">
                    <span>Disparos: <strong className="text-white font-mono">{auto.metrics.sent_count}</strong></span>
                    <span>Abertos: <strong className="text-emerald-400 font-mono">{auto.metrics.opened_count}</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => triggerEventNotification(auto.trigger_event, { order_number: 'SIM-999', cart_items_count: 2 })}
                      className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-[10px] font-bold cursor-pointer"
                      title="Simular disparo manual"
                    >
                      Testar
                    </button>
                    <button
                      onClick={() => deleteAutomation(auto.automation_id)}
                      className="p-1 rounded-lg text-stone-500 hover:text-rose-400 cursor-pointer"
                      title="Excluir automação"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: CAMPANHAS INTELIGENTES */}
      {/* ========================================================================= */}
      {activeTab === 'campanhas' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {smartCampaigns.map((camp) => (
              <div
                key={camp.campaign_id}
                className="bg-[#171E31] border border-stone-800 rounded-3xl p-5 shadow-lg flex flex-col justify-between space-y-4 text-xs"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase font-mono">
                      {camp.objective}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                      {camp.status.toUpperCase()}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-white font-['Outfit']">
                      {camp.name}
                    </h3>
                    <p className="text-[11px] text-stone-400 mt-1 leading-relaxed">
                      {camp.description}
                    </p>
                  </div>

                  {/* Preview da Mensagem */}
                  <div className="p-3 rounded-2xl bg-[#0E131F] border border-stone-800 space-y-1">
                    <span className="text-[9px] text-stone-500 font-bold uppercase">Mensagem Preview:</span>
                    <strong className="text-white text-xs block">{camp.title_template}</strong>
                    <p className="text-[11px] text-stone-300 leading-relaxed font-mono">
                      {camp.message_template}
                    </p>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] p-2.5 rounded-2xl bg-[#0E131F] border border-stone-800 font-mono">
                    <div>
                      <span className="text-stone-500 text-[9px] block">Disparados:</span>
                      <strong className="text-white">{camp.metrics.sent}</strong>
                    </div>
                    <div>
                      <span className="text-stone-500 text-[9px] block">Abertos:</span>
                      <strong className="text-emerald-400">{camp.metrics.opened} ({camp.metrics.sent > 0 ? ((camp.metrics.opened / camp.metrics.sent) * 100).toFixed(0) : 0}%)</strong>
                    </div>
                    <div>
                      <span className="text-stone-500 text-[9px] block">Conversões:</span>
                      <strong className="text-amber-300">{camp.metrics.converted}</strong>
                    </div>
                    <div>
                      <span className="text-stone-500 text-[9px] block">Receita:</span>
                      <strong className="text-emerald-400">R$ {camp.metrics.attributed_revenue.toFixed(0)}</strong>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-stone-800 flex items-center justify-between gap-1.5">
                  <button
                    onClick={() => sendTestCampaign(camp.campaign_id)}
                    className="flex-1 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-[10px] flex items-center justify-center gap-1 cursor-pointer transition-colors"
                    title="Dispara notificação de teste para o administrador"
                  >
                    <Send className="w-3 h-3" />
                    <span>Enviar Teste</span>
                  </button>

                  <button
                    onClick={() => duplicateSmartCampaign(camp.campaign_id)}
                    className="p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 cursor-pointer"
                    title="Duplicar como rascunho"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => deleteSmartCampaign(camp.campaign_id)}
                    className="p-1.5 rounded-xl bg-stone-800 hover:bg-rose-950/40 text-stone-400 hover:text-rose-400 cursor-pointer"
                    title="Excluir campanha"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 3: ABANDONO DE CARRINHO (REGRA RIGOROSA BLOCO 12 SEÇÃO 8) */}
      {/* ========================================================================= */}
      {activeTab === 'carrinho' && (
        <div className="space-y-4">
          
          <div className="p-4 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3 text-xs text-amber-200">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-white font-bold">Diretriz Comercial Inviolável (Seção 8):</strong>
              <p className="text-[11px] text-amber-200/90 leading-relaxed mt-0.5">
                O sistema de recuperação de carrinho <strong>NÃO</strong> concede descontos automáticos sem regra autorizada. O incentivo principal deve ser a garantia de refeição fresca na rotina do cliente.
              </p>
            </div>
          </div>

          <div className="bg-[#171E31] border border-stone-800 rounded-3xl p-5 shadow-lg space-y-4">
            <h3 className="text-sm font-black text-white font-['Outfit']">
              Carrinhos Não Concluídos Detectados ({cartAbandonments.length})
            </h3>

            <div className="space-y-3">
              {cartAbandonments.map((cart, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#0E131F] border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <strong className="text-white font-['Outfit'] text-sm">{cart.user_name}</strong>
                      <span className="text-stone-400 text-[10px] font-mono">{cart.user_email}</span>
                      {cart.recovered && (
                        <span className="px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] font-bold">
                          RECUPERADO
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-stone-300">
                      Itens: <strong>{cart.items_summary.join(', ')}</strong> ({cart.cart_items_count} marmitas)
                    </p>
                    <span className="text-[10px] text-stone-500 block">
                      Abandonado há cerca de 3 horas · Valor: <strong className="text-emerald-400 font-mono">R$ {cart.cart_total_value.toFixed(2)}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        triggerEventNotification('CART_ABANDONED', {
                          user_name: cart.user_name,
                          cart_items_count: cart.cart_items_count,
                          cart_total: cart.cart_total_value.toFixed(2)
                        });
                        showToast(`Lembrete amigável enviado para ${cart.user_name}!`);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-stone-950 font-black text-xs cursor-pointer transition-colors shadow-sm"
                    >
                      Enviar Lembrete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 4: MERMI INTELLIGENCE IA (SEÇÃO 25) */}
      {/* ========================================================================= */}
      {activeTab === 'ia_analise' && (
        <div className="space-y-4">
          <div className="p-4 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3 text-xs text-emerald-200">
            <BrainCircuit className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-white font-bold">Padrão Analítico Rigoroso (Seção 25):</strong>
              <p className="text-[11px] text-emerald-200/90 leading-relaxed mt-0.5">
                A MerMi IA identifica padrões e anomalias de engajamento no formato: <strong>Dado → Análise → Possível Causa → Sugestão → Impacto Esperado</strong>. A IA nunca dispara campanhas de alto impacto sem a aprovação explícita do administrador.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Card IA 1: Reativação com Points */}
            <div className="bg-[#171E31] border border-stone-800 rounded-3xl p-5 shadow-lg space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                  OPORTUNIDADE DE REATIVAÇÃO
                </span>
                <span className="text-[10px] text-stone-400">MerMi Intelligence</span>
              </div>

              <div className="space-y-2">
                <div>
                  <span className="text-stone-400 text-[10px] font-bold block uppercase">1. DADO:</span>
                  <p className="text-white font-medium">32 clientes ativos estão há mais de 16 dias sem realizar novos pedidos.</p>
                </div>

                <div>
                  <span className="text-stone-400 text-[10px] font-bold block uppercase">2. ANÁLISE:</span>
                  <p className="text-stone-300">Desaceleração do ciclo de recompra na faixa de almoço executivo.</p>
                </div>

                <div>
                  <span className="text-stone-400 text-[10px] font-bold block uppercase">3. POSSÍVEL CAUSA:</span>
                  <p className="text-stone-300">Fim do ciclo do combo anterior sem lembrete do saldo de MerMi Points disponível.</p>
                </div>

                <div>
                  <span className="text-stone-400 text-[10px] font-bold block uppercase">4. SUGESTÃO DA IA:</span>
                  <p className="text-emerald-400 font-semibold">
                    Disparar automação destacando que cada cliente possui saldo médio de 180 Points para abater na marmita favorita.
                  </p>
                </div>

                <div>
                  <span className="text-stone-400 text-[10px] font-bold block uppercase">5. IMPACTO ESTIMADO:</span>
                  <p className="text-stone-300">Recuperação de até 11 pedidos (~ R$ 380,00 de faturamento) sem concessão de desconto artificial.</p>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-800">
                <button
                  onClick={() => {
                    triggerEventNotification('CUSTOMER_INACTIVE', { favorite_dish: 'Frango Fit' });
                    showToast('Campanha sugerida aprovada e enviada para o segmento!');
                  }}
                  className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-stone-950 font-black text-xs cursor-pointer transition-colors shadow-sm"
                >
                  Aprovar & Disparar Notificação
                </button>
              </div>
            </div>

            {/* Card IA 2: Inscrições MERMI RUN */}
            <div className="bg-[#171E31] border border-stone-800 rounded-3xl p-5 shadow-lg space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold">
                  MERMI RUN · ENGAJAMENTO
                </span>
                <span className="text-[10px] text-stone-400">MerMi Intelligence</span>
              </div>

              <div className="space-y-2">
                <div>
                  <span className="text-stone-400 text-[10px] font-bold block uppercase">1. DADO:</span>
                  <p className="text-white font-medium">Restam apenas 18 vagas para a prova oficial de 5K no Parque Ibirapuera.</p>
                </div>

                <div>
                  <span className="text-stone-400 text-[10px] font-bold block uppercase">2. ANÁLISE:</span>
                  <p className="text-stone-300">Ritmo de inscrições reduziu nos últimos 2 dias com 85% do lote preenchido.</p>
                </div>

                <div>
                  <span className="text-stone-400 text-[10px] font-bold block uppercase">3. POSSÍVEL CAUSA:</span>
                  <p className="text-stone-300">Falta de aviso de últimas vagas para a comunidade de corredores.</p>
                </div>

                <div>
                  <span className="text-stone-400 text-[10px] font-bold block uppercase">4. SUGESTÃO DA IA:</span>
                  <p className="text-blue-300 font-semibold">
                    Enviar notificação Push para os participantes de desafios e comunidade: "Últimas 18 vagas para o MERMI RUN 5K".
                  </p>
                </div>

                <div>
                  <span className="text-stone-400 text-[10px] font-bold block uppercase">5. IMPACTO ESTIMADO:</span>
                  <p className="text-stone-300">Preenchimento total das vagas e arrecadação de + R$ 1.602,00 no evento.</p>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-800">
                <button
                  onClick={() => {
                    sendAppNotification({
                      user_id: 'segment-runners',
                      type: 'in_app',
                      category: 'MERMI_RUN',
                      title: '🏃 Últimas 18 Vagas: MERMI RUN 5K!',
                      message: 'A largada oficial se aproxima. Garanta seu kit atleta antes do encerramento das inscrições.',
                      action_type: 'deep_link',
                      action_target: 'corridas',
                      priority: 'alta',
                      source: 'mermi_ia',
                      channel: 'push'
                    });
                    showToast('Aviso de últimas vagas disparado com sucesso!');
                  }}
                  className="w-full py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-stone-950 font-black text-xs cursor-pointer transition-colors shadow-sm"
                >
                  Aprovar & Disparar Aviso aos Corredores
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 5: DISPARO MANUAL & BROADCAST AUDITÁVEL */}
      {/* ========================================================================= */}
      {activeTab === 'disparo_manual' && (
        <div className="bg-[#171E31] border border-stone-800 rounded-3xl p-6 shadow-xl space-y-5 text-xs max-w-xl">
          <div className="border-b border-stone-800 pb-3">
            <h3 className="text-base font-black text-white font-['Outfit']">
              Disparar Comunicado Imediato
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Envio instantâneo para clientes ativos com registro na trilha de auditoria
            </p>
          </div>

          <form onSubmit={handleManualBroadcast} className="space-y-4">
            <div>
              <label className="text-stone-300 font-bold block mb-1">Público-Alvo Segmentado</label>
              <select
                value={manualAudience}
                onChange={(e) => setManualAudience(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
              >
                <option value="todos">Todos os Clientes</option>
                <option value="ativos">Clientes Ativos (Últimos 14 dias)</option>
                <option value="inativos">Clientes Inativos (+15 dias)</option>
                <option value="run">Participantes do MERMI RUN</option>
                <option value="vip">Clientes VIP / Alto Ticket</option>
              </select>
            </div>

            <div>
              <label className="text-stone-300 font-bold block mb-1">Título da Notificação</label>
              <input
                type="text"
                value={manualTitle}
                onChange={(e) => setManualTitle(e.target.value)}
                placeholder="Ex: Horário especial de entrega hoje"
                className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                required
              />
            </div>

            <div>
              <label className="text-stone-300 font-bold block mb-1">Mensagem</label>
              <textarea
                rows={3}
                value={manualMsg}
                onChange={(e) => setManualMsg(e.target.value)}
                placeholder="Texto explicativo direto..."
                className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                required
              />
            </div>

            <div>
              <label className="text-stone-300 font-bold block mb-1">Página de Destino (Deep Link)</label>
              <select
                value={manualTarget}
                onChange={(e) => setManualTarget(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
              >
                <option value="home">Home Principal</option>
                <option value="cardapio">Cardápio Fit</option>
                <option value="points">MerMi Points</option>
                <option value="resgate">Resgate da Semana</option>
                <option value="corridas">MERMI RUN</option>
                <option value="desafios">Desafios</option>
                <option value="comunidade">Comunidade</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#0EB24A] hover:bg-[#0ca042] text-stone-950 font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Realizar Disparo Imediato</span>
            </button>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: NOVA AUTOMAÇÃO */}
      {/* ========================================================================= */}
      {isCreatingAuto && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <form onSubmit={handleCreateAutoSubmit} className="bg-[#171E31] border border-stone-700 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl text-xs max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-black text-white font-['Outfit']">
              Criar Nova Automação no MERMI CONTROL
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-stone-300 font-bold block mb-1">Nome da Automação</label>
                <input
                  type="text"
                  value={autoName}
                  onChange={(e) => setAutoName(e.target.value)}
                  placeholder="Ex: Lembrete de Hidratação Noturna"
                  className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-stone-300 font-bold block mb-1">Evento Gatilho</label>
                  <select
                    value={autoTrigger}
                    onChange={(e) => setAutoTrigger(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white font-mono"
                  >
                    <option value="ORDER_CREATED">ORDER_CREATED</option>
                    <option value="PAYMENT_APPROVED">PAYMENT_APPROVED</option>
                    <option value="ORDER_SHIPPED">ORDER_SHIPPED</option>
                    <option value="ORDER_DELIVERED">ORDER_DELIVERED</option>
                    <option value="POINTS_EARNED">POINTS_EARNED</option>
                    <option value="POINTS_EXPIRING">POINTS_EXPIRING</option>
                    <option value="DROP_UNLOCKED">DROP_UNLOCKED</option>
                    <option value="RUN_REGISTERED">RUN_REGISTERED</option>
                    <option value="RUN_REMINDER">RUN_REMINDER</option>
                    <option value="WATER_REMINDER">WATER_REMINDER</option>
                    <option value="SLEEP_REMINDER">SLEEP_REMINDER</option>
                    <option value="CART_ABANDONED">CART_ABANDONED</option>
                    <option value="CUSTOMER_INACTIVE">CUSTOMER_INACTIVE</option>
                    <option value="CHALLENGE_COMPLETED">CHALLENGE_COMPLETED</option>
                  </select>
                </div>

                <div>
                  <label className="text-stone-300 font-bold block mb-1">Nível de Aprovação</label>
                  <select
                    value={autoLevel}
                    onChange={(e) => setAutoLevel(parseInt(e.target.value) as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                  >
                    <option value={1}>Nível 1 (Automático Imediato)</option>
                    <option value={2}>Nível 2 (Regras Prévias)</option>
                    <option value={3}>Nível 3 (Requer Validação)</option>
                    <option value={4}>Nível 4 (Somente Admin)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-stone-300 font-bold block mb-1">Título do Template</label>
                <input
                  type="text"
                  value={autoTitle}
                  onChange={(e) => setAutoTitle(e.target.value)}
                  placeholder="Ex: Hora de recarregar as energias! 🥗"
                  className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-stone-300 font-bold block mb-1">
                  Mensagem do Template (suporta variáveis: {'{{user_name}}'}, {'{{points_balance}}'}, {'{{order_number}}'})
                </label>
                <textarea
                  rows={2}
                  value={autoMsg}
                  onChange={(e) => setAutoMsg(e.target.value)}
                  placeholder="Olá, {{user_name}}! Suas marmitas estão..."
                  className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-stone-300 font-bold block mb-1">Destino (Deep Link)</label>
                  <select
                    value={autoTarget}
                    onChange={(e) => setAutoTarget(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                  >
                    <option value="pedidos">pedidos</option>
                    <option value="points">points</option>
                    <option value="resgate">resgate</option>
                    <option value="drop_surpresa">drop_surpresa</option>
                    <option value="corridas">corridas</option>
                    <option value="desafios">desafios</option>
                    <option value="agua">agua</option>
                    <option value="cardapio">cardapio</option>
                  </select>
                </div>

                <div>
                  <label className="text-stone-300 font-bold block mb-1">Intervalo Anti-Spam (Horas)</label>
                  <input
                    type="number"
                    value={autoLimitHours}
                    onChange={(e) => setAutoLimitHours(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-3">
              <button
                type="button"
                onClick={() => setIsCreatingAuto(false)}
                className="flex-1 py-2.5 rounded-xl bg-stone-800 text-stone-300 font-bold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-[#0EB24A] text-stone-950 font-black uppercase"
              >
                Salvar Automação
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: NOVA CAMPANHA */}
      {/* ========================================================================= */}
      {isCreatingCamp && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <form onSubmit={handleCreateCampSubmit} className="bg-[#171E31] border border-stone-700 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl text-xs max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-black text-white font-['Outfit']">
              Criar Campanha Inteligente
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-stone-300 font-bold block mb-1">Nome da Campanha</label>
                <input
                  type="text"
                  value={campName}
                  onChange={(e) => setCampName(e.target.value)}
                  placeholder="Ex: Semana de Treinos & Alta Proteína"
                  className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-stone-300 font-bold block mb-1">Objetivo</label>
                  <select
                    value={campObjective}
                    onChange={(e) => setCampObjective(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white font-mono"
                  >
                    <option value="lancamento">Lançamento de Pratos</option>
                    <option value="venda">Vendas & Conversão</option>
                    <option value="reativacao">Reativação de Inativos</option>
                    <option value="points">MerMi Points & Ledger</option>
                    <option value="mermi_run">MERMI RUN Oficial</option>
                    <option value="desafio">Desafios de Constância</option>
                  </select>
                </div>

                <div>
                  <label className="text-stone-300 font-bold block mb-1">Público Dinâmico</label>
                  <select
                    value={campAudience}
                    onChange={(e) => setCampAudience(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                  >
                    <option value="ativos">Clientes Ativos</option>
                    <option value="novos">Novos Clientes</option>
                    <option value="inativos">Inativos (+15 dias)</option>
                    <option value="run">Corredores MERMI RUN</option>
                    <option value="todos">Todos os Usuários</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-stone-300 font-bold block mb-1">Título da Comunicação</label>
                <input
                  type="text"
                  value={campTitle}
                  onChange={(e) => setCampTitle(e.target.value)}
                  placeholder="Ex: Novos Pratos com 40g de Proteína"
                  className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-stone-300 font-bold block mb-1">Mensagem</label>
                <textarea
                  rows={2}
                  value={campMsg}
                  onChange={(e) => setCampMsg(e.target.value)}
                  placeholder="Corpo da notificação recebida..."
                  className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-stone-300 font-bold block mb-1">Asset Oficial (Asset Manager)</label>
                  <select
                    value={campAssetId}
                    onChange={(e) => setCampAssetId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white font-mono"
                  >
                    {OFFICIAL_ASSET_REGISTRY.map((a) => (
                      <option key={a.asset_id} value={a.asset_id}>
                        {a.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-stone-300 font-bold block mb-1">Deep Link Destino</label>
                  <select
                    value={campDeepLink}
                    onChange={(e) => setCampDeepLink(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                  >
                    <option value="cardapio">Cardápio Fit</option>
                    <option value="points">MerMi Points</option>
                    <option value="resgate">Resgate da Semana</option>
                    <option value="corridas">MERMI RUN</option>
                    <option value="desafios">Desafios</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-3">
              <button
                type="button"
                onClick={() => setIsCreatingCamp(false)}
                className="flex-1 py-2.5 rounded-xl bg-stone-800 text-stone-300 font-bold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-[#0EB24A] text-stone-950 font-black uppercase"
              >
                Publicar Campanha
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
