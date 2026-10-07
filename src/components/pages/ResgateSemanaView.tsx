import React, { useState } from 'react';
import { useMermiStore } from '../../context/MermiStoreContext';
import { MermiPointsBadge } from '../brand/MermiPointsBadge';
import { RewardItem } from '../../types';
import {
  Award,
  Gift,
  CheckCircle2,
  Clock,
  Sparkles,
  Flame,
  AlertCircle,
  ShoppingBag,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const ResgateSemanaView: React.FC = () => {
  const { user, rewards, redemptions, redeemReward, presetPoints } = useMermiStore();
  const [selectedReward, setSelectedReward] = useState<RewardItem | null>(null);
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  const handleOpenRedeem = (reward: RewardItem) => {
    setSelectedReward(reward);
    setConfirmationOpen(true);
  };

  const handleConfirmRedeem = () => {
    if (!selectedReward) return;
    redeemReward(selectedReward.id);
    setConfirmationOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FCD34D] text-stone-950 pb-28 pt-4 px-3 sm:px-4 relative overflow-hidden font-sans">
      
      {/* Texture & Chalk-like ambient doodles matching Foto 09 */}
      <div className="absolute inset-0 bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none" />

      <div className="max-w-2xl mx-auto space-y-6 relative z-10">
        
        {/* Header matching Foto 09 */}
        <div className="text-center pt-2 flex flex-col items-center">
          
          {/* Logo Oficial MERMI POINTS em Destaque Maior com Fundo Transparente */}
          <div className="mb-3 shrink-0 transition-transform duration-200 hover:scale-105">
            <MermiPointsBadge size={110} variant="square" />
          </div>

          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-stone-950 text-amber-300 text-xs font-black uppercase tracking-widest mb-2 shadow">
            <span>⭐</span> RESGATE DA SEMANA <span>⭐</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-stone-950 uppercase font-['Outfit'] drop-shadow-sm">
            SEUS PEDIDOS VALEM MAIS!
          </h1>
          
          <p className="text-xs sm:text-sm font-extrabold text-stone-900 tracking-wide max-w-md uppercase mt-0.5">
            TRANSFORME SUA CONSTÂNCIA EM BENEFÍCIOS REAIS
          </p>

          {/* Badge & Dynamic User Points Pill (Foto 09: "VOCÊ TEM 128 POINTS") */}
          <div className="mt-4 p-5 rounded-3xl bg-stone-950 text-white shadow-2xl border-4 border-amber-400 flex flex-col items-center w-full max-w-md">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400">
                SEU SALDO DISPONÍVEL
              </span>
            </div>
            
            <div className="flex items-center gap-3 my-2">
              <MermiPointsBadge size={52} variant="square" />
              <span className="text-3xl sm:text-4xl font-black tracking-tight text-white font-['Outfit']">
                {user.mermiPoints.toLocaleString('pt-BR')}
              </span>
              <span className="text-sm font-black text-amber-400 uppercase font-['Outfit']">
                POINTS
              </span>
            </div>

            <p className="text-[10px] text-stone-300 font-medium">
              Saldo oficial verificado pelo Points Ledger contábil. Escolha seu prêmio abaixo e resgate com segurança.
            </p>
          </div>
        </div>

        {/* 4-Step Pipeline from Foto 09 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="bg-white/90 backdrop-blur-sm p-3 rounded-2xl border-2 border-stone-950 shadow-md text-center">
            <span className="text-xs font-black text-stone-950 block">1. ACUMULE</span>
            <span className="text-[9px] font-bold text-stone-700 leading-tight block mt-0.5">
              Ganhe points a cada pedido e desafio
            </span>
          </div>

          <div className="bg-white/90 backdrop-blur-sm p-3 rounded-2xl border-2 border-stone-950 shadow-md text-center">
            <span className="text-xs font-black text-stone-950 block">2. ESCOLHA</span>
            <span className="text-[9px] font-bold text-stone-700 leading-tight block mt-0.5">
              Selecione prêmios imperdíveis
            </span>
          </div>

          <div className="bg-white/90 backdrop-blur-sm p-3 rounded-2xl border-2 border-stone-950 shadow-md text-center">
            <span className="text-xs font-black text-stone-950 block">3. RESGATE</span>
            <span className="text-[9px] font-bold text-stone-700 leading-tight block mt-0.5">
              Troque direto pelo app com 1 clique
            </span>
          </div>

          <div className="bg-white/90 backdrop-blur-sm p-3 rounded-2xl border-2 border-stone-950 shadow-md text-center">
            <span className="text-xs font-black text-stone-950 block">4. APROVEITE!</span>
            <span className="text-[9px] font-bold text-stone-700 leading-tight block mt-0.5">
              Curta seus benefícios exclusivos
            </span>
          </div>
        </div>

        {/* Rewards Catalog (Foto 09: Marmita Grátis 100, Desconto 150, Copo 200, Combo 300, Bolsa 400, Surpresa 500+) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-stone-950 font-['Outfit']">
              CATÁLOGO DE RECOMPENSAS DA SEMANA
            </h3>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-stone-950 text-white">
              Válido até Domingo
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {rewards.map((reward) => {
              const canAfford = user.mermiPoints >= reward.pointsCost;
              const hasStock = reward.stock > 0;

              return (
                <div
                  key={reward.id}
                  className="bg-white rounded-3xl p-4 border-3 border-stone-950 shadow-lg flex flex-col justify-between relative overflow-hidden group"
                >
                  {/* Points Badge Tag */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-stone-950 text-amber-300 font-black text-xs font-['Outfit'] shadow-sm">
                      <span>⭐</span>
                      <span>{reward.pointsCost} POINTS</span>
                    </span>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      hasStock ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {hasStock ? `${reward.stock} un. disponíveis` : 'Esgotado'}
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="my-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-2xl mb-2">
                      {reward.id.includes('marmita') && '🍱'}
                      {reward.id.includes('desconto') && '🏷️'}
                      {reward.id.includes('copo') && '🥤'}
                      {reward.id.includes('combo') && '🍽️'}
                      {reward.id.includes('bolsa') && '👜'}
                      {reward.id.includes('surpresa') && '🎁'}
                    </div>

                    <h4 className="text-base font-black text-stone-950 font-['Outfit'] leading-tight">
                      {reward.title}
                    </h4>
                    
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                      {reward.description}
                    </p>
                  </div>

                  {/* Redeem Button */}
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-stone-500">
                      {canAfford ? 'Pronto para resgate' : `Faltam ${reward.pointsCost - user.mermiPoints} pts`}
                    </span>

                    <button
                      disabled={!canAfford || !hasStock}
                      onClick={() => handleOpenRedeem(reward)}
                      className={`px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm active:scale-95 ${
                        canAfford && hasStock
                          ? 'bg-stone-950 hover:bg-[#0EB24A] text-amber-300 hover:text-white'
                          : 'bg-stone-200 text-stone-400 cursor-not-allowed border border-stone-300'
                      }`}
                    >
                      Resgatar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* User Redemptions History */}
        {redemptions.length > 0 && (
          <div className="bg-stone-950 text-white rounded-3xl p-5 border-3 border-amber-400 shadow-xl">
            <h3 className="text-xs font-black uppercase tracking-wider text-amber-400 font-['Outfit'] mb-3 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              SEUS PRÊMIOS RESGATADOS NESTA CONTA
            </h3>

            <div className="space-y-2">
              {redemptions.map((red) => (
                <div
                  key={red.id}
                  className="p-3 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <h5 className="font-black text-white font-['Outfit']">{red.rewardTitle}</h5>
                    <p className="text-[10px] text-stone-400">Resgatado em {red.date} · Custo: {red.pointsSpent} pts</p>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-1 bg-amber-500/20 text-amber-300 font-mono font-bold rounded-lg border border-amber-500/30 text-[11px] block">
                      {red.code}
                    </span>
                    <span className="text-[9px] text-emerald-400 font-bold uppercase mt-0.5 block">
                      {red.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Confirmation Modal */}
      {confirmationOpen && selectedReward && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-stone-950 shadow-2xl border-4 border-stone-950 text-center">
            <div className="w-16 h-16 rounded-full bg-amber-100 border-2 border-stone-950 mx-auto flex items-center justify-center text-3xl shadow-md">
              🎁
            </div>

            <h3 className="text-xl font-black font-['Outfit'] uppercase mt-3">
              Confirmar Resgate?
            </h3>
            
            <p className="text-xs font-bold text-stone-600 mt-1">
              Você está prestes a resgatar:
            </p>
            <p className="text-sm font-black text-stone-950 mt-0.5 font-['Outfit']">
              {selectedReward.title}
            </p>

            <div className="my-4 p-3 rounded-2xl bg-stone-100 border border-stone-300 text-xs">
              <div className="flex justify-between font-semibold text-stone-600">
                <span>Seu saldo atual:</span>
                <span>{user.mermiPoints} pts</span>
              </div>
              <div className="flex justify-between font-black text-rose-600 mt-1">
                <span>Custo do prêmio:</span>
                <span>- {selectedReward.pointsCost} pts</span>
              </div>
              <div className="flex justify-between font-black text-emerald-700 mt-1 pt-1 border-t border-stone-200">
                <span>Saldo após resgate:</span>
                <span>{user.mermiPoints - selectedReward.pointsCost} pts</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setConfirmationOpen(false)}
                className="py-2.5 rounded-xl bg-stone-200 text-stone-800 font-bold text-xs uppercase cursor-pointer hover:bg-stone-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmRedeem}
                className="py-2.5 rounded-xl bg-stone-950 hover:bg-[#0EB24A] text-amber-300 hover:text-white font-black text-xs uppercase shadow-md cursor-pointer transition-all"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
