export type DropRewardType =
  | 'points'
  | 'cupom'
  | 'desconto'
  | 'produto'
  | 'beneficio'
  | 'experiencia'
  | 'surpresa'
  | 'marmita'
  | 'brinde'
  | 'frete_gratis';

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
  startDate?: string;
  endDate?: string;
  minPointsRequired: number;
  minOrdersRequired: number;
  probabilityPercent?: number;
  frequency: 'diario' | 'semanal' | 'mensal' | 'relampago' | 'unico';
  active: boolean;
  featured?: boolean;
  badge?: string;
  colorTheme?: string;
}

export interface DropClaimRecord {
  id: string;
  dropId: string;
  dropTitle: string;
  userId?: string;
  userName?: string;
  rewardType?: DropRewardType;
  rewardLabel: string;
  claimedAt: string;
  expiresAt?: string;
  status: 'resgatado' | 'Disponível' | 'Utilizado' | 'utilizado' | 'Expirado';
  codeSnippet: string;
}
