import React, { useState } from 'react';
import { useMermiStore } from '../../context/MermiStoreContext';
import { OrderEntity } from '../../types/food';
import { OrderTimeline } from '../orders/OrderTimeline';
import {
  ShoppingBag,
  RotateCcw,
  Clock,
  CheckCircle2,
  MapPin,
  ChevronDown,
  ChevronUp,
  Award,
  Truck,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface MeusPedidosViewProps {
  onNavigate: (tab: string) => void;
  onOpenCart?: () => void;
}

export const MeusPedidosView: React.FC<MeusPedidosViewProps> = ({ onNavigate, onOpenCart }) => {
  const { orders, repeatOrder, showToast } = useMermiStore();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(
    orders.length > 0 ? orders[0].order_id : null
  );

  const handleRepeatOrder = (orderId: string) => {
    const res = repeatOrder(orderId);
    if (res.success) {
      if (onOpenCart) {
        onOpenCart();
      } else {
        onNavigate('cardapio');
      }
    }
  };

  const getStatusBadge = (status: OrderEntity['order_status']) => {
    switch (status) {
      case 'entregue':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Entregue
          </span>
        );
      case 'cancelado':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-300">
            Cancelado
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1 animate-pulse">
            <Clock className="w-3 h-3" /> Em Andamento
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF7EE] text-stone-900 pb-28 pt-4 px-3 sm:px-4 animate-fade-in">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header Oficial */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#0EB24A]">
                HISTÓRICO & ACOMPANHAMENTO EM TEMPO REAL
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-stone-900 font-['Outfit'] mt-0.5">
              Meus Pedidos
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Acompanhe a linha de produção, logística de entrega e repita marmitas favoritas em um clique.
            </p>
          </div>

          <button
            onClick={() => onNavigate('cardapio')}
            className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider bg-[#0EB24A] hover:bg-emerald-600 text-white flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer self-start sm:self-auto"
          >
            <span>Fazer Novo Pedido</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Lista de Pedidos */}
        {orders.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white border border-stone-200 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#0EB24A] flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-stone-900 font-['Outfit']">
                Você ainda não realizou pedidos
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Conheça nosso cardápio Fit e Fit Premium ou monte sua marmita com porções sob medida.
              </p>
            </div>
            <button
              onClick={() => onNavigate('cardapio')}
              className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-[#0EB24A] hover:bg-emerald-600 text-white shadow-md cursor-pointer"
            >
              Explorar Cardápio Oficial
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const isExpanded = expandedOrderId === order.order_id;
              const isOngoing = order.order_status !== 'entregue' && order.order_status !== 'cancelado';

              return (
                <div
                  key={order.order_id}
                  className={`rounded-3xl bg-white border transition-all duration-300 overflow-hidden shadow-xs ${
                    isOngoing ? 'border-amber-300 ring-1 ring-amber-200/50' : 'border-stone-200'
                  }`}
                >
                  {/* Card Header */}
                  <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-base text-stone-950 font-['Outfit']">
                          {order.order_id}
                        </span>
                        {getStatusBadge(order.order_status)}
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                          <Award className="w-3 h-3 text-amber-600" /> +{order.points_earned} Points
                        </span>
                      </div>
                      <span className="text-[11px] text-stone-400 block mt-1 font-medium">
                        Realizado em {new Date(order.created_at).toLocaleDateString('pt-BR')} às {new Date(order.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} · Previsão: {order.estimated_delivery_time}
                      </span>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                      <div className="text-left sm:text-right">
                        <span className="text-[9px] uppercase tracking-wider text-stone-400 font-bold block">
                          Valor Total
                        </span>
                        <span className="text-base sm:text-lg font-black text-[#0EB24A] font-['Outfit']">
                          R$ {order.total.toFixed(2).replace('.', ',')}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setExpandedOrderId(isExpanded ? null : order.order_id)}
                        className="px-3 py-1.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <span>{isExpanded ? 'Ocultar Detalhes' : 'Ver Detalhes'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Resumo de Itens sempre visível */}
                  <div className="px-4 sm:px-5 py-3 bg-stone-50/50 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 flex-wrap text-stone-700">
                      <span className="font-bold text-stone-500">Pratos:</span>
                      {order.items.map((item, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-white border border-stone-200 font-medium text-[11px]"
                        >
                          {item.quantity}x {item.name}
                        </span>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRepeatOrder(order.order_id)}
                      className="px-3 py-1.5 rounded-xl border border-[#0EB24A] text-[#0EB24A] hover:bg-emerald-50 active:scale-95 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" /> Repetir Pedido
                    </button>
                  </div>

                  {/* Detalhes Expandidos: Linha do Tempo de 7 Etapas & Financeiro */}
                  {isExpanded && (
                    <div className="p-4 sm:p-5 border-t border-stone-200 space-y-5 bg-white animate-fade-in">
                      
                      {/* Timeline Oficial de 7 Etapas */}
                      <div className="p-4 rounded-2xl bg-[#FBF7EE] border border-stone-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black uppercase tracking-wider text-stone-900 font-['Outfit'] flex items-center gap-1.5">
                            <Truck className="w-4 h-4 text-[#0EB24A]" /> Linha de Produção & Entrega Oficial
                          </span>
                          <span className="text-[10px] text-stone-500 font-medium">
                            Status Atual: <strong className="uppercase text-stone-800">{order.order_status.replace('_', ' ')}</strong>
                          </span>
                        </div>

                        <OrderTimeline
                          timeline={order.timeline}
                          currentStatus={order.order_status}
                        />
                      </div>

                      {/* Endereço e Pagamento */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-1">
                          <span className="text-[10px] uppercase font-bold text-stone-400 block">
                            Endereço de Destino
                          </span>
                          <p className="font-bold text-stone-900">
                            {order.address.street}, {order.address.number} {order.address.complement ? `- ${order.address.complement}` : ''}
                          </p>
                          <p className="text-stone-500 text-[11px]">
                            {order.address.neighborhood}, {order.address.city} - {order.address.state}
                          </p>
                        </div>

                        <div className="p-3 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-1">
                          <span className="text-[10px] uppercase font-bold text-stone-400 block">
                            Pagamento & Faturamento
                          </span>
                          <p className="font-bold text-stone-900 capitalize">
                            Forma: {order.payment_method === 'pix' ? 'PIX Instantâneo' : 'Cartão de Crédito/Débito'}
                          </p>
                          <p className="text-emerald-600 font-semibold text-[11px]">
                            Status: Pagamento Aprovado e Faturado
                          </p>
                        </div>
                      </div>

                      {/* Detalhamento de Valores */}
                      <div className="pt-3 border-t border-stone-100 space-y-1 text-xs text-stone-600">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>R$ {order.subtotal.toFixed(2).replace('.', ',')}</span>
                        </div>
                        {order.discount > 0 && (
                          <div className="flex justify-between text-emerald-600 font-bold">
                            <span>Desconto ({order.coupon_code}):</span>
                            <span>- R$ {order.discount.toFixed(2).replace('.', ',')}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>Frete:</span>
                          <span>{order.delivery_fee === 0 ? <strong className="text-emerald-600">GRÁTIS</strong> : `R$ ${order.delivery_fee.toFixed(2).replace('.', ',')}`}</span>
                        </div>
                        <div className="flex justify-between text-base font-black text-stone-950 font-['Outfit'] pt-1 border-t border-stone-200">
                          <span>Total Pago:</span>
                          <span className="text-[#0EB24A]">R$ {order.total.toFixed(2).replace('.', ',')}</span>
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
