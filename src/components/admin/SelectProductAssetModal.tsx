import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Search,
  Check,
  Upload,
  Link as LinkIcon,
  Trash2,
  Image as ImageIcon,
  Sparkles,
  Layers,
  RefreshCw,
  Eye,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { FoodProduct } from '../../types/food';
import { apiClient } from '../../services/apiClient';
import { assetService } from '../../services/assetHelper';
import { ASSET_CATEGORIES, AssetRecord } from './MermiOwnerAssetManagerView';

interface SelectProductAssetModalProps {
  product: FoodProduct;
  isOpen: boolean;
  onClose: () => void;
  onLinkAsset: (productId: string, assetId: string | null) => Promise<any>;
  onShowToast: (msg: string) => void;
}

export const SelectProductAssetModal: React.FC<SelectProductAssetModalProps> = ({
  product,
  isOpen,
  onClose,
  onLinkAsset,
  onShowToast,
}) => {
  const [assets, setAssets] = useState<AssetRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('TODOS');
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(
    product.primaryImageAssetId || null
  );
  const [submitting, setSubmitting] = useState(false);

  // Quick Upload inside modal
  const [isUploadingNew, setIsUploadingNew] = useState(false);
  const [uploadState, setUploadState] = useState<'idle' | 'enviando' | 'processando' | 'concluido' | 'erro'>('idle');
  const [uploadMsg, setUploadMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadAssets = async () => {
    try {
      setLoading(true);
      const res = await assetService.refresh();
      setAssets((res.assets || []) as AssetRecord[]);
    } catch (err: any) {
      onShowToast(`Erro ao listar assets: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setSelectedAssetId(product.primaryImageAssetId || null);
      loadAssets();
    }
  }, [isOpen, product.id, product.primaryImageAssetId]);

  if (!isOpen) return null;

  const filteredAssets = assets.filter((a) => {
    const matchCat =
      selectedCategory === 'TODOS' ||
      a.category.toUpperCase().trim() === selectedCategory.toUpperCase().trim();

    const matchSearch =
      searchQuery === '' ||
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.asset_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.description && a.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchCat && matchSearch;
  });

  const currentlyLinkedAsset = assets.find((a) => a.asset_id === product.primaryImageAssetId);
  const activeSelectedAsset = assets.find((a) => a.asset_id === selectedAssetId);

  // Executar Vínculo
  const handleConfirmLink = async () => {
    try {
      setSubmitting(true);
      await onLinkAsset(product.id, selectedAssetId);
      onClose();
    } catch (err: any) {
      onShowToast(`Erro ao vincular imagem: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Remover Vínculo
  const handleRemoveLink = async () => {
    if (!window.confirm(`Deseja remover a foto principal do prato "${product.name}"? O Cardápio passará a exibir o placeholder oficial "Foto em breve".`)) {
      return;
    }

    try {
      setSubmitting(true);
      await onLinkAsset(product.id, null);
      setSelectedAssetId(null);
      onClose();
    } catch (err: any) {
      onShowToast(`Erro ao desvincular: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Quick Direct Upload
  const handleQuickUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Reset immediately so the user can select the same file again if desired
    e.target.value = '';

    if (!file) return;

    const allowedExts = ['.png', '.jpg', '.jpeg', '.webp'];
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!allowedExts.includes(ext)) {
      onShowToast(`Formato não suportado (${ext}). Utilize PNG, JPG, JPEG ou WEBP.`);
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      onShowToast('Arquivo muito grande. O limite máximo é de 15MB.');
      return;
    }

    try {
      setIsUploadingNew(true);
      setUploadState('enviando');
      setUploadMsg('Enviando para o Cloud Storage...');

      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
      });
      reader.readAsDataURL(file);
      const fileBase64 = await base64Promise;

      // 1. Upload
      const uploadRes = await apiClient.assets.upload(file.name, fileBase64, file.type || 'image/png');

      // 2. Create Asset in PostgreSQL
      setUploadState('processando');
      setUploadMsg('Criando registro no PostgreSQL...');

      const createRes = await apiClient.assets.create({
        name: `Foto Prato: ${product.name}`,
        description: `Imagem oficial vinculada diretamente ao prato ${product.name}`,
        file_url: uploadRes.fileUrl,
        storage_path: uploadRes.storagePath,
        category: 'CARDÁPIO',
        page: 'Cardápio',
        component: 'ProductCard',
        slot: product.id,
        order_num: 1,
        status: 'ACTIVE',
        is_official: false,
        mime_type: uploadRes.mimeType,
        file_size: uploadRes.fileSize,
      });

      setUploadState('concluido');
      setUploadMsg('Imagem salva! Vinculando ao prato...');
      onShowToast(`Nova foto cadastrada com sucesso (v${createRes.version})!`);

      // 3. Atualizar lista de assets e auto-selecionar o novo asset
      const newAssetId = createRes.asset_id || createRes.assetId || null;
      await loadAssets();
      setSelectedAssetId(newAssetId);

      // Auto-vincular
      if (newAssetId) {
        await onLinkAsset(product.id, newAssetId);
      }
      onClose();
    } catch (err: any) {
      setUploadState('erro');
      setUploadMsg(`Erro: ${err.message}`);
      onShowToast(`Erro no upload: ${err.message}`);
    } finally {
      setIsUploadingNew(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#13192B] border border-stone-700 rounded-3xl p-5 sm:p-6 max-w-2xl w-full space-y-4 shadow-2xl my-6 animate-in fade-in zoom-in-95 max-h-[92vh] flex flex-col">
        {/* Cabeçalho */}
        <div className="flex items-start justify-between border-b border-stone-800 pb-3 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-['Outfit']">
                {product.line === 'fit_premium' ? 'Fit Premium' : 'Linha Fit'}
              </span>
              <span className="text-[10px] text-stone-500 font-mono">ID: {product.id}</span>
            </div>
            <h3 className="text-lg font-black text-white font-['Outfit'] mt-1">
              Imagem Principal do Prato
            </h3>
            <p className="text-xs text-stone-300">
              Prato: <strong className="text-white">{product.name}</strong>
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 rounded-xl hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status do Vínculo Atual */}
        <div className="p-3.5 rounded-2xl bg-[#0E131F] border border-stone-800 flex items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-stone-900 border border-stone-800 overflow-hidden flex items-center justify-center shrink-0 p-1">
              {currentlyLinkedAsset?.file_url || product.imageUrl || product.image ? (
                <img
                  src={currentlyLinkedAsset?.file_url || product.imageUrl || product.image}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <ImageIcon className="w-6 h-6 text-stone-600" />
              )}
            </div>
            <div>
              <span className="text-[10px] text-stone-500 font-mono uppercase block">
                Vínculo Atual:
              </span>
              {product.primaryImageAssetId ? (
                <div>
                  <h4 className="font-bold text-white truncate max-w-xs">
                    {currentlyLinkedAsset?.name || 'Asset Vinculado'}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-mono">
                    <span>ID: {product.primaryImageAssetId}</span>
                    {currentlyLinkedAsset && <span>• v{currentlyLinkedAsset.version}</span>}
                  </div>
                </div>
              ) : (
                <div>
                  <h4 className="font-bold text-amber-300">Nenhum Asset Vinculado</h4>
                  <p className="text-[10px] text-stone-400">
                    O Cardápio exibirá o placeholder oficial "Foto em breve".
                  </p>
                </div>
              )}
            </div>
          </div>

          {product.primaryImageAssetId && (
            <button
              type="button"
              onClick={handleRemoveLink}
              disabled={submitting}
              className="px-3 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 shrink-0"
              title="Remover vínculo e usar 'Foto em breve'"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remover Vínculo</span>
            </button>
          )}
        </div>

        {/* Banner de Feedback de Upload Rápido se ativo */}
        {isUploadingNew && (
          <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 flex items-center gap-3 text-xs text-emerald-300 shrink-0">
            <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
            <div className="space-y-0.5">
              <span className="font-bold block uppercase tracking-wider font-['Outfit']">
                {uploadState === 'enviando' ? 'Enviando Imagem...' : 'Processando no Banco de Dados...'}
              </span>
              <span className="text-[11px] text-stone-300 font-mono">{uploadMsg}</span>
            </div>
          </div>
        )}

        {/* Barra de Filtros, Busca e Botão de Novo Upload */}
        <div className="space-y-2.5 shrink-0">
          <div className="flex items-center gap-2 justify-between">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar asset por nome ou ID..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0E131F] border border-stone-800 text-white text-xs outline-none focus:border-emerald-500"
              />
            </div>

            {/* Botão de Upload Rápido direto do dispositivo */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleQuickUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingNew}
                className="px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap active:scale-95 disabled:opacity-50"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>+ Enviar Foto Nova</span>
              </button>
            </div>
          </div>

          {/* Categorias */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <button
              onClick={() => setSelectedCategory('TODOS')}
              className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap cursor-pointer transition-all ${
                selectedCategory === 'TODOS'
                  ? 'bg-emerald-500 text-stone-950 font-black'
                  : 'bg-stone-800/80 text-stone-400 hover:text-white'
              }`}
            >
              Todos ({assets.length})
            </button>
            {['PRODUTOS', 'CARDÁPIO', 'BRAND', 'OUTROS'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap cursor-pointer transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-500 text-stone-950 font-black'
                    : 'bg-stone-800/80 text-stone-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Galeria de Seleção de Assets */}
        <div className="flex-1 overflow-y-auto pr-1 min-h-[220px]">
          {loading ? (
            <div className="py-12 text-center space-y-2">
              <RefreshCw className="w-6 h-6 text-emerald-400 animate-spin mx-auto" />
              <p className="text-xs text-stone-400 font-mono">Carregando galeria do Asset Manager...</p>
            </div>
          ) : filteredAssets.length === 0 ? (
            <div className="py-12 text-center space-y-3 bg-[#0E131F] rounded-2xl border border-dashed border-stone-800 p-6">
              <ImageIcon className="w-8 h-8 text-stone-600 mx-auto" />
              <p className="text-xs text-stone-400 font-bold">Nenhum asset encontrado com esses filtros.</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-stone-950 font-black text-xs uppercase cursor-pointer"
              >
                + Enviar Foto Agora
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredAssets.map((asset) => {
                const isSelected = selectedAssetId === asset.asset_id;
                const isCurrent = product.primaryImageAssetId === asset.asset_id;

                return (
                  <div
                    key={asset.asset_id}
                    onClick={() => setSelectedAssetId(asset.asset_id)}
                    className={`relative rounded-2xl p-2.5 transition-all cursor-pointer border flex flex-col justify-between space-y-2 ${
                      isSelected
                        ? 'bg-emerald-950/40 border-emerald-400 ring-2 ring-emerald-400/30 shadow-lg'
                        : 'bg-[#0E131F] border-stone-800 hover:border-stone-600'
                    }`}
                  >
                    {/* Imagem Container */}
                    <div className="relative aspect-video rounded-xl bg-stone-900 border border-stone-800 overflow-hidden flex items-center justify-center p-1">
                      <img
                        src={asset.file_url}
                        alt={asset.name}
                        className="w-full h-full object-contain"
                      />

                      {/* Badges */}
                      <div className="absolute top-1 left-1 flex items-center gap-1">
                        <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-stone-950/80 text-emerald-400 border border-emerald-500/30">
                          v{asset.version}
                        </span>
                      </div>

                      {isSelected && (
                        <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-emerald-500 text-stone-950 flex items-center justify-center shadow-md">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    {/* Dados */}
                    <div className="space-y-0.5">
                      <div className="flex items-center justify-between text-[9px] text-stone-500 font-mono">
                        <span className="text-emerald-400 font-bold">{asset.category}</span>
                        <span>{asset.asset_id.slice(0, 10)}...</span>
                      </div>

                      <h4 className="text-[11px] font-bold text-white truncate" title={asset.name}>
                        {asset.name}
                      </h4>

                      {isCurrent && (
                        <span className="text-[9px] text-amber-300 font-bold block pt-0.5">
                          ✓ Vinculado atualmente
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Rodapé com Ações de Confirmação */}
        <div className="flex items-center justify-between gap-3 border-t border-stone-800 pt-3 shrink-0">
          <div className="text-xs">
            {activeSelectedAsset ? (
              <span className="text-stone-300">
                Selecionado: <strong className="text-emerald-400">{activeSelectedAsset.name}</strong> (v{activeSelectedAsset.version})
              </span>
            ) : (
              <span className="text-stone-500">Selecione uma imagem na galeria acima</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold cursor-pointer transition-colors"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={handleConfirmLink}
              disabled={submitting || !selectedAssetId || selectedAssetId === product.primaryImageAssetId}
              className="px-5 py-2 rounded-xl bg-[#0EB24A] hover:bg-[#0ca042] text-stone-950 font-black text-xs uppercase tracking-wider font-['Outfit'] flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Salvando...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Salvar Vínculo</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
