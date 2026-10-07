import {
  WaterLog,
  StepsLog,
  SleepLog,
  ActivityLog,
  HabitItem,
  HabitCompletion,
  ConnectedDevice,
  BodyEvolutionLog,
  DevicePlatformKey
} from '../types/evolution';

export interface DaySummary {
  stepsCount: number;
  stepsGoal: number;
  stepsPercentage: number;
  waterIntakeMl: number;
  waterGoalMl: number;
  waterPercentage: number;
  sleepDurationMinutes: number;
  sleepFormatted: string;
  sleepQuality: string;
  activitiesCount: number;
  activitiesTotalMinutes: number;
  habitsCompletedToday: number;
  totalHabitsCount: number;
  pointsEarnedToday: number;
  activeStreakDays: number;
}

export const formatDurationMinutes = (minutes: number): string => {
  if (minutes <= 0) return 'Sem registro';
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  if (hours === 0) return `${remainingMins} min`;
  if (remainingMins === 0) return `${hours}h`;
  return `${hours}h ${remainingMins}min`;
};

export const formatMlToLiters = (ml: number): string => {
  if (ml < 1000) return `${ml} ml`;
  const liters = (ml / 1000).toFixed(1).replace('.', ',');
  return `${liters} L`;
};

export const calculateBedtimeDurationMinutes = (bedTime: string, wakeTime: string): number => {
  if (!bedTime || !wakeTime) return 0;
  const [bedH, bedM] = bedTime.split(':').map(Number);
  const [wakeH, wakeM] = wakeTime.split(':').map(Number);

  let bedMinutes = bedH * 60 + bedM;
  let wakeMinutes = wakeH * 60 + wakeM;

  if (wakeMinutes < bedMinutes) {
    wakeMinutes += 24 * 60;
  }

  return Math.max(0, wakeMinutes - bedMinutes);
};

export const calculateWaterStats = (logs: WaterLog[], goalMl: number, targetDate?: string) => {
  const dateToMatch = targetDate || new Date().toISOString().split('T')[0];
  const dayLogs = logs.filter(l => l.date === dateToMatch);
  const currentMl = dayLogs.reduce((acc, log) => acc + log.amountMl, 0);
  const safeGoal = Math.max(500, goalMl || 2500);
  const percentage = Math.min(100, Math.round((currentMl / safeGoal) * 100));
  const remainingMl = Math.max(0, safeGoal - currentMl);
  const isGoalMet = currentMl >= safeGoal;

  return {
    currentMl,
    goalMl: safeGoal,
    percentage,
    remainingMl,
    isGoalMet,
    logsCount: dayLogs.length,
    dayLogs
  };
};

export const calculateStepsStats = (logs: StepsLog[], goal: number, targetDate?: string) => {
  const dateToMatch = targetDate || new Date().toISOString().split('T')[0];
  const todayLog = logs.find(l => l.date === dateToMatch);
  const stepsToday = todayLog ? todayLog.stepsCount : 0;
  const safeGoal = Math.max(1000, goal || 8500);
  const percentage = Math.min(100, Math.round((stepsToday / safeGoal) * 100));
  const distanceKm = todayLog?.distanceKm ?? Number(((stepsToday * 0.75) / 1000).toFixed(1));
  const caloriesBurned = todayLog?.caloriesBurned ?? Math.round(stepsToday * 0.045);
  const isGoalMet = stepsToday >= safeGoal;

  // Average over available logs
  const totalSteps = logs.reduce((acc, l) => acc + l.stepsCount, 0);
  const averageSteps = logs.length > 0 ? Math.round(totalSteps / logs.length) : stepsToday;

  return {
    stepsToday,
    goal: safeGoal,
    percentage,
    distanceKm,
    caloriesBurned,
    isGoalMet,
    averageSteps
  };
};

export const calculateSleepStats = (logs: SleepLog[], targetHours: number, targetDate?: string) => {
  const dateToMatch = targetDate || new Date().toISOString().split('T')[0];
  const todayLog = logs.find(l => l.date === dateToMatch);
  const durationMinutes = todayLog ? todayLog.durationMinutes : 0;
  const formattedDuration = formatDurationMinutes(durationMinutes);
  const qualityMetric = todayLog?.qualityMetric || (durationMinutes > 0 ? 'Duração registrada' : 'Sem registro');
  const targetMinutes = Math.max(4, targetHours || 8) * 60;
  const isTargetMet = durationMinutes >= targetMinutes;

  const totalMinutes = logs.reduce((acc, l) => acc + l.durationMinutes, 0);
  const averageMinutes = logs.length > 0 ? Math.round(totalMinutes / logs.length) : durationMinutes;
  const formattedAverage = formatDurationMinutes(averageMinutes);

  return {
    todayLog,
    durationMinutes,
    formattedDuration,
    qualityMetric,
    isTargetMet,
    averageMinutes,
    formattedAverage
  };
};

export const calculateConsistencyScore = (
  habits: HabitItem[],
  completions: HabitCompletion[],
  daysCount = 7
): { scorePercentage: number; completedCount: number; totalPossible: number } => {
  const activeHabits = habits.filter(h => h.active);
  if (activeHabits.length === 0) return { scorePercentage: 100, completedCount: 0, totalPossible: 0 };

  const totalPossible = activeHabits.length * daysCount;
  const activeHabitIds = new Set(activeHabits.map(h => h.id));

  // Count completions in the last daysCount
  const recentCompletions = completions.filter(c => c.completed && activeHabitIds.has(c.habitId));
  const completedCount = recentCompletions.length;
  const scorePercentage = Math.min(100, Math.round((completedCount / totalPossible) * 100));

  return {
    scorePercentage,
    completedCount,
    totalPossible
  };
};

export const simulateDeviceSyncResult = (platformKey: DevicePlatformKey): {
  syncedSteps: number;
  syncedSleepMinutes: number;
  syncedActivityTitle?: string;
  message: string;
} => {
  const platformNames: Record<DevicePlatformKey, string> = {
    apple_health: 'Apple Health',
    google_fit: 'Google Fit / Health Connect',
    strava: 'Strava',
    garmin: 'Garmin Connect',
    polar: 'Polar Flow'
  };

  const name = platformNames[platformKey] || 'Dispositivo';

  return {
    syncedSteps: 0,
    syncedSleepMinutes: 0,
    syncedActivityTitle: undefined,
    message: `${name} conectado com sucesso. Nenhum registro novo importado.`
  };
};

export const calculateBodyProgress = (logs: BodyEvolutionLog[]) => {
  if (!logs || logs.length < 2) {
    return {
      weightChange: 0,
      waistChange: 0,
      daysTracked: logs.length
    };
  }

  // Sorted by date asc
  const sorted = [...logs].sort((a, b) => a.date.localeCompare(b.date));
  const oldest = sorted[0];
  const newest = sorted[sorted.length - 1];

  const weightChange = (newest.weightKg && oldest.weightKg)
    ? Number((newest.weightKg - oldest.weightKg).toFixed(1))
    : 0;

  const waistChange = (newest.waistCm && oldest.waistCm)
    ? Number((newest.waistCm - oldest.waistCm).toFixed(1))
    : 0;

  return {
    weightChange,
    waistChange,
    daysTracked: sorted.length,
    initialWeight: oldest.weightKg,
    currentWeight: newest.weightKg,
    initialWaist: oldest.waistCm,
    currentWaist: newest.waistCm
  };
};
