import React, { useState } from 'react';
import { useMermiStore } from '../../context/MermiStoreContext';
import { FinancialTimeFilter, TaxaPagamento, CustoOperacionalItem } from '../../types/mermiFinanceOperations';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Calendar,
  CreditCard,
  Truck,
  Building,
  Award,
  Sparkles,
  Info,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Receipt
} from 'lucide-react';

export const MermiFinanceiroView: React.FC = () => {
  const {
    getDreGerencial,
    taxasPagamento,
    updateTaxaPagamento,
    custosOperacionais,
    addCustoOperacional,
    updateCustoOperacional,
    deleteCustoOperacional,
    realDeliveryCostSetting,
    updateRealDeliveryCostSetting,
    deliveryFeeSetting,
    freeDeliveryThreshold,
    transactions,
    raceEvents,
    drops,
    dropClaims,
    showToast
  } = useMermiStore();

  const [timeFilter, setTimeFilter] = useState<FinancialTimeFilter>('30_dias');
  const [activeSubTab, setActiveSubTab] = useState<'dre' | 'taxas' | 'custos_fixos' | 'ecossistema'>('dre');

  // Form novo custo fixo
  const [isAddingCusto, setIsAddingCusto] = useState(false);
  const [novoCustoNome, setNovoCustoNome] = useState('');
  const [novoCustoCategoria, setNovoCustoCategoria] = useState<CustoOperacionalItem['categoria']>('aluguel');
  const [novoCustoTipo, setNovoCustoTipo] = useState<'fixo' | 'variavel'>('fixo');
  const [novoCustoValor, setNovoCustoValor] = useState('');

  const dre = getDreGerencial(timeFilter);

  // Mermi Points - Custo Econômico Real das Recompensas Resgatadas
  const redemptionsTx = transactions.filter((t) => t.type === 'utilizado');
  const pointsRedeemedCount = redemptionsTx.reduce((acc, t) => acc + Math.abs(t.amount), 0);
  // Custo interno médio estimado por ponto resgatado (~ R$ 0,04 por ponto resgatado em marmitas/brindes)
  const estimatedPointsCost = pointsRedeemedCount * 0.04;

  // Drop Surpresa - Custo Estimado dos Brindes Distribuídos
  const totalDropClaimsCount = dropClaims.length;
  // Custo médio por claim de drop estimado em R$ 7,50 (marmita brinde ou acessório)
  const estimatedDropCost = totalDropClaimsCount * 7.5;

  // Mermi Run - Balanço Financeiro dos Eventos
  let totalRunRevenue = 0;
  let totalRunEstimatedCost = 0;
  raceEvents.forEach((ev) => {
    const regPrice = ev.categories?.[0]?.batches?.[0]?.price || 89;
    const filled = ev.filledSpots || 0;
    const eventRevenue = filled * regPrice;
    // Custo estimado de kit, medalha, chip e hidratação (~ R$ 42,00 por participante)
    const eventCost = filled * 42;
    totalRunRevenue += eventRevenue;
    totalRunEstimatedCost += eventCost;
  });
  const runEstimatedResult = totalRunRevenue - totalRunEstimatedCost;

  const handleSaveNovoCusto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoCustoNome || !novoCustoValor) {
      showToast('Preencha o nome e o valor estimado da despesa.');
      return;
    }
    addCustoOperacional({
      nome: novoCustoNome,
      categoria: novoCustoCategoria,
      tipo: novoCustoTipo,
      valor_mensal_estimado: parseFloat(novoCustoValor) || 0,
      status: 'ativo'
    });
    setNovoCustoNome('');
    setNovoCustoValor('');
    setIsAddingCusto(false);
  };

  return (
    <div className="space-y-6">
      {/* HEADER EXECUTIVO COM AVISO DE CONTABILIDADE GERENCIAL */}
      <div className="bg-[#171E31] border border-stone-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase text-[#0EB24A] tracking-wider font-['Outfit']">
                MÓDULO FINANCEIRO OFICIAL · MERMI CONTROL
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-[9px] uppercase">
                ESTIMADO / GERENCIAL
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-['Outfit'] mt-1">
              Demonstrativo & Gestão de Resultados
            </h2>
            <p className="text-xs text-stone-400">
              Separação rigorosa entre Faturamento, Receita Líquida, Custos Variáveis, Margem de Contribuição e Resultado Operacional.
            </p>
          </div>

          {/* FILTROS DE TEMPO */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-[#0E131F] p-1.5 rounded-2xl border border-stone-800 text-xs font-bold">
            {(
              [
                { id: 'hoje', label: 'Hoje' },
                { id: 'ontem', label: 'Ontem' },
                { id: '7_dias', label: '7 Dias' },
                { id: '30_dias', label: '30 Dias' },
                { id: 'mes_atual', label: 'Mês Atual' },
                { id: 'mes_anterior', label: 'Mês Ant.' },
                { id: 'ano', label: 'Ano' }
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => setTimeFilter(t.id)}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  timeFilter === t.id
                    ? 'bg-[#0EB24A] text-stone-950 font-black shadow-sm'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* AVISO LEGAL DE CONTABILIDADE GERENCIAL (SEÇÃO 2 E 64 DO PROMPT) */}
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3 text-xs">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-stone-300 text-[11px] leading-relaxed">
            <strong className="text-amber-300">AVISO GERENCIAL:</strong> Este módulo fornece apuração gerencial baseada nos dados operacionais em tempo real. Não substitui balanço contábil nem escrituração fiscal oficial. Todos os valores de rateio e custo são identificados como <strong>ESTIMADOS</strong>.
          </p>
        </div>

        {/* SUB-TABS DO FINANCEIRO */}
        <div className="flex items-center gap-2 border-t border-stone-800/80 pt-3">
          {[
            { id: 'dre', label: 'DRE Simplificada', icon: Receipt },
            { id: 'taxas', label: 'Taxas & Logística', icon: CreditCard },
            { id: 'custos_fixos', label: 'Despesas Fixas', icon: Building },
            { id: 'ecossistema', label: 'Points, Drops & Run', icon: Award }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  active
                    ? 'bg-stone-800 text-emerald-400 border border-emerald-500/30'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. DRE SIMPLIFICADA (ESTIMADA) */}
      {/* ========================================================================= */}
      {activeSubTab === 'dre' && (
        <div className="space-y-6">
          {/* CARDS COM MÉTRICAS CENTRAIS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#171E31] border border-stone-800 rounded-3xl p-5 shadow-lg space-y-1">
              <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                Faturamento Bruto
              </span>
              <span className="text-2xl font-black text-white font-mono block">
                R$ {dre.faturamento_bruto.toFixed(2).replace('.', ',')}
              </span>
              <span className="text-[10px] text-stone-500">
                Total movimentado no período
              </span>
            </div>

            <div className="bg-[#171E31] border border-stone-800 rounded-3xl p-5 shadow-lg space-y-1">
              <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                Receita Líquida
              </span>
              <span className="text-2xl font-black text-cyan-400 font-mono block">
                R$ {dre.receita_liquida.toFixed(2).replace('.', ',')}
              </span>
              <span className="text-[10px] text-stone-500">
                Deduzidos descontos e cancelamentos
              </span>
            </div>

            <div className="bg-[#171E31] border border-stone-800 rounded-3xl p-5 shadow-lg space-y-1">
              <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                Margem de Contribuição
              </span>
              <span className="text-2xl font-black text-emerald-400 font-mono block">
                R$ {dre.margem_contribuicao.toFixed(2).replace('.', ',')}
              </span>
              <span className="text-[10px] text-emerald-500 font-bold">
                {dre.margem_contribuicao_percentual.toFixed(1)}% sobre a receita líquida
              </span>
            </div>

            <div
              className={`border rounded-3xl p-5 shadow-lg space-y-1 ${
                dre.status_resultado === 'positivo'
                  ? 'bg-emerald-950/30 border-emerald-500/40'
                  : dre.status_resultado === 'negativo'
                  ? 'bg-rose-950/30 border-rose-500/40'
                  : 'bg-[#171E31] border-stone-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-black text-stone-300 tracking-wider">
                  Resultado Operacional
                </span>
                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-stone-900 border border-stone-700 text-stone-300">
                  ESTIMADO
                </span>
              </div>
              <span
                className={`text-2xl font-black font-mono block ${
                  dre.status_resultado === 'positivo'
                    ? 'text-emerald-400'
                    : dre.status_resultado === 'negativo'
                    ? 'text-rose-400'
                    : 'text-stone-300'
                }`}
              >
                R$ {dre.resultado_operacional_estimado.toFixed(2).replace('.', ',')}
              </span>
              <span className="text-[10px] text-stone-400">
                {dre.status_resultado === 'positivo'
                  ? 'Lucro operacional gerencial estimado'
                  : dre.status_resultado === 'negativo'
                  ? 'Prejuízo operacional no período'
                  : 'Ponto de equilíbrio (Zero)'}
              </span>
            </div>
          </div>

          {/* DRE DETALHADA LINHA A LINHA */}
          <div className="bg-[#171E31] border border-stone-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="border-b border-stone-800 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-white font-['Outfit']">
                  Estrutura da DRE Simplificada ({dre.periodoRotulo})
                </h3>
                <p className="text-xs text-stone-400">
                  Fluxo contábil-gerencial estruturado conforme princípios de contabilidade de custos
                </p>
              </div>
              <span className="text-xs text-stone-400 font-mono">
                Base: {dre.periodoRotulo}
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              {/* FATURAMENTO BRUTO */}
              <div className="p-3.5 rounded-2xl bg-[#0E131F] border border-stone-800 flex items-center justify-between text-white font-bold">
                <span className="font-sans text-stone-200">
                  (+) FATURAMENTO BRUTO DE VENDAS
                </span>
                <span className="text-emerald-400 text-sm">
                  R$ {dre.faturamento_bruto.toFixed(2).replace('.', ',')}
                </span>
              </div>

              {/* DEDUÇÕES */}
              <div className="pl-4 space-y-1.5 text-stone-400 text-[11px]">
                <div className="flex items-center justify-between py-1 border-b border-stone-800/50">
                  <span className="font-sans">(-) Descontos Comerciais & Cupons Aplicados</span>
                  <span className="text-rose-400">
                    - R$ {dre.descontos.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-stone-800/50">
                  <span className="font-sans">(-) Devoluções e Pedidos Cancelados</span>
                  <span className="text-rose-400">
                    - R$ {dre.devolucoes_cancelamentos.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              {/* RECEITA LÍQUIDA */}
              <div className="p-3 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 flex items-center justify-between font-bold text-cyan-300">
                <span className="font-sans">(=) RECEITA LÍQUIDA OPERACIONAL</span>
                <span className="text-cyan-400 text-sm">
                  R$ {dre.receita_liquida.toFixed(2).replace('.', ',')}
                </span>
              </div>

              {/* CUSTOS VARIÁVEIS */}
              <div className="pl-4 space-y-1.5 text-stone-400 text-[11px] pt-1">
                <div className="flex items-center justify-between py-1 border-b border-stone-800/50">
                  <span className="font-sans">(-) Custo Direto dos Insumos & Embalagens (Ficha Técnica)</span>
                  <span className="text-rose-400">
                    - R$ {dre.custo_ingredientes_embalagens.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-stone-800/50">
                  <span className="font-sans">(-) Taxas de Meios de Pagamento (PIX / Cartões / VR)</span>
                  <span className="text-rose-400">
                    - R$ {dre.taxas_meios_pagamento.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-stone-800/50">
                  <span className="font-sans">(-) Custo Real da Logística de Entrega (Motoboys)</span>
                  <span className="text-rose-400">
                    - R$ {dre.custo_real_entregas.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              {/* TOTAL CUSTOS VARIÁVEIS */}
              <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-between text-stone-300 text-xs">
                <span className="font-sans">(=) Total de Custos Variáveis</span>
                <span className="text-rose-400">
                  - R$ {dre.custos_variaveis_totais.toFixed(2).replace('.', ',')}
                </span>
              </div>

              {/* MARGEM DE CONTRIBUIÇÃO */}
              <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between font-bold text-emerald-300">
                <div className="font-sans">
                  <span>(=) MARGEM DE CONTRIBUIÇÃO</span>
                  <span className="text-[10px] text-emerald-400/80 block font-mono">
                    Margem: {dre.margem_contribuicao_percentual.toFixed(1)}%
                  </span>
                </div>
                <span className="text-emerald-400 text-base">
                  R$ {dre.margem_contribuicao.toFixed(2).replace('.', ',')}
                </span>
              </div>

              {/* DESPESAS FIXAS */}
              <div className="pl-4 space-y-1.5 text-stone-400 text-[11px] pt-1">
                <div className="flex items-center justify-between py-1 border-b border-stone-800/50">
                  <span className="font-sans">(-) Despesas Operacionais Fixas Rateadas (Cozinha, Energia, Equipe, Softwares)</span>
                  <span className="text-rose-400">
                    - R$ {dre.despesas_operacionais_fixas.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              {/* RESULTADO OPERACIONAL FINAL */}
              <div
                className={`p-4 rounded-2xl border flex items-center justify-between font-black text-sm sm:text-base mt-2 ${
                  dre.status_resultado === 'positivo'
                    ? 'bg-emerald-950/50 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-900/20'
                    : dre.status_resultado === 'negativo'
                    ? 'bg-rose-950/50 border-rose-500 text-rose-300 shadow-lg shadow-rose-900/20'
                    : 'bg-stone-900 border-stone-700 text-stone-300'
                }`}
              >
                <div>
                  <span className="font-sans uppercase">
                    (=) RESULTADO OPERACIONAL ESTIMADO
                  </span>
                  <span className="text-[10px] text-stone-400 font-sans block font-normal">
                    {dre.status_resultado === 'positivo'
                      ? 'Saldo positivo gerado pelas operações no período'
                      : 'Necessidade de aporte ou ajuste de despesas/preço'}
                  </span>
                </div>
                <span className="text-lg sm:text-xl font-mono">
                  R$ {dre.resultado_operacional_estimado.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. TAXAS DE PAGAMENTO & LOGÍSTICA DE ENTREGA */}
      {/* ========================================================================= */}
      {activeSubTab === 'taxas' && (
        <div className="space-y-6">
          {/* ENTREGA: TAXA COBRADA VS CUSTO REAL (SEÇÃO 18) */}
          <div className="bg-[#171E31] border border-stone-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="border-b border-stone-800 pb-3">
              <span className="text-[10px] font-black uppercase text-[#0EB24A] tracking-wider font-['Outfit']">
                LOGÍSTICA & SEPARAÇÃO DE CUSTOS DE ENTREGA
              </span>
              <h3 className="text-base font-black text-white font-['Outfit'] mt-1">
                Taxa Cobrada do Cliente vs. Custo Real Pago aos Motoboys
              </h3>
              <p className="text-xs text-stone-400">
                Separar a taxa cobrada no pedido do valor repassado ao entregador permite identificar com clareza o subsídio ou ganho logístico.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#0E131F] border border-stone-800 space-y-2">
                <span className="text-stone-400 font-bold block">Taxa Cobrada do Cliente:</span>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-mono text-lg font-black">
                    R$ {deliveryFeeSetting.toFixed(2)}
                  </span>
                </div>
                <span className="text-[10px] text-stone-500 block">
                  Configurado no Módulo de Preços
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#0E131F] border border-stone-800 space-y-2">
                <span className="text-stone-400 font-bold block">Custo Real Pago ao Motoboy:</span>
                <div className="flex items-center gap-2">
                  <span className="text-rose-400 font-mono text-lg font-black">
                    R$
                  </span>
                  <input
                    type="number"
                    step="0.50"
                    defaultValue={realDeliveryCostSetting}
                    onBlur={(e) => {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val) && val >= 0) updateRealDeliveryCostSetting(val);
                    }}
                    className="w-24 px-2 py-1 rounded-lg bg-stone-800 border border-stone-700 text-white font-mono text-right font-bold text-base"
                  />
                </div>
                <span className="text-[10px] text-stone-500 block">
                  Custo unitário repassado ao motoboy
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#0E131F] border border-stone-800 space-y-2">
                <span className="text-stone-400 font-bold block">Subsídio Logístico por Pedido:</span>
                <span
                  className={`text-lg font-black font-mono block ${
                    deliveryFeeSetting - realDeliveryCostSetting >= 0
                      ? 'text-emerald-400'
                      : 'text-amber-400'
                  }`}
                >
                  R$ {(deliveryFeeSetting - realDeliveryCostSetting).toFixed(2)}
                </span>
                <span className="text-[10px] text-stone-500 block">
                  {deliveryFeeSetting - realDeliveryCostSetting < 0
                    ? 'A empresa absorve a diferença como custo operacional'
                    : 'Logística superavitária por corrida'}
                </span>
              </div>
            </div>
          </div>

          {/* MEIOS DE PAGAMENTO (SEÇÃO 17) */}
          <div className="bg-[#171E31] border border-stone-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="border-b border-stone-800 pb-3">
              <span className="text-[10px] font-black uppercase text-[#0EB24A] tracking-wider font-['Outfit']">
                TAXAS DOS MEIOS DE PAGAMENTO
              </span>
              <h3 className="text-base font-black text-white font-['Outfit'] mt-1">
                Configuração de Taxas e Prazos de Recebimento
              </h3>
              <p className="text-xs text-stone-400">
                Altere taxas percentuais e fixas cobradas pelos adquirentes (gateways e maquininhas) para refletir o custo real na DRE.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {taxasPagamento.map((tp) => (
                <div
                  key={tp.id}
                  className="p-4 rounded-2xl bg-[#0E131F] border border-stone-800 space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                    <span className="font-bold text-white text-sm">{tp.nome_exibicao}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-stone-800 text-stone-300">
                      Prazo: {tp.prazo_recebimento_dias === 0 ? 'Imediato (D+0)' : `D+${tp.prazo_recebimento_dias}`}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-stone-400 block mb-1">Taxa Percentual (%):</label>
                      <input
                        type="number"
                        step="0.05"
                        defaultValue={tp.taxa_percentual}
                        onBlur={(e) => {
                          const val = parseFloat(e.target.value);
                          if (!isNaN(val) && val >= 0) updateTaxaPagamento(tp.id, { taxa_percentual: val });
                        }}
                        className="w-full px-2.5 py-1.5 rounded-xl bg-stone-800 border border-stone-700 text-white font-mono text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-stone-400 block mb-1">Taxa Fixa por Transação (R$):</label>
                      <input
                        type="number"
                        step="0.05"
                        defaultValue={tp.taxa_fixa}
                        onBlur={(e) => {
                          const val = parseFloat(e.target.value);
                          if (!isNaN(val) && val >= 0) updateTaxaPagamento(tp.id, { taxa_fixa: val });
                        }}
                        className="w-full px-2.5 py-1.5 rounded-xl bg-stone-800 border border-stone-700 text-white font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. DESPESAS FIXAS & OPERACIONAIS (SEÇÃO 14 E 16) */}
      {/* ========================================================================= */}
      {activeSubTab === 'custos_fixos' && (
        <div className="bg-[#171E31] border border-stone-800 rounded-3xl p-6 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
            <div>
              <span className="text-[10px] font-black uppercase text-[#0EB24A] tracking-wider font-['Outfit']">
                CUSTOS OPERACIONAIS & DESPESAS FIXAS
              </span>
              <h3 className="text-base font-black text-white font-['Outfit'] mt-1">
                Aluguel, Energia, Equipe, Softwares e Instalações
              </h3>
              <p className="text-xs text-stone-400">
                Despesas mensais rateadas na DRE para cálculo do resultado operacional real do negócio.
              </p>
            </div>

            <button
              onClick={() => setIsAddingCusto(true)}
              className="px-3.5 py-2 rounded-2xl bg-[#0EB24A] hover:bg-[#0ca042] text-stone-950 font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md"
            >
              + Adicionar Despesa
            </button>
          </div>

          <div className="space-y-3">
            {custosOperacionais.map((custo) => (
              <div
                key={custo.id}
                className="p-4 rounded-2xl bg-[#0E131F] border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{custo.nome}</span>
                    <span className="text-[9px] uppercase font-black px-2 py-0.5 rounded-full bg-stone-800 text-stone-400">
                      {custo.tipo} · {custo.categoria}
                    </span>
                  </div>
                  {custo.observacoes && (
                    <p className="text-[11px] text-stone-400 mt-1">{custo.observacoes}</p>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] text-stone-500 block uppercase">Custo Mensal</span>
                    <span className="text-base font-black text-white font-mono">
                      R$ {custo.valor_mensal_estimado.toFixed(2).replace('.', ',')}
                    </span>
                  </div>

                  <button
                    onClick={() => deleteCustoOperacional(custo.id)}
                    className="p-2 rounded-xl bg-stone-800 hover:bg-rose-900/60 text-stone-400 hover:text-rose-300 transition-colors cursor-pointer"
                    title="Excluir despesa"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* MODAL ADICIONAR DESPESA */}
          {isAddingCusto && (
            <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4">
              <form
                onSubmit={handleSaveNovoCusto}
                className="bg-[#171E31] border border-stone-700 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl"
              >
                <h3 className="text-base font-black text-white font-['Outfit']">
                  Cadastrar Despesa Operacional
                </h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-stone-300 font-bold block mb-1">Nome da Despesa</label>
                    <input
                      type="text"
                      value={novoCustoNome}
                      onChange={(e) => setNovoCustoNome(e.target.value)}
                      placeholder="Ex: Manutenção Preventiva dos Fornos"
                      className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-stone-300 font-bold block mb-1">Categoria</label>
                      <select
                        value={novoCustoCategoria}
                        onChange={(e) => setNovoCustoCategoria(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                      >
                        <option value="aluguel">Aluguel</option>
                        <option value="energia">Energia Elétrica</option>
                        <option value="gas">Gás Industrial</option>
                        <option value="agua">Água</option>
                        <option value="salarios">Salários / Equipe</option>
                        <option value="software">Softwares</option>
                        <option value="marketing">Marketing</option>
                        <option value="manutencao">Manutenção</option>
                        <option value="outro">Outro</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-stone-300 font-bold block mb-1">Tipo</label>
                      <select
                        value={novoCustoTipo}
                        onChange={(e) => setNovoCustoTipo(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                      >
                        <option value="fixo">Custo Fixo</option>
                        <option value="variavel">Custo Variável</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-stone-300 font-bold block mb-1">Valor Mensal Estimado (R$)</label>
                    <input
                      type="number"
                      step="10.00"
                      value={novoCustoValor}
                      onChange={(e) => setNovoCustoValor(e.target.value)}
                      placeholder="Ex: 850.00"
                      className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white font-mono"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingCusto(false)}
                    className="flex-1 py-2.5 rounded-xl bg-stone-800 text-stone-300 text-xs font-bold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#0EB24A] text-stone-950 text-xs font-black"
                  >
                    Salvar Despesa
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. CUSTOS DE POINTS, DROPS & MERMI RUN (SEÇÕES 48, 49 E 50) */}
      {/* ========================================================================= */}
      {activeSubTab === 'ecossistema' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* MERMI POINTS - CUSTO DAS RECOMPENSAS */}
            <div className="bg-[#171E31] border border-stone-800 rounded-3xl p-5 shadow-lg space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                <span className="font-black text-amber-300 uppercase tracking-wider text-[11px] font-['Outfit']">
                  MERMI POINTS · RECOMPENSAS
                </span>
                <span className="text-[9px] font-mono text-stone-500">SEÇÃO 48</span>
              </div>
              <p className="text-stone-400 text-[11px]">
                Custo de fabricação e insumos das recompensas resgatadas pelos clientes (não o valor de venda comercial).
              </p>
              <div className="p-3 rounded-2xl bg-[#0E131F] border border-stone-800 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-stone-400">Points Resgatados:</span>
                  <strong className="text-white font-mono">{pointsRedeemedCount} pts</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Custo Estimado Insumos:</span>
                  <strong className="text-rose-400 font-mono">
                    R$ {estimatedPointsCost.toFixed(2)}
                  </strong>
                </div>
              </div>
            </div>

            {/* MERMI DROP SURPRESA - CUSTO */}
            <div className="bg-[#171E31] border border-stone-800 rounded-3xl p-5 shadow-lg space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                <span className="font-black text-purple-300 uppercase tracking-wider text-[11px] font-['Outfit']">
                  DROP SURPRESA · BRINDES
                </span>
                <span className="text-[9px] font-mono text-stone-500">SEÇÃO 49</span>
              </div>
              <p className="text-stone-400 text-[11px]">
                Custo direto estimado dos brindes e marmitas gratuitas distribuídas nas campanhas de Drops.
              </p>
              <div className="p-3 rounded-2xl bg-[#0E131F] border border-stone-800 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-stone-400">Drops Resgatados:</span>
                  <strong className="text-white font-mono">{totalDropClaimsCount} resgates</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Custo Total dos Brindes:</span>
                  <strong className="text-rose-400 font-mono">
                    R$ {estimatedDropCost.toFixed(2)}
                  </strong>
                </div>
              </div>
            </div>

            {/* MERMI RUN - BALANÇO FINANCEIRO */}
            <div className="bg-[#171E31] border border-stone-800 rounded-3xl p-5 shadow-lg space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                <span className="font-black text-emerald-300 uppercase tracking-wider text-[11px] font-['Outfit']">
                  MERMI RUN · CORRIDAS
                </span>
                <span className="text-[9px] font-mono text-stone-500">SEÇÃO 50</span>
              </div>
              <p className="text-stone-400 text-[11px]">
                Inscrições arrecadadas (-) Custos diretos de kits, medalhas, hidratação e chipagem oficial.
              </p>
              <div className="p-3 rounded-2xl bg-[#0E131F] border border-stone-800 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-stone-400">Receita Inscrições:</span>
                  <strong className="text-emerald-400 font-mono">
                    R$ {totalRunRevenue.toFixed(2)}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Custos de Kits & Prova:</span>
                  <strong className="text-rose-400 font-mono">
                    - R$ {totalRunEstimatedCost.toFixed(2)}
                  </strong>
                </div>
                <div className="flex justify-between border-t border-stone-800 pt-1">
                  <span className="text-stone-300 font-bold">Resultado Estimado:</span>
                  <strong className="text-emerald-300 font-mono">
                    R$ {runEstimatedResult.toFixed(2)}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
