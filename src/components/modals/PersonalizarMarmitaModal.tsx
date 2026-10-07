import React, { useState } from 'react';
import { Modal } from '../../design-system/components/Feedback';
import { PrimaryButton, OutlineButton } from '../../design-system/components/Button';
import { MetricNumber } from '../../design-system/components/Typography';
import { Check, ArrowRight, ArrowLeft, Plus, Sparkles, Award } from 'lucide-react';
import { MarmitaCategory, MarmitaSize } from '../../types';

export interface PersonalizacaoState {
  category: MarmitaCategory;
  size: MarmitaSize;
  protein: string;
  carb: string;
  veggies: string[];
  extras: { id: string; name: string; price: number }[];
}

interface PersonalizarMarmitaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (customItem: {
    title: string;
    category: MarmitaCategory;
    size: MarmitaSize;
    totalPrice: number;
    pointsEarned: number;
    summary: string;
  }) => void;
  initialCategory?: MarmitaCategory;
  initialSize?: MarmitaSize;
}

export const PersonalizarMarmitaModal: React.FC<PersonalizarMarmitaModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialCategory = 'fit',
  initialSize = '350g'
}) => {
  const [step, setStep] = useState<number>(1);
  const [category, setCategory] = useState<MarmitaCategory>(initialCategory);
  const [size, setSize] = useState<MarmitaSize>(initialSize);
  const [protein, setProtein] = useState<string>('Peito de Frango Grelhado em Tiras');
  const [carb, setCarb] = useState<string>('Arroz Integral com Linhaça');
  const [veggies, setVeggies] = useState<string[]>(['Brócolis no Vapor', 'Cenoura Glaceada']);
  const [extras, setExtras] = useState<{ id: string; name: string; price: number }[]>([]);

  // Tabela de Preços Oficiais da Marca (BLOCO 02, Seção 13):
  // Fit 350g: R$ 19,90 | 500g: R$ 24,90
  // Fit Premium 350g: R$ 32,90 | 500g: R$ 39,90
  const getBasePrice = (cat: MarmitaCategory, sz: MarmitaSize) => {
    if (cat === 'fit') {
      return sz === '350g' ? 19.90 : 24.90;
    } else {
      return sz === '350g' ? 32.90 : 39.90;
    }
  };

  const basePrice = getBasePrice(category, size);
  const extrasTotal = extras.reduce((sum, item) => sum + item.price, 0);
  const finalPrice = basePrice + extrasTotal;
  const pointsEarned = category === 'fit_premium' ? 25 : 15;

  // Options catalogues
  const PROTEIN_OPTIONS = category === 'fit' ? [
    'Peito de Frango Grelhado em Tiras (Incluído)',
    'Patinho Moído Magro com Ervas Finas (Incluído)',
    'Ovos Cozidos Caipiras com Páprica (Incluído)',
    'Tofu Marinado Orgânico (Vegano, Incluído)'
  ] : [
    'Mignon em Tiras ao Molho Roti Artesanal (Incluído)',
    'Salmão Grelhado com Raspas de Limão Siciliano (Incluído)',
    'Tilápia Crocante com Ervas & Azeite Extra Virgem (Incluído)',
    'Camarão Rosa Salteado no Alho Poró (Incluído)'
  ];

  const CARB_OPTIONS = [
    'Arroz Integral com Linhaça Dourada (Incluído)',
    'Batata Doce Assada com Alecrim (Incluído)',
    'Purê de Mandioquinha Leve (Incluído)',
    'Quinoa Real em Grãos com Cúrcuma (Incluído)',
    'Low Carb: Sem Carboidrato (+ Vegetais Duplos)'
  ];

  const VEGGIES_OPTIONS = [
    'Brócolis Ninja no Vapor',
    'Cenoura Glaceada com Gergelim',
    'Abobrinha Italiana Salteada',
    'Mix de Vagem Francesa & Tomate Cereja',
    'Couve-flor Gratinada com Levedura Nutricional'
  ];

  const EXTRAS_PAID_OPTIONS = [
    { id: 'ext_egg', name: 'Ovo Caipira Extra', price: 3.50 },
    { id: 'ext_castanhas', name: 'Mix de Castanhas & Sementes Crocantes', price: 4.90 },
    { id: 'ext_molho', name: 'Molho Especial de Mostarda & Mel Fit', price: 3.90 },
    { id: 'ext_whey', name: 'Porção Extra de Proteína (+70g)', price: 7.90 }
  ];

  const toggleVeggie = (v: string) => {
    if (veggies.includes(v)) {
      if (veggies.length > 1) {
        setVeggies(veggies.filter(item => item !== v));
      }
    } else {
      if (veggies.length < 3) {
        setVeggies([...veggies, v]);
      }
    }
  };

  const toggleExtra = (extra: { id: string; name: string; price: number }) => {
    if (extras.some(e => e.id === extra.id)) {
      setExtras(extras.filter(e => e.id !== extra.id));
    } else {
      setExtras([...extras, extra]);
    }
  };

  const handleFinish = () => {
    onSuccess({
      title: `Marmita Personalizada ${category === 'fit_premium' ? 'Premium' : 'Fit'} (${size})`,
      category,
      size,
      totalPrice: finalPrice,
      pointsEarned,
      summary: `${protein} · ${carb} · ${veggies.join(', ')}${extras.length > 0 ? ` + ${extras.map(e => e.name).join(', ')}` : ''}`
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Montar Marmita · Etapa ${step} de 8`}
      maxWidth="max-w-xl"
    >
      <div className="space-y-5">
        
        {/* Step indicator */}
        <div className="flex items-center justify-between text-xs font-bold text-stone-500 border-b border-stone-200 pb-2">
          <span>
            {step === 1 && '1. Escolha a Linha'}
            {step === 2 && '2. Escolha o Tamanho'}
            {step === 3 && '3. Escolha a Proteína'}
            {step === 4 && '4. Escolha o Carboidrato'}
            {step === 5 && '5. Escolha os Vegetais (até 3)'}
            {step === 6 && '6. Adicionais Pagos (Opcional)'}
            {step === 7 && '7. Revisar Personalização'}
            {step === 8 && '8. Confirmar & Adicionar'}
          </span>
          <span className="font-['Outfit'] text-[#0EB24A] font-black">+{pointsEarned} pts</span>
        </div>

        {/* STEP 1: LINHA */}
        {step === 1 && (
          <div className="space-y-3">
            <p className="text-xs text-stone-600">Selecione o padrão de ingredientes do seu prato:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setCategory('fit')}
                className={`p-4 rounded-2xl border-2 text-left cursor-pointer transition-all ${
                  category === 'fit'
                    ? 'border-[#0EB24A] bg-emerald-50/50 shadow-md'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Praticidade Diária
                </span>
                <h4 className="font-black text-lg text-stone-900 font-['Outfit'] uppercase mt-2">
                  Linha Fit
                </h4>
                <p className="text-xs text-stone-500 mt-1">
                  Frangos, patinho moído, ovos, leguminosas e vegetais nobres.
                </p>
                <p className="text-xs font-extrabold text-[#0EB24A] mt-2">
                  A partir de R$ 19,90
                </p>
              </button>

              <button
                type="button"
                onClick={() => setCategory('fit_premium')}
                className={`p-4 rounded-2xl border-2 text-left cursor-pointer transition-all ${
                  category === 'fit_premium'
                    ? 'border-amber-400 bg-amber-50/50 shadow-md'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-200 px-2 py-0.5 rounded-full">
                  Alta Gastronomia
                </span>
                <h4 className="font-black text-lg text-stone-900 font-['Outfit'] uppercase mt-2">
                  Linha Fit Premium
                </h4>
                <p className="text-xs text-stone-500 mt-1">
                  Mignon ao molho roti, salmão grelhado, tilápia fresca e camarão rosa.
                </p>
                <p className="text-xs font-extrabold text-amber-600 mt-2">
                  A partir de R$ 32,90
                </p>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: TAMANHO */}
        {step === 2 && (
          <div className="space-y-3">
            <p className="text-xs text-stone-600">Selecione o tamanho ideal para sua meta nutricional:</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSize('350g')}
                className={`p-4 rounded-2xl border-2 text-center cursor-pointer transition-all ${
                  size === '350g'
                    ? 'border-[#0EB24A] bg-emerald-50/50 shadow-md'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <span className="text-3xl font-black font-['Outfit'] text-stone-900 block">350g</span>
                <span className="text-xs font-bold text-stone-500 uppercase mt-1 block">Porção Padrão</span>
                <span className="text-sm font-black text-[#0EB24A] mt-2 block">
                  R$ {getBasePrice(category, '350g').toFixed(2).replace('.', ',')}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSize('500g')}
                className={`p-4 rounded-2xl border-2 text-center cursor-pointer transition-all ${
                  size === '500g'
                    ? 'border-[#0EB24A] bg-emerald-50/50 shadow-md'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <span className="text-3xl font-black font-['Outfit'] text-stone-900 block">500g</span>
                <span className="text-xs font-bold text-stone-500 uppercase mt-1 block">Porção Monster</span>
                <span className="text-sm font-black text-[#0EB24A] mt-2 block">
                  R$ {getBasePrice(category, '500g').toFixed(2).replace('.', ',')}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PROTEÍNA */}
        {step === 3 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-stone-600">
              <span>Escolha 1 proteína:</span>
              <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                Sem custo adicional
              </span>
            </div>
            <div className="space-y-2">
              {PROTEIN_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setProtein(opt)}
                  className={`w-full p-3 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                    protein === opt
                      ? 'border-[#0EB24A] bg-emerald-50 text-stone-900'
                      : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <span>{opt}</span>
                  {protein === opt && <Check className="w-4 h-4 text-[#0EB24A]" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: CARBOIDRATO */}
        {step === 4 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-stone-600">
              <span>Escolha 1 carboidrato saudável:</span>
              <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                Sem custo adicional
              </span>
            </div>
            <div className="space-y-2">
              {CARB_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setCarb(opt)}
                  className={`w-full p-3 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                    carb === opt
                      ? 'border-[#0EB24A] bg-emerald-50 text-stone-900'
                      : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <span>{opt}</span>
                  {carb === opt && <Check className="w-4 h-4 text-[#0EB24A]" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5: VEGETAIS */}
        {step === 5 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-stone-600">
              <span>Escolha de 1 a 3 vegetais frescos:</span>
              <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                {veggies.length}/3 Selecionados
              </span>
            </div>
            <div className="space-y-2">
              {VEGGIES_OPTIONS.map((v) => {
                const isSelected = veggies.includes(v);
                return (
                  <button
                    key={v}
                    type="button"
                    onClick={() => toggleVeggie(v)}
                    className={`w-full p-3 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'border-[#0EB24A] bg-emerald-50 text-stone-900'
                        : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <span>{v}</span>
                    {isSelected && <Check className="w-4 h-4 text-[#0EB24A]" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 6: EXTRAS PAGOS */}
        {step === 6 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-stone-600">
              <span>Turbine sua marmita (opcional):</span>
              <span className="text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded-full">
                Adicionais Pagos
              </span>
            </div>
            <div className="space-y-2">
              {EXTRAS_PAID_OPTIONS.map((ext) => {
                const isSelected = extras.some(e => e.id === ext.id);
                return (
                  <button
                    key={ext.id}
                    type="button"
                    onClick={() => toggleExtra(ext)}
                    className={`w-full p-3 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'border-amber-400 bg-amber-50 text-stone-900'
                        : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <span>{ext.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-[#0EB24A]">
                        + R$ {ext.price.toFixed(2).replace('.', ',')}
                      </span>
                      {isSelected ? (
                        <Check className="w-4 h-4 text-[#0EB24A]" />
                      ) : (
                        <Plus className="w-4 h-4 text-stone-400" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 7: REVISÃO */}
        {step === 7 && (
          <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-3 text-xs">
            <h4 className="font-black text-sm text-stone-900 font-['Outfit'] uppercase">
              Resumo da Marmita Montada
            </h4>
            <div className="space-y-1.5 text-stone-700">
              <p><strong>Linha:</strong> {category === 'fit_premium' ? 'Fit Premium' : 'Fit'} ({size})</p>
              <p><strong>Proteína:</strong> {protein}</p>
              <p><strong>Carboidrato:</strong> {carb}</p>
              <p><strong>Vegetais:</strong> {veggies.join(', ')}</p>
              {extras.length > 0 && (
                <p><strong>Adicionais:</strong> {extras.map(e => `${e.name} (+R$ ${e.price.toFixed(2)})`).join(', ')}</p>
              )}
            </div>
          </div>
        )}

        {/* STEP 8: CONFIRMAÇÃO */}
        {step === 8 && (
          <div className="text-center py-4 space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#0EB24A] flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="font-black text-base text-stone-900 font-['Outfit'] uppercase">
              Tudo Pronto Para Adicionar!
            </h4>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Sua marmita será preparada fresca, balanceada nutricionalmente e embalada com selagem a vácuo de alta tecnologia.
            </p>
          </div>
        )}

        {/* Footer com Preço Base + Adicionais = Total (Conforme Seção 14) */}
        <div className="pt-3 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-left w-full sm:w-auto">
            <div className="text-[10px] text-stone-400 font-bold uppercase">
              Base: R$ {basePrice.toFixed(2).replace('.', ',')} {extrasTotal > 0 && `+ Extras: R$ ${extrasTotal.toFixed(2).replace('.', ',')}`}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-stone-500 uppercase">Total:</span>
              <MetricNumber
                value={finalPrice.toFixed(2).replace('.', ',')}
                prefix="R$"
                highlightColor="text-[#0EB24A]"
                size="md"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {step > 1 && (
              <OutlineButton
                size="sm"
                onClick={() => setStep(step - 1)}
                leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
              >
                Voltar
              </OutlineButton>
            )}

            {step < 8 ? (
              <PrimaryButton
                size="sm"
                onClick={() => setStep(step + 1)}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Próximo
              </PrimaryButton>
            ) : (
              <PrimaryButton
                size="sm"
                onClick={handleFinish}
                rightIcon={<Check className="w-3.5 h-3.5" />}
              >
                Adicionar ao Carrinho
              </PrimaryButton>
            )}
          </div>
        </div>

      </div>
    </Modal>
  );
};
