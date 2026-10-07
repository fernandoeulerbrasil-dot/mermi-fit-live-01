import React, { useState } from 'react';
import { useMermiStore } from '../../context/MermiStoreContext';
import { DropSurpresaItem } from '../../types/dropSurpresa';
import { OfficialPointsBadge } from '../brand/OfficialPointsBadge';
import {
  Sparkles,
  Gift,
  Flame,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  HelpCircle,
  Trophy,
  Zap,
  Tag,
  AlertCircle
} from 'lucide-react';

export interface DropSurpresaViewProps {
  onNavigate?: (tab: string) => void;
}

export const DropSurpresaView: React.FC<DropSurpresaViewProps> = ({ onNavigate }) => {
  const { user, drops, dropClaims, claimDrop, showToast } = useMermiStore();
  const [selectedDrop, setSelectedDrop] = useState<DropSurpresaItem | null>(null);
  const [isOpening, setIsOpening] = useState(false);
  const [unveiledReward, setUnveiledReward] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'disponiveis' | 'meus_drops' | 'regras'>('disponiveis');

  const activeDrops = drops.filter((d) => d.active);

  const handleOpenChest = (drop: DropSurpresaItem) => {
    if (user.mermiPoints < drop.minPointsRequired) {
      showToast(`Você precisa de ao menos ${drop.minPointsRequired} Points para abrir este Drop.`);
      return;
    }
    if (user.ordersCount < drop.minOrdersRequired) {
      showToast(`Você precisa de pelo menos ${drop.minOrdersRequired} pedidos realizados.`);
      return;
    }

    setSelectedDrop(drop);
    setIsOpening(true);
    setUnveiledReward(null);

    // Simulate epic 3D chest opening fanfare
    setTimeout(() => {
      const res = claimDrop(drop.id);
      setIsOpening(false);
      if (res.success && res.reward) {
        setUnveiledReward(res.reward);
      }
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#030816] text-stone-100 pb-28 pt-2 px-3 sm:px-4">
      <div className="max-w-2xl mx-auto space-y-5">
        
        {/* TOP STATUS BAR & POINTS */}
        <div className="bg-[#09142E]/90 border border-blue-500/30 rounded-3xl p-4 sm:p-5 shadow-2xl flex items-center justify-between backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-[#030816] rounded-[14px] flex items-center justify-center text-2xl">
                🎁
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 font-['Outfit']">
                  MÓDULO EXCLUSIVO
                </span>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold text-[9px]">
                  BETA VIP
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white font-['Outfit']">
                MERMI DROP SURPRESA
              </h1>
            </div>
          </div>

          <div
            onClick={() => onNavigate?.('points')}
            className="flex flex-col items-end p-2.5 rounded-2xl bg-blue-950/80 border border-blue-400/40 cursor-pointer hover:border-blue-300 transition-all text-right group active:scale-95"
            title="Ver carteira de MerMi Points"
          >
            <span className="text-[9px] font-bold text-blue-300 uppercase tracking-wider">
              Seu Saldo
            </span>
            <span className="text-base sm:text-lg font-black text-white font-['Outfit'] flex items-center gap-1">
              ⭐ {user.mermiPoints.toLocaleString('pt-BR')} <span className="text-[10px] text-cyan-300">pts</span>
            </span>
          </div>
        </div>

        {/* HERO BANNER DO DROP (Cartaz Oficial 07 Reference) */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A1A40] via-[#05112B] to-[#020713] border-2 border-blue-500/40 p-5 sm:p-6 shadow-2xl">
          {/* Glowing background orbs */}
          <div className="absolute -top-16 -right-16 w-52 h-52 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-52 h-52 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-700 p-1 shrink-0 shadow-xl shadow-cyan-500/30 animate-pulse">
              <div className="w-full h-full bg-[#040C20] rounded-[22px] flex flex-col items-center justify-center relative overflow-hidden">
                <span className="text-4xl sm:text-5xl block animate-bounce">🎁</span>
                <span className="text-[10px] font-black text-cyan-300 font-['Outfit'] uppercase mt-1">
                  SECRETO
                </span>
              </div>
            </div>

            <div className="flex-1 space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-300 text-[10px] font-black tracking-wider uppercase">
                <Zap size={12} className="text-cyan-300" />
                SEUS PEDIDOS VALEM MAIS
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-['Outfit'] leading-tight">
                Drops Misteriosos & Recompensas Relâmpago
              </h2>
              <p className="text-xs sm:text-sm text-blue-200/80 leading-relaxed">
                Ação exclusiva e limitada no ecossistema MerMi Points. Abra caixas misteriosas com bônus de pontos, marmitas gratuitas, brindes e experiências exclusivas!
              </p>
            </div>
          </div>
        </div>

        {/* TABS DE NAVEGAÇÃO INTERNA */}
        <div className="flex rounded-2xl bg-[#09142E] p-1 border border-blue-500/20 text-xs font-bold font-['Outfit']">
          <button
            onClick={() => setActiveTab('disponiveis')}
            className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'disponiveis'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-blue-300/70 hover:text-white'
            }`}
          >
            <Gift size={14} />
            Drops Ativos ({activeDrops.length})
          </button>
          <button
            onClick={() => setActiveTab('meus_drops')}
            className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'meus_drops'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-blue-300/70 hover:text-white'
            }`}
          >
            <Trophy size={14} />
            Meus Drops ({dropClaims.length})
          </button>
          <button
            onClick={() => setActiveTab('regras')}
            className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'regras'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-blue-300/70 hover:text-white'
            }`}
          >
            <HelpCircle size={14} />
            Como Funciona
          </button>
        </div>

        {/* TAB 1: DROPS ATIVOS */}
        {activeTab === 'disponiveis' && (
          <div className="space-y-4">
            {activeDrops.map((drop) => {
              const hasEnoughPoints = user.mermiPoints >= drop.minPointsRequired;
              const hasEnoughOrders = user.ordersCount >= drop.minOrdersRequired;
              const isEligible = hasEnoughPoints && hasEnoughOrders;
              const percentClaimed = Math.round((drop.quantityClaimed / drop.quantityTotal) * 100);

              return (
                <div
                  key={drop.id}
                  className="rounded-3xl bg-[#09142E]/80 border border-blue-500/30 p-5 shadow-xl transition-all hover:border-blue-400/60 relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {drop.badge && (
                          <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-[9px] font-black tracking-wider uppercase font-['Outfit']">
                            {drop.badge}
                          </span>
                        )}
                        <span className="text-[10px] text-blue-300/80 font-medium">
                          Frequência: {drop.frequency}
                        </span>
                      </div>
                      <h3 className="text-lg font-black text-white font-['Outfit']">
                        {drop.title}
                      </h3>
                      <p className="text-xs text-blue-200/70 mt-0.5">
                        {drop.subtitle}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-blue-300 block font-bold">Custo de Entrada</span>
                      <span className="text-sm font-black text-amber-300 font-['Outfit']">
                        {drop.minPointsRequired} Points
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-stone-300 leading-relaxed mb-4 bg-black/30 p-3 rounded-2xl border border-blue-900/40">
                    {drop.description}
                  </p>

                  {/* Stock bar */}
                  <div className="space-y-1 mb-4">
                    <div className="flex justify-between text-[10px] text-blue-300/80 font-medium">
                      <span>Lote Restante:</span>
                      <span className="font-bold text-white">
                        {drop.quantityTotal - drop.quantityClaimed} de {drop.quantityTotal} unidades
                      </span>
                    </div>
                    <div className="w-full h-2 bg-blue-950 rounded-full overflow-hidden border border-blue-800/40">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all"
                        style={{ width: `${percentClaimed}%` }}
                      />
                    </div>
                  </div>

                  {/* Requirements & Action Button */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-blue-900/50">
                    <div className="flex items-center gap-3 text-[11px] text-stone-300 w-full sm:w-auto">
                      <span className={`flex items-center gap-1 ${hasEnoughPoints ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {hasEnoughPoints ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
                        Min. {drop.minPointsRequired} pts
                      </span>
                      <span className={`flex items-center gap-1 ${hasEnoughOrders ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {hasEnoughOrders ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
                        Min. {drop.minOrdersRequired} pedido(s)
                      </span>
                    </div>

                    <button
                      onClick={() => handleOpenChest(drop)}
                      disabled={!isEligible}
                      className={`w-full sm:w-auto px-6 py-2.5 rounded-2xl font-black text-xs font-['Outfit'] uppercase tracking-wider transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer ${
                        isEligible
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/30'
                          : 'bg-stone-800 text-stone-500 cursor-not-allowed border border-stone-700'
                      }`}
                    >
                      <Sparkles size={14} />
                      {isEligible ? 'ABRIR DROP SURPRESA' : 'REQUISITOS PENDENTES'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: MEUS DROPS RESGATADOS */}
        {activeTab === 'meus_drops' && (
          <div className="space-y-3">
            {dropClaims.length === 0 ? (
              <div className="text-center py-12 bg-[#09142E]/50 rounded-3xl border border-blue-900/40 p-6">
                <span className="text-4xl block mb-2">🎁</span>
                <h3 className="text-base font-bold text-white font-['Outfit']">
                  Nenhum Drop resgatado ainda
                </h3>
                <p className="text-xs text-blue-300/70 mt-1 max-w-sm mx-auto">
                  Acumule pontos em seus pedidos e fique atento aos lotes surpresa liberados toda semana.
                </p>
              </div>
            ) : (
              dropClaims.map((claim) => (
                <div
                  key={claim.id}
                  className="bg-[#09142E]/90 border border-blue-500/30 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-lg"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-blue-500/20 text-cyan-300 text-[9px] font-black uppercase font-['Outfit']">
                        {claim.status}
                      </span>
                      <span className="text-[10px] text-stone-400">{claim.claimedAt}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white font-['Outfit']">
                      {claim.rewardLabel}
                    </h4>
                    <p className="text-xs text-blue-200/70">
                      Origem: {claim.dropTitle}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[9px] text-blue-300 block">Voucher / Código</span>
                    <span className="text-xs font-mono font-black text-cyan-300 bg-black/40 px-2.5 py-1 rounded-lg border border-blue-800 block mt-0.5">
                      {claim.codeSnippet}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: REGRAS E COMO FUNCIONA */}
        {activeTab === 'regras' && (
          <div className="bg-[#09142E]/90 border border-blue-500/30 rounded-3xl p-5 sm:p-6 space-y-4">
            <h3 className="text-base font-black text-white font-['Outfit'] flex items-center gap-2">
              <ShieldCheck size={18} className="text-cyan-400" />
              Diretrizes Oficiais do MerMi Drop Surpresa
            </h3>

            <div className="space-y-3 text-xs text-blue-100/90 leading-relaxed">
              <div className="p-3 rounded-2xl bg-black/30 border border-blue-900/50">
                <span className="font-bold text-cyan-300 block mb-1">1. O que é o Drop Surpresa?</span>
                Uma funcionalidade de gamificação onde os clientes fiéis e consistentes desbloqueiam prêmios aleatórios ou caixas misteriosas por tempo limitado.
              </div>

              <div className="p-3 rounded-2xl bg-black/30 border border-blue-900/50">
                <span className="font-bold text-cyan-300 block mb-1">2. Sem custo financeiro</span>
                Nenhum valor em Reais (R$) é cobrado. A elegibilidade é conquistada através do seu saldo de MerMi Points e do seu histórico de pedidos.
              </div>

              <div className="p-3 rounded-2xl bg-black/30 border border-blue-900/50">
                <span className="font-bold text-cyan-300 block mb-1">3. Tipos de Prêmios</span>
                Marmitas Fit gratuitas, injeções relâmpago de +50 a +200 Points, brindes oficiais MerMi (copos, bolsas térmicas) e descontos no frete.
              </div>

              <div className="p-3 rounded-2xl bg-black/30 border border-blue-900/50">
                <span className="font-bold text-cyan-300 block mb-1">4. Lotes Limitados</span>
                Os Drops possuem quantidade total pré-definida. Quando o estoque do Drop chega a zero, a ação é encerrada automaticamente.
              </div>
            </div>
          </div>
        )}

        {/* OPENING MODAL CELEBRATION */}
        {(isOpening || unveiledReward) && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#071330] border-2 border-cyan-400 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-[0_0_50px_rgba(6,182,212,0.4)] relative">
              {isOpening ? (
                <div className="py-8 space-y-4">
                  <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-cyan-400 via-blue-600 to-indigo-700 flex items-center justify-center animate-spin text-5xl shadow-2xl">
                    🎁
                  </div>
                  <h3 className="text-lg font-black text-white font-['Outfit'] animate-pulse">
                    DESBLOQUEANDO SEU DROP...
                  </h3>
                  <p className="text-xs text-cyan-300">
                    Calculando sua recompensa no ecossistema MerMi...
                  </p>
                </div>
              ) : (
                <div className="space-y-4 py-2">
                  <div className="w-20 h-20 mx-auto rounded-full bg-cyan-400/20 border-2 border-cyan-400 flex items-center justify-center text-4xl shadow-xl shadow-cyan-500/30 animate-bounce">
                    🎉
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 font-['Outfit']">
                      DROP RESGATADO COM SUCESSO!
                    </span>
                    <h3 className="text-xl font-black text-white font-['Outfit'] mt-1">
                      {unveiledReward}
                    </h3>
                    <p className="text-xs text-blue-200 mt-1">
                      Sua recompensa já foi creditada e salva na aba "Meus Drops".
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setUnveiledReward(null);
                      setSelectedDrop(null);
                      setActiveTab('meus_drops');
                    }}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-xs font-['Outfit'] uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-lg cursor-pointer"
                  >
                    VER MEUS DROPS
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
