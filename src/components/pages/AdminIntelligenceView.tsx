import React, { useState } from 'react';
import { useMermiStore } from '../../context/MermiStoreContext';
import {
  INITIAL_INTELLIGENCE_METRICS,
  INITIAL_INTELLIGENCE_INSIGHTS
} from '../../data/defaultData';
import { MarmitaCategory, MarmitaSize } from '../../types';
import {
  TrendingUp,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Sliders,
  DollarSign,
  Award,
  Users,
  BrainCircuit,
  ArrowUpRight,
  Lightbulb,
  CheckCircle2
} from 'lucide-react';

export const AdminIntelligenceView: React.FC = () => {
  const {
    user,
    setUserPoints,
    weeklyMember,
    updateWeeklyMember,
    pricing,
    updatePrice,
    resetToOfficialDefaults,
    showToast
  } = useMermiStore();

  // Local state for live test controls
  const [customPointsInput, setCustomPointsInput] = useState(user.mermiPoints.toString());
  const [memberHandleInput, setMemberHandleInput] = useState(weeklyMember.handle);
  const [memberPointsInput, setMemberPointsInput] = useState(weeklyMember.points.toString());
  const [memberOrdersInput, setMemberOrdersInput] = useState(weeklyMember.ordersCount.toString());

  const handleApplyCustomPoints = () => {
    const val = parseInt(customPointsInput, 10);
    if (!isNaN(val)) {
      setUserPoints(val);
      showToast(`Pontos do usuário alterados para ${val} pts!`);
    }
  };

  const handleApplyMemberChanges = () => {
    updateWeeklyMember({
      handle: memberHandleInput,
      points: parseInt(memberPointsInput, 10) || 86,
      ordersCount: parseInt(memberOrdersInput, 10) || 7,
    });
  };

  return (
    <div className="min-h-screen bg-[#FBF7EE] text-stone-900 pb-28 pt-4 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-stone-950 text-white rounded-3xl p-5 sm:p-6 border border-stone-800 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/30 flex items-center gap-1">
                  <BrainCircuit className="w-3.5 h-3.5 text-amber-400" />
                  BLOCO 01 · SEÇÃO 11 & 16
                </span>
                <span className="text-[10px] font-bold text-stone-400">
                  Inteligência Ativa de Negócio
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black font-['Outfit'] mt-1.5 text-white">
                MerMi Intelligence & Gestor de Dados Dinâmicos
              </h1>
              <p className="text-xs text-stone-300 mt-1 max-w-xl">
                Separação estrita entre <strong>DESIGN</strong> e <strong>DADOS</strong>. Altere pontos, membro da semana ou preços sem reconstruir a aplicação.
              </p>
            </div>

            <button
              onClick={resetToOfficialDefaults}
              className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 font-bold text-xs uppercase tracking-wider border border-stone-700 transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-center shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restaurar Padrões Oficiais
            </button>
          </div>

          {/* Section 11 KPI Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-stone-800">
            {INITIAL_INTELLIGENCE_METRICS.map((kpi, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-stone-900 border border-stone-800">
                <span className="text-[10px] font-bold text-stone-400 uppercase block truncate">{kpi.label}</span>
                <span className="text-lg font-black text-white font-['Outfit'] block mt-0.5">{kpi.value}</span>
                <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 mt-1">
                  <span>{kpi.change}</span>
                  <span className="text-[8px] text-stone-400 truncate">vs mês ant.</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Data Controls: Demonstrating "Design != Dados" */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base sm:text-lg font-black text-stone-900 font-['Outfit']">
              Gestor de Dados Dinâmicos em Tempo Real
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Control 1: User Points (Foto 09 Resgate da Semana Dynamic Proof) */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-stone-800 font-['Outfit']">
                  1. Saldo do Usuário (Points)
                </span>
                <span className="text-xs font-black text-amber-600">
                  Atual: {user.mermiPoints} pts
                </span>
              </div>

              <p className="text-xs text-stone-600">
                Altere para testar o comportamento da página de Resgate (128, 250, 450, 1.250 pts) sem alterar o visual.
              </p>

              <div className="flex gap-2">
                <input
                  type="number"
                  value={customPointsInput}
                  onChange={(e) => setCustomPointsInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-white border border-stone-300 font-bold"
                />
                <button
                  onClick={handleApplyCustomPoints}
                  className="px-4 py-1.5 rounded-xl bg-stone-900 text-white text-xs font-bold uppercase hover:bg-stone-800 cursor-pointer"
                >
                  Aplicar
                </button>
              </div>

              <div className="flex flex-wrap gap-1 text-[10px]">
                <button onClick={() => setUserPoints(128)} className="px-2 py-0.5 rounded bg-stone-200 font-bold hover:bg-stone-300">Foto 09 (128)</button>
                <button onClick={() => setUserPoints(250)} className="px-2 py-0.5 rounded bg-stone-200 font-bold hover:bg-stone-300">250 pts</button>
                <button onClick={() => setUserPoints(450)} className="px-2 py-0.5 rounded bg-stone-200 font-bold hover:bg-stone-300">450 pts</button>
                <button onClick={() => setUserPoints(1250)} className="px-2 py-0.5 rounded bg-stone-200 font-bold hover:bg-stone-300">Foto 01 (1.250)</button>
              </div>
            </div>

            {/* Control 2: Membro da Semana (Foto 10 Dynamic Proof) */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-stone-800 font-['Outfit']">
                  2. Membro da Semana
                </span>
                <span className="text-xs font-black text-rose-600">
                  {weeklyMember.handle}
                </span>
              </div>

              <p className="text-xs text-stone-600">
                Altere o membro da semana para provar que a Foto 10 reflete dados do banco.
              </p>

              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  value={memberHandleInput}
                  onChange={(e) => setMemberHandleInput(e.target.value)}
                  placeholder="@handle"
                  className="px-2 py-1.5 text-xs rounded-xl bg-white border border-stone-300 font-bold"
                />
                <input
                  type="number"
                  value={memberPointsInput}
                  onChange={(e) => setMemberPointsInput(e.target.value)}
                  placeholder="Points"
                  className="px-2 py-1.5 text-xs rounded-xl bg-white border border-stone-300 font-bold"
                />
                <input
                  type="number"
                  value={memberOrdersInput}
                  onChange={(e) => setMemberOrdersInput(e.target.value)}
                  placeholder="Pedidos"
                  className="px-2 py-1.5 text-xs rounded-xl bg-white border border-stone-300 font-bold"
                />
              </div>

              <button
                onClick={handleApplyMemberChanges}
                className="w-full py-1.5 rounded-xl bg-stone-900 text-white text-xs font-bold uppercase hover:bg-stone-800 cursor-pointer"
              >
                Salvar Membro da Semana
              </button>
            </div>

          </div>

          {/* Control 3: Tabela de Preços Oficiais */}
          <div className="pt-4 border-t border-stone-200">
            <span className="text-xs font-black uppercase text-stone-800 font-['Outfit'] block mb-2">
              3. Preços Base Oficiais (Fit & Fit Premium)
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {pricing.map((p, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-[10px] font-bold text-stone-500 uppercase block">
                    {p.category === 'fit' ? 'Fit' : 'Premium'} ({p.size})
                  </span>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="font-bold text-stone-700">R$</span>
                    <input
                      type="number"
                      step="0.50"
                      value={p.price}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        if (!isNaN(val)) updatePrice(p.category, p.size, val);
                      }}
                      className="w-16 px-1 py-0.5 bg-white border border-stone-300 rounded font-black text-stone-900"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 11 Active Insights Engine */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <h2 className="text-base sm:text-lg font-black text-stone-900 font-['Outfit']">
                Diagnósticos & Insights Ativos do Negócio
              </h2>
            </div>
            <span className="text-[10px] font-bold text-stone-500">
              3 Insights Gerados
            </span>
          </div>

          <div className="space-y-3">
            {INITIAL_INTELLIGENCE_INSIGHTS.map((ins) => (
              <div
                key={ins.id}
                className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-2"
              >
                <div>
                  <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-900 text-white">
                    DADO OBSERVADO
                  </span>
                  <p className="font-bold text-stone-900 mt-1">{ins.dado}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-stone-200/80 text-[11px]">
                  <div>
                    <span className="font-bold text-stone-500 uppercase text-[9px] block">Análise:</span>
                    <p className="text-stone-700">{ins.analise}</p>
                  </div>
                  <div>
                    <span className="font-bold text-stone-500 uppercase text-[9px] block">Possível Causa:</span>
                    <p className="text-stone-700">{ins.possivelCausa}</p>
                  </div>
                  <div>
                    <span className="font-bold text-emerald-700 uppercase text-[9px] block">Ação Sugerida:</span>
                    <p className="font-semibold text-emerald-900">{ins.sugestao}</p>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-[10px] font-bold flex items-center justify-between">
                  <span>Impacto Esperado: {ins.impactoEsperado}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
