import React from 'react';
import { useMermiStore } from '../../context/MermiStoreContext';
import {
  calculateWaterStats,
  calculateStepsStats,
  calculateSleepStats
} from '../../services/evolutionService';

interface EvolutionCompactBlockProps {
  onNavigate: (destination: string) => void;
}

export const EvolutionCompactBlock: React.FC<EvolutionCompactBlockProps> = ({ onNavigate }) => {
  const {
    user,
    waterLogs,
    stepsLogs,
    sleepLogs,
    activityLogs,
    waterSettings,
    stepsSettings,
    sleepSettings,
    trackEvent
  } = useMermiStore();

  const handleOpen = () => {
    trackEvent('quick_action_click', 'evolution_compact', 'Ver Minha Evolução');
    onNavigate('evolucao');
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const waterStats = calculateWaterStats(waterLogs, waterSettings.dailyGoalMl, todayStr);
  const stepsStats = calculateStepsStats(stepsLogs, stepsSettings.dailyGoal, todayStr);
  const sleepStats = calculateSleepStats(sleepLogs, sleepSettings.targetHours, todayStr);
  const todayActivities = activityLogs.filter(a => a.date === todayStr);

  const metrics = [
    {
      label: 'Passos Hoje',
      value: stepsStats.stepsToday > 0 ? stepsStats.stepsToday.toLocaleString('pt-BR') : '0',
      unit: `/ ${stepsStats.goal.toLocaleString('pt-BR')}`,
      icon: '👟',
      progress: stepsStats.percentage,
      color: 'bg-emerald-500'
    },
    {
      label: 'Água Ingerida',
      value: waterStats.currentMl > 0 ? `${(waterStats.currentMl / 1000).toFixed(1)}L` : '0,0 L',
      unit: `/ ${(waterStats.goalMl / 1000).toFixed(1)}L`,
      icon: '💧',
      progress: waterStats.percentage,
      color: 'bg-blue-500'
    },
    {
      label: 'Sono Reparador',
      value: sleepStats.durationMinutes > 0 ? sleepStats.formattedDuration : '--',
      unit: `meta: ${sleepSettings.targetHours}h`,
      icon: '🌙',
      progress: sleepStats.durationMinutes > 0 ? Math.min(100, Math.round((sleepStats.durationMinutes / (sleepSettings.targetHours * 60)) * 100)) : 0,
      color: 'bg-indigo-500'
    },
    {
      label: 'Treino & Foco',
      value: todayActivities.length > 0 ? `${todayActivities.length} treino(s)` : '0 treinos',
      unit: todayActivities.length > 0 ? 'concluído hoje' : 'inicie hoje',
      icon: '⚡',
      progress: todayActivities.length > 0 ? 100 : 0,
      color: 'bg-amber-500'
    },
    {
      label: 'Sequência',
      value: `${user.activeStreakDays} dias`,
      unit: user.activeStreakDays > 0 ? 'em foco 🔥' : 'inicie hoje',
      icon: '🔥',
      progress: Math.min(100, user.activeStreakDays * 10),
      color: 'bg-rose-500'
    },
    {
      label: 'Saldo de Points',
      value: `${user.mermiPoints.toLocaleString('pt-BR')} pts`,
      unit: user.mermiPoints > 0 ? 'acumulados' : 'comece hoje',
      icon: '⭐',
      progress: user.mermiPoints > 0 ? Math.min(100, Math.round((user.mermiPoints / 500) * 100)) : 0,
      color: 'bg-amber-500'
    }
  ];

  return (
    <div className="w-full bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[10px] font-extrabold text-[#0EB24A] uppercase tracking-wider">
            Rotina & Constância
          </span>
          <h3 className="text-base sm:text-lg font-black text-stone-900 font-['Outfit']">
            Minha Evolução Diária
          </h3>
        </div>

        <button
          onClick={handleOpen}
          className="text-xs font-bold text-[#0EB24A] hover:text-emerald-700 flex items-center gap-1 transition-colors group"
        >
          <span>Ver detalhes</span>
          <span className="group-hover:translate-x-0.5 transition-transform">→</span>
        </button>
      </div>

      {/* Grid of metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {metrics.map((m, idx) => (
          <div
            key={idx}
            className="p-3 bg-stone-50/80 rounded-2xl border border-stone-100 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
              <span>{m.icon}</span>
              <span className="text-[10px] font-bold text-stone-400 font-mono">
                {m.progress}%
              </span>
            </div>
            <div>
              <p className="text-sm sm:text-base font-black text-stone-900 font-['Outfit']">
                {m.value}
              </p>
              <p className="text-[10px] text-stone-500 truncate">
                {m.label}
              </p>
            </div>
            {/* Mini progress bar */}
            <div className="w-full h-1 bg-stone-200 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full rounded-full ${m.color}`}
                style={{ width: `${m.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
        <p className="text-xs text-stone-500">
          💡 <span className="font-semibold text-stone-700">Dica:</span> Cada refeição limpa e meta de passos gera Points automáticos.
        </p>
        <button
          onClick={handleOpen}
          className="px-3.5 py-1.5 bg-[#0EB24A]/10 hover:bg-[#0EB24A]/20 text-[#0EB24A] text-xs font-bold rounded-lg transition-colors"
        >
          Abrir Gráficos
        </button>
      </div>
    </div>
  );
};
