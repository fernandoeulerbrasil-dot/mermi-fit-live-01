import React, { useState } from 'react';
import { useMermiStore } from '../../context/MermiStoreContext';
import {
  Insumo,
  InsumoCategoria,
  InsumoUnidade,
  StockMovementMotivo
} from '../../types/mermiFinanceOperations';
import {
  Package,
  AlertTriangle,
  Clock,
  Plus,
  Trash2,
  CheckCircle2,
  TrendingDown,
  Layers,
  History,
  ArrowDownLeft,
  ArrowUpRight,
  Filter,
  Search,
  Scale,
  Calendar,
  ShieldAlert,
  Info
} from 'lucide-react';

export const MermiEstoqueView: React.FC = () => {
  const {
    insumos,
    addInsumo,
    updateInsumo,
    deleteInsumo,
    adjustInsumoStock,
    registerInsumoEntry,
    registerInsumoExit,
    costHistory,
    stockMovements,
    fornecedores,
    currentAdminUser,
    showToast
  } = useMermiStore();

  const [activeTab, setActiveTab] = useState<'insumos' | 'movimentacoes' | 'historico_custos'>('insumos');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('todos');

  // Modal Novo Insumo
  const [isAddingInsumo, setIsAddingInsumo] = useState(false);
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState<InsumoCategoria>('proteina');
  const [unidade, setUnidade] = useState<InsumoUnidade>('KG');
  const [qtdAtual, setQtdAtual] = useState('');
  const [estMin, setEstMin] = useState('10');
  const [estMax, setEstMax] = useState('50');
  const [custoUnit, setCustoUnit] = useState('');
  const [fornecedor, setFornecedor] = useState('');
  const [lote, setLote] = useState('');
  const [validade, setValidade] = useState('');

  // Modal Ajuste Manual
  const [adjustingInsumo, setAdjustingInsumo] = useState<Insumo | null>(null);
  const [adjustNewQty, setAdjustNewQty] = useState('');
  const [adjustMotivo, setAdjustMotivo] = useState('');

  // Modal Entrada Rápida de Compra
  const [entryInsumo, setEntryInsumo] = useState<Insumo | null>(null);
  const [entryQty, setEntryQty] = useState('');
  const [entryUnitCost, setEntryUnitCost] = useState('');
  const [entryFornecedor, setEntryFornecedor] = useState('');
  const [entryLote, setEntryLote] = useState('');
  const [entryValidade, setEntryValidade] = useState('');
  const [entryNota, setEntryNota] = useState('');

  // Modal Saída / Baixa
  const [exitInsumo, setExitInsumo] = useState<Insumo | null>(null);
  const [exitQty, setExitQty] = useState('');
  const [exitMotivo, setExitMotivo] = useState<StockMovementMotivo>('perda');
  const [exitObs, setExitObs] = useState('');

  // Filtros de insumos
  const filteredInsumos = insumos.filter((item) => {
    const matchesSearch = item.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = filterCategory === 'todos' || item.categoria === filterCategory;
    return matchesSearch && matchesCat;
  });

  // KPIs de Estoque
  const totalInsumosCount = insumos.length;
  const lowStockCount = insumos.filter((i) => i.status === 'baixo').length;
  const criticalStockCount = insumos.filter((i) => i.status === 'critico').length;
  const totalStockValue = insumos.reduce((acc, i) => acc + (i.quantidade_atual * i.custo_unitario), 0);

  const handleCreateInsumo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome) {
      showToast('Preencha o nome do insumo.');
      return;
    }

    const currentQtyNum = parseFloat(qtdAtual) || 0;
    const minQtyNum = parseFloat(estMin) || 10;
    const status = currentQtyNum <= minQtyNum * 0.5 ? 'critico' : currentQtyNum <= minQtyNum ? 'baixo' : 'normal';

    addInsumo({
      nome,
      categoria,
      unidade_de_medida: unidade,
      quantidade_atual: currentQtyNum,
      estoque_minimo: minQtyNum,
      estoque_maximo: parseFloat(estMax) || 50,
      custo_unitario: parseFloat(custoUnit) || 0,
      fornecedor: fornecedor || 'Fornecedor Local',
      validade: validade || undefined,
      lote: lote || undefined,
      status
    });

    setNome('');
    setQtdAtual('');
    setCustoUnit('');
    setLote('');
    setValidade('');
    setIsAddingInsumo(false);
  };

  const handleSaveAdjust = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingInsumo) return;
    const newQty = parseFloat(adjustNewQty);
    if (isNaN(newQty) || newQty < 0) {
      showToast('Informe uma quantidade válida.');
      return;
    }
    if (!adjustMotivo) {
      showToast('O motivo do ajuste manual é obrigatório para auditoria.');
      return;
    }
    adjustInsumoStock(adjustingInsumo.id, newQty, adjustMotivo, currentAdminUser.name);
    setAdjustingInsumo(null);
    setAdjustNewQty('');
    setAdjustMotivo('');
  };

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!entryInsumo) return;
    const qty = parseFloat(entryQty);
    const unitPrice = parseFloat(entryUnitCost);
    if (isNaN(qty) || qty <= 0 || isNaN(unitPrice) || unitPrice <= 0) {
      showToast('Informe quantidade e custo de aquisição válidos.');
      return;
    }
    registerInsumoEntry(
      entryInsumo.id,
      qty,
      unitPrice,
      entryFornecedor || entryInsumo.fornecedor,
      entryLote,
      entryValidade,
      entryNota,
      currentAdminUser.name
    );
    setEntryInsumo(null);
    setEntryQty('');
    setEntryUnitCost('');
    setEntryLote('');
    setEntryValidade('');
    setEntryNota('');
  };

  const handleSaveExit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exitInsumo) return;
    const qty = parseFloat(exitQty);
    if (isNaN(qty) || qty <= 0) {
      showToast('Informe uma quantidade válida para a baixa.');
      return;
    }
    registerInsumoExit(
      exitInsumo.id,
      qty,
      exitMotivo,
      currentAdminUser.name,
      exitObs || `Baixa por ${exitMotivo}`
    );
    setExitInsumo(null);
    setExitQty('');
    setExitObs('');
  };

  return (
    <div className="space-y-6">
      {/* HEADER DE ESTOQUE COM KPIs */}
      <div className="bg-[#171E31] border border-stone-800 rounded-3xl p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
          <div>
            <span className="text-[10px] font-black uppercase text-[#0EB24A] tracking-wider font-['Outfit']">
              CONTROLE DE ESTOQUE, INSUMOS & LOTES · BLOCO 11
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white font-['Outfit'] mt-1">
              Inventário Físico & Custo Médio Ponderado
            </h2>
            <p className="text-xs text-stone-400">
              Controle rigoroso de entradas com recálculo automático de custo médio, saídas operacionais e alertas de reposição.
            </p>
          </div>

          <button
            onClick={() => setIsAddingInsumo(true)}
            className="px-3.5 py-2.5 rounded-2xl bg-[#0EB24A] hover:bg-[#0ca042] text-stone-950 font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Insumo</span>
          </button>
        </div>

        {/* 4 CARDS DE MÉTRICAS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-4 rounded-2xl bg-[#0E131F] border border-stone-800 space-y-1">
            <span className="text-stone-400 font-bold uppercase text-[10px]">Total de Insumos</span>
            <span className="text-xl font-black text-white font-mono block">{totalInsumosCount} itens</span>
            <span className="text-[10px] text-stone-500">Cadastrados no sistema</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#0E131F] border border-stone-800 space-y-1">
            <span className="text-stone-400 font-bold uppercase text-[10px]">Valor em Estoque</span>
            <span className="text-xl font-black text-emerald-400 font-mono block">
              R$ {totalStockValue.toFixed(2).replace('.', ',')}
            </span>
            <span className="text-[10px] text-stone-500">Valor estimado pelo custo médio</span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1">
            <span className="text-amber-300 font-bold uppercase text-[10px]">Estoque Baixo</span>
            <span className="text-xl font-black text-amber-400 font-mono block">{lowStockCount} itens</span>
            <span className="text-[10px] text-amber-200/80">Necessitam reposição</span>
          </div>

          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-1">
            <span className="text-rose-300 font-bold uppercase text-[10px]">Estoque Crítico</span>
            <span className="text-xl font-black text-rose-400 font-mono block">{criticalStockCount} itens</span>
            <span className="text-[10px] text-rose-200/80">Abaixo de 50% do mínimo</span>
          </div>
        </div>

        {/* SUB-TABS */}
        <div className="flex items-center gap-2 border-t border-stone-800 pt-3">
          {[
            { id: 'insumos', label: 'Tabela de Insumos', icon: Package },
            { id: 'movimentacoes', label: 'Movimentações (Entradas/Saídas)', icon: Layers },
            { id: 'historico_custos', label: 'Histórico de Preços de Compra', icon: History }
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

      {/* ========================================================================= */}
      {/* 1. TABELA DE INSUMOS */}
      {/* ========================================================================= */}
      {activeTab === 'insumos' && (
        <div className="bg-[#171E31] border border-stone-800 rounded-3xl p-6 shadow-xl space-y-4">
          {/* BARRA DE FILTROS & BUSCA */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar insumo por nome..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white text-xs outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <span className="text-stone-400 font-bold shrink-0">Categoria:</span>
              {[
                { id: 'todos', label: 'Todas' },
                { id: 'proteina', label: 'Proteínas' },
                { id: 'grao', label: 'Grãos' },
                { id: 'vegetal', label: 'Vegetais' },
                { id: 'embalagem', label: 'Embalagens' },
                { id: 'gordura', label: 'Azeites/Óleos' }
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setFilterCategory(c.id)}
                  className={`px-2.5 py-1.5 rounded-lg shrink-0 transition-all cursor-pointer font-semibold ${
                    filterCategory === c.id
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-stone-800 text-stone-400 hover:text-white'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* LISTAGEM DE INSUMOS */}
          <div className="space-y-3">
            {filteredInsumos.map((item) => {
              const valorTotalItem = item.quantidade_atual * item.custo_unitario;

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-[#0E131F] border border-stone-800/80 flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs shadow-md"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-black text-sm text-white font-['Outfit']">
                        {item.nome}
                      </span>

                      {/* BADGE DE STATUS */}
                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                          item.status === 'critico'
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                            : item.status === 'baixo'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        }`}
                      >
                        {item.status.toUpperCase()}
                      </span>

                      <span className="text-[10px] text-stone-400 uppercase font-bold">
                        {item.categoria}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-stone-400 text-[11px]">
                      <span>
                        Fornecedor: <strong className="text-stone-300">{item.fornecedor}</strong>
                      </span>
                      {item.lote && (
                        <span>
                          Lote: <strong className="text-stone-300 font-mono">{item.lote}</strong>
                        </span>
                      )}
                      {item.validade && (
                        <span>
                          Validade: <strong className="text-stone-300 font-mono">{item.validade}</strong>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* COLUNA DE VALORES & QUANTIDADES */}
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <span className="text-[10px] text-stone-500 uppercase block font-bold">
                        Estoque Atual
                      </span>
                      <span className="text-base font-black text-white font-mono">
                        {item.quantidade_atual} {item.unidade_de_medida}
                      </span>
                      <span className="text-[9px] text-stone-400 block">
                        Min: {item.estoque_minimo} | Max: {item.estoque_maximo}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-stone-500 uppercase block font-bold">
                        Custo Médio
                      </span>
                      <span className="text-sm font-black text-emerald-400 font-mono block">
                        R$ {item.custo_unitario.toFixed(2)}/{item.unidade_de_medida}
                      </span>
                      <span className="text-[9px] text-stone-400 block font-mono">
                        Total: R$ {valorTotalItem.toFixed(2)}
                      </span>
                    </div>

                    {/* AÇÕES OPERACIONAIS */}
                    <div className="flex items-center gap-1.5 border-l border-stone-800 pl-3">
                      <button
                        onClick={() => {
                          setEntryInsumo(item);
                          setEntryUnitCost(item.custo_unitario.toString());
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-emerald-950 text-emerald-300 hover:bg-emerald-900 border border-emerald-500/30 text-[11px] font-bold cursor-pointer"
                        title="Registrar nova compra e entrada"
                      >
                        + Entrada
                      </button>

                      <button
                        onClick={() => setExitInsumo(item)}
                        className="px-2.5 py-1.5 rounded-xl bg-stone-800 text-stone-300 hover:bg-stone-700 text-[11px] font-bold cursor-pointer"
                        title="Registrar saída operacional ou perda"
                      >
                        - Baixa
                      </button>

                      <button
                        onClick={() => {
                          setAdjustingInsumo(item);
                          setAdjustNewQty(item.quantidade_atual.toString());
                        }}
                        className="px-2 py-1.5 rounded-xl bg-stone-800 hover:bg-amber-950/60 text-stone-400 hover:text-amber-300 transition-colors text-[10px] font-bold cursor-pointer"
                        title="Ajuste manual de inventário"
                      >
                        Ajuste
                      </button>

                      <button
                        onClick={() => deleteInsumo(item.id)}
                        className="p-1.5 rounded-xl bg-stone-800 hover:bg-rose-900/60 text-stone-400 hover:text-rose-300 transition-colors cursor-pointer"
                        title="Excluir insumo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MOVIMENTAÇÕES DE ESTOQUE (ENTRADAS & SAÍDAS) */}
      {/* ========================================================================= */}
      {activeTab === 'movimentacoes' && (
        <div className="bg-[#171E31] border border-stone-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="border-b border-stone-800 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-white font-['Outfit']">
                Histórico Geral de Movimentações de Estoque
              </h3>
              <p className="text-xs text-stone-400">
                Toda entrada, saída ou ajuste gera registro imutável com data, responsável e motivo
              </p>
            </div>
            <span className="text-xs text-stone-400 font-mono">
              {stockMovements.length} movimentações
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {stockMovements.map((mov) => (
              <div
                key={mov.id}
                className="p-3.5 rounded-2xl bg-[#0E131F] border border-stone-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                        mov.tipo === 'entrada'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : mov.tipo === 'saida'
                          ? 'bg-rose-500/20 text-rose-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {mov.tipo.toUpperCase()} · {mov.motivo.toUpperCase()}
                    </span>
                    <span className="font-bold text-white text-sm">{mov.insumo_nome}</span>
                    <span className="text-[10px] text-stone-500">· {mov.data}</span>
                  </div>
                  {mov.observacoes && (
                    <p className="text-[11px] text-stone-400">{mov.observacoes}</p>
                  )}
                  <span className="text-[10px] text-stone-500 block">
                    Responsável: {mov.responsavel}
                  </span>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`text-sm font-black font-mono block ${
                      mov.tipo === 'entrada'
                        ? 'text-emerald-400'
                        : mov.tipo === 'saida'
                        ? 'text-rose-400'
                        : 'text-amber-400'
                    }`}
                  >
                    {mov.tipo === 'entrada' ? '+' : mov.tipo === 'saida' ? '-' : ''}
                    {mov.quantidade} {mov.unidade}
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono block">
                    R$ {mov.custo_total.toFixed(2)} (R$ {mov.custo_unitario.toFixed(2)}/{mov.unidade})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. HISTÓRICO DE CUSTOS DE AQUISIÇÃO (SEÇÃO 7) */}
      {/* ========================================================================= */}
      {activeTab === 'historico_custos' && (
        <div className="bg-[#171E31] border border-stone-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="border-b border-stone-800 pb-3">
            <span className="text-[10px] font-black uppercase text-[#0EB24A] tracking-wider font-['Outfit']">
              HISTÓRICO NÃO-DESTRUTIVO DE PREÇOS (SEÇÃO 7)
            </span>
            <h3 className="text-base font-black text-white font-['Outfit'] mt-1">
              Evolução dos Preços de Compra dos Insumos
            </h3>
            <p className="text-xs text-stone-400">
              O sistema não sobrescreve valores passados. Cada compra gera uma linha cronológica com o valor anterior e o novo valor de aquisição.
            </p>
          </div>

          <div className="space-y-2 text-xs">
            {costHistory.map((hist) => (
              <div
                key={hist.id}
                className="p-3.5 rounded-2xl bg-[#0E131F] border border-stone-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{hist.insumo_nome}</span>
                    <span className="text-[10px] text-stone-500 font-mono">· {hist.data}</span>
                  </div>
                  <span className="text-[11px] text-stone-400 block">
                    Fornecedor: <strong className="text-stone-300">{hist.fornecedor}</strong> · Lote: {hist.lote || 'N/A'}
                  </span>
                  <span className="text-[10px] text-stone-500 block">
                    Registrado por: {hist.responsavel}
                  </span>
                </div>

                <div className="text-right shrink-0">
                  <div className="flex items-center gap-2 justify-end">
                    <span className="text-stone-400 line-through font-mono">
                      R$ {hist.valor_anterior.toFixed(2)}
                    </span>
                    <span className="text-emerald-400 font-black text-sm font-mono">
                      → R$ {hist.novo_valor.toFixed(2)}/{hist.unidade}
                    </span>
                  </div>
                  <span className="text-[10px] text-stone-400 block">
                    Lote: {hist.quantidade} {hist.unidade} (Total: R$ {hist.custo_total.toFixed(2)})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: NOVO INSUMO */}
      {/* ========================================================================= */}
      {isAddingInsumo && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateInsumo}
            className="bg-[#171E31] border border-stone-700 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl"
          >
            <h3 className="text-base font-black text-white font-['Outfit']">
              Cadastrar Novo Insumo no Estoque
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-stone-300 font-bold block mb-1">Nome do Insumo</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Peito de Frango Desossado"
                  className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-stone-300 font-bold block mb-1">Categoria</label>
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                  >
                    <option value="proteina">Proteína</option>
                    <option value="grao">Grão / Cereal</option>
                    <option value="vegetal">Vegetal / Legume</option>
                    <option value="tempero">Tempero / Sal</option>
                    <option value="gordura">Azeite / Gordura</option>
                    <option value="embalagem">Embalagem</option>
                    <option value="etiqueta">Etiqueta</option>
                    <option value="descartavel">Descartável</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>

                <div>
                  <label className="text-stone-300 font-bold block mb-1">Unidade de Medida</label>
                  <select
                    value={unidade}
                    onChange={(e) => setUnidade(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white font-bold"
                  >
                    <option value="KG">Quilograma (KG)</option>
                    <option value="G">Grama (G)</option>
                    <option value="L">Litro (L)</option>
                    <option value="ML">Mililitro (ML)</option>
                    <option value="UNIDADE">Unidade (UN)</option>
                    <option value="PACOTE">Pacote</option>
                    <option value="CAIXA">Caixa</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-stone-300 font-bold block mb-1">Estoque Inicial</label>
                  <input
                    type="number"
                    step="0.1"
                    value={qtdAtual}
                    onChange={(e) => setQtdAtual(e.target.value)}
                    placeholder="Ex: 25"
                    className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="text-stone-300 font-bold block mb-1">Estoque Mínimo</label>
                  <input
                    type="number"
                    step="0.1"
                    value={estMin}
                    onChange={(e) => setEstMin(e.target.value)}
                    placeholder="Ex: 10"
                    className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="text-stone-300 font-bold block mb-1">Custo Médio (R$)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={custoUnit}
                    onChange={(e) => setCustoUnit(e.target.value)}
                    placeholder="Ex: 19.50"
                    className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-stone-300 font-bold block mb-1">Fornecedor Padrão</label>
                <input
                  type="text"
                  value={fornecedor}
                  onChange={(e) => setFornecedor(e.target.value)}
                  placeholder="Ex: Avícola Granja & Campo"
                  className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-stone-300 font-bold block mb-1">Lote</label>
                  <input
                    type="text"
                    value={lote}
                    onChange={(e) => setLote(e.target.value)}
                    placeholder="LT-102"
                    className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-stone-300 font-bold block mb-1">Validade</label>
                  <input
                    type="date"
                    value={validade}
                    onChange={(e) => setValidade(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingInsumo(false)}
                className="flex-1 py-2.5 rounded-xl bg-stone-800 text-stone-300 text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-[#0EB24A] text-stone-950 text-xs font-black"
              >
                Salvar Insumo
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: AJUSTE MANUAL DE ESTOQUE (SEÇÃO 22) */}
      {/* ========================================================================= */}
      {adjustingInsumo && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveAdjust}
            className="bg-[#171E31] border border-stone-700 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl"
          >
            <h3 className="text-base font-black text-white font-['Outfit']">
              Ajuste Manual de Inventário
            </h3>
            <p className="text-xs text-stone-400">
              Item: <strong className="text-white">{adjustingInsumo.nome}</strong>
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#0E131F] border border-stone-800 flex justify-between">
                <span className="text-stone-400">Quantidade Atual no Sistema:</span>
                <strong className="text-white font-mono">
                  {adjustingInsumo.quantidade_atual} {adjustingInsumo.unidade_de_medida}
                </strong>
              </div>

              <div>
                <label className="text-stone-300 font-bold block mb-1">
                  Nova Quantidade Contada
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={adjustNewQty}
                  onChange={(e) => setAdjustNewQty(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white font-mono text-sm"
                  required
                />
              </div>

              <div>
                <label className="text-stone-300 font-bold block mb-1">
                  Motivo Obrigatório do Ajuste (Auditoria)
                </label>
                <textarea
                  rows={2}
                  value={adjustMotivo}
                  onChange={(e) => setAdjustMotivo(e.target.value)}
                  placeholder="Ex: Contagem física semanal de fechamento com divergência de balança."
                  className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                  required
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setAdjustingInsumo(null)}
                className="flex-1 py-2 rounded-xl bg-stone-800 text-stone-300 text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-[#0EB24A] text-stone-950 text-xs font-black"
              >
                Confirmar Ajuste
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ENTRADA DE ESTOQUE (CUSTO MÉDIO PONDERADO) */}
      {/* ========================================================================= */}
      {entryInsumo && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveEntry}
            className="bg-[#171E31] border border-stone-700 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl"
          >
            <h3 className="text-base font-black text-white font-['Outfit']">
              Registrar Entrada de Compra
            </h3>
            <p className="text-xs text-stone-400">
              Insumo: <strong className="text-white">{entryInsumo.nome}</strong> ({entryInsumo.unidade_de_medida})
            </p>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-stone-300 font-bold block mb-1">Quantidade Recebida</label>
                  <input
                    type="number"
                    step="0.1"
                    value={entryQty}
                    onChange={(e) => setEntryQty(e.target.value)}
                    placeholder="Ex: 50"
                    className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="text-stone-300 font-bold block mb-1">Custo Compra (R$/un)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={entryUnitCost}
                    onChange={(e) => setEntryUnitCost(e.target.value)}
                    placeholder="Ex: 19.80"
                    className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-stone-300 font-bold block mb-1">Fornecedor da Nota</label>
                <input
                  type="text"
                  value={entryFornecedor}
                  onChange={(e) => setEntryFornecedor(e.target.value)}
                  placeholder={entryInsumo.fornecedor}
                  className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-stone-300 font-bold block mb-1">Lote</label>
                  <input
                    type="text"
                    value={entryLote}
                    onChange={(e) => setEntryLote(e.target.value)}
                    placeholder="LT-2026-X"
                    className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-stone-300 font-bold block mb-1">Validade</label>
                  <input
                    type="date"
                    value={entryValidade}
                    onChange={(e) => setEntryValidade(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEntryInsumo(null)}
                className="flex-1 py-2 rounded-xl bg-stone-800 text-stone-300 text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-[#0EB24A] text-stone-950 text-xs font-black"
              >
                Confirmar Entrada
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: SAÍDA / BAIXA OPERACIONAL */}
      {/* ========================================================================= */}
      {exitInsumo && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveExit}
            className="bg-[#171E31] border border-stone-700 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl"
          >
            <h3 className="text-base font-black text-white font-['Outfit']">
              Registrar Baixa de Estoque
            </h3>
            <p className="text-xs text-stone-400">
              Item: <strong className="text-white">{exitInsumo.nome}</strong> ({exitInsumo.quantidade_atual} {exitInsumo.unidade_de_medida} disponíveis)
            </p>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-stone-300 font-bold block mb-1">Quantidade</label>
                  <input
                    type="number"
                    step="0.1"
                    value={exitQty}
                    onChange={(e) => setExitQty(e.target.value)}
                    placeholder="Ex: 5"
                    className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="text-stone-300 font-bold block mb-1">Motivo da Baixa</label>
                  <select
                    value={exitMotivo}
                    onChange={(e) => setExitMotivo(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                  >
                    <option value="perda">Perda / Descarte</option>
                    <option value="avaria">Avaria de Embalagem</option>
                    <option value="vencimento">Vencimento</option>
                    <option value="uso_interno">Uso Interno / Degustação</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-stone-300 font-bold block mb-1">Observações / Detalhes</label>
                <textarea
                  rows={2}
                  value={exitObs}
                  onChange={(e) => setExitObs(e.target.value)}
                  placeholder="Ex: Alface que perdeu crocância por quebra na refrigeração."
                  className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setExitInsumo(null)}
                className="flex-1 py-2 rounded-xl bg-stone-800 text-stone-300 text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black"
              >
                Confirmar Baixa
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
