import {
  RaceEvent,
  RaceCategory,
  RaceRegistration,
  RankingEntry,
  RankingDisplayPrivacy,
  RankingType,
  RaceFinancialReport
} from '../types/mermiRun';

/**
 * Calcula o desconto com base nos pontos disponíveis e nas regras da corrida.
 */
export function calculatePointsDiscount(
  originalPrice: number,
  userPoints: number,
  pointsConfig: {
    allowPointsDiscount: boolean;
    pointsToReaisRatio: number; // ex: 0.10 -> 100 pts = R$ 10,00
    minPointsToRedeem: number;
    maxDiscountPercentage: number;
  },
  desiredPointsToUse?: number
): {
  eligible: boolean;
  pointsToUse: number;
  discountReais: number;
  finalPrice: number;
  message?: string;
} {
  if (!pointsConfig.allowPointsDiscount || originalPrice <= 0) {
    return {
      eligible: false,
      pointsToUse: 0,
      discountReais: 0,
      finalPrice: originalPrice,
      message: 'Desconto com points não habilitado para esta categoria.'
    };
  }

  if (userPoints < pointsConfig.minPointsToRedeem) {
    return {
      eligible: false,
      pointsToUse: 0,
      discountReais: 0,
      finalPrice: originalPrice,
      message: `Mínimo de ${pointsConfig.minPointsToRedeem} points para resgatar desconto.`
    };
  }

  // Teto máximo de desconto em reais
  const maxDiscountReais = (originalPrice * pointsConfig.maxDiscountPercentage) / 100;
  // Máximo de pontos que podem ser aplicados
  const maxPointsApplicable = Math.floor(maxDiscountReais / (pointsConfig.pointsToReaisRatio || 0.1));

  let pointsRequested = desiredPointsToUse !== undefined ? desiredPointsToUse : userPoints;
  pointsRequested = Math.min(pointsRequested, userPoints, maxPointsApplicable);

  if (pointsRequested < pointsConfig.minPointsToRedeem) {
    return {
      eligible: false,
      pointsToUse: 0,
      discountReais: 0,
      finalPrice: originalPrice,
      message: `Mínimo de ${pointsConfig.minPointsToRedeem} points.`
    };
  }

  const discountReais = Number((pointsRequested * pointsConfig.pointsToReaisRatio).toFixed(2));
  const finalPrice = Math.max(0, Number((originalPrice - discountReais).toFixed(2)));

  return {
    eligible: true,
    pointsToUse: pointsRequested,
    discountReais,
    finalPrice
  };
}

/**
 * Converte segundos em formato hh:mm:ss ou mm:ss
 */
export function formatTimeSeconds(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hrs > 0) {
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Calcula o ritmo médio (pace) no formato mm:ss min/km
 */
export function calculatePace(timeSeconds: number, distanceKm: number): string {
  if (distanceKm <= 0 || timeSeconds <= 0) return '00:00 min/km';
  const paceSecondsPerKm = timeSeconds / distanceKm;
  const mins = Math.floor(paceSecondsPerKm / 60);
  const secs = Math.floor(paceSecondsPerKm % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')} min/km`;
}

/**
 * Formata o nome do participante respeitando as configurações de privacidade do ranking.
 */
export function formatRankingDisplayName(
  fullName: string,
  privacy: RankingDisplayPrivacy,
  bibNumber: string,
  nickname?: string
): string {
  switch (privacy) {
    case 'primeiro_nome': {
      const parts = fullName.trim().split(' ');
      return parts[0] || fullName;
    }
    case 'apelido': {
      return nickname ? `@${nickname.replace(/^@/, '')}` : (fullName.trim().split(' ')[0] || fullName);
    }
    case 'participante_anonimo': {
      return `Atleta MerMi #${bibNumber}`;
    }
    case 'nome_completo':
    default:
      return fullName;
  }
}

/**
 * Gera código de certificado autêntico
 */
export function generateCertificateCode(registrationId: string, eventId: string): string {
  const hash = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `CERT-MR-${eventId.toUpperCase()}-${hash}`;
}

/**
 * Gera relatório financeiro consolidado de um evento do MerMi Run
 */
export function calculateEventFinancialReport(
  event: RaceEvent,
  registrations: RaceRegistration[]
): RaceFinancialReport {
  const eventRegistrations = registrations.filter((r) => r.eventId === event.id);

  let totalRegistrations = eventRegistrations.length;
  let paidRegistrations = 0;
  let freeRegistrations = 0;
  let grossRevenue = 0;
  let totalPointsUsedDiscount = 0;
  let netRevenue = 0;
  let totalPointsIssued = 0;
  let checkInPresentCount = 0;
  let checkInAbsentCount = 0;
  let completionCount = 0;

  for (const reg of eventRegistrations) {
    if (reg.finalPricePaid > 0) {
      paidRegistrations++;
    } else {
      freeRegistrations++;
    }

    grossRevenue += reg.originalPrice;
    totalPointsUsedDiscount += reg.discountFromPoints;
    netRevenue += reg.finalPricePaid;
    totalPointsIssued += (reg.pointsEarnedOnRegistration || 0) + (reg.pointsEarnedOnCompletion || 0);

    if (reg.checkInStatus === 'presente') {
      checkInPresentCount++;
    } else {
      checkInAbsentCount++;
    }

    if (reg.completed) {
      completionCount++;
    }
  }

  const completionRatePercent =
    totalRegistrations > 0 ? Math.round((completionCount / totalRegistrations) * 100) : 0;

  return {
    eventId: event.id,
    eventName: event.name,
    totalRegistrations,
    paidRegistrations,
    freeRegistrations,
    grossRevenue: Number(grossRevenue.toFixed(2)),
    totalPointsUsedDiscount: Number(totalPointsUsedDiscount.toFixed(2)),
    netRevenue: Number(netRevenue.toFixed(2)),
    totalPointsIssued,
    checkInPresentCount,
    checkInAbsentCount,
    completionCount,
    completionRatePercent
  };
}
