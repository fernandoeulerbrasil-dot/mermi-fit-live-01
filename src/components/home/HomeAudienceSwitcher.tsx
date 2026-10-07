import React from 'react';
import { useMermiStore } from '../../context/MermiStoreContext';
import { AudienceProfileType } from '../../types/homeContent';

interface HomeAudienceSwitcherProps {
  onOpenCMS: () => void;
}

export const HomeAudienceSwitcher: React.FC<HomeAudienceSwitcherProps> = ({ onOpenCMS }) => {
  const { audienceProfile, setAudienceProfile, analyticsEvents } = useMermiStore();

  const profiles: Array<{ id: AudienceProfileType; label: string; icon: string }> = [
    { id: 'standard', label: 'Padrão Oficial', icon: '⭐' },
    { id: 'new_user', label: 'Novo Usuário', icon: '🌱' },
    { id: 'frequent_user', label: 'Frequente / Foco', icon: '🔥' },
    { id: 'challenge_user', label: 'Desafio Ativo', icon: '🎯' },
    { id: 'points_ready_user', label: 'Pronto p/ Resgate', icon: '🎁' },
    { id: 'race_user', label: 'Corredor', icon: '🏃' },
    { id: 'inactive_user', label: 'Inativo', icon: '💤' },
  ];

  return (
    <div className="bg-[#1C241E] text-stone-200 px-4 py-2.5 rounded-2xl shadow-lg border border-[#0EB24A]/30 mb-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#0EB24A] animate-ping" />
          <span className="text-xs font-bold tracking-wider uppercase text-emerald-400 font-['Outfit']">
            Simulador de Perfil & Personalização Dinâmica
          </span>
          <span className="hidden md:inline-block text-[10px] text-stone-400 bg-black/40 px-2 py-0.5 rounded-full">
            Bloco 03
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCMS}
            className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-[#0EB24A] to-emerald-600 text-white text-xs font-bold rounded-lg shadow-sm hover:brightness-110 active:scale-95 transition-all"
          >
            <span>⚙️</span>
            <span>Painel CMS Admin</span>
          </button>

          <div className="text-[11px] text-stone-400 hidden lg:flex items-center gap-1 bg-black/30 px-2 py-1 rounded-md">
            <span>📊 {analyticsEvents.length} eventos registrados</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 pb-0.5">
        <span className="text-[11px] text-stone-400 shrink-0 mr-1">Ver como:</span>
        {profiles.map((p) => {
          const isSelected = audienceProfile === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setAudienceProfile(p.id)}
              className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-white text-stone-900 font-bold shadow-sm ring-2 ring-[#0EB24A]'
                  : 'bg-stone-800/80 text-stone-300 hover:bg-stone-700 hover:text-white'
              }`}
            >
              <span>{p.icon}</span>
              <span>{p.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
