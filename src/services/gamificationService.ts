import {
  BadgeAchievement,
  EarningRuleConfig,
  PointTransaction,
  PointsSummary,
  UserLevelConfig
} from '../types/gamification';

/**
 * Encontra o nível correspondente com base nos pontos acumulados do usuário.
 */
export function calculateUserLevel(points: number, levels: UserLevelConfig[]): {
  currentLevel: UserLevelConfig;
  nextLevel?: UserLevelConfig;
  progressPercent: number;
  pointsNeededForNextLevel: number;
} {
  const activeLevels = [...levels]
    .filter((l) => l.active)
    .sort((a, b) => a.levelNumber - b.levelNumber);

  if (activeLevels.length === 0) {
    const fallbackLevel: UserLevelConfig = {
      levelNumber: 1,
      name: 'Cliente Foco',
      minPoints: 0,
      benefits: ['Acesso ao catálogo de resgates'],
      badgeIcon: '🎯',
      badgeColor: '#0EB24A',
      description: 'Nível inicial',
      active: true
    };
    return {
      currentLevel: fallbackLevel,
      progressPercent: 0,
      pointsNeededForNextLevel: 250
    };
  }

  // Encontrar o nível mais alto cujo minPoints <= points
  let currentLevel = activeLevels[0];
  let nextLevel: UserLevelConfig | undefined = activeLevels[1];

  for (let i = 0; i < activeLevels.length; i++) {
    if (points >= activeLevels[i].minPoints) {
      currentLevel = activeLevels[i];
      nextLevel = activeLevels[i + 1];
    }
  }

  if (!nextLevel) {
    // Nível máximo atingido
    return {
      currentLevel,
      nextLevel: undefined,
      progressPercent: 100,
      pointsNeededForNextLevel: 0
    };
  }

  const range = nextLevel.minPoints - currentLevel.minPoints;
  const earnedInRange = points - currentLevel.minPoints;
  const progressPercent = Math.min(100, Math.max(0, Math.round((earnedInRange / range) * 100)));
  const pointsNeededForNextLevel = Math.max(0, nextLevel.minPoints - points);

  return {
    currentLevel,
    nextLevel,
    progressPercent,
    pointsNeededForNextLevel
  };
}

/**
 * Calcula o resumo financeiro dos MerMi Points a partir do histórico de transações.
 */
export function calculatePointsSummary(
  transactions: PointTransaction[],
  levels: UserLevelConfig[]
): PointsSummary {
  let totalEarned = 0;
  let totalUsed = 0;
  let totalExpired = 0;

  for (const tx of transactions) {
    if (tx.type === 'ganho') {
      totalEarned += tx.amount;
    } else if (tx.type === 'utilizado') {
      totalUsed += Math.abs(tx.amount);
    } else if (tx.type === 'expirado') {
      totalExpired += Math.abs(tx.amount);
    } else if (tx.type === 'ajuste_admin') {
      if (tx.amount >= 0) {
        totalEarned += tx.amount;
      } else {
        totalUsed += Math.abs(tx.amount);
      }
    }
  }

  const currentBalance = Math.max(0, totalEarned - totalUsed - totalExpired);
  const levelInfo = calculateUserLevel(currentBalance, levels);

  return {
    currentBalance,
    totalEarned,
    totalUsed,
    totalExpired,
    currentLevel: levelInfo.currentLevel,
    nextLevel: levelInfo.nextLevel,
    progressPercent: levelInfo.progressPercent,
    pointsNeededForNextLevel: levelInfo.pointsNeededForNextLevel
  };
}

/**
 * Calcula os pontos elegíveis para um pedido com base nas regras configuradas no MERMI CONTROL.
 */
export function calculateOrderEligiblePoints(
  itemsCount: number,
  orderTotal: number,
  isFirstOrder: boolean,
  rules: EarningRuleConfig[]
): {
  totalPoints: number;
  breakdown: { ruleName: string; points: number }[];
} {
  let totalPoints = 0;
  const breakdown: { ruleName: string; points: number }[] = [];

  const marmitaRule = rules.find((r) => r.actionKey === 'compra_marmita' && r.active);
  if (marmitaRule) {
    const pts = itemsCount * marmitaRule.pointsAmount;
    if (pts > 0) {
      totalPoints += pts;
      breakdown.push({ ruleName: `${marmitaRule.name} (${itemsCount}x)`, points: pts });
    }
  }

  const reaisRule = rules.find((r) => r.actionKey === 'compra_reais' && r.active);
  if (reaisRule) {
    const pts = Math.floor(orderTotal * reaisRule.pointsAmount);
    if (pts > 0) {
      totalPoints += pts;
      breakdown.push({ ruleName: `${reaisRule.name} (R$ ${orderTotal.toFixed(2)})`, points: pts });
    }
  }

  if (isFirstOrder) {
    const firstOrderRule = rules.find((r) => r.actionKey === 'primeira_compra' && r.active);
    if (firstOrderRule) {
      totalPoints += firstOrderRule.pointsAmount;
      breakdown.push({ ruleName: firstOrderRule.name, points: firstOrderRule.pointsAmount });
    }
  }

  // Garantir um piso de ao menos 10 pts por marmita se nenhuma regra especial for aplicada
  if (totalPoints === 0 && itemsCount > 0) {
    totalPoints = itemsCount * 10;
    breakdown.push({ ruleName: 'Marmitas Pedidas (Padrão)', points: totalPoints });
  }

  return { totalPoints, breakdown };
}
