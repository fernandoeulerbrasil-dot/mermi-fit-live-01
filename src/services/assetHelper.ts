import { apiClient } from './apiClient';

export interface DynamicAsset {
  asset_id: string;
  name: string;
  description: string;
  file_url: string;
  storage_path: string;
  category: string;
  page: string;
  component: string;
  status: string;
  version: number;
  is_official: boolean;
  mime_type: string;
  file_size: number;
  created_at: string;
  updated_at: string;
  usage_locations?: Array<{
    mapping_id: string;
    page: string;
    component: string;
    slot: string;
  }>;
}

export interface DynamicAssetMapping {
  mapping_id: string;
  asset_id: string;
  page: string;
  component: string;
  slot: string;
  order_num: number;
  status: string;
  asset_name: string;
  file_url: string;
  category: string;
  version: number;
}

// In-memory runtime cache for seamless visual rendering without page reloads
let cachedAssets: DynamicAsset[] = [];
let cachedMappings: DynamicAssetMapping[] = [];
let listeners: Array<() => void> = [];

export const assetService = {
  getAssets: () => cachedAssets,
  getMappings: () => cachedMappings,

  async refresh(): Promise<{ assets: DynamicAsset[]; mappings: DynamicAssetMapping[] }> {
    try {
      const data = await apiClient.assets.getAll();
      cachedAssets = (data.assets || []) as DynamicAsset[];
      cachedMappings = (data.mappings || []) as DynamicAssetMapping[];
      listeners.forEach((cb) => cb());
      return { assets: cachedAssets, mappings: cachedMappings };
    } catch (err) {
      console.warn('Erro ao atualizar assets da nuvem:', err);
      return { assets: cachedAssets, mappings: cachedMappings };
    }
  },

  subscribe(listener: () => void) {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  },

  /**
   * Resolve a URL de um asset visual para uma determinada página e componente.
   * Se houver um asset ativo mapeado no PostgreSQL/Cloud Storage, usa a versão ativa.
   * Caso contrário, usa a URL padrão (fallback).
   */
  resolveAssetUrl(page: string, component: string, fallbackUrl: string): string {
    const normPage = page.toLowerCase().trim();
    const normComp = component.toLowerCase().trim();

    // 1. Procurar em mappings ativos
    const matchMapping = cachedMappings.find(
      (m) =>
        m.status === 'ACTIVE' &&
        m.page.toLowerCase().trim() === normPage &&
        m.component.toLowerCase().trim() === normComp
    );
    if (matchMapping && matchMapping.file_url) {
      return matchMapping.file_url;
    }

    // 2. Procurar em assets diretamente
    const matchAsset = cachedAssets.find(
      (a) =>
        a.status === 'ACTIVE' &&
        a.page.toLowerCase().trim() === normPage &&
        a.component.toLowerCase().trim() === normComp
    );
    if (matchAsset && matchAsset.file_url) {
      return matchAsset.file_url;
    }

    return fallbackUrl;
  }
};
