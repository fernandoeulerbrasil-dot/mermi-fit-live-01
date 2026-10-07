import React, { useState } from 'react';
import {
  Search,
  X,
  Users,
  ShoppingBag,
  Package,
  Award,
  Flame,
  Activity,
  Megaphone,
  Database,
  ArrowRight
} from 'lucide-react';
import { useMermiStore } from '../../context/MermiStoreContext';

interface MermiGlobalSearchViewProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab: (tab: string, meta?: any) => void;
}

export const MermiGlobalSearchView: React.FC<MermiGlobalSearchViewProps> = ({
  isOpen,
  onClose,
  onNavigateToTab
}) => {
  const {
    crmCustomers,
    orders,
    products,
    banners,
    raceEvents,
    virtualChallenges,
    rewards
  } = useMermiStore();

  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const matchedCustomers = q
    ? crmCustomers.filter(c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q))
    : [];

  const matchedOrders = q
    ? orders.filter(o => o.order_id.toLowerCase().includes(q) || (o.address?.recipientName || '').toLowerCase().includes(q))
    : [];

  const matchedProducts = q
    ? products.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
    : [];

  const matchedRaces = q
    ? raceEvents.filter(r => r.name.toLowerCase().includes(q) || (r.shortDescription || '').toLowerCase().includes(q))
    : [];

  const matchedChallenges = q
    ? virtualChallenges.filter(ch => ch.title.toLowerCase().includes(q))
    : [];

  const matchedRewards = q
    ? rewards.filter(rw => rw.title.toLowerCase().includes(q) || rw.description.toLowerCase().includes(q))
    : [];

  const totalResults =
    matchedCustomers.length +
    matchedOrders.length +
    matchedProducts.length +
    matchedRaces.length +
    matchedChallenges.length +
    matchedRewards.length;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 p-3 font-['Outfit']">
      <div className="bg-[#121727] border border-stone-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* INPUT HEADER */}
        <div className="p-4 border-b border-stone-800 flex items-center gap-3 bg-[#171E31]">
          <Search className="w-5 h-5 text-emerald-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar clientes, pedidos, pratos, corridas, desafios ou campanhas..."
            className="w-full bg-transparent text-sm text-white placeholder-stone-500 outline-none"
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-stone-800 text-stone-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* RESULTS SCROLLABLE */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs">
          {!q ? (
            <div className="py-12 text-center text-stone-500">
              Digite ao menos 2 caracteres para pesquisar no ecossistema inteiro.
            </div>
          ) : totalResults === 0 ? (
            <div className="py-12 text-center text-stone-500">
              Nenhum resultado encontrado para "{query}".
            </div>
          ) : (
            <>
              {/* CLIENTES */}
              {matchedCustomers.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                    Clientes ({matchedCustomers.length})
                  </span>
                  {matchedCustomers.map(c => (
                    <button
                      key={c.id}
                      onClick={() => {
                        onNavigateToTab('crm');
                        onClose();
                      }}
                      className="w-full p-2.5 rounded-xl bg-[#101526] hover:bg-stone-800/80 border border-stone-800/60 flex items-center justify-between text-left transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-emerald-400" />
                        <div>
                          <span className="font-bold text-white block">{c.name}</span>
                          <span className="text-[11px] text-stone-400">{c.email} • {c.segment}</span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-stone-500" />
                    </button>
                  ))}
                </div>
              )}

              {/* PEDIDOS */}
              {matchedOrders.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                    Pedidos ({matchedOrders.length})
                  </span>
                  {matchedOrders.map(o => (
                    <button
                      key={o.order_id}
                      onClick={() => {
                        onNavigateToTab('pedidos');
                        onClose();
                      }}
                      className="w-full p-2.5 rounded-xl bg-[#101526] hover:bg-stone-800/80 border border-stone-800/60 flex items-center justify-between text-left transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-blue-400" />
                        <div>
                          <span className="font-mono font-bold text-white block">{o.order_id}</span>
                          <span className="text-[11px] text-stone-400">Total: R$ {(o.total || 0).toFixed(2)} • Status: {o.order_status}</span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-stone-500" />
                    </button>
                  ))}
                </div>
              )}

              {/* PRODUTOS */}
              {matchedProducts.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                    Produtos & Cardápio ({matchedProducts.length})
                  </span>
                  {matchedProducts.map(p => (
                    <button
                      key={p.id}
                      onClick={() => {
                        onNavigateToTab('cardapio');
                        onClose();
                      }}
                      className="w-full p-2.5 rounded-xl bg-[#101526] hover:bg-stone-800/80 border border-stone-800/60 flex items-center justify-between text-left transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-amber-400" />
                        <div>
                          <span className="font-bold text-white block">{p.name}</span>
                          <span className="text-[11px] text-stone-400">{p.line?.toUpperCase()} • Linha Fit</span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-stone-500" />
                    </button>
                  ))}
                </div>
              )}

              {/* CORRIDAS */}
              {matchedRaces.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                    MerMi Run ({matchedRaces.length})
                  </span>
                  {matchedRaces.map(r => (
                    <button
                      key={r.id}
                      onClick={() => {
                        onNavigateToTab('gamificacao');
                        onClose();
                      }}
                      className="w-full p-2.5 rounded-xl bg-[#101526] hover:bg-stone-800/80 border border-stone-800/60 flex items-center justify-between text-left transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-purple-400" />
                        <div>
                          <span className="font-bold text-white block">{r.name}</span>
                          <span className="text-[11px] text-stone-400">Circuito MERMI RUN • Status: {r.status}</span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-stone-500" />
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
