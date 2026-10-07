import React from 'react';
import { useMermiStore } from '../../context/MermiStoreContext';

interface PromotionsBlockProps {
  onNavigate: (destination: string) => void;
}

export const PromotionsBlock: React.FC<PromotionsBlockProps> = ({ onNavigate }) => {
  const { promotions, trackEvent } = useMermiStore();

  const activePromos = promotions.filter((p) => p.active).sort((a, b) => a.order - b.order);

  if (activePromos.length === 0) return null;

  const handleAction = (promoId: string, promoName: string, dest: string) => {
    trackEvent('promotion_click', promoId, promoName);
    onNavigate(dest);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3 px-1">
        <div>
          <span className="text-[10px] font-extrabold text-[#E53935] uppercase tracking-wider">
            Exclusivo no App
          </span>
          <h3 className="text-base sm:text-lg font-black text-stone-900 font-['Outfit']">
            Ofertas Para Você
          </h3>
        </div>

        <button
          onClick={() => onNavigate('cardapio')}
          className="text-xs font-bold text-[#0EB24A] hover:text-emerald-700 flex items-center gap-1 transition-colors"
        >
          <span>Ver todas as ofertas</span>
          <span>→</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {activePromos.map((promo) => (
          <div
            key={promo.id}
            className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative group"
          >
            {promo.badge && (
              <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-200">
                {promo.badge}
              </span>
            )}

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center text-sm font-bold">
                  {promo.category === 'combo' ? '🍱' : promo.category === 'plano' ? '⭐' : '🥗'}
                </span>
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wide">
                  {promo.category === 'combo' ? 'Combo Especial' : promo.category === 'plano' ? 'Assinatura' : 'Prato Fit'}
                </span>
              </div>

              <h4 className="text-sm sm:text-base font-extrabold text-stone-900 font-['Outfit'] group-hover:text-emerald-700 transition-colors">
                {promo.name}
              </h4>
              <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                {promo.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
              <div>
                <div className="flex items-baseline gap-1.5">
                  {promo.discountedPrice && (
                    <span className="text-base sm:text-lg font-black text-stone-900 font-['Outfit']">
                      R$ {promo.discountedPrice.toFixed(2).replace('.', ',')}
                    </span>
                  )}
                  {promo.originalPrice && (
                    <span className="text-xs text-stone-400 line-through">
                      R$ {promo.originalPrice.toFixed(2).replace('.', ',')}
                    </span>
                  )}
                </div>
                {promo.pointsReward && (
                  <span className="text-[10px] font-bold text-amber-600 block mt-0.5">
                    +{promo.pointsReward} Points bônus
                  </span>
                )}
              </div>

              <button
                onClick={() => handleAction(promo.id, promo.name, promo.destination)}
                className="px-3.5 py-1.5 bg-[#0EB24A] hover:bg-emerald-600 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs transition-all font-['Outfit']"
              >
                {promo.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
