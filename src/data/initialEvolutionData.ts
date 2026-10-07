import {
  WaterSettings,
  WaterLog,
  StepsSettings,
  StepsLog,
  SleepSettings,
  SleepLog,
  ActivityLog,
  HabitItem,
  HabitCompletion,
  EvolutionGoal,
  ConnectedDevice,
  BodyEvolutionLog,
  EvolutionAdminConfig
} from '../types/evolution';

// Helper to get formatted dates
const getPastDateStr = (daysAgo: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

export const TODAY_STR = getPastDateStr(0);

export const INITIAL_WATER_SETTINGS: WaterSettings = {
  dailyGoalMl: 2500,
  quickOptions: [200, 300, 500, 750, 1000],
  remindersEnabled: true,
  reminderFrequency: '2h',
  reminderStartTime: '08:00',
  reminderEndTime: '22:00'
};

export const INITIAL_WATER_LOGS: WaterLog[] = [];

export const INITIAL_STEPS_SETTINGS: StepsSettings = {
  dailyGoal: 8500,
  weeklyGoal: 60000
};

export const INITIAL_STEPS_LOGS: StepsLog[] = [];

export const INITIAL_SLEEP_SETTINGS: SleepSettings = {
  targetHours: 8,
  scheduleBedTime: '23:00',
  scheduleWakeTime: '07:00'
};

export const INITIAL_SLEEP_LOGS: SleepLog[] = [];

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [];

export const INITIAL_HABITS: HabitItem[] = [
  {
    id: 'hbt_water',
    title: 'Beber 2,5 L de Água',
    category: 'agua',
    icon: 'Droplets',
    active: true,
    targetDaysPerWeek: 7,
    pointsReward: 15,
    streakDays: 0,
    createdAt: TODAY_STR
  },
  {
    id: 'hbt_steps',
    title: 'Bater 8.500 Passos',
    category: 'passos',
    icon: 'Footprints',
    active: true,
    targetDaysPerWeek: 6,
    pointsReward: 20,
    streakDays: 0,
    createdAt: TODAY_STR
  },
  {
    id: 'hbt_workout',
    title: 'Treino / Movimento Ativo',
    category: 'treino',
    icon: 'Dumbbell',
    active: true,
    targetDaysPerWeek: 5,
    pointsReward: 25,
    streakDays: 0,
    createdAt: TODAY_STR
  },
  {
    id: 'hbt_sleep',
    title: 'Dormir antes das 23:30',
    category: 'sono',
    icon: 'Moon',
    active: true,
    targetDaysPerWeek: 7,
    pointsReward: 15,
    streakDays: 0,
    createdAt: TODAY_STR
  },
  {
    id: 'hbt_meal',
    title: 'Refeição Limpa & Nutritiva',
    category: 'alimentacao',
    icon: 'Utensils',
    active: true,
    targetDaysPerWeek: 7,
    pointsReward: 10,
    streakDays: 0,
    createdAt: TODAY_STR
  }
];

export const INITIAL_HABIT_COMPLETIONS: HabitCompletion[] = [];

export const INITIAL_EVOLUTION_GOALS: EvolutionGoal[] = [
  {
    id: 'goal_steps_today',
    title: 'Passos Diários (8.500)',
    description: 'Manter circulação ativa e consistência cardiovascular.',
    type: 'passos',
    targetValue: 8500,
    currentValue: 0,
    unit: 'passos',
    period: 'diario',
    status: 'ativa',
    pointsReward: 20,
    startDate: TODAY_STR
  },
  {
    id: 'goal_water_today',
    title: 'Meta de Hidratação (2,5 L)',
    description: 'Manter hidratação para digestão e performance muscular.',
    type: 'hidratacao',
    targetValue: 2500,
    currentValue: 0,
    unit: 'ml',
    period: 'diario',
    status: 'ativa',
    pointsReward: 15,
    startDate: TODAY_STR
  },
  {
    id: 'goal_workouts_week',
    title: '4 Treinos na Semana',
    description: 'Garantir frequência consistente de musculação e cárdio.',
    type: 'treino',
    targetValue: 4,
    currentValue: 0,
    unit: 'treinos',
    period: 'semanal',
    status: 'ativa',
    pointsReward: 50,
    startDate: TODAY_STR
  },
  {
    id: 'goal_sleep_today',
    title: 'Noite Regenerativa (7h+)',
    description: 'Sono essencial para síntese proteica e equilíbrio hormonal.',
    type: 'sono',
    targetValue: 7,
    currentValue: 0,
    unit: 'horas',
    period: 'diario',
    status: 'ativa',
    pointsReward: 15,
    startDate: TODAY_STR
  }
];

export const INITIAL_CONNECTED_DEVICES: ConnectedDevice[] = [
  {
    platformKey: 'apple_health',
    name: 'Apple Health',
    icon: 'Heart',
    connected: false,
    syncStatus: 'nao_conectado',
    permissions: {
      steps: true,
      water: false,
      sleep: true,
      workouts: true,
      heartRate: true,
      calories: true
    }
  },
  {
    platformKey: 'strava',
    name: 'Strava',
    icon: 'Activity',
    connected: false,
    syncStatus: 'nao_conectado',
    permissions: {
      steps: false,
      water: false,
      sleep: false,
      workouts: true,
      heartRate: false,
      calories: true
    }
  },
  {
    platformKey: 'google_fit',
    name: 'Google Fit / Health Connect',
    icon: 'Activity',
    connected: false,
    syncStatus: 'nao_conectado',
    permissions: {
      steps: true,
      water: true,
      sleep: true,
      workouts: true,
      heartRate: false,
      calories: true
    }
  },
  {
    platformKey: 'garmin',
    name: 'Garmin Connect',
    icon: 'Watch',
    connected: false,
    syncStatus: 'nao_conectado',
    permissions: {
      steps: true,
      water: false,
      sleep: true,
      workouts: true,
      heartRate: true,
      calories: true
    }
  },
  {
    platformKey: 'polar',
    name: 'Polar Flow',
    icon: 'HeartPulse',
    connected: false,
    syncStatus: 'nao_conectado',
    permissions: {
      steps: true,
      water: false,
      sleep: true,
      workouts: true,
      heartRate: true,
      calories: true
    }
  }
];

export const INITIAL_BODY_EVOLUTION: BodyEvolutionLog[] = [];

export const INITIAL_EVOLUTION_ADMIN_CONFIG: EvolutionAdminConfig = {
  defaultStepsGoal: 8500,
  defaultWaterGoalMl: 2500,
  defaultSleepHours: 8,
  pointsPerWaterGoalMet: 15,
  pointsPerStepsGoalMet: 20,
  pointsPerWorkoutLogged: 25,
  pointsPerWeeklyConsistency: 100,
  supportedDevices: ['apple_health', 'google_fit', 'strava', 'garmin', 'polar'],
  enableWearablesSync: true
};
