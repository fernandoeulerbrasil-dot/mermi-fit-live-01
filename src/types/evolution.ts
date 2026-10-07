export type DataOrigin = 'manual' | 'dispositivo' | 'integracao' | 'mermi_run' | 'outro';

export type SyncStatus = 'sincronizado' | 'sincronizando' | 'erro' | 'nao_conectado';

export type DevicePlatformKey = 'apple_health' | 'google_fit' | 'strava' | 'garmin' | 'polar';

export interface DevicePermissions {
  steps: boolean;
  water: boolean;
  sleep: boolean;
  workouts: boolean;
  heartRate: boolean;
  calories: boolean;
  authorizedAt?: string;
}

export interface ConnectedDevice {
  platformKey: DevicePlatformKey;
  name: string;
  icon: string;
  connected: boolean;
  syncStatus: SyncStatus;
  lastSyncAt?: string;
  permissions: DevicePermissions;
}

export interface WaterLog {
  id: string;
  amountMl: number;
  timestamp: string; // ISO string
  date: string; // YYYY-MM-DD
  origin: DataOrigin;
  offlinePending?: boolean;
}

export interface WaterSettings {
  dailyGoalMl: number;
  quickOptions: number[]; // ex: [200, 300, 500, 750, 1000]
  remindersEnabled: boolean;
  reminderFrequency: '1h' | '2h' | '3h' | 'personalizado';
  reminderStartTime: string; // '08:00'
  reminderEndTime: string;   // '22:00'
}

export interface SleepLog {
  id: string;
  date: string; // YYYY-MM-DD
  bedTime: string; // '23:15'
  wakeTime: string; // '07:00'
  durationMinutes: number; // 465 min (7h45)
  deepSleepMinutes?: number;
  qualityMetric?: 'Excelente' | 'Boa' | 'Regular' | 'Duração registrada';
  origin: DataOrigin;
  notes?: string;
}

export interface SleepSettings {
  targetHours: number; // ex: 8
  scheduleBedTime: string; // '23:00'
  scheduleWakeTime: string; // '07:00'
}

export interface StepsLog {
  id: string;
  date: string; // YYYY-MM-DD
  stepsCount: number;
  goal: number;
  distanceKm?: number;
  caloriesBurned?: number;
  origin: DataOrigin;
}

export interface StepsSettings {
  dailyGoal: number; // default: 8500
  weeklyGoal: number; // default: 60000
}

export type ActivityCategory =
  | 'caminhada'
  | 'corrida'
  | 'ciclismo'
  | 'treino'
  | 'academia'
  | 'funcional'
  | 'esporte'
  | 'personalizada';

export interface ActivityLog {
  id: string;
  title: string;
  category: ActivityCategory;
  durationMinutes: number;
  distanceKm?: number;
  caloriesBurned?: number;
  date: string; // YYYY-MM-DD
  time: string; // '07:30'
  origin: DataOrigin;
  notes?: string;
  intensity?: 'leve' | 'moderada' | 'alta';
  raceEventRefId?: string; // se vier do MerMi Run
}

export interface HabitItem {
  id: string;
  title: string;
  category: 'agua' | 'passos' | 'sono' | 'treino' | 'alimentacao' | 'outro';
  icon: string;
  active: boolean;
  targetDaysPerWeek: number;
  pointsReward?: number;
  streakDays: number;
  createdAt: string;
}

export interface HabitCompletion {
  habitId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  completedAt?: string;
}

export type GoalType =
  | 'hidratacao'
  | 'passos'
  | 'sono'
  | 'atividade'
  | 'treino'
  | 'corrida'
  | 'habitos'
  | 'points'
  | 'desafios';

export type GoalStatus = 'ativa' | 'concluida' | 'pausada' | 'cancelada';

export interface EvolutionGoal {
  id: string;
  title: string;
  description: string;
  type: GoalType;
  targetValue: number;
  currentValue: number;
  unit: string;
  period: 'diario' | 'semanal' | 'mensal';
  status: GoalStatus;
  pointsReward?: number;
  startDate: string;
  endDate?: string;
}

export interface BodyEvolutionLog {
  id: string;
  date: string; // YYYY-MM-DD
  weightKg?: number;
  waistCm?: number;
  chestCm?: number;
  hipsCm?: number;
  notes?: string;
  photoUrlPrivate?: string; // Privada por padrão, nunca pública
}

export interface EvolutionPeriodComparison {
  metric: 'passos' | 'agua' | 'sono' | 'atividade';
  currentValue: number;
  previousValue: number;
  percentageChange: number; // +12%, -8%
  unit: string;
}

export interface EvolutionAdminConfig {
  defaultStepsGoal: number;
  defaultWaterGoalMl: number;
  defaultSleepHours: number;
  pointsPerWaterGoalMet: number;
  pointsPerStepsGoalMet: number;
  pointsPerWorkoutLogged: number;
  pointsPerWeeklyConsistency: number;
  supportedDevices: DevicePlatformKey[];
  enableWearablesSync: boolean;
}
