import React, { useState } from 'react';
import { FoodProduct } from '../../types/food';
import { MarmitaCategory, MarmitaSize } from '../../types';
import { useMermiStore } from '../../context/MermiStoreContext';
import { getBasePrice } from '../../services/pricingService';
import { Sparkles, Utensils, Flame, Award, ChevronRight, Check, Plus, Heart } from 'lucide-react';

interface ProductCardProps {
  product: FoodProduct;
  onCustomize: (product: FoodProduct, selectedSize: MarmitaSize) => void;
  onQuickAdd: (product: FoodProduct, selectedSize: MarmitaSize) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onCustomize,
  onQuickAdd,
}) => {
  const { pricing } = useMermiStore();
  const [selectedSize, setSelectedSize] = useState<MarmitaSize>(product.defaultSize || '350g');
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Consulta do preço base pela fonte única de dados oficial (BLOCO 04, Seção 2 & 13)
  const currentPrice = getBasePrice(pricing, product.line, selectedSize);
  const basePoints = product.line === 'fit_premium' 
    ? (selectedSize === '500g' ? 30 : 25) 
    : (selectedSize === '500g' ? 20 : 15);

  const isPremium = product.line === 'fit_premium';
  const rawImageUrl = (product.imageUrl || product.image || '').trim();
  const hasValidImage = rawImageUrl.length > 0 && !imageError;

  return (
    <div className={`group rounded-3xl bg-white border transition-all duration-300 flex flex-col justify-between overflow-hidden relative shadow-sm hover:shadow-md ${
      isPremium ? 'border-amber-200/80 hover:border-amber-400' : 'border-stone-200 hover:border-emerald-400'
    }`}>
      
      {/* Imagem do Produto / Placeholder Oficial Elegante */}
      <div className="relative aspect-[16/10] bg-gradient-to-br from-stone-900 via-stone-950 to-stone-900 overflow-hidden flex items-center justify-center p-4">
        {hasValidImage ? (
          <img
            src={rawImageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
          />
        ) : (
          /* Placeholder oficial elegante: Foto em breve */
          <div className="text-center space-y-2 relative z-10">
            <div className="w-12 h-12 rounded-2xl mx-auto bg-stone-800/80 border border-stone-700/60 flex items-center justify-center text-stone-300 shadow-inner">
              <Utensils className={`w-6 h-6 ${isPremium ? 'text-amber-400' : 'text-[#0EB24A]'}`} />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-wider text-stone-200 font-['Outfit']">
                Foto em breve
              </p>
              <span className="text-[9px] font-medium text-stone-400 tracking-wide block">
                MERMI FIT LIFE · Foto Oficial em Produção
              </span>
            </div>
          </div>
        )}

        {/* Linha Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-20">
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md backdrop-blur-md ${
            isPremium
              ? 'bg-amber-500/90 text-stone-950 border border-amber-300'
              : 'bg-[#0EB24A]/90 text-white border border-emerald-300/40'
          }`}>
            {isPremium ? 'Fit Premium' : 'Linha Fit'}
          </span>

          {product.featured && (
            <span className="px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-stone-900/85 text-amber-400 border border-amber-400/30 backdrop-blur-md flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" /> Destaque
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
          aria-label="Favoritar"
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-stone-900/70 border border-stone-700/60 flex items-center justify-center text-stone-300 hover:text-rose-400 transition-colors z-20 cursor-pointer backdrop-blur-md"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Nutritional Pill Overlay */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[10px] font-semibold text-stone-300 bg-stone-950/80 px-2.5 py-1 rounded-xl backdrop-blur-md border border-stone-800/80 z-20">
          <span className="flex items-center gap-1">
            <Flame className="w-3 h-3 text-amber-400" />
            <span>{product.nutrition.calories} kcal</span>
          </span>
          <span className="text-stone-500">•</span>
          <span className="text-emerald-400 font-bold">
            {product.nutrition.protein_grams}g prot
          </span>
          <span className="text-stone-500">•</span>
          <span className="text-stone-300">
            {product.nutrition.carbohydrate_grams}g carbo
          </span>
        </div>
      </div>

      {/* Conteúdo do Card */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-1.5">
            {product.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-stone-100 text-stone-600 border border-stone-200/80"
              >
                {tag}
              </span>
            ))}
          </div>

          <h3 className="font-black text-sm sm:text-base text-stone-900 font-['Outfit'] leading-snug line-clamp-1">
            {product.name}
          </h3>

          <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Seletor de Tamanho (350g ou 500g) */}
        <div className="pt-2 border-t border-stone-100">
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              Tamanho:
            </span>
            <div className="flex items-center bg-stone-100 p-0.5 rounded-xl border border-stone-200">
              <button
                type="button"
                onClick={() => setSelectedSize('350g')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  selectedSize === '350g'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                350g
              </button>
              <button
                type="button"
                onClick={() => setSelectedSize('500g')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  selectedSize === '500g'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                500g
              </button>
            </div>
          </div>

          {/* Preço e Points */}
          <div className="flex items-end justify-between mb-3">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold block">
                Preço Oficial
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg sm:text-xl font-black text-stone-950 font-['Outfit']">
                  R$ {currentPrice.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>

            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-800 border border-amber-300 flex items-center gap-1 shadow-xs">
              <Award className="w-3 h-3 text-amber-600" />
              +{basePoints} Points
            </span>
          </div>

          {/* Botões de Ação */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onCustomize(product, selectedSize)}
              className="px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider border border-stone-300 text-stone-800 hover:bg-stone-50 active:scale-95 transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              Personalizar
            </button>
            <button
              onClick={() => onQuickAdd(product, selectedSize)}
              className={`px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-white active:scale-95 transition-all flex items-center justify-center gap-1 shadow-xs cursor-pointer ${
                isPremium
                  ? 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-600'
                  : 'bg-gradient-to-r from-[#0EB24A] to-emerald-600 hover:from-emerald-600 hover:to-[#0EB24A]'
              }`}
            >
              <Plus className="w-3.5 h-3.5" /> Adicionar
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
