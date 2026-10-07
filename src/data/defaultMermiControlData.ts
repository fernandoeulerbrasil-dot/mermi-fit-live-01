import {
  AdminUser,
  AuditLog,
  InventoryItem,
  ProductionPlanItem,
  CustomerCrmProfile,
  CampaignItem,
  BannerItem,
  PostItem,
  NotificationAdminItem,
  MermiIntelligenceInsightFull,
  AdminAlert,
  SystemSettings
} from '../types/mermiControl';

export const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: 'adm_owner',
    name: 'Fernando Euler',
    email: 'fernandoeulerbrasil@gmail.com',
    role: 'OWNER',
    permissions: ['all'],
    active: true,
    lastLogin: '2026-09-27 12:45',
    avatarUrl: '/assets/brand/mermi-logo.png'
  },
  {
    id: 'adm_admin_01',
    name: 'Juliana Lima',
    email: 'juliana.admin@mermifitlife.com.br',
    role: 'ADMIN',
    permissions: ['catalog', 'orders', 'crm', 'production', 'inventory', 'reports'],
    active: true,
    lastLogin: '2026-09-27 10:15'
  },
  {
    id: 'adm_gerente_01',
    name: 'Roberto Mendes',
    email: 'roberto.gerente@mermifitlife.com.br',
    role: 'GERENTE',
    permissions: ['catalog', 'orders', 'production', 'inventory'],
    active: true,
    lastLogin: '2026-09-27 09:30'
  },
  {
    id: 'adm_fin_01',
    name: 'Mariana Castro',
    email: 'mariana.fin@mermifitlife.com.br',
    role: 'FINANCEIRO',
    permissions: ['financial', 'pricing', 'reports', 'audit'],
    active: true,
    lastLogin: '2026-09-27 08:20'
  },
  {
    id: 'adm_prod_01',
    name: 'Chef Renata Silveira',
    email: 'renata.chef@mermifitlife.com.br',
    role: 'PRODUÇÃO',
    permissions: ['production', 'inventory', 'recipes'],
    active: true,
    lastLogin: '2026-09-27 07:00'
  },
  {
    id: 'adm_op_01',
    name: 'Carlos Souza',
    email: 'carlos.op@mermifitlife.com.br',
    role: 'OPERACIONAL',
    permissions: ['orders', 'delivery', 'dispatch'],
    active: true,
    lastLogin: '2026-09-27 11:00'
  },
  {
    id: 'adm_mkt_01',
    name: 'Gabriela Rocha',
    email: 'gabriela.mkt@mermifitlife.com.br',
    role: 'MARKETING',
    permissions: ['campaigns', 'banners', 'posts', 'community', 'notifications', 'drops'],
    active: true,
    lastLogin: '2026-09-26 17:40'
  },
  {
    id: 'adm_sac_01',
    name: 'Lucas Silva',
    email: 'lucas.sac@mermifitlife.com.br',
    role: 'ATENDIMENTO',
    permissions: ['crm', 'orders', 'support'],
    active: true,
    lastLogin: '2026-09-27 11:20'
  }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'inv_frango',
    name: 'Peito de Frango Sadia / Congelado Especial',
    category: 'ingrediente',
    currentStock: 48.5,
    minStock: 25.0,
    unit: 'kg',
    costPerUnit: 18.5,
    supplier: 'Distribuidora Avícola Centro-Sul',
    status: 'normal'
  },
  {
    id: 'inv_patinho',
    name: 'Carne Bovina Patinho Limpo Resfriado',
    category: 'ingrediente',
    currentStock: 18.0,
    minStock: 20.0,
    unit: 'kg',
    costPerUnit: 34.9,
    supplier: 'Frigorífico Premium Minas',
    status: 'baixo'
  },
  {
    id: 'inv_salmao',
    name: 'Filé de Salmão Chileno Fresco',
    category: 'ingrediente',
    currentStock: 12.0,
    minStock: 10.0,
    unit: 'kg',
    costPerUnit: 78.0,
    supplier: 'Mar & Rios Pescados Nobres',
    status: 'normal'
  },
  {
    id: 'inv_arroz',
    name: 'Arroz Integral Cateto Grãos Selecionados',
    category: 'ingrediente',
    currentStock: 65.0,
    minStock: 30.0,
    unit: 'kg',
    costPerUnit: 6.2,
    supplier: 'Cereais da Terra Orgânicos',
    status: 'normal'
  },
  {
    id: 'inv_batata',
    name: 'Batata Doce Roxa Orgânica',
    category: 'ingrediente',
    currentStock: 42.0,
    minStock: 25.0,
    unit: 'kg',
    costPerUnit: 4.8,
    supplier: 'Hortifruti Cooperativa Verde',
    status: 'normal'
  },
  {
    id: 'inv_brocolis',
    name: 'Brócolis Ninja Fresco em Floretes',
    category: 'ingrediente',
    currentStock: 9.5,
    minStock: 15.0,
    unit: 'kg',
    costPerUnit: 9.8,
    supplier: 'Hortifruti Cooperativa Verde',
    status: 'baixo'
  },
  {
    id: 'inv_emb_350',
    name: 'Embalagem Termosselável BPA Free 350g',
    category: 'embalagem',
    currentStock: 420,
    minStock: 150,
    unit: 'un',
    costPerUnit: 1.15,
    supplier: 'TermoPack Brasil',
    status: 'normal'
  },
  {
    id: 'inv_emb_500',
    name: 'Embalagem Termosselável BPA Free 500g',
    category: 'embalagem',
    currentStock: 310,
    minStock: 150,
    unit: 'un',
    costPerUnit: 1.35,
    supplier: 'TermoPack Brasil',
    status: 'normal'
  },
  {
    id: 'inv_rotulos',
    name: 'Rótulo Adesivo com Tabela Nutricional & QR Code',
    category: 'embalagem',
    currentStock: 650,
    minStock: 200,
    unit: 'un',
    costPerUnit: 0.28,
    supplier: 'Gráfica Express Label',
    status: 'normal'
  },
  {
    id: 'inv_azeite',
    name: 'Azeite de Oliva Extra Virgem 0,2% Acidez',
    category: 'insumo',
    currentStock: 14.0,
    minStock: 8.0,
    unit: 'litro',
    costPerUnit: 42.0,
    supplier: 'Aromas do Mediterrâneo',
    status: 'normal'
  }
];

export const INITIAL_PRODUCTION_PLAN: ProductionPlanItem[] = [
  {
    id: 'prod_001',
    dishId: 'prod_frango_01',
    dishName: 'Frango Grelhado com Batata Doce & Brócolis',
    line: 'fit',
    quantity350g: 24,
    quantity500g: 18,
    proteinRequiredKg: 6.8,
    proteinType: 'Peito de Frango',
    carbRequiredKg: 5.2,
    carbType: 'Batata Doce',
    vegRequiredKg: 3.5,
    packagingRequiredUn: 42,
    status: 'em_preparo',
    priority: 'alta',
    targetShift: 'manha'
  },
  {
    id: 'prod_002',
    dishId: 'prod_carne_01',
    dishName: 'Patinho Moído Magro com Arroz Integral & Cenoura',
    line: 'fit',
    quantity350g: 16,
    quantity500g: 12,
    proteinRequiredKg: 4.6,
    proteinType: 'Patinho Bovino',
    carbRequiredKg: 3.8,
    carbType: 'Arroz Integral',
    vegRequiredKg: 2.4,
    packagingRequiredUn: 28,
    status: 'planejado',
    priority: 'normal',
    targetShift: 'manha'
  },
  {
    id: 'prod_003',
    dishId: 'prod_salmao_01',
    dishName: 'Salmão Nobre Grelhado com Quinoa & Aspargos',
    line: 'fit_premium',
    quantity350g: 8,
    quantity500g: 6,
    proteinRequiredKg: 2.8,
    proteinType: 'Filé de Salmão',
    carbRequiredKg: 1.9,
    carbType: 'Quinoa Real',
    vegRequiredKg: 1.5,
    packagingRequiredUn: 14,
    status: 'planejado',
    priority: 'alta',
    targetShift: 'tarde'
  }
];

export const INITIAL_CRM_CUSTOMERS: CustomerCrmProfile[] = [
  {
    id: 'crm_cust_01',
    name: 'Fernando Euler',
    email: 'fernandoeulerbrasil@gmail.com',
    phone: '(31) 98765-4321',
    registerDate: '2026-01-15',
    lastOrderDate: '2026-09-26',
    ordersCount: 14,
    totalSpent: 489.6,
    averageTicket: 34.97,
    purchaseFrequencyDays: 6,
    favoriteDishes: ['Frango Fit 500g', 'Patinho Moído Fit 350g'],
    pointsBalance: 420,
    level: 3,
    participatedRunEvents: 2,
    challengesCompleted: 5,
    couponsUsed: 3,
    segment: 'vip',
    isVip: true,
    relationshipStatus: 'excelente',
    daysSinceLastOrder: 1,
    notes: 'Cliente proprietário e atleta frequente de circuitos 5K.'
  },
  {
    id: 'crm_cust_02',
    name: 'Camila Santos',
    email: 'camila.santos@email.com',
    phone: '(31) 99123-8877',
    registerDate: '2026-03-10',
    lastOrderDate: '2026-09-24',
    ordersCount: 9,
    totalSpent: 284.1,
    averageTicket: 31.56,
    purchaseFrequencyDays: 8,
    favoriteDishes: ['Salmão Nobre Fit Premium 350g'],
    pointsBalance: 195,
    level: 2,
    participatedRunEvents: 1,
    challengesCompleted: 3,
    couponsUsed: 1,
    segment: 'ativo',
    isVip: false,
    relationshipStatus: 'excelente',
    daysSinceLastOrder: 3,
    notes: 'Prioriza refeições ricas em ômega 3 e treinos noturnos.'
  },
  {
    id: 'crm_cust_03',
    name: 'Lucas Rossi',
    email: 'lucas.rossi@email.com',
    phone: '(31) 98234-9911',
    registerDate: '2026-02-01',
    lastOrderDate: '2026-08-30',
    ordersCount: 6,
    totalSpent: 168.4,
    averageTicket: 28.06,
    purchaseFrequencyDays: 14,
    favoriteDishes: ['Patinho Moído Fit 500g'],
    pointsBalance: 85,
    level: 1,
    participatedRunEvents: 0,
    challengesCompleted: 1,
    couponsUsed: 2,
    segment: 'inativo',
    isVip: false,
    relationshipStatus: 'em_risco',
    daysSinceLastOrder: 28,
    notes: 'Parou de pedir há quase 1 mês. Elegível para campanha de reativação VOLTAFIT.'
  },
  {
    id: 'crm_cust_04',
    name: 'Beatriz Alencar',
    email: 'beatriz.alencar@email.com',
    phone: '(31) 97345-1234',
    registerDate: '2026-09-22',
    lastOrderDate: '2026-09-25',
    ordersCount: 1,
    totalSpent: 44.8,
    averageTicket: 44.8,
    purchaseFrequencyDays: 0,
    favoriteDishes: ['Frango Fit 350g', 'Salmão Nobre 350g'],
    pointsBalance: 45,
    level: 1,
    participatedRunEvents: 0,
    challengesCompleted: 0,
    couponsUsed: 1,
    segment: 'novo',
    isVip: false,
    relationshipStatus: 'estavel',
    daysSinceLastOrder: 2,
    notes: 'Nova cliente veio por indicação de amiga na academia Bodytech.'
  },
  {
    id: 'crm_cust_05',
    name: 'Rodrigo Martins',
    email: 'rodrigo.martins@email.com',
    phone: '(31) 99456-7890',
    registerDate: '2026-04-12',
    lastOrderDate: '2026-09-21',
    ordersCount: 12,
    totalSpent: 512.8,
    averageTicket: 42.73,
    purchaseFrequencyDays: 7,
    favoriteDishes: ['Linha Fit Premium 500g', 'Combo Semanal'],
    pointsBalance: 390,
    level: 3,
    participatedRunEvents: 2,
    challengesCompleted: 4,
    couponsUsed: 0,
    segment: 'alto_ticket',
    isVip: true,
    relationshipStatus: 'excelente',
    daysSinceLastOrder: 6,
    notes: 'Pede marmitas de 500g e valoriza embalagens térmicas reforçadas.'
  }
];

export const INITIAL_CAMPAIGNS: CampaignItem[] = [
  {
    id: 'camp_001',
    nome: 'Semana de Hidratação & Constância',
    imagem: '/assets/brand/mermi-logo.png',
    titulo: 'Meta de Água Batida, Points Turbinados!',
    descricao: 'Atinja 2,5L por 3 dias seguidos e ganhe +50 Points no Resgate da Semana.',
    cta: 'VER MINHA META',
    destino: 'evolucao',
    dataInicial: '2026-09-20',
    dataFinal: '2026-10-05',
    publico: 'todos',
    ordem: 1,
    status: 'ativa',
    viewsCount: 342,
    clicksCount: 128,
    ordersCount: 39,
    revenueGenerated: 1184.5
  },
  {
    id: 'camp_002',
    nome: 'Reativação: De Volta ao Foco',
    imagem: '/assets/brand/mermi-logo.png',
    titulo: 'Sentimos Sua Falta! Volte com Frete Grátis',
    descricao: 'Clientes inativos há mais de 20 dias ganham frete grátis com cupom VOLTAFIT.',
    cta: 'USAR CUPOM',
    destino: 'cardapio',
    dataInicial: '2026-09-15',
    dataFinal: '2026-10-15',
    publico: 'inativos',
    ordem: 2,
    status: 'ativa',
    viewsCount: 88,
    clicksCount: 32,
    ordersCount: 11,
    revenueGenerated: 345.9
  },
  {
    id: 'camp_003',
    nome: 'MerMi Run 2026 · Etapa Lagoa dos Ingleses',
    imagem: '/assets/brand/mermi-logo.png',
    titulo: 'Inscrições Abertas com Marmita Inclusa no Kit',
    descricao: 'Garanta sua vaga nos percursos de 3K, 5K ou 10K com desconto de Points.',
    cta: 'INSCREVER AGORA',
    destino: 'corridas',
    dataInicial: '2026-09-01',
    dataFinal: '2026-10-20',
    publico: 'run',
    ordem: 3,
    status: 'ativa',
    viewsCount: 512,
    clicksCount: 215,
    ordersCount: 48,
    revenueGenerated: 4272.0
  }
];

export const INITIAL_BANNERS: BannerItem[] = [
  {
    id: 'ban_home_01',
    targetPage: 'home',
    imagem: '/assets/brand/mermi-logo.png',
    titulo: 'Alimente Sua Melhor Versão Hoje',
    texto: 'Marmitas congeladas saudáveis 350g e 500g com porções pesadas e ingredientes nobres.',
    botaoTexto: 'EXPLORAR CARDÁPIO',
    linkInterno: 'cardapio',
    ordem: 1,
    dataInicio: '2026-01-01',
    dataTermino: '2026-12-31',
    status: 'ativo'
  },
  {
    id: 'ban_cardapio_01',
    targetPage: 'cardapio',
    imagem: '/assets/brand/mermi-logo.png',
    titulo: 'Personalize sem Custo Adicional',
    texto: 'Troque o carboidrato ou vegetal sem alteração do preço padrão da linha selecionada.',
    botaoTexto: 'MONTAR MINHA MARMITA',
    linkInterno: 'cardapio',
    ordem: 2,
    dataInicio: '2026-01-01',
    dataTermino: '2026-12-31',
    status: 'ativo'
  },
  {
    id: 'ban_points_01',
    targetPage: 'points',
    imagem: '/assets/brand/mermi-logo.png',
    titulo: 'Seu Esforço Vira Comida de Verdade',
    texto: 'Cada marmita pedida, corrida completada ou meta diária rende MerMi Points valiosos.',
    botaoTexto: 'VER RECOMPENSAS',
    linkInterno: 'resgate',
    ordem: 3,
    dataInicio: '2026-01-01',
    dataTermino: '2026-12-31',
    status: 'ativo'
  }
];

export const INITIAL_POSTS: PostItem[] = [
  {
    id: 'post_001',
    imagem: '/assets/brand/mermi-logo.png',
    titulo: 'Como manter o balanço proteico sem complicação na rotina corporativa',
    descricao: 'Dicas práticas da cozinha MerMi Fit para quem almoça entre reuniões e não abre mão de 35g+ de proteína pura.',
    categoria: 'ALIMENTAÇÃO',
    data: '2026-09-25',
    horario: '10:00',
    status: 'publicado',
    ordem: 1,
    cta: 'LER DICAS',
    destino: 'cardapio',
    publico: 'todos'
  },
  {
    id: 'post_002',
    imagem: '/assets/brand/mermi-logo.png',
    titulo: 'Por que o aquecimento gradual protege o joelho antes do tiro de 5K',
    descricao: 'Guia de mobilidade articular preparado para os corredores do circuito MerMi Run.',
    categoria: 'MERMI RUN',
    data: '2026-09-24',
    horario: '16:30',
    status: 'publicado',
    ordem: 2,
    cta: 'VER CIRCUITO',
    destino: 'corridas',
    publico: 'todos'
  },
  {
    id: 'post_003',
    imagem: '/assets/brand/mermi-logo.png',
    titulo: 'Chegou o lote de Salmão Nobre com Crosta de Gergelim',
    descricao: 'Refeição premium de 500g com arroz negro e aspargos grelhados disponível para pedidos da semana.',
    categoria: 'NOVIDADES',
    data: '2026-09-23',
    horario: '11:15',
    status: 'publicado',
    ordem: 3,
    cta: 'PEDIR SALMÃO',
    destino: 'cardapio',
    publico: 'todos'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationAdminItem[] = [
  {
    id: 'notif_001',
    title: 'Seu pedido #ORD-1001 saiu para entrega! 🛵',
    message: 'O motoboy parceiro está a caminho com sua bag térmica lacrada.',
    category: 'PEDIDOS',
    targetAudience: 'Clientes com pedido em rota',
    status: 'enviada',
    sentAt: '2026-09-27 11:30',
    readCount: 18
  },
  {
    id: 'notif_002',
    title: 'Novo Drop Surpresa liberado na sua região! 🎁',
    message: 'Toque para verificar se seu saldo de Points cumpre os requisitos do lote.',
    category: 'POINTS',
    targetAudience: 'Clientes com +150 Points',
    status: 'enviada',
    sentAt: '2026-09-26 14:00',
    readCount: 42
  },
  {
    id: 'notif_003',
    title: 'Contagem regressiva: MerMi Run Etapa Outono 🏃',
    message: 'Últimos 15 kits com camiseta dry-fit oficial disponíveis.',
    category: 'RUN',
    targetAudience: 'Atletas inscritos',
    status: 'agendada',
    scheduledFor: '2026-09-30 09:00',
    readCount: 0
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud_001',
    timestamp: '2026-09-27 11:45',
    adminName: 'Fernando Euler',
    adminRole: 'OWNER',
    action: 'CONFIRMACAO_PRECOS_OFICIAIS',
    entity: 'preco',
    entityId: 'pricing_global',
    previousValue: 'Fit 350g: R$ 19,90 | Fit 500g: R$ 24,90 | Premium 350g: R$ 32,90 | Premium 500g: R$ 39,90',
    newValue: 'Fit 350g: R$ 19,90 | Fit 500g: R$ 24,90 | Premium 350g: R$ 32,90 | Premium 500g: R$ 39,90',
    reason: 'Auditoria de integridade dos preços funcionais do banco de dados.'
  },
  {
    id: 'aud_002',
    timestamp: '2026-09-27 10:30',
    adminName: 'Mariana Castro',
    adminRole: 'FINANCEIRO',
    action: 'REVISAO_CUSTO_INGREDIENTES',
    entity: 'estoque',
    entityId: 'inv_frango',
    previousValue: 'Custo R$ 17,90/kg',
    newValue: 'Custo R$ 18,50/kg',
    reason: 'Reajuste de tabela do fornecedor Distribuidora Avícola Centro-Sul.'
  },
  {
    id: 'aud_003',
    timestamp: '2026-09-26 16:15',
    adminName: 'Gabriela Rocha',
    adminRole: 'MARKETING',
    action: 'PUBLICAR_CAMPANHA',
    entity: 'campanha',
    entityId: 'camp_001',
    previousValue: 'Status: rascunho',
    newValue: 'Status: ativa',
    reason: 'Lançamento da Semana de Hidratação & Constância.'
  },
  {
    id: 'aud_004',
    timestamp: '2026-09-25 14:00',
    adminName: 'Fernando Euler',
    adminRole: 'OWNER',
    action: 'VALIDACAO_ASSET_OFICIAL',
    entity: 'asset',
    entityId: 'mermi-ia-official',
    previousValue: 'Status: Ativo',
    newValue: 'Status: ATIVO_OFICIAL (Imutável)',
    reason: 'Proteção irrestrita da imagem oficial da MerMi IA contra filtros ou recriação por IA.'
  }
];

export const INITIAL_INTELLIGENCE_FULL_INSIGHTS: MermiIntelligenceInsightFull[] = [
  {
    id: 'intel_001',
    category: 'vendas',
    dado: 'Marmitas Fit de 500g representaram 58% do faturamento da última semana (ticket médio R$ 34,90).',
    analise: 'A clientela de praticantes de musculação e corrida demonstra preferência contínua pelo aporte proteico reforçado da versão 500g.',
    possivelCausa: 'Custo-benefício percebido vantajoso (R$ 24,90 por 500g) em relação a refeições avulsas de rua.',
    sugestao: 'Manter estoque reforçado de embalagens de 500g e sugerir combos de 5 unidades de 500g no checkout.',
    impactoEstimado: 'Previsão de alta de +12% no ticket médio sem incremento de despesas fixas.',
    isHighImpactAction: false,
    status: 'sugerido'
  },
  {
    id: 'intel_002',
    category: 'estoque',
    dado: 'Estoque atual de Patinho Bovino em 18kg (mínimo de segurança é 20kg).',
    analise: 'Consumo acelerado nas últimas 48h devido à alta saída da marmita Patinho com Arroz Integral.',
    possivelCausa: 'Promoção orgânica espontânea nos treinos da comunidade na quarta-feira.',
    sugestao: 'Antecipar pedido de compra de 30kg com o frigorífico parceiro para entrega na manhã seguinte.',
    impactoEstimado: 'Evita ruptura de estoque de 32 pedidos estimados para o fim de semana.',
    isHighImpactAction: true,
    highImpactActionType: 'ajustar_estoque',
    highImpactPayload: { itemId: 'inv_patinho', quantityToAdd: 30 },
    status: 'sugerido'
  },
  {
    id: 'intel_003',
    category: 'campanhas',
    dado: '14 clientes cadastrados completaram 20+ dias sem realizar novos pedidos.',
    analise: 'Queda de retenção no ciclo pós-primeiro mês de inscrição no app.',
    possivelCausa: 'Falta de estímulo proativo de reabastecimento do freezer familiar.',
    sugestao: 'Disparar notificação e cupom de incentivo VOLTAFIT com frete grátis para esse segmento.',
    impactoEstimado: 'Reativação estimada de 4 a 6 clientes (R$ 450 a R$ 680 de faturamento recuperado).',
    isHighImpactAction: true,
    highImpactActionType: 'disparar_reativacao',
    highImpactPayload: { couponCode: 'VOLTAFIT', targetSegment: 'inativos' },
    status: 'sugerido'
  },
  {
    id: 'intel_004',
    category: 'points',
    dado: 'Taxa de resgate de Points está em 42% dos pontos totais emitidos no mês.',
    analise: 'O ecossistema apresenta equilíbrio saudável: pontos são valorizados e circulam sem gerar passivo inflacionário.',
    possivelCausa: 'Prêmios atrativos como marmitas grátis no Resgate da Semana geram alto interesse.',
    sugestao: 'Manter a cota de 50 marmitas por lote de resgate para sustentar a sensação de exclusividade.',
    impactoEstimado: 'Fidelização continuada com taxa de churn abaixo de 3,5%.',
    isHighImpactAction: false,
    status: 'sugerido'
  }
];

export const INITIAL_ADMIN_ALERTS: AdminAlert[] = [
  {
    id: 'alt_001',
    type: 'ESTOQUE_BAIXO',
    severity: 'alerta',
    title: 'Estoque de Patinho Bovino abaixo do mínimo',
    description: 'Estoque atual: 18,0 kg. Limite mínimo configurado: 20,0 kg.',
    timestamp: '2026-09-27 08:30',
    resolved: false
  },
  {
    id: 'alt_002',
    type: 'EVENTO_PROXIMO',
    severity: 'aviso',
    title: 'MerMi Run 2026 com 85% das vagas preenchidas',
    description: 'Restam apenas 15 vagas disponíveis para a prova de 5K.',
    timestamp: '2026-09-26 19:10',
    resolved: false
  }
];

export const INITIAL_SYSTEM_SETTINGS: SystemSettings = {
  companyName: 'MERMI FIT LIFE ALIMENTOS SAUDÁVEIS LTDA',
  cnpj: '48.912.834/0001-72',
  contactEmail: 'contato@mermifitlife.com.br',
  contactWhatsApp: '(31) 98765-4321',
  operatingHours: 'Segunda a Sexta: 07h às 21h · Sábado: 08h às 14h',
  kitchenAddress: 'Av. Nossa Senhora do Carmo, 1450 - Savassi, Belo Horizonte - MG',
  instagramHandle: '@mermifitlife',
  deliveryRadiusKm: 25,
  minOrderValue: 30.0,
  pointsPerRealSpent: 1,
  pointsPerRunEvent: 150,
  pointsPerChallenge: 50,
  pointsPerReview: 10,
  pointsPerReferral: 100,
  pointsPerDailyStreak: 5,
  vipMinSpending: 400.0,
  vipMinOrders: 8,
  aiMode: 'educativo_estrito'
};
