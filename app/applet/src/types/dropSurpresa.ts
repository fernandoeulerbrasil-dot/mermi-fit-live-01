/**
 * MERMI FIT LIFE — DROP SURPRESA TYPES
 * 
 * Regra:
 * O Drop Surpresa é um módulo de gamificação independente e exclusivo.
 * Visual azul profundo, estética futurista e recompensas dinâmicas.
 */

export type DropRewardType = 
  | 'points' 
  | 'cupom' 
  | 'desconto' 
  | 'produto' 
  | 'marmita' 
  | 'brinde' 
  | 'experiencia';

export interface DropSurpresaItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  rewardType: DropRewardType;
  rewardValue: string | number;
  rewardLabel: string;
  quantityTotal: number;
  quantityClaimed: number;
  startDate: string;
  endDate: string;
  minPointsRequired: number;
  minOrdersRequired: number;
  probabilityPercent?: number;
  frequency: 'unico' | 'diario' | 'semanal';
  active: boolean;
  featured: boolean;
  colorTheme?: string;
  badge?: string;
}

export interface DropClaimRecord {
  id: string;
  dropId: string;
  dropTitle: string;
  userId: string;
  userName: string;
  rewardType: DropRewardType;
  rewardLabel: string;
  claimedAt: string;
  expiresAt: string;
  status: 'resgatado' | 'utilizado' | 'expirado';
  codeSnippet?: string;
}
