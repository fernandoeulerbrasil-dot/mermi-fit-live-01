import React, { useState } from 'react';
import { useMermiStore } from '../../context/MermiStoreContext';
import { FinancialTimeFilter } from '../../types/mermiFinanceOperations';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  FileText,
  DollarSign,
  Scale,
  Award,
  Filter,
  CheckCircle2,
  Info,
  Layers,
  ArrowUpRight
} from 'lucide-react';

export const MermiMargensRelatoriosView: React.FC = () => {
  const {
    getProdutosMargem,
    getDreGerencial,
    orders,
    transactions,
    crmCustomers,
    inventory,
    showToast
  } = useMermiStore();

  const [activeTab, setActiveTab] = useState<'margens' | 'relatorio_periodo'>('margens');
  const [filterPeriod, setFilterPeriod] = useState<FinancialTimeFilter>('30_dias');
  const [marginThreshold, setMarginThreshold] = useState<number>(40); // Limite de 40%

  const produtosMargem = getProdutosMargem();
  const dre = getDreGerencial(filterPeriod);

  // Alertas críticos
  const produtosAbaixoDoCusto = produtosMargem.filter((p) => p.alerta_preco_abaixo_custo);
  const produtosBaixaMargem = produtosMargem.filter(
    (p) => !p.alerta_preco_abaixo_custo && p.margem_bruta_percentual < marginThreshold
  );

  return (
    <div className="space-y-6">
      {/* HEADER DE MARGENS & RELATÓRIOS */}
      <div className="bg-[#171E31] border border-stone-800 rounded-3xl p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
          <div>
            <span className="text-[10px] font-black uppercase text-[#0EB24A] tracking-wider font-['Outfit']">
              CONTRIBUIÇÃO, MARGENS & RELATÓRIOS GERENCIAIS · BLOCO 11
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white font-['Outfit'] mt-1">
              Margem por Marmita & Relatórios por Período
            </h2>
            <p className="text-xs text-stone-400">
              Análise de contribuição de cada prato (350g vs 500g, Fit vs Fit Premium) com detecção preventiva de margem comprimida.
            </p>
          </div>

          {/* TABS */}
          <div className="flex items-center gap-2">
            {[
              { id: 'margens', label: 'Margem por Produto', icon: Scale },
              { id: 'relatorio_periodo', label: 'Relatório por Período', icon: FileText }
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
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

        {/* ALERTAS CRÍTICOS EM DESTAQUE (SEÇÃO 43 E 44) */}
        {produtosAbaixoDoCusto.length > 0 && (
          <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <h4 className="font-black text-rose-300 uppercase">
                ALERTA CRÍTICO: PRODUTOS COM PREÇO ABAIXO DO CUSTO
              </h4>
              <p className="text-stone-300 leading-relaxed text-[11px]">
                {produtosAbaixoDoCusto.length} produto(s) possuem preço de venda menor do que o custo direto cadastrado na ficha técnica. Conforme as regras de segurança, <strong>o sistema nunca altera preços automaticamente</strong>; revise a tabela mestre ou reduza o custo de aquisição dos insumos.
              </p>
            </div>
          </div>
        )}

        {produtosBaixaMargem.length > 0 && (
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-amber-300">
                PRODUTOS COM MARGEM ABAIXO DO LIMIAR DE {marginThreshold}%:
              </span>
              <p className="text-stone-300 text-[11px]">
                {produtosBaixaMargem.map((p) => `${p.nome} (${p.tamanho}) - ${p.margem_bruta_percentual.toFixed(1)}%`).join(' · ')}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 1. TABELA ANALÍTICA DE MARGEM POR PRODUTO */}
      {/* ========================================================================= */}
      {activeTab === 'margens' && (
        <div className="bg-[#171E31] border border-stone-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
            <div>
              <h3 className="text-base font-black text-white font-['Outfit']">
                Análise de Margem Bruta & Contribuição por Prato
              </h3>
              <p className="text-xs text-stone-400">
                Preço de venda e custo estimado armazenados separadamente
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-stone-400">Alerta de Margem &lt;</span>
              <input
                type="number"
                value={marginThreshold}
                onChange={(e) => setMarginThreshold(parseInt(e.target.value) || 40)}
                className="w-16 px-2 py-1 rounded-lg bg-stone-800 border border-stone-700 text-white font-mono text-center font-bold"
              />
              <span className="text-stone-400">%</span>
            </div>
          </div>

          <div className="space-y-3">
            {produtosMargem.map((prod) => (
              <div
                key={prod.produto_id}
                className={`p-4 rounded-2xl border transition-all ${
                  prod.alerta_preco_abaixo_custo
                    ? 'bg-rose-950/20 border-rose-500/50'
                    : prod.alerta_baixa_margem
                    ? 'bg-amber-950/20 border-amber-500/40'
                    : 'bg-[#0E131F] border-stone-800'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-white font-['Outfit']">
                        {prod.nome}
                      </span>
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-stone-800 text-stone-300">
                        {prod.linha === 'fit_premium' ? 'Fit Premium' : 'Linha Fit'} · {prod.tamanho}
                      </span>

                      {prod.alerta_preco_abaixo_custo && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-black text-[9px]">
                          PREÇO &lt; CUSTO
                        </span>
                      )}

                      {prod.alerta_baixa_margem && !prod.alerta_preco_abaixo_custo && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-black text-[9px]">
                          BAIXA MARGEM
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-stone-400 text-[11px] pt-1">
                      <span>
                        Vendas no Histórico: <strong className="text-white font-mono">{prod.quantidade_vendida} un</strong>
                      </span>
                      <span>
                        Receita Acumulada: <strong className="text-white font-mono">R$ {prod.receita_total.toFixed(2)}</strong>
                      </span>
                    </div>
                  </div>

                  {/* VALORES E MARGENS */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0 text-right">
                    <div className="p-2 rounded-xl bg-stone-900 border border-stone-800">
                      <span className="text-[9px] text-stone-500 uppercase block font-bold">Preço de Venda</span>
                      <span className="text-sm font-black text-white font-mono">
                        R$ {prod.preco_venda.toFixed(2)}
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-stone-900 border border-stone-800">
                      <span className="text-[9px] text-stone-500 uppercase block font-bold">Custo Estimado</span>
                      <span className="text-sm font-black text-rose-400 font-mono">
                        R$ {prod.custo_estimado.toFixed(2)}
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-stone-900 border border-stone-800">
                      <span className="text-[9px] text-stone-500 uppercase block font-bold">Margem Bruta</span>
                      <span
                        className={`text-sm font-black font-mono ${
                          prod.margem_bruta_reais >= 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        R$ {prod.margem_bruta_reais.toFixed(2)}
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-stone-900 border border-stone-800">
                      <span className="text-[9px] text-stone-500 uppercase block font-bold">Margem (%)</span>
                      <span
                        className={`text-sm font-black font-mono ${
                          prod.margem_bruta_percentual >= marginThreshold
                            ? 'text-emerald-400'
                            : prod.margem_bruta_percentual > 0
                            ? 'text-amber-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {prod.margem_bruta_percentual.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. RELATÓRIO CONSOLIDADO POR PERÍODO */}
      {/* ========================================================================= */}
      {activeTab === 'relatorio_periodo' && (
        <div className="bg-[#171E31] border border-stone-800 rounded-3xl p-6 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
            <div>
              <span className="text-[10px] font-black uppercase text-[#0EB24A] tracking-wider font-['Outfit']">
                RELATÓRIO CONSOLIDADO GERENCIAL
              </span>
              <h3 className="text-base font-black text-white font-['Outfit'] mt-1">
                Apuração Financeira e Operacional ({dre.periodoRotulo})
              </h3>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {(
                [
                  { id: 'hoje', label: 'Hoje' },
                  { id: 'ontem', label: 'Ontem' },
                  { id: '7_dias', label: '7 Dias' },
                  { id: '30_dias', label: '30 Dias' },
                  { id: 'mes_atual', label: 'Mês Atual' },
                  { id: 'ano', label: 'Ano' }
                ] as const
              ).map((p) => (
                <button
                  key={p.id}
                  onClick={() => setFilterPeriod(p.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    filterPeriod === p.id
                      ? 'bg-[#0EB24A] text-stone-950 font-black'
                      : 'bg-stone-800 text-stone-400 hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#0E131F] border border-stone-800 space-y-1">
              <span className="text-stone-400 font-bold block">Faturamento Bruto:</span>
              <strong className="text-emerald-400 text-lg font-mono">
                R$ {dre.faturamento_bruto.toFixed(2).replace('.', ',')}
              </strong>
            </div>

            <div className="p-4 rounded-2xl bg-[#0E131F] border border-stone-800 space-y-1">
              <span className="text-stone-400 font-bold block">Descontos & Devoluções:</span>
              <strong className="text-rose-400 text-lg font-mono">
                - R$ {(dre.descontos + dre.devolucoes_cancelamentos).toFixed(2).replace('.', ',')}
              </strong>
            </div>

            <div className="p-4 rounded-2xl bg-[#0E131F] border border-stone-800 space-y-1">
              <span className="text-stone-400 font-bold block">Receita Líquida:</span>
              <strong className="text-cyan-400 text-lg font-mono">
                R$ {dre.receita_liquida.toFixed(2).replace('.', ',')}
              </strong>
            </div>

            <div className="p-4 rounded-2xl bg-[#0E131F] border border-stone-800 space-y-1">
              <span className="text-stone-400 font-bold block">Custos Variáveis:</span>
              <strong className="text-rose-400 text-lg font-mono">
                - R$ {dre.custos_variaveis_totais.toFixed(2).replace('.', ',')}
              </strong>
            </div>

            <div className="p-4 rounded-2xl bg-[#0E131F] border border-stone-800 space-y-1">
              <span className="text-stone-400 font-bold block">Despesas Fixas Rateadas:</span>
              <strong className="text-rose-400 text-lg font-mono">
                - R$ {dre.despesas_operacionais_fixas.toFixed(2).replace('.', ',')}
              </strong>
            </div>

            <div
              className={`p-4 rounded-2xl border space-y-1 ${
                dre.status_resultado === 'positivo'
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                  : dre.status_resultado === 'negativo'
                  ? 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                  : 'bg-[#0E131F] border-stone-800 text-stone-300'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-bold block">Resultado Estimado:</span>
                <span className="text-[9px] uppercase font-black px-1.5 py-0.5 rounded-full bg-stone-900 border border-stone-700">
                  ESTIMADO
                </span>
              </div>
              <strong className="text-lg font-mono block">
                R$ {dre.resultado_operacional_estimado.toFixed(2).replace('.', ',')}
              </strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
