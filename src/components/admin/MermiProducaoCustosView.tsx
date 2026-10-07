import React, { useState } from 'react';
import { useMermiStore } from '../../context/MermiStoreContext';
import {
  OrdemProducao,
  OrdemProducaoStatus,
  FichaTecnica,
  DesperdicioRegistro,
  DesperdicioCategoria
} from '../../types/mermiFinanceOperations';
import {
  ChefHat,
  Package,
  Clock,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Sparkles,
  UtensilsCrossed,
  Layers,
  ArrowRight,
  TrendingDown,
  Info
} from 'lucide-react';

export const MermiProducaoCustosView: React.FC = () => {
  const {
    ordensProducao,
    createOrdemProducao,
    updateOrdemProducaoStatus,
    deleteOrdemProducao,
    fichasTecnicas,
    createFichaTecnica,
    updateFichaTecnica,
    deleteFichaTecnica,
    desperdicios,
    registerDesperdicio,
    deleteDesperdicio,
    insumos,
    products,
    currentAdminUser,
    showToast
  } = useMermiStore();

  const [activeTab, setActiveTab] = useState<'ordens' | 'fichas_tecnicas' | 'desperdicio'>('ordens');

  // Modal Nova Ordem de Produção
  const [isCreatingOp, setIsCreatingOp] = useState(false);
  const [selectedDishId, setSelectedDishId] = useState('');
  const [opTamanho, setOpTamanho] = useState<'350g' | '500g'>('350g');
  const [opQtdPlanejada, setOpQtdPlanejada] = useState('30');
  const [opResponsavel, setOpResponsavel] = useState('Chef Marcos - Cozinha Central');
  const [opObs, setOpObs] = useState('');

  // Concluir OP (com quantidade real e perda)
  const [concludingOp, setConcludingOp] = useState<OrdemProducao | null>(null);
  const [producedQty, setProducedQty] = useState('');
  const [lostQty, setLostQty] = useState('0');
  const [lossReason, setLossReason] = useState('');

  // Modal Novo Desperdício Avulso
  const [isAddingDesp, setIsAddingDesp] = useState(false);
  const [despItemNome, setDespItemNome] = useState('');
  const [despCat, setDespCat] = useState<DesperdicioCategoria>('ingrediente');
  const [despQtd, setDespQtd] = useState('');
  const [despUnidade, setDespUnidade] = useState<'KG' | 'UNIDADE' | 'G' | 'L'>('KG');
  const [despCusto, setDespCusto] = useState('');
  const [despMotivo, setDespMotivo] = useState('');

  // Totais do dia
  const totalPlanejado = ordensProducao.reduce((acc, o) => acc + o.quantidade_planejada, 0);
  const totalProduzido = ordensProducao.reduce((acc, o) => acc + o.quantidade_produzida, 0);
  const totalPerdido = ordensProducao.reduce((acc, o) => acc + o.quantidade_perdida, 0);
  const totalDesperdicioCusto = desperdicios.reduce((acc, d) => acc + d.custo_estimado, 0);

  const handleSaveOp = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find((p) => p.id === selectedDishId) || products[0];
    const qtdPlan = parseInt(opQtdPlanejada) || 30;

    const matchedFt = fichasTecnicas.find(
      (f) =>
        (f.produto_id === prod?.id || f.produto_nome.includes(prod?.name || '')) &&
        f.tamanho === opTamanho
    );

    const custoUnitPrevisto = matchedFt?.custo_total_estimado || (opTamanho === '350g' ? 7.5 : 9.5);

    createOrdemProducao({
      numero: `OP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      data: new Date().toISOString().split('T')[0],
      produto_id: prod?.id || 'prod_default',
      produto_nome: prod?.name || 'Marmita Fit',
      tamanho: opTamanho,
      linha: (prod?.line as any) || 'fit',
      quantidade_planejada: qtdPlan,
      quantidade_produzida: 0,
      quantidade_perdida: 0,
      quantidade_descartada: 0,
      status: 'PLANEJADA',
      responsavel: opResponsavel || currentAdminUser.name,
      custo_previsto: qtdPlan * custoUnitPrevisto,
      observacoes: opObs
    });

    setIsCreatingOp(false);
    setOpObs('');
  };

  const handleConfirmConclusion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!concludingOp) return;
    const finalProduced = parseInt(producedQty) || concludingOp.quantidade_planejada;
    const finalLost = parseInt(lostQty) || 0;

    updateOrdemProducaoStatus(concludingOp.id, 'PRODUZIDA', finalProduced, finalLost, lossReason);
    setConcludingOp(null);
    setProducedQty('');
    setLostQty('0');
    setLossReason('');
  };

  const handleSaveDesperdicioAvulso = (e: React.FormEvent) => {
    e.preventDefault();
    if (!despItemNome || !despQtd) {
      showToast('Preencha o item e a quantidade descartada.');
      return;
    }
    registerDesperdicio({
      data: new Date().toISOString().split('T')[0],
      item_nome: despItemNome,
      categoria: despCat,
      quantidade: parseFloat(despQtd) || 0,
      unidade: despUnidade as any,
      custo_estimado: parseFloat(despCusto) || 0,
      motivo: despMotivo || 'Descarte no pré-preparo / cocção',
      responsavel: currentAdminUser.name
    });

    setDespItemNome('');
    setDespQtd('');
    setDespCusto('');
    setDespMotivo('');
    setIsAddingDesp(false);
  };

  return (
    <div className="space-y-6">
      {/* HEADER DE PRODUÇÃO & FICHAS TÉCNICAS */}
      <div className="bg-[#171E31] border border-stone-800 rounded-3xl p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
          <div>
            <span className="text-[10px] font-black uppercase text-[#0EB24A] tracking-wider font-['Outfit']">
              PLANEJAMENTO, FICHAS TÉCNICAS & DESPERDÍCIO · BLOCO 11
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white font-['Outfit'] mt-1">
              Produção & Fichas Técnicas dos Pratos
            </h2>
            <p className="text-xs text-stone-400">
              Cálculo exato de ingredientes e embalagens por tamanho (350g e 500g), baixas de estoque na conclusão e controle de perdas.
            </p>
          </div>

          <button
            onClick={() => setIsCreatingOp(true)}
            className="px-3.5 py-2.5 rounded-2xl bg-[#0EB24A] hover:bg-[#0ca042] text-stone-950 font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Criar Ordem de Produção (OP)</span>
          </button>
        </div>

        {/* 4 CARDS DE PRODUÇÃO */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-4 rounded-2xl bg-[#0E131F] border border-stone-800 space-y-1">
            <span className="text-stone-400 font-bold uppercase text-[10px]">Meta Planejada</span>
            <span className="text-xl font-black text-white font-mono block">{totalPlanejado} marmitas</span>
            <span className="text-[10px] text-stone-500">Nas OPs cadastradas</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#0E131F] border border-stone-800 space-y-1">
            <span className="text-stone-400 font-bold uppercase text-[10px]">Produzidas / Embaladas</span>
            <span className="text-xl font-black text-emerald-400 font-mono block">{totalProduzido} marmitas</span>
            <span className="text-[10px] text-stone-500">Prontas para expedição</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#0E131F] border border-stone-800 space-y-1">
            <span className="text-stone-400 font-bold uppercase text-[10px]">Perdas em Produção</span>
            <span className="text-xl font-black text-amber-400 font-mono block">{totalPerdido} un</span>
            <span className="text-[10px] text-stone-500">Descartadas na cozinha</span>
          </div>

          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-1">
            <span className="text-rose-300 font-bold uppercase text-[10px]">Custo de Desperdício</span>
            <span className="text-xl font-black text-rose-400 font-mono block">
              R$ {totalDesperdicioCusto.toFixed(2).replace('.', ',')}
            </span>
            <span className="text-[10px] text-rose-200/80">Perdas registradas no período</span>
          </div>
        </div>

        {/* SUB-TABS */}
        <div className="flex items-center gap-2 border-t border-stone-800 pt-3">
          {[
            { id: 'ordens', label: 'Ordens de Produção (OP)', icon: ChefHat, count: ordensProducao.length },
            { id: 'fichas_tecnicas', label: 'Fichas Técnicas das Marmitas', icon: Scale, count: fichasTecnicas.length },
            { id: 'desperdicio', label: 'Controle de Desperdício', icon: TrendingDown, count: desperdicios.length }
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
                <span className="px-1.5 py-0.2 rounded-full bg-stone-800 text-stone-400 text-[10px] font-mono">
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. ORDENS DE PRODUÇÃO (OP) */}
      {/* ========================================================================= */}
      {activeTab === 'ordens' && (
        <div className="space-y-4">
          {ordensProducao.map((op) => (
            <div
              key={op.id}
              className="bg-[#171E31] border border-stone-800 rounded-3xl p-5 shadow-lg space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-white font-['Outfit']">
                      {op.numero}
                    </span>
                    <span className="text-xs text-stone-400">· {op.data}</span>
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                        op.status === 'PRODUZIDA'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : op.status === 'EM PRODUÇÃO'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : op.status === 'PLANEJADA'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {op.status}
                    </span>
                    <span className="text-[10px] font-bold uppercase text-stone-400">
                      {op.linha.toUpperCase()} · {op.tamanho}
                    </span>
                  </div>
                  <h4 className="text-base font-black text-white font-['Outfit'] mt-1">
                    {op.produto_nome}
                  </h4>
                  <span className="text-xs text-stone-400 block mt-0.5">
                    Responsável: {op.responsavel} {op.horario_inicio ? `· Início: ${op.horario_inicio}` : ''}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {op.status !== 'PRODUZIDA' && (
                    <button
                      onClick={() => {
                        setConcludingOp(op);
                        setProducedQty(op.quantidade_planejada.toString());
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-black text-xs transition-colors cursor-pointer shadow-sm"
                    >
                      Concluir Produção
                    </button>
                  )}

                  <select
                    value={op.status}
                    onChange={(e) => updateOrdemProducaoStatus(op.id, e.target.value as OrdemProducaoStatus)}
                    className="px-3 py-1.5 rounded-xl bg-[#0E131F] border border-stone-700 text-xs font-bold text-white outline-none focus:border-emerald-500"
                  >
                    <option value="PLANEJADA">Planejada</option>
                    <option value="EM PRODUÇÃO">Em Produção</option>
                    <option value="PRODUZIDA">Produzida</option>
                    <option value="CANCELADA">Cancelada</option>
                  </select>

                  <button
                    onClick={() => deleteOrdemProducao(op.id)}
                    className="p-1.5 rounded-xl bg-stone-800 hover:bg-rose-900/60 text-stone-400 hover:text-rose-300 cursor-pointer"
                    title="Excluir OP"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* DADOS DE PRODUÇÃO: PREVISTO VS REAL (SEÇÃO 34) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#0E131F] border border-stone-800">
                  <span className="text-stone-500 text-[10px] uppercase block font-bold">Planejado</span>
                  <strong className="text-white text-sm font-mono">{op.quantidade_planejada} un</strong>
                </div>

                <div className="p-3 rounded-xl bg-[#0E131F] border border-stone-800">
                  <span className="text-stone-500 text-[10px] uppercase block font-bold">Produzido Real</span>
                  <strong className="text-emerald-400 text-sm font-mono">{op.quantidade_produzida} un</strong>
                </div>

                <div className="p-3 rounded-xl bg-[#0E131F] border border-stone-800">
                  <span className="text-stone-500 text-[10px] uppercase block font-bold">Perdas na Montagem</span>
                  <strong className="text-amber-400 text-sm font-mono">{op.quantidade_perdida} un</strong>
                </div>

                <div className="p-3 rounded-xl bg-[#0E131F] border border-stone-800">
                  <span className="text-stone-500 text-[10px] uppercase block font-bold">Custo Estimado</span>
                  <strong className="text-white text-sm font-mono">
                    R$ {(op.custo_real || op.custo_previsto).toFixed(2)}
                  </strong>
                </div>
              </div>

              {op.observacoes && (
                <p className="text-[11px] text-stone-400 pt-1 border-t border-stone-800">
                  <strong>Observações:</strong> {op.observacoes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. FICHAS TÉCNICAS (RECEITAS PADRONIZADAS - SEÇÕES 9 A 13) */}
      {/* ========================================================================= */}
      {activeTab === 'fichas_tecnicas' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-stone-300 text-[11px]">
              A Ficha Técnica calcula: <strong>Custo dos Ingredientes (com fator de perda de cocção) + Custo da Embalagem (pote, tampa, etiqueta, lacre) + Custos Diretos Rateados = Custo Estimado do Produto</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fichasTecnicas.map((ft) => (
              <div
                key={ft.id}
                className="bg-[#171E31] border border-stone-800 rounded-3xl p-5 shadow-lg space-y-4 text-xs"
              >
                <div className="flex items-start justify-between border-b border-stone-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {ft.linha.toUpperCase()} · {ft.tamanho}
                      </span>
                      <span className="text-[10px] text-stone-500 font-mono">
                        Atualizado: {ft.data_atualizacao}
                      </span>
                    </div>
                    <h4 className="text-base font-black text-white font-['Outfit'] mt-1">
                      {ft.produto_nome}
                    </h4>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-stone-500 uppercase font-bold block">
                      Custo Estimado
                    </span>
                    <span className="text-lg font-black text-emerald-400 font-mono">
                      R$ {ft.custo_total_estimado.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>

                {/* INGREDIENTES */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black uppercase text-stone-400 tracking-wider block">
                    Ingredientes & Perdas de Cocção
                  </span>
                  <div className="p-2.5 rounded-xl bg-[#0E131F] border border-stone-800 space-y-1 text-[11px]">
                    {ft.ingredientes.map((ing) => (
                      <div key={ing.id} className="flex justify-between text-stone-300">
                        <span>
                          {ing.insumo_nome} ({(ing.quantidade * 1000).toFixed(0)}g - {ing.perda_percentual}% perda)
                        </span>
                        <span className="font-mono text-emerald-400">
                          R$ {ing.custo_calculado.toFixed(2)}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between border-t border-stone-800/80 pt-1 text-stone-400 font-bold">
                      <span>Subtotal Ingredientes:</span>
                      <span className="font-mono text-emerald-400">
                        R$ {ft.custo_ingredientes_total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* EMBALAGENS */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black uppercase text-stone-400 tracking-wider block">
                    Embalagens & Descartáveis
                  </span>
                  <div className="p-2.5 rounded-xl bg-[#0E131F] border border-stone-800 space-y-1 text-[11px]">
                    {ft.embalagens.map((emb) => (
                      <div key={emb.id} className="flex justify-between text-stone-300">
                        <span>
                          {emb.nome} ({emb.quantidade} {emb.unidade})
                        </span>
                        <span className="font-mono text-emerald-400">
                          R$ {emb.custo_calculado.toFixed(2)}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between border-t border-stone-800/80 pt-1 text-stone-400 font-bold">
                      <span>Subtotal Embalagem:</span>
                      <span className="font-mono text-emerald-400">
                        R$ {ft.custo_embalagem_total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* RATEIO DIRETO */}
                <div className="flex justify-between text-stone-400 text-[11px] pt-1 border-t border-stone-800">
                  <span>Custos Diretos Adicionais (Gás/Energia Cocção):</span>
                  <span className="font-mono text-stone-300">
                    R$ {ft.custos_diretos_adicionais.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. CONTROLE DE DESPERDÍCIO (SEÇÃO 33) */}
      {/* ========================================================================= */}
      {activeTab === 'desperdicio' && (
        <div className="bg-[#171E31] border border-stone-800 rounded-3xl p-6 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
            <div>
              <span className="text-[10px] font-black uppercase text-[#0EB24A] tracking-wider font-['Outfit']">
                CONTROLE DE PERDAS E DESPERDÍCIO · SEÇÃO 33
              </span>
              <h3 className="text-base font-black text-white font-['Outfit'] mt-1">
                Registros de Perdas de Ingredientes, Embalagens e Cocção
              </h3>
              <p className="text-xs text-stone-400">
                Identificação do custo financeiro de cada descarte para alimentar relatórios de eficiência e indicadores de desperdício.
              </p>
            </div>

            <button
              onClick={() => setIsAddingDesp(true)}
              className="px-3.5 py-2 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md"
            >
              + Apontar Desperdício
            </button>
          </div>

          <div className="space-y-2 text-xs">
            {desperdicios.map((desp) => (
              <div
                key={desp.id}
                className="p-3.5 rounded-2xl bg-[#0E131F] border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      {desp.categoria.toUpperCase()}
                    </span>
                    <span className="font-bold text-white text-sm">{desp.item_nome}</span>
                    <span className="text-[10px] text-stone-500">· {desp.data}</span>
                  </div>
                  <p className="text-[11px] text-stone-300 leading-relaxed">
                    Motivo: {desp.motivo}
                  </p>
                  <span className="text-[10px] text-stone-500 block">
                    Registrado por: {desp.responsavel}
                  </span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-base font-black text-rose-400 font-mono block">
                      - {desp.quantidade} {desp.unidade}
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">
                      Custo: R$ {desp.custo_estimado.toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={() => deleteDesperdicio(desp.id)}
                    className="p-1.5 rounded-xl bg-stone-800 hover:bg-rose-900/60 text-stone-400 hover:text-rose-300 cursor-pointer"
                    title="Excluir registro"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* MODAL NOVO DESPERDÍCIO */}
          {isAddingDesp && (
            <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4">
              <form
                onSubmit={handleSaveDesperdicioAvulso}
                className="bg-[#171E31] border border-stone-700 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl"
              >
                <h3 className="text-base font-black text-white font-['Outfit']">
                  Apontar Perda / Desperdício
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-stone-300 font-bold block mb-1">Item Desperdiçado</label>
                    <input
                      type="text"
                      value={despItemNome}
                      onChange={(e) => setDespItemNome(e.target.value)}
                      placeholder="Ex: Legumes (Cenoura e Abobrinha)"
                      className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-stone-300 font-bold block mb-1">Categoria</label>
                      <select
                        value={despCat}
                        onChange={(e) => setDespCat(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                      >
                        <option value="ingrediente">Ingrediente</option>
                        <option value="producao">Produção / Cocção</option>
                        <option value="embalagem">Embalagem</option>
                        <option value="produto">Produto Acabado</option>
                        <option value="validade">Validade Expirada</option>
                        <option value="erro">Erro Operacional</option>
                        <option value="outro">Outro</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-stone-300 font-bold block mb-1">Unidade</label>
                      <select
                        value={despUnidade}
                        onChange={(e) => setDespUnidade(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                      >
                        <option value="KG">Quilograma (KG)</option>
                        <option value="UNIDADE">Unidade (UN)</option>
                        <option value="G">Grama (G)</option>
                        <option value="L">Litro (L)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-stone-300 font-bold block mb-1">Quantidade</label>
                      <input
                        type="number"
                        step="0.1"
                        value={despQtd}
                        onChange={(e) => setDespQtd(e.target.value)}
                        placeholder="Ex: 1.5"
                        className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white font-mono"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-stone-300 font-bold block mb-1">Custo Estimado (R$)</label>
                      <input
                        type="number"
                        step="0.10"
                        value={despCusto}
                        onChange={(e) => setDespCusto(e.target.value)}
                        placeholder="Ex: 12.50"
                        className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-stone-300 font-bold block mb-1">Motivo do Descarte</label>
                    <textarea
                      rows={2}
                      value={despMotivo}
                      onChange={(e) => setDespMotivo(e.target.value)}
                      placeholder="Ex: Aparas com excesso de casca e folhas amassadas no lote da manhã."
                      className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingDesp(false)}
                    className="flex-1 py-2 rounded-xl bg-stone-800 text-stone-300 text-xs font-bold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black"
                  >
                    Salvar Registro
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL CRIAR ORDEM DE PRODUÇÃO (OP) */}
      {/* ========================================================================= */}
      {isCreatingOp && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveOp}
            className="bg-[#171E31] border border-stone-700 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl"
          >
            <h3 className="text-base font-black text-white font-['Outfit']">
              Criar Ordem de Produção (OP)
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-stone-300 font-bold block mb-1">Prato a Produzir</label>
                <select
                  value={selectedDishId}
                  onChange={(e) => setSelectedDishId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                >
                  <option value="">Selecione o prato do cardápio...</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.line === 'fit_premium' ? 'Fit Premium' : 'Linha Fit'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-stone-300 font-bold block mb-1">Tamanho da Marmita</label>
                  <select
                    value={opTamanho}
                    onChange={(e) => setOpTamanho(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white font-bold"
                  >
                    <option value="350g">350g (Padrão)</option>
                    <option value="500g">500g (Hipertrofia)</option>
                  </select>
                </div>

                <div>
                  <label className="text-stone-300 font-bold block mb-1">Quantidade Planejada</label>
                  <input
                    type="number"
                    value={opQtdPlanejada}
                    onChange={(e) => setOpQtdPlanejada(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-stone-300 font-bold block mb-1">Responsável / Chef</label>
                <input
                  type="text"
                  value={opResponsavel}
                  onChange={(e) => setOpResponsavel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                />
              </div>

              <div>
                <label className="text-stone-300 font-bold block mb-1">Observações da Cozinha</label>
                <textarea
                  rows={2}
                  value={opObs}
                  onChange={(e) => setOpObs(e.target.value)}
                  placeholder="Ex: Turno da manhã, cocção no forno combinado com pouco sal."
                  className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreatingOp(false)}
                className="flex-1 py-2.5 rounded-xl bg-stone-800 text-stone-300 text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-[#0EB24A] text-stone-950 text-xs font-black"
              >
                Salvar Ordem
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL CONCLUIR ORDEM DE PRODUÇÃO (APONTAMENTO REAL) */}
      {/* ========================================================================= */}
      {concludingOp && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleConfirmConclusion}
            className="bg-[#171E31] border border-stone-700 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl"
          >
            <h3 className="text-base font-black text-white font-['Outfit']">
              Concluir Ordem de Produção
            </h3>
            <p className="text-xs text-stone-400">
              {concludingOp.numero}: <strong className="text-white">{concludingOp.produto_nome}</strong> ({concludingOp.tamanho})
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#0E131F] border border-stone-800 flex justify-between">
                <span className="text-stone-400">Planejado:</span>
                <strong className="text-white font-mono">{concludingOp.quantidade_planejada} unidades</strong>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-stone-300 font-bold block mb-1">Marmitas Prontas</label>
                  <input
                    type="number"
                    value={producedQty}
                    onChange={(e) => setProducedQty(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white font-mono font-bold text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="text-stone-300 font-bold block mb-1">Perdas / Avarias (un)</label>
                  <input
                    type="number"
                    value={lostQty}
                    onChange={(e) => setLostQty(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white font-mono"
                  />
                </div>
              </div>

              {parseInt(lostQty) > 0 && (
                <div>
                  <label className="text-stone-300 font-bold block mb-1">Motivo da Perda</label>
                  <input
                    type="text"
                    value={lossReason}
                    onChange={(e) => setLossReason(e.target.value)}
                    placeholder="Ex: Queima de cocção no fundo da bandeja"
                    className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConcludingOp(null)}
                className="flex-1 py-2.5 rounded-xl bg-stone-800 text-stone-300 text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-[#0EB24A] text-stone-950 text-xs font-black"
              >
                Concluir & Baixar Estoque
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
