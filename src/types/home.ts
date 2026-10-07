export type HomeSectionType =
  | 'hero'
  | 'banner'
  | 'product'
  | 'campaign'
  | 'points'
  | 'challenge'
  | 'race'
  | 'progress'
  | 'content'
  | 'community'
  | 'ai'
  | 'promotion'
  | 'reward';

export interface HomeSection {
  id: string;
  type: HomeSectionType;
  title: string;
  subtitle?: string;
  badge?: string;
  image?: string;
  actionText?: string;
  destination: string;
  order: number;
  active: boolean;
  audience?: 'all' | 'new_users' | 'subscribers' | 'vip';
  startDate?: string;
  endDate?: string;
  metadata?: Record<string, any>;
}
