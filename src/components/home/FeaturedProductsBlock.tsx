import React from 'react';
import { useMermiStore } from '../../context/MermiStoreContext';
import { MarmitaSize } from '../../types';
import { FoodProduct } from '../../types/food';
import { getBasePrice } from '../../services/pricingService';
import { UtensilsCrossed, Plus, ChevronRight } from 'lucide-react';

interface FeaturedProductsBlockProps {
  onNavigate: (tab: string) => void;
  onOpenCustomize?: () => void;
}

export const FeaturedProductsBlock: React.FC<FeaturedProductsBlockProps> = ({
  onNavigate,
  onOpenCustomize
}) => {
  const { products, pricing, addToCart, showToast } = useMermiStore();

  // Seleciona 2 marmitas em destaque: uma Linha Fit e uma Linha Fit Premium
  const fitMarmita = products.find((p) => p.line === 'fit' && p.active && p.availability) || products[0];
  const premiumMarmita = products.find((p) => p.line === 'fit_premium' && p.active && p.availability) || products[1];

  const highlightedProducts = [fitMarmita, premiumMarmita].filter(Boolean);

  const handleQuickAdd = (product: FoodProduct, size: MarmitaSize) => {
    const price = getBasePrice(pricing, product.line, size);
    const points = product.line === 'fit_premium' ? (size === '500g' ? 30 : 25) : (size === '500g' ? 20 : 15);

    addToCart({
      isCustomMarmita: false,
      productId: product.id,
      name: product.name,
      line: product.line,
      size,
      unitPrice: price,
      quantity: 1,
      totalPrice: price,
      points_earned: points,
      summary: `${product.name} (${size})`,
      image: product.image
    });
    showToast(`Adicionado ao carrinho: ${product.name} (${size})`);
  };

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-xs font-black uppercase tracking-wider text-stone-800 font-['Outfit'] flex items-center gap-1.5">
            <UtensilsCrossed size={14} className="text-[#0EB24A]" />
            MARMITAS EM DESTAQUE
          </h2>
          <p className="text-[10px] text-stone-500 font-medium">
            Linha Fit (R$ 19,90) e Linha Fit Premium (R$ 32,90)
          </p>
        </div>

        <button
          onClick={() => onNavigate('cardapio')}
          className="text-xs font-bold text-[#0EB24A] hover:text-emerald-700 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>Ver Cardápio</span>
          <ChevronRight size={13} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {highlightedProducts.map((p) => {
          const isPremium = p.line === 'fit_premium';
          const price350 = getBasePrice(pricing, p.line, '350g');
          const price500 = getBasePrice(pricing, p.line, '500g');
          const cals = p.nutrition?.calories || 400;
          const prot = p.nutrition?.protein_grams || 35;
          const carb = p.nutrition?.carbohydrate_grams || 30;

          return (
            <div
              key={p.id}
              className={`rounded-3xl p-4 sm:p-5 border transition-all duration-200 flex flex-col justify-between relative bg-white shadow-xs hover:shadow-md ${
                isPremium ? 'border-amber-300/80 bg-gradient-to-b from-amber-500/5 to-white' : 'border-stone-200/90'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider font-['Outfit'] border ${
                    isPremium ? 'bg-amber-400/20 text-amber-800 border-amber-400/50' : 'bg-emerald-50 text-[#0EB24A] border-emerald-200'
                  }`}>
                    {isPremium ? '⭐ LINHA FIT PREMIUM' : '🍃 LINHA FIT'}
                  </span>
                  <span className="text-[10px] font-black text-stone-900 font-['Outfit']">
                    R$ {price350.toFixed(2).replace('.', ',')} (350g)
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-extrabold text-stone-900 font-['Outfit'] leading-snug line-clamp-1">
                  {p.name}
                </h3>
                <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                  {p.description}
                </p>

                <div className="flex items-center gap-3 mt-3 text-[11px] text-stone-500 font-medium">
                  <span>🔥 {cals} kcal</span>
                  <span>💪 {prot}g proteína</span>
                  <span>🌾 {carb}g carb</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleQuickAdd(p, '350g')}
                    className="px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                    title="Adicionar tamanho 350g"
                  >
                    <Plus size={12} />
                    <span>350g</span>
                  </button>
                  <button
                    onClick={() => handleQuickAdd(p, '500g')}
                    className="px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                    title={`Adicionar tamanho 500g (R$ ${price500.toFixed(2).replace('.', ',')})`}
                  >
                    <Plus size={12} />
                    <span>500g</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    onNavigate('cardapio');
                    if (onOpenCustomize) onOpenCustomize();
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs uppercase font-['Outfit'] tracking-wider cursor-pointer transition-all ${
                    isPremium
                      ? 'bg-amber-500 hover:bg-amber-600 text-stone-950'
                      : 'bg-[#0EB24A] hover:bg-emerald-600 text-white'
                  }`}
                >
                  Personalizar
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
