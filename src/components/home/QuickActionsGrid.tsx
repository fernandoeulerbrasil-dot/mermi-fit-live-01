import React from 'react';
import { useMermiStore } from '../../context/MermiStoreContext';
import { OFFICIAL_ASSET } from '../../services/officialAssets';

interface QuickActionsGridProps {
  onNavigate: (destination: string) => void;
}

export const QuickActionsGrid: React.FC<QuickActionsGridProps> = ({ onNavigate }) => {
  const { user, trackEvent } = useMermiStore();

  const actions = [
    {
      id: 'action_marmita',
      label: 'Montar Marmita',
      sublabel: 'Fit & Premium',
      icon: '🍱',
      destination: 'cardapio',
      badge: 'Fresco',
      color: 'border-emerald-500/30 hover:border-emerald-500 hover:bg-emerald-50/50',
      iconBg: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'action_drop',
      label: 'Drop Surpresa',
      sublabel: 'Prêmio secreto',
      icon: '🎁',
      destination: 'drop_surpresa',
      badge: 'Novo',
      color: 'border-cyan-500/40 hover:border-cyan-500 hover:bg-cyan-50/50',
      iconBg: 'bg-cyan-100 text-cyan-900'
    },
    {
      id: 'action_points',
      label: 'MerMi Points',
      sublabel: `${user.mermiPoints} pts acumulados`,
      icon: '⚡',
      destination: 'points',
      badge: `${user.mermiPoints} pts`,
      color: 'border-amber-400/40 hover:border-amber-500 hover:bg-amber-50/50',
      iconBg: 'bg-amber-100 text-amber-900'
    },
    {
      id: 'action_evolucao',
      label: 'Evolução',
      sublabel: `${user.stepsToday.toLocaleString('pt-BR')} passos`,
      icon: '📈',
      destination: 'evolucao',
      badge: `${user.activeStreakDays}d foco`,
      color: 'border-blue-400/30 hover:border-blue-500 hover:bg-blue-50/50',
      iconBg: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'action_desafios',
      label: 'Desafios',
      sublabel: 'Meta semanal ativa',
      icon: '🎯',
      destination: 'desafios',
      badge: '+50 Pts',
      color: 'border-purple-400/30 hover:border-purple-500 hover:bg-purple-50/50',
      iconBg: 'bg-purple-100 text-purple-800'
    },
    {
      id: 'action_corridas',
      label: 'Corridas',
      sublabel: 'Circuito MerMi Run',
      icon: '🏃',
      destination: 'corridas',
      badge: 'Inscrições',
      color: 'border-rose-400/30 hover:border-rose-500 hover:bg-rose-50/50',
      iconBg: 'bg-rose-100 text-rose-800'
    },
    {
      id: 'action_ia',
      label: 'MerMi IA',
      sublabel: 'Assistente 24h',
      icon: (
        <img
          src={OFFICIAL_ASSET.mermi_ai_face_png}
          alt="Rosto MerMi IA"
          referrerPolicy="no-referrer"
          className="w-6 h-6 object-contain"
        />
      ),
      destination: 'ia',
      badge: 'Online',
      color: 'border-[#0EB24A]/40 hover:border-[#0EB24A] hover:bg-emerald-50/60',
      iconBg: 'bg-emerald-950/20 text-[#0EB24A]'
    },
    {
      id: 'action_resgate',
      label: 'Resgate',
      sublabel: 'Prêmios da semana',
      icon: '🎁',
      destination: 'resgate',
      badge: 'Novos',
      color: 'border-yellow-400/40 hover:border-yellow-500 hover:bg-yellow-50/50',
      iconBg: 'bg-yellow-100 text-yellow-900'
    }
  ];

  const handleClick = (dest: string, label: string, id: string) => {
    trackEvent('quick_action_click', id, label);
    onNavigate(dest);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-sm font-bold text-stone-800 uppercase tracking-wider font-['Outfit']">
          Ações Rápidas & Ecossistema
        </h3>
        <span className="text-[11px] text-stone-500 font-medium">8 atalhos integrados</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        {actions.map((act) => (
          <button
            key={act.id}
            onClick={() => handleClick(act.destination, act.label, act.id)}
            className={`p-3 sm:p-3.5 bg-white rounded-2xl border transition-all duration-200 text-left flex flex-col justify-between shadow-xs hover:shadow-md active:scale-98 group relative ${act.color}`}
          >
            {act.badge && (
              <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-stone-900 text-white shadow-xs">
                {act.badge}
              </span>
            )}

            <div className="flex items-center gap-2 mb-2">
              <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-base ${act.iconBg}`}>
                {act.icon}
              </span>
            </div>

            <div>
              <p className="text-xs sm:text-sm font-bold text-stone-900 font-['Outfit'] group-hover:text-stone-950 transition-colors">
                {act.label}
              </p>
              <p className="text-[11px] text-stone-500 mt-0.5 truncate">
                {act.sublabel}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
