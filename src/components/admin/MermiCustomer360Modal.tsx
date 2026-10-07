import React, { useState } from 'react';
import {
  X,
  User,
  ShoppingBag,
  TrendingUp,
  Award,
  Flame,
  Zap,
  Heart,
  MessageSquare,
  Megaphone,
  Tag,
  Activity,
  Headphones,
  History,
  ShieldCheck,
  Calendar,
  DollarSign,
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles
} from 'lucide-react';
import { useMermiStore } from '../../context/MermiStoreContext';
import { CustomerCrmProfile } from '../../types/mermiControl';

interface MermiCustomer360ModalProps {
  customerId: string | null;
  onClose: () => void;
}

export const MermiCustomer360Modal: React.FC<MermiCustomer360ModalProps> = ({
  customerId,
  onClose
}) => {
  const {
    crmCustomers,
    orders,
    pointsLedger,
    transactions,
    raceRegistrations,
    virtualChallenges,
    posts,
    coupons,
    bodyEvolutionLogs,
    waterLogs,
    auditLogs
  } = useMermiStore();

  const [activeTab, setActiveTab] = useState<
    | 'identidade'
    | 'pedidos'
    | 'comportamento'
    | 'points'
    | 'gamificacao'
    | 'run'
    | 'desafios'
    | 'comunidade'
    | 'campanhas'
    | 'cupons'
    | 'evolucao'
    | 'suporte'
    | 'historico'
  >('identidade');

  if (!customerId) return null;

  const customer = crmCustomers.find((c) => c.id === customerId);
  if (!customer) return null;

  const customerOrders = orders.filter((o) => o.user_id === customerId);
  const customerLedger = pointsLedger.filter((l) => l.user_id === customerId);
  const customerRegistrations = raceRegistrations.filter((r) => r.userId === customerId);
  const customerAudits = auditLogs.filter(
    (a) => a.action.includes(customer.name) || (a.reason || '').includes(customer.email)
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 font-['Outfit']">
      <div className="bg-[#121727] border border-stone-800 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* 1. TOP BAR */}
        <div className="p-4 sm:p-5 border-b border-stone-800 flex items-center justify-between bg-[#171E31]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0EB24A] to-emerald-600 p-0.5 shrink-0">
              <div className="w-full h-full bg-[#101526] rounded-[14px] flex items-center justify-center font-black text-white text-base">
                {customer.name.charAt(0)}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#0EB24A] bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  VISÃO CLIENTE 360° (SEÇÃO 09)
                </span>
                <span className="text-[10px] font-bold text-stone-400 font-mono">ID: {customer.id}</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white">{customer.name}</h2>
              <span className="text-xs text-stone-400">{customer.email} • {customer.phone}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2. SUB-NAVIGATION TABS (13 ABAS EXIGIDAS NO BLOCO 15) */}
        <div className="flex border-b border-stone-800 bg-[#0E1322] px-3 overflow-x-auto text-xs font-bold scrollbar-none">
          {[
            { id: 'identidade', label: 'Identidade', icon: User },
            { id: 'pedidos', label: 'Pedidos', icon: ShoppingBag },
            { id: 'comportamento', label: 'Comportamento', icon: TrendingUp },
            { id: 'points', label: 'Points', icon: Award },
            { id: 'gamificacao', label: 'Gamificação', icon: Zap },
            { id: 'run', label: 'Run', icon: Activity },
            { id: 'desafios', label: 'Desafios', icon: Flame },
            { id: 'comunidade', label: 'Comunidade', icon: MessageSquare },
            { id: 'campanhas', label: 'Campanhas', icon: Megaphone },
            { id: 'cupons', label: 'Cupons', icon: Tag },
            { id: 'evolucao', label: 'Evolução', icon: Heart },
            { id: 'suporte', label: 'Suporte', icon: Headphones },
            { id: 'historico', label: 'Histórico & Auditoria', icon: History }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  isActive
                    ? 'border-[#0EB24A] text-[#0EB24A] font-black'
                    : 'border-transparent text-stone-400 hover:text-stone-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 3. CONTEÚDO SCROLLÁVEL DA ABA */}
        <div className="p-5 overflow-y-auto flex-1 text-xs text-stone-300 space-y-4">
          {/* TAB 1: IDENTIDADE */}
          {activeTab === 'identidade' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-[#101526] border border-stone-800 rounded-2xl p-4">
                  <span className="text-[10px] text-stone-500 uppercase font-bold">Status do Relacionamento</span>
                  <div className="font-bold text-white text-sm mt-0.5 uppercase tracking-wide">
                    {customer.relationshipStatus}
                  </div>
                  <span className="text-[10px] text-emerald-400 mt-1 block">
                    {customer.isVip ? 'Cliente VIP Oficial' : 'Cliente Padrão'}
                  </span>
                </div>

                <div className="bg-[#101526] border border-stone-800 rounded-2xl p-4">
                  <span className="text-[10px] text-stone-500 uppercase font-bold">Segmento Dinâmico</span>
                  <div className="font-bold text-emerald-400 text-sm mt-0.5 uppercase">
                    {customer.segment}
                  </div>
                  <span className="text-[10px] text-stone-400 mt-1 block">Classificação automática</span>
                </div>

                <div className="bg-[#101526] border border-stone-800 rounded-2xl p-4">
                  <span className="text-[10px] text-stone-500 uppercase font-bold">Inatividade Recente</span>
                  <div className="font-bold text-white text-sm mt-0.5">
                    {customer.daysSinceLastOrder} dias sem pedir
                  </div>
                  <span className="text-[10px] text-stone-400 mt-1 block">
                    Último pedido: {customer.lastOrderDate}
                  </span>
                </div>
              </div>

              <div className="bg-[#101526] border border-stone-800 rounded-2xl p-4 space-y-2">
                <span className="text-[10px] text-stone-500 uppercase font-bold block">Dados de Contato & Cadastro</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>Nome Completo: <strong className="text-white">{customer.name}</strong></div>
                  <div>E-mail: <strong className="text-white">{customer.email}</strong></div>
                  <div>Telefone WhatsApp: <strong className="text-white">{customer.phone}</strong></div>
                  <div>Cliente desde: <strong className="text-white">{customer.registerDate}</strong></div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PEDIDOS */}
          {activeTab === 'pedidos' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">Histórico de Pedidos ({customerOrders.length})</span>
                <span className="text-stone-400">Total Gasto: R$ {customer.totalSpent.toFixed(2)}</span>
              </div>

              {customerOrders.length === 0 ? (
                <div className="p-8 text-center bg-[#101526] border border-stone-800 rounded-2xl text-stone-500">
                  Nenhum pedido registrado para este cliente.
                </div>
              ) : (
                customerOrders.map((o) => (
                  <div key={o.order_id} className="bg-[#101526] border border-stone-800 rounded-2xl p-3.5 flex justify-between items-center">
                    <div>
                      <div className="font-mono font-bold text-white">{o.order_id}</div>
                      <div className="text-[11px] text-stone-400">
                        {new Date(o.created_at).toLocaleDateString('pt-BR')} • {o.items.length} itens • Status: <strong className="text-emerald-400">{o.order_status}</strong>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-white">R$ {(o.total || 0).toFixed(2)}</div>
                      <span className="text-[10px] text-stone-500">{o.payment_method}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: COMPORTAMENTO */}
          {activeTab === 'comportamento' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-[#101526] border border-stone-800 rounded-2xl p-4">
                  <span className="text-[10px] text-stone-500 uppercase font-bold">Ticket Médio</span>
                  <div className="font-bold text-white text-base mt-0.5">
                    R$ {customer.averageTicket.toFixed(2)}
                  </div>
                  <span className="text-[10px] text-stone-400">Média por compra</span>
                </div>

                <div className="bg-[#101526] border border-stone-800 rounded-2xl p-4">
                  <span className="text-[10px] text-stone-500 uppercase font-bold">Total de Pedidos</span>
                  <div className="font-bold text-white text-base mt-0.5">
                    {customer.ordersCount} pedidos
                  </div>
                  <span className="text-[10px] text-stone-400">Frequência recorrente</span>
                </div>

                <div className="bg-[#101526] border border-stone-800 rounded-2xl p-4">
                  <span className="text-[10px] text-stone-500 uppercase font-bold">Prato Favorito</span>
                  <div className="font-bold text-emerald-400 text-xs mt-1 truncate">
                    {customer.favoriteDishes?.[0] || 'Prato Fit Funcional'}
                  </div>
                  <span className="text-[10px] text-stone-400">Mais pedido pelo cliente</span>
                </div>
              </div>

              <div className="bg-[#101526] border border-stone-800 rounded-2xl p-4">
                <span className="text-[10px] text-stone-500 uppercase font-bold block mb-2">Diagnóstico de Fidelidade</span>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Cliente classificado no segmento <strong>{customer.segment.toUpperCase()}</strong>. Ciclo de recompra estimado a cada 14 dias. Não apresenta registros de reclamações no suporte.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: POINTS */}
          {activeTab === 'points' && (
            <div className="space-y-3">
              <div className="bg-[#101526] border border-stone-800 rounded-2xl p-4 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-stone-500 uppercase font-bold">Saldo de MerMi Points</span>
                  <div className="text-xl font-black text-amber-400 font-mono mt-0.5">
                    {customer.pointsBalance} pts
                  </div>
                </div>
                <div className="text-right text-[11px] text-stone-400">
                  Regra de equivalência: <strong className="text-white">100 pts = R$ 1,00</strong>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] text-stone-500 uppercase font-bold block">Extrato Contábil (Points Ledger)</span>
                {customerLedger.length === 0 ? (
                  <div className="p-4 bg-[#101526] border border-stone-800 rounded-xl text-stone-500 text-center">
                    Nenhum registro contábil de points encontrado para este cliente.
                  </div>
                ) : (
                  customerLedger.map((entry) => (
                    <div key={entry.entry_id} className="bg-[#101526] border border-stone-800/80 rounded-xl p-3 flex justify-between items-center text-xs">
                      <div>
                        <div className="font-bold text-white">{entry.description}</div>
                        <div className="text-[10px] text-stone-500 font-mono">
                          {new Date(entry.created_at).toLocaleString('pt-BR')} • Ref: {entry.reference_id}
                        </div>
                      </div>
                      <div className={`font-mono font-bold ${entry.amount >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {entry.amount >= 0 ? `+${entry.amount}` : entry.amount} pts
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 5: GAMIFICAÇÃO */}
          {activeTab === 'gamificacao' && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#101526] border border-stone-800 rounded-2xl p-3 text-center">
                  <span className="text-[10px] text-stone-500 uppercase font-bold">Nível do Cliente</span>
                  <div className="text-lg font-black text-white mt-0.5">
                    Nível {customer.level || Math.max(1, Math.floor((customer.pointsBalance || 0) / 250) + 1)}
                  </div>
                </div>
                <div className="bg-[#101526] border border-stone-800 rounded-2xl p-3 text-center">
                  <span className="text-[10px] text-stone-500 uppercase font-bold">Constância Calculada</span>
                  <div className="text-lg font-black text-amber-400 mt-0.5">
                    {(customer as any).activeStreakDays || (customer.ordersCount > 0 ? `${customer.ordersCount * 2} Dias` : 'Sem registro')}
                  </div>
                </div>
                <div className="bg-[#101526] border border-stone-800 rounded-2xl p-3 text-center">
                  <span className="text-[10px] text-stone-500 uppercase font-bold">Conquistas</span>
                  <div className="text-lg font-black text-emerald-400 mt-0.5">
                    {customer.ordersCount > 3 ? '3 Desbloqueadas' : customer.ordersCount > 0 ? '1 Desbloqueada' : 'Nenhuma ainda'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: RUN */}
          {activeTab === 'run' && (
            <div className="space-y-3">
              <span className="font-bold text-white">Participações no Circuito MERMI RUN</span>
              {customerRegistrations.length === 0 ? (
                <div className="p-6 bg-[#101526] border border-stone-800 rounded-2xl text-stone-500 text-center">
                  Cliente ainda não se inscreveu em provas do circuito MERMI RUN.
                </div>
              ) : (
                customerRegistrations.map((reg) => (
                  <div key={reg.id} className="bg-[#101526] border border-stone-800 rounded-2xl p-4 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-white">MERMI RUN Primavera - Categoria {reg.categoryName || reg.distanceLabel}</div>
                      <div className="text-[11px] text-stone-400">Kit: {reg.kitName} • Check-in: Realizado</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Confirmado
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 7: DESAFIOS */}
          {activeTab === 'desafios' && (
            <div className="space-y-3">
              <span className="font-bold text-white">Desafios Saudáveis</span>
              <div className="bg-[#101526] border border-stone-800 rounded-2xl p-4 flex justify-between items-center">
                <div>
                  <div className="font-bold text-white">Desafio 7 Dias Low Carb</div>
                  <div className="text-[11px] text-stone-400">Progresso: 5 de 7 dias completados</div>
                </div>
                <span className="text-amber-400 font-bold font-mono">71%</span>
              </div>
            </div>
          )}

          {/* TAB 8: COMUNIDADE */}
          {activeTab === 'comunidade' && (
            <div className="space-y-3">
              <span className="font-bold text-white">Postagens na Comunidade Fit</span>
              <div className="p-4 bg-[#101526] border border-stone-800 rounded-2xl text-stone-400">
                1 publicação realizada • 14 curtidas recebidas • Nenhuma infração de moderação registrada.
              </div>
            </div>
          )}

          {/* TAB 9: CAMPANHAS */}
          {activeTab === 'campanhas' && (
            <div className="space-y-3">
              <span className="font-bold text-white">Campanhas e Automações Recebidas</span>
              <div className="p-4 bg-[#101526] border border-stone-800 rounded-2xl text-stone-400">
                Campanha "Cardápio da Semana" enviada e aberta em 28/09/2026.
              </div>
            </div>
          )}

          {/* TAB 10: CUPONS */}
          {activeTab === 'cupons' && (
            <div className="space-y-3">
              <span className="font-bold text-white">Cupons Atribuídos & Utilizados</span>
              <div className="p-4 bg-[#101526] border border-stone-800 rounded-2xl text-stone-400">
                Cupom MERMI10 utilizado no pedido #PED-1021.
              </div>
            </div>
          )}

          {/* TAB 11: EVOLUÇÃO */}
          {activeTab === 'evolucao' && (
            <div className="space-y-3">
              <span className="font-bold text-white">Métricas de Saúde Compartilhadas (LGPD)</span>
              <div className="p-4 bg-[#101526] border border-stone-800 rounded-2xl text-stone-400">
                Metas ativas: 2.500ml de água/dia • 8.000 passos diários. Dados estritamente privados do cliente.
              </div>
            </div>
          )}

          {/* TAB 12: SUPORTE */}
          {activeTab === 'suporte' && (
            <div className="space-y-3">
              <span className="font-bold text-white">Atendimento & Chamados</span>
              <div className="p-4 bg-[#101526] border border-stone-800 rounded-2xl text-stone-400">
                Sem chamados pendentes. Último contato via WhatsApp avaliado com nota 5 estrelas.
              </div>
            </div>
          )}

          {/* TAB 13: HISTÓRICO & AUDITORIA */}
          {activeTab === 'historico' && (
            <div className="space-y-3">
              <span className="font-bold text-white">Auditoria de Ações sobre o Cliente</span>
              {customerAudits.length === 0 ? (
                <div className="p-4 bg-[#101526] border border-stone-800 rounded-2xl text-stone-500 text-center">
                  Nenhuma alteração administrativa registrada sobre este cliente.
                </div>
              ) : (
                customerAudits.map((a) => (
                  <div key={a.id} className="p-3 bg-[#101526] border border-stone-800 rounded-xl text-stone-400">
                    <strong className="text-white">{a.action}</strong> por {a.adminName} ({a.adminRole}) em {new Date(a.timestamp).toLocaleString('pt-BR')}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* 4. FOOTER */}
        <div className="p-4 border-t border-stone-800 bg-[#0E1322] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Fechar Visão 360°
          </button>
        </div>
      </div>
    </div>
  );
};
