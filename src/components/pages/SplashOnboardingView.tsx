import React from 'react';
import { useMermiStore } from '../../context/MermiStoreContext';
import { OfficialLogo } from '../brand/OfficialLogo';
import {
  Activity,
  Award,
  ChevronRight,
  Flame,
  Heart,
  Medal,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Watch
} from 'lucide-react';

interface SplashOnboardingViewProps {
  onEnter: () => void;
  onEnterAsGuest: () => void;
}

export const SplashOnboardingView: React.FC<SplashOnboardingViewProps> = ({
  onEnter,
  onEnterAsGuest
}) => {
  const { user } = useMermiStore();

  return (
    <div className="min-h-screen bg-[#FBF7EE] text-stone-900 pb-20 relative overflow-hidden">
      
      {/* Background Ambience: Subtle foliage and warm beige gradient matching Foto 01 */}
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-amber-100/60 via-[#FBF7EE]/40 to-transparent pointer-events-none" />
      <div className="absolute -top-10 -left-10 w-48 h-48 bg-emerald-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 -right-10 w-56 h-56 bg-amber-300/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-xl mx-auto px-4 pt-6 flex flex-col items-center">
        
        {/* Top Motivational Quotes */}
        <div className="w-full flex items-center justify-between text-xs font-black tracking-tight uppercase text-stone-700 font-['Outfit'] px-2">
          <div className="text-left">
            <span className="block text-stone-900 text-sm">DISCIPLINA HOJE</span>
            <span className="block text-emerald-700">RESULTADOS SEMPRE! ♡</span>
          </div>
          <div className="text-right">
            <span className="block text-stone-900">SAÚDE · BEM-ESTAR</span>
            <span className="block text-[#E52525]">EVOLUÇÃO TUDO EM UM SÓ APP ♡</span>
          </div>
        </div>

        {/* Hero Brand Identity from Foto 01 */}
        <div className="my-4 flex flex-col items-center justify-center">
          <OfficialLogo size={164} showSubtitle={false} />
          <div className="mt-3 text-center">
            <p className="font-extrabold text-sm sm:text-base text-stone-900 tracking-wider font-['Outfit'] uppercase flex items-center justify-center gap-1.5">
              <span>MAIS QUE UM APP. UM ESTILO DE VIDA.</span>
              <span className="text-emerald-500">🍃</span>
            </p>
          </div>
        </div>

        {/* Central Smartphone Live Preview Mockup (Foto 01 Composition) */}
        <div className="relative w-full max-w-sm rounded-[38px] p-3 bg-gradient-to-b from-stone-900 via-stone-800 to-stone-950 shadow-2xl border-4 border-stone-700/80 my-2">
          {/* Dynamic Island / Speaker Notch */}
          <div className="w-24 h-4 bg-stone-900 rounded-full mx-auto mb-2 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-stone-700 mr-2" />
            <div className="w-8 h-1.5 rounded-full bg-stone-800" />
          </div>

          {/* Screen Content */}
          <div className="bg-[#FAF6EC] rounded-[28px] p-3 text-stone-900 overflow-hidden border border-stone-200 shadow-inner">
            
            {/* Header in Phone */}
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <div className="shrink-0 flex items-center justify-center">
                  <OfficialLogo size={28} showSubtitle={false} />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs leading-none font-['Outfit']">MERMI FIT LIFE</h4>
                  <p className="text-[8px] text-stone-500 mt-0.5">Olá, seja bem-vindo(a)!</p>
                </div>
              </div>
              <span className="text-xs">🔔</span>
            </div>

            {/* Points Card in Phone */}
            <div className="mt-2.5 p-3 rounded-2xl bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 text-white shadow-md border border-stone-800 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[8px] text-amber-400 font-bold tracking-wider uppercase">Seus Pontos MerMi</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-amber-400 text-sm">⭐</span>
                    <span className="text-lg font-black tracking-tight text-white font-['Outfit']">
                      {user.mermiPoints.toLocaleString('pt-BR')}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold">
                    <span>👑 Nível {user.level}</span>
                  </div>
                  <p className="text-[7px] text-stone-400 mt-0.5">Falta 250 pontos para o próx. nível</p>
                </div>
              </div>
            </div>

            {/* Quick Grid inside Phone */}
            <div className="grid grid-cols-4 gap-1.5 mt-2.5">
              <div className="p-2 rounded-xl bg-emerald-500 text-white flex flex-col items-center justify-center text-center shadow-sm">
                <span className="text-xs">🍴</span>
                <span className="text-[8px] font-bold mt-0.5">Cardápio</span>
              </div>
              <div className="p-2 rounded-xl bg-orange-500 text-white flex flex-col items-center justify-center text-center shadow-sm">
                <span className="text-xs">🏃</span>
                <span className="text-[8px] font-bold mt-0.5">Treinos</span>
              </div>
              <div className="p-2 rounded-xl bg-rose-500 text-white flex flex-col items-center justify-center text-center shadow-sm">
                <span className="text-xs">🏆</span>
                <span className="text-[8px] font-bold mt-0.5">Points</span>
              </div>
              <div className="p-2 rounded-xl bg-green-600 text-white flex flex-col items-center justify-center text-center shadow-sm">
                <span className="text-xs">📊</span>
                <span className="text-[8px] font-bold mt-0.5">Progresso</span>
              </div>
            </div>

            {/* Motivational Quote pill inside phone */}
            <div className="mt-2.5 py-1.5 px-2 rounded-xl bg-white text-center border border-stone-200">
              <p className="text-[9px] font-bold text-stone-700 italic">
                “Disciplina hoje, uma vida melhor amanhã.” 🍃
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Gadget Highlights from Foto 01: Smartwatch + Shaker + Towel */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4 px-2">
          
          {/* Smartwatch Widget */}
          <div className="p-3 bg-stone-900 text-white rounded-2xl border border-stone-800 shadow-md flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-emerald-950 border-2 border-emerald-500 flex items-center justify-center text-emerald-400">
              <Watch className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <p className="text-[9px] text-stone-400 uppercase font-semibold">Passos hoje</p>
              <p className="text-sm font-black text-emerald-400 font-['Outfit']">
                {user.stepsToday > 0 ? user.stepsToday.toLocaleString('pt-BR') : '0'}
              </p>
            </div>
          </div>

          {/* Shaker & Nutrição Widget */}
          <div className="p-3 bg-stone-900 text-white rounded-2xl border border-stone-800 shadow-md flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-amber-950 border-2 border-amber-500 flex items-center justify-center text-amber-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[9px] text-stone-400 uppercase font-semibold">Mermi Fit</p>
              <p className="text-xs font-black text-white font-['Outfit']">Marmitas & Shaker</p>
            </div>
          </div>

          {/* Towel & Disciplina Widget */}
          <div className="p-3 bg-stone-900 text-white rounded-2xl border border-stone-800 shadow-md flex items-center gap-2.5 col-span-2 sm:col-span-1">
            <div className="w-10 h-10 rounded-full bg-rose-950 border-2 border-rose-500 flex items-center justify-center text-rose-400">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[9px] text-stone-400 uppercase font-semibold">Filosofia</p>
              <p className="text-xs font-black text-rose-300 font-['Outfit']">Disciplina é Liberdade</p>
            </div>
          </div>

        </div>

        {/* Action Buttons Matching Foto 01 & Foto 02 Exactly */}
        <div className="w-full mt-6 space-y-3 px-2">
          
          {/* Main Action: Entrar - Já tenho uma conta */}
          <button
            onClick={onEnter}
            className="w-full py-4 px-6 rounded-2xl bg-[#0EB24A] hover:bg-[#0ca042] active:scale-98 text-white font-black text-base shadow-lg shadow-emerald-600/30 flex items-center justify-between transition-all cursor-pointer border border-emerald-400/50 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <span className="text-lg">👤</span>
              </div>
              <div className="text-left">
                <span className="block text-base leading-tight font-['Outfit'] uppercase">Entrar</span>
                <span className="block text-xs font-medium text-emerald-100">Já tenho uma conta cadastrada</span>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Secondary Action: Entrar sem cadastro */}
          <button
            onClick={onEnterAsGuest}
            className="w-full py-4 px-6 rounded-2xl bg-white hover:bg-stone-50 active:scale-98 text-stone-900 font-black text-base shadow-md border-2 border-emerald-500/40 flex items-center justify-between transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                <span className="text-lg">🍃</span>
              </div>
              <div className="text-left">
                <span className="block text-base leading-tight font-['Outfit'] uppercase">Entrar sem cadastro</span>
                <span className="block text-xs font-medium text-stone-500">Acesse agora e comece a usar</span>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-emerald-600 group-hover:translate-x-1 transition-transform" />
          </button>

        </div>

        {/* Bottom Six Pillars from Foto 01 */}
        <div className="w-full mt-8 pt-6 border-t border-stone-300/80 px-2">
          <p className="text-center text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-3">
            O ECOSSISTEMA MERMI FIT LIFE
          </p>
          <div className="grid grid-cols-6 gap-1 text-center">
            <div className="flex flex-col items-center">
              <span className="text-base">🍃</span>
              <span className="text-[9px] font-bold text-stone-700 mt-1">SAÚDE</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-base">🏋️</span>
              <span className="text-[9px] font-bold text-stone-700 mt-1">DISCIPLINA</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-base">♡</span>
              <span className="text-[9px] font-bold text-stone-700 mt-1">BEM-ESTAR</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-base">📊</span>
              <span className="text-[9px] font-bold text-stone-700 mt-1">RESULTADOS</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-base">👥</span>
              <span className="text-[9px] font-bold text-stone-700 mt-1">COMUNIDADE</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-base">⭐</span>
              <span className="text-[9px] font-bold text-stone-700 mt-1">EVOLUÇÃO</span>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs font-black text-stone-900 tracking-wider font-['Outfit'] uppercase">
              MERMI FIT LIFE
            </p>
            <p className="text-[10px] text-stone-600 font-semibold tracking-widest uppercase mt-0.5">
              ALIMENTA CORPOS, INSPIRA VIDAS.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
