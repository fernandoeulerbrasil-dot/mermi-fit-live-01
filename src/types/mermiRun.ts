export type RaceEventType = 'corrida_gratuita' | 'corrida_paga' | 'desafio_virtual' | 'evento_especial';

export type RaceEventStatus =
  | 'rascunho'
  | 'inscricoes_abertas'
  | 'inscricoes_encerradas'
  | 'lotado'
  | 'evento_em_andamento'
  | 'finalizado'
  | 'cancelado';

export interface RaceBatchPrice {
  batchNumber: number;
  name: string; // ex: '1º Lote', '2º Lote Promocional'
  price: number; // R$
  availableSpots: number;
  soldSpots: number;
  startDate?: string;
  endDate?: string;
}

export type ShirtSize = 'Baby Look P' | 'Baby Look M' | 'Baby Look G' | 'P' | 'M' | 'G' | 'GG' | 'XG' | 'Sem Camiseta';

export type KitType = 'sem_kit' | 'kit_basico' | 'kit_oficial' | 'kit_premium' | 'kit_vip';

export interface RaceKitItem {
  id: string;
  name: string;
  type: KitType;
  title: string;
  description: string;
  itemsIncluded: string[]; // ex: ['Camiseta Dry-Fit', 'Medalha Finisher', 'Número de Peito com Chip', 'Sacola Esportiva', 'Barra Proteica MerMi', 'Isotônico']
  extraPrice: number; // Preço adicional ou embutido
  includesShirt: boolean;
  active: boolean;
  assetRefId?: string;
}

export interface RaceCategory {
  id: string;
  name: string; // ex: '3K Caminhada & Corrida', '5K Geral', '10K Elite', '21K Meia Maratona'
  distanceKm: number; // ex: 3, 5, 10, 21. Configuração flexível!
  distanceLabel: string; // ex: '3K', '5K', '10K', '15K', '21K'
  minAge?: number;
  maxParticipants: number;
  currentParticipants: number;
  batches: RaceBatchPrice[];
  allowedKits: string[]; // IDs de RaceKitItem permitidos
  pointsOnRegistration: number;
  pointsOnCheckIn: number;
  pointsOnCompletion: number;
  active: boolean;
}

export interface RacePointsConfig {
  pointsRewardRegistration: number;
  pointsRewardCheckIn: number;
  pointsRewardCompletion: number;
  allowPointsDiscount: boolean;
  pointsToReaisRatio: number; // ex: 100 pontos = R$ 10,00 -> ratio = 0.10 (R$ 0,10 por ponto)
  minPointsToRedeem: number; // ex: 50 pontos mínimo
  maxDiscountPercentage: number; // ex: 50% do valor da inscrição
}

export interface RaceEventCommunication {
  notice?: string;
  schedule: Array<{ time: string; title: string; description?: string }>;
  kitPickupLocation: string;
  kitPickupDates: string;
  kitPickupInstructions: string;
  startLocation: string;
  startInstructions: string;
  finishLocation: string;
  finishInstructions: string;
  courseDescription: string;
  courseElevation?: string;
  rulesSummary: string;
  fullRegulationUrl?: string;
  contactEmail: string;
  contactPhone?: string;
}

export interface RaceEvent {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  eventType: RaceEventType;
  status: RaceEventStatus;
  
  // Data e Local
  date: string; // ex: '2026-10-28' ou '28 de Outubro de 2026'
  time: string; // ex: '07:00'
  locationName: string; // ex: 'Parque Ibirapuera'
  address: string; // ex: 'Av. Pedro Álvares Cabral, s/n'
  city: string; // ex: 'São Paulo'
  state: string; // ex: 'SP'
  
  // Vagas e Capacidade
  totalSpots: number;
  filledSpots: number;
  registrationStartDate: string;
  registrationEndDate: string;
  minAge: number;
  
  // Categorias e Distâncias (Configuráveis)
  categories: RaceCategory[];
  
  // Kits disponíveis para a corrida
  kits: RaceKitItem[];
  
  // Regras de Points & Descontos
  pointsConfig: RacePointsConfig;
  
  // Comunicação da Prova
  communication: RaceEventCommunication;
  
  // Imagens & Assets oficiais
  bannerUrl?: string;
  courseMapUrl?: string;
  medalAssetUrl?: string;
  assetFolder?: string; // ex: '/assets/corrida/eventos/circuito_mermi_2026'
  
  // Configurações Adicionais
  isVirtual: boolean;
  featured: boolean;
  active: boolean;
  certificateEnabled: boolean;
  tags?: string[];
  createdAt: string;
}

export type RegistrationPaymentStatus = 'gratuito' | 'pago' | 'pendente' | 'cancelado' | 'estornado';
export type ParticipantCheckInStatus = 'ausente' | 'presente' | 'desistente';

export interface RaceRegistration {
  id: string; // ex: 'REG-2026-0941'
  eventId: string;
  eventName: string;
  eventDate: string;
  eventLocation: string;
  categoryId: string;
  categoryName: string;
  distanceLabel: string;
  distanceKm: number;
  
  // Dados do Participante
  userId: string;
  participantName: string;
  participantDocument: string; // CPF ou RG
  participantBirthDate?: string;
  participantEmail: string;
  participantPhone: string;
  shirtSize?: ShirtSize;
  
  // Kit Escolhido
  kitId: string;
  kitName: string;
  kitType: KitType;
  
  // Número de Peito e Chip
  bibNumber: string; // ex: '0482'
  chipCode?: string;
  
  // Financeiro & Points
  originalPrice: number;
  discountFromPoints: number;
  pointsUsed: number;
  finalPricePaid: number;
  paymentMethod: 'gratuito' | 'pix' | 'cartao' | 'dinheiro';
  paymentStatus: RegistrationPaymentStatus;
  pointsEarnedOnRegistration: number;
  
  // Status da Inscrição & Check-in
  status: 'confirmada' | 'cancelada' | 'concluida';
  checkInStatus: ParticipantCheckInStatus;
  checkInAt?: string;
  checkInAdmin?: string;
  
  // Resultado Concluído
  completed: boolean;
  completedAt?: string;
  timeSeconds?: number;
  timeFormatted?: string; // ex: '00:24:32'
  paceFormatted?: string; // ex: '04:54 min/km'
  overallRank?: number;
  categoryRank?: number;
  pointsEarnedOnCompletion?: number;
  
  // Certificado
  certificateCode?: string;
  
  registrationDate: string;
  acceptedRegulation: boolean;
}

export interface VirtualChallengeProgress {
  id: string;
  challengeId: string;
  title: string;
  userId: string;
  targetKm: number;
  currentKm: number;
  percentage: number;
  pointsReward: number;
  status: 'em_andamento' | 'concluido' | 'resgatado';
  deadline: string;
  activitiesCount: number;
  lastActivityDate?: string;
}

export type RankingDisplayPrivacy = 'nome_completo' | 'primeiro_nome' | 'apelido' | 'participante_anonimo';

export interface RankingEntry {
  rank: number;
  registrationId: string;
  participantName: string;
  displayName: string;
  privacy: RankingDisplayPrivacy;
  bibNumber: string;
  categoryName: string;
  distanceLabel: string;
  timeFormatted: string;
  paceFormatted: string;
  timeSeconds: number;
  pointsEarned: number;
  isCurrentUser?: boolean;
}

export type RankingType = 'tempo' | 'distancia' | 'participacao' | 'points';

export interface RaceFinancialReport {
  eventId: string;
  eventName: string;
  totalRegistrations: number;
  paidRegistrations: number;
  freeRegistrations: number;
  grossRevenue: number;
  totalPointsUsedDiscount: number;
  netRevenue: number;
  totalPointsIssued: number;
  checkInPresentCount: number;
  checkInAbsentCount: number;
  completionCount: number;
  completionRatePercent: number;
}
