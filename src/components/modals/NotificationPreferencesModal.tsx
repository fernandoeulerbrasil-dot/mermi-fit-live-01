import React, { useState } from 'react';
import { useMermiStore } from '../../context/MermiStoreContext';
import {
  Bell,
  Check,
  Moon,
  ShieldCheck,
  Mail,
  Smartphone,
  MessageSquare,
  X,
  Volume2,
  Clock,
  Sparkles
} from 'lucide-react';

interface NotificationPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationPreferencesModal: React.FC<NotificationPreferencesModalProps> = ({
  isOpen,
  onClose
}) => {
  const { notificationPreferences, updateNotificationPreferences, showToast } = useMermiStore();

  const [channels, setChannels] = useState(notificationPreferences.channels);
  const [categories, setCategories] = useState(notificationPreferences.categories);
  const [quietHours, setQuietHours] = useState(notificationPreferences.quiet_hours);

  if (!isOpen) return null;

  const handleSave = () => {
    updateNotificationPreferences({
      channels,
      categories,
      quiet_hours: quietHours
    });
    showToast('Preferências de notificação salvas com sucesso!');
    onClose();
  };

  const toggleCategory = (key: keyof typeof categories) => {
    setCategories((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleChannel = (key: keyof typeof channels) => {
    setChannels((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-[#171E31] border border-stone-800 text-stone-100 rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-stone-800 flex items-center justify-between bg-[#101526]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-[#0EB24A] flex items-center justify-center border border-emerald-500/20">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white font-['Outfit']">
                Preferências de Notificações
              </h3>
              <p className="text-[11px] text-stone-400">
                Personalize canais, categorias e horário de silêncio
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-6 overflow-y-auto flex-1 text-xs">
          
          {/* 1. CANAIS DE ENTREGA */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-black uppercase tracking-wider text-emerald-400 font-['Outfit']">
              1. CANAIS DE COMUNICAÇÃO
            </h4>
            
            <div className="grid grid-cols-2 gap-2.5">
              
              <div
                onClick={() => toggleChannel('push')}
                className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  channels.push
                    ? 'bg-emerald-950/30 border-emerald-500/50 text-white'
                    : 'bg-[#0E131F] border-stone-800 text-stone-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold">Notificações Push</span>
                </div>
                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${channels.push ? 'bg-emerald-500 text-stone-950' : 'bg-stone-700'}`}>
                  {channels.push && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>

              <div
                onClick={() => toggleChannel('in_app')}
                className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  channels.in_app
                    ? 'bg-emerald-950/30 border-emerald-500/50 text-white'
                    : 'bg-[#0E131F] border-stone-800 text-stone-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold">Avisos no App</span>
                </div>
                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${channels.in_app ? 'bg-emerald-500 text-stone-950' : 'bg-stone-700'}`}>
                  {channels.in_app && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>

              <div
                onClick={() => toggleChannel('email')}
                className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  channels.email
                    ? 'bg-emerald-950/30 border-emerald-500/50 text-white'
                    : 'bg-[#0E131F] border-stone-800 text-stone-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold">E-mail</span>
                </div>
                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${channels.email ? 'bg-emerald-500 text-stone-950' : 'bg-stone-700'}`}>
                  {channels.email && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>

              <div
                onClick={() => toggleChannel('whatsapp')}
                className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  channels.whatsapp
                    ? 'bg-emerald-950/30 border-emerald-500/50 text-white'
                    : 'bg-[#0E131F] border-stone-800 text-stone-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <div>
                    <span className="font-bold block leading-none">WhatsApp</span>
                    <span className="text-[8px] text-stone-500">Se autorizado</span>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${channels.whatsapp ? 'bg-emerald-500 text-stone-950' : 'bg-stone-700'}`}>
                  {channels.whatsapp && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>

            </div>
          </div>

          {/* 2. HORÁRIO DE SILÊNCIO (DND) */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-black uppercase tracking-wider text-emerald-400 font-['Outfit']">
              2. HORÁRIO DE SILÊNCIO (NÃO PERTURBE)
            </h4>

            <div className="p-4 rounded-2xl bg-[#0E131F] border border-stone-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Moon className="w-4 h-4 text-indigo-400" />
                  <span className="font-bold text-white">Ativar Horário de Silêncio</span>
                </div>
                <input
                  type="checkbox"
                  checked={quietHours.enabled}
                  onChange={(e) => setQuietHours((prev) => ({ ...prev, enabled: e.target.checked }))}
                  className="w-4 h-4 accent-emerald-500 cursor-pointer"
                />
              </div>

              {quietHours.enabled && (
                <div className="pt-2 border-t border-stone-800 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-stone-400 text-[10px] block mb-1">Início do Silêncio</label>
                      <input
                        type="time"
                        value={quietHours.start}
                        onChange={(e) => setQuietHours((prev) => ({ ...prev, start: e.target.value }))}
                        className="w-full px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-700 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-stone-400 text-[10px] block mb-1">Fim do Silêncio</label>
                      <input
                        type="time"
                        value={quietHours.end}
                        onChange={(e) => setQuietHours((prev) => ({ ...prev, end: e.target.value }))}
                        className="w-full px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-700 text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
                    <span>Permitir notificações urgentes de pedidos:</span>
                    <input
                      type="checkbox"
                      checked={quietHours.allow_urgent}
                      onChange={(e) => setQuietHours((prev) => ({ ...prev, allow_urgent: e.target.checked }))}
                      className="w-4 h-4 accent-emerald-500 cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 3. CATEGORIAS DE INTERESSE */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-black uppercase tracking-wider text-emerald-400 font-['Outfit']">
              3. CATEGORIAS DE NOTIFICAÇÃO
            </h4>

            <div className="space-y-2">
              {[
                { key: 'pedidos', label: 'Pedidos e Status da Cozinha', desc: 'Preparo, saída para entrega e chegada', essential: true },
                { key: 'points', label: 'MerMi Points & Ledger', desc: 'Pontos creditados, resgatados e próximos de expirar' },
                { key: 'recompensas', label: 'Recompensas & Drops Surpresa', desc: 'Resgate da semana e drops liberados' },
                { key: 'mermi_run', label: 'MERMI RUN & Corridas', desc: 'Inscrições, lembretes de prova e resultados oficiais' },
                { key: 'desafios', label: 'Desafios & Conquistas', desc: 'Missões semanais, streaks e novos níveis' },
                { key: 'saude_bem_estar', label: 'Hábitos e Hidratação', desc: 'Lembretes de água e acompanhamento geral' },
                { key: 'promocoes', label: 'Promoções e Cardápio', desc: 'Novos pratos fit e campanhas sazonais' },
                { key: 'resumo_diario', label: 'Resumo Diário do Meu Dia', desc: 'Balanço ao fim da tarde com água, hábitos e pontos' },
                { key: 'resumo_semanal', label: 'Resumo Semanal', desc: 'Evolução consolidada dos últimos 7 dias' }
              ].map((cat) => {
                const isChecked = categories[cat.key as keyof typeof categories] ?? true;
                return (
                  <div
                    key={cat.key}
                    onClick={() => toggleCategory(cat.key as any)}
                    className="p-3 rounded-2xl bg-[#0E131F] border border-stone-800 hover:border-stone-700 flex items-center justify-between gap-3 cursor-pointer transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <strong className="text-white text-xs block">{cat.label}</strong>
                        {cat.essential && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[8px] font-bold">
                            Essencial
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-stone-400 truncate block">{cat.desc}</span>
                    </div>

                    <div className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 ${isChecked ? 'bg-emerald-500 text-stone-950' : 'bg-stone-700'}`}>
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-800 bg-[#101526] flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs cursor-pointer transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl bg-[#0EB24A] hover:bg-[#0ca042] text-stone-950 font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md"
          >
            Salvar Preferências
          </button>
        </div>

      </div>
    </div>
  );
};
