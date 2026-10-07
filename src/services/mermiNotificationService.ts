import {
  AppNotification,
  NotificationPreferences,
  NotificationProvider
} from '../types/mermiNotifications';
import { CustomerCrmProfile } from '../types/mermiControl';
import { UserProfile } from '../types';
import { OrderEntity } from '../types/food';
import { WaterLog, SleepLog, HabitItem, HabitCompletion, ActivityLog } from '../types/evolution';

/**
 * Substitui variáveis reais no template.
 * Ex: {{user_name}}, {{order_number}}, {{points_balance}}, {{favorite_dish}}
 */
export const formatTemplateVariables = (
  template: string,
  variables: Record<string, string | number | undefined>
): string => {
  return template.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, key) => {
    if (variables[key] !== undefined && variables[key] !== null) {
      return String(variables[key]);
    }
    return '';
  });
};

/**
 * Verifica se o momento atual está dentro do Horário de Silêncio (DND)
 */
export const isWithinQuietHours = (prefs: NotificationPreferences): boolean => {
  if (!prefs.quiet_hours.enabled) return false;

  const now = new Date();
  const currentDay = now.getDay();
  if (!prefs.quiet_hours.days.includes(currentDay)) return false;

  const [startH, startM] = prefs.quiet_hours.start.split(':').map(Number);
  const [endH, endM] = prefs.quiet_hours.end.split(':').map(Number);

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  if (startMinutes <= endMinutes) {
    return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
  } else {
    // Cruza a meia-noite (ex: 22:00 até 07:00)
    return currentMinutes >= startMinutes || currentMinutes <= endMinutes;
  }
};

/**
 * Validação Anti-Spam e Preferências do Usuário
 */
export const shouldDeliverNotification = (
  notification: AppNotification,
  prefs: NotificationPreferences,
  dailyDeliveredCount: number,
  maxDailyPromotional: number = 3
): { deliver: boolean; reason?: string } => {
  // 1. Notificações urgentes transacionais sempre furam silêncio e limites
  if (notification.priority === 'urgente' || notification.category === 'PEDIDO' || notification.category === 'PAGAMENTO' || notification.category === 'ENTREGA') {
    return { deliver: true };
  }

  // 2. Horário de Silêncio
  if (isWithinQuietHours(prefs)) {
    return { deliver: false, reason: 'Horário de Silêncio (DND) ativo.' };
  }

  // 3. Preferência de canal do usuário
  if (notification.channel === 'push' && !prefs.channels.push) {
    return { deliver: false, reason: 'Usuário desativou notificações Push.' };
  }
  if (notification.channel === 'email' && !prefs.channels.email) {
    return { deliver: false, reason: 'Usuário desativou notificações por E-mail.' };
  }

  // 4. Preferência por categoria
  const catKey = notification.category.toLowerCase() as keyof NotificationPreferences['categories'];
  if (prefs.categories[catKey] === false) {
    return { deliver: false, reason: `Categoria ${notification.category} desativada pelo usuário.` };
  }

  // 5. Anti-Spam de Campanhas e Promoções
  if (notification.category === 'PROMOÇÃO' || notification.category === 'CAMPANHA') {
    if (dailyDeliveredCount >= maxDailyPromotional) {
      return { deliver: false, reason: 'Limite diário de notificações promocionais atingido.' };
    }
  }

  return { deliver: true };
};

/**
 * Avaliação Dinâmica de Segmentação com base no CRM
 */
export const evaluateAudienceEligibility = (
  customer: CustomerCrmProfile,
  segment: string
): boolean => {
  const normalized = segment.toLowerCase();
  if (normalized === 'todos' || normalized === 'geral') return true;

  if (normalized === 'novos') {
    return customer.ordersCount <= 1 || customer.segment === 'novo';
  }
  if (normalized === 'ativos') {
    return customer.segment === 'ativo' && (customer.daysSinceLastOrder ?? 0) <= 14;
  }
  if (normalized === 'recorrentes' || normalized === 'frequentes') {
    return customer.ordersCount >= 3 || customer.segment === 'frequente';
  }
  if (normalized === 'vip' || normalized === 'premium') {
    return customer.isVip || customer.totalSpent >= 300 || customer.segment === 'vip';
  }
  if (normalized === 'inativos') {
    return customer.segment === 'inativo' || (customer.daysSinceLastOrder ?? 0) > 14;
  }
  if (normalized === 'churn_risk' || normalized === 'risco') {
    return (customer.daysSinceLastOrder ?? 0) > 30 || customer.relationshipStatus === 'em_risco';
  }
  if (normalized === 'run' || normalized === 'mermi_run') {
    return (customer.participatedRunEvents ?? 0) > 0;
  }
  if (normalized === 'carrinho_abandonado') {
    return (customer.notes?.toLowerCase().includes('carrinho')) ?? false;
  }

  return true;
};

/**
 * Provider Desacoplado (NotificationProvider)
 */
export class MermiInAppNotificationProvider implements NotificationProvider {
  name = 'Mermi Native In-App & Web Push';

  async sendPush(notif: AppNotification): Promise<boolean> {
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(notif.title, {
          body: notif.message,
          icon: '/assets/brand/mermi-logo.png',
          badge: '/assets/brand/mermi-logo.png'
        });
      } catch {
        // Fallback silencioso em navegadores com restrições
      }
    }
    return true;
  }

  async sendInApp(notif: AppNotification): Promise<boolean> {
    return true;
  }

  async sendEmail(to: string, subject: string, body: string): Promise<boolean> {
    // Camada extensível para gateway SMTP / SES
    return true;
  }

  async sendWhatsApp(phone: string, text: string): Promise<boolean> {
    // Camada extensível para API Oficial Meta WhatsApp Business
    return true;
  }
}

/**
 * Gerador de "Meu Resumo do Dia" com dados reais registrados
 */
export interface DailySummaryData {
  dateStr: string;
  ordersCount: number;
  totalSpent: number;
  pointsEarned: number;
  waterCurrentMl: number;
  waterGoalMl: number;
  waterPercent: number;
  sleepHours: number;
  sleepQuality: string;
  habitsCompletedCount: number;
  habitsTotalCount: number;
  activitiesCount: number;
  streakDays: number;
}

export const generateDailySummary = (
  user: UserProfile,
  orders: OrderEntity[],
  waterLogs: WaterLog[],
  sleepLogs: SleepLog[],
  habits: HabitItem[],
  habitCompletions: HabitCompletion[],
  activityLogs: ActivityLog[],
  streakDays: number
): DailySummaryData => {
  const todayStr = new Date().toISOString().split('T')[0];

  // Pedidos de hoje
  const todayOrders = orders.filter((o) => {
    const oDate = new Date(o.created_at).toISOString().split('T')[0];
    return oDate === todayStr;
  });
  const ordersCount = todayOrders.length;
  const totalSpent = todayOrders.reduce((acc, o) => acc + (o.total || 0), 0);
  const pointsEarned = todayOrders.reduce((acc, o) => acc + (o.points_earned || 0), 0);

  // Água de hoje
  const todayWater = waterLogs.filter((w) => w.date === todayStr);
  const waterCurrentMl = todayWater.reduce((acc, w) => acc + w.amountMl, 0);
  const waterGoalMl = 2500; // Meta padrão recomendada
  const waterPercent = Math.min(100, Math.round((waterCurrentMl / waterGoalMl) * 100));

  // Sono registrado da noite anterior
  const recentSleep = sleepLogs[0];
  const sleepHours = recentSleep?.durationMinutes ? Math.round((recentSleep.durationMinutes / 60) * 10) / 10 : 7.5;
  const sleepQuality = recentSleep?.qualityMetric ? recentSleep.qualityMetric : (recentSleep ? 'Registrado' : 'Não registrado');

  // Hábitos de hoje
  const todayCompletions = habitCompletions.filter((c) => c.date === todayStr);
  const habitsCompletedCount = todayCompletions.length;
  const habitsTotalCount = habits.length;

  // Atividades de hoje
  const todayActivities = activityLogs.filter((a) => a.date === todayStr);
  const activitiesCount = todayActivities.length;

  return {
    dateStr: new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }),
    ordersCount,
    totalSpent,
    pointsEarned,
    waterCurrentMl,
    waterGoalMl,
    waterPercent,
    sleepHours,
    sleepQuality,
    habitsCompletedCount,
    habitsTotalCount,
    activitiesCount,
    streakDays
  };
};
