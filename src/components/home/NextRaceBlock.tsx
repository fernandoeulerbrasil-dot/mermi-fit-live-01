import React from 'react';
import { useMermiStore } from '../../context/MermiStoreContext';

interface NextRaceBlockProps {
  onNavigate: (destination: string) => void;
}

export const NextRaceBlock: React.FC<NextRaceBlockProps> = ({ onNavigate }) => {
  const { trackEvent } = useMermiStore();

  const handleOpenRace = () => {
    trackEvent('quick_action_click', 'race_home_block', 'Ver Corrida MerMi Run 5K');
    onNavigate('corridas');
  };

  return (
    <div className="w-full bg-gradient-to-r from-[#200A0D] via-[#2D0F13] to-[#160709] rounded-3xl p-5 sm:p-6 text-white border border-rose-600/30 shadow-lg relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-rose-600/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-2xl shrink-0">
            🏃
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full bg-rose-500/25 text-rose-300 text-[10px] font-black uppercase tracking-wider">
                Circuito Oficial de Corrida
              </span>
              <span className="text-xs text-rose-200/70">
                18 de Abril · Vagas Limitadas
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-black text-white font-['Outfit']">
              Circuito MerMi Run 5K & 10K · Etapa Parque do Povo
            </h3>
            <p className="text-xs text-stone-300 mt-0.5 max-w-lg">
              Kit atleta completo com camiseta DryFit tecnológica, shakeira oficial, medalha e almoço Fit MerMi pós-prova.
            </p>
          </div>
        </div>

        {/* Action */}
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
          <div className="text-right hidden md:block">
            <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Inscrições</span>
            <span className="text-xs font-bold text-emerald-400">Último Lote</span>
          </div>

          <button
            onClick={handleOpenRace}
            className="px-4 py-2.5 bg-gradient-to-r from-rose-600 to-red-600 hover:brightness-110 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md transition-all font-['Outfit'] flex items-center gap-1.5"
          >
            <span>Ver Corrida</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};
