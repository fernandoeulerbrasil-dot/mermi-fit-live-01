import React, { useState } from 'react';
import { useMermiStore } from '../../context/MermiStoreContext';
import { InventoryItem, ProductionPlanItem } from '../../types/mermiControl';
import {
  UtensilsCrossed,
  Package,
  AlertTriangle,
  Clock,
  Plus,
  Trash2,
  CheckCircle2,
  TrendingDown,
  Layers,
  ChefHat,
  Scale,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

export const MermiProductionInventoryView: React.FC = () => {
  const {
    inventory,
    updateInventoryStock,
    addInventoryItem,
    deleteInventoryItem,
    productionPlan,
    addProductionPlanItem,
    updateProductionPlanStatus,
    deleteProductionPlanItem,
    showToast
  } = useMermiStore();

  const [activeTab, setActiveTab] = useState<'producao' | 'estoque'>('producao');

  // New stock item form state
  const [isAddingStock, setIsAddingStock] = useState(false);
  const [newStockName, setNewStockName] = useState('');
  const [newStockCategory, setNewStockCategory] = useState<'ingrediente' | 'embalagem' | 'insumo'>('ingrediente');
  const [newStockQty, setNewStockQty] = useState('');
  const [newStockMin, setNewStockMin] = useState('');
  const [newStockUnit, setNewStockUnit] = useState<'kg' | 'un' | 'pct' | 'litro'>('kg');
  const [newStockCost, setNewStockCost] = useState('');
  const [newStockSupplier, setNewStockSupplier] = useState('');

  // Quick adjust state
  const [adjustingItemId, setAdjustingItemId] = useState<string | null>(null);
  const [adjustQtyInput, setAdjustQtyInput] = useState('');

  // Consolidated production metrics
  const totalMarmitasDay = productionPlan.reduce(
    (acc, p) => acc + p.quantity350g + p.quantity500g,
    0
  );
  const totalProteinKg = productionPlan.reduce((acc, p) => acc + p.proteinRequiredKg, 0);
  const totalCarbKg = productionPlan.reduce((acc, p) => acc + p.carbRequiredKg, 0);
  const totalVegKg = productionPlan.reduce((acc, p) => acc + p.vegRequiredKg, 0);
  const totalPackagingUn = productionPlan.reduce((acc, p) => acc + p.packagingRequiredUn, 0);

  const lowStockItems = inventory.filter((i) => i.currentStock <= i.minStock);

  const handleCreateStockItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStockName || !newStockQty) {
      showToast('Preencha ao menos o nome e a quantidade do item.');
      return;
    }

    addInventoryItem({
      name: newStockName,
      category: newStockCategory,
      currentStock: parseFloat(newStockQty) || 0,
      minStock: parseFloat(newStockMin) || 10,
      unit: newStockUnit,
      costPerUnit: parseFloat(newStockCost) || 0,
      supplier: newStockSupplier || 'Fornecedor Parceiro',
      status: parseFloat(newStockQty) <= (parseFloat(newStockMin) || 10) ? 'baixo' : 'normal'
    });

    setNewStockName('');
    setNewStockQty('');
    setNewStockMin('');
    setNewStockCost('');
    setNewStockSupplier('');
    setIsAddingStock(false);
  };

  const handleSaveStockAdjust = (item: InventoryItem) => {
    const val = parseFloat(adjustQtyInput);
    if (!isNaN(val)) {
      updateInventoryStock(item.id, val);
      setAdjustingItemId(null);
      setAdjustQtyInput('');
    }
  };

  return (
    <div className="space-y-6">

      {/* HEADER & SWITCH TABS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 font-['Outfit']">
            COZINHA CENTRAL & SUPRIMENTOS
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white font-['Outfit']">
            Painel de Produção & Controle de Estoque
          </h2>
          <p className="text-xs text-stone-400">
            Fichas de insumos diários, previsão de marmitas e gestão de matérias-primas
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('producao')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'producao'
                ? 'bg-[#0EB24A] text-stone-950 shadow-md font-black'
                : 'bg-[#171E31] text-stone-400 hover:text-white border border-stone-800'
            }`}
          >
            <ChefHat className="w-4 h-4" />
            <span>Produção do Dia</span>
          </button>

          <button
            onClick={() => setActiveTab('estoque')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'estoque'
                ? 'bg-[#0EB24A] text-stone-950 shadow-md font-black'
                : 'bg-[#171E31] text-stone-400 hover:text-white border border-stone-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Estoque & Alertas</span>
            {lowStockItems.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white font-black text-[9px]">
                {lowStockItems.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* TAB 1: PRODUÇÃO DO DIA */}
      {activeTab === 'producao' && (
        <div className="space-y-6">

          {/* CONSOLIDATED DEMAND CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="bg-[#171E31] border border-stone-800 rounded-3xl p-4 shadow-md">
              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
                Total Marmitas
              </span>
              <span className="text-xl font-black text-white font-['Outfit'] mt-1 block">
                {totalMarmitasDay} un.
              </span>
              <span className="text-[10px] text-emerald-400 font-bold block mt-1">
                Planejamento ativo
              </span>
            </div>

            <div className="bg-[#171E31] border border-stone-800 rounded-3xl p-4 shadow-md">
              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
                Proteínas (kg)
              </span>
              <span className="text-xl font-black text-amber-300 font-['Outfit'] mt-1 block">
                {totalProteinKg.toFixed(1).replace('.', ',')} kg
              </span>
              <span className="text-[10px] text-stone-400 block mt-1">
                Frango, Carne e Salmão
              </span>
            </div>

            <div className="bg-[#171E31] border border-stone-800 rounded-3xl p-4 shadow-md">
              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
                Carboidratos (kg)
              </span>
              <span className="text-xl font-black text-cyan-300 font-['Outfit'] mt-1 block">
                {totalCarbKg.toFixed(1).replace('.', ',')} kg
              </span>
              <span className="text-[10px] text-stone-400 block mt-1">
                Arroz, Batata Doce, Quinoa
              </span>
            </div>

            <div className="bg-[#171E31] border border-stone-800 rounded-3xl p-4 shadow-md">
              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
                Vegetais (kg)
              </span>
              <span className="text-xl font-black text-emerald-300 font-['Outfit'] mt-1 block">
                {totalVegKg.toFixed(1).replace('.', ',')} kg
              </span>
              <span className="text-[10px] text-stone-400 block mt-1">
                Brócolis, Cenoura, Aspargos
              </span>
            </div>

            <div className="bg-[#171E31] border border-stone-800 rounded-3xl p-4 shadow-md col-span-2 sm:col-span-1">
              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
                Embalagens BPA
              </span>
              <span className="text-xl font-black text-white font-['Outfit'] mt-1 block">
                {totalPackagingUn} un.
              </span>
              <span className="text-[10px] text-stone-400 block mt-1">
                Com selo & rótulo
              </span>
            </div>
          </div>

          {/* PRODUCTION SHIFTS & BATCHES */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-white uppercase tracking-wider font-['Outfit'] flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4 text-[#0EB24A]" />
              Lotes de Produção Programados (Cozinha & Montagem)
            </h3>

            <div className="grid grid-cols-1 gap-3">
              {productionPlan.map((batch) => (
                <div
                  key={batch.id}
                  className="bg-[#171E31] border border-stone-800 rounded-3xl p-4 sm:p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-black text-sm text-white font-['Outfit']">
                        {batch.dishName}
                      </span>
                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                          batch.line === 'fit_premium'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        }`}
                      >
                        {batch.line === 'fit_premium' ? 'Fit Premium' : 'Linha Fit'}
                      </span>
                      <span
                        className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          batch.priority === 'alta' || batch.priority === 'urgente'
                            ? 'bg-rose-500/20 text-rose-300'
                            : 'bg-stone-800 text-stone-400'
                        }`}
                      >
                        Prioridade: {batch.priority}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
                      <div className="p-2 rounded-xl bg-[#0E131F] border border-stone-800/80">
                        <span className="text-[10px] text-stone-500 block">Volumes</span>
                        <span className="font-bold text-white block mt-0.5">
                          {batch.quantity350g}x (350g) · {batch.quantity500g}x (500g)
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-[#0E131F] border border-stone-800/80">
                        <span className="text-[10px] text-stone-500 block">Proteína necessária</span>
                        <span className="font-bold text-amber-300 block mt-0.5">
                          {batch.proteinRequiredKg.toFixed(1)} kg ({batch.proteinType})
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-[#0E131F] border border-stone-800/80">
                        <span className="text-[10px] text-stone-500 block">Carbo necessário</span>
                        <span className="font-bold text-cyan-300 block mt-0.5">
                          {batch.carbRequiredKg.toFixed(1)} kg ({batch.carbType})
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-[#0E131F] border border-stone-800/80">
                        <span className="text-[10px] text-stone-500 block">Vegetais / Embalagens</span>
                        <span className="font-bold text-emerald-300 block mt-0.5">
                          {batch.vegRequiredKg.toFixed(1)} kg · {batch.packagingRequiredUn} un.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* STATUS SELECTOR */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 border-t sm:border-t-0 sm:border-l border-stone-800 pt-3 sm:pt-0 sm:pl-4">
                    <span className="text-[10px] text-stone-400 font-bold uppercase">
                      Status de Cozinha
                    </span>
                    <select
                      value={batch.status}
                      onChange={(e) =>
                        updateProductionPlanStatus(
                          batch.id,
                          e.target.value as ProductionPlanItem['status']
                        )
                      }
                      className="px-3 py-1.5 rounded-xl bg-[#0E131F] border border-stone-700 text-xs font-bold text-white outline-none focus:border-emerald-500"
                    >
                      <option value="planejado">Planejado</option>
                      <option value="em_preparo">Em Preparo</option>
                      <option value="embalado">Embalado & Rotulado</option>
                      <option value="concluido">Concluído (Freezer)</option>
                    </select>

                    <button
                      onClick={() => deleteProductionPlanItem(batch.id)}
                      className="text-stone-500 hover:text-rose-400 transition-colors cursor-pointer p-1"
                      title="Excluir lote"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CONTROLE DE ESTOQUE */}
      {activeTab === 'estoque' && (
        <div className="space-y-6">

          {/* LOW STOCK ALERT */}
          {lowStockItems.length > 0 && (
            <div className="p-4 rounded-3xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-rose-200">
                  ALERTA DE ESTOQUE BAIXO: {lowStockItems.length} item(ns) abaixo da margem mínima!
                </h4>
                <p className="text-[11px] text-stone-400 leading-relaxed">
                  Os seguintes insumos demandam reposição para não comprometer as entregas da semana:{' '}
                  <strong className="text-rose-300">
                    {lowStockItems.map((i) => `${i.name} (${i.currentStock} ${i.unit})`).join(', ')}
                  </strong>
                </p>
              </div>
            </div>
          )}

          {/* ACTIONS BAR */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white uppercase tracking-wider font-['Outfit'] flex items-center gap-2">
              <Package className="w-4 h-4 text-[#0EB24A]" />
              Catálogo de Estoque & Insumos ({inventory.length} itens)
            </h3>

            <button
              onClick={() => setIsAddingStock(true)}
              className="px-3.5 py-2 rounded-2xl bg-[#0EB24A] hover:bg-[#0ca042] text-stone-950 font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Insumo</span>
            </button>
          </div>

          {/* STOCK TABLE */}
          <div className="bg-[#171E31] border border-stone-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-300">
                <thead className="bg-[#101524] text-[10px] font-black uppercase text-stone-400 tracking-wider border-b border-stone-800">
                  <tr>
                    <th className="py-3 px-4">Item / Insumo</th>
                    <th className="py-3 px-3">Categoria</th>
                    <th className="py-3 px-3">Estoque Atual</th>
                    <th className="py-3 px-3">Mínimo</th>
                    <th className="py-3 px-3">Custo Unitário</th>
                    <th className="py-3 px-3">Fornecedor</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-4 text-right">Ajuste Rápido</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60 font-medium">
                  {inventory.map((item) => (
                    <tr key={item.id} className="hover:bg-stone-800/40 transition-colors">
                      <td className="py-3 px-4 font-bold text-white">
                        {item.name}
                      </td>

                      <td className="py-3 px-3">
                        <span className="text-[10px] uppercase font-bold text-stone-400 bg-stone-800/80 px-2 py-0.5 rounded-full">
                          {item.category}
                        </span>
                      </td>

                      <td className="py-3 px-3 font-mono font-bold text-white">
                        {item.currentStock.toFixed(1)} {item.unit}
                      </td>

                      <td className="py-3 px-3 font-mono text-stone-400">
                        {item.minStock.toFixed(1)} {item.unit}
                      </td>

                      <td className="py-3 px-3 font-mono text-emerald-400">
                        R$ {item.costPerUnit.toFixed(2).replace('.', ',')} / {item.unit}
                      </td>

                      <td className="py-3 px-3 text-stone-400 truncate max-w-[140px]">
                        {item.supplier || 'Padrão'}
                      </td>

                      <td className="py-3 px-3">
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
                      </td>

                      <td className="py-3 px-4 text-right">
                        {adjustingItemId === item.id ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <input
                              type="number"
                              value={adjustQtyInput}
                              onChange={(e) => setAdjustQtyInput(e.target.value)}
                              placeholder={item.currentStock.toString()}
                              className="w-16 px-2 py-1 rounded-lg bg-[#0E131F] border border-stone-700 text-white font-mono text-xs text-right"
                            />
                            <button
                              onClick={() => handleSaveStockAdjust(item)}
                              className="px-2 py-1 rounded-lg bg-emerald-500 text-stone-950 font-bold text-[10px] cursor-pointer"
                            >
                              Salvar
                            </button>
                            <button
                              onClick={() => setAdjustingItemId(null)}
                              className="px-1.5 py-1 rounded-lg bg-stone-800 text-stone-400 text-[10px] cursor-pointer"
                            >
                              X
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setAdjustingItemId(item.id);
                                setAdjustQtyInput(item.currentStock.toString());
                              }}
                              className="px-2.5 py-1 rounded-xl bg-stone-800 hover:bg-stone-700 text-[11px] font-bold text-stone-200 transition-all cursor-pointer"
                            >
                              Ajustar
                            </button>
                            <button
                              onClick={() => deleteInventoryItem(item.id)}
                              className="text-stone-500 hover:text-rose-400 cursor-pointer p-1"
                              title="Remover insumo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ADD INVENTORY MODAL */}
          {isAddingStock && (
            <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4">
              <form
                onSubmit={handleCreateStockItem}
                className="bg-[#171E31] border border-stone-700 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl"
              >
                <div className="border-b border-stone-800 pb-3">
                  <h3 className="text-base font-black text-white font-['Outfit']">
                    Cadastrar Novo Insumo no Estoque
                  </h3>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Defina limites de estoque mínimo para monitoramento de segurança
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-stone-300 font-bold block mb-1">Nome do Item</label>
                    <input
                      type="text"
                      value={newStockName}
                      onChange={(e) => setNewStockName(e.target.value)}
                      placeholder="Ex: Filé de Tilápia Fresco"
                      className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-stone-300 font-bold block mb-1">Categoria</label>
                      <select
                        value={newStockCategory}
                        onChange={(e) => setNewStockCategory(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                      >
                        <option value="ingrediente">Ingrediente</option>
                        <option value="embalagem">Embalagem</option>
                        <option value="insumo">Insumo</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-stone-300 font-bold block mb-1">Unidade</label>
                      <select
                        value={newStockUnit}
                        onChange={(e) => setNewStockUnit(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                      >
                        <option value="kg">kg (Quilo)</option>
                        <option value="un">un (Unidade)</option>
                        <option value="pct">pct (Pacote)</option>
                        <option value="litro">litro (Litro)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-stone-300 font-bold block mb-1">Estoque Atual</label>
                      <input
                        type="number"
                        step="0.1"
                        value={newStockQty}
                        onChange={(e) => setNewStockQty(e.target.value)}
                        placeholder="Ex: 25.0"
                        className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-stone-300 font-bold block mb-1">Estoque Mínimo</label>
                      <input
                        type="number"
                        step="0.1"
                        value={newStockMin}
                        onChange={(e) => setNewStockMin(e.target.value)}
                        placeholder="Ex: 10.0"
                        className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-stone-300 font-bold block mb-1">Custo Unitário (R$)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={newStockCost}
                        onChange={(e) => setNewStockCost(e.target.value)}
                        placeholder="Ex: 22.50"
                        className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-stone-300 font-bold block mb-1">Fornecedor</label>
                      <input
                        type="text"
                        value={newStockSupplier}
                        onChange={(e) => setNewStockSupplier(e.target.value)}
                        placeholder="Ex: Distribuidora Minas"
                        className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingStock(false)}
                    className="flex-1 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-bold text-stone-300 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#0EB24A] hover:bg-[#0ca042] text-xs font-black text-stone-950 cursor-pointer shadow-md"
                  >
                    Salvar Insumo
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
