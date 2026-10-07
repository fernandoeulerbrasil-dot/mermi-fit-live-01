import React, { useState } from 'react';
import { useMermiStore } from '../../context/MermiStoreContext';
import { MermiPointsBadge } from '../brand/MermiPointsBadge';
import {
  Award,
  Gift,
  Users,
  Sparkles,
  Flame,
  ArrowRight,
  TrendingUp,
  Share2,
  CheckCircle2,
  Clock,
  History,
  ShieldCheck,
  ChevronRight,
  Target,
  Zap,
  Lock,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { PointTransactionType } from '../../types/gamification';

interface MerMiPointsViewProps {
  onNavigate: (tab: string) => void;
}

export const MerMiPointsView: React.FC<MerMiPointsViewProps> = ({ onNavigate }) => {
  const {
    user,
    presetPoints,
    transactions,
    earningRules,
    badges,
    missions,
    streak,
    pointsSummary,
    completeMission,
    claimStreakMilestone,
    awardPointsByAction
  } = useMermiStore();

  const [logoVariant, setLogoVariant] = useState<'square' | 'horizontal'>('square');
  const [activeTab, setActiveTab] = useState<'acumular' | 'extrato' | 'missoes' | 'conquistas' | 'streak'>('acumular');
  const [extratoFilter, setExtratoFilter] = useState<'todos' | 'ganho' | 'utilizado' | 'ajuste_admin'>('todos');

  // Filtro de transações
  const filteredTransactions = transactions.filter((tx) => {
    if (extratoFilter === 'todos') return true;
    return tx.type === extratoFilter;
  });

  const currentLevel = pointsSummary.currentLevel;
  const nextLevel = pointsSummary.nextLevel;
  const progressPercent = pointsSummary.progressPercent;

  return (
    <div className="min-h-screen bg-[#0F1115] text-white pb-28 pt-4 px-3 sm:px-4 relative overflow-hidden">
      
      {/* Background Ambience: Gold & Orange Halos */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 left-0 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-0 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl mx-auto space-y-6 relative z-10">
        
        {/* Header Badge */}
        <div className="flex flex-col items-center text-center">
          
          {/* Logo Format Selector */}
          <div className="mb-3 inline-flex items-center gap-1 bg-stone-900/90 border border-stone-800 p-1 rounded-full text-xs font-bold shadow-md">
            <button
              onClick={() => setLogoVariant('square')}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                logoVariant === 'square'
                  ? 'bg-amber-500 text-stone-950 shadow-sm'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Quadrado 1:1
            </button>
            <button
              onClick={() => setLogoVariant('horizontal')}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                logoVariant === 'horizontal'
                  ? 'bg-amber-500 text-stone-950 shadow-sm'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Horizontal 3D
            </button>
          </div>

          <div className="py-1">
            <MermiPointsBadge
              size={logoVariant === 'horizontal' ? 95 : 125}
              variant={logoVariant}
              points={pointsSummary.currentBalance}
            />
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-amber-200 font-['Outfit'] mt-3 leading-tight uppercase drop-shadow">
            E se cada pedido valesse mais?
          </h1>
          
          <div className="flex items-center gap-2 mt-1 font-extrabold text-xs sm:text-sm tracking-wide text-stone-300 uppercase font-['Outfit']">
            <span className="text-emerald-400">Você pede.</span>
            <span className="text-amber-400">Você pontua.</span>
            <span className="text-orange-400">Você evolui.</span>
            <span className="text-rose-400">Você ganha!</span>
          </div>
        </div>

        {/* User Status Card (Gamification Level Dinâmico) */}
        <div className="rounded-3xl bg-gradient-to-b from-stone-900 via-stone-900/90 to-stone-950 p-5 border border-amber-500/30 shadow-2xl relative overflow-hidden">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-2xl shadow-inner">
                {currentLevel.badgeIcon || '👑'}
              </div>
              <div>
                <span className="text-[10px] font-black tracking-widest text-amber-400 uppercase">
                  STATUS ATUAL
                </span>
                <h3 className="text-xl font-black text-white font-['Outfit'] flex items-center gap-2">
                  <span>Nível {currentLevel.levelNumber}</span>
                  <span className="text-stone-400">·</span>
                  <span className="text-amber-300">{currentLevel.name}</span>
                </h3>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold text-stone-400 uppercase block">Saldo Real</span>
              <span className="text-2xl sm:text-3xl font-black text-amber-400 font-['Outfit']">
                {pointsSummary.currentBalance.toLocaleString('pt-BR')} <span className="text-xs text-stone-300">pts</span>
              </span>
            </div>
          </div>

          {/* Level Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-stone-400 mb-1.5 font-semibold">
              <span>
                {nextLevel ? (
                  <>Progresso para o <strong>Nível {nextLevel.levelNumber} ({nextLevel.name})</strong></>
                ) : (
                  <strong className="text-amber-300">Nível Máximo Alcançado!</strong>
                )}
              </span>
              <span className="text-amber-400 font-black">
                {progressPercent}% {nextLevel ? `(${pointsSummary.currentBalance} / ${nextLevel.minPoints} pts)` : ''}
              </span>
            </div>
            <div className="w-full h-3 bg-stone-800 rounded-full overflow-hidden p-0.5 border border-stone-700">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 transition-all duration-500 shadow-sm"
                style={{ width: `${Math.max(5, progressPercent)}%` }}
              />
            </div>
          </div>

          {/* Resumo do Extrato Contábil (Regra Central) */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-stone-800/80 text-center">
            <div className="bg-stone-950/60 p-2 rounded-xl border border-stone-800/50">
              <span className="text-[9px] font-bold text-stone-400 uppercase block">Ganhos Totais</span>
              <span className="text-xs sm:text-sm font-black text-emerald-400 font-['Outfit']">
                +{pointsSummary.totalEarned.toLocaleString('pt-BR')} pts
              </span>
            </div>
            <div className="bg-stone-950/60 p-2 rounded-xl border border-stone-800/50">
              <span className="text-[9px] font-bold text-stone-400 uppercase block">Utilizados</span>
              <span className="text-xs sm:text-sm font-black text-rose-400 font-['Outfit']">
                -{pointsSummary.totalUsed.toLocaleString('pt-BR')} pts
              </span>
            </div>
            <div className="bg-stone-950/60 p-2 rounded-xl border border-stone-800/50">
              <span className="text-[9px] font-bold text-stone-400 uppercase block">Constância</span>
              <span className="text-xs sm:text-sm font-black text-amber-400 font-['Outfit'] flex items-center justify-center gap-1">
                <Flame size={12} className="text-orange-500 fill-orange-500" />
                {streak.currentStreakDays} dias
              </span>
            </div>
          </div>

          {/* Benefícios Ativos do Nível */}
          {currentLevel.benefits && currentLevel.benefits.length > 0 && (
            <div className="mt-3 pt-2.5 border-t border-stone-800/60 flex flex-wrap gap-1.5 items-center">
              <span className="text-[10px] font-bold text-stone-400 uppercase mr-1">Vantagens:</span>
              {currentLevel.benefits.map((b, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-bold"
                >
                  ✓ {b}
                </span>
              ))}
            </div>
          )}

          {/* Informação sobre integridade de saldo */}
          <div className="mt-3 pt-3 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
            <span className="text-[10px] font-bold">Saldo Auditado pelo Ledger Contábil Central</span>
            <span className="text-[10px] text-emerald-400 font-bold">● Conexão Segura</span>
          </div>
        </div>

        {/* Sub-Navegação Central do Bloco 05 */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b border-stone-800 text-xs font-['Outfit'] font-black uppercase">
          <button
            onClick={() => setActiveTab('acumular')}
            className={`px-3 py-2 rounded-xl transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
              activeTab === 'acumular'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'bg-stone-900/80 text-stone-400 hover:text-white border border-stone-800'
            }`}
          >
            <Sparkles size={14} />
            <span>Como Acumular</span>
          </button>

          <button
            onClick={() => setActiveTab('extrato')}
            className={`px-3 py-2 rounded-xl transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
              activeTab === 'extrato'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'bg-stone-900/80 text-stone-400 hover:text-white border border-stone-800'
            }`}
          >
            <History size={14} />
            <span>Extrato ({transactions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('missoes')}
            className={`px-3 py-2 rounded-xl transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
              activeTab === 'missoes'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'bg-stone-900/80 text-stone-400 hover:text-white border border-stone-800'
            }`}
          >
            <Target size={14} />
            <span>Missões ({missions.filter(m => m.active).length})</span>
          </button>

          <button
            onClick={() => setActiveTab('conquistas')}
            className={`px-3 py-2 rounded-xl transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
              activeTab === 'conquistas'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'bg-stone-900/80 text-stone-400 hover:text-white border border-stone-800'
            }`}
          >
            <Award size={14} />
            <span>Badges ({badges.filter(b => b.unlocked).length}/{badges.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('streak')}
            className={`px-3 py-2 rounded-xl transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
              activeTab === 'streak'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'bg-stone-900/80 text-stone-400 hover:text-white border border-stone-800'
            }`}
          >
            <Flame size={14} />
            <span>Constância 🔥</span>
          </button>
        </div>

        {/* ===================================================================== */}
        {/* ABA 1: COMO ACUMULAR MERMI POINTS (REGRAS DINÂMICAS DO MERMI CONTROL) */}
        {/* ===================================================================== */}
        {activeTab === 'acumular' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-widest text-stone-400 font-['Outfit']">
                REGRAS OFICIAIS DE PONTUAÇÃO
              </h3>
              <span className="text-[10px] text-amber-400 font-bold">
                Configurado via MERMI CONTROL
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {earningRules
                .filter((r) => r.active)
                .map((rule) => (
                  <div
                    key={rule.id}
                    className="p-4 rounded-2xl bg-stone-900/90 border border-stone-800 flex flex-col justify-between hover:border-amber-500/40 transition-all shadow-sm"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-sm font-black font-['Outfit']">
                        +{rule.pointsAmount}
                      </div>
                      <h4 className="text-sm font-black text-white font-['Outfit'] mt-2">
                        {rule.name}
                      </h4>
                      <p className="text-xs text-stone-400 mt-1 line-clamp-2">
                        {rule.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-stone-800/80 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-stone-500 uppercase">
                        {rule.calculationType === 'por_marmita'
                          ? 'Por marmita'
                          : rule.calculationType === 'por_real'
                          ? 'Por R$ 1,00'
                          : 'Ação única/fixa'}
                      </span>
                      {rule.actionKey === 'compra_marmita' && (
                        <button
                          onClick={() => onNavigate('cardapio')}
                          className="text-xs font-black text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                        >
                          <span>Pedir</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                      {rule.actionKey === 'indicacao' && (
                        <button
                          onClick={() => awardPointsByAction('indicacao', { customDescription: 'Indicação do amigo @novo.fit' })}
                          className="text-xs font-black text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                        >
                          <span>Simular</span>
                          <Share2 className="w-3 h-3" />
                        </button>
                      )}
                      {rule.actionKey === 'desafio_concluido' && (
                        <button
                          onClick={() => awardPointsByAction('desafio_concluido', { customDescription: 'Superação no Desafio Semanal 10km' })}
                          className="text-xs font-black text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                        >
                          <span>Concluir</span>
                          <Flame className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* ABA 2: EXTRATO COMPLETO DE TRANSAÇÕES (REQUISITO 1 & 2) */}
        {/* ===================================================================== */}
        {activeTab === 'extrato' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-stone-400 font-['Outfit']">
                  HISTÓRICO REAL DE TRANSAÇÕES
                </h3>
                <p className="text-[11px] text-stone-400">
                  Todas as operações registradas no livro-razão oficial dos seus MerMi Points
                </p>
              </div>

              {/* Filtro de tipos */}
              <div className="flex items-center gap-1 bg-stone-900 border border-stone-800 p-1 rounded-xl text-[10px] font-bold font-['Outfit'] uppercase self-start sm:self-auto">
                <button
                  onClick={() => setExtratoFilter('todos')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    extratoFilter === 'todos' ? 'bg-amber-500 text-stone-950 font-black' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  Todas ({transactions.length})
                </button>
                <button
                  onClick={() => setExtratoFilter('ganho')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    extratoFilter === 'ganho' ? 'bg-emerald-500 text-stone-950 font-black' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  Ganhos (+)
                </button>
                <button
                  onClick={() => setExtratoFilter('utilizado')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    extratoFilter === 'utilizado' ? 'bg-rose-500 text-stone-950 font-black' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  Utilizados (-)
                </button>
                <button
                  onClick={() => setExtratoFilter('ajuste_admin')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    extratoFilter === 'ajuste_admin' ? 'bg-blue-500 text-stone-950 font-black' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  Ajustes
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {filteredTransactions.length === 0 ? (
                <div className="p-8 rounded-2xl bg-stone-900/60 border border-stone-800 text-center text-stone-400 text-xs">
                  Nenhuma transação encontrada com o filtro selecionado.
                </div>
              ) : (
                filteredTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3.5 rounded-2xl bg-stone-900/90 border border-stone-800 flex items-center justify-between gap-3 hover:border-stone-700 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black ${
                          tx.type === 'ganho'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : tx.type === 'utilizado'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : tx.type === 'expirado'
                            ? 'bg-stone-800 text-stone-400'
                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        }`}
                      >
                        {tx.type === 'ganho' ? '+' : tx.type === 'utilizado' ? '−' : '⚙'}
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-white font-['Outfit']">
                          {tx.description}
                        </h4>
                        <div className="flex flex-wrap items-center gap-2 text-[10px] text-stone-400 mt-0.5">
                          <span className="flex items-center gap-1">
                            <Clock size={10} />
                            {tx.date}
                          </span>
                          {tx.referenceId && (
                            <span className="px-1.5 py-0.2 rounded bg-stone-800 font-mono text-[9px] text-stone-300">
                              Ref: {tx.referenceId}
                            </span>
                          )}
                          {tx.adminResponsible && (
                            <span className="text-blue-300 font-medium">
                              Resp: {tx.adminResponsible}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`text-sm sm:text-base font-black font-['Outfit'] ${
                          tx.amount >= 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {tx.amount >= 0 ? `+${tx.amount}` : tx.amount} pts
                      </span>
                      <span className="block text-[9px] text-stone-500 uppercase font-mono">
                        {tx.id.substring(0, 10)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* ABA 3: MISSÕES E DESAFIOS (REQUISITO 7) */}
        {/* ===================================================================== */}
        {activeTab === 'missoes' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-stone-400 font-['Outfit']">
                  MISSÕES & METAS ATIVAS
                </h3>
                <p className="text-[11px] text-stone-400">
                  Cumpra objetivos diários e semanais para liberar MerMi Points imediatos
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {missions
                .filter((m) => m.active)
                .map((mission) => {
                  const percent = Math.min(100, Math.round((mission.progress / mission.goal) * 100));
                  const isReadyToClaim = percent >= 100 && mission.status !== 'resgatada';
                  const isClaimed = mission.status === 'resgatada';

                  return (
                    <div
                      key={mission.id}
                      className={`p-4 rounded-3xl border transition-all ${
                        isClaimed
                          ? 'bg-stone-950/60 border-stone-800/60 opacity-80'
                          : isReadyToClaim
                          ? 'bg-stone-900 border-emerald-500/60 shadow-lg'
                          : 'bg-stone-900/90 border-stone-800'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase font-['Outfit'] ${
                                mission.type === 'diaria'
                                  ? 'bg-blue-500/20 text-blue-300'
                                  : mission.type === 'semanal'
                                  ? 'bg-purple-500/20 text-purple-300'
                                  : 'bg-amber-500/20 text-amber-300'
                              }`}
                            >
                              {mission.type}
                            </span>
                            {mission.extraRewardLabel && (
                              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[9px] font-black uppercase font-['Outfit']">
                                {mission.extraRewardLabel}
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm font-black text-white font-['Outfit']">
                            {mission.title}
                          </h4>
                          <p className="text-xs text-stone-400">{mission.description}</p>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-base font-black text-amber-400 font-['Outfit'] block">
                            +{mission.pointsReward} pts
                          </span>
                        </div>
                      </div>

                      {/* Barra de Progresso da Missão */}
                      <div className="mt-3 space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-bold text-stone-400">
                          <span>
                            Progresso: <strong className="text-stone-200">{mission.progress.toLocaleString('pt-BR')}</strong> / {mission.goal.toLocaleString('pt-BR')} {mission.unit}
                          </span>
                          <span className={percent >= 100 ? 'text-emerald-400 font-black' : 'text-amber-400'}>
                            {percent}%
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-stone-800 rounded-full overflow-hidden p-0.5 border border-stone-700/60">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              percent >= 100
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                                : 'bg-gradient-to-r from-amber-500 to-orange-500'
                            }`}
                            style={{ width: `${Math.max(4, percent)}%` }}
                          />
                        </div>
                      </div>

                      {/* Ação da Missão */}
                      <div className="mt-3 pt-2.5 border-t border-stone-800/80 flex items-center justify-between">
                        <span className="text-[10px] text-stone-500 font-medium">
                          {mission.rules}
                        </span>

                        {isClaimed ? (
                          <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-400 font-['Outfit']">
                            <CheckCircle2 size={14} />
                            Recompensa Resgatada
                          </span>
                        ) : (
                          <button
                            onClick={() => completeMission(mission.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-black font-['Outfit'] uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                              isReadyToClaim
                                ? 'bg-emerald-500 hover:bg-emerald-400 text-stone-950 shadow-md'
                                : 'bg-amber-500 hover:bg-amber-400 text-stone-950'
                            }`}
                          >
                            <span>{isReadyToClaim ? 'Resgatar Recompensa' : 'Completar Missão'}</span>
                            <ArrowRight size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* ABA 4: BADGES E CONQUISTAS (REQUISITO 6) */}
        {/* ===================================================================== */}
        {activeTab === 'conquistas' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-stone-400 font-['Outfit']">
                  CONQUISTAS & BADGES
                </h3>
                <p className="text-[11px] text-stone-400">
                  Desbloqueie troféus na sua jornada de evolução saudável
                </p>
              </div>
              <span className="text-xs font-black text-amber-400 font-['Outfit']">
                {badges.filter((b) => b.unlocked).length} de {badges.length} desbloqueados
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-3.5 rounded-2xl border transition-all text-center flex flex-col justify-between ${
                    badge.unlocked
                      ? 'bg-stone-900/90 border-amber-500/40 shadow-md'
                      : 'bg-stone-950/40 border-stone-800/60 opacity-60'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-2 ${
                        badge.unlocked
                          ? 'bg-amber-500/20 border border-amber-400/30'
                          : 'bg-stone-800/80 text-stone-500 border border-stone-800'
                      }`}
                    >
                      {badge.unlocked ? badge.icon : <Lock size={20} className="text-stone-500" />}
                    </div>

                    <h4 className="text-xs sm:text-sm font-black text-white font-['Outfit']">
                      {badge.name}
                    </h4>
                    <p className="text-[10px] text-stone-400 mt-1 line-clamp-2">
                      {badge.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-stone-800/80 text-[10px]">
                    {badge.unlocked ? (
                      <span className="text-emerald-400 font-black font-['Outfit'] flex items-center justify-center gap-1">
                        <CheckCircle2 size={12} />
                        {badge.unlockedAt || 'Desbloqueado'}
                      </span>
                    ) : (
                      <span className="text-stone-500 font-bold">
                        {badge.condition}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* ABA 5: STREAK / CONSTÂNCIA (REQUISITO 8) */}
        {/* ===================================================================== */}
        {activeTab === 'streak' && (
          <div className="space-y-4">
            <div className="rounded-3xl bg-gradient-to-r from-orange-950/40 via-stone-900 to-amber-950/30 p-5 border border-orange-500/40 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-2xl">
                    🔥
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-orange-400 font-['Outfit']">
                      CONSTÂNCIA DIÁRIA
                    </span>
                    <h3 className="text-xl font-black text-white font-['Outfit']">
                      {streak.currentStreakDays} Dias Consecutivos
                    </h3>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-stone-400 uppercase block">Recorde</span>
                  <span className="text-sm font-black text-amber-300 font-['Outfit']">
                    {streak.bestStreakDays} dias seguidos
                  </span>
                </div>
              </div>

              <p className="text-xs text-stone-300">
                Mantenha seus hábitos de nutrição limpa e passos diários ativos para não quebrar a sequência de fogo!
              </p>
            </div>

            <h4 className="text-xs font-black uppercase tracking-widest text-stone-400 font-['Outfit'] pt-2">
              MARCOS DE RECOMPENSA DE CONSTÂNCIA
            </h4>

            <div className="space-y-2.5">
              {streak.milestones.map((m) => {
                const reached = streak.currentStreakDays >= m.days;
                return (
                  <div
                    key={m.days}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                      m.achieved
                        ? 'bg-stone-900/60 border-stone-800'
                        : reached
                        ? 'bg-stone-900 border-amber-500/50 shadow-md'
                        : 'bg-stone-950/40 border-stone-800/60 opacity-70'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center text-base font-black">
                        🔥
                      </div>
                      <div>
                        <h5 className="text-xs sm:text-sm font-black text-white font-['Outfit']">
                          {m.label} ({m.days} dias)
                        </h5>
                        <p className="text-[11px] text-stone-400">
                          {reached ? 'Meta atingida!' : `Faltam ${m.days - streak.currentStreakDays} dias para liberar`}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      {m.achieved ? (
                        <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-400 font-['Outfit']">
                          <CheckCircle2 size={13} />
                          +{m.points} pts Resgatado
                        </span>
                      ) : reached ? (
                        <button
                          onClick={() => claimStreakMilestone(m.days)}
                          className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs font-['Outfit'] uppercase transition-all cursor-pointer shadow"
                        >
                          Resgatar +{m.points} pts
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-stone-500 font-['Outfit']">
                          +{m.points} pts
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Big Navigation CTAs to Resgate da Semana & Membro da Semana */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          
          {/* CTA Resgate da Semana */}
          <div
            onClick={() => onNavigate('resgate')}
            className="p-5 rounded-3xl bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 shadow-xl cursor-pointer hover:scale-101 transition-all border-2 border-amber-300 flex flex-col justify-between"
          >
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-950 text-amber-300">
                FOTO 09 OFICIAL
              </span>
              <h4 className="text-xl font-black font-['Outfit'] uppercase mt-2">
                Resgate da Semana
              </h4>
              <p className="text-xs font-bold text-stone-900 mt-1">
                Troque seus pontos por marmitas grátis, bolsas térmicas, copos e descontos exclusivos.
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between font-black text-xs uppercase tracking-wider">
              <span>Acessar Resgate</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* CTA Membro da Semana */}
          <div
            onClick={() => onNavigate('membro')}
            className="p-5 rounded-3xl bg-gradient-to-r from-[#E52525] to-rose-800 text-white shadow-xl cursor-pointer hover:scale-101 transition-all border border-rose-500 flex flex-col justify-between"
          >
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white text-rose-700">
                FOTO 10 OFICIAL
              </span>
              <h4 className="text-xl font-black font-['Outfit'] uppercase mt-2">
                Membro da Semana
              </h4>
              <p className="text-xs font-semibold text-rose-100 mt-1">
                Conheça o destaque da comunidade e inspire-se com quem vive o estilo de vida Mermi Fit.
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between font-black text-xs uppercase tracking-wider">
              <span>Ver Destaque</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
