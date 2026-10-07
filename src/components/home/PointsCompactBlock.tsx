import React from 'react';
import { useMermiStore } from '../../context/MermiStoreContext';

interface PointsCompactBlockProps {
  onNavigate: (destination: string) => void;
}

export const PointsCompactBlock: React.FC<PointsCompactBlockProps> = ({ onNavigate }) => {
  const { user, trackEvent } = useMermiStore();

  const handleOpenPoints = () => {
    trackEvent('quick_action_click', 'points_compact', 'Ver MerMi Points');
    onNavigate('points');
  };

  const handleOpenResgate = () => {
    trackEvent('quick_action_click', 'points_resgate', 'Resgatar Recompensas');
    onNavigate('resgate');
  };

  // Dynamic calculations based on user points
  const pointsForNextLevel = user.level * 250;
  const currentLevelBase = (user.level - 1) * 250;
  const progressInLevel = Math.max(0, user.mermiPoints - currentLevelBase);
  const percentToNextLevel = Math.min(100, Math.round((progressInLevel / 250) * 100));

  // Determine next reward benchmark
  let nextReward = { name: 'Marmita Grátis', target: 100 };
  if (user.mermiPoints >= 400) {
    nextReward = { name: 'Bolsa Térmica VIP', target: 500 };
  } else if (user.mermiPoints >= 300) {
    nextReward = { name: 'Bolsa Térmica Mermi', target: 400 };
  } else if (user.mermiPoints >= 200) {
    nextReward = { name: 'Copo Exclusivo', target: 300 };
  } else if (user.mermiPoints >= 100) {
    nextReward = { name: 'Desconto Especial R$ 25', target: 200 };
  }

  const pointsRemaining = Math.max(0, nextReward.target - user.mermiPoints);

  const getLevelTitle = (lvl: number) => {
    if (lvl === 1) return 'Cliente Iniciante';
    if (lvl === 2) return 'Cliente Foco';
    if (lvl === 3) return 'Membro Constância';
    if (lvl === 4) return 'Membro Performance';
    return 'MerMi VIP Master';
  };

  return (
    <div className="w-full bg-[#121415] rounded-3xl p-5 sm:p-6 text-white border border-[#F59E0B]/30 shadow-xl relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 right-0 w-56 h-56 bg-[#F59E0B]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#E53935]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        {/* Left: Points and Level */}
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-[#F59E0B]/20 border border-[#F59E0B]/40 text-[#FBBF24] text-[10px] font-black uppercase tracking-wider">
              Ambiente de Gamificação
            </span>
            <span className="text-xs text-stone-400">
              Nível {user.level} · {getLevelTitle(user.level)}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-white font-['Outfit'] tracking-tight">
              {user.mermiPoints.toLocaleString('pt-BR')}
            </span>
            <span className="text-sm font-bold text-[#F59E0B] uppercase tracking-wider font-['Outfit']">
              Points
            </span>
          </div>

          <p className="mt-1 text-xs text-stone-300">
            {percentToNextLevel}% concluído para o Nível {user.level + 1} ({user.mermiPoints}/{pointsForNextLevel} pts)
          </p>
        </div>

        {/* Center: Next reward insight */}
        <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-3.5 max-w-sm flex-1">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-stone-400">Próximo resgate:</span>
            <span className="font-bold text-amber-400">{nextReward.name}</span>
          </div>

          <div className="w-full h-2 bg-stone-800 rounded-full overflow-hidden my-1.5">
            <div
              className="h-full bg-gradient-to-r from-[#F59E0B] via-amber-400 to-[#0EB24A] rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, Math.round((user.mermiPoints / nextReward.target) * 100))}%`
              }}
            />
          </div>

          <p className="text-[11px] text-stone-400">
            {pointsRemaining === 0 ? (
              <span className="text-emerald-400 font-bold">
                🎉 Recompensa disponível para resgate imediato!
              </span>
            ) : (
              <>
                Faltam apenas <strong className="text-white font-bold">{pointsRemaining} Points</strong> para resgatar.
              </>
            )}
          </p>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 self-start md:self-center shrink-0">
          <button
            onClick={handleOpenPoints}
            className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold rounded-xl border border-stone-700 transition-all active:scale-95"
          >
            Ver Extrato
          </button>
          <button
            onClick={handleOpenResgate}
            className="px-4 py-2.5 bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:brightness-110 text-stone-950 text-xs font-black rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5 font-['Outfit']"
          >
            <span>Resgatar</span>
            <span>🎁</span>
          </button>
        </div>
      </div>
    </div>
  );
};
