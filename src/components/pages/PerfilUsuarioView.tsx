import React, { useState } from 'react';
import {
  User,
  Award,
  Flame,
  TrendingUp,
  MapPin,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { CardBase } from '../../design-system/components/Cards';
import { SectionTitle, Subtitle, MetricNumber } from '../../design-system/components/Typography';
import { PrimaryButton, OutlineButton } from '../../design-system/components/Button';
import { useMermiStore } from '../../context/MermiStoreContext';
import { NotificationPreferencesModal } from '../modals/NotificationPreferencesModal';
import { MermiPrivacyTermsModal } from '../modals/MermiPrivacyTermsModal';

interface PerfilUsuarioViewProps {
  onNavigate: (tab: string) => void;
}

export const PerfilUsuarioView: React.FC<PerfilUsuarioViewProps> = ({ onNavigate }) => {
  const { user, showToast } = useMermiStore();
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FBF7EE] text-stone-900 pb-28 pt-4 px-3 sm:px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="border-b border-stone-200 pb-3">
          <SectionTitle className="text-stone-900">
            Meu Perfil & Conta
          </SectionTitle>
          <p className="text-xs text-stone-500 mt-0.5">
            Gerencie seus dados pessoais, nível de Points e preferências
          </p>
        </div>

        {/* Profile Card */}
        <CardBase environment="claro" elevation="subtle" className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#0EB24A] shrink-0">
            <img
              src={user.avatar}
              alt={user.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-black text-lg text-stone-900 font-['Outfit'] uppercase truncate">
                {user.name}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                Nível {user.level}
              </span>
            </div>
            <p className="text-xs text-stone-500">{user.handle}</p>
            <p className="text-xs text-stone-400 mt-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#0EB24A]" /> São Paulo, SP
            </p>
          </div>
        </CardBase>

        {/* Quick Points & Stats Banner */}
        <CardBase
          environment="escuro"
          elevation="glow"
          onClick={() => onNavigate('points')}
          className="flex items-center justify-between cursor-pointer"
        >
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block">
              Saldo Oficial MerMi Points
            </span>
            <MetricNumber
              value={user.mermiPoints.toLocaleString('pt-BR')}
              unit="Points"
              highlightColor="text-white"
              size="lg"
            />
          </div>
          <span className="text-xs font-black text-amber-400 font-['Outfit'] uppercase bg-stone-900 px-3 py-1.5 rounded-xl border border-stone-800">
            Ver Recompensas →
          </span>
        </CardBase>

        {/* Menu list */}
        <div className="space-y-2">
          <button
            onClick={() => onNavigate('pedidos')}
            className="w-full p-3.5 rounded-2xl bg-white border border-stone-200 hover:border-[#0EB24A] flex items-center justify-between transition-all cursor-pointer"
          >
            <span className="font-bold text-xs text-stone-800">Meus Pedidos & Entregas</span>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </button>

          <button
            onClick={() => onNavigate('evolucao')}
            className="w-full p-3.5 rounded-2xl bg-white border border-stone-200 hover:border-[#0EB24A] flex items-center justify-between transition-all cursor-pointer"
          >
            <span className="font-bold text-xs text-stone-800">Minha Evolução & Métricas Diárias</span>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </button>

          <button
            onClick={() => onNavigate('desafios')}
            className="w-full p-3.5 rounded-2xl bg-white border border-stone-200 hover:border-[#0EB24A] flex items-center justify-between transition-all cursor-pointer"
          >
            <span className="font-bold text-xs text-stone-800">Desafios & Conquistas Desbloqueadas</span>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </button>

          <button
            onClick={() => setIsPreferencesOpen(true)}
            className="w-full p-3.5 rounded-2xl bg-white border border-stone-200 hover:border-[#0EB24A] flex items-center justify-between transition-all cursor-pointer"
          >
            <span className="font-bold text-xs text-stone-800">Preferências de Notificações</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Configurar</span>
          </button>

          <button
            onClick={() => setIsPrivacyModalOpen(true)}
            className="w-full p-3.5 rounded-2xl bg-white border border-stone-200 hover:border-[#0EB24A] flex items-center justify-between transition-all cursor-pointer shadow-sm"
          >
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-stone-800">Privacidade, Termos & LGPD</span>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                Meus Direitos
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </button>

          <button
            onClick={() => showToast('Abrindo canal de suporte oficial via WhatsApp...')}
            className="w-full p-3.5 rounded-2xl bg-white border border-stone-200 hover:border-[#0EB24A] flex items-center justify-between transition-all cursor-pointer"
          >
            <span className="font-bold text-xs text-stone-800">Suporte ao Cliente & Nutricional</span>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </button>
        </div>

        {/* Modal de Preferências de Notificações */}
        <NotificationPreferencesModal
          isOpen={isPreferencesOpen}
          onClose={() => setIsPreferencesOpen(false)}
        />

        {/* Modal de Privacidade, Termos & LGPD (Bloco 14) */}
        <MermiPrivacyTermsModal
          isOpen={isPrivacyModalOpen}
          onClose={() => setIsPrivacyModalOpen(false)}
        />

      </div>
    </div>
  );
};
