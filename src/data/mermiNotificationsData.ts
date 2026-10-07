import {
  AppNotification,
  NotificationPreferences,
  NotificationAutomation,
  SmartCampaign,
  NotificationTemplate,
  CartAbandonmentRecord
} from '../types/mermiNotifications';

export const INITIAL_NOTIFICATION_TEMPLATES: NotificationTemplate[] = [
  {
    template_key: 'ORDER_CREATED',
    name: 'Pedido Criado com Sucesso',
    category: 'PEDIDO',
    default_title: 'Pedido Recebido! 🥗',
    default_message: 'Olá, {{user_name}}! Seu pedido #{{order_number}} foi registrado e está na fila da cozinha.',
    supported_variables: ['user_name', 'order_number', 'order_total', 'items_count'],
    suggested_action_target: 'pedidos'
  },
  {
    template_key: 'PAYMENT_APPROVED',
    name: 'Pagamento Aprovado',
    category: 'PAGAMENTO',
    default_title: 'Pagamento Confirmado! 💳',
    default_message: 'O pagamento do pedido #{{order_number}} foi confirmado. Nossos chefs iniciaram a preparação.',
    supported_variables: ['user_name', 'order_number', 'payment_method'],
    suggested_action_target: 'pedidos'
  },
  {
    template_key: 'ORDER_SHIPPED',
    name: 'Pedido em Rota de Entrega',
    category: 'ENTREGA',
    default_title: 'Seu almoço fit está a caminho! 🛵',
    default_message: 'O pedido #{{order_number}} saiu para entrega no endereço {{delivery_address}}.',
    supported_variables: ['user_name', 'order_number', 'delivery_address'],
    suggested_action_target: 'pedidos'
  },
  {
    template_key: 'ORDER_DELIVERED',
    name: 'Pedido Entregue',
    category: 'ENTREGA',
    default_title: 'Bom apetite! Pedido Entregue 📦',
    default_message: 'Seu pedido #{{order_number}} foi entregue. Conte-nos o que achou da sua refeição.',
    supported_variables: ['user_name', 'order_number'],
    suggested_action_target: 'pedidos'
  },
  {
    template_key: 'POINTS_EARNED',
    name: 'MerMi Points Creditados',
    category: 'POINTS',
    default_title: 'Você acumulou +{{points_amount}} Points! ⭐',
    default_message: 'Parabéns, {{user_name}}! Seu novo saldo é de {{points_balance}} MerMi Points.',
    supported_variables: ['user_name', 'points_amount', 'points_balance', 'origin_reason'],
    suggested_action_target: 'points'
  },
  {
    template_key: 'POINTS_EXPIRING',
    name: 'Points Próximos de Expirar',
    category: 'POINTS',
    default_title: 'Não perca seus MerMi Points! ⏳',
    default_message: 'Você tem {{points_expiring}} pontos que expiram em breve. Aproveite no Resgate da Semana.',
    supported_variables: ['user_name', 'points_expiring', 'days_left'],
    suggested_action_target: 'resgate'
  },
  {
    template_key: 'DROP_UNLOCKED',
    name: 'Drop Surpresa Desbloqueado',
    category: 'RECOMPENSA',
    default_title: '🎁 Você desbloqueou um MerMi Drop Surpresa!',
    default_message: 'Uma recompensa especial foi liberada exclusivamente para o seu perfil. Toque para resgatar.',
    supported_variables: ['user_name', 'drop_name'],
    suggested_action_target: 'drop_surpresa'
  },
  {
    template_key: 'REWARD_UNLOCKED',
    name: 'Resgate da Semana Disponível',
    category: 'RECOMPENSA',
    default_title: 'Resgate da Semana Disponível! 🍽️',
    default_message: 'Novas marmitas e garrafas exclusivas estão liberadas com seus pontos acumulados.',
    supported_variables: ['user_name', 'reward_title', 'points_cost'],
    suggested_action_target: 'resgate'
  },
  {
    template_key: 'RUN_REGISTERED',
    name: 'Inscrição MerMi Run Confirmada',
    category: 'MERMI_RUN',
    default_title: '🏃 Inscrição Confirmada no {{run_name}}!',
    default_message: 'Prepare o tênis, {{user_name}}! Sua vaga na distância {{run_distance}} está garantida.',
    supported_variables: ['user_name', 'run_name', 'run_distance', 'run_date'],
    suggested_action_target: 'corridas'
  },
  {
    template_key: 'RUN_REMINDER',
    name: 'Lembrete do Evento MerMi Run',
    category: 'MERMI_RUN',
    default_title: 'Contagem regressiva para a largada! 🏁',
    default_message: 'O {{run_name}} acontece neste final de semana. A retirada do kit oficial já está aberta.',
    supported_variables: ['user_name', 'run_name', 'kit_location'],
    suggested_action_target: 'corridas'
  },
  {
    template_key: 'WATER_REMINDER',
    name: 'Lembrete de Hidratação',
    category: 'SAUDE_BEM_ESTAR',
    default_title: '💧 Hora de se hidratar!',
    default_message: 'Mantenha sua meta diária de água ativa. Que tal um copo agora?',
    supported_variables: ['user_name', 'current_water_ml', 'goal_water_ml'],
    suggested_action_target: 'agua'
  },
  {
    template_key: 'CART_ABANDONED',
    name: 'Recuperação de Carrinho',
    category: 'CAMPANHA',
    default_title: 'Seu almoço saudável ainda está te esperando! 🥗',
    default_message: 'Você selecionou refeições frescas no seu carrinho. Conclua para garantir a entrega de hoje.',
    supported_variables: ['user_name', 'cart_items_count', 'cart_total'],
    suggested_action_target: 'cardapio'
  },
  {
    template_key: 'CUSTOMER_REACTIVATION',
    name: 'Reativação de Cliente Inativo',
    category: 'CAMPANHA',
    default_title: 'Sentimos sua falta na rotina fit! 💚',
    default_message: 'Olá, {{user_name}}! Você possui {{points_balance}} MerMi Points prontos para resgatar na próxima marmita.',
    supported_variables: ['user_name', 'points_balance', 'favorite_dish'],
    suggested_action_target: 'cardapio'
  },
  {
    template_key: 'CHALLENGE_COMPLETED',
    name: 'Desafio Concluído',
    category: 'DESAFIOS',
    default_title: '🏆 Desafio Superado com Sucesso!',
    default_message: 'Incrível constância, {{user_name}}! Você completou a meta e conquistou sua medalha.',
    supported_variables: ['user_name', 'challenge_name', 'reward_points'],
    suggested_action_target: 'desafios'
  }
];

export const INITIAL_USER_NOTIFICATIONS: AppNotification[] = [];

export const INITIAL_USER_PREFERENCES: NotificationPreferences = {
  user_id: 'user-001',
  channels: {
    in_app: true,
    push: true,
    email: true,
    whatsapp: false
  },
  categories: {
    pedidos: true,
    pagamentos: true,
    entregas: true,
    points: true,
    recompensas: true,
    gamificacao: true,
    mermi_run: true,
    desafios: true,
    comunidade: true,
    saude_bem_estar: true,
    promocoes: true,
    campanhas: true,
    conteudo: true,
    habitos: true,
    resumo_diario: true,
    resumo_semanal: true
  },
  quiet_hours: {
    enabled: true,
    start: '22:00',
    end: '07:30',
    days: [0, 1, 2, 3, 4, 5, 6],
    allow_urgent: true
  }
};

export const INITIAL_AUTOMATIONS: NotificationAutomation[] = [
  {
    automation_id: 'auto-001',
    name: 'Confirmação Automática de Pedido',
    description: 'Dispara confirmação transacional imediata assim que um novo pedido for gerado no app.',
    status: 'ativa',
    trigger_event: 'ORDER_CREATED',
    conditions: [],
    audience: 'todos',
    channel: 'app',
    template_title: 'Pedido Recebido! 🥗',
    template_message: 'Olá, {{user_name}}! Seu pedido #{{order_number}} foi confirmado com sucesso.',
    action_type: 'deep_link',
    action_target: 'pedidos',
    approval_level: 1, // Automático Nível 1
    priority: 'urgente',
    frequency_limit_hours: 0,
    created_at: '2026-09-01T10:00:00Z',
    updated_at: '2026-09-01T10:00:00Z',
    metrics: {
      triggered_count: 142,
      sent_count: 142,
      opened_count: 138,
      converted_count: 142
    }
  },
  {
    automation_id: 'auto-002',
    name: 'Recuperação de Carrinho Abandonado',
    description: 'Envia lembrete amigável 3 horas após abandono de carrinho sem conceder desconto sem aprovação.',
    status: 'ativa',
    trigger_event: 'CART_ABANDONED',
    conditions: [
      { field: 'cart_items_count', operator: 'greater_than', value: 0 }
    ],
    audience: 'carrinho_abandonado',
    channel: 'push',
    template_title: 'Seu almoço saudável ainda está te esperando! 🥗',
    template_message: 'Olá, {{user_name}}! Suas marmitas selecionadas estão prontas para o preparo. Finalize seu pedido.',
    action_type: 'deep_link',
    action_target: 'cardapio',
    approval_level: 2, // Automático Nível 2
    priority: 'normal',
    frequency_limit_hours: 48,
    created_at: '2026-09-05T12:00:00Z',
    updated_at: '2026-09-10T14:30:00Z',
    metrics: {
      triggered_count: 28,
      sent_count: 24,
      opened_count: 16,
      converted_count: 9
    }
  },
  {
    automation_id: 'auto-003',
    name: 'Reativação de Cliente Inativo (15+ Dias)',
    description: 'Reativação personalizada com base no saldo real de Points e produtos favoritos do CRM.',
    status: 'ativa',
    trigger_event: 'CUSTOMER_INACTIVE',
    conditions: [
      { field: 'days_since_last_order', operator: 'greater_than', value: 14 }
    ],
    audience: 'inativos',
    channel: 'push',
    template_title: 'Sentimos sua falta na rotina saudável! 💚',
    template_message: 'Olá, {{user_name}}! Você possui {{points_balance}} MerMi Points prontos para resgatar na sua próxima marmita.',
    action_type: 'deep_link',
    action_target: 'cardapio',
    approval_level: 2,
    priority: 'normal',
    frequency_limit_hours: 72,
    created_at: '2026-09-08T09:00:00Z',
    updated_at: '2026-09-12T11:00:00Z',
    metrics: {
      triggered_count: 35,
      sent_count: 32,
      opened_count: 19,
      converted_count: 7
    }
  },
  {
    automation_id: 'auto-004',
    name: 'Lembrete de Hidratação da Tarde',
    description: 'Incentiva a meta de água no período vespertino com botões de registro rápido (+250ml / +500ml).',
    status: 'ativa',
    trigger_event: 'WATER_REMINDER',
    conditions: [],
    audience: 'ativos',
    channel: 'app',
    template_title: '💧 Hora de se hidratar!',
    template_message: 'Mantenha sua constância fit. Registre seu copo de água agora mesmo.',
    action_type: 'interactive',
    action_target: 'agua',
    approval_level: 2,
    priority: 'baixa',
    frequency_limit_hours: 4,
    created_at: '2026-09-02T08:00:00Z',
    updated_at: '2026-09-02T08:00:00Z',
    metrics: {
      triggered_count: 210,
      sent_count: 204,
      opened_count: 165,
      converted_count: 112
    }
  },
  {
    automation_id: 'auto-005',
    name: 'Lembrete Pré-Corrida MERMI RUN',
    description: 'Envia detalhes de retirada de kit e rota 48 horas antes da prova oficial.',
    status: 'ativa',
    trigger_event: 'RUN_REMINDER',
    conditions: [],
    audience: 'run',
    channel: 'push',
    template_title: '🏁 Faltam 2 dias para o {{run_name}}!',
    template_message: 'Olá, {{user_name}}! O kit atleta já está disponível para retirada na loja conceito.',
    action_type: 'deep_link',
    action_target: 'corridas',
    approval_level: 3, // Nível 3 - Requer validação operacional
    priority: 'alta',
    frequency_limit_hours: 24,
    created_at: '2026-09-15T10:00:00Z',
    updated_at: '2026-09-15T10:00:00Z',
    metrics: {
      triggered_count: 85,
      sent_count: 85,
      opened_count: 78,
      converted_count: 65
    }
  }
];

export const INITIAL_SMART_CAMPAIGNS: SmartCampaign[] = [
  {
    campaign_id: 'camp-smart-01',
    name: 'Festival Primavera Fit · Salmão & Grãos',
    description: 'Divulgação do novo lote de pratos da linha Fit Premium com bônus de 25 MerMi Points por refeição.',
    objective: 'lancamento',
    audience_segment: 'ativos',
    status: 'ativa',
    channels: ['app', 'push'],
    title_template: '🌸 Novo Cardápio Primavera Fit Liberado!',
    message_template: 'Experimente nossas receitas de Salmão com Crosta de Gergelim e ganhe +25 Points por prato.',
    image_asset_id: 'cardapio-banner-official',
    deep_link: 'cardapio',
    start_at: '2026-09-20T08:00:00Z',
    end_at: '2026-10-20T23:59:59Z',
    approval_level: 3,
    anti_spam_daily_limit: 1,
    metrics: {
      sent: 240,
      delivered: 236,
      opened: 142,
      clicked: 89,
      converted: 38,
      attributed_revenue: 1680.50,
      points_used: 950
    },
    created_by: 'Owner (Fernando Brasil)',
    created_at: '2026-09-18T14:00:00Z',
    updated_at: '2026-09-20T08:00:00Z'
  },
  {
    campaign_id: 'camp-smart-02',
    name: 'Reativação Clientes 20+ Dias sem Pedido',
    description: 'Campanha de lembrete com valorização dos pontos acumulados no ledger.',
    objective: 'reativacao',
    audience_segment: 'inativos',
    status: 'ativa',
    channels: ['push', 'email'],
    title_template: 'Sentimos sua falta na rotina fit 💚',
    message_template: 'Seus {{points_balance}} MerMi Points estão te esperando para descontos no almoço.',
    deep_link: 'cardapio',
    start_at: '2026-09-10T10:00:00Z',
    approval_level: 3,
    anti_spam_daily_limit: 1,
    metrics: {
      sent: 64,
      delivered: 62,
      opened: 31,
      clicked: 18,
      converted: 8,
      attributed_revenue: 352.00,
      points_used: 280
    },
    created_by: 'Gerente Marketing',
    created_at: '2026-09-10T10:00:00Z',
    updated_at: '2026-09-10T10:00:00Z'
  },
  {
    campaign_id: 'camp-smart-03',
    name: 'MERMI RUN Etapa Primavera 5K/10K',
    description: 'Comunicação oficial de abertura dos lotes de inscrição com kit atleta.',
    objective: 'mermi_run',
    audience_segment: 'run',
    status: 'ativa',
    channels: ['app', 'push'],
    title_template: '🏃 Inscrições Abertas: MERMI RUN 5K & 10K',
    message_template: 'Garanta sua camiseta oficial e medalha finisher. Pontos podem abater o valor do kit.',
    image_asset_id: 'mermi-run-banner-official',
    deep_link: 'corridas',
    start_at: '2026-09-15T09:00:00Z',
    end_at: '2026-10-30T18:00:00Z',
    approval_level: 4, // Nível 4: Alta relevância financeira
    anti_spam_daily_limit: 1,
    metrics: {
      sent: 310,
      delivered: 308,
      opened: 220,
      clicked: 145,
      converted: 62,
      attributed_revenue: 5518.00,
      points_used: 1200
    },
    created_by: 'Owner (Fernando Brasil)',
    created_at: '2026-09-14T11:00:00Z',
    updated_at: '2026-09-15T09:00:00Z'
  }
];

export const INITIAL_CART_ABANDONMENTS: CartAbandonmentRecord[] = [
  {
    user_id: 'user-002',
    user_name: 'Camila Rocha',
    user_email: 'camila.rocha@email.com',
    cart_items_count: 3,
    cart_total_value: 104.70,
    items_summary: ['Frango Fit 350g', 'Patinho com Batata Doce 350g', 'Salmão Grelhado 500g'],
    abandoned_at: new Date(Date.now() - 1000 * 60 * 60 * 3.5).toISOString(),
    recovery_notification_sent: true,
    recovered: false
  },
  {
    user_id: 'user-003',
    user_name: 'Lucas Martins',
    user_email: 'lucas.m@email.com',
    cart_items_count: 2,
    cart_total_value: 69.80,
    items_summary: ['2x Frango Fit 350g'],
    abandoned_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    recovery_notification_sent: true,
    recovered: true
  }
];
