import React, { useState } from 'react';
import { useMermiStore } from '../../context/MermiStoreContext';
import {
  Fornecedor,
  PedidoCompra,
  CompraItem,
  CompraStatus,
  SugestaoCompraIA
} from '../../types/mermiFinanceOperations';
import {
  ShoppingBag,
  Building,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles,
  BrainCircuit,
  FileText,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Truck
} from 'lucide-react';

export const MermiComprasView: React.FC = () => {
  const {
    pedidosCompra,
    createPedidoCompra,
    updatePedidoCompraStatus,
    deletePedidoCompra,
    fornecedores,
    addFornecedor,
    updateFornecedor,
    deleteFornecedor,
    insumos,
    getSugestoesCompraIA,
    currentAdminUser,
    showToast
  } = useMermiStore();

  const [activeTab, setActiveTab] = useState<'pedidos' | 'sugestoes_ia' | 'fornecedores'>('pedidos');

  // Modal Novo Pedido de Compra
  const [isCreatingPedido, setIsCreatingPedido] = useState(false);
  const [selectedFornecedorId, setSelectedFornecedorId] = useState('');
  const [itensCompra, setItensCompra] = useState<CompraItem[]>([]);
  const [tempInsumoId, setTempInsumoId] = useState('');
  const [tempQty, setTempQty] = useState('');
  const [tempCost, setTempCost] = useState('');
  const [pedidoObs, setPedidoObs] = useState('');

  // Modal Novo Fornecedor
  const [isAddingFornecedor, setIsAddingFornecedor] = useState(false);
  const [fornNome, setFornNome] = useState('');
  const [fornEmpresa, setFornEmpresa] = useState('');
  const [fornContato, setFornContato] = useState('');
  const [fornTelefone, setFornTelefone] = useState('');
  const [fornEmail, setFornEmail] = useState('');
  const [fornCategoria, setFornCategoria] = useState('');
  const [fornProdutos, setFornProdutos] = useState('');
  const [fornCondicoes, setFornCondicoes] = useState('Boleto 21 dias');
  const [fornPrazo, setFornPrazo] = useState('2');

  const sugestoes = getSugestoesCompraIA();

  const handleAddItemToPedido = () => {
    const targetInsumo = insumos.find((i) => i.id === tempInsumoId);
    if (!targetInsumo) {
      showToast('Selecione um insumo para o pedido.');
      return;
    }
    const qty = parseFloat(tempQty);
    const cost = parseFloat(tempCost) || targetInsumo.custo_unitario;

    if (isNaN(qty) || qty <= 0) {
      showToast('Informe uma quantidade válida.');
      return;
    }

    setItensCompra((prev) => [
      ...prev,
      {
        insumo_id: targetInsumo.id,
        insumo_nome: targetInsumo.nome,
        quantidade: qty,
        unidade: targetInsumo.unidade_de_medida,
        custo_unitario: cost,
        custo_total: qty * cost
      }
    ]);

    setTempInsumoId('');
    setTempQty('');
    setTempCost('');
  };

  const handleSavePedido = (e: React.FormEvent) => {
    e.preventDefault();
    if (itensCompra.length === 0) {
      showToast('Adicione pelo menos 1 item ao pedido de compra.');
      return;
    }
    const targetForn = fornecedores.find((f) => f.id === selectedFornecedorId) || fornecedores[0];
    const valorTotal = itensCompra.reduce((acc, i) => acc + i.custo_total, 0);

    createPedidoCompra({
      numero: `PC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      data_criacao: new Date().toISOString().split('T')[0],
      fornecedor_id: targetForn?.id || 'forn_1',
      fornecedor_nome: targetForn?.nome || 'Fornecedor Oficial',
      itens: itensCompra,
      valor_total: valorTotal,
      status: 'PEDIDO',
      responsavel: currentAdminUser.name,
      observacoes: pedidoObs || 'Pedido de compra gerado pelo Mermi Control'
    });

    setIsCreatingPedido(false);
    setItensCompra([]);
    setPedidoObs('');
  };

  const handleCreateFromSugestao = (sug: SugestaoCompraIA) => {
    const targetInsumo = insumos.find((i) => i.id === sug.insumo_id);
    if (!targetInsumo) return;

    setItensCompra([
      {
        insumo_id: targetInsumo.id,
        insumo_nome: targetInsumo.nome,
        quantidade: sug.sugestao_compra,
        unidade: targetInsumo.unidade_de_medida,
        custo_unitario: targetInsumo.custo_unitario,
        custo_total: sug.sugestao_compra * targetInsumo.custo_unitario
      }
    ]);
    const matchedForn = fornecedores.find((f) => f.nome === targetInsumo.fornecedor);
    if (matchedForn) setSelectedFornecedorId(matchedForn.id);
    setPedidoObs(`Pedido gerado a partir de recomendação da MerMi Intelligence (${sug.urgencia.toUpperCase()} urgência).`);
    setIsCreatingPedido(true);
    setActiveTab('pedidos');
  };

  const handleSaveFornecedor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fornNome) {
      showToast('Preencha o nome do fornecedor.');
      return;
    }

    addFornecedor({
      nome: fornNome,
      empresa: fornEmpresa || fornNome,
      contato: fornContato,
      telefone: fornTelefone,
      email: fornEmail,
      categoria: fornCategoria || 'Insumos Diversos',
      produtos_fornecidos: fornProdutos ? fornProdutos.split(',').map((p) => p.trim()) : [],
      condicoes_pagamento: fornCondicoes,
      prazo_dias: parseInt(fornPrazo) || 2,
      status: 'ativo'
    });

    setFornNome('');
    setFornEmpresa('');
    setFornContato('');
    setFornTelefone('');
    setFornEmail('');
    setFornProdutos('');
    setIsAddingFornecedor(false);
  };

  return (
    <div className="space-y-6">
      {/* HEADER DE COMPRAS */}
      <div className="bg-[#171E31] border border-stone-800 rounded-3xl p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
          <div>
            <span className="text-[10px] font-black uppercase text-[#0EB24A] tracking-wider font-['Outfit']">
              MÓDULO DE COMPRAS & ABASTECIMENTO · BLOCO 11
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white font-['Outfit'] mt-1">
              Pedidos de Compra, Fornecedores & Sugestão IA
            </h2>
            <p className="text-xs text-stone-400">
              Controle de pedidos de compra com recebimento seguro, fornecedores parceiros e cálculo preditivo de reposição.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCreatingPedido(true)}
              className="px-3.5 py-2.5 rounded-2xl bg-[#0EB24A] hover:bg-[#0ca042] text-stone-950 font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Pedido de Compra</span>
            </button>
          </div>
        </div>

        {/* TABS DE COMPRAS */}
        <div className="flex items-center gap-2">
          {[
            { id: 'pedidos', label: 'Pedidos de Compra', icon: ShoppingBag, count: pedidosCompra.length },
            { id: 'sugestoes_ia', label: 'Sugestões de Compra (IA)', icon: BrainCircuit, count: sugestoes.length, highlight: sugestoes.length > 0 },
            { id: 'fornecedores', label: 'Fornecedores Homologados', icon: Building, count: fornecedores.length }
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
                {tab.count !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      tab.highlight
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-stone-800 text-stone-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. PEDIDOS DE COMPRA */}
      {/* ========================================================================= */}
      {activeTab === 'pedidos' && (
        <div className="space-y-4">
          {pedidosCompra.map((pc) => (
            <div
              key={pc.id}
              className="bg-[#171E31] border border-stone-800 rounded-3xl p-5 shadow-lg space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-white font-['Outfit']">
                      {pc.numero}
                    </span>
                    <span className="text-xs text-stone-400">· {pc.data_criacao}</span>
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                        pc.status === 'RECEBIDO'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : pc.status === 'PEDIDO'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : pc.status === 'RASCUNHO'
                          ? 'bg-stone-800 text-stone-400'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {pc.status}
                    </span>
                  </div>
                  <span className="text-xs text-stone-300 font-semibold block mt-1">
                    Fornecedor: {pc.fornecedor_nome}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-stone-400">Status:</span>
                  <select
                    value={pc.status}
                    onChange={(e) => updatePedidoCompraStatus(pc.id, e.target.value as CompraStatus)}
                    className="px-3 py-1.5 rounded-xl bg-[#0E131F] border border-stone-700 text-xs font-bold text-white outline-none focus:border-emerald-500"
                  >
                    <option value="RASCUNHO">Rascunho</option>
                    <option value="PEDIDO">Pedido Enviado</option>
                    <option value="PARCIAL">Recebido Parcial</option>
                    <option value="RECEBIDO">Recebido (Abastece Estoque)</option>
                    <option value="CANCELADO">Cancelado</option>
                  </select>

                  <button
                    onClick={() => deletePedidoCompra(pc.id)}
                    className="p-1.5 rounded-xl bg-stone-800 hover:bg-rose-900/60 text-stone-400 hover:text-rose-300 cursor-pointer"
                    title="Excluir pedido de compra"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* ITENS DA COMPRA */}
              <div className="space-y-1.5 text-xs">
                {pc.itens.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-stone-300 py-0.5">
                    <span>
                      {it.quantidade} {it.unidade} de <strong>{it.insumo_nome}</strong>
                    </span>
                    <span className="font-mono text-emerald-400">
                      R$ {it.custo_total.toFixed(2)} (R$ {it.custo_unitario.toFixed(2)}/{it.unidade})
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-xs font-bold">
                <span className="text-stone-400">
                  {pc.observacoes || 'Sem observações adicionais.'}
                </span>
                <span className="text-emerald-400 font-mono text-base">
                  Total da Compra: R$ {pc.valor_total.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. SUGESTÕES DE COMPRA DA MERMI INTELLIGENCE (SEÇÃO 28 E 54) */}
      {/* ========================================================================= */}
      {activeTab === 'sugestoes_ia' && (
        <div className="bg-[#171E31] border border-stone-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="border-b border-stone-800 pb-3 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] font-black uppercase text-[#0EB24A] tracking-wider font-['Outfit']">
                  ANÁLISE PREDITIVA DE ESTOQUE & REPOSIÇÃO
                </span>
              </div>
              <h3 className="text-base font-black text-white font-['Outfit'] mt-1">
                Sugestões Inteligentes de Compras
              </h3>
              <p className="text-xs text-stone-400">
                Padrão obrigatório: <strong>DADO → ANÁLISE → POSSÍVEL CAUSA → SUGESTÃO → IMPACTO ESTIMADO</strong>. A IA jamais compra autonomamente; você revisa e aprova com 1 clique.
              </p>
            </div>
          </div>

          {sugestoes.length === 0 ? (
            <div className="p-8 text-center text-stone-400 text-xs">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              Nenhum insumo com necessidade imediata de compra. Todos os itens estão acima do ponto de reposição.
            </div>
          ) : (
            <div className="space-y-4">
              {sugestoes.map((sug) => (
                <div
                  key={sug.insumo_id}
                  className="p-5 rounded-2xl bg-[#0E131F] border border-stone-800 space-y-3 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800/80 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-white font-['Outfit']">
                        {sug.insumo_nome}
                      </span>
                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                          sug.urgencia === 'critica'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        {sug.urgencia.toUpperCase()} URGÊNCIA
                      </span>
                    </div>

                    <button
                      onClick={() => handleCreateFromSugestao(sug)}
                      className="px-3 py-1.5 rounded-xl bg-[#0EB24A] hover:bg-[#0ca042] text-stone-950 font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Gerar Pedido de Compra</span>
                    </button>
                  </div>

                  {/* ESTRUTURA FORMAL: DADO -> ANÁLISE -> CAUSA -> SUGESTÃO -> IMPACTO */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                    <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800/80 space-y-1">
                      <strong className="text-emerald-400 uppercase text-[9px] block">DADO</strong>
                      <p className="text-stone-300">
                        Estoque atual de {sug.estoque_atual} {sug.unidade} (mínimo de segurança: {sug.estoque_minimo} {sug.unidade}). Consumo médio diário: {sug.consumo_medio_diario} {sug.unidade}/dia.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800/80 space-y-1">
                      <strong className="text-cyan-400 uppercase text-[9px] block">ANÁLISE</strong>
                      <p className="text-stone-300">
                        O estoque suporta apenas ~{(sug.estoque_atual / sug.consumo_medio_diario).toFixed(1)} dias de produção sem interrupção.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800/80 space-y-1">
                      <strong className="text-amber-400 uppercase text-[9px] block">POSSÍVEL CAUSA</strong>
                      <p className="text-stone-300">
                        Aumento no volume de pedidos ou lote anterior com consumo acelerado nas ordens de produção recentes.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800/80 space-y-1">
                      <strong className="text-purple-400 uppercase text-[9px] block">SUGESTÃO & IMPACTO</strong>
                      <p className="text-stone-300">
                        Emitir pedido de <strong>{sug.sugestao_compra} {sug.unidade}</strong>. Evita ruptura de cardápio e preserva as entregas das marmitas programadas.
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. FORNECEDORES HOMOLOGADOS (SEÇÃO 26) */}
      {/* ========================================================================= */}
      {activeTab === 'fornecedores' && (
        <div className="bg-[#171E31] border border-stone-800 rounded-3xl p-6 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
            <div>
              <span className="text-[10px] font-black uppercase text-[#0EB24A] tracking-wider font-['Outfit']">
                PARCEIROS HOMOLOGADOS · SEÇÃO 26
              </span>
              <h3 className="text-base font-black text-white font-['Outfit'] mt-1">
                Cadastro de Fornecedores de Insumos & Embalagens
              </h3>
              <p className="text-xs text-stone-400">
                Prazos de entrega, condições de faturamento e catálogo fornecido por parceiro.
              </p>
            </div>

            <button
              onClick={() => setIsAddingFornecedor(true)}
              className="px-3.5 py-2 rounded-2xl bg-[#0EB24A] hover:bg-[#0ca042] text-stone-950 font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md"
            >
              + Novo Fornecedor
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {fornecedores.map((forn) => (
              <div
                key={forn.id}
                className="p-4 rounded-2xl bg-[#0E131F] border border-stone-800 space-y-2.5 shadow-md"
              >
                <div className="flex items-start justify-between gap-2 border-b border-stone-800 pb-2">
                  <div>
                    <h4 className="font-bold text-white text-sm">{forn.nome}</h4>
                    <span className="text-[10px] text-stone-400">{forn.empresa}</span>
                  </div>
                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                    {forn.status}
                  </span>
                </div>

                <div className="space-y-1 text-[11px] text-stone-300">
                  <div>
                    <span className="text-stone-500">Contato:</span> {forn.contato} ({forn.telefone})
                  </div>
                  <div>
                    <span className="text-stone-500">Condições:</span> {forn.condicoes_pagamento} · Prazo: {forn.prazo_dias} dias
                  </div>
                  <div>
                    <span className="text-stone-500">Produtos:</span> {forn.produtos_fornecidos.join(', ')}
                  </div>
                </div>

                {forn.observacoes && (
                  <p className="text-[10px] text-stone-500 pt-1 border-t border-stone-800/80">
                    {forn.observacoes}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* MODAL NOVO FORNECEDOR */}
          {isAddingFornecedor && (
            <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4">
              <form
                onSubmit={handleSaveFornecedor}
                className="bg-[#171E31] border border-stone-700 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl"
              >
                <h3 className="text-base font-black text-white font-['Outfit']">
                  Cadastrar Fornecedor Homologado
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-stone-300 font-bold block mb-1">Nome Fantasia</label>
                    <input
                      type="text"
                      value={fornNome}
                      onChange={(e) => setFornNome(e.target.value)}
                      placeholder="Ex: Avícola Granja & Campo"
                      className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-stone-300 font-bold block mb-1">Razão Social</label>
                      <input
                        type="text"
                        value={fornEmpresa}
                        onChange={(e) => setFornEmpresa(e.target.value)}
                        placeholder="Granja & Campo Ltda"
                        className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-stone-300 font-bold block mb-1">Contato / Vendedor</label>
                      <input
                        type="text"
                        value={fornContato}
                        onChange={(e) => setFornContato(e.target.value)}
                        placeholder="Carlos Eduardo"
                        className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-stone-300 font-bold block mb-1">Telefone / WhatsApp</label>
                      <input
                        type="text"
                        value={fornTelefone}
                        onChange={(e) => setFornTelefone(e.target.value)}
                        placeholder="(11) 98765-4321"
                        className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-stone-300 font-bold block mb-1">Email Comercial</label>
                      <input
                        type="email"
                        value={fornEmail}
                        onChange={(e) => setFornEmail(e.target.value)}
                        placeholder="comercial@fornecedor.com.br"
                        className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-stone-300 font-bold block mb-1">Produtos Fornecidos (separados por vírgula)</label>
                    <input
                      type="text"
                      value={fornProdutos}
                      onChange={(e) => setFornProdutos(e.target.value)}
                      placeholder="Peito de frango, Sobrecoxa, Ovos"
                      className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingFornecedor(false)}
                    className="flex-1 py-2.5 rounded-xl bg-stone-800 text-stone-300 text-xs font-bold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#0EB24A] text-stone-950 text-xs font-black"
                  >
                    Salvar Fornecedor
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL NOVO PEDIDO DE COMPRA */}
      {/* ========================================================================= */}
      {isCreatingPedido && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSavePedido}
            className="bg-[#171E31] border border-stone-700 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl"
          >
            <h3 className="text-base font-black text-white font-['Outfit']">
              Novo Pedido de Compra (PC)
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-stone-300 font-bold block mb-1">Fornecedor</label>
                <select
                  value={selectedFornecedorId}
                  onChange={(e) => setSelectedFornecedorId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                >
                  <option value="">Selecione o Fornecedor...</option>
                  {fornecedores.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.nome} ({f.categoria})
                    </option>
                  ))}
                </select>
              </div>

              {/* ADICIONAR ITEM */}
              <div className="p-3 rounded-2xl bg-[#0E131F] border border-stone-800 space-y-2">
                <span className="text-stone-400 font-bold block">Adicionar Insumo ao Pedido:</span>
                <div className="grid grid-cols-3 gap-2">
                  <select
                    value={tempInsumoId}
                    onChange={(e) => {
                      setTempInsumoId(e.target.value);
                      const sel = insumos.find((i) => i.id === e.target.value);
                      if (sel) setTempCost(sel.custo_unitario.toString());
                    }}
                    className="w-full px-2 py-1.5 rounded-lg bg-stone-800 border border-stone-700 text-white col-span-3 sm:col-span-1"
                  >
                    <option value="">Escolher insumo...</option>
                    {insumos.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.nome} ({i.unidade_de_medida})
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    step="0.1"
                    value={tempQty}
                    onChange={(e) => setTempQty(e.target.value)}
                    placeholder="Qtd"
                    className="w-full px-2 py-1.5 rounded-lg bg-stone-800 border border-stone-700 text-white font-mono"
                  />

                  <input
                    type="number"
                    step="0.05"
                    value={tempCost}
                    onChange={(e) => setTempCost(e.target.value)}
                    placeholder="R$/un"
                    className="w-full px-2 py-1.5 rounded-lg bg-stone-800 border border-stone-700 text-white font-mono"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAddItemToPedido}
                  className="w-full py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold"
                >
                  + Incluir Item
                </button>
              </div>

              {/* LISTA DE ITENS INCLUÍDOS */}
              {itensCompra.length > 0 && (
                <div className="p-3 rounded-2xl bg-stone-900 border border-stone-800 space-y-1.5">
                  <span className="text-stone-400 font-bold block text-[10px] uppercase">
                    Itens do Pedido ({itensCompra.length}):
                  </span>
                  {itensCompra.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-stone-300 text-[11px]">
                      <span>
                        {it.quantidade} {it.unidade} de {it.insumo_nome}
                      </span>
                      <span className="font-mono text-emerald-400">
                        R$ {it.custo_total.toFixed(2)}
                      </span>
                    </div>
                  ))}
                  <div className="pt-1 border-t border-stone-800 text-right font-black text-emerald-400">
                    Total: R$ {itensCompra.reduce((acc, i) => acc + i.custo_total, 0).toFixed(2)}
                  </div>
                </div>
              )}

              <div>
                <label className="text-stone-300 font-bold block mb-1">Observações do Pedido</label>
                <textarea
                  rows={2}
                  value={pedidoObs}
                  onChange={(e) => setPedidoObs(e.target.value)}
                  placeholder="Ex: Entregar com laudo sanitário e nota fiscal na terça-feira pela manhã."
                  className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsCreatingPedido(false);
                  setItensCompra([]);
                }}
                className="flex-1 py-2.5 rounded-xl bg-stone-800 text-stone-300 text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-[#0EB24A] text-stone-950 text-xs font-black"
              >
                Salvar Pedido de Compra
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
