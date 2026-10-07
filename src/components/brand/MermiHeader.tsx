import React from 'react';
import { OfficialLogo } from './OfficialLogo';

interface MermiHeaderProps {
  className?: string;
  showSubtitle?: boolean;
}

/**
 * MermiHeader - Cabeçalho Oficial das Páginas do Cliente (Foto 07)
 * 
 * Regra Absoluta:
 * - Mantém a proporção rigorosa do logo oficial.
 * - Responsivo para mobile, tablet e desktop sem sofrer stretch ou corte.
 */
export const MermiHeader: React.FC<MermiHeaderProps> = ({
  className = '',
  showSubtitle = true
}) => {
  return (
    <div className={`bg-[#0F1115] text-white px-3 sm:px-4 py-2.5 rounded-2xl flex items-center justify-between border border-stone-800 shadow-md ${className}`}>
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        {/* Official Logo strictly aspect-ratio locked */}
        <div className="shrink-0 flex items-center justify-center">
          <OfficialLogo size={42} showSubtitle={false} />
        </div>

        {/* Brand Text */}
        <div className="flex flex-col justify-center">
          <div className="flex items-baseline gap-1 sm:gap-1.5 leading-none">
            <span className="font-black text-base sm:text-xl tracking-tight text-white uppercase font-['Outfit'] drop-shadow">
              MERMI
            </span>
            <span className="font-black text-base sm:text-xl tracking-tight text-[#0EB24A] italic uppercase font-['Outfit']">
              FIT
            </span>
            <span className="font-black text-base sm:text-xl tracking-tight text-[#E52525] italic uppercase font-['Outfit']">
              LIFE
            </span>
          </div>
          {showSubtitle && (
            <span className="text-[8px] sm:text-[9px] tracking-[0.25em] text-stone-400 font-medium uppercase mt-0.5">
              MERMI DESIGN SYSTEM
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          OFICIAL
        </span>
      </div>
    </div>
  );
};
