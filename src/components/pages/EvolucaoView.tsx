import React, { useState } from 'react';
import { useMermiStore } from '../../context/MermiStoreContext';
import {
  Activity,
  Award,
  CheckCircle2,
  Droplets,
  Flame,
  Footprints,
  HeartPulse,
  Moon,
  Plus,
  Sparkles,
  TrendingUp,
  Watch,
  Calendar,
  Clock,
  Dumbbell,
  Target,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Smartphone,
  ChevronRight,
  Info,
  Check,
  Trash2,
  Lock,
  ArrowUpRight,
  Scale,
  Ruler
} from 'lucide-react';
import {
  calculateWaterStats,
  calculateStepsStats,
  calculateSleepStats,
  formatDurationMinutes,
  formatMlToLiters,
  calculateBedtimeDurationMinutes,
  calculateConsistencyScore,
  calculateBodyProgress
} from '../../services/evolutionService';
import { ActivityCategory, DataOrigin, DevicePlatformKey, GoalType } from '../../types/evolution';

interface EvolucaoViewProps {
  onNavigate?: (tab: string) => void;
  initialTab?: 'meu_dia' | 'agua' | 'passos' | 'sono' | 'atividades' | 'habitos' | 'metas' | 'dispositivos' | 'corpo';
}

export const EvolucaoView: React.FC<EvolucaoViewProps> = ({
  onNavigate,
  initialTab = 'meu_dia'
}) => {
  const {
    user,
    waterLogs,
    waterSettings,
    addWaterLog,
    removeWaterLog,
    updateWaterSettings,
    triggerWaterReminderTest,
    stepsLogs,
    stepsSettings,
    addStepsLog,
    updateStepsSettings,
    sleepLogs,
    sleepSettings,
    addSleepLog,
    updateSleepSettings,
    activityLogs,
    addActivityLog,
    deleteActivityLog,
    habits,
    habitCompletions,
    toggleHabitCompletion,
    createHabit,
    deleteHabit,
    evolutionGoals,
    createEvolutionGoal,
    completeEvolutionGoal,
    deleteEvolutionGoal,
    connectedDevices,
    toggleDeviceConnection,
    updateDevicePermissions,
    syncDevice,
    bodyEvolutionLogs,
    addBodyEvolutionLog,
    deleteBodyEvolutionLog,
    showToast
  } = useMermiStore();

  const [activeTab, setActiveTab] = useState<
    'meu_dia' | 'agua' | 'passos' | 'sono' | 'atividades' | 'habitos' | 'metas' | 'dispositivos' | 'corpo'
  >(initialTab);

  // Modals state
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [isAddSleepOpen, setIsAddSleepOpen] = useState(false);
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [isAddHabitOpen, setIsAddHabitOpen] = useState(false);
  const [isAddBodyLogOpen, setIsAddBodyLogOpen] = useState(false);
  const [isSyncingDeviceKey, setIsSyncingDeviceKey] = useState<string | null>(null);

  // Form states
  const [customWaterAmount, setCustomWaterAmount] = useState('');
  const [manualStepsAmount, setManualStepsAmount] = useState('1000');

  // New Activity form
  const [newActTitle, setNewActTitle] = useState('');
  const [newActCategory, setNewActCategory] = useState<ActivityCategory>('treino');
  const [newActDuration, setNewActDuration] = useState('45');
  const [newActDistance, setNewActDistance] = useState('');
  const [newActCalories, setNewActCalories] = useState('');
  const [newActIntensity, setNewActIntensity] = useState<'leve' | 'moderada' | 'alta'>('moderada');
  const [newActNotes, setNewActNotes] = useState('');

  // New Sleep form
  const [newSleepBedTime, setNewSleepBedTime] = useState('23:00');
  const [newSleepWakeTime, setNewSleepWakeTime] = useState('07:00');
  const [newSleepNotes, setNewSleepNotes] = useState('');

  // New Goal form
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalType, setNewGoalType] = useState<GoalType>('passos');
  const [newGoalTarget, setNewGoalTarget] = useState('10000');
  const [newGoalUnit, setNewGoalUnit] = useState('passos');
  const [newGoalPeriod, setNewGoalPeriod] = useState<'diario' | 'semanal' | 'mensal'>('diario');
  const [newGoalReward, setNewGoalReward] = useState('25');

  // New Habit form
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [newHabitCategory, setNewHabitCategory] = useState<'agua' | 'passos' | 'sono' | 'treino' | 'alimentacao' | 'outro'>('treino');
  const [newHabitReward, setNewHabitReward] = useState('15');

  // New Body Log form
  const [newBodyWeight, setNewBodyWeight] = useState('75.0');
  const [newBodyWaist, setNewBodyWaist] = useState('');
  const [newBodyChest, setNewBodyChest] = useState('');
  const [newBodyHips, setNewBodyHips] = useState('');
  const [newBodyNotes, setNewBodyNotes] = useState('');

  // Filter for activities
  const [activityCategoryFilter, setActivityCategoryFilter] = useState<string>('todos');

  // Stats calculations
  const todayStr = new Date().toISOString().split('T')[0];
  const waterStats = calculateWaterStats(waterLogs, waterSettings.dailyGoalMl, todayStr);
  const stepsStats = calculateStepsStats(stepsLogs, stepsSettings.dailyGoal, todayStr);
  const sleepStats = calculateSleepStats(sleepLogs, sleepSettings.targetHours, todayStr);
  const consistency = calculateConsistencyScore(habits, habitCompletions, 7);
  const bodyProgress = calculateBodyProgress(bodyEvolutionLogs);

  // Today's habit completions count
  const todayCompletions = habitCompletions.filter(c => c.date === todayStr && c.completed);

  // Handlers
  const handleQuickAddWater = (amountMl: number) => {
    addWaterLog(amountMl, 'manual');
  };

  const handleCustomAddWater = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(customWaterAmount);
    if (!amount || amount <= 0) {
      showToast('Digite uma quantidade válida em ml.');
      return;
    }
    addWaterLog(amount, 'manual');
    setCustomWaterAmount('');
  };

  const handleAddManualSteps = (e: React.FormEvent) => {
    e.preventDefault();
    const count = Number(manualStepsAmount);
    if (!count || count <= 0) {
      showToast('Digite uma quantidade válida de passos.');
      return;
    }
    addStepsLog(count, todayStr, 'manual');
    setManualStepsAmount('1000');
  };

  const handleSaveActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActTitle.trim()) {
      showToast('Informe o nome da atividade ou treino.');
      return;
    }
    const duration = Number(newActDuration) || 30;
    const distance = newActDistance ? Number(newActDistance) : undefined;
    const calories = newActCalories ? Number(newActCalories) : Math.round(duration * 6.5);

    addActivityLog({
      title: newActTitle.trim(),
      category: newActCategory,
      durationMinutes: duration,
      distanceKm: distance,
      caloriesBurned: calories,
      date: todayStr,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      origin: 'manual',
      intensity: newActIntensity,
      notes: newActNotes.trim() || undefined
    });

    setIsAddActivityOpen(false);
    setNewActTitle('');
    setNewActNotes('');
  };

  const handleSaveSleep = (e: React.FormEvent) => {
    e.preventDefault();
    const durationMinutes = calculateBedtimeDurationMinutes(newSleepBedTime, newSleepWakeTime);
    if (durationMinutes <= 0) {
      showToast('Verifique os horários informados de dormir e acordar.');
      return;
    }

    addSleepLog({
      date: todayStr,
      bedTime: newSleepBedTime,
      wakeTime: newSleepWakeTime,
      durationMinutes,
      qualityMetric: 'Duração registrada',
      origin: 'manual',
      notes: newSleepNotes.trim() || undefined
    });

    setIsAddSleepOpen(false);
    setNewSleepNotes('');
  };

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) {
      showToast('Digite um título para a meta.');
      return;
    }
    createEvolutionGoal({
      title: newGoalTitle.trim(),
      description: `Meta pessoal de ${newGoalType} (${newGoalPeriod})`,
      type: newGoalType,
      targetValue: Number(newGoalTarget) || 10,
      currentValue: 0,
      unit: newGoalUnit.trim() || 'un',
      period: newGoalPeriod,
      status: 'ativa',
      pointsReward: Number(newGoalReward) || 20,
      startDate: todayStr
    });
    setIsAddGoalOpen(false);
    setNewGoalTitle('');
  };

  const handleSaveHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitTitle.trim()) {
      showToast('Digite o título do hábito.');
      return;
    }
    createHabit({
      title: newHabitTitle.trim(),
      category: newHabitCategory,
      icon: newHabitCategory === 'agua' ? 'Droplets' : newHabitCategory === 'passos' ? 'Footprints' : 'Dumbbell',
      active: true,
      targetDaysPerWeek: 7,
      pointsReward: Number(newHabitReward) || 15
    });
    setIsAddHabitOpen(false);
    setNewHabitTitle('');
  };

  const handleSaveBodyLog = (e: React.FormEvent) => {
    e.preventDefault();
    const weight = Number(newBodyWeight);
    if (!weight || weight <= 0) {
      showToast('Informe um peso válido em kg.');
      return;
    }
    addBodyEvolutionLog({
      date: todayStr,
      weightKg: weight,
      waistCm: newBodyWaist ? Number(newBodyWaist) : undefined,
      chestCm: newBodyChest ? Number(newBodyChest) : undefined,
      hipsCm: newBodyHips ? Number(newBodyHips) : undefined,
      notes: newBodyNotes.trim() || undefined
    });
    setIsAddBodyLogOpen(false);
    setNewBodyNotes('');
  };

  const handleSyncDevice = (key: DevicePlatformKey) => {
    setIsSyncingDeviceKey(key);
    setTimeout(() => {
      syncDevice(key);
      setIsSyncingDeviceKey(null);
    }, 900);
  };

  // Filtered activities
  const filteredActivities = activityLogs.filter(act => {
    if (activityCategoryFilter === 'todos') return true;
    return act.category === activityCategoryFilter;
  });

  return (
    <div className="min-h-screen bg-[#FBF7EE] text-stone-900 pb-32 pt-4 px-3 sm:px-4">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header Hero */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-1">
                <span>🍃</span> MERMI FIT TRACKER & EVOLUÇÃO
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-stone-900 font-['Outfit'] mt-1">
                Sua Disciplina Diária
              </h1>
              <p className="text-xs text-stone-600 mt-0.5">
                Pequenas escolhas conscientes constroem resultados extraordinários e consistência duradoura.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-black shadow-xs">
                <Flame className="w-4 h-4 fill-rose-500 text-rose-500 animate-pulse" />
                {user.activeStreakDays} Dias Seguidos
              </span>
            </div>
          </div>

          {/* Sub Navigation Bar */}
          <div className="mt-5 pt-4 border-t border-stone-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {[
              { id: 'meu_dia', label: 'Meu Dia', icon: Sparkles },
              { id: 'agua', label: 'Água', icon: Droplets },
              { id: 'passos', label: 'Passos', icon: Footprints },
              { id: 'sono', label: 'Sono', icon: Moon },
              { id: 'atividades', label: 'Atividades', icon: Dumbbell },
              { id: 'habitos', label: 'Hábitos', icon: CheckCircle2 },
              { id: 'metas', label: 'Metas', icon: Target },
              { id: 'dispositivos', label: 'Dispositivos', icon: Watch },
              { id: 'corpo', label: 'Medidas', icon: Ruler }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-stone-900 text-white shadow-sm'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ============================================================== */}
        {/* TAB 1: MEU DIA (Visão Resumida & Consolidada)                   */}
        {/* ============================================================== */}
        {activeTab === 'meu_dia' && (
          <div className="space-y-5">
            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Passos */}
              <div
                onClick={() => setActiveTab('passos')}
                className="bg-white p-4 rounded-3xl border border-stone-200 shadow-sm cursor-pointer hover:border-emerald-500 transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Footprints className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-black text-emerald-600">{stepsStats.percentage}%</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">Passos Hoje</span>
                  <h3 className="text-lg font-black text-stone-900 font-['Outfit']">
                    {stepsStats.stepsToday > 0 ? stepsStats.stepsToday.toLocaleString('pt-BR') : 'Sem registro'}
                  </h3>
                  <span className="text-[10px] text-stone-400">
                    {stepsStats.stepsToday > 0 ? `meta: ${stepsStats.goal.toLocaleString('pt-BR')}` : 'Comece hoje'}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${stepsStats.percentage}%` }} />
                </div>
              </div>

              {/* Água */}
              <div
                onClick={() => setActiveTab('agua')}
                className="bg-white p-4 rounded-3xl border border-stone-200 shadow-sm cursor-pointer hover:border-blue-500 transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-black text-blue-600">{waterStats.percentage}%</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">Água Hoje</span>
                  <h3 className="text-lg font-black text-stone-900 font-['Outfit']">
                    {waterStats.currentMl > 0 ? formatMlToLiters(waterStats.currentMl) : 'Sem registro'}
                  </h3>
                  <span className="text-[10px] text-stone-400">
                    {waterStats.currentMl > 0 ? `meta: ${formatMlToLiters(waterStats.goalMl)}` : 'Comece hoje'}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${waterStats.percentage}%` }} />
                </div>
              </div>

              {/* Sono */}
              <div
                onClick={() => setActiveTab('sono')}
                className="bg-white p-4 rounded-3xl border border-stone-200 shadow-sm cursor-pointer hover:border-indigo-500 transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                    <Moon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-black text-indigo-600">{sleepStats.qualityMetric}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">Sono</span>
                  <h3 className="text-lg font-black text-stone-900 font-['Outfit']">
                    {sleepStats.durationMinutes > 0 ? sleepStats.formattedDuration : 'Sem registro'}
                  </h3>
                  <span className="text-[10px] text-stone-400">
                    {sleepStats.durationMinutes > 0 ? `alvo: ${sleepSettings.targetHours}h` : 'Comece hoje'}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: `${Math.min(100, Math.round((sleepStats.durationMinutes / (sleepSettings.targetHours * 60)) * 100))}%` }}
                  />
                </div>
              </div>

              {/* Atividade */}
              <div
                onClick={() => setActiveTab('atividades')}
                className="bg-white p-4 rounded-3xl border border-stone-200 shadow-sm cursor-pointer hover:border-amber-500 transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Dumbbell className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-black text-amber-600">
                    {activityLogs.filter(a => a.date === todayStr).length} hoje
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">Atividade</span>
                  <h3 className="text-lg font-black text-stone-900 font-['Outfit']">
                    {activityLogs.filter(a => a.date === todayStr).reduce((acc, a) => acc + a.durationMinutes, 0)} min
                  </h3>
                  <span className="text-[10px] text-stone-400">movimento ativo</span>
                </div>
                <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{
                      width: `${Math.min(100, Math.round((activityLogs.filter(a => a.date === todayStr).reduce((acc, a) => acc + a.durationMinutes, 0) / 45) * 100))}%`
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Smartwatch / Wearable Banner */}
            <div className="rounded-3xl bg-stone-950 text-white p-6 shadow-xl border border-stone-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <Footprints className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black tracking-widest text-emerald-400 uppercase">
                      MONITORAMENTO EM TEMPO REAL
                    </span>
                    <h3 className="text-2xl font-black text-white font-['Outfit']">
                      {stepsStats.stepsToday.toLocaleString('pt-BR')} <span className="text-xs text-stone-400 font-normal">passos hoje</span>
                    </h3>
                    <p className="text-xs text-stone-400 mt-0.5">
                      {stepsStats.distanceKm} km percorridos · ~{stepsStats.caloriesBurned} kcal ativas
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleQuickAddWater(250)}
                    className="px-3 py-2 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 border border-blue-500/40 text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" /> +250ml Água
                  </button>

                  <button
                    onClick={() => setIsAddActivityOpen(true)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md active:scale-95 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Registrar Treino
                  </button>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-800 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  {stepsStats.isGoalMet ? 'Meta diária alcançada!' : 'Ainda faltam passos para a meta configurada'}
                </span>
                <button
                  onClick={() => handleSyncDevice('apple_health')}
                  className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" /> Sincronizar Dispositivo
                </button>
              </div>
            </div>

            {/* Quick Habits Checklist for Today */}
            <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-black text-stone-900 font-['Outfit']">
                    Hábitos Diários de Hoje
                  </h4>
                  <p className="text-xs text-stone-500">
                    {todayCompletions.length} de {habits.filter(h => h.active).length} hábitos concluídos hoje
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('habitos')}
                  className="text-xs font-black text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                >
                  Ver Todos <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {habits.filter(h => h.active).map(habit => {
                  const isDone = habitCompletions.some(c => c.habitId === habit.id && c.date === todayStr && c.completed);
                  return (
                    <div
                      key={habit.id}
                      onClick={() => toggleHabitCompletion(habit.id, todayStr)}
                      className={`p-3 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                        isDone
                          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                          : 'bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                            isDone ? 'bg-emerald-600 text-white' : 'border border-stone-300 bg-white text-transparent'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <span className={`text-xs font-bold ${isDone ? 'line-through text-stone-500' : ''}`}>
                          {habit.title}
                        </span>
                      </div>
                      <span className="text-[10px] font-black text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-stone-200 shadow-2xs">
                        +{habit.pointsReward || 10} pts
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Motivational Philosophy Card */}
            <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md text-center space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-200">
                FILOSOFIA MERMI FIT LIFE
              </p>
              <h4 className="text-lg font-black font-['Outfit'] uppercase">
                DISCIPLINA É LIBERDADE
              </h4>
              <p className="text-xs text-emerald-100 max-w-md mx-auto">
                Cada refeição nutritiva e cada quilômetro percorrido constroem a melhor versão do seu futuro.
              </p>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: MINHA ÁGUA (Hidratação Consciente)                        */}
        {/* ============================================================== */}
        {activeTab === 'agua' && (
          <div className="space-y-6">
            {/* Water Hero Card */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
                    <Droplets className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">
                      MINHA ÁGUA · INGESTÃO HÍDRICA
                    </span>
                    <h2 className="text-2xl font-black text-stone-900 font-['Outfit']">
                      {formatMlToLiters(waterStats.currentMl)}
                    </h2>
                    <p className="text-xs text-stone-500">
                      Meta diária configurada: {formatMlToLiters(waterStats.goalMl)} ({waterStats.percentage}% atingido)
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-stone-500 block">Restante para a meta</span>
                  <span className="text-lg font-black text-blue-600 font-['Outfit']">
                    {waterStats.remainingMl > 0 ? `${formatMlToLiters(waterStats.remainingMl)}` : '✓ Concluída!'}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="w-full h-3.5 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200">
                  <div
                    className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${waterStats.percentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-stone-400 font-bold px-1">
                  <span>0 ml</span>
                  <span>{formatMlToLiters(Math.round(waterStats.goalMl / 2))}</span>
                  <span>{formatMlToLiters(waterStats.goalMl)}</span>
                </div>
              </div>

              {/* Quick Add Presets */}
              <div className="space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-stone-700 block">
                  Adição Rápida
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[200, 300, 500, 750, 1000].map(amount => (
                    <button
                      key={amount}
                      onClick={() => handleQuickAddWater(amount)}
                      className="py-2.5 px-3 rounded-2xl bg-blue-50/80 hover:bg-blue-100 text-blue-800 border border-blue-200 text-xs font-black transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95 shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      {amount >= 1000 ? '1 Litro' : `${amount} ml`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom ml input */}
              <form onSubmit={handleCustomAddWater} className="flex gap-2">
                <input
                  type="number"
                  step="50"
                  placeholder="Outra quantidade (ex: 350 ml)"
                  value={customWaterAmount}
                  onChange={(e) => setCustomWaterAmount(e.target.value)}
                  className="flex-1 bg-stone-50 border border-stone-300 rounded-2xl px-4 py-2 text-xs font-bold text-stone-900 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-wider shadow-sm transition-all cursor-pointer"
                >
                  Registrar
                </button>
              </form>
            </div>

            {/* Water Goal Configuration & Reminders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Meta Config */}
              <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-stone-800">
                  <Target className="w-4 h-4 text-blue-600" />
                  <h4 className="text-sm font-black font-['Outfit']">Meta Diária de Água</h4>
                </div>
                <p className="text-xs text-stone-500">
                  Ajuste a quantidade que melhor atende ao seu nível de esforço e orientações nutricionais.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {[2000, 2500, 3000].map(val => (
                    <button
                      key={val}
                      onClick={() => updateWaterSettings({ dailyGoalMl: val })}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        waterSettings.dailyGoalMl === val
                          ? 'bg-blue-600 text-white'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {formatMlToLiters(val)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lembretes de Água */}
              <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-stone-800">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <h4 className="text-sm font-black font-['Outfit']">Lembretes de Hidratação</h4>
                  </div>
                  <button
                    onClick={() => updateWaterSettings({ remindersEnabled: !waterSettings.remindersEnabled })}
                    className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${
                      waterSettings.remindersEnabled ? 'bg-blue-600' : 'bg-stone-300'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                        waterSettings.remindersEnabled ? 'right-1' : 'left-1'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-xs text-stone-500">
                  Notificações regulares entre {waterSettings.reminderStartTime} e {waterSettings.reminderEndTime} (frequência: {waterSettings.reminderFrequency}).
                </p>
                <button
                  onClick={triggerWaterReminderTest}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer pt-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Testar Notificação Agora
                </button>
              </div>
            </div>

            {/* Today's History */}
            <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-3">
              <h4 className="text-sm font-black font-['Outfit'] text-stone-900">
                Histórico de Ingestão de Hoje
              </h4>

              {waterStats.dayLogs.length === 0 ? (
                <p className="text-xs text-stone-500 py-3 text-center">
                  Nenhum copo registrado hoje ainda. Que tal começar agora?
                </p>
              ) : (
                <div className="divide-y divide-stone-100">
                  {waterStats.dayLogs.map(log => {
                    const timeStr = new Date(log.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                    return (
                      <div key={log.id} className="py-2.5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          <Droplets className="w-4 h-4 text-blue-500" />
                          <span className="font-bold text-stone-900">+{log.amountMl} ml</span>
                          <span className="text-[10px] text-stone-400">às {timeStr}</span>
                        </div>
                        <button
                          onClick={() => removeWaterLog(log.id)}
                          className="text-stone-400 hover:text-rose-500 transition-colors p-1 cursor-pointer"
                          title="Remover registro"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: MEUS PASSOS                                             */}
        {/* ============================================================== */}
        {activeTab === 'passos' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Footprints className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
                      MEUS PASSOS · CONSTÂNCIA DIÁRIA
                    </span>
                    <h2 className="text-2xl font-black text-stone-900 font-['Outfit']">
                      {stepsStats.stepsToday.toLocaleString('pt-BR')} <span className="text-xs text-stone-500 font-normal">passos</span>
                    </h2>
                    <p className="text-xs text-stone-500">
                      Meta: {stepsStats.goal.toLocaleString('pt-BR')} ({stepsStats.percentage}% concluído)
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-stone-500 block">Distância Estimada</span>
                  <span className="text-lg font-black text-emerald-600 font-['Outfit']">
                    {stepsStats.distanceKm} km
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3.5 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-500"
                  style={{ width: `${stepsStats.percentage}%` }}
                />
              </div>

              {/* Weekly Steps Columns Chart */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-black uppercase tracking-wider text-stone-700 block">
                  Histórico dos Últimos Dias
                </span>
                <div className="grid grid-cols-7 gap-2 pt-4 items-end h-36 border-b border-stone-100 pb-2">
                  {stepsLogs.slice(0, 7).reverse().map((slog, idx) => {
                    const heightPercent = Math.min(100, Math.round((slog.stepsCount / stepsStats.goal) * 100));
                    const isGoal = slog.stepsCount >= slog.goal;
                    const dayLabel = slog.date.split('-')[2];
                    return (
                      <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                        <span className="text-[9px] font-bold text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          {slog.stepsCount}
                        </span>
                        <div
                          className={`w-full max-w-[28px] rounded-t-lg transition-all ${
                            isGoal ? 'bg-emerald-500' : 'bg-stone-300'
                          }`}
                          style={{ height: `${heightPercent}%` }}
                        />
                        <span className="text-[10px] font-bold text-stone-500">dia {dayLabel}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Add manual steps */}
              <form onSubmit={handleAddManualSteps} className="flex items-center gap-2 pt-2">
                <input
                  type="number"
                  step="500"
                  value={manualStepsAmount}
                  onChange={(e) => setManualStepsAmount(e.target.value)}
                  className="flex-1 bg-stone-50 border border-stone-300 rounded-2xl px-4 py-2 text-xs font-bold text-stone-900 focus:outline-none focus:border-emerald-500"
                  placeholder="Passos adicionais"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider shadow-sm transition-all cursor-pointer"
                >
                  Adicionar Passos
                </button>
              </form>
            </div>

            {/* Goal Configurator Card */}
            <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-3">
              <h4 className="text-sm font-black font-['Outfit'] text-stone-900">
                Configurar Alvo de Passos
              </h4>
              <p className="text-xs text-stone-500">
                Selecione sua meta diária recomendada. O valor não precisa ser obrigatoriamente 10.000 passos; ajuste conforme sua rotina.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {[6000, 8500, 10000, 12000].map(val => (
                  <button
                    key={val}
                    onClick={() => updateStepsSettings({ dailyGoal: val })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      stepsSettings.dailyGoal === val
                        ? 'bg-emerald-600 text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {val.toLocaleString('pt-BR')} passos
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: MEU SONO                                                */}
        {/* ============================================================== */}
        {activeTab === 'sono' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-200">
                    <Moon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">
                      MEU SONO · DESCANSO & RECUPERAÇÃO
                    </span>
                    <h2 className="text-2xl font-black text-stone-900 font-['Outfit']">
                      {sleepStats.formattedDuration}
                    </h2>
                    <p className="text-xs text-stone-500">
                      Horário: {sleepStats.todayLog?.bedTime || '23:15'} às {sleepStats.todayLog?.wakeTime || '07:00'}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-stone-500 block">Indicador</span>
                  <span className="text-sm font-black text-indigo-600 uppercase tracking-wider">
                    {sleepStats.qualityMetric}
                  </span>
                </div>
              </div>

              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-stone-900">Média Semanal de Sono:</span>
                  <span className="text-stone-600 ml-1.5">{sleepStats.formattedAverage}</span>
                </div>
                <button
                  onClick={() => setIsAddSleepOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all cursor-pointer"
                >
                  + Registrar Noite Manual
                </button>
              </div>

              {/* Sleep History */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-stone-700">
                  Histórico dos Últimos Dias
                </h4>
                <div className="divide-y divide-stone-100">
                  {sleepLogs.map(s => (
                    <div key={s.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-stone-900">{formatDurationMinutes(s.durationMinutes)}</span>
                        <span className="text-stone-400 ml-2">({s.bedTime} - {s.wakeTime})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-stone-500">{s.date}</span>
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {s.origin}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: MINHAS ATIVIDADES & TREINOS                              */}
        {/* ============================================================== */}
        {activeTab === 'atividades' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-black font-['Outfit'] text-stone-900">
                  Minhas Atividades & Treinos
                </h3>
                <p className="text-xs text-stone-500">
                  Histórico de sessões físicas, treinos na academia, corridas e caminhadas ativas.
                </p>
              </div>

              <button
                onClick={() => setIsAddActivityOpen(true)}
                className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider shadow-sm transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-center active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" /> Registrar Atividade (+25 pts)
              </button>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap gap-1.5 pb-1 overflow-x-auto no-scrollbar">
              {['todos', 'treino', 'academia', 'corrida', 'caminhada', 'funcional', 'ciclismo'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setActivityCategoryFilter(cat)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
                    activityCategoryFilter === cat
                      ? 'bg-stone-900 text-white'
                      : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Activity List */}
            <div className="space-y-3">
              {filteredActivities.length === 0 ? (
                <div className="bg-white rounded-3xl p-8 text-center border border-stone-200 text-stone-500 space-y-2">
                  <Dumbbell className="w-8 h-8 mx-auto text-stone-300" />
                  <p className="text-xs font-bold">Nenhuma atividade encontrada nesta categoria.</p>
                </div>
              ) : (
                filteredActivities.map(act => (
                  <div
                    key={act.id}
                    className="bg-white rounded-3xl p-4 border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-emerald-300 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
                        <Dumbbell className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-black text-stone-900">{act.title}</h4>
                          {act.origin === 'mermi_run' && (
                            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                              🏃 MerMi Run
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-500 mt-0.5">
                          {act.durationMinutes} min {act.distanceKm ? `· ${act.distanceKm} km` : ''} · ~{act.caloriesBurned || 250} kcal
                        </p>
                        {act.notes && (
                          <p className="text-[11px] text-stone-600 italic mt-1 bg-stone-50 px-2 py-1 rounded-lg inline-block">
                            "{act.notes}"
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100 text-xs">
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-stone-400 block">{act.date} · {act.time}</span>
                        <span className="text-[10px] font-black uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                          {act.intensity || 'moderada'}
                        </span>
                      </div>
                      <button
                        onClick={() => deleteActivityLog(act.id)}
                        className="text-stone-300 hover:text-rose-500 p-1 cursor-pointer transition-colors"
                        title="Remover"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 6: HÁBITOS & CONSTÂNCIA                                    */}
        {/* ============================================================== */}
        {activeTab === 'habitos' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-black font-['Outfit'] text-stone-900">
                    Constância & Hábitos Saudáveis
                  </h3>
                  <p className="text-xs text-stone-500">
                    Sua taxa de consistência nesta semana é de {consistency.scorePercentage}%.
                  </p>
                </div>

                <button
                  onClick={() => setIsAddHabitOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 shadow-sm active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" /> Novo Hábito
                </button>
              </div>

              {/* Habits List */}
              <div className="space-y-2.5 pt-2">
                {habits.map(habit => {
                  const isDoneToday = habitCompletions.some(c => c.habitId === habit.id && c.date === todayStr && c.completed);
                  return (
                    <div
                      key={habit.id}
                      className={`p-4 rounded-3xl border transition-all flex items-center justify-between ${
                        isDoneToday
                          ? 'bg-emerald-50/50 border-emerald-200'
                          : 'bg-stone-50 border-stone-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleHabitCompletion(habit.id, todayStr)}
                          className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                            isDoneToday
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-white border border-stone-300 text-transparent hover:border-emerald-500'
                          }`}
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <div>
                          <h4 className={`text-sm font-black ${isDoneToday ? 'line-through text-stone-500' : 'text-stone-900'}`}>
                            {habit.title}
                          </h4>
                          <span className="text-[10px] text-stone-500">
                            Meta: {habit.targetDaysPerWeek} dias/semana · Recompensa: +{habit.pointsReward} pts
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-black">
                          <Flame className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                          {habit.streakDays} dias
                        </span>
                        <button
                          onClick={() => deleteHabit(habit.id)}
                          className="text-stone-300 hover:text-rose-500 p-1 cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 7: METAS PESSOAIS                                          */}
        {/* ============================================================== */}
        {activeTab === 'metas' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-black font-['Outfit'] text-stone-900">
                  Minhas Metas Pessoais
                </h3>
                <p className="text-xs text-stone-500">
                  Desafios autoimpostos com recompensas em MerMi Points ao concluir.
                </p>
              </div>

              <button
                onClick={() => setIsAddGoalOpen(true)}
                className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider shadow-sm transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-center active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" /> Criar Nova Meta
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {evolutionGoals.map(goal => {
                const percent = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));
                const isCompleted = goal.status === 'concluida';
                return (
                  <div
                    key={goal.id}
                    className={`bg-white rounded-3xl p-5 border shadow-sm space-y-4 transition-all ${
                      isCompleted ? 'border-emerald-300 bg-emerald-50/20' : 'border-stone-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 block">
                          {goal.type} · {goal.period}
                        </span>
                        <h4 className="text-base font-black text-stone-900 font-['Outfit'] mt-0.5">
                          {goal.title}
                        </h4>
                        <p className="text-xs text-stone-500 mt-0.5">{goal.description}</p>
                      </div>

                      <span className="text-xs font-black text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200 shrink-0">
                        +{goal.pointsReward} pts
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-stone-700">
                        <span>Progresso</span>
                        <span>{goal.currentValue} / {goal.targetValue} {goal.unit} ({percent}%)</span>
                      </div>
                      <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${isCompleted ? 'bg-emerald-500' : 'bg-blue-500'}`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                      {isCompleted ? (
                        <span className="text-emerald-600 font-black flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Concluída!
                        </span>
                      ) : (
                        <button
                          onClick={() => completeEvolutionGoal(goal.id)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all cursor-pointer"
                        >
                          Concluir Agora
                        </button>
                      )}

                      <button
                        onClick={() => deleteEvolutionGoal(goal.id)}
                        className="text-stone-300 hover:text-rose-500 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 8: DISPOSITIVOS & WEARABLES                                */}
        {/* ============================================================== */}
        {activeTab === 'dispositivos' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
              <div>
                <h3 className="text-lg font-black font-['Outfit'] text-stone-900">
                  Central de Dispositivos & Conexões
                </h3>
                <p className="text-xs text-stone-500">
                  Conecte seu smartwatch, smartphone ou plataforma esportiva para sincronizar passos, descanso e treinos.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {connectedDevices.map(device => {
                  const isSyncing = isSyncingDeviceKey === device.platformKey;
                  return (
                    <div
                      key={device.platformKey}
                      className="p-4 rounded-3xl border border-stone-200 bg-stone-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-center justify-center text-stone-800 shrink-0">
                          {device.platformKey === 'apple_health' && <HeartPulse className="w-6 h-6 text-rose-500" />}
                          {device.platformKey === 'strava' && <Activity className="w-6 h-6 text-orange-500" />}
                          {device.platformKey === 'google_fit' && <Smartphone className="w-6 h-6 text-blue-500" />}
                          {device.platformKey === 'garmin' && <Watch className="w-6 h-6 text-cyan-600" />}
                          {device.platformKey === 'polar' && <HeartPulse className="w-6 h-6 text-red-600" />}
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-stone-900">{device.name}</h4>
                          <span className="text-[10px] text-stone-500 block">
                            Status: <strong className={device.connected ? 'text-emerald-600' : 'text-stone-400'}>
                              {device.connected ? 'Conectado & Sincronizado' : 'Não Conectado'}
                            </strong>
                          </span>
                          {device.lastSyncAt && (
                            <span className="text-[9px] text-stone-400">
                              Último sync: {new Date(device.lastSyncAt).toLocaleString('pt-BR')}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {device.connected && (
                          <button
                            onClick={() => handleSyncDevice(device.platformKey)}
                            disabled={isSyncing}
                            className="px-3 py-1.5 rounded-xl bg-white border border-stone-300 hover:bg-stone-100 text-xs font-bold text-stone-700 transition-all cursor-pointer flex items-center gap-1 active:scale-95 disabled:opacity-50"
                          >
                            <RotateCcw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                            {isSyncing ? 'Sincronizando...' : 'Sincronizar'}
                          </button>
                        )}

                        <button
                          onClick={() => toggleDeviceConnection(device.platformKey, !device.connected)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                            device.connected
                              ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                              : 'bg-stone-900 text-white hover:bg-stone-800'
                          }`}
                        >
                          {device.connected ? 'Desconectar' : 'Conectar'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 9: CORPO & MEDIDAS PRIVADAS                                */}
        {/* ============================================================== */}
        {activeTab === 'corpo' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" /> PRIVACIDADE & SIGILO ABSOLUTO
                  </span>
                  <h3 className="text-lg font-black font-['Outfit'] text-stone-900 mt-1">
                    Evolução Corporal & Medidas
                  </h3>
                  <p className="text-xs text-stone-500">
                    Acompanhamento pessoal e opcional de peso e medidas corporais. Seus dados nunca são públicos.
                  </p>
                </div>

                <button
                  onClick={() => setIsAddBodyLogOpen(true)}
                  className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" /> Registrar Medidas
                </button>
              </div>

              {/* Progress Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">Variação de Peso</span>
                  <h4 className="text-xl font-black text-stone-900 font-['Outfit'] mt-1">
                    {bodyProgress.weightChange > 0 ? `+${bodyProgress.weightChange}` : bodyProgress.weightChange} kg
                  </h4>
                  <span className="text-[10px] text-emerald-600 font-bold">Progresso saudável</span>
                </div>

                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">Variação de Cintura</span>
                  <h4 className="text-xl font-black text-stone-900 font-['Outfit'] mt-1">
                    {bodyProgress.waistChange > 0 ? `+${bodyProgress.waistChange}` : bodyProgress.waistChange} cm
                  </h4>
                  <span className="text-[10px] text-emerald-600 font-bold">Redução de medidas</span>
                </div>

                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 col-span-2 sm:col-span-1">
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">Registros Gravados</span>
                  <h4 className="text-xl font-black text-stone-900 font-['Outfit'] mt-1">
                    {bodyEvolutionLogs.length} medições
                  </h4>
                  <span className="text-[10px] text-stone-500">Histórico pessoal seguro</span>
                </div>
              </div>

              {/* History of body logs */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-stone-700">
                  Histórico de Registros
                </h4>
                <div className="divide-y divide-stone-100">
                  {bodyEvolutionLogs.map(log => (
                    <div key={log.id} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-900">{log.weightKg} kg</span>
                          {log.waistCm && <span className="text-stone-500">· Cintura: {log.waistCm}cm</span>}
                          {log.chestCm && <span className="text-stone-500">· Peito: {log.chestCm}cm</span>}
                        </div>
                        {log.notes && <p className="text-[11px] text-stone-500 italic mt-0.5">"{log.notes}"</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-stone-400">{log.date}</span>
                        <button
                          onClick={() => deleteBodyEvolutionLog(log.id)}
                          className="text-stone-300 hover:text-rose-500 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* STRICT MEDICAL & HEALTH DISCLAIMER FOOTER                     */}
        {/* ============================================================== */}
        <div className="bg-stone-100 rounded-3xl p-5 border border-stone-200 text-stone-600 text-xs flex items-start gap-3">
          <Info className="w-5 h-5 text-stone-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-stone-800 uppercase tracking-wider text-[11px] block">
              Aviso Educativo & Informativo
            </span>
            <p className="leading-relaxed text-[11px]">
              O MERMI FIT LIFE não realiza diagnósticos médicos, prescrições clínicas, promessas de cura ou de emagrecimento automático. As métricas e parâmetros visam incentivar a autodisciplina e hábitos diários saudáveis. Consulte sempre profissionais habilitados de medicina, nutrição e educação física para orientações personalizadas.
            </p>
          </div>
        </div>

      </div>

      {/* ============================================================== */}
      {/* MODAL: REGISTRAR ATIVIDADE / TREINO                            */}
      {/* ============================================================== */}
      {isAddActivityOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black font-['Outfit'] text-stone-900">
                Registrar Treino ou Atividade
              </h3>
              <button
                onClick={() => setIsAddActivityOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 text-stone-600 hover:bg-stone-200 flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveActivity} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Título da Atividade</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Treino A - Peito e Tríceps"
                  value={newActTitle}
                  onChange={(e) => setNewActTitle(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Categoria</label>
                  <select
                    value={newActCategory}
                    onChange={(e) => setNewActCategory(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-bold focus:outline-none"
                  >
                    <option value="treino">Treino Geral</option>
                    <option value="academia">Musculação / Academia</option>
                    <option value="corrida">Corrida</option>
                    <option value="caminhada">Caminhada</option>
                    <option value="funcional">Funcional / Cross</option>
                    <option value="ciclismo">Ciclismo</option>
                    <option value="esporte">Esporte</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Intensidade</label>
                  <select
                    value={newActIntensity}
                    onChange={(e) => setNewActIntensity(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-bold focus:outline-none"
                  >
                    <option value="leve">Leve</option>
                    <option value="moderada">Moderada</option>
                    <option value="alta">Alta</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Duração (minutos)</label>
                  <input
                    type="number"
                    required
                    min="5"
                    max="360"
                    value={newActDuration}
                    onChange={(e) => setNewActDuration(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-bold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Distância (km, opcional)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Ex: 5.0"
                    value={newActDistance}
                    onChange={(e) => setNewActDistance(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Observações Pessoais</label>
                <textarea
                  rows={2}
                  placeholder="Como você se sentiu durante o treino?"
                  value={newActNotes}
                  onChange={(e) => setNewActNotes(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddActivityOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 text-stone-600 font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-wider cursor-pointer"
                >
                  Salvar Treino
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: REGISTRAR SONO                                          */}
      {/* ============================================================== */}
      {isAddSleepOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black font-['Outfit'] text-stone-900">
                Registrar Sono
              </h3>
              <button
                onClick={() => setIsAddSleepOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 text-stone-600 hover:bg-stone-200 flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSleep} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Horário de Deitar</label>
                  <input
                    type="time"
                    required
                    value={newSleepBedTime}
                    onChange={(e) => setNewSleepBedTime(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Horário de Acordar</label>
                  <input
                    type="time"
                    required
                    value={newSleepWakeTime}
                    onChange={(e) => setNewSleepWakeTime(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Observações do Descanso</label>
                <input
                  type="text"
                  placeholder="Ex: Acordei com boa disposição"
                  value={newSleepNotes}
                  onChange={(e) => setNewSleepNotes(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddSleepOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 text-stone-600 font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-wider cursor-pointer"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: CRIAR META                                              */}
      {/* ============================================================== */}
      {isAddGoalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black font-['Outfit'] text-stone-900">
                Criar Nova Meta Pessoal
              </h3>
              <button
                onClick={() => setIsAddGoalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 text-stone-600 hover:bg-stone-200 flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveGoal} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Título da Meta</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: 10.000 Passos por dia"
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Tipo</label>
                  <select
                    value={newGoalType}
                    onChange={(e) => setNewGoalType(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 font-bold"
                  >
                    <option value="passos">Passos</option>
                    <option value="hidratacao">Hidratação</option>
                    <option value="treino">Treinos</option>
                    <option value="sono">Sono</option>
                    <option value="habitos">Hábitos</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Período</label>
                  <select
                    value={newGoalPeriod}
                    onChange={(e) => setNewGoalPeriod(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 font-bold"
                  >
                    <option value="diario">Diário</option>
                    <option value="semanal">Semanal</option>
                    <option value="mensal">Mensal</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Valor Alvo</label>
                  <input
                    type="number"
                    required
                    value={newGoalTarget}
                    onChange={(e) => setNewGoalTarget(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Unidade</label>
                  <input
                    type="text"
                    required
                    placeholder="passos, ml, dias"
                    value={newGoalUnit}
                    onChange={(e) => setNewGoalUnit(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 font-bold"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddGoalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 text-stone-600 font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-wider cursor-pointer"
                >
                  Criar Meta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: CRIAR HÁBITO                                            */}
      {/* ============================================================== */}
      {isAddHabitOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black font-['Outfit'] text-stone-900">
                Novo Hábito Saudável
              </h3>
              <button
                onClick={() => setIsAddHabitOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 text-stone-600 hover:bg-stone-200 flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveHabit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Título do Hábito</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Alongamento matinal de 10 min"
                  value={newHabitTitle}
                  onChange={(e) => setNewHabitTitle(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Categoria</label>
                <select
                  value={newHabitCategory}
                  onChange={(e) => setNewHabitCategory(e.target.value as any)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 font-bold"
                >
                  <option value="treino">Treino / Movimento</option>
                  <option value="agua">Hidratação</option>
                  <option value="passos">Passos</option>
                  <option value="sono">Sono</option>
                  <option value="alimentacao">Alimentação Fit</option>
                  <option value="outro">Outro</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddHabitOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 text-stone-600 font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-wider cursor-pointer"
                >
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: REGISTRAR MEDIDAS CORPORAIS PRIVADAS                    */}
      {/* ============================================================== */}
      {isAddBodyLogOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black font-['Outfit'] text-stone-900">
                Registrar Medidas (Privado)
              </h3>
              <button
                onClick={() => setIsAddBodyLogOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 text-stone-600 hover:bg-stone-200 flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveBodyLog} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Peso Atual (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={newBodyWeight}
                  onChange={(e) => setNewBodyWeight(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Cintura (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="Ex: 82.0"
                    value={newBodyWaist}
                    onChange={(e) => setNewBodyWaist(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Quadril (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="Ex: 97.0"
                    value={newBodyHips}
                    onChange={(e) => setNewBodyHips(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Notas Pessoais</label>
                <input
                  type="text"
                  placeholder="Ex: Sensação de menos retenção"
                  value={newBodyNotes}
                  onChange={(e) => setNewBodyNotes(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddBodyLogOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 text-stone-600 font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-wider cursor-pointer"
                >
                  Salvar Sigilosamente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
