import {
  Insumo,
  InsumoCostHistoryItem,
  StockMovement,
  FichaTecnica,
  Fornecedor,
  PedidoCompra,
  OrdemProducao,
  DesperdicioRegistro,
  TaxaPagamento,
  CustoOperacionalItem
} from '../types/mermiFinanceOperations';

export const INITIAL_INSUMOS: Insumo[] = [
  {
    id: 'ins_frango',
    nome: 'Peito de Frango Desossado e Limpo',
    categoria: 'proteina',
    unidade_de_medida: 'KG',
    quantidade_atual: 42.5,
    estoque_minimo: 20,
    estoque_maximo: 80,
    custo_unitario: 19.0, // Custo médio ponderado
    fornecedor: 'Avícola Granja & Campo',
    validade: '2026-10-15',
    lote: 'LT-FR-8841',
    status: 'normal',
    data_de_cadastro: '2026-08-01',
    data_de_atualizacao: '2026-09-20'
  },
  {
    id: 'ins_patinho',
    nome: 'Carne Bovina Magra (Patinho Moído Extra)',
    categoria: 'proteina',
    unidade_de_medida: 'KG',
    quantidade_atual: 14.0,
    estoque_minimo: 15,
    estoque_maximo: 50,
    custo_unitario: 36.5,
    fornecedor: 'Frigorífico Prime Beef',
    validade: '2026-10-08',
    lote: 'LT-BOV-3012',
    status: 'baixo', // Abaixo do mínimo (14 < 15)
    data_de_cadastro: '2026-08-01',
    data_de_atualizacao: '2026-09-22'
  },
  {
    id: 'ins_salmao',
    nome: 'Filé de Salmão Fresco em Postas',
    categoria: 'proteina',
    unidade_de_medida: 'KG',
    quantidade_atual: 4.5,
    estoque_minimo: 10,
    estoque_maximo: 30,
    custo_unitario: 68.0,
    fornecedor: 'Pescados Mar Azul',
    validade: '2026-10-02',
    lote: 'LT-SLM-991',
    status: 'critico', // Estoque crítico (4.5 < 50% de 10)
    data_de_cadastro: '2026-08-01',
    data_de_atualizacao: '2026-09-24'
  },
  {
    id: 'ins_arroz_integral',
    nome: 'Arroz Cateto Integral',
    categoria: 'grao',
    unidade_de_medida: 'KG',
    quantidade_atual: 65.0,
    estoque_minimo: 30,
    estoque_maximo: 120,
    custo_unitario: 6.8,
    fornecedor: 'Grãos do Cerrado',
    validade: '2027-03-30',
    lote: 'LT-GR-104',
    status: 'normal',
    data_de_cadastro: '2026-08-01',
    data_de_atualizacao: '2026-09-18'
  },
  {
    id: 'ins_arroz_7graos',
    nome: 'Mix Especial 7 Grãos Funcional',
    categoria: 'grao',
    unidade_de_medida: 'KG',
    quantidade_atual: 22.0,
    estoque_minimo: 15,
    estoque_maximo: 60,
    custo_unitario: 14.5,
    fornecedor: 'Grãos do Cerrado',
    validade: '2027-02-15',
    lote: 'LT-7G-029',
    status: 'normal',
    data_de_cadastro: '2026-08-01',
    data_de_atualizacao: '2026-09-10'
  },
  {
    id: 'ins_feijao',
    nome: 'Feijão Preto Tipo 1 Selecionado',
    categoria: 'grao',
    unidade_de_medida: 'KG',
    quantidade_atual: 38.0,
    estoque_minimo: 20,
    estoque_maximo: 80,
    custo_unitario: 7.2,
    fornecedor: 'Grãos do Cerrado',
    validade: '2027-01-20',
    lote: 'LT-FJ-772',
    status: 'normal',
    data_de_cadastro: '2026-08-01',
    data_de_atualizacao: '2026-09-10'
  },
  {
    id: 'ins_brocolis',
    nome: 'Brócolis Ninja Fresco',
    categoria: 'vegetal',
    unidade_de_medida: 'KG',
    quantidade_atual: 18.0,
    estoque_minimo: 12,
    estoque_maximo: 45,
    custo_unitario: 9.8,
    fornecedor: 'Hortifruti Vale Verde',
    validade: '2026-10-05',
    lote: 'LT-VG-440',
    status: 'normal',
    data_de_cadastro: '2026-08-01',
    data_de_atualizacao: '2026-09-25'
  },
  {
    id: 'ins_legumes_mix',
    nome: 'Mix de Legumes (Cenoura, Vagem, Abobrinha)',
    categoria: 'vegetal',
    unidade_de_medida: 'KG',
    quantidade_atual: 25.0,
    estoque_minimo: 15,
    estoque_maximo: 60,
    custo_unitario: 7.5,
    fornecedor: 'Hortifruti Vale Verde',
    validade: '2026-10-04',
    lote: 'LT-VG-445',
    status: 'normal',
    data_de_cadastro: '2026-08-01',
    data_de_atualizacao: '2026-09-25'
  },
  {
    id: 'ins_azeite',
    nome: 'Azeite de Oliva Extravirgem 0.2% Acidez',
    categoria: 'gordura',
    unidade_de_medida: 'L',
    quantidade_atual: 12.0,
    estoque_minimo: 5,
    estoque_maximo: 30,
    custo_unitario: 42.0,
    fornecedor: 'Empório Especiarias & Azeites',
    validade: '2027-06-30',
    lote: 'LT-AZ-808',
    status: 'normal',
    data_de_cadastro: '2026-08-01',
    data_de_atualizacao: '2026-09-12'
  },
  {
    id: 'ins_temperos',
    nome: 'Mix de Ervas Finas, Alho e Sal Rosa',
    categoria: 'tempero',
    unidade_de_medida: 'KG',
    quantidade_atual: 8.5,
    estoque_minimo: 4,
    estoque_maximo: 20,
    custo_unitario: 24.0,
    fornecedor: 'Empório Especiarias & Azeites',
    validade: '2027-08-10',
    lote: 'LT-TP-22',
    status: 'normal',
    data_de_cadastro: '2026-08-01',
    data_de_atualizacao: '2026-09-12'
  },
  {
    id: 'ins_emb_350',
    nome: 'Pote Biodegradável Hermético 350g',
    categoria: 'embalagem',
    unidade_de_medida: 'UNIDADE',
    quantidade_atual: 480,
    estoque_minimo: 150,
    estoque_maximo: 1000,
    custo_unitario: 0.95,
    fornecedor: 'EcoPack Embalagens Sustentáveis',
    status: 'normal',
    data_de_cadastro: '2026-08-01',
    data_de_atualizacao: '2026-09-20'
  },
  {
    id: 'ins_emb_500',
    nome: 'Pote Biodegradável Hermético 500g',
    categoria: 'embalagem',
    unidade_de_medida: 'UNIDADE',
    quantidade_atual: 320,
    estoque_minimo: 120,
    estoque_maximo: 800,
    custo_unitario: 1.15,
    fornecedor: 'EcoPack Embalagens Sustentáveis',
    status: 'normal',
    data_de_cadastro: '2026-08-01',
    data_de_atualizacao: '2026-09-20'
  },
  {
    id: 'ins_tampa',
    nome: 'Tampa Hermética Antivazamento Transparente',
    categoria: 'embalagem',
    unidade_de_medida: 'UNIDADE',
    quantidade_atual: 850,
    estoque_minimo: 300,
    estoque_maximo: 2000,
    custo_unitario: 0.35,
    fornecedor: 'EcoPack Embalagens Sustentáveis',
    status: 'normal',
    data_de_cadastro: '2026-08-01',
    data_de_atualizacao: '2026-09-20'
  },
  {
    id: 'ins_etiqueta',
    nome: 'Etiqueta Adesiva Térmica com Tabela Nutricional',
    categoria: 'etiqueta',
    unidade_de_medida: 'UNIDADE',
    quantidade_atual: 1200,
    estoque_minimo: 400,
    estoque_maximo: 3000,
    custo_unitario: 0.18,
    fornecedor: 'EcoPack Embalagens Sustentáveis',
    status: 'normal',
    data_de_cadastro: '2026-08-01',
    data_de_atualizacao: '2026-09-20'
  },
  {
    id: 'ins_sacola',
    nome: 'Sacola Kraft Térmica MerMi Fit Life',
    categoria: 'descartavel',
    unidade_de_medida: 'UNIDADE',
    quantidade_atual: 290,
    estoque_minimo: 100,
    estoque_maximo: 800,
    custo_unitario: 1.25,
    fornecedor: 'EcoPack Embalagens Sustentáveis',
    status: 'normal',
    data_de_cadastro: '2026-08-01',
    data_de_atualizacao: '2026-09-20'
  },
  {
    id: 'ins_lacre',
    nome: 'Lacre de Segurança Oficial Anti-violação',
    categoria: 'embalagem',
    unidade_de_medida: 'UNIDADE',
    quantidade_atual: 1500,
    estoque_minimo: 500,
    estoque_maximo: 3000,
    custo_unitario: 0.08,
    fornecedor: 'EcoPack Embalagens Sustentáveis',
    status: 'normal',
    data_de_cadastro: '2026-08-01',
    data_de_atualizacao: '2026-09-20'
  }
];

export const INITIAL_COST_HISTORY: InsumoCostHistoryItem[] = [
  {
    id: 'ch_frango_1',
    insumo_id: 'ins_frango',
    insumo_nome: 'Peito de Frango Desossado e Limpo',
    data: '2026-07-15',
    fornecedor: 'Avícola Granja & Campo',
    quantidade: 40,
    unidade: 'KG',
    valor_anterior: 16.8,
    novo_valor: 17.5,
    custo_total: 700.0,
    lote: 'LT-FR-710',
    responsavel: 'Fernando Euler (OWNER)'
  },
  {
    id: 'ch_frango_2',
    insumo_id: 'ins_frango',
    insumo_nome: 'Peito de Frango Desossado e Limpo',
    data: '2026-08-18',
    fornecedor: 'Avícola Granja & Campo',
    quantidade: 50,
    unidade: 'KG',
    valor_anterior: 17.5,
    novo_valor: 18.2,
    custo_total: 910.0,
    lote: 'LT-FR-802',
    responsavel: 'Fernando Euler (OWNER)'
  },
  {
    id: 'ch_frango_3',
    insumo_id: 'ins_frango',
    insumo_nome: 'Peito de Frango Desossado e Limpo',
    data: '2026-09-20',
    fornecedor: 'Avícola Granja & Campo',
    quantidade: 50,
    unidade: 'KG',
    valor_anterior: 18.2,
    novo_valor: 19.0,
    custo_total: 950.0,
    lote: 'LT-FR-8841',
    responsavel: 'Fernando Euler (OWNER)'
  }
];

export const INITIAL_FORNECEDORES: Fornecedor[] = [
  {
    id: 'forn_granja',
    nome: 'Avícola Granja & Campo Ltda',
    empresa: 'Granja & Campo Alimentos',
    contato: 'Carlos Eduardo (Gerente Comercial)',
    telefone: '(11) 98765-4321',
    email: 'comercial@granjacampo.com.br',
    categoria: 'Proteínas Avícolas',
    produtos_fornecidos: ['Peito de frango', 'Sobrecoxa desossada', 'Ovos pasteurizados'],
    condicoes_pagamento: 'Boleto 21 dias',
    prazo_dias: 2,
    observacoes: 'Entrega pontual nas terças e sextas com laudo sanitário SIF.',
    status: 'ativo'
  },
  {
    id: 'forn_beef',
    nome: 'Frigorífico Prime Beef SP',
    empresa: 'Prime Beef Distribuidora de Carnes',
    contato: 'Roberto Silveira',
    telefone: '(11) 97654-3210',
    email: 'pedidos@primebeef.com.br',
    categoria: 'Carnes Bovinas Magras',
    produtos_fornecidos: ['Patinho moído', 'Alcatra magra', 'Filé mignon'],
    condicoes_pagamento: 'Boleto 14 dias',
    prazo_dias: 2,
    observacoes: 'Carne bovina resfriada em embalagem a vácuo com baixo teor lipídico.',
    status: 'ativo'
  },
  {
    id: 'forn_horti',
    nome: 'Hortifruti Vale Verde Orgânicos & Frescos',
    empresa: 'Vale Verde Distribuidora de Hortifruti',
    contato: 'Mariana Costa',
    telefone: '(11) 99123-4567',
    email: 'vendas@valeverdehorti.com.br',
    categoria: 'Vegetais e Hortaliças',
    produtos_fornecidos: ['Brócolis', 'Cenoura', 'Abobrinha', 'Vagem', 'Couve-flor'],
    condicoes_pagamento: 'Boleto 7 dias',
    prazo_dias: 1,
    observacoes: 'Entrega diária pela manhã com controle de frescor.',
    status: 'ativo'
  },
  {
    id: 'forn_graos',
    nome: 'Grãos do Cerrado Cereais & Leguminosas',
    empresa: 'Cerrado Alimentos Integrais',
    contato: 'Juliana Pires',
    telefone: '(11) 98234-5678',
    email: 'juliana@graoscerrado.com.br',
    categoria: 'Grãos e Cereais Integrais',
    produtos_fornecidos: ['Arroz integral', '7 Grãos', 'Feijão preto', 'Quinoa', 'Lentilha'],
    condicoes_pagamento: 'Boleto 28 dias',
    prazo_dias: 3,
    observacoes: 'Sacos de 25kg lacrados com certificação de pureza.',
    status: 'ativo'
  },
  {
    id: 'forn_ecopack',
    nome: 'EcoPack Embalagens Sustentáveis do Brasil',
    empresa: 'EcoPack Soluções em Embalagens',
    contato: 'Lucas Mendonça',
    telefone: '(11) 97111-2233',
    email: 'atendimento@ecopackbrasil.com.br',
    categoria: 'Embalagens e Descartáveis',
    produtos_fornecidos: ['Potes 350g e 500g', 'Tampas', 'Sacolas térmicas', 'Lacres'],
    condicoes_pagamento: 'Boleto 30 dias',
    prazo_dias: 4,
    observacoes: 'Polipropileno 100% reciclável e livre de BPA próprio para congelamento e micro-ondas.',
    status: 'ativo'
  },
  {
    id: 'forn_emporio',
    nome: 'Empório Especiarias & Azeites Finos',
    empresa: 'Mediterrâneo Importadora',
    contato: 'Sandra Alencar',
    telefone: '(11) 98999-8877',
    email: 'sandra@emporioespeciarias.com.br',
    categoria: 'Condimentos e Óleos Nobres',
    produtos_fornecidos: ['Azeite extravirgem', 'Sal rosa', 'Pimenta do reino', 'Ervas'],
    condicoes_pagamento: 'Boleto 21 dias',
    prazo_dias: 3,
    status: 'ativo'
  }
];

export const INITIAL_FICHAS_TECNICAS: FichaTecnica[] = [
  {
    id: 'ft_frango_fit_350',
    produto_id: 'prod_frango_fit_350',
    produto_nome: 'Frango Fit Clássico com Arroz Integral e Legumes',
    tamanho: '350g',
    linha: 'fit',
    ingredientes: [
      {
        id: 'fti_1',
        insumo_id: 'ins_frango',
        insumo_nome: 'Peito de Frango Desossado e Limpo',
        quantidade: 0.15, // 150g in natura
        unidade: 'KG',
        perda_percentual: 12, // 12% perda de cocção resultando em ~130g pronto
        custo_unitario: 19.0,
        custo_calculado: 2.85
      },
      {
        id: 'fti_2',
        insumo_id: 'ins_arroz_integral',
        insumo_nome: 'Arroz Cateto Integral',
        quantidade: 0.05, // 50g seco que vira ~110g cozido
        unidade: 'KG',
        perda_percentual: 0,
        custo_unitario: 6.8,
        custo_calculado: 0.34
      },
      {
        id: 'fti_3',
        insumo_id: 'ins_legumes_mix',
        insumo_nome: 'Mix de Legumes (Cenoura, Vagem, Abobrinha)',
        quantidade: 0.12, // 120g com 8% perda
        unidade: 'KG',
        perda_percentual: 8,
        custo_unitario: 7.5,
        custo_calculado: 0.90
      },
      {
        id: 'fti_4',
        insumo_id: 'ins_azeite',
        insumo_nome: 'Azeite de Oliva Extravirgem',
        quantidade: 0.008, // 8ml
        unidade: 'L',
        perda_percentual: 0,
        custo_unitario: 42.0,
        custo_calculado: 0.34
      },
      {
        id: 'fti_5',
        insumo_id: 'ins_temperos',
        insumo_nome: 'Mix de Ervas e Sal Rosa',
        quantidade: 0.005, // 5g
        unidade: 'KG',
        perda_percentual: 0,
        custo_unitario: 24.0,
        custo_calculado: 0.12
      }
    ],
    embalagens: [
      {
        id: 'fte_1',
        insumo_id: 'ins_emb_350',
        nome: 'Pote 350g Biodegradável',
        quantidade: 1,
        unidade: 'UNIDADE',
        custo_unitario: 0.95,
        custo_calculado: 0.95
      },
      {
        id: 'fte_2',
        insumo_id: 'ins_tampa',
        nome: 'Tampa Hermética',
        quantidade: 1,
        unidade: 'UNIDADE',
        custo_unitario: 0.35,
        custo_calculado: 0.35
      },
      {
        id: 'fte_3',
        insumo_id: 'ins_etiqueta',
        nome: 'Etiqueta com Tabela Nutricional',
        quantidade: 1,
        unidade: 'UNIDADE',
        custo_unitario: 0.18,
        custo_calculado: 0.18
      },
      {
        id: 'fte_4',
        insumo_id: 'ins_lacre',
        nome: 'Lacre de Segurança',
        quantidade: 1,
        unidade: 'UNIDADE',
        custo_unitario: 0.08,
        custo_calculado: 0.08
      }
    ],
    custos_diretos_adicionais: 0.45, // Rateio direto de gás de cocção e energia de ultracongelamento
    rendimento_porcoes: 1,
    custo_ingredientes_total: 4.55,
    custo_embalagem_total: 1.56,
    custo_total_estimado: 6.56,
    observacoes: 'Receita padronizada com frango marinado por 12h em ervas finas e limão.',
    data_atualizacao: '2026-09-24'
  },
  {
    id: 'ft_frango_fit_500',
    produto_id: 'prod_frango_fit_500',
    produto_nome: 'Frango Fit Clássico com Arroz Integral e Legumes',
    tamanho: '500g',
    linha: 'fit',
    ingredientes: [
      {
        id: 'fti_500_1',
        insumo_id: 'ins_frango',
        insumo_nome: 'Peito de Frango Desossado e Limpo',
        quantidade: 0.22, // 220g in natura
        unidade: 'KG',
        perda_percentual: 12,
        custo_unitario: 19.0,
        custo_calculado: 4.18
      },
      {
        id: 'fti_500_2',
        insumo_id: 'ins_arroz_integral',
        insumo_nome: 'Arroz Cateto Integral',
        quantidade: 0.075,
        unidade: 'KG',
        perda_percentual: 0,
        custo_unitario: 6.8,
        custo_calculado: 0.51
      },
      {
        id: 'fti_500_3',
        insumo_id: 'ins_legumes_mix',
        insumo_nome: 'Mix de Legumes (Cenoura, Vagem, Abobrinha)',
        quantidade: 0.17,
        unidade: 'KG',
        perda_percentual: 8,
        custo_unitario: 7.5,
        custo_calculado: 1.28
      },
      {
        id: 'fti_500_4',
        insumo_id: 'ins_azeite',
        insumo_nome: 'Azeite de Oliva Extravirgem',
        quantidade: 0.012,
        unidade: 'L',
        perda_percentual: 0,
        custo_unitario: 42.0,
        custo_calculado: 0.50
      },
      {
        id: 'fti_500_5',
        insumo_id: 'ins_temperos',
        insumo_nome: 'Mix de Ervas e Sal Rosa',
        quantidade: 0.007,
        unidade: 'KG',
        perda_percentual: 0,
        custo_unitario: 24.0,
        custo_calculado: 0.17
      }
    ],
    embalagens: [
      {
        id: 'fte_500_1',
        insumo_id: 'ins_emb_500',
        nome: 'Pote 500g Biodegradável',
        quantidade: 1,
        unidade: 'UNIDADE',
        custo_unitario: 1.15,
        custo_calculado: 1.15
      },
      {
        id: 'fte_500_2',
        insumo_id: 'ins_tampa',
        nome: 'Tampa Hermética',
        quantidade: 1,
        unidade: 'UNIDADE',
        custo_unitario: 0.35,
        custo_calculado: 0.35
      },
      {
        id: 'fte_500_3',
        insumo_id: 'ins_etiqueta',
        nome: 'Etiqueta com Tabela Nutricional',
        quantidade: 1,
        unidade: 'UNIDADE',
        custo_unitario: 0.18,
        custo_calculado: 0.18
      },
      {
        id: 'fte_500_4',
        insumo_id: 'ins_lacre',
        nome: 'Lacre de Segurança',
        quantidade: 1,
        unidade: 'UNIDADE',
        custo_unitario: 0.08,
        custo_calculado: 0.08
      }
    ],
    custos_diretos_adicionais: 0.60,
    rendimento_porcoes: 1,
    custo_ingredientes_total: 6.64,
    custo_embalagem_total: 1.76,
    custo_total_estimado: 9.00,
    observacoes: 'Porção hipertrofia com 48g de proteína total na marmita.',
    data_atualizacao: '2026-09-24'
  },
  {
    id: 'ft_patinho_fit_350',
    produto_id: 'prod_patinho_fit_350',
    produto_nome: 'Patinho Moído Magro com Arroz 7 Grãos e Brócolis',
    tamanho: '350g',
    linha: 'fit',
    ingredientes: [
      {
        id: 'fti_pat_1',
        insumo_id: 'ins_patinho',
        insumo_nome: 'Patinho Moído Extra',
        quantidade: 0.16,
        unidade: 'KG',
        perda_percentual: 15,
        custo_unitario: 36.5,
        custo_calculado: 5.84
      },
      {
        id: 'fti_pat_2',
        insumo_id: 'ins_arroz_7graos',
        insumo_nome: 'Mix Especial 7 Grãos',
        quantidade: 0.05,
        unidade: 'KG',
        perda_percentual: 0,
        custo_unitario: 14.5,
        custo_calculado: 0.73
      },
      {
        id: 'fti_pat_3',
        insumo_id: 'ins_brocolis',
        insumo_nome: 'Brócolis Ninja Fresco',
        quantidade: 0.12,
        unidade: 'KG',
        perda_percentual: 10,
        custo_unitario: 9.8,
        custo_calculado: 1.18
      },
      {
        id: 'fti_pat_4',
        insumo_id: 'ins_temperos',
        insumo_nome: 'Mix de Ervas e Sal Rosa',
        quantidade: 0.005,
        unidade: 'KG',
        perda_percentual: 0,
        custo_unitario: 24.0,
        custo_calculado: 0.12
      }
    ],
    embalagens: [
      {
        id: 'fte_pat_1',
        insumo_id: 'ins_emb_350',
        nome: 'Pote 350g Biodegradável',
        quantidade: 1,
        unidade: 'UNIDADE',
        custo_unitario: 0.95,
        custo_calculado: 0.95
      },
      {
        id: 'fte_pat_2',
        insumo_id: 'ins_tampa',
        nome: 'Tampa Hermética',
        quantidade: 1,
        unidade: 'UNIDADE',
        custo_unitario: 0.35,
        custo_calculado: 0.35
      },
      {
        id: 'fte_pat_3',
        insumo_id: 'ins_etiqueta',
        nome: 'Etiqueta com Tabela Nutricional',
        quantidade: 1,
        unidade: 'UNIDADE',
        custo_unitario: 0.18,
        custo_calculado: 0.18
      },
      {
        id: 'fte_pat_4',
        insumo_id: 'ins_lacre',
        nome: 'Lacre de Segurança',
        quantidade: 1,
        unidade: 'UNIDADE',
        custo_unitario: 0.08,
        custo_calculado: 0.08
      }
    ],
    custos_diretos_adicionais: 0.50,
    rendimento_porcoes: 1,
    custo_ingredientes_total: 7.87,
    custo_embalagem_total: 1.56,
    custo_total_estimado: 9.93,
    observacoes: 'Patinho de primeira selecionado, refogado sem óleo vegetal e com alho fresco.',
    data_atualizacao: '2026-09-24'
  },
  {
    id: 'ft_salmao_premium_350',
    produto_id: 'prod_salmao_premium_350',
    produto_nome: 'Salmão Grelhado com Alcaparras e Legumes Rústicos',
    tamanho: '350g',
    linha: 'fit_premium',
    ingredientes: [
      {
        id: 'fti_salm_1',
        insumo_id: 'ins_salmao',
        insumo_nome: 'Filé de Salmão Fresco em Postas',
        quantidade: 0.18, // 180g in natura
        unidade: 'KG',
        perda_percentual: 14,
        custo_unitario: 68.0,
        custo_calculado: 12.24
      },
      {
        id: 'fti_salm_2',
        insumo_id: 'ins_legumes_mix',
        insumo_nome: 'Mix de Legumes Nobres',
        quantidade: 0.14,
        unidade: 'KG',
        perda_percentual: 8,
        custo_unitario: 7.5,
        custo_calculado: 1.05
      },
      {
        id: 'fti_salm_3',
        insumo_id: 'ins_azeite',
        insumo_nome: 'Azeite de Oliva Extravirgem',
        quantidade: 0.015,
        unidade: 'L',
        perda_percentual: 0,
        custo_unitario: 42.0,
        custo_calculado: 0.63
      },
      {
        id: 'fti_salm_4',
        insumo_id: 'ins_temperos',
        insumo_nome: 'Mix de Ervas e Sal Rosa',
        quantidade: 0.006,
        unidade: 'KG',
        perda_percentual: 0,
        custo_unitario: 24.0,
        custo_calculado: 0.14
      }
    ],
    embalagens: [
      {
        id: 'fte_salm_1',
        insumo_id: 'ins_emb_350',
        nome: 'Pote 350g Biodegradável',
        quantidade: 1,
        unidade: 'UNIDADE',
        custo_unitario: 0.95,
        custo_calculado: 0.95
      },
      {
        id: 'fte_salm_2',
        insumo_id: 'ins_tampa',
        nome: 'Tampa Hermética',
        quantidade: 1,
        unidade: 'UNIDADE',
        custo_unitario: 0.35,
        custo_calculado: 0.35
      },
      {
        id: 'fte_salm_3',
        insumo_id: 'ins_etiqueta',
        nome: 'Etiqueta com Tabela Nutricional',
        quantidade: 1,
        unidade: 'UNIDADE',
        custo_unitario: 0.18,
        custo_calculado: 0.18
      },
      {
        id: 'fte_salm_4',
        insumo_id: 'ins_lacre',
        nome: 'Lacre de Segurança',
        quantidade: 1,
        unidade: 'UNIDADE',
        custo_unitario: 0.08,
        custo_calculado: 0.08
      }
    ],
    custos_diretos_adicionais: 0.70,
    rendimento_porcoes: 1,
    custo_ingredientes_total: 14.06,
    custo_embalagem_total: 1.56,
    custo_total_estimado: 16.32,
    observacoes: 'Posta nobre de salmão grelhada na chapa com crosta de gergelim opcional.',
    data_atualizacao: '2026-09-24'
  }
];

export const INITIAL_COMPRAS: PedidoCompra[] = [
  {
    id: 'comp_001',
    numero: 'PC-2026-089',
    data_criacao: '2026-09-20',
    data_recebimento: '2026-09-21',
    fornecedor_id: 'forn_granja',
    fornecedor_nome: 'Avícola Granja & Campo Ltda',
    itens: [
      {
        insumo_id: 'ins_frango',
        insumo_nome: 'Peito de Frango Desossado e Limpo',
        quantidade: 50,
        unidade: 'KG',
        custo_unitario: 19.0,
        custo_total: 950.0
      }
    ],
    valor_total: 950.0,
    status: 'RECEBIDO',
    responsavel: 'Fernando Euler (OWNER)',
    observacoes: 'Recebido com laudo SIF. Lote LT-FR-8841 abastecido no estoque.'
  },
  {
    id: 'comp_002',
    numero: 'PC-2026-090',
    data_criacao: '2026-09-21',
    data_recebimento: '2026-09-22',
    fornecedor_id: 'forn_ecopack',
    fornecedor_nome: 'EcoPack Embalagens Sustentáveis',
    itens: [
      {
        insumo_id: 'ins_emb_350',
        insumo_nome: 'Pote Biodegradável Hermético 350g',
        quantidade: 500,
        unidade: 'UNIDADE',
        custo_unitario: 0.95,
        custo_total: 475.0
      },
      {
        insumo_id: 'ins_tampa',
        insumo_nome: 'Tampa Hermética Antivazamento',
        quantidade: 500,
        unidade: 'UNIDADE',
        custo_unitario: 0.35,
        custo_total: 175.0
      }
    ],
    valor_total: 650.0,
    status: 'RECEBIDO',
    responsavel: 'Fernando Euler (OWNER)',
    observacoes: 'Caixas intactas conferidas pelo encarregado de estoque.'
  },
  {
    id: 'comp_003',
    numero: 'PC-2026-091',
    data_criacao: '2026-09-26',
    data_previsao: '2026-09-29',
    fornecedor_id: 'forn_beef',
    fornecedor_nome: 'Frigorífico Prime Beef SP',
    itens: [
      {
        insumo_id: 'ins_patinho',
        insumo_nome: 'Carne Bovina Magra (Patinho Moído Extra)',
        quantidade: 25,
        unidade: 'KG',
        custo_unitario: 36.5,
        custo_total: 912.5
      }
    ],
    valor_total: 912.5,
    status: 'PEDIDO',
    responsavel: 'Fernando Euler (OWNER)',
    observacoes: 'Pedido urgente gerado para reposição de estoque baixo.'
  }
];

export const INITIAL_ORDENS_PRODUCAO: OrdemProducao[] = [
  {
    id: 'op_001',
    numero: 'OP-2026-042',
    data: '2026-09-27',
    produto_id: 'prod_frango_fit_350',
    produto_nome: 'Frango Fit Clássico com Arroz Integral e Legumes',
    tamanho: '350g',
    linha: 'fit',
    quantidade_planejada: 35,
    quantidade_produzida: 35,
    quantidade_perdida: 0,
    quantidade_descartada: 0,
    status: 'PRODUZIDA',
    responsavel: 'Chef Marcos - Cozinha Central',
    horario_inicio: '07:30',
    horario_fim: '10:15',
    custo_previsto: 229.60,
    custo_real: 229.60,
    observacoes: 'Lote finalizado com sucesso e etiquetado para os pedidos do dia.'
  },
  {
    id: 'op_002',
    numero: 'OP-2026-043',
    data: '2026-09-27',
    produto_id: 'prod_patinho_fit_350',
    produto_nome: 'Patinho Moído Magro com Arroz 7 Grãos e Brócolis',
    tamanho: '350g',
    linha: 'fit',
    quantidade_planejada: 20,
    quantidade_produzida: 0,
    quantidade_perdida: 0,
    quantidade_descartada: 0,
    status: 'EM PRODUÇÃO',
    responsavel: 'Cozinheira Ana Paula',
    horario_inicio: '11:00',
    custo_previsto: 198.60,
    observacoes: 'Em fase de cocção das proteínas e porcionamento nos potes.'
  },
  {
    id: 'op_003',
    numero: 'OP-2026-044',
    data: '2026-09-28',
    produto_id: 'prod_salmao_premium_350',
    produto_nome: 'Salmão Grelhado com Alcaparras e Legumes Rústicos',
    tamanho: '350g',
    linha: 'fit_premium',
    quantidade_planejada: 15,
    quantidade_produzida: 0,
    quantidade_perdida: 0,
    quantidade_descartada: 0,
    status: 'PLANEJADA',
    responsavel: 'Chef Marcos - Cozinha Central',
    custo_previsto: 244.80,
    observacoes: 'Aguardando chegada das postas frescas de salmão.'
  }
];

export const INITIAL_DESPERDICIOS: DesperdicioRegistro[] = [
  {
    id: 'desp_001',
    data: '2026-09-25',
    item_nome: 'Cenoura e Abobrinha (Aparas)',
    categoria: 'ingrediente',
    quantidade: 1.2,
    unidade: 'KG',
    custo_estimado: 9.0,
    motivo: 'Aparas de casca e extremidades irregulares descartadas no pré-preparo.',
    responsavel: 'Auxiliar de Cozinha Thiago'
  },
  {
    id: 'desp_002',
    data: '2026-09-26',
    item_nome: 'Tampa Hermética Antivazamento',
    categoria: 'embalagem',
    quantidade: 3,
    unidade: 'UNIDADE',
    custo_estimado: 1.05,
    motivo: 'Tampas trincadas durante o transporte do fornecedor.',
    responsavel: 'Encarregado de Estoque Roberto'
  }
];

export const INITIAL_STOCK_MOVEMENTS: StockMovement[] = [
  {
    id: 'mov_001',
    data: '2026-09-21 09:30',
    insumo_id: 'ins_frango',
    insumo_nome: 'Peito de Frango Desossado e Limpo',
    tipo: 'entrada',
    motivo: 'compra',
    quantidade: 50,
    unidade: 'KG',
    custo_unitario: 19.0,
    custo_total: 950.0,
    lote: 'LT-FR-8841',
    validade: '2026-10-15',
    fornecedor: 'Avícola Granja & Campo',
    responsavel: 'Fernando Euler (OWNER)',
    observacoes: 'Entrada registrada via Pedido de Compra PC-2026-089'
  },
  {
    id: 'mov_002',
    data: '2026-09-22 14:15',
    insumo_id: 'ins_emb_350',
    insumo_nome: 'Pote Biodegradável Hermético 350g',
    tipo: 'entrada',
    motivo: 'compra',
    quantidade: 500,
    unidade: 'UNIDADE',
    custo_unitario: 0.95,
    custo_total: 475.0,
    fornecedor: 'EcoPack Embalagens',
    responsavel: 'Fernando Euler (OWNER)',
    observacoes: 'Entrada registrada via PC-2026-090'
  },
  {
    id: 'mov_003',
    data: '2026-09-27 10:15',
    insumo_id: 'ins_frango',
    insumo_nome: 'Peito de Frango Desossado e Limpo',
    tipo: 'saida',
    motivo: 'producao',
    quantidade: 5.25, // 35 marmitas x 0.15kg
    unidade: 'KG',
    custo_unitario: 19.0,
    custo_total: 99.75,
    responsavel: 'Chef Marcos',
    observacoes: 'Consumo real da Ordem de Produção OP-2026-042'
  },
  {
    id: 'mov_004',
    data: '2026-09-25 18:00',
    insumo_id: 'ins_legumes_mix',
    insumo_nome: 'Mix de Legumes',
    tipo: 'saida',
    motivo: 'perda',
    quantidade: 1.2,
    unidade: 'KG',
    custo_unitario: 7.5,
    custo_total: 9.0,
    responsavel: 'Auxiliar Thiago',
    observacoes: 'Descarte de aparas e folhas danificadas'
  }
];

export const INITIAL_TAXAS_PAGAMENTO: TaxaPagamento[] = [
  {
    id: 'tx_pix',
    metodo: 'PIX',
    nome_exibicao: 'PIX Instantâneo',
    taxa_percentual: 0.99,
    taxa_fixa: 0.0,
    prazo_recebimento_dias: 0,
    status: 'ativo'
  },
  {
    id: 'tx_credito',
    metodo: 'CARTAO_CREDITO',
    nome_exibicao: 'Cartão de Crédito (1x à vista)',
    taxa_percentual: 2.99,
    taxa_fixa: 0.39,
    prazo_recebimento_dias: 30,
    status: 'ativo'
  },
  {
    id: 'tx_debito',
    metodo: 'CARTAO_DEBITO',
    nome_exibicao: 'Cartão de Débito',
    taxa_percentual: 1.49,
    taxa_fixa: 0.19,
    prazo_recebimento_dias: 1,
    status: 'ativo'
  },
  {
    id: 'tx_vr',
    metodo: 'VALE_REFEICAO',
    nome_exibicao: 'Vale Refeição (VR / VA / Alelo / Sodexo)',
    taxa_percentual: 4.5,
    taxa_fixa: 0.5,
    prazo_recebimento_dias: 15,
    status: 'ativo'
  }
];

export const INITIAL_CUSTOS_OPERACIONAIS: CustoOperacionalItem[] = [
  {
    id: 'cop_aluguel',
    nome: 'Aluguel do Galpão da Cozinha Industrial',
    categoria: 'aluguel',
    tipo: 'fixo',
    valor_mensal_estimado: 3800.0,
    status: 'ativo',
    observacoes: 'Imóvel comercial com câmara fria e alvará sanitário.'
  },
  {
    id: 'cop_energia',
    nome: 'Energia Elétrica Comercial (Câmaras Frias & Ultracongelador)',
    categoria: 'energia',
    tipo: 'fixo',
    valor_mensal_estimado: 1250.0,
    status: 'ativo'
  },
  {
    id: 'cop_gas',
    nome: 'Gás Industrial GLP para Fogões e Caldeiras',
    categoria: 'gas',
    tipo: 'variavel',
    valor_mensal_estimado: 640.0,
    status: 'ativo'
  },
  {
    id: 'cop_agua',
    nome: 'Água e Saneamento',
    categoria: 'agua',
    tipo: 'fixo',
    valor_mensal_estimado: 380.0,
    status: 'ativo'
  },
  {
    id: 'cop_salarios',
    nome: 'Folha de Pagamento (Chef, Cozinheira, Auxiliar, Embalador)',
    categoria: 'salarios',
    tipo: 'fixo',
    valor_mensal_estimado: 7800.0,
    status: 'ativo'
  },
  {
    id: 'cop_softwares',
    nome: 'Sistemas de Gestão, Servidores & Hospedagem Segura',
    categoria: 'software',
    tipo: 'fixo',
    valor_mensal_estimado: 450.0,
    status: 'ativo'
  },
  {
    id: 'cop_marketing',
    nome: 'Investimento em Tráfego Local & Produção de Conteúdo Fit',
    categoria: 'marketing',
    tipo: 'fixo',
    valor_mensal_estimado: 1500.0,
    status: 'ativo'
  }
];
