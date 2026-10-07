import React from 'react';
import { useMermiStore } from '../../context/MermiStoreContext';
import { OFFICIAL_ASSET } from '../../services/officialAssets';
import { Sparkles, ArrowRight, MessageSquare } from 'lucide-react';

interface MermiIABlockProps {
  onNavigate: (destination: string) => void;
}

export const MermiIABlock: React.FC<MermiIABlockProps> = ({ onNavigate }) => {
  const { trackEvent } = useMermiStore();

  const handleStartChat = () => {
    trackEvent('ai_click', 'mermi_ia_compact', 'Conversar com MerMi IA');
    onNavigate('ia');
  };

  return (
    <div className="w-full bg-gradient-to-r from-[#0F1E14] via-[#09150E] to-stone-950 rounded-2xl p-3.5 sm:p-4 text-white shadow-md border border-emerald-500/25 relative overflow-hidden select-none">
      {/* Subtle ambient light */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-[#0EB24A]/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between gap-3 relative z-10">
        
        {/* Rosto Oficial do Mascote da MerMi IA (1:1 aspect-ratio, sem fundo, mesmo robô da página da IA) */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-stone-900 via-black to-[#06150B] border border-emerald-500/40 p-1 flex items-center justify-center shadow-md">
            <img
              src={OFFICIAL_ASSET.mermi_ai_face_png}
              alt="Rosto Mascote MerMi IA Oficial"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain object-center drop-shadow-md"
              style={{ aspectRatio: '1 / 1' }}
            />
            {/* Small active pulse dot */}
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#0EB24A] border-2 border-stone-950 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-200 animate-ping" />
            </span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 font-['Outfit'] flex items-center gap-1">
                <Sparkles size={11} />
                MERMI IA ASSISTENTE
              </span>
              <span className="px-1.5 py-0.2 rounded text-[8px] font-bold bg-emerald-500/20 text-emerald-300">
                Online
              </span>
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-white truncate font-['Outfit'] mt-0.5">
              Dúvidas sobre marmitas, calorias ou pontos?
            </h4>
            <p className="text-[11px] text-stone-400 hidden sm:block truncate">
              Orientações nutricionais inteligentes e hábitos saudáveis no seu ritmo.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleStartChat}
          className="shrink-0 px-3.5 py-2 rounded-xl bg-[#0EB24A] hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs font-['Outfit'] uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md shadow-emerald-950/40 cursor-pointer"
        >
          <MessageSquare size={13} />
          <span className="hidden xs:inline">Conversar</span>
          <ArrowRight size={13} />
        </button>

      </div>
    </div>
  );
};
