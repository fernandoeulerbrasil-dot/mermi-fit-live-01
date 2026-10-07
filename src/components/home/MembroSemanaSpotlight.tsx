import React from 'react';
import { useMermiStore } from '../../context/MermiStoreContext';
import { OfficialPointsBadge } from '../brand/OfficialPointsBadge';
import { Award, ChevronRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface MembroSemanaSpotlightProps {
  onNavigate: (tab: string) => void;
}

export const MembroSemanaSpotlight: React.FC<MembroSemanaSpotlightProps> = ({ onNavigate }) => {
  const { weeklyMember } = useMermiStore();

  // Requisito 3: Não deve ocupar obrigatoriamente uma grande área permanente da Home.
  // Só é exibido no topo quando ativo, publicado e explicitamente configurado como destaque.
  if (
    weeklyMember.active === false ||
    weeklyMember.published === false ||
    weeklyMember.featuredOnHome === false
  ) {
    return null;
  }

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-r from-[#22070A] via-[#1A0709] to-[#0A160F] p-4 sm:p-5 border-2 border-amber-500/40 shadow-xl select-none group">
      {/* Background glow effects */}
      <div className="absolute -top-12 -left-12 w-44 h-44 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-[#0EB24A]/15 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
        
        {/* Left Side: Avatar with golden halo and photo */}
        <div className="flex items-center gap-3.5 shrink-0 self-center sm:self-auto">
          <div className="relative">
            {/* Glowing Golden Ring around the authentic photo */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-orange-500 to-[#E52525] shadow-[0_0_20px_rgba(245,158,11,0.45)]">
              <div className="w-full h-full rounded-full overflow-hidden border-2 border-white relative bg-stone-900">
                <img
                  src={weeklyMember.photoUrl}
                  alt={weeklyMember.name}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute bottom-0 inset-x-0 bg-stone-950/80 py-0.5 text-[7px] font-black text-amber-300 uppercase tracking-widest text-center">
                  TOP
                </div>
              </div>
            </div>

            {/* Verification badge floating */}
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-stone-950 border border-amber-400 flex items-center justify-center text-amber-400 shadow-md">
              <Award className="w-4 h-4 fill-amber-400 text-stone-950" />
            </div>
          </div>
        </div>

        {/* Center: Info, Name, Stats & Quote */}
        <div className="flex-1 text-center sm:text-left min-w-0">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 mb-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-black uppercase tracking-wider font-['Outfit']">
              <Sparkles size={11} className="text-amber-400" />
              MEMBRO DA SEMANA EM DESTAQUE
            </span>
            <span className="text-[10px] text-stone-400 font-semibold">
              {weeklyMember.weekPeriod}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h3 className="text-base sm:text-lg font-black text-white font-['Outfit'] tracking-tight">
              {weeklyMember.name}
            </h3>
            <span className="px-2 py-0.5 rounded-lg bg-white/10 text-stone-300 text-xs font-bold font-mono">
              {weeklyMember.handle}
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#0EB24A] bg-[#0EB24A]/10 border border-[#0EB24A]/30 px-2 py-0.5 rounded-full">
              <CheckCircle2 size={10} />
              {weeklyMember.statusText}
            </span>
          </div>

          <p className="mt-1 text-xs text-rose-100/90 italic font-medium line-clamp-2">
            "{weeklyMember.motivationMessage}"
          </p>

          {/* Quick Metrics */}
          <div className="flex items-center justify-center sm:justify-start gap-2.5 mt-2.5">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-stone-950/70 border border-amber-500/30 text-amber-400 text-xs font-black font-['Outfit']">
              <OfficialPointsBadge size={16} variant="square" />
              <span>{weeklyMember.points} Points</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-stone-950/70 border border-stone-800 text-stone-300 text-xs font-bold font-['Outfit']">
              <span>🍱</span>
              <span>{weeklyMember.ordersCount} Marmitas</span>
            </div>
          </div>
        </div>

        {/* Right: CTA button */}
        <div className="shrink-0 self-center sm:self-center">
          <button
            onClick={() => onNavigate('membro')}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-[#E52525] hover:brightness-110 active:scale-95 text-stone-950 font-black text-xs uppercase tracking-wider font-['Outfit'] shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1 cursor-pointer"
          >
            <span>Ver Destaque</span>
            <ChevronRight size={14} />
          </button>
        </div>

      </div>
    </div>
  );
};
