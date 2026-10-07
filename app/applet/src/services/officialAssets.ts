/**
 * MERMI FIT LIFE — OFFICIAL ASSETS REGISTRY
 * 
 * Regra Absoluta:
 * - Assets oficiais são IMUTÁVEIS (official = true, immutable = true).
 * - Não redesenhar, não recriar com texto, não gerar com IA, não usar emojis como substitutos.
 * - Usar exclusivamente os arquivos originais fornecidos pelo proprietário.
 */

export const OFFICIAL_ASSET = {
  // Logo Oficial MerMi Fit Life (Emblema circular branco com borda gradiente, mascotes maçã e tigela)
  mermi_logo_png: '/assets/brand/mermi-logo.png',
  mermi_logo_512: '/assets/brand/mermi-logo-512.png',
  mermi_logo_jpg: '/assets/brand/mermi-logo.jpg',

  // MerMi IA Oficial (Robô futurista branco com anéis neon verdes e visor preto com olhos sorridentes)
  mermi_ai_official_png: '/assets/brand/mermi_ai_official.png',
  mermi_ai_original_file: 'file_00000000e860820e90b97bd246881e99.png',

  // MerMi Points Oficial (Emblema 3D "MERMI" em bloco e "POINTS" dourado)
  mermi_points_square: '/assets/mermi-points/mermi-points-square-trans.png',
  mermi_points_horizontal: '/assets/mermi-points/mermi-points-horizontal-trans.png',
  mermi_points_badge: '/assets/images/mermi_points_badge_1790189713117.png',

  // Cartazes & Campanhas Oficiais (Bloco 03)
  posters: {
    o_problema_02: '/assets/posters/cartaz_02_o_problema.png',
    a_solucao_03: '/assets/posters/cartaz_03_a_solucao.png',
    cardapio_fit_05: '/assets/posters/cartaz_05_cardapio_fit.png',
    mermi_points_06: '/assets/posters/cartaz_06_mermi_points.png',
    drop_surpresa_07: '/assets/posters/cartaz_07_drop_surpresa.png',
    recompensas_08: '/assets/posters/cartaz_08_recompensas.png',
    teaser_esta_chegando: '/assets/posters/cartaz_teaser_esta_chegando.png',
  },

  // Cardápios e Planos Oficiais (Pastas Oficiais Imutáveis — Proteção Absoluta contra edição ou recriação IA)
  cardapios: {
    linha_fit_dir: '/assets/cardapios/linha-fit',
    linha_fit_premium_dir: '/assets/cardapios/linha-fit-premium',
    planos_dir: '/assets/cardapios/planos',
  }
} as const;

export type OfficialAssetKey = keyof typeof OFFICIAL_ASSET;
