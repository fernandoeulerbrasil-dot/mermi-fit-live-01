import {
  BadgeAchievement,
  EarningRuleConfig,
  GamificationMission,
  PointTransaction,
  StreakRecord,
  UserLevelConfig
} from '../types/gamification';

export const INITIAL_USER_LEVELS: UserLevelConfig[] = [
  {
    levelNumber: 1,
    name: 'Cliente Foco',
    minPoints: 0,
    benefits: [
      'Acesso ao catálogo semanal de resgates',
      'Elegibilidade a Drops Surpresa',
      'Extrato detalhado de transações'
    ],
    badgeIcon: '🎯',
    badgeColor: '#0EB24A',
    description: 'Primeiros passos na consistência saudável e alimentação balanceada.',
    active: true
  },
  {
    levelNumber: 2,
    name: 'Cliente Constante',
    minPoints: 250,
    benefits: [
      'Todos os benefícios do Nível 1',
      'Desconto exclusivo de 5% em pedidos recorrentes',
      'Prioridade na fila de entrega expressa',
      'Acesso antecipado aos Drops Relâmpago'
    ],
    badgeIcon: '🔥',
    badgeColor: '#F59E0B',
    description: 'Hábito alimentar consolidado com pedidos regulares e constância comprovada.',
    active: true
  },
  {
    levelNumber: 3,
    name: 'Cliente Evolução',
    minPoints: 500,
    benefits: [
      'Todos os benefícios do Nível 2',
      '1x Frete Grátis mensal garantido',
      'Acesso a brindes esportivos e acessórios exclusivos',
      'Bônus de +10% em missões especiais'
    ],
    badgeIcon: '⚡',
    badgeColor: '#3B82F6',
    description: 'Evolução corporal e física visível com integração a treinos e corridas.',
    active: true
  },
  {
    levelNumber: 4,
    name: 'Cliente Destaque',
    minPoints: 1000,
    benefits: [
      'Todos os benefícios do Nível 3',
      'Convite VIP para provas e treinos do MerMi Run',
      'Elegibilidade ao Membro da Semana',
      'Bônus multiplicador de 1.2x em todos os pedidos'
    ],
    badgeIcon: '⭐',
    badgeColor: '#EC4899',
    description: 'Referência inspiradora na comunidade com altíssimo engajamento.',
    active: true
  },
  {
    levelNumber: 5,
    name: 'Cliente Elite',
    minPoints: 2000,
    benefits: [
      'Todos os benefícios do Nível 4',
      'Degustação antecipada do menu sazonal do Chef Fit',
      'Bolsa Térmica MerMi Points oficial de presente',
      'Canal direto e prioritário de atendimento VIP'
    ],
    badgeIcon: '👑',
    badgeColor: '#EAB308',
    description: 'O topo da fidelidade e estilo de vida saudável do ecossistema MerMi Fit Life.',
    active: true
  }
];

export const INITIAL_EARNING_RULES: EarningRuleConfig[] = [
  {
    id: 'rule_compra_marmita',
    actionKey: 'compra_marmita',
    name: 'Marmita Pedida',
    description: 'Pontos creditados automaticamente para cada marmita confirmada no pedido.',
    pointsAmount: 10,
    calculationType: 'por_marmita',
    category: 'compras',
    active: true
  },
  {
    id: 'rule_primeira_compra',
    actionKey: 'primeira_compra',
    name: 'Primeira Compra (Boas-vindas)',
    description: 'Bônus exclusivo creditado no primeiro pedido realizado no app.',
    pointsAmount: 50,
    calculationType: 'fixo',
    category: 'compras',
    active: true
  },
  {
    id: 'rule_compra_recorrente',
    actionKey: 'compra_recorrente',
    name: 'Compra Recorrente Semanal',
    description: 'Bônus para clientes que pedem ao menos uma vez por semana sem interrupção.',
    pointsAmount: 20,
    calculationType: 'fixo',
    category: 'compras',
    active: true
  },
  {
    id: 'rule_indicacao',
    actionKey: 'indicacao',
    name: 'Indicação de Amigo',
    description: 'Ganhe quando seu amigo indicado realizar o primeiro pedido de marmitas.',
    pointsAmount: 25,
    calculationType: 'fixo',
    category: 'comunidade',
    active: true
  },
  {
    id: 'rule_desafio_concluido',
    actionKey: 'desafio_concluido',
    name: 'Desafio Concluído',
    description: 'Cumprimento de desafios esportivos ou nutricionais semanais.',
    pointsAmount: 50,
    calculationType: 'fixo',
    category: 'esportes',
    active: true
  },
  {
    id: 'rule_corrida_concluida',
    actionKey: 'corrida_concluida',
    name: 'Corrida Concluída (MerMi Run)',
    description: 'Participação e validação de conclusão em provas de rua ou corrida registrada.',
    pointsAmount: 100,
    calculationType: 'fixo',
    category: 'esportes',
    active: true
  },
  {
    id: 'rule_inscricao_corrida',
    actionKey: 'inscricao_corrida',
    name: 'Inscrição em Corrida Oficial',
    description: 'Pontos imediatos ao se inscrever em provas parceiras do circuito MerMi Run.',
    pointsAmount: 30,
    calculationType: 'fixo',
    category: 'esportes',
    active: true
  },
  {
    id: 'rule_meta_passos',
    actionKey: 'meta_passos',
    name: 'Meta de Passos Diária (8.000+)',
    description: 'Bata a meta diária de passos conectada ao Apple Health, Google Fit ou registro manual.',
    pointsAmount: 15,
    calculationType: 'fixo',
    category: 'habitos',
    active: true
  },
  {
    id: 'rule_streak_7',
    actionKey: 'streak_7_dias',
    name: 'Sequência de Fogo (7 Dias)',
    description: 'Bônus especial por 7 dias ininterruptos de hábitos saudáveis cumpridos.',
    pointsAmount: 50,
    calculationType: 'fixo',
    category: 'habitos',
    active: true
  },
  {
    id: 'rule_streak_14',
    actionKey: 'streak_14_dias',
    name: 'Sequência Avançada (14 Dias)',
    description: 'Bônus por 14 dias de constância sem furar a rotina.',
    pointsAmount: 100,
    calculationType: 'fixo',
    category: 'habitos',
    active: true
  },
  {
    id: 'rule_streak_30',
    actionKey: 'streak_30_dias',
    name: 'Mestre da Constância (30 Dias)',
    description: 'Premiação máxima por 1 mês completo mantendo foco total.',
    pointsAmount: 250,
    calculationType: 'fixo',
    category: 'habitos',
    active: true
  },
  {
    id: 'rule_meta_agua',
    actionKey: 'meta_agua',
    name: 'Meta de Hidratação (2.5L+)',
    description: 'Meta de água diária completada no módulo de evolução.',
    pointsAmount: 10,
    calculationType: 'fixo',
    category: 'habitos',
    active: true
  },
  {
    id: 'rule_treino',
    actionKey: 'treino',
    name: 'Treino / Atividade Física',
    description: 'Registro de treino funcional, musculação, corrida ou pedal no dia.',
    pointsAmount: 15,
    calculationType: 'fixo',
    category: 'esportes',
    active: true
  },
  {
    id: 'rule_avaliacao',
    actionKey: 'avaliacao',
    name: 'Avaliação de Marmita',
    description: 'Avalie a qualidade, sabor e entrega do seu pedido no app.',
    pointsAmount: 10,
    calculationType: 'fixo',
    category: 'comunidade',
    active: true
  },
  {
    id: 'rule_comunidade',
    actionKey: 'comunidade',
    name: 'Participação na Comunidade',
    description: 'Compartilhe sua refeição ou treino no feed da comunidade.',
    pointsAmount: 15,
    calculationType: 'fixo',
    category: 'comunidade',
    active: true
  },
  {
    id: 'rule_campanha',
    actionKey: 'campanha',
    name: 'Campanha / Ação Promocional',
    description: 'Engajamento em campanhas sazonais e de conscientização de saúde.',
    pointsAmount: 40,
    calculationType: 'fixo',
    category: 'especiais',
    active: true
  },
  {
    id: 'rule_aniversario',
    actionKey: 'aniversario',
    name: 'Presente de Aniversário',
    description: 'Presente especial concedido no dia do aniversário do cliente.',
    pointsAmount: 150,
    calculationType: 'fixo',
    category: 'especiais',
    active: true
  },
  {
    id: 'rule_missao_especial',
    actionKey: 'missao_especial',
    name: 'Missão Especial Mestre',
    description: 'Missões temáticas criadas pelo administrador no MERMI CONTROL.',
    pointsAmount: 75,
    calculationType: 'fixo',
    category: 'especiais',
    active: true
  }
];

export const INITIAL_BADGES: BadgeAchievement[] = [
  {
    id: 'bdg_primeira_marmita',
    name: 'Primeira Marmita',
    description: 'Pediu sua primeira refeição fit e iniciou a revolução alimentar.',
    category: 'nutricao',
    icon: '🥗',
    condition: 'Completar 1 pedido de marmita',
    unlocked: false,
    pointsReward: 25,
    status: 'ativo'
  },
  {
    id: 'bdg_primeiro_pedido',
    name: 'Primeiro Pedido',
    description: 'Entrada oficial no ecossistema saudável MerMi Fit Life.',
    category: 'primeiros_passos',
    icon: '🚀',
    condition: 'Realizar o primeiro pedido no aplicativo',
    unlocked: false,
    pointsReward: 15,
    status: 'ativo'
  },
  {
    id: 'bdg_7_dias_constancia',
    name: '7 Dias de Constância',
    description: 'Manteve 7 dias consecutivos de hábitos saudáveis registrados.',
    category: 'constancia',
    icon: '🔥',
    condition: 'Atingir 7 dias de streak contínuo',
    unlocked: false,
    pointsReward: 50,
    status: 'ativo'
  },
  {
    id: 'bdg_primeira_corrida',
    name: 'Primeira Corrida',
    description: 'Cruzou a linha de chegada no Circuito MerMi Run.',
    category: 'esportes',
    icon: '🏃',
    condition: 'Completar 1 prova de corrida no app',
    unlocked: false,
    pointsReward: 40,
    status: 'ativo'
  },
  {
    id: 'bdg_5km_concluidos',
    name: '5 KM Concluídos',
    description: 'Superou a marca dos 5 quilômetros em treino de corrida.',
    category: 'esportes',
    icon: '🏅',
    condition: 'Registrar corrida de 5km ou mais',
    unlocked: false,
    pointsReward: 30,
    status: 'ativo'
  },
  {
    id: 'bdg_10km_concluidos',
    name: '10 KM Concluídos',
    description: 'Venceu o desafio dos 10km na prova oficial de rua.',
    category: 'esportes',
    icon: '🏆',
    condition: 'Registrar corrida de 10km ou mais',
    unlocked: false,
    pointsReward: 60,
    status: 'ativo'
  },
  {
    id: 'bdg_primeira_recompensa',
    name: 'Primeira Recompensa',
    description: 'Realizou o primeiro resgate no catálogo semanal de prêmios.',
    category: 'fidelidade',
    icon: '🎁',
    condition: 'Resgatar 1 item com MerMi Points',
    unlocked: false,
    pointsReward: 20,
    status: 'ativo'
  },
  {
    id: 'bdg_membro_ativo',
    name: 'Membro Ativo',
    description: 'Interagiu e motivou outros atletas na comunidade MerMi.',
    category: 'comunidade',
    icon: '💬',
    condition: 'Participar ativamente da comunidade',
    unlocked: false,
    pointsReward: 15,
    status: 'ativo'
  },
  {
    id: 'bdg_desafio_concluido',
    name: 'Desafio Concluído',
    description: 'Completou com sucesso uma missão semanal do circuito.',
    category: 'esportes',
    icon: '⚡',
    condition: 'Finalizar qualquer desafio semanal',
    unlocked: false,
    pointsReward: 25,
    status: 'ativo'
  },
  {
    id: 'bdg_indique_amigo',
    name: 'Indique um Amigo',
    description: 'Convidou um amigo que entrou para o time Fit.',
    category: 'comunidade',
    icon: '🤝',
    condition: 'Indicar 1 amigo com pedido concluído',
    unlocked: false,
    pointsReward: 35,
    status: 'ativo'
  },
  {
    id: 'bdg_100_points',
    name: '100 Points',
    description: 'Primeiro grande marco de fidelidade alcançado no ecossistema.',
    category: 'fidelidade',
    icon: '💯',
    condition: 'Acumular mais de 100 MerMi Points',
    unlocked: false,
    pointsReward: 20,
    status: 'ativo'
  },
  {
    id: 'bdg_500_points',
    name: '500 Points',
    description: 'Nível intermediário de fidelidade e constância inabalável.',
    category: 'fidelidade',
    icon: '🌟',
    condition: 'Acumular mais de 500 MerMi Points',
    unlocked: false,
    pointsReward: 50,
    status: 'ativo'
  },
  {
    id: 'bdg_1000_points',
    name: '1000 Points',
    description: 'Lenda viva do ecossistema MerMi Fit Life.',
    category: 'fidelidade',
    icon: '👑',
    condition: 'Acumular mais de 1.000 MerMi Points',
    unlocked: false,
    pointsReward: 100,
    status: 'ativo'
  }
];

export const INITIAL_MISSIONS: GamificationMission[] = [
  {
    id: 'mis_passos_10k',
    title: 'Complete 10.000 Passos',
    description: 'Mantenha o corpo em movimento ao longo do dia para ativar o metabolismo.',
    type: 'diaria',
    objective: 'Bater 10.000 passos no dia',
    progress: 0,
    goal: 10000,
    unit: 'passos',
    pointsReward: 50,
    extraRewardLabel: 'Bônus Diário',
    rules: 'Passos sincronizados com o smartwatch ou registrados no módulo Evolução.',
    status: 'em_andamento',
    active: true
  },
  {
    id: 'mis_marmitas_semana',
    title: '7 Dias Sem Furar a Marmita',
    description: 'Faça pelo menos 5 refeições saudáveis da Linha Fit durante a semana de trabalho.',
    type: 'semanal',
    objective: 'Comer marmitas fit por 7 dias',
    progress: 0,
    goal: 7,
    unit: 'dias',
    pointsReward: 70,
    extraRewardLabel: 'Cupom 10% OFF',
    rules: 'Registros diários de alimentação limpa.',
    status: 'em_andamento',
    active: true
  },
  {
    id: 'mis_hidratacao_agua',
    title: 'Meta de Hidratação 2.5L / Dia',
    description: 'Beba ao menos 2.500 ml de água para otimizar a digestão e recuperação muscular.',
    type: 'diaria',
    objective: 'Ingerir 2.5L de água hoje',
    progress: 0,
    goal: 2500,
    unit: 'ml',
    pointsReward: 35,
    rules: 'Contabilizado através do copo d’água no módulo Evolução.',
    status: 'em_andamento',
    active: true
  },
  {
    id: 'mis_corrida_5k',
    title: 'Corrida 5KM no MerMi Run',
    description: 'Conclua um treino ou prova de 5km com a comunidade.',
    type: 'semanal',
    objective: 'Correr 5km na semana',
    progress: 0,
    goal: 5.0,
    unit: 'km',
    pointsReward: 60,
    extraRewardLabel: 'Emblema Corredor',
    rules: 'Validação pelo módulo Desafios & Corridas.',
    status: 'em_andamento',
    active: true
  },
  {
    id: 'mis_indicar_amigo',
    title: 'Indique 1 Amigo Atleta',
    description: 'Compartilhe seu estilo de vida e convide um colega de treino para pedir MerMi.',
    type: 'mensal',
    objective: '1 amigo com pedido concluído',
    progress: 0,
    goal: 1,
    unit: 'amigo',
    pointsReward: 50,
    extraRewardLabel: 'Crédito Extra',
    rules: 'O amigo deve finalizar o primeiro pedido com seu cupom ou link.',
    status: 'em_andamento',
    active: true
  }
];

export const INITIAL_TRANSACTIONS: PointTransaction[] = [];

export const INITIAL_STREAK: StreakRecord = {
  currentStreakDays: 0,
  bestStreakDays: 0,
  lastActiveDate: '',
  milestones: [
    { days: 7, points: 50, label: '🔥 7 Dias de Fogo', active: true, achieved: false },
    { days: 14, points: 100, label: '⚡ 14 Dias de Constância', active: true, achieved: false },
    { days: 30, points: 250, label: '🏆 30 Dias Mestre Fit', active: true, achieved: false }
  ]
};
