import React from 'react';
import { useMermiStore } from '../../context/MermiStoreContext';
import { MermiPointsBadge } from '../brand/MermiPointsBadge';
import {
  Award,
  Star,
  Flame,
  CheckCircle2,
  Heart,
  Share2,
  ArrowRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';

export const MembroSemanaView: React.FC = () => {
  const { weeklyMember, showToast } = useMermiStore();

  const handleShareInspire = () => {
    showToast(`Link de inspiração do Membro da Semana (${weeklyMember.handle}) copiado!`);
  };

  return (
    <div className="min-h-screen bg-[#140608] text-white pb-28 pt-4 px-3 sm:px-4 relative overflow-hidden font-sans">
      
      {/* Background Ambience: Dramatic red & ember light halos matching Foto 10 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-gradient-to-b from-[#E52525]/30 via-rose-950/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-xl mx-auto space-y-6 relative z-10">
        
        {/* Header matching Foto 10 */}
        <div className="text-center pt-2 flex flex-col items-center">
          
          {/* Logo Oficial MERMI POINTS em Destaque Maior com Fundo Transparente */}
          <div className="mb-3 shrink-0 transition-transform duration-200 hover:scale-105">
            <MermiPointsBadge size={110} variant="square" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 text-xs font-black uppercase tracking-widest mb-2 shadow-lg shadow-amber-500/20">
            <Star className="w-3.5 h-3.5 fill-stone-950" />
            <span>MEMBRO DA SEMANA</span>
            <Star className="w-3.5 h-3.5 fill-stone-950" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase font-['Outfit'] drop-shadow">
            PARABÉNS PELO SEU FOCO E CONSTÂNCIA!
          </h1>
          
          <p className="text-xs sm:text-sm font-semibold text-rose-200 mt-1 max-w-md">
            No MerMi Points, quem é presente, sempre se destaca!
          </p>
        </div>

        {/* Central Visual Showcase (Foto 10 Composition) */}
        <div className="relative rounded-[36px] bg-gradient-to-b from-[#2A0B0E] via-[#1E080A] to-[#120405] p-6 border-2 border-rose-600/40 shadow-2xl flex flex-col items-center text-center overflow-hidden">
          
          {/* Glowing Radial Halo behind member */}
          <div className="absolute top-12 w-48 h-48 rounded-full bg-amber-400/25 blur-2xl pointer-events-none" />

          {/* Member Photo with Golden Neon Ring */}
          <div className="relative w-36 h-36 rounded-full p-1.5 bg-gradient-to-tr from-amber-400 via-orange-500 to-[#E52525] shadow-[0_0_30px_rgba(234,179,8,0.4)]">
            <div className="w-full h-full rounded-full overflow-hidden border-2 border-white relative">
              <img
                src={weeklyMember.photoUrl}
                alt={weeklyMember.name}
                className="w-full h-full object-cover"
              />
              {/* Overlay badge on photo */}
              <div className="absolute bottom-0 inset-x-0 bg-stone-950/80 py-0.5 text-[8px] font-black text-amber-300 uppercase tracking-wider">
                DESTAQUE
              </div>
            </div>

            {/* Floating verification trophy */}
            <div className="absolute -top-1 -right-1 w-9 h-9 rounded-full bg-stone-950 border-2 border-amber-400 flex items-center justify-center text-amber-400 shadow-lg">
              <Award className="w-5 h-5 fill-amber-400 text-stone-950" />
            </div>
          </div>

          {/* Handle Badge */}
          <div className="mt-4 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-stone-950 border border-amber-500/50 text-white shadow-md">
            <span className="text-xs text-amber-400 font-bold">★</span>
            <span className="text-sm font-black font-['Outfit'] tracking-wide">{weeklyMember.handle}</span>
            <span className="text-xs text-amber-400 font-bold">★</span>
          </div>

          <p className="text-xs font-bold text-rose-300 uppercase tracking-widest mt-1">
            {weeklyMember.name} · {weeklyMember.weekPeriod}
          </p>

          {/* Dynamic Metrics: 86 Points & 7 Pedidos */}
          <div className="w-full grid grid-cols-3 gap-2 mt-5">
            <div className="p-3 rounded-2xl bg-stone-950/80 border border-rose-900/60 flex flex-col items-center justify-between">
              <span className="text-[9px] font-black uppercase text-stone-400">PONTUAÇÃO</span>
              <div className="flex items-center gap-1.5 my-0.5">
                <MermiPointsBadge size={28} variant="square" />
                <span className="text-xl font-black text-amber-400 font-['Outfit']">
                  {weeklyMember.points}
                </span>
              </div>
              <span className="text-[8px] font-bold text-amber-400/90">MERMI POINTS</span>
            </div>

            <div className="p-3 rounded-2xl bg-stone-950/80 border border-rose-900/60 flex flex-col items-center">
              <span className="text-[9px] font-black uppercase text-stone-400">CONSTÂNCIA</span>
              <span className="text-xl font-black text-white font-['Outfit'] mt-0.5">
                {weeklyMember.ordersCount}
              </span>
              <span className="text-[8px] font-bold text-stone-400">PEDIDOS</span>
            </div>

            <div className="p-3 rounded-2xl bg-stone-950/80 border border-rose-900/60 flex flex-col items-center justify-center">
              <span className="text-[9px] font-black uppercase text-stone-400">STATUS</span>
              <span className="text-xs font-black text-[#0EB24A] font-['Outfit'] mt-1 tracking-tight">
                {weeklyMember.statusText}
              </span>
              <span className="text-[8px] font-bold text-emerald-400/80">VERIFICADO</span>
            </div>
          </div>

          {/* Motivation Quote */}
          <div className="mt-4 p-3 rounded-2xl bg-stone-950/60 border border-white/10 text-xs text-stone-300 italic">
            "{weeklyMember.motivationMessage}"
          </div>
        </div>

        {/* Top Benefícios do Membro da Semana (Foto 10 Checklist) */}
        <div className="rounded-3xl bg-[#23090C] p-5 border border-rose-900/60 shadow-xl space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-black uppercase tracking-widest text-amber-300 font-['Outfit']">
              TOP BENEFÍCIOS DO MEMBRO DA SEMANA
            </h3>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-stone-950/70 border border-rose-950 flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                ✓
              </div>
              <div>
                <span className="font-bold text-white block">Desconto Especial na Próxima Semana</span>
                <span className="text-[10px] text-stone-400">Cupom VIP de 30% OFF em marmitas Fit ou Fit Premium.</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-stone-950/70 border border-rose-950 flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                ✓
              </div>
              <div>
                <span className="font-bold text-white block">Destaque Oficial na Comunidade</span>
                <span className="text-[10px] text-stone-400">Sua foto e perfil em evidência para todos os usuários do app.</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-stone-950/70 border border-rose-950 flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
                ✓
              </div>
              <div>
                <span className="font-bold text-white block">Bônus Exclusivo de +50 MerMi Points</span>
                <span className="text-[10px] text-stone-400">Pontuação creditada direto na carteira de resgates.</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-stone-950/70 border border-rose-950 flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                ✓
              </div>
              <div>
                <span className="font-bold text-white block">Acesso Antecipado a Novos Pratos do Chef</span>
                <span className="text-[10px] text-stone-400">Degustação exclusiva antes do lançamento oficial.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Motivational Callout: O Próximo Pode Ser Você! */}
        <div className="p-5 rounded-3xl bg-gradient-to-r from-stone-950 via-[#1F070A] to-stone-950 border border-amber-500/40 text-center space-y-2">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400">
            SUA VEZ DE BRILHAR
          </span>
          <h4 className="text-lg font-black font-['Outfit'] uppercase text-white">
            O PRÓXIMO DESTAQUE PODE SER VOCÊ!
          </h4>
          <p className="text-xs text-stone-300 max-w-sm mx-auto">
            Mantenha sua constância, peça suas refeições fit, cumpra seus passos diários e acumule pontos todos os dias.
          </p>

          <div className="pt-2 flex justify-center gap-2">
            <button
              onClick={handleShareInspire}
              className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold text-xs uppercase tracking-wider border border-stone-700 flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              Compartilhar Inspiração
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
