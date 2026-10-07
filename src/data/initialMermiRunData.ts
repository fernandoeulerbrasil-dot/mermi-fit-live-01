import {
  RaceEvent,
  RaceKitItem,
  RaceRegistration,
  VirtualChallengeProgress,
  RankingEntry
} from '../types/mermiRun';

export const INITIAL_RACE_KITS: RaceKitItem[] = [
  {
    id: 'kit_sem_kit',
    name: 'Sem Kit (Econômico)',
    type: 'sem_kit',
    title: 'Apenas Participação Oficial',
    description: 'Acesso completo ao percurso com cronometragem eletrônica e hidratação nos postos da prova.',
    itemsIncluded: ['Número de Peito com Chip', 'Hidratação no Percurso', 'Medalha Finisher (Pós-Prova)'],
    extraPrice: 0,
    includesShirt: false,
    active: true
  },
  {
    id: 'kit_basico',
    name: 'Kit Básico',
    type: 'kit_basico',
    title: 'Kit Essencial do Corredor',
    description: 'Itens essenciais para competir e cruzar a linha de chegada com estilo.',
    itemsIncluded: [
      'Camiseta Tecnológica MerMi Run',
      'Número de Peito com Chip',
      'Medalha Finisher Oficial',
      'Hidratação e Frutas na Chegada'
    ],
    extraPrice: 20,
    includesShirt: true,
    active: true
  },
  {
    id: 'kit_oficial',
    name: 'Kit Oficial MerMi',
    type: 'kit_oficial',
    title: 'Kit Completo do Circuito',
    description: 'O kit mais escolhido pela comunidade: inclui camiseta respirável, sacochila esportiva e voucher pós-prova.',
    itemsIncluded: [
      'Camiseta Tecnológica Poliamida Anti-Suor',
      'Sacola Esportiva Impermeável MerMi',
      'Número de Peito com Chip Descartável',
      'Medalha de Metal Pesado Colecionável',
      '1x Marmita Fit Pós-Treino Cortesia',
      'Isotônico e Kit Frutas'
    ],
    extraPrice: 45,
    includesShirt: true,
    active: true
  },
  {
    id: 'kit_premium',
    name: 'Kit Premium Fit',
    type: 'kit_premium',
    title: 'Experiência Completa do Atleta',
    description: 'Para quem busca máxima performance e conforto no dia da prova.',
    itemsIncluded: [
      'Camiseta Pro Dry-Fit Edição Limitada',
      'Viseira Esportiva MerMi Run',
      'Mochila Sacola Reforçada com Zíper',
      'Número de Peito com Chip Cronometragem',
      'Medalha Finisher Exclusiva em Alto Relevo',
      '2x Marmitas Fit Gourmet na Tenda VIP',
      'Acesso à Área de Massagem & Fisioterapia',
      'Garrafa Térmica MerMi 600ml'
    ],
    extraPrice: 85,
    includesShirt: true,
    active: true
  },
  {
    id: 'kit_vip',
    name: 'Kit VIP All-Inclusive',
    type: 'kit_vip',
    title: 'Lounge VIP & Benefícios Exclusivos',
    description: 'Largada prioritária no pelotão de elite, lounge exclusivo com buffet fit e fotos profissionais dedicadas.',
    itemsIncluded: [
      'Largada Pelotão de Elite / VIP',
      'Camiseta Oficial + Regata de Treino',
      'Mochila Térmica MerMi Points Oficial',
      'Acesso ao Lounge VIP com Buffet Nutricional',
      'Serviço de Guarda-Volumes VIP Exclusivo',
      'Pack de Fotos Profissionais Gratuitas',
      'Gravação Personalizada do Nome na Medalha'
    ],
    extraPrice: 150,
    includesShirt: true,
    active: true
  }
];

export const INITIAL_RACE_EVENTS: RaceEvent[] = [
  {
    id: 'ev_circuito_mermi_2026',
    name: 'Circuito MerMi Life 5K & 10K',
    slug: 'circuito-mermi-life-5k-10k',
    description: 'A prova mais esperada da temporada! Um percurso arborizado e rápido no coração do Parque Ibirapuera, unindo nutrição saudável, superação esportiva e celebração coletiva.',
    shortDescription: 'Percurso plano e rápido no Ibirapuera com tenda fit oficial e medalha de metal.',
    eventType: 'corrida_paga',
    status: 'inscricoes_abertas',
    date: '28 de Outubro de 2026',
    time: '07:00',
    locationName: 'Parque Ibirapuera - Portão 10',
    address: 'Av. Pedro Álvares Cabral, s/n',
    city: 'São Paulo',
    state: 'SP',
    totalSpots: 1200,
    filledSpots: 840,
    registrationStartDate: '2026-08-01',
    registrationEndDate: '2026-10-25',
    minAge: 16,
    categories: [
      {
        id: 'cat_5k',
        name: '5K Geral (Caminhada & Corrida)',
        distanceKm: 5,
        distanceLabel: '5K',
        minAge: 16,
        maxParticipants: 700,
        currentParticipants: 512,
        batches: [
          { batchNumber: 1, name: '1º Lote Antecipado', price: 49.90, availableSpots: 400, soldSpots: 400 },
          { batchNumber: 2, name: '2º Lote Oficial', price: 69.90, availableSpots: 200, soldSpots: 112 },
          { batchNumber: 3, name: '3º Lote Final', price: 89.90, availableSpots: 100, soldSpots: 0 }
        ],
        allowedKits: ['kit_sem_kit', 'kit_basico', 'kit_oficial', 'kit_premium'],
        pointsOnRegistration: 30,
        pointsOnCheckIn: 20,
        pointsOnCompletion: 50,
        active: true
      },
      {
        id: 'cat_10k',
        name: '10K Superação & Performance',
        distanceKm: 10,
        distanceLabel: '10K',
        minAge: 18,
        maxParticipants: 500,
        currentParticipants: 328,
        batches: [
          { batchNumber: 1, name: '1º Lote Antecipado', price: 64.90, availableSpots: 300, soldSpots: 300 },
          { batchNumber: 2, name: '2º Lote Oficial', price: 84.90, availableSpots: 150, soldSpots: 28 },
          { batchNumber: 3, name: '3º Lote Final', price: 104.90, availableSpots: 50, soldSpots: 0 }
        ],
        allowedKits: ['kit_basico', 'kit_oficial', 'kit_premium', 'kit_vip'],
        pointsOnRegistration: 50,
        pointsOnCheckIn: 30,
        pointsOnCompletion: 100,
        active: true
      }
    ],
    kits: INITIAL_RACE_KITS,
    pointsConfig: {
      pointsRewardRegistration: 40,
      pointsRewardCheckIn: 25,
      pointsRewardCompletion: 75,
      allowPointsDiscount: true,
      pointsToReaisRatio: 0.10, // 100 points = R$ 10,00
      minPointsToRedeem: 50,
      maxDiscountPercentage: 40 // até 40% de desconto com Points
    },
    communication: {
      notice: 'Retirada de kits na Loja Conceito MerMi nos dias 26 e 27 de Outubro.',
      schedule: [
        { time: '06:00', title: 'Abertura da Arena e Guarda-Volumes', description: 'Ativação das tendas e massoterapia' },
        { time: '06:40', title: 'Aquecimento Guiado com Educador Físico', description: 'Mobilidade articular e ativação neuromuscular' },
        { time: '07:00', title: 'Largada Oficial 10K', description: 'Pelotão de elite e geral' },
        { time: '07:15', title: 'Largada Oficial 5K', description: 'Corredores e caminhantes' },
        { time: '08:45', title: 'Cerimônia de Premiação no Palco', description: 'Entrega de troféus aos 5 primeiros colocados' },
        { time: '09:30', title: 'Show Acústico e Degustação Fit', description: 'Marmitas, sucos naturais e música ao vivo' }
      ],
      kitPickupLocation: 'Espaço Conceito MerMi Fit · Shopping Ibirapuera, Piso 2',
      kitPickupDates: '26/10 (Sexta) das 10h às 21h e 27/10 (Sábado) das 10h às 19h',
      kitPickupInstructions: 'Apresentar documento oficial com foto e comprovante de inscrição digital (no app). Não haverá entrega de kit no dia da corrida.',
      startLocation: 'Praça da Paz · Parque Ibirapuera',
      startInstructions: 'Acesso preferencial pelo Portão 10. Chegue com pelo menos 45 minutos de antecedência.',
      finishLocation: 'Praça da Paz · Pórtico Oficial MerMi Run',
      finishInstructions: 'Retire sua medalha finisher e seu kit lanche na tenda de dispersão.',
      courseDescription: 'Percurso 100% asfaltado e sinalizado a cada quilômetro. Postos de hidratação na marca de 2.5K, 5K e 7.5K.',
      courseElevation: 'Altimetria suave: +28m de ganho de elevação ao longo de 10km.',
      rulesSummary: 'Obrigatório uso do número de peito visível na frente da camiseta durante todo o trajeto.',
      fullRegulationUrl: '#',
      contactEmail: 'corrida@mermifit.com.br',
      contactPhone: '(11) 98765-4321'
    },
    isVirtual: false,
    featured: true,
    active: true,
    certificateEnabled: true,
    tags: ['Oficial', 'Ibirapuera', '5K', '10K', 'Medalha'],
    createdAt: '2026-08-01'
  },
  {
    id: 'ev_night_run_santos',
    name: 'Night Run Sunset MerMi 6K',
    slug: 'night-run-sunset-mermi-6k',
    description: 'Corra sob o pôr do sol na orla mais bonita do litoral paulista, com iluminação neon, música eletrônica ao vivo e brisa do mar.',
    shortDescription: 'Corrida noturna na orla de Santos com kit pulseira LED e marmita fit na praia.',
    eventType: 'corrida_paga',
    status: 'inscricoes_abertas',
    date: '15 de Novembro de 2026',
    time: '18:30',
    locationName: 'Praia do Gonzaga - Posto 4',
    address: 'Av. Vicente de Carvalho, s/n',
    city: 'Santos',
    state: 'SP',
    totalSpots: 800,
    filledSpots: 430,
    registrationStartDate: '2026-09-01',
    registrationEndDate: '2026-11-10',
    minAge: 16,
    categories: [
      {
        id: 'cat_6k_night',
        name: '6K Sunset Run',
        distanceKm: 6,
        distanceLabel: '6K',
        minAge: 16,
        maxParticipants: 800,
        currentParticipants: 430,
        batches: [
          { batchNumber: 1, name: '1º Lote Sunset', price: 59.90, availableSpots: 500, soldSpots: 430 },
          { batchNumber: 2, name: '2º Lote Lua Cheia', price: 79.90, availableSpots: 300, soldSpots: 0 }
        ],
        allowedKits: ['kit_basico', 'kit_oficial', 'kit_premium'],
        pointsOnRegistration: 35,
        pointsOnCheckIn: 25,
        pointsOnCompletion: 60,
        active: true
      }
    ],
    kits: INITIAL_RACE_KITS,
    pointsConfig: {
      pointsRewardRegistration: 35,
      pointsRewardCheckIn: 25,
      pointsRewardCompletion: 60,
      allowPointsDiscount: true,
      pointsToReaisRatio: 0.10,
      minPointsToRedeem: 50,
      maxDiscountPercentage: 35
    },
    communication: {
      notice: 'Uso de pulseira LED de segurança inclusa no kit para todos os corredores.',
      schedule: [
        { time: '17:30', title: 'Concentração na Praia', description: 'DJ Sunset e alongamento dinâmico' },
        { time: '18:30', title: 'Largada Oficial', description: 'Direção Ponta da Praia com retorno no Gonzaga' },
        { time: '19:45', title: 'Lual Fit e Premiação', description: 'Mesa de frutas tropicais e marmitas refrescantes' }
      ],
      kitPickupLocation: 'Arena MerMi Praia · Posto 4 Gonzaga',
      kitPickupDates: '14/11 das 14h às 20h e 15/11 das 10h às 16h',
      kitPickupInstructions: 'Retirada no container oficial na praia com apresentação de QR code no app.',
      startLocation: 'Areia da Praia · Em frente ao Posto 4',
      startInstructions: 'Largada em ondas espaçadas de 2 minutos para fluidez do percurso.',
      finishLocation: 'Areia da Praia · Pórtico Neon',
      finishInstructions: 'Receba sua medalha reluzente e sua marmita gelada do pós-treino.',
      courseDescription: 'Percurso plano pela ciclovia e calçadão iluminado da orla.',
      rulesSummary: 'Corrida participativa e cronometrada.',
      contactEmail: 'santos@mermifit.com.br'
    },
    isVirtual: false,
    featured: false,
    active: true,
    certificateEnabled: true,
    tags: ['Noturna', 'Praia', 'Sunset', '6K'],
    createdAt: '2026-09-01'
  },
  {
    id: 'ev_solidaria_3k',
    name: 'Corrida & Caminhada Solidária 3K',
    slug: 'corrida-caminhada-solidaria-3k',
    description: 'Inscrição 100% gratuita! Venha celebrar o movimento e a saúde com sua família. Para participar, basta doar 1kg de alimento não perecível na retirada do número de peito.',
    shortDescription: 'Evento gratuito de conscientização e saúde preventiva para toda a família.',
    eventType: 'corrida_gratuita',
    status: 'inscricoes_abertas',
    date: '06 de Dezembro de 2026',
    time: '08:00',
    locationName: 'Parque Villa-Lobos',
    address: 'Av. Prof. Fonseca Rodrigues, 2001',
    city: 'São Paulo',
    state: 'SP',
    totalSpots: 500,
    filledSpots: 310,
    registrationStartDate: '2026-10-01',
    registrationEndDate: '2026-12-01',
    minAge: 12,
    categories: [
      {
        id: 'cat_3k_solidario',
        name: '3K Família & Solidariedade',
        distanceKm: 3,
        distanceLabel: '3K',
        minAge: 12,
        maxParticipants: 500,
        currentParticipants: 310,
        batches: [
          { batchNumber: 1, name: 'Inscrição Gratuita Solidária', price: 0, availableSpots: 500, soldSpots: 310 }
        ],
        allowedKits: ['kit_sem_kit', 'kit_basico'],
        pointsOnRegistration: 20,
        pointsOnCheckIn: 20,
        pointsOnCompletion: 30,
        active: true
      }
    ],
    kits: INITIAL_RACE_KITS.filter((k) => k.type === 'sem_kit' || k.type === 'kit_basico'),
    pointsConfig: {
      pointsRewardRegistration: 20,
      pointsRewardCheckIn: 20,
      pointsRewardCompletion: 30,
      allowPointsDiscount: false,
      pointsToReaisRatio: 0,
      minPointsToRedeem: 0,
      maxDiscountPercentage: 0
    },
    communication: {
      notice: 'Leve 1kg de alimento não perecível para doação comunitária.',
      schedule: [
        { time: '07:15', title: 'Concentração e Doações', description: 'Recepção de alimentos para o Fundo Social' },
        { time: '08:00', title: 'Largada da Família', description: 'Ritmo livre para caminhar ou trotar' },
        { time: '09:00', title: 'Aulão Funcional Fit', description: 'Atividade aberta para todas as idades' }
      ],
      kitPickupLocation: 'Tenda Social MerMi · Portão Principal Villa-Lobos',
      kitPickupDates: '06/12 das 06h30 às 07h45 (no próprio dia)',
      kitPickupInstructions: 'Entregar o alimento na mesa de credenciamento para retirada do número de peito.',
      startLocation: 'Esplanada do Parque Villa-Lobos',
      startInstructions: 'Trilha interna asfaltada do parque.',
      finishLocation: 'Esplanada do Parque Villa-Lobos',
      finishInstructions: 'Medalha comemorativa para todos os concluintes.',
      courseDescription: 'Percurso plano ao redor do lago e alamedas floridas do parque.',
      rulesSummary: 'Evento sem caráter competitivo estrito.',
      contactEmail: 'social@mermifit.com.br'
    },
    isVirtual: false,
    featured: false,
    active: true,
    certificateEnabled: true,
    tags: ['Gratuita', 'Solidária', 'Família', '3K'],
    createdAt: '2026-10-01'
  },
  {
    id: 'ev_desafio_virtual_10k',
    name: 'Desafio Virtual MerMi Run 10K',
    slug: 'desafio-virtual-mermi-run-10k',
    description: 'Corra onde e quando quiser! Acumule 10km em suas corridas de treino pelo bairro, parque ou esteira da academia para desbloquear a Medalha Digital e +100 MerMi Points.',
    shortDescription: 'Acumule 10km nas suas atividades e receba conquista + MerMi Points imediatos.',
    eventType: 'desafio_virtual',
    status: 'inscricoes_abertas',
    date: 'Disponível o mês todo',
    time: 'Horário Livre',
    locationName: 'Qualquer Lugar (GPS / Esteira / Parque)',
    address: 'Ambiente Virtual',
    city: 'Brasil',
    state: 'BR',
    totalSpots: 5000,
    filledSpots: 1420,
    registrationStartDate: '2026-01-01',
    registrationEndDate: '2026-12-31',
    minAge: 14,
    categories: [
      {
        id: 'cat_virtual_10k',
        name: 'Desafio Virtual 10K Acumulados',
        distanceKm: 10,
        distanceLabel: '10K',
        minAge: 14,
        maxParticipants: 5000,
        currentParticipants: 1420,
        batches: [
          { batchNumber: 1, name: 'Inscrição Gratuita no Desafio', price: 0, availableSpots: 5000, soldSpots: 1420 }
        ],
        allowedKits: ['kit_sem_kit'],
        pointsOnRegistration: 15,
        pointsOnCheckIn: 0,
        pointsOnCompletion: 100,
        active: true
      }
    ],
    kits: [INITIAL_RACE_KITS[0]],
    pointsConfig: {
      pointsRewardRegistration: 15,
      pointsRewardCheckIn: 0,
      pointsRewardCompletion: 100,
      allowPointsDiscount: false,
      pointsToReaisRatio: 0,
      minPointsToRedeem: 0,
      maxDiscountPercentage: 0
    },
    communication: {
      notice: 'Sincronize ou registre seus treinos para somar quilômetros no marcador.',
      schedule: [{ time: '24h', title: 'Período Contínuo', description: 'Validação automática ou manual de quilômetros' }],
      kitPickupLocation: '100% Digital',
      kitPickupDates: 'Disponível Imediatamente',
      kitPickupInstructions: 'Sua medalha digital e pontos são creditados na hora da conclusão.',
      startLocation: 'Sua rota de treino',
      startInstructions: 'Ligue seu smartwatch ou app favorito.',
      finishLocation: 'App MerMi Fit Life',
      finishInstructions: 'Clique em concluir ao atingir os 10km.',
      courseDescription: 'Livre escolha do atleta.',
      rulesSummary: 'Quilometragem acumulada em até 30 dias a partir da inscrição.',
      contactEmail: 'desafios@mermifit.com.br'
    },
    isVirtual: true,
    featured: true,
    active: true,
    certificateEnabled: true,
    tags: ['Virtual', 'Desafio', '10K', 'Livre'],
    createdAt: '2026-01-01'
  }
];

export const INITIAL_USER_REGISTRATIONS: RaceRegistration[] = [];

export const INITIAL_VIRTUAL_CHALLENGES: VirtualChallengeProgress[] = [
  {
    id: 'vcp_1',
    challengeId: 'ev_desafio_virtual_10k',
    title: 'Desafio Virtual MerMi Run 10K',
    userId: 'usr_fernando',
    targetKm: 10,
    currentKm: 7.4,
    percentage: 74,
    pointsReward: 100,
    status: 'em_andamento',
    deadline: 'Ativo este mês',
    activitiesCount: 3,
    lastActivityDate: 'Ontem'
  }
];

export const INITIAL_LEADERBOARD: RankingEntry[] = [
  {
    rank: 1,
    registrationId: 'REG-2026-0001',
    participantName: 'Lucas Albuquerque',
    displayName: 'Lucas Albuquerque',
    privacy: 'nome_completo',
    bibNumber: '0001',
    categoryName: '10K Elite',
    distanceLabel: '10K',
    timeFormatted: '00:32:15',
    paceFormatted: '03:13 min/km',
    timeSeconds: 1935,
    pointsEarned: 150
  },
  {
    rank: 2,
    registrationId: 'REG-2026-0004',
    participantName: 'Marcos Vinícius Silva',
    displayName: '@marcos.runner',
    privacy: 'apelido',
    bibNumber: '0004',
    categoryName: '10K Elite',
    distanceLabel: '10K',
    timeFormatted: '00:34:02',
    paceFormatted: '03:24 min/km',
    timeSeconds: 2042,
    pointsEarned: 130
  },
  {
    rank: 3,
    registrationId: 'REG-2026-0021',
    participantName: 'Juliana Paes Moreira',
    displayName: 'Juliana P.',
    privacy: 'primeiro_nome',
    bibNumber: '0021',
    categoryName: '10K Geral',
    distanceLabel: '10K',
    timeFormatted: '00:36:45',
    paceFormatted: '03:40 min/km',
    timeSeconds: 2205,
    pointsEarned: 110
  },
  {
    rank: 4,
    registrationId: 'REG-2026-0842',
    participantName: 'Fernando Euler',
    displayName: 'Fernando Euler',
    privacy: 'nome_completo',
    bibNumber: '0482',
    categoryName: '10K Superação & Performance',
    distanceLabel: '10K',
    timeFormatted: '00:44:18',
    paceFormatted: '04:25 min/km',
    timeSeconds: 2658,
    pointsEarned: 100,
    isCurrentUser: true
  },
  {
    rank: 5,
    registrationId: 'REG-2026-0155',
    participantName: 'Roberto Carvalho',
    displayName: 'Atleta MerMi #0155',
    privacy: 'participante_anonimo',
    bibNumber: '0155',
    categoryName: '10K Geral',
    distanceLabel: '10K',
    timeFormatted: '00:46:12',
    paceFormatted: '04:37 min/km',
    timeSeconds: 2772,
    pointsEarned: 90
  }
];
