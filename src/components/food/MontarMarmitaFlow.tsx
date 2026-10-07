import React, { useState, useEffect } from 'react';
import { useMermiStore } from '../../context/MermiStoreContext';
import { MarmitaCategory, MarmitaSize } from '../../types';
import { CustomIngredientOption, FoodProduct, CartItemProduct } from '../../types/food';
import { calculateMarmitaPrice, calculateMarmitaPoints, getBasePrice } from '../../services/pricingService';
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Award,
  ShieldCheck,
  Plus,
  Flame,
  Info,
  Layers,
  UtensilsCrossed,
  X
} from 'lucide-react';

interface MontarMarmitaFlowProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedProduct?: FoodProduct | null;
  initialSize?: MarmitaSize;
}

export const MontarMarmitaFlow: React.FC<MontarMarmitaFlowProps> = ({
  isOpen,
  onClose,
  preselectedProduct,
  initialSize = '350g'
}) => {
  const { pricing, customIngredients, addToCart, showToast } = useMermiStore();

  // Etapas 1 a 8
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Estados da Montagem
  const [selectedLine, setSelectedLine] = useState<MarmitaCategory>(
    preselectedProduct ? preselectedProduct.line : 'fit'
  );
  const [selectedSize, setSelectedSize] = useState<MarmitaSize>(initialSize);
  const [selectedProtein, setSelectedProtein] = useState<CustomIngredientOption | null>(null);
  const [selectedCarb, setSelectedCarb] = useState<CustomIngredientOption | null>(null);
  const [selectedVeggies, setSelectedVeggies] = useState<CustomIngredientOption[]>([]);
  const [selectedPaidAddons, setSelectedPaidAddons] = useState<CustomIngredientOption[]>([]);
  const [notes, setNotes] = useState<string>('');

  // Sincronizar quando um produto é passado para personalização prévia
  useEffect(() => {
    if (preselectedProduct) {
      setSelectedLine(preselectedProduct.line);
      setSelectedSize(initialSize);
    }
  }, [preselectedProduct, initialSize]);

  // Inicializar opções padrões disponíveis
  useEffect(() => {
    if (!isOpen) return;

    // Proteínas elegíveis para a linha
    const eligibleProteins = customIngredients.filter(
      (i) => i.type === 'proteina' && i.available && (i.lineEligible === selectedLine || i.lineEligible === 'ambas')
    );
    if (eligibleProteins.length > 0 && (!selectedProtein || (selectedProtein.lineEligible !== selectedLine && selectedProtein.lineEligible !== 'ambas'))) {
      setSelectedProtein(eligibleProteins[0]);
    }

    // Carboidratos
    const eligibleCarbs = customIngredients.filter(
      (i) => i.type === 'carboidrato' && i.available
    );
    if (eligibleCarbs.length > 0 && !selectedCarb) {
      setSelectedCarb(eligibleCarbs[0]);
    }

    // Vegetais
    const eligibleVeggies = customIngredients.filter(
      (i) => i.type === 'vegetal' && i.available
    );
    if (eligibleVeggies.length >= 2 && selectedVeggies.length === 0) {
      setSelectedVeggies([eligibleVeggies[0], eligibleVeggies[1]]);
    }
  }, [selectedLine, customIngredients, isOpen]);

  if (!isOpen) return null;

  // CÁLCULO CENTRALIZADO DE PREÇO (BLOCO 04, Seção 12 & 13)
  const priceDetails = calculateMarmitaPrice(pricing, selectedLine, selectedSize, selectedPaidAddons);
  const pointsEarned = calculateMarmitaPoints(selectedLine, selectedSize);

  // Lista de ingredientes filtrados por tipo
  const proteinOptions = customIngredients.filter(
    (i) => i.type === 'proteina' && i.available && (i.lineEligible === selectedLine || i.lineEligible === 'ambas')
  );

  const carbOptions = customIngredients.filter(
    (i) => i.type === 'carboidrato' && i.available
  );

  const veggieOptions = customIngredients.filter(
    (i) => i.type === 'vegetal' && i.available
  );

  const paidAddonOptions = customIngredients.filter(
    (i) => i.type === 'adicional_pago' && i.available
  );

  const handleToggleVeggie = (veg: CustomIngredientOption) => {
    if (selectedVeggies.some((v) => v.id === veg.id)) {
      if (selectedVeggies.length > 1) {
        setSelectedVeggies(selectedVeggies.filter((v) => v.id !== veg.id));
      } else {
        showToast('Escolha ao menos 1 vegetal para sua marmita.');
      }
    } else {
      if (selectedVeggies.length < 3) {
        setSelectedVeggies([...selectedVeggies, veg]);
      } else {
        showToast('Você pode escolher até 3 vegetais sem custo adicional!');
      }
    }
  };

  const handleTogglePaidAddon = (addon: CustomIngredientOption) => {
    if (selectedPaidAddons.some((a) => a.id === addon.id)) {
      setSelectedPaidAddons(selectedPaidAddons.filter((a) => a.id !== addon.id));
    } else {
      setSelectedPaidAddons([...selectedPaidAddons, addon]);
    }
  };

  // Etapa 8: Adicionar ao Carrinho
  const handleAddToCartConfirm = () => {
    if (!selectedProtein || !selectedCarb) {
      showToast('Por favor, selecione uma proteína e um carboidrato.');
      return;
    }

    const customMarmitaData = {
      id: `custom_${Date.now()}`,
      line: selectedLine,
      size: selectedSize,
      protein: selectedProtein,
      carbohydrate: selectedCarb,
      vegetables: selectedVeggies,
      paidAddons: selectedPaidAddons,
      points_earned: pointsEarned,
      basePrice: priceDetails.basePrice,
      addonsPrice: priceDetails.addonsPrice,
      unitPrice: priceDetails.unitPrice,
      quantity: 1,
      totalPrice: priceDetails.unitPrice,
      customNotes: notes.trim() || undefined
    };

    const cartItem: Omit<CartItemProduct, 'id'> = {
      isCustomMarmita: true,
      customMarmita: customMarmitaData,
      name: `Marmita Personalizada ${selectedLine === 'fit_premium' ? 'Premium' : 'Fit'} (${selectedSize})`,
      line: selectedLine,
      size: selectedSize,
      unitPrice: priceDetails.unitPrice,
      quantity: 1,
      totalPrice: priceDetails.unitPrice,
      points_earned: pointsEarned,
      summary: `${selectedProtein.name} · ${selectedCarb.name} · ${selectedVeggies.map((v) => v.name).join(', ')}${
        selectedPaidAddons.length > 0 ? ` + ${selectedPaidAddons.map((a) => a.name).join(', ')}` : ''
      }`
    };

    addToCart(cartItem);
    onClose();
    // Reset modal
    setCurrentStep(1);
    setSelectedPaidAddons([]);
    setNotes('');
  };

  const stepsList = [
    { num: 1, title: 'Linha' },
    { num: 2, title: 'Tamanho' },
    { num: 3, title: 'Proteína' },
    { num: 4, title: 'Carboidrato' },
    { num: 5, title: 'Vegetais' },
    { num: 6, title: 'Adicionais' },
    { num: 7, title: 'Revisão' },
    { num: 8, title: 'Carrinho' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FBF7EE] w-full max-w-2xl rounded-3xl border border-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="bg-stone-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-stone-800">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> FLUXO OFICIAL MERMI FIT LIFE
            </span>
            <h2 className="text-lg sm:text-xl font-black font-['Outfit'] mt-0.5">
              Montar Minha Marmita
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 text-stone-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Real-time Pricing Top Bar */}
        <div className="bg-white px-4 sm:px-6 py-2.5 border-b border-stone-200 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
              selectedLine === 'fit_premium'
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
            }`}>
              {selectedLine === 'fit_premium' ? 'Fit Premium' : 'Fit'} · {selectedSize}
            </span>
            <span className="text-[10px] text-stone-500 hidden sm:inline">
              (Personalização incluída: <strong>R$ 0,00</strong>)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[9px] uppercase tracking-wider text-stone-400 font-bold block">
                Total Marmita
              </span>
              <span className="text-base font-black text-[#0EB24A] font-['Outfit']">
                R$ {priceDetails.unitPrice.toFixed(2).replace('.', ',')}
              </span>
            </div>

            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-800 border border-amber-300 flex items-center gap-1">
              <Award className="w-3 h-3 text-amber-600" /> +{pointsEarned} pts
            </span>
          </div>
        </div>

        {/* Progress Step Bar */}
        <div className="px-4 sm:px-6 pt-3 pb-1 bg-stone-50 border-b border-stone-200">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-black uppercase tracking-wider text-stone-700 font-['Outfit']">
              Etapa {currentStep} de 8: {stepsList[currentStep - 1].title}
            </span>
            <span className="text-[10px] text-stone-400 font-semibold">
              {Math.round((currentStep / 8) * 100)}% concluído
            </span>
          </div>
          <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#0EB24A] h-full transition-all duration-300 rounded-full"
              style={{ width: `${(currentStep / 8) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* ETAPA 1: ESCOLHA A LINHA */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="text-center max-w-md mx-auto mb-2">
                <h3 className="text-base sm:text-lg font-black text-stone-900 font-['Outfit']">
                  Escolha a Linha da sua Marmita
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Cada linha possui receitas exclusivas preparadas por nossos nutricionistas e chefs.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Linha FIT */}
                <div
                  onClick={() => setSelectedLine('fit')}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                    selectedLine === 'fit'
                      ? 'border-[#0EB24A] bg-emerald-50/50 shadow-md ring-2 ring-emerald-400/20'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#0EB24A] text-white">
                      Linha Fit Oficial
                    </span>
                    {selectedLine === 'fit' && (
                      <div className="w-5 h-5 rounded-full bg-[#0EB24A] text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                  <h4 className="font-black text-base text-stone-900 font-['Outfit']">
                    Cardápio Fit
                  </h4>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                    Frango grelhado em tiras, patinho bovino magro, tilápia, almôndegas artesanais e sardinha fresca.
                  </p>
                  <div className="mt-4 pt-3 border-t border-stone-200 flex items-baseline justify-between">
                    <span className="text-[11px] text-stone-500">A partir de:</span>
                    <span className="font-black text-lg text-stone-900 font-['Outfit']">
                      R$ {getBasePrice(pricing, 'fit', '350g').toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>

                {/* Linha FIT PREMIUM */}
                <div
                  onClick={() => setSelectedLine('fit_premium')}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                    selectedLine === 'fit_premium'
                      ? 'border-amber-500 bg-amber-50/50 shadow-md ring-2 ring-amber-400/20'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500 text-stone-950">
                      Gourmet Nobre
                    </span>
                    {selectedLine === 'fit_premium' && (
                      <div className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                  <h4 className="font-black text-base text-stone-900 font-['Outfit']">
                    Cardápio Fit Premium
                  </h4>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                    Lombo de salmão, alcatra nobre macia, camarões rosa, lascas de bacalhau e fricassê especial.
                  </p>
                  <div className="mt-4 pt-3 border-t border-stone-200 flex items-baseline justify-between">
                    <span className="text-[11px] text-stone-500">A partir de:</span>
                    <span className="font-black text-lg text-stone-900 font-['Outfit']">
                      R$ {getBasePrice(pricing, 'fit_premium', '350g').toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ETAPA 2: ESCOLHA O TAMANHO */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="text-center max-w-md mx-auto mb-2">
                <h3 className="text-base sm:text-lg font-black text-stone-900 font-['Outfit']">
                  Escolha o Tamanho da Refeição
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Preço oficial atualizado instantaneamente conforme tabela da marca.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 350g */}
                <div
                  onClick={() => setSelectedSize('350g')}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                    selectedSize === '350g'
                      ? 'border-[#0EB24A] bg-emerald-50/50 shadow-md ring-2 ring-emerald-400/20'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-black text-xl text-stone-900 font-['Outfit']">
                      350g
                    </span>
                    {selectedSize === '350g' && (
                      <div className="w-5 h-5 rounded-full bg-[#0EB24A] text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-stone-600">
                    Ideal para refeições equilibradas no dia a dia com aporte proteico padrão.
                  </p>
                  <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between">
                    <span className="text-[10px] text-stone-400 uppercase font-bold">Preço Oficial</span>
                    <span className="text-lg font-black text-[#0EB24A] font-['Outfit']">
                      R$ {getBasePrice(pricing, selectedLine, '350g').toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>

                {/* 500g */}
                <div
                  onClick={() => setSelectedSize('500g')}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                    selectedSize === '500g'
                      ? 'border-[#0EB24A] bg-emerald-50/50 shadow-md ring-2 ring-emerald-400/20'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-xl text-stone-900 font-['Outfit']">
                        500g
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-amber-100 text-amber-900">
                        Hipertrofia
                      </span>
                    </div>
                    {selectedSize === '500g' && (
                      <div className="w-5 h-5 rounded-full bg-[#0EB24A] text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-stone-600">
                    Porção reforçada com dose extra de proteína e carboidrato para alta performance.
                  </p>
                  <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between">
                    <span className="text-[10px] text-stone-400 uppercase font-bold">Preço Oficial</span>
                    <span className="text-lg font-black text-[#0EB24A] font-['Outfit']">
                      R$ {getBasePrice(pricing, selectedLine, '500g').toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ETAPA 3: ESCOLHA A PROTEÍNA */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base sm:text-lg font-black text-stone-900 font-['Outfit']">
                  Escolha a Proteína ({selectedLine === 'fit_premium' ? 'Linha Premium' : 'Linha Fit'})
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Trocar de proteína na mesma linha tem <strong>CUSTO ZERO (+ R$ 0,00)</strong>!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {proteinOptions.map((prot) => (
                  <div
                    key={prot.id}
                    onClick={() => setSelectedProtein(prot)}
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                      selectedProtein?.id === prot.id
                        ? 'border-[#0EB24A] bg-emerald-50/50 shadow-sm ring-1 ring-emerald-400/20'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-stone-900 leading-snug">
                        {prot.name}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-stone-500 mt-1">
                        <span>{prot.calories} kcal</span>
                        <span>•</span>
                        <span className="text-emerald-600 font-bold">{prot.protein_grams}g proteína</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase text-[#0EB24A] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Incluído
                      </span>
                      {selectedProtein?.id === prot.id && (
                        <div className="w-5 h-5 rounded-full bg-[#0EB24A] text-white flex items-center justify-center">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ETAPA 4: ESCOLHA O CARBOIDRATO */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base sm:text-lg font-black text-stone-900 font-['Outfit']">
                  Escolha o Carboidrato Complexo
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Carboidratos de baixo índice glicêmico ou opção Low Carb (Vegetais em dobro).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {carbOptions.map((carb) => (
                  <div
                    key={carb.id}
                    onClick={() => setSelectedCarb(carb)}
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                      selectedCarb?.id === carb.id
                        ? 'border-[#0EB24A] bg-emerald-50/50 shadow-sm ring-1 ring-emerald-400/20'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-stone-900 leading-snug">
                        {carb.name}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-stone-500 mt-1">
                        <span>{carb.calories} kcal</span>
                        <span>•</span>
                        <span>{carb.carbs_grams}g carbo</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase text-[#0EB24A] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Incluído
                      </span>
                      {selectedCarb?.id === carb.id && (
                        <div className="w-5 h-5 rounded-full bg-[#0EB24A] text-white flex items-center justify-center">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ETAPA 5: ESCOLHA OS VEGETAIS */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base sm:text-lg font-black text-stone-900 font-['Outfit']">
                  Escolha os Vegetais Frescos
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Selecione de 1 a 3 opções inclusas sem alteração no preço base! ({selectedVeggies.length}/3 selecionados)
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {veggieOptions.map((veg) => {
                  const isChecked = selectedVeggies.some((v) => v.id === veg.id);
                  return (
                    <div
                      key={veg.id}
                      onClick={() => handleToggleVeggie(veg)}
                      className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                        isChecked
                          ? 'border-[#0EB24A] bg-emerald-50/50 shadow-sm ring-1 ring-emerald-400/20'
                          : 'border-stone-200 bg-white hover:border-stone-300'
                      }`}
                    >
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-stone-900 leading-snug">
                          {veg.name}
                        </h4>
                        <span className="text-[10px] text-stone-500 mt-0.5 block">
                          {veg.calories} kcal · Fibras e Vitaminas
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase text-[#0EB24A] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Incluído
                        </span>
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                          isChecked ? 'bg-[#0EB24A] border-[#0EB24A] text-white' : 'border-stone-300 bg-white'
                        }`}>
                          {isChecked && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ETAPA 6: ADICIONAIS PAGOS (Regra Estrita: Apenas aqui pode haver aumento de preço) */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base sm:text-lg font-black text-stone-900 font-['Outfit']">
                  Adicionais Pagos (Opcionais)
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Conforme a Regra Oficial, <strong>somente adicionais explícitos alteram o valor final</strong>.
                </p>
              </div>

              {/* Equação visual da regra de preços */}
              <div className="bg-white p-3.5 rounded-2xl border border-stone-200 text-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-bold block">Preço Base</span>
                  <span className="font-black text-stone-800">
                    R$ {priceDetails.basePrice.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <span className="text-stone-400 font-bold">+</span>
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-bold block">Adicionais</span>
                  <span className="font-black text-amber-600">
                    R$ {priceDetails.addonsPrice.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <span className="text-stone-400 font-bold">=</span>
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-bold block">Total Marmita</span>
                  <span className="font-black text-[#0EB24A]">
                    R$ {priceDetails.unitPrice.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              <div className="space-y-2.5">
                {paidAddonOptions.map((addon) => {
                  const isChecked = selectedPaidAddons.some((a) => a.id === addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => handleTogglePaidAddon(addon)}
                      className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                        isChecked
                          ? 'border-amber-500 bg-amber-50/50 shadow-sm'
                          : 'border-stone-200 bg-white hover:border-stone-300'
                      }`}
                    >
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-stone-900 leading-snug">
                          {addon.name}
                        </h4>
                        <span className="text-[10px] text-stone-500 mt-0.5 block">
                          +{addon.calories} kcal
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-black text-xs text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                          + R$ {addon.extraPrice.toFixed(2).replace('.', ',')}
                        </span>
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                          isChecked ? 'bg-amber-500 border-amber-500 text-stone-950' : 'border-stone-300 bg-white'
                        }`}>
                          {isChecked && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Observação especial do cliente */}
              <div className="pt-2">
                <label className="text-[11px] font-bold text-stone-600 block mb-1">
                  Observações para a Cozinha (Opcional):
                </label>
                <input
                  type="text"
                  placeholder="Ex: sem cebola, molho separado..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          {/* ETAPA 7: REVISÃO COMPLETA */}
          {currentStep === 7 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base sm:text-lg font-black text-stone-900 font-['Outfit']">
                  Revisão da sua Marmita
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Confira a composição nutricional e o resumo oficial do prato.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-stone-200 p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      selectedLine === 'fit_premium' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                    }`}>
                      {selectedLine === 'fit_premium' ? 'Linha Fit Premium' : 'Linha Fit'}
                    </span>
                    <h4 className="font-black text-stone-900 font-['Outfit'] text-sm mt-1">
                      Marmita Personalizada ({selectedSize})
                    </h4>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-800 border border-amber-300">
                    +{pointsEarned} Points
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-stone-700">
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-stone-400 w-24 shrink-0">Proteína:</span>
                    <span className="font-semibold text-stone-900">{selectedProtein?.name}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-stone-400 w-24 shrink-0">Carboidrato:</span>
                    <span className="font-semibold text-stone-900">{selectedCarb?.name}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-stone-400 w-24 shrink-0">Vegetais:</span>
                    <span className="font-semibold text-stone-900">
                      {selectedVeggies.map((v) => v.name).join(', ')}
                    </span>
                  </div>
                  {selectedPaidAddons.length > 0 && (
                    <div className="flex items-start gap-2">
                      <span className="font-bold text-stone-400 w-24 shrink-0">Adicionais:</span>
                      <span className="font-semibold text-amber-800">
                        {selectedPaidAddons.map((a) => `${a.name} (+R$ ${a.extraPrice.toFixed(2)})`).join(', ')}
                      </span>
                    </div>
                  )}
                  {notes.trim() && (
                    <div className="flex items-start gap-2">
                      <span className="font-bold text-stone-400 w-24 shrink-0">Obs:</span>
                      <span className="text-stone-600 italic">"{notes}"</span>
                    </div>
                  )}
                </div>

                {/* Discriminação de Preço Oficial */}
                <div className="pt-3 border-t border-stone-100 space-y-1 text-xs">
                  <div className="flex justify-between text-stone-600">
                    <span>Preço Base ({selectedLine.toUpperCase()} · {selectedSize}):</span>
                    <span>R$ {priceDetails.basePrice.toFixed(2).replace('.', ',')}</span>
                  </div>
                  {priceDetails.addonsPrice > 0 && (
                    <div className="flex justify-between text-amber-700 font-semibold">
                      <span>Adicionais Pagos:</span>
                      <span>+ R$ {priceDetails.addonsPrice.toFixed(2).replace('.', ',')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-black text-stone-950 font-['Outfit'] pt-1 border-t border-stone-100">
                    <span>Total Unitário:</span>
                    <span className="text-[#0EB24A]">
                      R$ {priceDetails.unitPrice.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ETAPA 8: CONFIRMAÇÃO & ADICIONAR AO CARRINHO */}
          {currentStep === 8 && (
            <div className="space-y-4 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#0EB24A] flex items-center justify-center mx-auto shadow-sm">
                <UtensilsCrossed className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-stone-900 font-['Outfit']">
                  Marmita Pronta para o Carrinho!
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
                  Sua refeição personalizada foi montada com os padrões de alta densidade nutricional da MerMi Fit Life.
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-stone-200 max-w-sm mx-auto text-left space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-600">Subtotal da Marmita:</span>
                  <span className="font-black text-base text-[#0EB24A] font-['Outfit']">
                    R$ {priceDetails.unitPrice.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-amber-800 bg-amber-50 p-2 rounded-xl border border-amber-200">
                  <span className="flex items-center gap-1 font-bold">
                    <Award className="w-3.5 h-3.5" /> Pontos Ganhos:
                  </span>
                  <span className="font-black">+{pointsEarned} MerMi Points</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Actions */}
        <div className="bg-white p-4 sm:p-5 border-t border-stone-200 flex items-center justify-between gap-3">
          {currentStep > 1 ? (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-4 py-2.5 rounded-xl border border-stone-300 text-xs font-black uppercase tracking-wider text-stone-700 hover:bg-stone-50 flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Voltar
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-stone-300 text-xs font-black uppercase tracking-wider text-stone-500 hover:bg-stone-50 cursor-pointer"
            >
              Cancelar
            </button>
          )}

          {currentStep < 8 ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-[#0EB24A] hover:bg-emerald-600 text-white flex items-center gap-1.5 shadow-sm cursor-pointer ml-auto"
            >
              <span>{currentStep === 7 ? 'Avançar para Adicionar' : 'Próxima Etapa'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleAddToCartConfirm}
              className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-[#0EB24A] hover:bg-emerald-600 text-white flex items-center gap-1.5 shadow-md cursor-pointer ml-auto"
            >
              <Plus className="w-4 h-4" /> Adicionar ao Carrinho
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
