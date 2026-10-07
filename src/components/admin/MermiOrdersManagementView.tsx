import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  XCircle,
  Eye,
  AlertTriangle,
  RotateCcw,
  CreditCard,
  QrCode,
  Award,
  ChevronRight,
  ShieldCheck,
  Calendar,
  DollarSign
} from 'lucide-react';
import { useMermiStore } from '../../context/MermiStoreContext';
import { OrderEntity } from '../../types/food';
import { CanonicalOrderStatus } from '../../types/mermiCoreEngine';
import { OrderStatus } from '../../types/food';

interface MermiOrdersManagementViewProps {
  onOpenCustomer360?: (customerId: string) => void;
}

export const MermiOrdersManagementView: React.FC<MermiOrdersManagementViewProps> = ({
  onOpenCustomer360
}) => {
  const {
    orders,
    crmCustomers,
    updateOrderStatus,
    cancelOrder,
    validateOrderStatusTransition,
    currentAdminUser,
    executeRefundAndReversal,
    paymentTransactions,
    showToast
  } = useMermiStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [paymentFilter, setPaymentFilter] = useState<string>('todos');
  const [deliveryFilter, setDeliveryFilter] = useState<string>('todos');
  const [dateFilter, setDateFilter] = useState<string>('todos');

  // Detalhes do Pedido Modal
  const [selectedOrder, setSelectedOrder] = useState<OrderEntity | null>(null);

  // Filtros aplicados
  const filteredOrders = orders.filter((order) => {
    const customer = crmCustomers.find((c) => c.id === order.user_id);
    const recipientName = order.address?.recipientName || customer?.name || 'Cliente';
    const recipientEmail = customer?.email || '';

    const matchesSearch =
      order.order_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipientEmail.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'todos' || order.order_status === statusFilter;

    const matchesPayment =
      paymentFilter === 'todos' ||
      (order.payment_method || '').toLowerCase() === paymentFilter.toLowerCase();

    const matchesDelivery =
      deliveryFilter === 'todos' ||
      (deliveryFilter === 'entrega' ? !!order.address : !order.address);

    return matchesSearch && matchesStatus && matchesPayment && matchesDelivery;
  });

  const handleStatusChange = (orderId: string, currentStatus: string, targetStatus: string) => {
    const canonicalCurrent = currentStatus as CanonicalOrderStatus;
    const canonicalTarget = targetStatus as CanonicalOrderStatus;

    const validation = validateOrderStatusTransition(canonicalCurrent, canonicalTarget);
    if (!validation.allowed) {
      showToast(`Transição bloqueada: ${validation.reason || 'Não permitida pelas regras de negócio'}`);
      return;
    }

    updateOrderStatus(orderId, targetStatus as OrderStatus);
    showToast(`Status do pedido ${orderId} atualizado para ${targetStatus.toUpperCase()}`);

    if (selectedOrder && selectedOrder.order_id === orderId) {
      setSelectedOrder({ ...selectedOrder, order_status: targetStatus as any });
    }
  };

  const handleCancelAndRefund = (order: OrderEntity) => {
    const relatedTx = paymentTransactions.find((t) => t.order_id === order.order_id);
    if (relatedTx && relatedTx.status === 'APPROVED') {
      const res = executeRefundAndReversal({
        paymentId: relatedTx.payment_id,
        orderId: order.order_id,
        reason: 'Cancelamento operacional pelo gestor'
      });
      showToast(res.message);
    } else {
      cancelOrder(order.order_id);
      showToast(`Pedido ${order.order_id} cancelado com sucesso.`);
    }

    if (selectedOrder && selectedOrder.order_id === order.order_id) {
      setSelectedOrder({ ...selectedOrder, order_status: 'cancelado' as any });
    }
  };

  return (
    <div className="space-y-6 font-['Outfit'] text-stone-200">
      {/* 1. CABEÇALHO DO MÓDULO */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#171E31] border border-stone-800 rounded-3xl p-6 shadow-xl">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-[#0EB24A] font-mono">
            SEÇÃO 02 & 06 — OPERAÇÃO, EXPEDIÇÃO & ATENDIMENTO
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
            Gerenciamento Canônico de Pedidos
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Controle de fluxo de ponta a ponta: do recebimento à entrega com separação estrita de status financeiro e regras de transição protegidas por RBAC.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl px-4 py-2 text-right">
            <span className="text-[10px] text-stone-400 font-bold block">Total de Pedidos</span>
            <span className="text-lg font-black text-[#0EB24A]">{orders.length}</span>
          </div>
        </div>
      </div>

      {/* 2. BARRA DE FILTROS & PESQUISA */}
      <div className="bg-[#171E31] border border-stone-800 rounded-3xl p-4 shadow-xl flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar por ID do pedido (#PED-...), nome do cliente ou e-mail..."
            className="w-full bg-[#101526] border border-stone-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-stone-500 outline-none focus:border-[#0EB24A]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#101526] border border-stone-800 rounded-2xl px-3 py-2.5 text-xs text-stone-300 outline-none focus:border-[#0EB24A]"
          >
            <option value="todos">Todos os Status</option>
            <option value="pedido_recebido">Recebido</option>
            <option value="pagamento_confirmado">Pago</option>
            <option value="em_producao">Em Produção</option>
            <option value="embalado">Embalado / Pronto</option>
            <option value="saiu_para_entrega">Saiu para Entrega</option>
            <option value="entregue">Entregue</option>
            <option value="cancelado">Cancelado</option>
          </select>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="bg-[#101526] border border-stone-800 rounded-2xl px-3 py-2.5 text-xs text-stone-300 outline-none focus:border-[#0EB24A]"
          >
            <option value="todos">Todos os Pagamentos</option>
            <option value="pix">PIX</option>
            <option value="cartao_credito">Cartão de Crédito</option>
            <option value="points">MerMi Points</option>
          </select>

          <select
            value={deliveryFilter}
            onChange={(e) => setDeliveryFilter(e.target.value)}
            className="bg-[#101526] border border-stone-800 rounded-2xl px-3 py-2.5 text-xs text-stone-300 outline-none focus:border-[#0EB24A]"
          >
            <option value="todos">Todas Modalidades</option>
            <option value="entrega">Entrega em Domicílio</option>
            <option value="retirada">Retirada na Unidade</option>
          </select>
        </div>
      </div>

      {/* 3. LISTAGEM DE PEDIDOS */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="bg-[#171E31] border border-stone-800 rounded-3xl p-12 text-center text-stone-400">
            <ShoppingBag className="w-12 h-12 mx-auto text-stone-600 mb-3" />
            <h3 className="font-bold text-stone-300 text-sm">Não há pedidos neste período ou filtro.</h3>
            <p className="text-xs text-stone-500 mt-1">Ajuste os filtros ou aguarde a entrada de novos pedidos reais.</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const customer = crmCustomers.find((c) => c.id === order.user_id);
            const recipientName = order.address?.recipientName || customer?.name || 'Cliente MerMi';
            const relatedTx = paymentTransactions.find((t) => t.order_id === order.order_id);

            const isDelivered = order.order_status === 'entregue';
            const isCancelled = order.order_status === 'cancelado';
            const isProduction = order.order_status === 'em_producao' || order.order_status === 'em_preparacao';
            const isOutForDelivery = order.order_status === 'saiu_para_entrega';

            return (
              <div
                key={order.order_id}
                className="bg-[#171E31] border border-stone-800 rounded-3xl p-5 hover:border-stone-700 transition-all shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="p-3 rounded-2xl bg-[#101526] border border-stone-800 text-emerald-400 shrink-0 mt-0.5">
                    <ShoppingBag className="w-6 h-6" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-white text-sm">{order.order_id}</span>
                      <span className="text-[11px] text-stone-400">
                        • {order.created_at ? new Date(order.created_at).toLocaleString('pt-BR') : 'Hoje'}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          isDelivered
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : isCancelled
                            ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                            : isOutForDelivery
                            ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                            : isProduction
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                        }`}
                      >
                        {order.order_status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() => onOpenCustomer360 && onOpenCustomer360(order.user_id)}
                        className="text-xs font-bold text-emerald-400 hover:underline cursor-pointer"
                      >
                        {recipientName}
                      </button>
                      <span className="text-stone-500 text-[11px]">|</span>
                      <span className="text-stone-300 text-xs">
                        {order.items.reduce((acc, i) => acc + i.quantity, 0)} prato(s) •{' '}
                        {order.address ? `Entrega em ${order.address.neighborhood}` : 'Retirada na Unidade'}
                      </span>
                    </div>

                    <div className="text-[11px] text-stone-400 mt-1 flex items-center gap-2">
                      <span className="font-mono text-stone-300">
                        Total: <strong className="text-white">R$ {(order.total || 0).toFixed(2)}</strong>
                      </span>
                      {relatedTx && (
                        <span className="text-[10px] bg-stone-900 px-2 py-0.5 rounded border border-stone-800 text-stone-400">
                          Pgto: {relatedTx.status} ({relatedTx.payment_method})
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <select
                    value={order.order_status}
                    onChange={(e) => handleStatusChange(order.order_id, order.order_status, e.target.value)}
                    disabled={isCancelled || isDelivered}
                    className="bg-[#101526] border border-stone-800 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none focus:border-[#0EB24A] disabled:opacity-50"
                  >
                    <option value="pedido_recebido">Recebido</option>
                    <option value="pagamento_confirmado">Pago</option>
                    <option value="em_producao">Em Produção</option>
                    <option value="embalado">Embalado</option>
                    <option value="saiu_para_entrega">Saiu para Entrega</option>
                    <option value="entregue">Entregue</option>
                    <option value="cancelado">Cancelado</option>
                  </select>

                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#0EB24A]" />
                    Detalhes
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 4. MODAL DE DETALHES COMPLETOS DO PEDIDO (SEÇÃO 07) */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-[#121727] border border-stone-800 rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            {/* MODAL HEADER */}
            <div className="p-5 border-b border-stone-800 flex items-center justify-between bg-[#171E31]">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-[#0EB24A]">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white font-mono">
                    PEDIDO #{selectedOrder.order_id}
                  </h3>
                  <span className="text-xs text-stone-400">
                    Emitido em: {new Date(selectedOrder.created_at).toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* MODAL BODY */}
            <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs text-stone-300">
              {/* DADOS DO CLIENTE & ENTREGA */}
              <div className="bg-[#101526] border border-stone-800 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Cliente</span>
                  <div className="font-bold text-white text-sm mt-0.5">
                    {selectedOrder.address?.recipientName || 'Cliente MerMi'}
                  </div>
                  <span className="text-[11px] text-stone-400 block mt-0.5">ID: {selectedOrder.user_id}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Modalidade de Entrega</span>
                  <div className="font-bold text-white text-xs mt-0.5">
                    {selectedOrder.address ? 'Entrega em Domicílio' : 'Retirada na Unidade Central'}
                  </div>
                  {selectedOrder.address && (
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      {selectedOrder.address.street}, {selectedOrder.address.number}{' '}
                      {selectedOrder.address.complement && `(${selectedOrder.address.complement})`} -{' '}
                      {selectedOrder.address.neighborhood}, {selectedOrder.address.city}
                    </p>
                  )}
                </div>
              </div>

              {/* ITENS DO PEDIDO COM QUANTIDADES E PERSONALIZAÇÕES */}
              <div className="bg-[#101526] border border-stone-800 rounded-2xl p-4">
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-2">
                  Itens do Pedido ({selectedOrder.items.length})
                </span>

                <div className="space-y-2 divide-y divide-stone-800/60">
                  {selectedOrder.items.map((item: any, idx: number) => (
                    <div key={idx} className="pt-2 flex justify-between items-start">
                      <div>
                        <div className="font-bold text-white text-xs">
                          {item.quantity}x {item.name}
                        </div>
                        <span className="text-[11px] text-stone-400 block">
                          Tamanho: {item.size} • Linha: {item.category?.toUpperCase() || 'FIT'}
                        </span>
                        {item.customization && (
                          <span className="text-[10px] text-emerald-400 block mt-0.5">
                            Personalizado: {item.customization.protein} + {item.customization.carb} + {item.customization.veg}
                          </span>
                        )}
                      </div>
                      <span className="font-mono font-bold text-white text-xs">
                        R$ {(item.unitPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* COMPOSIÇÃO DETALHADA DO VALOR (SEÇÃO 07) */}
              <div className="bg-[#101526] border border-stone-800 rounded-2xl p-4 space-y-1.5 font-mono">
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block font-sans mb-1">
                  Composição do Valor
                </span>

                <div className="flex justify-between text-stone-300">
                  <span>Subtotal dos Produtos:</span>
                  <span>R$ {(selectedOrder.subtotal || 0).toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-stone-300">
                  <span>Taxa de Entrega:</span>
                  <span>R$ {(selectedOrder.delivery_fee || 0).toFixed(2)}</span>
                </div>

                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Desconto Aplicado ({selectedOrder.coupon_code || 'PROMO'}):</span>
                    <span>- R$ {selectedOrder.discount.toFixed(2)}</span>
                  </div>
                )}

                {selectedOrder.points_used > 0 && (
                  <div className="flex justify-between text-purple-400">
                    <span>MerMi Points Utilizados:</span>
                    <span>{selectedOrder.points_used} pts</span>
                  </div>
                )}

                <div className="pt-2 border-t border-stone-800 flex justify-between font-bold text-white text-sm">
                  <span className="font-sans">Total Líquido:</span>
                  <span className="text-[#0EB24A]">R$ {(selectedOrder.total || 0).toFixed(2)}</span>
                </div>
              </div>

              {/* HISTÓRICO DE PRODUÇÃO & EXPEDIÇÃO */}
              <div className="bg-[#101526] border border-stone-800 rounded-2xl p-4">
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-2">
                  Fluxo Operacional de Produção & Expedição
                </span>

                <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold">
                  <div className={`p-2 rounded-xl border ${selectedOrder.order_status !== 'cancelado' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-stone-900 border-stone-800 text-stone-500'}`}>
                    1. Recebido
                  </div>
                  <div className={`p-2 rounded-xl border ${['em_producao', 'embalado', 'saiu_para_entrega', 'entregue'].includes(selectedOrder.order_status) ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-stone-900 border-stone-800 text-stone-500'}`}>
                    2. Cozinha
                  </div>
                  <div className={`p-2 rounded-xl border ${['embalado', 'saiu_para_entrega', 'entregue'].includes(selectedOrder.order_status) ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-stone-900 border-stone-800 text-stone-500'}`}>
                    3. Embalagem
                  </div>
                  <div className={`p-2 rounded-xl border ${['saiu_para_entrega', 'entregue'].includes(selectedOrder.order_status) ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-stone-900 border-stone-800 text-stone-500'}`}>
                    4. Expedição
                  </div>
                </div>
              </div>
            </div>

            {/* MODAL FOOTER */}
            <div className="p-4 border-t border-stone-800 bg-[#0E1322] flex items-center justify-between">
              {selectedOrder.order_status !== 'cancelado' && (
                <button
                  onClick={() => handleCancelAndRefund(selectedOrder)}
                  className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancelar & Estornar Pedido
                </button>
              )}

              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
