import React, { useState, useMemo } from 'react';
import { useMermiStore } from '../../context/MermiStoreContext';
import { FoodProduct } from '../../types/food';
import { MarmitaSize } from '../../types';
import { ProductCard } from '../food/ProductCard';
import { MontarMarmitaFlow } from '../food/MontarMarmitaFlow';
import { CarrinhoModal } from '../modals/CarrinhoModal';
import { getBasePrice } from '../../services/pricingService';
import {
  Search,
  Sparkles,
  Utensils,
  Plus,
  ShoppingBag,
  Filter,
  Flame,
  Award,
  ShieldCheck,
  Check,
  ArrowRight,
  Heart,
  SlidersHorizontal,
  Tag
} from 'lucide-react';

interface CardapioViewProps {
  onOpenCart?: () => void;
  initialFilter?: string;
}

export const CardapioView: React.FC<CardapioViewProps> = ({ onOpenCart, initialFilter = 'TODOS' }) => {
  const {
    products,
    pricing,
    addToCart,
    cartItems,
    promotions,
    trackEvent,
    showToast
  } = useMermiStore();

  const [activeFilter, setActiveFilter] = useState<string>(initialFilter);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Estados do Modal Montar Marmita
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [builderPreselectedProduct, setBuilderPreselectedProduct] = useState<FoodProduct | null>(null);
  const [builderInitialSize, setBuilderInitialSize] = useState<MarmitaSize>('350g');

  // Estado do Carrinho local se não passado pelo App
  const [isLocalCartOpen, setIsLocalCartOpen] = useState(false);

  // Filtros oficiais (BLOCO 04, Seção 9)
  const filterOptions = [
    { id: 'TODOS', label: 'Todos' },
    { id: 'FIT', label: 'Linha Fit' },
    { id: 'FIT_PREMIUM', label: 'Fit Premium' },
    { id: 'PROTEINAS', label: 'Proteínas' },
    { id: 'CARBOIDRATOS', label: 'Carboidratos' },
    { id: 'VEGETAIS', label: 'Vegetais' },
    { id: 'MAIS_PEDIDOS', label: 'Mais Pedidos' },
    { id: 'NOVIDADES', label: 'Novidades' },
    { id: 'PROMOCOES', label: 'Promoções' },
    { id: 'FAVORITOS', label: 'Favoritos' },
  ];

  // Busca e Filtros aplicados em tempo real (BLOCO 04, Seção 9 & 10)
  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => p.active);

    // Filtro por categoria / linha / tags
    if (activeFilter === 'FIT') {
      result = result.filter((p) => p.line === 'fit');
    } else if (activeFilter === 'FIT_PREMIUM') {
      result = result.filter((p) => p.line === 'fit_premium');
    } else if (activeFilter === 'PROTEINAS') {
      result = result.filter((p) => p.category === 'proteinas' || p.tags.includes('Proteico'));
    } else if (activeFilter === 'CARBOIDRATOS') {
      result = result.filter((p) => p.category === 'carboidratos' || p.tags.includes('Energia Limpa'));
    } else if (activeFilter === 'VEGETAIS') {
      result = result.filter((p) => p.category === 'vegetais' || p.tags.includes('Low Carb'));
    } else if (activeFilter === 'MAIS_PEDIDOS') {
      result = result.filter((p) => p.featured || p.tags.includes('Campeão de Vendas'));
    } else if (activeFilter === 'NOVIDADES') {
      result = result.filter((p) => p.tags.includes('Lançamento') || p.tags.includes('Novo'));
    } else if (activeFilter === 'PROMOCOES') {
      result = result.filter((p) => p.tags.includes('Econômico') || p.tags.includes('Especial'));
    } else if (activeFilter === 'FAVORITOS') {
      result = result.filter((p) => p.featured);
    }

    // Busca por texto (nome, descrição, ingredientes e tags)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((p) => {
        const matchName = p.name.toLowerCase().includes(q);
        const matchDesc = p.description.toLowerCase().includes(q);
        const matchIng = p.ingredients.some((ing) => ing.toLowerCase().includes(q));
        const matchTags = p.tags.some((t) => t.toLowerCase().includes(q));
        const matchProt = p.protein.toLowerCase().includes(q);
        const matchCarb = p.carbohydrate.toLowerCase().includes(q);
        return matchName || matchDesc || matchIng || matchTags || matchProt || matchCarb;
      });
    }

    return result;
  }, [products, activeFilter, searchQuery]);

  const handleOpenBuilder = (product?: FoodProduct, size: MarmitaSize = '350g') => {
    setBuilderPreselectedProduct(product || null);
    setBuilderInitialSize(size);
    setIsBuilderOpen(true);
  };

  const handleQuickAdd = (product: FoodProduct, selectedSize: MarmitaSize) => {
    const basePrice = getBasePrice(pricing, product.line, selectedSize);
    const pointsGained = product.line === 'fit_premium' 
      ? (selectedSize === '500g' ? 30 : 25) 
      : (selectedSize === '500g' ? 20 : 15);

    addToCart({
      isCustomMarmita: false,
      productId: product.id,
      name: `${product.name} (${selectedSize})`,
      line: product.line,
      size: selectedSize,
      unitPrice: basePrice,
      quantity: 1,
      totalPrice: basePrice,
      points_earned: pointsGained,
      summary: `${product.protein} · ${product.carbohydrate} · ${product.vegetables}`
    });
  };

  const handleOpenCartModal = () => {
    if (onOpenCart) {
      onOpenCart();
    } else {
      setIsLocalCartOpen(true);
    }
  };

  const totalCartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="min-h-screen bg-[#FBF7EE] text-stone-900 pb-32 pt-4 px-3 sm:px-4 animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Banner de Preços Oficiais da Marca */}
        <div className="bg-stone-900 text-white p-4 sm:p-5 rounded-3xl border border-stone-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#0EB24A] flex items-center justify-center md:justify-start gap-1">
              <Sparkles className="w-3.5 h-3.5" /> TABELA OFICIAL MERMI FIT LIFE
            </span>
            <h2 className="text-lg sm:text-xl font-black font-['Outfit']">
              Cardápio Inteligente & Transparente
            </h2>
            <p className="text-xs text-stone-400 max-w-md leading-relaxed">
              Trocas de proteínas, carboidratos e vegetais da mesma linha <strong>não alteram o preço</strong>.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-3 w-full md:w-auto">
            <div className="bg-stone-800/80 p-2.5 sm:p-3 rounded-2xl border border-stone-700/60 text-center">
              <span className="text-[9px] font-black uppercase tracking-wider text-emerald-400 block">
                Linha Fit
              </span>
              <div className="text-xs font-bold text-stone-200 mt-0.5">
                350g: <span className="text-white font-black">R$ 19,90</span>
              </div>
              <div className="text-xs font-bold text-stone-200">
                500g: <span className="text-white font-black">R$ 24,90</span>
              </div>
            </div>

            <div className="bg-stone-800/80 p-2.5 sm:p-3 rounded-2xl border border-stone-700/60 text-center">
              <span className="text-[9px] font-black uppercase tracking-wider text-amber-400 block">
                Fit Premium
              </span>
              <div className="text-xs font-bold text-stone-200 mt-0.5">
                350g: <span className="text-white font-black">R$ 32,90</span>
              </div>
              <div className="text-xs font-bold text-stone-200">
                500g: <span className="text-white font-black">R$ 39,90</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Card: MONTAR MINHA MARMITA (BLOCO 04, Seção 11) */}
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-emerald-600 to-[#0EB24A] text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
              <Utensils className="w-3 h-3" /> EXPERIÊNCIA INTERATIVA EM 8 ETAPAS
            </div>
            <h3 className="text-xl sm:text-2xl font-black font-['Outfit']">
              Monte sua Marmita Sob Medida
            </h3>
            <p className="text-xs text-emerald-100 max-w-lg leading-relaxed">
              Personalize proteína, carboidrato e legumes sem aumento silencioso de preço. Apenas adicionais extras são pagos.
            </p>
          </div>

          <button
            onClick={() => handleOpenBuilder()}
            className="px-6 py-3 rounded-2xl bg-white text-stone-950 hover:bg-stone-100 active:scale-95 text-xs font-black uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer shrink-0"
          >
            <span>Montar Agora</span>
            <ArrowRight className="w-4 h-4 text-[#0EB24A]" />
          </button>
        </div>

        {/* Barra de Busca e Filtros */}
        <div className="space-y-3">
          {/* Campo de Pesquisa (BLOCO 04, Seção 10) */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por prato, proteína (frango, patinho, salmão), carboidrato ou ingredientes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white border border-stone-200 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-emerald-500 shadow-xs transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs font-bold cursor-pointer"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Filtros Horizontais com Scroll (BLOCO 04, Seção 9) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {filterOptions.map((filter) => {
              const isActive = activeFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-stone-950 text-white shadow-sm'
                      : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid de Produtos Oficiais */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-black text-stone-500 uppercase tracking-wider font-['Outfit']">
              Exibindo {filteredProducts.length} {filteredProducts.length === 1 ? 'prato oficial' : 'pratos oficiais'}
            </span>
            {searchQuery && (
              <span className="text-xs text-emerald-700 font-bold">
                Resultados para: "{searchQuery}"
              </span>
            )}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white border border-stone-200 space-y-3">
              <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                <Utensils className="w-6 h-6" />
              </div>
              <h4 className="font-black text-sm text-stone-900 font-['Outfit'] uppercase">
                Nenhum prato encontrado
              </h4>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Tente buscar com outro termo ou redefinir os filtros do cardápio.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter('TODOS');
                }}
                className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Limpar Filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onCustomize={(p, sz) => handleOpenBuilder(p, sz)}
                  onQuickAdd={(p, sz) => handleQuickAdd(p, sz)}
                />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Floating Cart Button */}
      {totalCartCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-sm px-4 animate-bounce-subtle">
          <button
            onClick={handleOpenCartModal}
            className="w-full py-3.5 px-5 rounded-2xl bg-stone-900 hover:bg-stone-950 text-white shadow-2xl flex items-center justify-between border border-stone-700/80 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-[#0EB24A] text-white flex items-center justify-center text-xs font-black">
                {totalCartCount}
              </div>
              <span className="text-xs font-black uppercase tracking-wider font-['Outfit']">
                Ver Meu Carrinho
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-[#0EB24A] font-['Outfit']">
                R$ {cartItems.reduce((acc, i) => acc + i.totalPrice, 0).toFixed(2).replace('.', ',')}
              </span>
              <ArrowRight className="w-4 h-4 text-stone-400" />
            </div>
          </button>
        </div>
      )}

      {/* Modal 8 Etapas: Montar Minha Marmita */}
      <MontarMarmitaFlow
        isOpen={isBuilderOpen}
        onClose={() => setIsBuilderOpen(false)}
        preselectedProduct={builderPreselectedProduct}
        initialSize={builderInitialSize}
      />

      {/* Modal de Carrinho Local */}
      <CarrinhoModal
        isOpen={isLocalCartOpen}
        onClose={() => setIsLocalCartOpen(false)}
        onEditCustomMarmita={(item) => {
          setIsLocalCartOpen(false);
          setIsBuilderOpen(true);
        }}
      />
    </div>
  );
};
