import React, { useState } from 'react';
import { BottomSheet } from '../../design-system/components/Feedback';
import { useMermiStore } from '../../context/MermiStoreContext';
import { AppNotification, NotificationCategory } from '../../types/mermiNotifications';
import { NotificationPreferencesModal } from './NotificationPreferencesModal';
import { DailySummaryModal } from './DailySummaryModal';
import {
  Bell,
  CheckCheck,
  Trash2,
  Calendar,
  Settings,
  Droplets,
  Award,
  ShoppingBag,
  ExternalLink,
  Sparkles,
  Flame,
  CheckCircle2,
  Clock,
  Layers
} from 'lucide-react';

interface NotificacoesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
}

export const NotificacoesDrawer: React.FC<NotificacoesDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    clearAllNotifications,
    addWaterLog,
    showToast
  } = useMermiStore();

  const [filterCategory, setFilterCategory] = useState<string>('TODAS');
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  const unreadCount = notifications.filter((n) => n.status !== 'lida').length;

  const filteredNotifications = notifications.filter((n) => {
    if (filterCategory === 'TODAS') return true;
    if (filterCategory === 'PEDIDOS') return ['PEDIDO', 'PAGAMENTO', 'ENTREGA'].includes(n.category);
    if (filterCategory === 'POINTS') return ['POINTS', 'RECOMPENSA'].includes(n.category);
    if (filterCategory === 'CORRIDAS') return ['MERMI_RUN', 'DESAFIOS'].includes(n.category);
    if (filterCategory === 'SAUDE') return n.category === 'SAUDE_BEM_ESTAR';
    if (filterCategory === 'CAMPANHAS') return ['PROMOÇÃO', 'CAMPANHA', 'CONTEUDO', 'SISTEMA'].includes(n.category);
    return true;
  });

  const handleNotificationClick = (notif: AppNotification) => {
    if (notif.status !== 'lida') {
      markNotificationAsRead(notif.notification_id);
    }
    if (notif.action_target && notif.action_type === 'deep_link') {
      onClose();
      onNavigate(notif.action_target);
    }
  };

  const handleInteractiveWater = (notifId: string, amountMl: number) => {
    addWaterLog(amountMl, 'manual');
    markNotificationAsRead(notifId);
    showToast(`💧 +${amountMl}ml de água registrados com sucesso!`);
  };

  return (
    <>
      <BottomSheet isOpen={isOpen} onClose={onClose} title="Central de Notificações">
        <div className="space-y-4 pb-6 text-stone-900">
          
          {/* Header Controls: Unread badge, Mark All Read & Modals shortcuts */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-stone-200">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-stone-800 font-['Outfit']">
                Avisos do Ecossistema
              </span>
              {unreadCount > 0 ? (
                <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black">
                  {unreadCount} novas
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                  Todas lidas
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => setIsSummaryOpen(true)}
                className="text-stone-600 hover:text-stone-950 font-bold flex items-center gap-1 cursor-pointer transition-colors px-2 py-1 rounded-lg bg-stone-100 hover:bg-stone-200"
                title="Abrir Meu Resumo do Dia"
              >
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span>Resumo do Dia</span>
              </button>

              <button
                onClick={() => setIsPreferencesOpen(true)}
                className="text-stone-600 hover:text-stone-950 font-bold flex items-center gap-1 cursor-pointer transition-colors px-2 py-1 rounded-lg bg-stone-100 hover:bg-stone-200"
                title="Configurar Notificações"
              >
                <Settings className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Preferências</span>
              </button>

              {unreadCount > 0 && (
                <button
                  onClick={markAllNotificationsAsRead}
                  className="text-[#0EB24A] font-bold hover:underline cursor-pointer flex items-center gap-1 ml-auto sm:ml-0"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Marcar lidas</span>
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px] font-bold">
            {[
              { id: 'TODAS', label: 'Todas' },
              { id: 'PEDIDOS', label: 'Pedidos' },
              { id: 'POINTS', label: 'Points & Drops' },
              { id: 'CORRIDAS', label: 'Run & Desafios' },
              { id: 'SAUDE', label: 'Saúde & Água' },
              { id: 'CAMPANHAS', label: 'Campanhas' }
            ].map((tab) => {
              const isActive = filterCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setFilterCategory(tab.id)}
                  className={`px-3 py-1.5 rounded-full shrink-0 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-stone-900 text-white font-black shadow-sm'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Notification List */}
          <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-0.5">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-200 space-y-2">
                <Bell className="w-8 h-8 text-stone-400 mx-auto stroke-[1.5]" />
                <p className="text-xs font-bold text-stone-600">
                  Nenhuma notificação encontrada nesta categoria.
                </p>
                <p className="text-[10px] text-stone-400">
                  Novidades, pedidos e lembretes saudáveis aparecerão aqui.
                </p>
              </div>
            ) : (
              filteredNotifications.map((n) => {
                const isUnread = n.status !== 'lida';
                return (
                  <div
                    key={n.notification_id}
                    className={`p-3.5 rounded-2xl border transition-all relative ${
                      isUnread
                        ? 'bg-white border-emerald-500/40 shadow-sm'
                        : 'bg-stone-50/80 border-stone-200/70 text-stone-600'
                    }`}
                  >
                    {/* Top Row: Category tag, time, and delete */}
                    <div className="flex items-center justify-between gap-2 mb-1.5 text-[10px]">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`px-2 py-0.5 rounded-md font-bold uppercase tracking-wider text-[9px] ${
                            n.category === 'PEDIDO' || n.category === 'PAGAMENTO'
                              ? 'bg-emerald-100 text-emerald-800'
                              : n.category === 'POINTS' || n.category === 'RECOMPENSA'
                              ? 'bg-amber-100 text-amber-800'
                              : n.category === 'MERMI_RUN' || n.category === 'DESAFIOS'
                              ? 'bg-blue-100 text-blue-800'
                              : n.category === 'SAUDE_BEM_ESTAR'
                              ? 'bg-cyan-100 text-cyan-800'
                              : 'bg-stone-200 text-stone-700'
                          }`}
                        >
                          {n.category}
                        </span>

                        {isUnread && (
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-stone-400">
                        <span className="text-[10px]">
                          {new Date(n.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <button
                          onClick={() => deleteNotification(n.notification_id)}
                          className="hover:text-rose-500 p-0.5 cursor-pointer transition-colors"
                          title="Excluir notificação"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Notification Title & Body */}
                    <div
                      onClick={() => handleNotificationClick(n)}
                      className="cursor-pointer space-y-1"
                    >
                      <h4 className={`text-xs ${isUnread ? 'font-black text-stone-900' : 'font-bold text-stone-700'}`}>
                        {n.title}
                      </h4>
                      <p className="text-[11px] text-stone-600 leading-relaxed">
                        {n.message}
                      </p>
                    </div>

                    {/* Interactive Actions (e.g. Water Logging) */}
                    {n.interactive_actions && n.interactive_actions.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center gap-2">
                        <span className="text-[10px] font-bold text-cyan-700 flex items-center gap-1">
                          <Droplets className="w-3 h-3" /> Registrar rápido:
                        </span>
                        {n.interactive_actions.map((act, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleInteractiveWater(n.notification_id, act.payload || 250)}
                            className="px-2.5 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-[10px] cursor-pointer shadow-xs transition-colors"
                          >
                            {act.label}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Deep Link Action Button */}
                    {n.action_target && n.action_type === 'deep_link' && (
                      <div className="mt-2 pt-1.5 flex justify-end">
                        <button
                          onClick={() => handleNotificationClick(n)}
                          className="text-[11px] font-bold text-[#0EB24A] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>Abrir no app</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                  </div>
                );
              })
            )}
          </div>

        </div>
      </BottomSheet>

      {/* Preferences Modal */}
      <NotificationPreferencesModal
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
      />

      {/* Daily Summary Modal */}
      <DailySummaryModal
        isOpen={isSummaryOpen}
        onClose={() => setIsSummaryOpen(false)}
        onNavigate={onNavigate}
      />
    </>
  );
};
