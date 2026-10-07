export type PointTransactionType = 'ganho' | 'utilizado' | 'expirado' | 'ajuste_admin';

export type PointOrigin =
  | 'compra'
  | 'primeira_compra'
  | 'recorrencia'
  | 'indicacao'
  | 'desafio'
  | 'corrida'
  | 'inscricao_corrida'
  | 'participacao_corrida'
  | 'conclusao_corrida'
  | 'desafio_virtual'
  | 'meta_passos'
  | 'streak'
  | 'hidratacao'
  | 'treino'
  | 'atividade'
  | 'evolucao'
  | 'habito'
  | 'avaliacao'
  | 'comunidade'
  | 'campanha'
  | 'promocional'
  | 'aniversario'
  | 'missao'
  | 'drop'
  | 'resgate'
  | 'admin_manual';

export interface PointTransaction {
  id: string;
  userId: string;
  userName?: string;
  amount: number; // Positivo para ganhos/ajustes positivos, negativo para resgates/expirações
  type: PointTransactionType;
  origin: PointOrigin;
  description: string;
  date: string;
  referenceId?: string; // ex: PED-1024, drop_01, des_10k, rew_marmita
  adminResponsible?: string; // Nome do administrador quando for ajuste manual
  createdAt?: string;
}

export type EarningRuleCalculationType = 'fixo' | 'por_real' | 'por_marmita';

export interface EarningRuleConfig {
  id: string;
  actionKey: string;
  name: string;
  description: string;
  pointsAmount: number;
  calculationType: EarningRuleCalculationType;
  category: 'compras' | 'habitos' | 'esportes' | 'comunidade' | 'especiais';
  active: boolean;
  minOrderValue?: number;
}

export interface UserLevelConfig {
  levelNumber: number;
  name: string;
  minPoints: number;
  benefits: string[];
  badgeIcon: string;
  badgeColor: string;
  description: string;
  active: boolean;
}

export interface BadgeAchievement {
  id: string;
  name: string;
  description: string;
  category: 'primeiros_passos' | 'nutricao' | 'esportes' | 'constancia' | 'comunidade' | 'fidelidade';
  icon: string;
  condition: string;
  unlocked: boolean;
  unlockedAt?: string;
  pointsReward?: number;
  status: 'ativo' | 'inativo';
}

export type MissionFrequency = 'diaria' | 'semanal' | 'mensal' | 'especial' | 'campanha' | 'evento';

export interface GamificationMission {
  id: string;
  title: string;
  description: string;
  type: MissionFrequency;
  objective: string;
  progress: number;
  goal: number;
  unit: string;
  pointsReward: number;
  extraRewardLabel?: string;
  startDate?: string;
  endDate?: string;
  status: 'em_andamento' | 'concluida' | 'resgatada';
  rules: string;
  active: boolean;
}

export interface StreakMilestone {
  days: number;
  points: number;
  label: string;
  active: boolean;
  achieved?: boolean;
}

export interface StreakRecord {
  currentStreakDays: number;
  bestStreakDays: number;
  lastActiveDate: string;
  milestones: StreakMilestone[];
}

export interface PointsSummary {
  currentBalance: number;
  totalEarned: number;
  totalUsed: number;
  totalExpired: number;
  currentLevel: UserLevelConfig;
  nextLevel?: UserLevelConfig;
  progressPercent: number;
  pointsNeededForNextLevel: number;
}
