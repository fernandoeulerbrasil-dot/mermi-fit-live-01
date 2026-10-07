import React, { useState } from 'react';
import { useMermiStore } from '../../context/MermiStoreContext';
import { MermiIntelligenceInsightFull } from '../../types/mermiControl';
import {
  BrainCircuit,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  TrendingUp,
  Package,
  DollarSign,
  Award,
  Megaphone,
  ArrowRight,
  ShieldAlert,
  Flame,
  Clock,
  Layers
} from 'lucide-react';

export const MermiIntelligenceFullView: React.FC = () => {
  const {
    intelligenceInsightsFull,
    confirmHighImpactAction,
    cancelHighImpactAction,
    adminAlerts,
    resolveAdminAlert,
    products,
    orders,
    inventory,
    crmCustomers,
    showToast
  } = useMermiStore();

  const [activeCategory, setActiveCategory] = useState<string>('todos');
  const [selectedHighImpactInsight, setSelectedHighImpactInsight] = useState<MermiIntelligenceInsightFull | null>(null);

  const filteredInsights = activeCategory === 'todos'
    ? intelligenceInsightsFull
    : intelligenceInsightsFull.filter((i) => i.category === activeCategory);

  const pendingHighImpactCount = intelligenceInsightsFull.filter(
    (i) => i.isHighImpactAction && i.status === 'sugerido'
  ).length;

  const categoryIcons: Record<string, any> = {
    vendas: TrendingUp,
    produtos: DollarSign,
    financeiro: DollarSign,
    estoque: Package,
    campanhas: Megaphone,
    points: Award
  };

  const handleConfirmAction = (insightId: string) => {
    confirmHighImpactAction(insightId);
    setSelectedHighImpactInsight(null);
  };

  const handleCancelAction = (insightId: string) => {
    cancelHighImpactAction(insightId);
    setSelectedHighImpactInsight(null);
  };

  return (
    <div className="space-y-6">

      {/* HEADER & BANNER DE GOVERNANÇA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/30 flex items-center gap-1">
              <BrainCircuit className="w-3.5 h-3.5 text-amber-400" />
              INTELIGÊNCIA EXECUTIVA DO NEGÓCIO
            </span>
            <span className="text-[10px] font-bold text-stone-400">
              SEPARADA DA MERMI IA DO CLIENTE
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white font-['Outfit'] mt-1">
            MerMi Intelligence
          </h2>
          <p className="text-xs text-stone-400">
            Transforma dados operacionais, vendas e estoque em tomadas de decisão estruturadas
          </p>
        </div>

        {pendingHighImpactCount > 0 && (
          <div className="px-3.5 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>{pendingHighImpactCount} Ação(ões) de Alto Impacto aguardando autorização</span>
          </div>
        )}
      </div>

      {/* REGRA CONSTITUCIONAL: IA NÃO DECIDE SOZINHA (SEÇÃO 46) */}
      <div className="p-4 rounded-3xl bg-[#101626] border border-stone-800 text-xs text-stone-300 flex items-start gap-3 shadow-md">
        <ShieldAlert className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-white text-xs">
            DIRETRIZ DE GOVERNANÇA: A MERMI INTELLIGENCE NÃO DECIDE SOZINHA
          </h4>
          <p className="text-[11px] text-stone-400 leading-relaxed">
            A MerMi Intelligence analisa tendências, calcula projeções e formula sugestões estratégicas.
            <strong> Jamais</strong> altera preços automaticamente, cancela produtos, compra estoque, realiza transações financeiras ou altera regras críticas sem o comando expresso do administrador.
          </p>
        </div>
      </div>

      {/* ALERTAS DO SISTEMA (SEÇÃO 43) */}
      {adminAlerts.some((a) => !a.resolved) && (
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase text-stone-400 tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            Alertas Críticos Ativos ({adminAlerts.filter((a) => !a.resolved).length})
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {adminAlerts.filter((a) => !a.resolved).map((alert) => (
              <div
                key={alert.id}
                className="bg-[#171E31] border border-rose-500/30 rounded-3xl p-4 shadow-lg flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-rose-400 uppercase text-[9px] bg-rose-500/20 px-2 py-0.2 rounded-full border border-rose-500/30">
                      {alert.type.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-stone-500">{alert.timestamp}</span>
                  </div>
                  <h5 className="font-bold text-white text-xs">{alert.title}</h5>
                  <p className="text-stone-400 text-[11px] leading-relaxed">{alert.description}</p>
                </div>

                <button
                  onClick={() => resolveAdminAlert(alert.id)}
                  className="px-2.5 py-1 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-[10px] shrink-0 cursor-pointer"
                >
                  Resolver
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FILTER CATEGORIES */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'todos', label: 'Todos os Insights' },
          { id: 'vendas', label: 'Vendas & Demanda' },
          { id: 'estoque', label: 'Estoque & Previsão' },
          { id: 'campanhas', label: 'Campanhas & Retenção' },
          { id: 'points', label: 'Points & Resgates' }
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-[#0EB24A] text-stone-950 font-black shadow-md'
                : 'bg-[#171E31] text-stone-400 hover:text-white border border-stone-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* INSIGHTS CARDS COM FORMATO ESTRITO (SEÇÃO 36) */}
      <div className="space-y-4">
        {filteredInsights.map((insight) => {
          const Icon = categoryIcons[insight.category] || Sparkles;

          return (
            <div
              key={insight.id}
              className={`bg-[#171E31] border rounded-3xl p-5 sm:p-6 shadow-xl space-y-4 transition-all ${
                insight.isHighImpactAction && insight.status === 'sugerido'
                  ? 'border-amber-500/50 shadow-amber-500/5'
                  : 'border-stone-800'
              }`}
            >
              {/* HEADER DO INSIGHT */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-stone-800 flex items-center justify-center text-emerald-400 shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 font-['Outfit'] block">
                      CATEGORIA: {insight.category.toUpperCase()}
                    </span>
                    <span className="text-xs text-stone-400 font-medium">
                      Análise Automatizada de Inteligência
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {insight.isHighImpactAction && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-black text-[9px] uppercase tracking-wider border border-amber-500/40">
                      Ação de Alto Impacto
                    </span>
                  )}
                  <span
                    className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                      insight.status === 'confirmado'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : insight.status === 'cancelado'
                        ? 'bg-stone-800 text-stone-500 border-stone-700'
                        : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                    }`}
                  >
                    Status: {insight.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* FORMATO ESTRITO: DADO -> ANALISE -> POSSIVEL CAUSA -> SUGESTAO -> IMPACTO ESTIMADO */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                
                {/* 1. DADO */}
                <div className="p-3.5 rounded-2xl bg-[#0E131F] border border-stone-800 space-y-1">
                  <span className="text-[10px] font-black uppercase text-stone-400 block tracking-wider">
                    1. Dado Real Identificado
                  </span>
                  <p className="text-white font-semibold leading-relaxed">
                    {insight.dado}
                  </p>
                </div>

                {/* 2. ANÁLISE */}
                <div className="p-3.5 rounded-2xl bg-[#0E131F] border border-stone-800 space-y-1">
                  <span className="text-[10px] font-black uppercase text-stone-400 block tracking-wider">
                    2. Análise Estratégica
                  </span>
                  <p className="text-stone-300 leading-relaxed">
                    {insight.analise}
                  </p>
                </div>

                {/* 3. POSSÍVEL CAUSA */}
                <div className="p-3.5 rounded-2xl bg-[#0E131F] border border-stone-800 space-y-1">
                  <span className="text-[10px] font-black uppercase text-stone-400 block tracking-wider">
                    3. Possível Causa
                  </span>
                  <p className="text-stone-300 leading-relaxed">
                    {insight.possivelCausa}
                  </p>
                </div>

                {/* 4. SUGESTÃO */}
                <div className="p-3.5 rounded-2xl bg-[#0E131F] border border-stone-800 space-y-1">
                  <span className="text-[10px] font-black uppercase text-emerald-400 block tracking-wider">
                    4. Sugestão da Inteligência
                  </span>
                  <p className="text-emerald-300 font-semibold leading-relaxed">
                    {insight.sugestao}
                  </p>
                </div>

              </div>

              {/* 5. IMPACTO ESTIMADO */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/30 to-amber-950/20 border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-[10px] font-black uppercase text-amber-400 block tracking-wider">
                    5. Impacto Estimado no Negócio
                  </span>
                  <p className="text-white font-bold mt-0.5">
                    {insight.impactoEstimado}
                  </p>
                </div>

                {/* BOTÕES DE AÇÃO DE ALTO IMPACTO (SEÇÃO 47) */}
                {insight.isHighImpactAction && insight.status === 'sugerido' && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setSelectedHighImpactInsight(insight)}
                      className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold cursor-pointer transition-all"
                    >
                      Revisar
                    </button>
                    <button
                      onClick={() => handleConfirmAction(insight.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#0EB24A] hover:bg-[#0ca042] text-stone-950 text-xs font-black cursor-pointer shadow-md transition-all active:scale-95"
                    >
                      Confirmar
                    </button>
                    <button
                      onClick={() => handleCancelAction(insight.id)}
                      className="px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs font-bold cursor-pointer transition-all"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL DE REVISÃO DE AÇÃO DE ALTO IMPACTO */}
      {selectedHighImpactInsight && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#171E31] border border-amber-500/50 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-amber-400">
                  REVISÃO DE AÇÃO DE ALTO IMPACTO
                </span>
                <h3 className="text-base font-black text-white font-['Outfit'] mt-0.5">
                  Autorização Expressa do Proprietário
                </h3>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0E131F] border border-stone-800 text-xs space-y-2">
              <span className="font-bold text-white block">Proposta da Inteligência:</span>
              <p className="text-emerald-300 font-semibold leading-relaxed">
                {selectedHighImpactInsight.sugestao}
              </p>

              <span className="font-bold text-white block pt-2 border-t border-stone-800">
                Motivo e Causa:
              </span>
              <p className="text-stone-400 leading-relaxed">
                {selectedHighImpactInsight.analise} (Causa: {selectedHighImpactInsight.possivelCausa})
              </p>

              <span className="font-bold text-white block pt-2 border-t border-stone-800">
                Impacto Estimado:
              </span>
              <p className="text-amber-300 font-bold">
                {selectedHighImpactInsight.impactoEstimado}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setSelectedHighImpactInsight(null)}
                className="flex-1 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-bold text-stone-300 cursor-pointer"
              >
                Voltar
              </button>
              <button
                onClick={() => handleCancelAction(selectedHighImpactInsight.id)}
                className="flex-1 py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-xs font-bold text-rose-300 cursor-pointer"
              >
                Rejeitar Ação
              </button>
              <button
                onClick={() => handleConfirmAction(selectedHighImpactInsight.id)}
                className="flex-1 py-2.5 rounded-xl bg-[#0EB24A] hover:bg-[#0ca042] text-xs font-black text-stone-950 cursor-pointer shadow-md"
              >
                Confirmar & Executar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
