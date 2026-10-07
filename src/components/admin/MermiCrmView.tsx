import React, { useState } from 'react';
import { useMermiStore } from '../../context/MermiStoreContext';
import { CustomerCrmProfile } from '../../types/mermiControl';
import {
  Users,
  Search,
  Filter,
  UserCheck,
  AlertTriangle,
  Award,
  Sparkles,
  ShoppingBag,
  Send,
  Calendar,
  Phone,
  Mail,
  ChevronRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  Clock,
  Heart
} from 'lucide-react';

export const MermiCrmView: React.FC = () => {
  const {
    crmCustomers,
    updateCrmCustomer,
    systemSettings,
    updateSystemSettings,
    addNotificationAdmin,
    addAuditLog,
    showToast
  } = useMermiStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSegment, setSelectedSegment] = useState<string>('todos');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerCrmProfile | null>(null);
  const [isReactivationModalOpen, setIsReactivationModalOpen] = useState(false);
  const [customerToReactivate, setCustomerToReactivate] = useState<CustomerCrmProfile | null>(null);
  const [reactivationCoupon, setReactivationCoupon] = useState('VOLTAFIT');
  const [customVipSpending, setCustomVipSpending] = useState(systemSettings.vipMinSpending.toString());
  const [customVipOrders, setCustomVipOrders] = useState(systemSettings.vipMinOrders.toString());
  const [isVipSettingsOpen, setIsVipSettingsOpen] = useState(false);

  // Filters
  const filteredCustomers = crmCustomers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery);

    if (selectedSegment === 'todos') return matchesSearch;
    if (selectedSegment === 'vip') return matchesSearch && c.isVip;
    if (selectedSegment === 'em_risco') return matchesSearch && c.relationshipStatus === 'em_risco';
    return matchesSearch && c.segment === selectedSegment;
  });

  const inactiveCustomers = crmCustomers.filter(
    (c) => c.daysSinceLastOrder >= 20 || c.relationshipStatus === 'em_risco'
  );

  const vipCustomersCount = crmCustomers.filter((c) => c.isVip).length;

  const handleOpenReactivation = (cust: CustomerCrmProfile) => {
    setCustomerToReactivate(cust);
    setIsReactivationModalOpen(true);
  };

  const handleConfirmReactivation = () => {
    if (!customerToReactivate) return;

    // Dispara notificação direcionada e registra em auditoria
    addNotificationAdmin({
      title: `Sentimos sua falta, ${customerToReactivate.name.split(' ')[0]}! 🥗`,
      message: `Use o cupom especial ${reactivationCoupon} e garanta frete grátis no seu reabastecimento saudável.`,
      category: 'CAMPANHAS',
      targetAudience: `Cliente específico: ${customerToReactivate.email}`,
      status: 'enviada',
      sentAt: 'Agora mesmo',
      readCount: 0
    });

    addAuditLog(
      'DISPARO_REATIVACAO_CRM',
      'campanha',
      customerToReactivate.id,
      `Inativo há ${customerToReactivate.daysSinceLastOrder} dias`,
      `Campanha com cupom ${reactivationCoupon} enviada com autorização do administrador`,
      'Campanha de reativação autorizada expressamente no CRM'
    );

    showToast(`Campanha de reativação autorizada e programada para ${customerToReactivate.name}!`);
    setIsReactivationModalOpen(false);
    setCustomerToReactivate(null);
  };

  const handleSaveVipRules = (e: React.FormEvent) => {
    e.preventDefault();
    const minSpend = parseFloat(customVipSpending) || 400;
    const minOrders = parseInt(customVipOrders, 10) || 8;

    updateSystemSettings({
      vipMinSpending: minSpend,
      vipMinOrders: minOrders
    });

    // Atualiza status VIP dos clientes com base nos critérios configuráveis
    crmCustomers.forEach((c) => {
      const qualifies = c.totalSpent >= minSpend || c.ordersCount >= minOrders;
      if (qualifies !== c.isVip) {
        updateCrmCustomer(c.id, { isVip: qualifies });
      }
    });

    showToast('Critérios de Cliente VIP atualizados e aplicados à base!');
    setIsVipSettingsOpen(false);
  };

  return (
    <div className="space-y-6">

      {/* HEADER & TOP STATS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 font-['Outfit']">
            MERMI CRM COMERCIAL & RELACIONAMENTO
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white font-['Outfit']">
            Gestão & Inteligência de Clientes
          </h2>
          <p className="text-xs text-stone-400">
            Fichas completas, segmentação comercial, clientes VIP e ferramentas de reativação
          </p>
        </div>

        <button
          onClick={() => setIsVipSettingsOpen(true)}
          className="px-3.5 py-2 rounded-2xl bg-stone-800 hover:bg-stone-700 border border-stone-700 text-xs font-bold text-amber-300 transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Award className="w-4 h-4 text-amber-400" />
          <span>Configurar Critérios VIP</span>
        </button>
      </div>

      {/* KPI METRICS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#171E31] border border-stone-800 rounded-3xl p-4 shadow-md">
          <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
            Base Cadastrada
          </span>
          <span className="text-xl font-black text-white font-['Outfit'] mt-1 block">
            {crmCustomers.length} clientes
          </span>
          <span className="text-[10px] text-emerald-400 font-bold block mt-1">
            100% integrados ao banco
          </span>
        </div>

        <div className="bg-[#171E31] border border-stone-800 rounded-3xl p-4 shadow-md">
          <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
            Clientes VIP
          </span>
          <span className="text-xl font-black text-amber-300 font-['Outfit'] mt-1 block">
            {vipCustomersCount} clientes
          </span>
          <span className="text-[10px] text-stone-400 font-medium block mt-1">
            Gasto mín. R$ {systemSettings.vipMinSpending.toFixed(2)}
          </span>
        </div>

        <div className="bg-[#171E31] border border-stone-800 rounded-3xl p-4 shadow-md">
          <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
            Em Risco / Inativos
          </span>
          <span className="text-xl font-black text-rose-400 font-['Outfit'] mt-1 block">
            {inactiveCustomers.length} clientes
          </span>
          <span className="text-[10px] text-rose-300 font-bold block mt-1">
            +20 dias sem comprar
          </span>
        </div>

        <div className="bg-[#171E31] border border-stone-800 rounded-3xl p-4 shadow-md">
          <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
            Ticket Médio da Base
          </span>
          <span className="text-xl font-black text-white font-['Outfit'] mt-1 block">
            R$ {(crmCustomers.reduce((acc, c) => acc + c.totalSpent, 0) / (crmCustomers.reduce((acc, c) => acc + c.ordersCount, 0) || 1)).toFixed(2).replace('.', ',')}
          </span>
          <span className="text-[10px] text-emerald-400 font-bold block mt-1">
            Média real consolidada
          </span>
        </div>
      </div>

      {/* REATIVACAO ALERT BANNER */}
      {inactiveCustomers.length > 0 && (
        <div className="p-4 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-amber-200">
                Oportunidade de Reativação Comercial Identificada
              </h4>
              <p className="text-[11px] text-stone-400 mt-0.5">
                {inactiveCustomers.length} cliente(s) reduziram ou pararam compras. Conforme a regra de governança, nenhuma campanha com custo é disparada automaticamente.
              </p>
            </div>
          </div>

          <button
            onClick={() => setSelectedSegment('em_risco')}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shrink-0"
          >
            Ver Clientes em Risco
          </button>
        </div>
      )}

      {/* SEARCH & SEGMENT TABS */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nome, e-mail ou telefone..."
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-[#171E31] border border-stone-800 text-xs text-white placeholder-stone-500 outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'todos', label: 'Todos' },
              { id: 'vip', label: 'VIP' },
              { id: 'ativo', label: 'Ativos' },
              { id: 'novo', label: 'Novos' },
              { id: 'alto_ticket', label: 'Alto Ticket' },
              { id: 'em_risco', label: 'Em Risco (+20d)' }
            ].map((seg) => (
              <button
                key={seg.id}
                onClick={() => setSelectedSegment(seg.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  selectedSegment === seg.id
                    ? 'bg-[#0EB24A] text-stone-950 shadow-md font-black'
                    : 'bg-[#171E31] text-stone-400 hover:text-white border border-stone-800'
                }`}
              >
                {seg.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CUSTOMER LIST TABLE */}
      <div className="bg-[#171E31] border border-stone-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-300">
            <thead className="bg-[#101524] text-[10px] font-black uppercase text-stone-400 tracking-wider border-b border-stone-800">
              <tr>
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-3">Segmento</th>
                <th className="py-3 px-3">Pedidos</th>
                <th className="py-3 px-3">Total Gasto</th>
                <th className="py-3 px-3">Ticket Médio</th>
                <th className="py-3 px-3">Último Pedido</th>
                <th className="py-3 px-3">Points</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60 font-medium">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-stone-500">
                    Nenhum cliente localizado para os filtros informados.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-stone-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-white text-xs">{cust.name}</span>
                          {cust.isVip && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-400 text-stone-950 font-black text-[9px]">
                              VIP
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-stone-400 block">{cust.email}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span
                        className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                          cust.relationshipStatus === 'em_risco'
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                            : cust.isVip
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        }`}
                      >
                        {cust.segment.toUpperCase()}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 font-mono font-bold text-white">
                      {cust.ordersCount}
                    </td>

                    <td className="py-3.5 px-3 font-mono font-bold text-emerald-400">
                      R$ {cust.totalSpent.toFixed(2).replace('.', ',')}
                    </td>

                    <td className="py-3.5 px-3 font-mono text-stone-300">
                      R$ {cust.averageTicket.toFixed(2).replace('.', ',')}
                    </td>

                    <td className="py-3.5 px-3">
                      <div>
                        <span className="text-stone-300 block">{cust.lastOrderDate}</span>
                        <span
                          className={`text-[10px] block ${
                            cust.daysSinceLastOrder >= 20 ? 'text-rose-400 font-bold' : 'text-stone-500'
                          }`}
                        >
                          há {cust.daysSinceLastOrder} dias
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="font-bold text-amber-400 font-mono">
                        {cust.pointsBalance} pts
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {cust.daysSinceLastOrder >= 20 && (
                          <button
                            onClick={() => handleOpenReactivation(cust)}
                            className="px-2.5 py-1 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-[10px] font-bold text-rose-300 transition-all cursor-pointer"
                            title="Sugerir campanha de reativação"
                          >
                            Reativar
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedCustomer(cust)}
                          className="px-2.5 py-1 rounded-xl bg-stone-800 hover:bg-stone-700 text-[11px] font-bold text-stone-200 transition-all cursor-pointer"
                        >
                          Ver Ficha
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CUSTOMER DETAIL MODAL */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#171E31] border border-stone-700 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-stone-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-white font-['Outfit']">
                    {selectedCustomer.name}
                  </h3>
                  {selectedCustomer.isVip && (
                    <span className="px-2 py-0.5 rounded bg-amber-400 text-stone-950 font-black text-[9px]">
                      VIP
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-400 mt-0.5">
                  Ficha Cadastral e Histórico Comercial
                </p>
              </div>

              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-stone-400 hover:text-white text-xs font-bold px-2 py-1 rounded-lg bg-stone-800"
              >
                Fechar
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-[#0E131F] border border-stone-800">
                <span className="text-[10px] font-bold text-stone-500 uppercase block">E-mail</span>
                <span className="font-semibold text-white truncate block mt-0.5">{selectedCustomer.email}</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#0E131F] border border-stone-800">
                <span className="text-[10px] font-bold text-stone-500 uppercase block">Telefone</span>
                <span className="font-semibold text-white block mt-0.5">{selectedCustomer.phone}</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#0E131F] border border-stone-800">
                <span className="text-[10px] font-bold text-stone-500 uppercase block">Total Gasto</span>
                <span className="font-mono font-bold text-emerald-400 block mt-0.5">
                  R$ {selectedCustomer.totalSpent.toFixed(2).replace('.', ',')}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-[#0E131F] border border-stone-800">
                <span className="text-[10px] font-bold text-stone-500 uppercase block">Ticket Médio</span>
                <span className="font-mono font-bold text-white block mt-0.5">
                  R$ {selectedCustomer.averageTicket.toFixed(2).replace('.', ',')}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-[#0E131F] border border-stone-800">
                <span className="text-[10px] font-bold text-stone-500 uppercase block">Saldo MerMi Points</span>
                <span className="font-mono font-bold text-amber-400 block mt-0.5">
                  {selectedCustomer.pointsBalance} pts (Nível {selectedCustomer.level})
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-[#0E131F] border border-stone-800">
                <span className="text-[10px] font-bold text-stone-500 uppercase block">MerMi Run & Desafios</span>
                <span className="font-semibold text-cyan-300 block mt-0.5">
                  {selectedCustomer.participatedRunEvents} corridas · {selectedCustomer.challengesCompleted} desafios
                </span>
              </div>
            </div>

            <div className="space-y-1.5 p-3 rounded-2xl bg-[#0E131F] border border-stone-800 text-xs">
              <span className="text-[10px] font-bold text-stone-500 uppercase block">Pratos Favoritos</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {selectedCustomer.favoriteDishes.map((dish, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-lg bg-stone-800 text-stone-300 text-[11px]">
                    🍲 {dish}
                  </span>
                ))}
              </div>
            </div>

            {selectedCustomer.notes && (
              <div className="p-3 rounded-2xl bg-stone-900 border border-stone-800 text-xs space-y-1">
                <span className="text-[10px] font-bold text-stone-500 uppercase block">Notas da Equipe</span>
                <p className="text-stone-300 text-[11px] leading-relaxed">{selectedCustomer.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* REATIVACAO PROPOSAL MODAL */}
      {isReactivationModalOpen && customerToReactivate && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#171E31] border border-rose-500/40 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Proposta de Reativação Comercial
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Cliente: <strong>{customerToReactivate.name}</strong>
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0E131F] border border-stone-800 text-xs space-y-2">
              <div className="flex justify-between text-stone-400">
                <span>Dias sem comprar:</span>
                <strong className="text-rose-400">{customerToReactivate.daysSinceLastOrder} dias</strong>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>Frequência anterior:</span>
                <strong className="text-white">a cada {customerToReactivate.purchaseFrequencyDays || 7} dias</strong>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>Valor médio anterior:</span>
                <strong className="text-emerald-400">R$ {customerToReactivate.averageTicket.toFixed(2)}</strong>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-300 block uppercase tracking-wider">
                Cupom de Incentivo Autorizado
              </label>
              <input
                type="text"
                value={reactivationCoupon}
                onChange={(e) => setReactivationCoupon(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white font-mono font-bold text-xs"
              />
              <span className="text-[10px] text-stone-500 block">
                Nenhum custo financeiro automático será debitado sem esta autorização.
              </span>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setIsReactivationModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-bold text-stone-300 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmReactivation}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-black text-white cursor-pointer shadow-md"
              >
                Autorizar & Disparar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIP SETTINGS MODAL */}
      {isVipSettingsOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleSaveVipRules} className="bg-[#171E31] border border-amber-500/40 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Critérios de Cliente VIP
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Configure as regras para concessão de selo e vantagens VIP
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-300 block">
                  Valor Total Gasto Mínimo (R$)
                </label>
                <input
                  type="number"
                  value={customVipSpending}
                  onChange={(e) => setCustomVipSpending(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white font-mono text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-300 block">
                  Ou Número Mínimo de Pedidos Concluídos
                </label>
                <input
                  type="number"
                  value={customVipOrders}
                  onChange={(e) => setCustomVipOrders(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white font-mono text-xs"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsVipSettingsOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-bold text-stone-300 cursor-pointer"
              >
                Voltar
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-xs font-black text-stone-950 cursor-pointer shadow-md"
              >
                Salvar Regras VIP
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
