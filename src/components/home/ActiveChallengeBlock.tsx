import React from 'react';
import { useMermiStore } from '../../context/MermiStoreContext';

interface ActiveChallengeBlockProps {
  onNavigate: (destination: string) => void;
}

export const ActiveChallengeBlock: React.FC<ActiveChallengeBlockProps> = ({ onNavigate }) => {
  const { user, trackEvent } = useMermiStore();

  const targetSteps = 10000;
  const currentSteps = user.stepsToday;
  const progressPercent = Math.min(100, Math.round((currentSteps / targetSteps) * 100));

  const handleOpenChallenge = () => {
    trackEvent('quick_action_click', 'challenge_active_block', 'Continuar Desafio 10K');
    onNavigate('desafios');
  };

  return (
    <div className="w-full bg-gradient-to-r from-[#170E2B] via-[#1F1238] to-[#120B22] rounded-3xl p-5 sm:p-6 text-white border border-purple-500/30 shadow-lg relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-2xl shrink-0">
            🎯
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full bg-purple-500/25 text-purple-300 text-[10px] font-black uppercase tracking-wider">
                Desafio Ativo Semanal
              </span>
              <span className="text-xs text-purple-200/70">
                Restam 3 dias
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-black text-white font-['Outfit']">
              Desafio 10K: Constância em Movimento
            </h3>
            <p className="text-xs text-stone-300 mt-0.5">
              Complete 10.000 passos hoje e garanta <strong className="text-yellow-400 font-bold">+50 MerMi Points</strong>.
            </p>
          </div>
        </div>

        {/* Progress & Action */}
        <div className="flex flex-col sm:items-end gap-2.5 shrink-0">
          <div className="w-full sm:w-48 bg-stone-900/80 rounded-xl p-2.5 border border-purple-500/20">
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-stone-300 font-mono">{currentSteps.toLocaleString('pt-BR')} / {targetSteps.toLocaleString('pt-BR')}</span>
              <span className="text-purple-400">{progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <button
            onClick={handleOpenChallenge}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md transition-all self-start sm:self-end font-['Outfit']"
          >
            {currentSteps > 0 ? 'Continuar Desafio →' : 'Comece hoje →'}
          </button>
        </div>
      </div>
    </div>
  );
};
