export type InsumoUnidade =
  | 'KG'
  | 'G'
  | 'L'
  | 'ML'
  | 'UNIDADE'
  | 'PACOTE'
  | 'CAIXA'
  | 'OUTRA';

export type InsumoCategoria =
  | 'proteina'
  | 'carboidrato'
  | 'vegetal'
  | 'grao'
  | 'tempero'
  | 'gordura'
  | 'embalagem'
  | 'etiqueta'
  | 'descartavel'
  | 'outro';

export type InsumoStatus = 'normal' | 'baixo' | 'critico' | 'vencendo' | 'vencido';

export interface Insumo {
  id: string;
  nome: string;
  categoria: InsumoCategoria;
  unidade_de_medida: InsumoUnidade;
  quantidade_atual: number;
  estoque_minimo: number;
  estoque_maximo: number;
  custo_unitario: number; // Custo médio ponderado
  fornecedor: string;
  validade?: string;
  lote?: string;
  status: InsumoStatus;
  data_de_cadastro: string;
  data_de_atualizacao: string;
}

export interface InsumoCostHistoryItem {
  id: string;
  insumo_id: string;
  insumo_nome: string;
  data: string;
  fornecedor: string;
  quantidade: number;
  unidade: InsumoUnidade;
  valor_anterior: number;
  novo_valor: number;
  custo_total: number;
  lote?: string;
  responsavel: string;
}

export type StockMovementTipo = 'entrada' | 'saida' | 'ajuste';
export type StockMovementMotivo =
  | 'compra'
  | 'producao'
  | 'perda'
  | 'avaria'
  | 'ajuste_manual'
  | 'uso_interno'
  | 'vencimento'
  | 'outro';

export interface StockMovement {
  id: string;
  data: string;
  insumo_id: string;
  insumo_nome: string;
  tipo: StockMovementTipo;
  motivo: StockMovementMotivo;
  quantidade: number;
  unidade: InsumoUnidade;
  quantidade_anterior?: number;
  nova_quantidade?: number;
  diferenca?: number;
  custo_unitario: number;
  custo_total: number;
  lote?: string;
  validade?: string;
  nota_fiscal?: string;
  fornecedor?: string;
  responsavel: string;
  observacoes?: string;
}

export interface FichaTecnicaIngrediente {
  id: string;
  insumo_id: string;
  insumo_nome: string;
  quantidade: number;
  unidade: InsumoUnidade;
  perda_percentual: number; // Ex: 8% perda de cocção / corte
  custo_unitario: number;
  custo_calculado: number; // quantidade com perda * custo_unitario
}

export interface FichaTecnicaEmbalagem {
  id: string;
  insumo_id: string;
  nome: string; // marmita, tampa, etiqueta, saco, talher, guardanapo, lacre
  quantidade: number;
  unidade: InsumoUnidade;
  custo_unitario: number;
  custo_calculado: number;
}

export interface FichaTecnica {
  id: string;
  produto_id: string;
  produto_nome: string;
  tamanho: '350g' | '500g';
  linha: 'fit' | 'fit_premium';
  ingredientes: FichaTecnicaIngrediente[];
  embalagens: FichaTecnicaEmbalagem[];
  custos_diretos_adicionais: number; // gás/etiqueta direta rateada
  rendimento_porcoes: number;
  custo_ingredientes_total: number;
  custo_embalagem_total: number;
  custo_total_estimado: number;
  observacoes: string;
  data_atualizacao: string;
}

export interface Fornecedor {
  id: string;
  nome: string;
  empresa: string;
  contato: string;
  telefone: string;
  email: string;
  categoria: string;
  produtos_fornecidos: string[];
  condicoes_pagamento: string;
  prazo_dias: number;
  observacoes?: string;
  status: 'ativo' | 'inativo';
}

export interface CompraItem {
  insumo_id: string;
  insumo_nome: string;
  quantidade: number;
  unidade: InsumoUnidade;
  custo_unitario: number;
  custo_total: number;
}

export type CompraStatus = 'RASCUNHO' | 'PEDIDO' | 'RECEBIDO' | 'PARCIAL' | 'CANCELADO';

export interface PedidoCompra {
  id: string;
  numero: string;
  data_criacao: string;
  data_previsao?: string;
  data_recebimento?: string;
  fornecedor_id: string;
  fornecedor_nome: string;
  itens: CompraItem[];
  valor_total: number;
  status: CompraStatus;
  responsavel: string;
  observacoes?: string;
}

export type OrdemProducaoStatus = 'PLANEJADA' | 'EM PRODUÇÃO' | 'PRODUZIDA' | 'CANCELADA';

export interface OrdemProducao {
  id: string;
  numero: string;
  data: string;
  produto_id: string;
  produto_nome: string;
  tamanho: '350g' | '500g';
  linha: 'fit' | 'fit_premium';
  quantidade_planejada: number;
  quantidade_produzida: number;
  quantidade_perdida: number;
  quantidade_descartada: number;
  status: OrdemProducaoStatus;
  responsavel: string;
  horario_inicio?: string;
  horario_fim?: string;
  custo_previsto: number;
  custo_real?: number;
  motivo_perda?: string;
  observacoes?: string;
}

export type DesperdicioCategoria =
  | 'ingrediente'
  | 'producao'
  | 'embalagem'
  | 'produto'
  | 'validade'
  | 'erro'
  | 'outro';

export interface DesperdicioRegistro {
  id: string;
  data: string;
  item_nome: string;
  categoria: DesperdicioCategoria;
  quantidade: number;
  unidade: InsumoUnidade;
  custo_estimado: number;
  motivo: string;
  responsavel: string;
}

export interface TaxaPagamento {
  id: string;
  metodo: 'PIX' | 'CARTAO_CREDITO' | 'CARTAO_DEBITO' | 'VALE_REFEICAO' | 'OUTRO';
  nome_exibicao: string;
  taxa_percentual: number;
  taxa_fixa: number;
  prazo_recebimento_dias: number;
  status: 'ativo' | 'inativo';
}

export interface CustoOperacionalItem {
  id: string;
  nome: string;
  categoria:
    | 'energia'
    | 'agua'
    | 'gas'
    | 'aluguel'
    | 'internet'
    | 'salarios'
    | 'servicos'
    | 'taxas'
    | 'manutencao'
    | 'marketing'
    | 'software'
    | 'outro';
  tipo: 'fixo' | 'variavel';
  valor_mensal_estimado: number;
  status: 'ativo' | 'inativo';
  observacoes?: string;
}

export type FinancialTimeFilter =
  | 'hoje'
  | 'ontem'
  | '7_dias'
  | '30_dias'
  | 'mes_atual'
  | 'mes_anterior'
  | 'trimestre'
  | 'ano'
  | 'personalizado';

export interface DreGerencial {
  periodoRotulo: string;
  faturamento_bruto: number;
  descontos: number;
  devolucoes_cancelamentos: number;
  receita_liquida: number;
  custo_ingredientes_embalagens: number;
  taxas_meios_pagamento: number;
  custo_real_entregas: number;
  custos_variaveis_totais: number;
  margem_contribuicao: number;
  margem_contribuicao_percentual: number;
  despesas_operacionais_fixas: number;
  resultado_operacional_estimado: number;
  status_resultado: 'positivo' | 'negativo' | 'zero';
  isEstimativa: boolean;
}

export interface SugestaoCompraIA {
  insumo_id: string;
  insumo_nome: string;
  estoque_atual: number;
  estoque_minimo: number;
  unidade: InsumoUnidade;
  consumo_medio_diario: number;
  necessidade_estimada: number;
  sugestao_compra: number;
  motivo: string;
  urgencia: 'critica' | 'alta' | 'media' | 'baixa';
}

export interface ProdutoMargemItem {
  produto_id: string;
  nome: string;
  linha: 'fit' | 'fit_premium';
  tamanho: '350g' | '500g';
  preco_venda: number;
  custo_estimado: number;
  margem_bruta_reais: number;
  margem_bruta_percentual: number;
  quantidade_vendida: number;
  receita_total: number;
  custo_total: number;
  resultado_estimado: number;
  alerta_preco_abaixo_custo: boolean;
  alerta_baixa_margem: boolean; // margem < 40%
}
