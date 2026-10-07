import React from 'react';
import {
  Home,
  UtensilsCrossed,
  Award,
  Users,
  Grid
} from 'lucide-react';
import { OFFICIAL_ASSET } from '../../services/officialAssets';

interface BottomNavProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onNavigate }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0F1115]/95 backdrop-blur-lg border-t border-stone-800 text-stone-400 py-1.5 px-3 safe-area-bottom shadow-2xl">
      <div className="max-w-md mx-auto flex items-center justify-between">
        
        {/* 1. INÍCIO */}
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer focus:outline-none ${
            currentTab === 'home'
              ? 'text-[#0EB24A] font-bold'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Home className={`w-5 h-5 mb-0.5 transition-transform ${currentTab === 'home' ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] uppercase tracking-tight font-['Outfit']">Início</span>
          {currentTab === 'home' && <span className="w-1 h-1 rounded-full bg-[#0EB24A] mt-0.5" />}
        </button>

        {/* 2. CARDÁPIO */}
        <button
          onClick={() => onNavigate('cardapio')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer focus:outline-none ${
            currentTab === 'cardapio'
              ? 'text-[#0EB24A] font-bold'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <UtensilsCrossed className={`w-5 h-5 mb-0.5 transition-transform ${currentTab === 'cardapio' ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] uppercase tracking-tight font-['Outfit']">Cardápio</span>
          {currentTab === 'cardapio' && <span className="w-1 h-1 rounded-full bg-[#0EB24A] mt-0.5" />}
        </button>

        {/* CENTRAL: MERMI IA DESTAQUE (Botão Especial) */}
        <button
          onClick={() => onNavigate('ia')}
          className="flex flex-col items-center -mt-6 group focus:outline-none cursor-pointer relative"
        >
          <div
            className={`w-13 h-13 rounded-full flex items-center justify-center p-0.5 shadow-xl transition-transform ${
              currentTab === 'ia'
                ? 'scale-110 ring-4 ring-[#0EB24A]/40'
                : 'hover:scale-105 active:scale-95'
            } bg-gradient-to-tr from-[#0EB24A] via-emerald-400 to-[#FBBF24]`}>
            <div className="w-full h-full bg-stone-950 rounded-full flex items-center justify-center text-white relative overflow-hidden p-1">
              <img
                src={OFFICIAL_ASSET.mermi_ai_face_png}
                alt="MerMi IA"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <span
            className={`text-[9px] font-black uppercase mt-1 tracking-wider font-['Outfit'] ${
              currentTab === 'ia' ? 'text-[#0EB24A]' : 'text-stone-300'
            }`}
          >
            MerMi IA
          </span>
        </button>

        {/* 3. POINTS */}
        <button
          onClick={() => onNavigate('points')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer focus:outline-none ${
            currentTab === 'points' || currentTab === 'resgate' || currentTab === 'membro'
              ? 'text-amber-400 font-bold'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Award className={`w-5 h-5 mb-0.5 transition-transform ${currentTab === 'points' ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] uppercase tracking-tight font-['Outfit']">Points</span>
          {(currentTab === 'points' || currentTab === 'resgate' || currentTab === 'membro') && (
            <span className="w-1 h-1 rounded-full bg-amber-400 mt-0.5" />
          )}
        </button>

        {/* 4. COMUNIDADE */}
        <button
          onClick={() => onNavigate('comunidade')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer focus:outline-none ${
            currentTab === 'comunidade'
              ? 'text-[#0EB24A] font-bold'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Users className={`w-5 h-5 mb-0.5 transition-transform ${currentTab === 'comunidade' ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] uppercase tracking-tight font-['Outfit']">Social</span>
          {currentTab === 'comunidade' && <span className="w-1 h-1 rounded-full bg-[#0EB24A] mt-0.5" />}
        </button>

        {/* 5. MAIS */}
        <button
          onClick={() => onNavigate('mais')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer focus:outline-none ${
            currentTab === 'mais'
              ? 'text-[#0EB24A] font-bold'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Grid className={`w-5 h-5 mb-0.5 transition-transform ${currentTab === 'mais' ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] uppercase tracking-tight font-['Outfit']">Mais</span>
          {currentTab === 'mais' && <span className="w-1 h-1 rounded-full bg-[#0EB24A] mt-0.5" />}
        </button>

      </div>
    </nav>
  );
};
