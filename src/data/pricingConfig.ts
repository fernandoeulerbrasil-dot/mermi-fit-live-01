import { CustomizationOption, MarmitaPricing, MarmitaProduct } from '../types';

/**
 * REGRAS OFICIAIS DE PRECIFICAÇÃO - BLOCO 01
 * 
 * Cardápio Fit:
 *  350g = R$ 19,90
 *  500g = R$ 24,90
 * 
 * Cardápio Fit Premium:
 *  350g = R$ 32,90
 *  500g = R$ 39,90
 * 
 * REGRA IMPORTANTE:
 * A personalização básica (proteína, carboidrato, legumes, verduras, sementes)
 * NÃO altera automaticamente o preço base.
 * O preço apenas muda com seleção de tamanho maior (500g) ou adicionais extras explícitos.
 */

export const INITIAL_PRICING: MarmitaPricing[] = [
  {
    category: 'fit',
    categoryName: 'Cardápio Fit',
    size: '350g',
    price: 19.90,
  },
  {
    category: 'fit',
    categoryName: 'Cardápio Fit',
    size: '500g',
    price: 24.90,
  },
  {
    category: 'fit_premium',
    categoryName: 'Cardápio Fit Premium',
    size: '350g',
    price: 32.90,
  },
  {
    category: 'fit_premium',
    categoryName: 'Cardápio Fit Premium',
    size: '500g',
    price: 39.90,
  },
];

export const OFFICIAL_PRODUCTS: MarmitaProduct[] = [
  {
    id: 'prod_fit_frango',
    name: 'Frango Grelhado com Ervas & Batata Doce',
    description: 'Peito de frango selecionado marinado em ervas finas, cubos de batata doce assada e brócolis ao vapor.',
    category: 'fit',
    baseCalories350g: 380,
    baseProtein350g: 38,
    baseCarbs350g: 42,
    tags: ['Mais Pedido', 'Alto Teor Proteico', 'Equilibrado']
  },
  {
    id: 'prod_fit_patinho',
    name: 'Patinho Moído Especial com Arroz Integral',
    description: 'Carne magra de patinho temperada com cebola roxa e cheiro verde, arroz integral soltinho e cenouras glaceadas.',
    category: 'fit',
    baseCalories350g: 410,
    baseProtein350g: 40,
    baseCarbs350g: 45,
    tags: ['Energia Pura', 'Foco & Ganho', 'Fibras']
  },
  {
    id: 'prod_fit_tilapia',
    name: 'Filé de Tilápia com Purê de Mandioquinha',
    description: 'Tilápia grelhada no azeite extravirgem com crosta de gergelim, purê rústico de mandioquinha e abobrinha salteada.',
    category: 'fit',
    baseCalories350g: 350,
    baseProtein350g: 35,
    baseCarbs350g: 36,
    tags: ['Digestão Leve', 'Ômega 3', 'Baixo Sódio']
  },
  {
    id: 'prod_premium_salmon',
    name: 'Salmão Grelhado ao Molho de Maracujá & Quinoa Real',
    description: 'Lombo nobre de salmão com redução cítrica natural, mix de quinoa tricolor e aspargos verdes grelhados.',
    category: 'fit_premium',
    baseCalories350g: 460,
    baseProtein350g: 44,
    baseCarbs350g: 30,
    tags: ['Linha Premium', 'Gourmet Fit', 'Super Alimento']
  },
  {
    id: 'prod_premium_mignon',
    name: 'Medalhão de Mignon ao Molho de Cogumelos & Risoto Fit',
    description: 'Filé mignon de corte nobre com cogumelos frescos Paris e Shimeji, acompanhado de risoto fit de couve-flor e castanhas.',
    category: 'fit_premium',
    baseCalories350g: 480,
    baseProtein350g: 46,
    baseCarbs350g: 22,
    tags: ['Linha Premium', 'Low Carb Nobre', 'Sabor Exclusivo']
  },
  {
    id: 'prod_premium_camarao',
    name: 'Camarão Rosa Salteado com Espaguete de Pupunha',
    description: 'Camarões rosa salteados com alho-poró e azeite de ervas, sobre fios de palmito pupunha fresco e tomatinhos confit.',
    category: 'fit_premium',
    baseCalories350g: 330,
    baseProtein350g: 36,
    baseCarbs350g: 18,
    tags: ['Linha Premium', 'Ultra Leve', 'Cozinha Autoral']
  }
];

export const CUSTOMIZATION_OPTIONS: CustomizationOption[] = [
  // Proteínas (sem custo adicional no mesmo cardápio)
  { id: 'prot_frango', name: 'Peito de Frango em Cubos Grelhado', category: 'proteina', extraPrice: 0, calories: 165 },
  { id: 'prot_patinho', name: 'Patinho Moído Magro Selecionado', category: 'proteina', extraPrice: 0, calories: 180 },
  { id: 'prot_tilapia', name: 'Filé de Tilápia no Azeite de Ervas', category: 'proteina', extraPrice: 0, calories: 150 },
  { id: 'prot_tofu', name: 'Tofu Orgânico Defumado e Selado', category: 'proteina', extraPrice: 0, calories: 130 },

  // Carboidratos (sem custo adicional)
  { id: 'carb_batatadoce', name: 'Batata Doce Assada com Alecrim', category: 'carboidrato', extraPrice: 0, calories: 120 },
  { id: 'carb_arrozint', name: 'Arroz Integral Cateto com Linhaça', category: 'carboidrato', extraPrice: 0, calories: 135 },
  { id: 'carb_mandioca', name: 'Mandioca Cozida ao Vapor', category: 'carboidrato', extraPrice: 0, calories: 140 },
  { id: 'carb_quinoa', name: 'Quinoa Real em Grãos', category: 'carboidrato', extraPrice: 0, calories: 110 },
  { id: 'carb_lowcarb', name: 'Zero Carbo (Substituir por Legumes)', category: 'carboidrato', extraPrice: 0, calories: 35 },

  // Legumes
  { id: 'leg_brocolis', name: 'Brócolis Americano no Vapor', category: 'legumes', extraPrice: 0, calories: 30 },
  { id: 'leg_cenoura', name: 'Cenoura Baby Glaceada', category: 'legumes', extraPrice: 0, calories: 35 },
  { id: 'leg_abobrinha', name: 'Abobrinha Italiana Grelhada', category: 'legumes', extraPrice: 0, calories: 25 },
  { id: 'leg_vagem', name: 'Vagem Macarrão Fresca', category: 'legumes', extraPrice: 0, calories: 28 },

  // Verduras
  { id: 'verd_espinafre', name: 'Espinafre Refogado no Alho', category: 'verduras', extraPrice: 0, calories: 22 },
  { id: 'verd_couve', name: 'Couve Manteiga Fatiada Fininha', category: 'verduras', extraPrice: 0, calories: 26 },

  // Sementes & Toppings
  { id: 'sem_chia', name: 'Sementes de Chia & Girassol', category: 'sementes', extraPrice: 0, calories: 25 },
  { id: 'sem_gergelim', name: 'Mix de Gergelim Branco e Preto Tostado', category: 'sementes', extraPrice: 0, calories: 30 },

  // Extras Especiais (Regra: Apenas extras marcados com valor alteram o preço)
  { id: 'ext_molho_mostarda', name: 'Molho Especial de Mostarda & Mel Fit (40ml)', category: 'extras', extraPrice: 3.50, calories: 45 },
  { id: 'ext_ovo_caipira', name: 'Ovo Caipira Poché Adicional', category: 'extras', extraPrice: 4.00, calories: 75 },
  { id: 'ext_queijo_minas', name: 'Cubinhos de Queijo Minas Frescal Light (50g)', category: 'extras', extraPrice: 5.50, calories: 90 },
];
