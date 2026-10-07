/**
 * MERMI FIT LIFE — OFFICIAL ASSET REGISTRY & PATHS
 * 
 * Regra Absoluta:
 * - Assets oficiais são imutáveis (oficial = true, imutável = true).
 * - Caminhos exatos para o diretório public e assets oficiais fornecidos pelo proprietário.
 * - Centraliza as referências únicas para evitar qualquer recriação por IA.
 */

export const OFFICIAL_ASSET = {
  // Master Brand Logos
  mermi_logo_png: '/assets/brand/mermi-logo.png',
  mermi_logo_1024: '/assets/brand/mermi_fit_life_app_icon_1024-1.png',
  mermi_logo_512: '/assets/brand/mermi_fit_life_app_icon_512.png',

  // Official MerMi IA 3D Character (Transparent & Face Avatar)
  mermi_ia_official: '/assets/ia/mermi-ia-official.png',
  mermi_ai_official_png: '/assets/ia/mermi-ia-official.png',
  mermi_ai_face_png: '/assets/brand/mermi-ai-face.png',

  // Official MerMi Points Badges (with transparent background)
  mermi_points_square: '/assets/mermi-points/mermi-points-square-trans.png',
  mermi_points_horizontal: '/assets/mermi-points/mermi-points-horizontal-trans.png',
  mermi_points_badge: '/assets/brand/mermi-points-badge.png',
  mermi_points_banner: '/assets/brand/mermi-points-banner.png',

  // Client Pages Official Header
  mermi_header_client: '/assets/brand/file_000000000b00820eabad455d8a975e25.png',

  // Official Campaign & Feature Posters (Bloco 03)
  posters: {
    drop_surpresa_07: '/assets/posters/drop_surpresa_07.png',
    recompensas_08: '/assets/posters/recompensas_08.png',
    mermi_points_06: '/assets/posters/mermi_points_06.png',
    cardapio_fit_05: '/assets/posters/cardapio_fit_05.png',
    teaser_esta_chegando: '/assets/posters/teaser_esta_chegando.png',
    o_problema_02: '/assets/posters/o_problema_02.png',
    a_solucao_03: '/assets/posters/a_solucao_03.png',
  },

  // Official Cardápios & Planos (Linha FIT, Linha FIT Premium e Planos — Pastas Oficiais Imutáveis)
  cardapios: {
    linha_fit_dir: '/assets/cardapios/linha-fit',
    linha_fit_premium_dir: '/assets/cardapios/linha-fit-premium',
    planos_dir: '/assets/cardapios/planos',
  }
} as const;

export type OfficialAssetKey = keyof typeof OFFICIAL_ASSET;
