import { IntelligenceInsight, IntelligenceMetric, RewardItem, UserProfile, WeeklyMember } from '../types';

export const INITIAL_USER: UserProfile = {
  id: 'usr_visitante',
  name: 'Visitante',
  handle: '@visitante',
  avatar: '',
  mermiPoints: 0,
  level: 1,
  nextLevelPoints: 100,
  ordersCount: 0,
  stepsToday: 0,
  waterIntakeMl: 0,
  waterGoalMl: 3000,
  sleepHours: '--',
  activeStreakDays: 0,
};

export const INITIAL_WEEKLY_MEMBER: WeeklyMember = {
  id: 'member_joao',
  handle: '@joaosilva.fit',
  name: 'João Silva',
  points: 86,          // Matches Foto 10 official reference
  ordersCount: 7,      // Matches Foto 10 official reference
  statusText: 'MEMBRO ATIVO',
  weekPeriod: 'Semana 38 / 2026',
  motivationMessage: 'No MerMi Points, quem é presente, sempre se destaca! Você é inspiração para toda a comunidade!',
  photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
  isVerified: true,
  active: true,
  published: true,
  featuredOnHome: false, // Por padrão, aparece dentro de Posts & Campanhas sem poluir o topo
  benefits: '1x Marmita Fit 350g cortesia + Bolsa Térmica MerMi + Destaque na Comunidade'
};

export const OFFICIAL_WEEKLY_REWARDS: RewardItem[] = [
  {
    id: 'rew_marmita_gratis',
    title: 'Marmita Grátis',
    pointsCost: 100, // Matches Foto 09
    description: 'Resgate 1 refeição fit completa (350g) à sua escolha no cardápio.',
    category: 'marmita',
    stock: 24,
    imageHint: 'marmita_preta',
    expiresInDays: 7
  },
  {
    id: 'rew_desconto_especial',
    title: 'Desconto Especial (25% OFF)',
    pointsCost: 150, // Matches Foto 09
    description: 'Cupom de 25% de desconto em qualquer pedido ou combo da semana.',
    category: 'desconto',
    stock: 99,
    imageHint: 'cupom_desconto',
    expiresInDays: 14
  },
  {
    id: 'rew_copo_exclusivo',
    title: 'Copo / Shaker Exclusivo MerMi',
    pointsCost: 200, // Matches Foto 09
    description: 'Shaker preto fosco oficial com vedação anti-vazamento e logo em verde neon.',
    category: 'acessorio',
    stock: 12,
    imageHint: 'shaker_mermi',
    expiresInDays: 30
  },
  {
    id: 'rew_combo_especial',
    title: 'Combo Especial Semanal',
    pointsCost: 300, // Matches Foto 09
    description: 'Kit com 3 marmitas selecionadas da linha Fit + 1 suco natural funcional.',
    category: 'combo',
    stock: 8,
    imageHint: 'combo_tres_marmitas',
    expiresInDays: 7
  },
  {
    id: 'rew_bolsa_termica',
    title: 'Bolsa Térmica MerMi Points',
    pointsCost: 400, // Matches Foto 09
    description: 'Bolsa térmica premium impermeável de alta conservação com alça e bolsos duplos.',
    category: 'acessorio',
    stock: 5,
    imageHint: 'bolsa_termica_preta',
    expiresInDays: 30
  },
  {
    id: 'rew_surpresa_exclusiva',
    title: 'Surpresa VIP Exclusiva',
    pointsCost: 500, // Matches Foto 09
    description: 'Experiência secreta do ecossistema: Kit degustação Chef Fit + Acesso antecipado.',
    category: 'exclusivo',
    stock: 3,
    imageHint: 'caixa_preta_vip',
    expiresInDays: 15
  }
];

export const INITIAL_INTELLIGENCE_METRICS: IntelligenceMetric[] = [
  {
    label: 'Faturamento Semanal',
    value: 'R$ 48.720,00',
    change: '+14,8%',
    trend: 'up',
    impact: 'Crescimento alavancado por combos Fit Premium 500g'
  },
  {
    label: 'Points Circulantes',
    value: '42.850 pts',
    change: '+22,3%',
    trend: 'up',
    impact: 'Alta taxa de retenção por desafios gamificados'
  },
  {
    label: 'Margem Média Bruta',
    value: '64,2%',
    change: '+2,1%',
    trend: 'up',
    impact: 'Otimização nas compras de proteínas magras'
  },
  {
    label: 'Taxa de Recompra (CRM)',
    value: '78,4%',
    change: '+5,6%',
    trend: 'up',
    impact: 'Estilo de vida ativo mantém cliente no ciclo semanal'
  }
];

export const INITIAL_INTELLIGENCE_INSIGHTS: IntelligenceInsight[] = [
  {
    id: 'ins_1',
    dado: '72% dos clientes pedem marmitas de 350g durante a semana e migram para 500g nos fins de treino pesado.',
    analise: 'A versatilidade entre 350g e 500g atende perfis de manutenção calórica e hipertrofia sem atrito.',
    possivelCausa: 'Rotina de treino dividida entre dias de escritório e fins de semana de corrida.',
    sugestao: 'Criar "Plano Híbrido Semanal" com 4 marmitas 350g + 2 marmitas 500g com bônus de +40 MerMi Points.',
    impactoEsperado: 'Aumento projetado de 18% no Ticket Médio com fidelização estendida.'
  },
  {
    id: 'ins_2',
    dado: 'Marmita Grátis (100 Points) é o resgate com maior velocidade (48h após liberação da semana).',
    analise: 'O limiar de 100 pontos oferece gratificação rápida e motiva o cliente a fazer o próximo pedido (+10 pts).',
    possivelCausa: 'Percepção de valor tangível imediato de comer de graça com disciplina acumulada.',
    sugestao: 'Manter estoque garantido de 50 marmitas de resgate por semana para evitar frustração de estoque.',
    impactoEsperado: 'Redução da rotatividade (churn) para menos de 3% ao mês.'
  },
  {
    id: 'ins_3',
    dado: 'Clientes que atingiram 8.000 passos no módulo Evolução realizam 2,4x mais pedidos de salmão e tilápia.',
    analise: 'Há correlação direta entre consistência física e preferência por escolhas alimentares mais saudáveis.',
    possivelCausa: 'Mentalidade "Disciplina Hoje, Resultados Sempre" reforçada pela gamificação.',
    sugestao: 'Enviar notificação motivacional via MerMi IA quando o cliente bater a meta de 8.500 passos oferecendo pontos extras.',
    impactoEsperado: 'Engajamento diário no app subindo de 3,2 para 5,1 acessos/semana.'
  }
];

export const INITIAL_DROPS_SURPRESA: import('../types/dropSurpresa').DropSurpresaItem[] = [
  {
    id: 'drop_secreto_01',
    title: 'Drop Misterioso da Madrugada',
    subtitle: 'Apenas para quem acumula pontos e não perde o ritmo!',
    description: 'Um lote ultra limitado com surpresas que vão de marmitas grátis a kits exclusivos MerMi Run e bônus de até +200 MerMi Points!',
    rewardType: 'marmita',
    rewardValue: 'Marmita Fit 350g Grátis',
    rewardLabel: '1x Marmita Fit 350g Cortesia',
    quantityTotal: 50,
    quantityClaimed: 38,
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    minPointsRequired: 200,
    minOrdersRequired: 2,
    probabilityPercent: 75,
    frequency: 'semanal',
    active: true,
    featured: true,
    badge: 'DROP LIMITADO',
    colorTheme: 'blue'
  },
  {
    id: 'drop_secreto_02',
    title: 'Drop Super Bônus: +150 Points',
    subtitle: 'Injeção direta na sua carteira para resgates épicos',
    description: 'Drop relâmpago de pontos para você acelerar o seu Resgate da Semana ou subir de nível na comunidade.',
    rewardType: 'points',
    rewardValue: 150,
    rewardLabel: '+150 MerMi Points Imediatos',
    quantityTotal: 100,
    quantityClaimed: 64,
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    minPointsRequired: 100,
    minOrdersRequired: 1,
    probabilityPercent: 90,
    frequency: 'diario',
    active: true,
    featured: false,
    badge: 'FLASH DROP',
    colorTheme: 'cyan'
  },
  {
    id: 'drop_secreto_03',
    title: 'Drop VIP: Copo Térmico MerMi',
    subtitle: 'Brinde exclusivo para os membros mais consistentes',
    description: 'Copo térmico premium gravado a laser para acompanhar você nos treinos e no dia a dia.',
    rewardType: 'brinde',
    rewardValue: 'Copo Térmico MerMi 500ml',
    rewardLabel: 'Copo Térmico MerMi Edição Especial',
    quantityTotal: 25,
    quantityClaimed: 22,
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    minPointsRequired: 400,
    minOrdersRequired: 4,
    probabilityPercent: 50,
    frequency: 'unico',
    active: true,
    featured: false,
    badge: 'EXCLUSIVO VIP',
    colorTheme: 'purple'
  }
];

export const INITIAL_DROP_CLAIMS: import('../types/dropSurpresa').DropClaimRecord[] = [
  {
    id: 'claim_1',
    dropId: 'drop_secreto_01',
    dropTitle: 'Drop Misterioso da Madrugada',
    userId: 'user_camila',
    userName: 'Camila Santos',
    rewardType: 'marmita',
    rewardLabel: '1x Marmita Fit 350g Cortesia',
    claimedAt: 'Ontem às 19:42',
    expiresAt: 'Em 6 dias',
    status: 'resgatado',
    codeSnippet: 'DROP-FIT-789'
  },
  {
    id: 'claim_2',
    dropId: 'drop_secreto_02',
    dropTitle: 'Drop Super Bônus: +150 Points',
    userId: 'user_rafael',
    userName: 'Rafael Diniz',
    rewardType: 'points',
    rewardLabel: '+150 MerMi Points Imediatos',
    claimedAt: 'Hoje às 11:15',
    expiresAt: 'Permanente',
    status: 'utilizado',
    codeSnippet: 'PTS-150-BONUS'
  }
];

