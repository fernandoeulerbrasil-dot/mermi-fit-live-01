import {
  Insumo,
  FichaTecnica,
  TaxaPagamento,
  CustoOperacionalItem,
  DreGerencial,
  FinancialTimeFilter,
  ProdutoMargemItem,
  SugestaoCompraIA,
  OrdemProducao
} from '../types/mermiFinanceOperations';
import { FoodProduct, OrderEntity } from '../types/food';
import { MarmitaPricing } from '../types';

export const filterOrdersByTime = (orders: OrderEntity[], filter: FinancialTimeFilter): OrderEntity[] => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const oneDayMs = 24 * 60 * 60 * 1000;

  return orders.filter((o) => {
    // If order has no valid created_at, treat as today
    const orderTime = o.created_at ? new Date(o.created_at).getTime() : now.getTime();

    switch (filter) {
      case 'hoje':
        return orderTime >= startOfDay;
      case 'ontem':
        return orderTime >= startOfDay - oneDayMs && orderTime < startOfDay;
      case '7_dias':
        return orderTime >= now.getTime() - 7 * oneDayMs;
      case '30_dias':
        return orderTime >= now.getTime() - 30 * oneDayMs;
      case 'mes_atual': {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
        return orderTime >= startOfMonth;
      }
      case 'mes_anterior': {
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime();
        const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
        return orderTime >= startOfLastMonth && orderTime < startOfThisMonth;
      }
      case 'trimestre':
        return orderTime >= now.getTime() - 90 * oneDayMs;
      case 'ano': {
        const startOfYear = new Date(now.getFullYear(), 0, 1).getTime();
        return orderTime >= startOfYear;
      }
      case 'personalizado':
      default:
        return true;
    }
  });
};

export const getPeriodDays = (filter: FinancialTimeFilter): number => {
  switch (filter) {
    case 'hoje':
    case 'ontem':
      return 1;
    case '7_dias':
      return 7;
    case '30_dias':
    case 'mes_atual':
    case 'mes_anterior':
      return 30;
    case 'trimestre':
      return 90;
    case 'ano':
      return 365;
    default:
      return 30;
  }
};

export const calculateDreGerencial = (
  allOrders: OrderEntity[],
  fichasTecnicas: FichaTecnica[],
  taxasPagamento: TaxaPagamento[],
  custosOperacionais: CustoOperacionalItem[],
  realDeliveryCostPerOrder: number = 6.5,
  filter: FinancialTimeFilter = '30_dias'
): DreGerencial => {
  const filteredOrders = filterOrdersByTime(allOrders, filter);
  const periodDays = getPeriodDays(filter);

  let faturamento_bruto = 0;
  let descontos = 0;
  let devolucoes_cancelamentos = 0;
  let custo_ingredientes_embalagens = 0;
  let taxas_meios_pagamento = 0;
  let validOrdersCount = 0;

  filteredOrders.forEach((order) => {
    const isCanceled = order.order_status === 'cancelado';
    const orderTotal = order.total || 0;

    if (isCanceled) {
      devolucoes_cancelamentos += orderTotal;
      return;
    }

    faturamento_bruto += orderTotal;
    validOrdersCount++;

    // Descontos aplicados (cupom / fidelidade)
    if (order.discount) {
      descontos += order.discount;
    }

    // Custo real dos produtos vendidos conforme ficha técnica
    order.items?.forEach((item) => {
      const itemSize = item.size || '350g';
      // Busca ficha técnica do prato pelo nome aproximado e tamanho
      const ft = fichasTecnicas.find(
        (f) =>
          (f.produto_nome.toLowerCase().includes(item.name.toLowerCase()) ||
            item.name.toLowerCase().includes(f.produto_nome.toLowerCase())) &&
          f.tamanho === itemSize
      );

      if (ft && ft.custo_total_estimado > 0) {
        custo_ingredientes_embalagens += ft.custo_total_estimado * item.quantity;
      } else {
        // Fallback estimado seguro de 40% do valor do item
        custo_ingredientes_embalagens += (item.unitPrice || 28) * 0.4 * item.quantity;
      }
    });

    // Taxa do meio de pagamento
    const paymentMethod = order.payment_method || 'pix';
    const matchedTaxa = taxasPagamento.find(
      (t) =>
        t.status === 'ativo' &&
        t.metodo.toLowerCase().includes(paymentMethod.toLowerCase())
    ) || { taxa_percentual: 1.5, taxa_fixa: 0.2 };

    taxas_meios_pagamento += (orderTotal * (matchedTaxa.taxa_percentual / 100)) + matchedTaxa.taxa_fixa;
  });

  const receita_liquida = Math.max(0, faturamento_bruto - descontos - devolucoes_cancelamentos);
  const custo_real_entregas = validOrdersCount * realDeliveryCostPerOrder;

  const custos_variaveis_totais =
    custo_ingredientes_embalagens + taxas_meios_pagamento + custo_real_entregas;

  const margem_contribuicao = receita_liquida - custos_variaveis_totais;
  const margem_contribuicao_percentual =
    receita_liquida > 0 ? (margem_contribuicao / receita_liquida) * 100 : 0;

  // Despesas operacionais fixas rateadas para os dias do período (mês base = 30 dias)
  const totalMensalFixo = custosOperacionais
    .filter((c) => c.status === 'ativo')
    .reduce((acc, c) => acc + c.valor_mensal_estimado, 0);

  const despesas_operacionais_fixas = (totalMensalFixo / 30) * periodDays;

  const resultado_operacional_estimado = margem_contribuicao - despesas_operacionais_fixas;

  const status_resultado: 'positivo' | 'negativo' | 'zero' =
    resultado_operacional_estimado > 0.01
      ? 'positivo'
      : resultado_operacional_estimado < -0.01
      ? 'negativo'
      : 'zero';

  const filterLabels: Record<FinancialTimeFilter, string> = {
    hoje: 'Hoje',
    ontem: 'Ontem',
    '7_dias': 'Últimos 7 Dias',
    '30_dias': 'Últimos 30 Dias',
    mes_atual: 'Mês Atual',
    mes_anterior: 'Mês Anterior',
    trimestre: 'Último Trimestre',
    ano: 'Ano Corrente',
    personalizado: 'Período Personalizado'
  };

  return {
    periodoRotulo: filterLabels[filter] || 'Período Analisado',
    faturamento_bruto,
    descontos,
    devolucoes_cancelamentos,
    receita_liquida,
    custo_ingredientes_embalagens,
    taxas_meios_pagamento,
    custo_real_entregas,
    custos_variaveis_totais,
    margem_contribuicao,
    margem_contribuicao_percentual,
    despesas_operacionais_fixas,
    resultado_operacional_estimado,
    status_resultado,
    isEstimativa: true
  };
};

export const calculateProdutosMargem = (
  products: FoodProduct[],
  pricing: MarmitaPricing[],
  fichasTecnicas: FichaTecnica[],
  orders: OrderEntity[]
): ProdutoMargemItem[] => {
  const result: ProdutoMargemItem[] = [];

  products.forEach((prod) => {
    ['350g', '500g'].forEach((sz) => {
      const size = sz as '350g' | '500g';
      const pricingEntry = pricing.find((p) => p.category === prod.line && p.size === size);
      const preco_venda = pricingEntry ? pricingEntry.price : prod.line === 'fit_premium' ? 36.9 : 28.9;

      const ft = fichasTecnicas.find(
        (f) =>
          (f.produto_id === prod.id ||
            f.produto_nome.toLowerCase().includes(prod.name.toLowerCase()) ||
            prod.name.toLowerCase().includes(f.produto_nome.toLowerCase())) &&
          f.tamanho === size
      );

      const custo_estimado = ft?.custo_total_estimado || prod.cost || (size === '350g' ? 7.5 : 9.5);
      const margem_bruta_reais = preco_venda - custo_estimado;
      const margem_bruta_percentual = preco_venda > 0 ? (margem_bruta_reais / preco_venda) * 100 : 0;

      // Calcular vendas históricas nos pedidos
      let quantidade_vendida = 0;
      orders.forEach((o) => {
        if (o.order_status === 'cancelado') return;
        o.items?.forEach((it) => {
          if (
            it.name.toLowerCase().includes(prod.name.toLowerCase()) ||
            prod.name.toLowerCase().includes(it.name.toLowerCase())
          ) {
            if ((it.size || '350g') === size) {
              quantidade_vendida += it.quantity;
            }
          }
        });
      });

      const receita_total = quantidade_vendida * preco_venda;
      const custo_total = quantidade_vendida * custo_estimado;
      const resultado_estimado = receita_total - custo_total;

      const alerta_preco_abaixo_custo = preco_venda < custo_estimado;
      const alerta_baixa_margem = margem_bruta_percentual < 40;

      result.push({
        produto_id: `${prod.id}_${size}`,
        nome: prod.name,
        linha: prod.line as 'fit' | 'fit_premium',
        tamanho: size,
        preco_venda,
        custo_estimado,
        margem_bruta_reais,
        margem_bruta_percentual,
        quantidade_vendida,
        receita_total,
        custo_total,
        resultado_estimado,
        alerta_preco_abaixo_custo,
        alerta_baixa_margem
      });
    });
  });

  return result;
};

export const calculateSugestoesCompraIA = (
  insumos: Insumo[],
  ordensProducao: OrdemProducao[],
  fichasTecnicas: FichaTecnica[]
): SugestaoCompraIA[] => {
  const sugestoes: SugestaoCompraIA[] = [];

  insumos.forEach((insumo) => {
    const isCritical = insumo.quantidade_atual <= insumo.estoque_minimo * 0.5;
    const isLow = insumo.quantidade_atual <= insumo.estoque_minimo;

    // Calcular consumo previsto nas ordens planejadas ou em produção
    let consumoFuturoPrevisto = 0;
    ordensProducao
      .filter((op) => op.status === 'PLANEJADA' || op.status === 'EM PRODUÇÃO')
      .forEach((op) => {
        const ft = fichasTecnicas.find(
          (f) =>
            (f.produto_id === op.produto_id || f.produto_nome.includes(op.produto_nome)) &&
            f.tamanho === op.tamanho
        );
        if (ft) {
          const ing = ft.ingredientes.find((i) => i.insumo_id === insumo.id);
          if (ing) {
            consumoFuturoPrevisto += ing.quantidade * op.quantidade_planejada;
          }
          const emb = ft.embalagens.find((e) => e.insumo_id === insumo.id);
          if (emb) {
            consumoFuturoPrevisto += emb.quantidade * op.quantidade_planejada;
          }
        }
      });

    const consumo_medio_diario = Math.max(1, insumo.estoque_minimo * 0.2);
    const necessidade_estimada = Math.max(
      0,
      insumo.estoque_maximo - insumo.quantidade_atual + consumoFuturoPrevisto
    );

    if (isCritical || isLow || insumo.quantidade_atual < consumoFuturoPrevisto) {
      const urgencia: SugestaoCompraIA['urgencia'] = isCritical
        ? 'critica'
        : isLow
        ? 'alta'
        : 'media';

      const sugestao_compra = Math.round(necessidade_estimada * 10) / 10;

      sugestoes.push({
        insumo_id: insumo.id,
        insumo_nome: insumo.nome,
        estoque_atual: insumo.quantidade_atual,
        estoque_minimo: insumo.estoque_minimo,
        unidade: insumo.unidade_de_medida,
        consumo_medio_diario,
        necessidade_estimada,
        sugestao_compra,
        motivo: isCritical
          ? `Estoque em nível crítico (${insumo.quantidade_atual} ${insumo.unidade_de_medida}) abaixo de 50% da margem de segurança de ${insumo.estoque_minimo} ${insumo.unidade_de_medida}.`
          : `Estoque abaixo do ponto de reposição (${insumo.quantidade_atual}/${insumo.estoque_minimo} ${insumo.unidade_de_medida}) com demanda prevista de ${consumoFuturoPrevisto.toFixed(1)} ${insumo.unidade_de_medida}.`,
        urgencia
      });
    }
  });

  return sugestoes.sort((a, b) => {
    const p: Record<string, number> = { critica: 4, alta: 3, media: 2, baixa: 1 };
    return (p[b.urgencia] || 0) - (p[a.urgencia] || 0);
  });
};
