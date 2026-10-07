import React, { useState } from 'react';
import { useMermiStore } from '../../context/MermiStoreContext';
import { DropSurpresaItem } from '../../types/dropSurpresa';
import { OfficialPointsBadge } from '../brand/OfficialPointsBadge';
import {
  Gift,
  Sparkles,
  Zap,
  Lock,
  Unlock,
  ChevronRight,
  Flame,
  Award,
  CheckCircle2,
  X
} from 'lucide-react';

interface DropSurpresaHomeCardProps {
  onNavigate: (tab: string) => void;
}

/**
 * DropSurpresaHomeCard — Identidade Oficial MerMi Drop Surpresa
 * 
 * Requisitos Oficiais:
 * - Fundo azul da identidade oficial do Drop Surpresa;
 * - Elementos visuais de surpresa e recompensa tecnológica;
 * - Cores complementares oficiais da MerMi Fit Life (Laranja #FF6B00, Verde #0EB24A, Ouro Points #F59E0B);
 * - Aparência premium, divertida e tecnológica;
 * - Botão claramente identificável como "ABRIR DROP" ou "VER DROP";
 * - Totalmente dinâmico e controlado pelo MERMI CONTROL;
 * - Tipos de recompensas reais configuradas no banco (sem inventar nada).
 */
export const DropSurpresaHomeCard: React.FC<DropSurpresaHomeCardProps> = ({ onNavigate }) => {
  const { drops, user, claimDrop, showToast } = useMermiStore();
  const [openingDrop, setOpeningDrop] = useState<DropSurpresaItem | null>(null);
  const [isOpeningAnimation, setIsOpeningAnimation] = useState(false);
  const [revealedReward, setRevealedReward] = useState<string | null>(null);

  // Encontra o drop ativo em destaque ou o primeiro ativo
  const activeDrops = drops.filter((d) => d.active);
  const currentDrop = activeDrops.find((d) => d.featured) || activeDrops[0];

  if (!currentDrop) {
    return null; // Oculta se nenhum drop estiver ativo no MerMi Control
  }

  const hasRequiredPoints = user.mermiPoints >= currentDrop.minPointsRequired;
  const hasRequiredOrders = user.ordersCount >= currentDrop.minOrdersRequired;
  const canOpen = hasRequiredPoints && hasRequiredOrders;
  const remainingStock = Math.max(0, currentDrop.quantityTotal - currentDrop.quantityClaimed);
  const stockPercentage = Math.round((currentDrop.quantityClaimed / currentDrop.quantityTotal) * 100);

  const getRewardTypeBadge = (type: string) => {
    switch (type) {
      case 'points':
        return { label: 'BÔNUS DE POINTS', color: 'bg-amber-500/20 text-amber-300 border-amber-400/40', icon: '⭐' };
      case 'cupom':
      case 'desconto':
        return { label: 'CUPOM / DESCONTO', color: 'bg-orange-500/20 text-orange-300 border-orange-400/40', icon: '🏷️' };
      case 'produto':
      case 'marmita':
        return { label: 'MARMITA GRÁTIS', color: 'bg-[#0EB24A]/20 text-[#0EB24A] border-[#0EB24A]/40', icon: '🍱' };
      case 'beneficio':
        return { label: 'BENEFÍCIO EXCLUSIVO', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40', icon: '⚡' };
      case 'experiencia':
        return { label: 'EXPERIÊNCIA VIP', color: 'bg-purple-500/20 text-purple-300 border-purple-400/40', icon: '🏃' };
      default:
        return { label: 'RECOMPENSA SECRETA', color: 'bg-blue-500/20 text-cyan-300 border-blue-400/40', icon: '🎁' };
    }
  };

  const badgeInfo = getRewardTypeBadge(currentDrop.rewardType);

  const handleOpenAction = () => {
    if (!canOpen) {
      onNavigate('drop_surpresa');
      return;
    }

    setOpeningDrop(currentDrop);
    setIsOpeningAnimation(true);
    setRevealedReward(null);

    // Efeito tecnológico de revelação de 1.6 segundos
    setTimeout(() => {
      const res = claimDrop(currentDrop.id);
      setIsOpeningAnimation(false);
      if (res.success && res.reward) {
        setRevealedReward(res.reward);
      } else {
        setOpeningDrop(null);
        showToast(res.message);
      }
    }, 1600);
  };

  return (
    <>
      <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl border-2 border-blue-500/50 bg-gradient-to-br from-[#00225E] via-[#001742] to-[#000C24] p-5 sm:p-6 select-none group transition-all duration-300 hover:border-cyan-400/70">
        {/* Glow ambient background & tech circuit overlay */}
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-blue-600/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-40 h-40 bg-[#FF6B00]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Shimmer linear line across top */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5">
          {/* LADO ESQUERDO: ÍCONE 3D DO BAÚ TECNOLÓGICO & BADGES */}
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative shrink-0">
              {/* Moldura circular com anéis de energia cyan e laranja */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-cyan-400 via-blue-600 to-[#FF6B00] p-1 shadow-[0_0_25px_rgba(6,182,212,0.45)] group-hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] transition-all">
                <div className="w-full h-full bg-[#001030] rounded-[14px] flex flex-col items-center justify-center relative overflow-hidden">
                  <span className="text-3xl sm:text-4xl animate-bounce">🎁</span>
                  <div className="absolute bottom-1 px-1.5 py-0.5 rounded-full bg-cyan-400/20 border border-cyan-400/40 text-[7px] font-black text-cyan-300 uppercase tracking-widest">
                    DROP VIP
                  </div>
                </div>
              </div>

              {/* Selo oficial de disponibilidade */}
              <div className="absolute -bottom-1.5 -right-1.5 px-2 py-0.5 rounded-full bg-[#FF6B00] text-white text-[8px] font-black uppercase tracking-wider shadow-md flex items-center gap-0.5 font-['Outfit'] border border-amber-300">
                <Flame size={9} className="text-amber-200" />
                <span>HOT</span>
              </div>
            </div>

            {/* TEXTOS PRINCIPAIS */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 mb-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider border font-['Outfit'] bg-cyan-500/20 text-cyan-300 border-cyan-400/40">
                  <Zap size={10} className="text-cyan-400" />
                  DROP SURPRESA OFICIAL
                </span>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold border ${badgeInfo.color}`}>
                  <span>{badgeInfo.icon}</span>
                  <span>{badgeInfo.label}</span>
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-black text-white font-['Outfit'] tracking-tight leading-tight">
                {currentDrop.title}
              </h3>

              <p className="text-xs text-blue-100/90 mt-1 line-clamp-2 leading-relaxed">
                {currentDrop.subtitle || currentDrop.description}
              </p>

              {/* Status de estoque e progresso real */}
              <div className="flex items-center gap-3 mt-2 text-[10px] text-blue-200">
                <span className="font-semibold">
                  Restam <strong className="text-cyan-300 font-bold">{remainingStock}</strong> de {currentDrop.quantityTotal}
                </span>
                <div className="w-20 sm:w-28 h-1.5 bg-blue-950 rounded-full overflow-hidden border border-blue-800">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-[#FF6B00] rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, stockPercentage)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* LADO DIREITO: REQUISITOS & BOTÃO DE ABERTURA ULTRA CLARO */}
          <div className="w-full md:w-auto flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-blue-500/20">
            {/* Requisitos de Points e Pedidos */}
            <div className="text-left md:text-right">
              <span className="text-[9px] font-bold uppercase tracking-wider text-blue-300 block">
                Requisito do Drop
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`text-xs font-black font-['Outfit'] flex items-center gap-1 ${hasRequiredPoints ? 'text-[#0EB24A]' : 'text-amber-300'}`}>
                  ⭐ {currentDrop.minPointsRequired} pts
                </span>
                {currentDrop.minOrdersRequired > 0 && (
                  <span className={`text-[10px] font-bold ${hasRequiredOrders ? 'text-[#0EB24A]' : 'text-stone-400'}`}>
                    • {currentDrop.minOrdersRequired} pedido(s)
                  </span>
                )}
              </div>
            </div>

            {/* BOTÃO CLARAMENTE IDENTIFICÁVEL: ABRIR DROP ou VER DROP */}
            {canOpen ? (
              <button
                onClick={handleOpenAction}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-[#FF6B00] hover:brightness-110 active:scale-95 text-stone-950 font-black text-xs sm:text-sm font-['Outfit'] uppercase tracking-wider shadow-lg shadow-cyan-500/30 flex items-center gap-2 cursor-pointer transition-all border border-cyan-200"
                title="Abrir e resgatar este Drop Surpresa agora"
              >
                <Unlock size={16} className="text-stone-950 animate-pulse" />
                <span>ABRIR DROP</span>
                <Sparkles size={14} className="text-amber-300" />
              </button>
            ) : (
              <button
                onClick={() => onNavigate('drop_surpresa')}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-600 hover:to-indigo-700 text-white font-black text-xs font-['Outfit'] uppercase tracking-wider shadow-md flex items-center gap-1.5 cursor-pointer transition-all border border-blue-400/40"
                title="Ver detalhes do Drop Surpresa"
              >
                <Gift size={14} className="text-cyan-300" />
                <span>VER DROP</span>
                <ChevronRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* MODAL DE ANIMAÇÃO DE ABERTURA TECNOLÓGICA */}
      {openingDrop && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="max-w-md w-full bg-gradient-to-br from-[#00225E] via-[#001438] to-[#00081C] border-2 border-cyan-400 rounded-3xl p-6 text-white text-center shadow-2xl relative overflow-hidden">
            {/* Fechar modal */}
            {!isOpeningAnimation && (
              <button
                onClick={() => {
                  setOpeningDrop(null);
                  setRevealedReward(null);
                }}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-stone-300 cursor-pointer"
              >
                <X size={16} />
              </button>
            )}

            {isOpeningAnimation ? (
              <div className="py-8 space-y-4">
                <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-[#FF6B00] p-1 animate-spin shadow-2xl shadow-cyan-400/50">
                  <div className="w-full h-full bg-[#001030] rounded-[22px] flex items-center justify-center text-4xl">
                    ⚡
                  </div>
                </div>
                <h4 className="text-lg font-black text-cyan-300 font-['Outfit'] uppercase tracking-wider animate-pulse">
                  Desbloqueando Recompensa Oficial...
                </h4>
                <p className="text-xs text-blue-200">
                  Sincronizando com o MerMi Control & carteira de Points
                </p>
              </div>
            ) : revealedReward ? (
              <div className="py-4 space-y-4 animate-scale-up">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-[#FF6B00] p-1 shadow-2xl shadow-amber-500/50 flex items-center justify-center">
                  <span className="text-4xl">🎉</span>
                </div>

                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#0EB24A] bg-[#0EB24A]/20 px-3 py-1 rounded-full border border-[#0EB24A]/40 font-['Outfit']">
                    RECOMPENSA DESBLOQUEADA COM SUCESSO!
                  </span>
                  <h3 className="text-2xl font-black text-white font-['Outfit'] mt-2">
                    {revealedReward}
                  </h3>
                  <p className="text-xs text-blue-100 mt-1">
                    {openingDrop.title} • Registrado na sua carteira oficial
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-blue-950/80 border border-cyan-400/40 text-xs text-blue-200 flex items-center justify-center gap-2">
                  <CheckCircle2 size={16} className="text-[#0EB24A]" />
                  <span>Disponível para uso imediato em seus próximos pedidos!</span>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => {
                      setOpeningDrop(null);
                      setRevealedReward(null);
                      onNavigate('drop_surpresa');
                    }}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 text-stone-950 font-black text-xs font-['Outfit'] uppercase tracking-wider cursor-pointer hover:brightness-110 active:scale-95"
                  >
                    Ver Meus Resgates
                  </button>
                  <button
                    onClick={() => {
                      setOpeningDrop(null);
                      setRevealedReward(null);
                    }}
                    className="px-4 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs uppercase cursor-pointer"
                  >
                    Concluir
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
};
