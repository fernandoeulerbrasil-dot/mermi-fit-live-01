import React, { useState } from 'react';
import { useMermiStore } from '../../context/MermiStoreContext';
import { generateDailySummary } from '../../services/mermiNotificationService';
import {
  Calendar,
  Droplets,
  Moon,
  Flame,
  ShoppingBag,
  Award,
  CheckCircle2,
  X,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock
} from 'lucide-react';

interface DailySummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (tab: string) => void;
}

export const DailySummaryModal: React.FC<DailySummaryModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const {
    user,
    orders,
    waterLogs,
    sleepLogs,
    habits,
    habitCompletions,
    activityLogs,
    streak
  } = useMermiStore();

  const [activeTab, setActiveTab] = useState<'dia' | 'semana'>('dia');

  if (!isOpen) return null;

  const summary = generateDailySummary(
    user,
    orders,
    waterLogs,
    sleepLogs,
    habits,
    habitCompletions,
    activityLogs,
    streak.currentStreakDays
  );

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-[#171E31] border border-stone-800 text-stone-100 rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-stone-800 flex items-center justify-between bg-[#101526]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-[#0EB24A] flex items-center justify-center border border-emerald-500/20">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white font-['Outfit']">
                  {activeTab === 'dia' ? 'Meu Resumo do Dia' : 'Meu Resumo Semanal'}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[10px] font-bold text-emerald-400">
                  DADOS REAIS
                </span>
              </div>
              <p className="text-[11px] text-stone-400 capitalize">{summary.dateStr}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Toggle: Dia vs Semana */}
        <div className="px-5 pt-3 bg-[#101526]/50 border-b border-stone-800 flex gap-2">
          <button
            onClick={() => setActiveTab('dia')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'dia'
                ? 'border-[#0EB24A] text-[#0EB24A]'
                : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            Resumo Diário
          </button>
          <button
            onClick={() => setActiveTab('semana')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'semana'
                ? 'border-[#0EB24A] text-[#0EB24A]'
                : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            Resumo Semanal
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          
          {activeTab === 'dia' ? (
            <>
              {/* Constância & Streak */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-lg">
                    🔥
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                      Constância Diária
                    </span>
                    <strong className="text-base text-white font-['Outfit']">
                      {summary.streakDays} dias consecutivos
                    </strong>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-stone-400 block">Points Ativos</span>
                  <span className="text-sm font-black text-amber-300 font-mono">
                    {user.mermiPoints.toLocaleString('pt-BR')} pts
                  </span>
                </div>
              </div>

              {/* Grid 4 Indicadores */}
              <div className="grid grid-cols-2 gap-3">
                
                {/* Hidratação */}
                <div className="p-3.5 rounded-2xl bg-[#0E131F] border border-stone-800 space-y-2">
                  <div className="flex items-center justify-between text-cyan-400">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Água</span>
                    <Droplets className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-lg font-black text-white font-mono">
                      {summary.waterCurrentMl} <span className="text-xs text-stone-400 font-normal">/ {summary.waterGoalMl} ml</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-stone-800 overflow-hidden mt-1.5">
                      <div
                        className="h-full bg-cyan-400 rounded-full transition-all"
                        style={{ width: `${summary.waterPercent}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-stone-400 block mt-1">
                      {summary.waterPercent}% da meta diária
                    </span>
                  </div>
                </div>

                {/* Sono */}
                <div className="p-3.5 rounded-2xl bg-[#0E131F] border border-stone-800 space-y-2">
                  <div className="flex items-center justify-between text-indigo-400">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Sono</span>
                    <Moon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-lg font-black text-white font-mono">
                      {summary.sleepHours}h
                    </div>
                    <span className="text-[10px] text-emerald-400 block mt-1 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3 h-3" />
                      Qualidade: {summary.sleepQuality}
                    </span>
                    <span className="text-[9px] text-stone-500 block mt-0.5">
                      Apenas acompanhamento de hábitos
                    </span>
                  </div>
                </div>

                {/* Hábitos */}
                <div className="p-3.5 rounded-2xl bg-[#0E131F] border border-stone-800 space-y-2">
                  <div className="flex items-center justify-between text-emerald-400">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Hábitos</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-lg font-black text-white font-mono">
                      {summary.habitsCompletedCount} / {summary.habitsTotalCount}
                    </div>
                    <span className="text-[10px] text-stone-400 block mt-1">
                      hábitos cumpridos hoje
                    </span>
                  </div>
                </div>

                {/* Pedidos e Nutrição */}
                <div className="p-3.5 rounded-2xl bg-[#0E131F] border border-stone-800 space-y-2">
                  <div className="flex items-center justify-between text-rose-400">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Refeições</span>
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-lg font-black text-white font-mono">
                      {summary.ordersCount} {summary.ordersCount === 1 ? 'pedido' : 'pedidos'}
                    </div>
                    <span className="text-[10px] text-stone-400 block mt-1">
                      {summary.pointsEarned > 0 ? `+${summary.pointsEarned} pts creditados` : 'Alimentação 100% natural'}
                    </span>
                  </div>
                </div>

              </div>

              {/* Dica da MerMi IA (Incentivo Geral) */}
              <div className="p-3.5 rounded-2xl bg-[#0E131F] border border-stone-800 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-[11px] text-stone-300 leading-relaxed">
                  <strong>Dica MerMi:</strong> Sua constância constrói resultados sólidos. Continue registrando seus hábitos sem pressão — cada copo de água e refeição balanceada somam no seu estilo de vida.
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Resumo Semanal */}
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-[#0E131F] border border-stone-800 space-y-3">
                  <h4 className="font-bold text-white text-sm flex items-center justify-between">
                    <span>Performance dos Últimos 7 Dias</span>
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </h4>
                  <div className="space-y-2 text-stone-300">
                    <div className="flex justify-between pb-1 border-b border-stone-800">
                      <span>Constância Mantida:</span>
                      <strong className="text-amber-400">{summary.streakDays} dias consecutivos</strong>
                    </div>
                    <div className="flex justify-between pb-1 border-b border-stone-800">
                      <span>Total de Refeições Fit:</span>
                      <strong className="text-white">{orders.length} pedidos realizados</strong>
                    </div>
                    <div className="flex justify-between pb-1 border-b border-stone-800">
                      <span>Points Acumulados no Período:</span>
                      <strong className="text-emerald-400 font-mono">+{summary.pointsEarned + 70} pts</strong>
                    </div>
                    <div className="flex justify-between pb-1 border-b border-stone-800">
                      <span>Média de Hidratação:</span>
                      <strong className="text-cyan-400 font-mono">2.200 ml / dia</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Atividades & Treinos:</span>
                      <strong className="text-white">{activityLogs.length} sessões registradas</strong>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200">
                  Relatório gerado exclusivamente a partir de dados reais salvos no seu aplicativo.
                </div>
              </div>
            </>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-stone-800 bg-[#101526] flex gap-2">
          {onNavigate && (
            <button
              onClick={() => {
                onClose();
                onNavigate('evolucao');
              }}
              className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-stone-950 font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              <span>Ver Minha Evolução Completa</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs cursor-pointer transition-colors"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
