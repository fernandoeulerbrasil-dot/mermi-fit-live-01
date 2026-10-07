import React, { useState, useEffect, useRef } from 'react';
import {
  Database,
  Upload,
  RotateCcw,
  Layers,
  ShieldCheck,
  Search,
  Plus,
  RefreshCw,
  Eye,
  CheckCircle2,
  X,
  ExternalLink,
  Link as LinkIcon,
  Tag,
  Trash2,
  Edit3,
  Copy,
  Check,
  ImageIcon,
  Power,
  ShieldAlert,
  ArrowRight,
  Utensils,
  AlertCircle
} from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { assetService } from '../../services/assetHelper';
import { useMermiStore } from '../../context/MermiStoreContext';

export const ASSET_CATEGORIES = [
  'BRAND',
  'HOME',
  'IA',
  'CARDÁPIO',
  'PRODUTOS',
  'GAMIFICAÇÃO',
  'CORRIDA',
  'EVOLUÇÃO',
  'COMUNIDADE',
  'POSTS',
  'NUTRIÇÃO',
  'PLANOS',
  'OUTROS'
] as const;

export const ASSET_PAGES = [
  'Início',
  'Cardápio',
  'MerMi IA',
  'MerMi Points',
  'MerMi Run',
  'Evolução',
  'Comunidade',
  'Posts',
  'Perfil',
  'Outras'
] as const;

export const ASSET_COMPONENTS = [
  'Logo',
  'Banner',
  'Header',
  'Card',
  'Fundo',
  'Ícone',
  'Mascote',
  'Produto',
  'Campanha',
  'Post',
  'Medalha',
  'Recompensa',
  'Outro'
] as const;

export interface AssetRecord {
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
  created_by?: string;
  created_at: string;
  updated_at: string;
  usage_locations?: Array<{
    mapping_id: string;
    page: string;
    component: string;
    slot: string;
  }>;
}

export interface AssetHistoryItem {
  id: string;
  asset_id: string;
  version: number;
  file_url: string;
  storage_path: string;
  changed_by: string;
  reason: string;
  created_at: string;
}

interface MermiOwnerAssetManagerViewProps {
  onShowToast: (msg: string) => void;
}

export const MermiOwnerAssetManagerView: React.FC<MermiOwnerAssetManagerViewProps> = ({
  onShowToast
}) => {
  const { currentAdminUser, products, linkProductImageAsset, refreshProducts } = useMermiStore();

  const [assets, setAssets] = useState<AssetRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('TODOS');
  const [statusFilter, setStatusFilter] = useState<'TODOS' | 'ACTIVE' | 'INACTIVE' | 'OFFICIAL'>('TODOS');

  // Modals state
  const [selectedAsset, setSelectedAsset] = useState<AssetRecord | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isReplaceModalOpen, setIsReplaceModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isMappingModalOpen, setIsMappingModalOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLinkProductModalOpen, setIsLinkProductModalOpen] = useState(false);
  const [selectedProductToLink, setSelectedProductToLink] = useState<string>('');

  // History & Usage
  const [historyList, setHistoryList] = useState<AssetHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Form states - Create Asset
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<string>('HOME');
  const [newPage, setNewPage] = useState<string>('Início');
  const [newComponent, setNewComponent] = useState<string>('Banner');
  const [newSlot, setNewSlot] = useState('Principal');
  const [newOrderNum, setNewOrderNum] = useState('1');
  const [newStatus, setNewStatus] = useState<'ACTIVE' | 'INACTIVE' | 'DRAFT'>('ACTIVE');
  const [newFileBase64, setNewFileBase64] = useState<string | null>(null);
  const [newFileName, setNewFileName] = useState('');
  const [newFileSize, setNewFileSize] = useState<number>(0);
  const [newMimeType, setNewMimeType] = useState('');
  const [isDraggingNew, setIsDraggingNew] = useState(false);
  const [submittingCreate, setSubmittingCreate] = useState(false);
  const [createPhase, setCreatePhase] = useState<'idle' | 'enviando' | 'processando' | 'concluido' | 'erro'>('idle');
  const [createStatusMsg, setCreateStatusMsg] = useState('');
  const [linkDirectToProductId, setLinkDirectToProductId] = useState<string>('');
  const newFileInputRef = useRef<HTMLInputElement>(null);

  // Form states - Replace
  const [replaceReason, setReplaceReason] = useState('');
  const [replaceFileBase64, setReplaceFileBase64] = useState<string | null>(null);
  const [replaceFileName, setReplaceFileName] = useState('');
  const [replaceFileSize, setReplaceFileSize] = useState<number>(0);
  const [replaceMimeType, setReplaceMimeType] = useState('');
  const [isDraggingReplace, setIsDraggingReplace] = useState(false);
  const [submittingReplace, setSubmittingReplace] = useState(false);
  const [replacePhase, setReplacePhase] = useState<'idle' | 'enviando' | 'processando' | 'concluido' | 'erro'>('idle');
  const [replaceStatusMsg, setReplaceStatusMsg] = useState('');
  const replaceFileInputRef = useRef<HTMLInputElement>(null);

  // Form states - Edit Metadata
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editPage, setEditPage] = useState('');
  const [editComponent, setEditComponent] = useState('');
  const [editStatus, setEditStatus] = useState('ACTIVE');
  const [submittingEdit, setSubmittingEdit] = useState(false);

  // Form states - Mapping (Vincular a outro local)
  const [linkPage, setLinkPage] = useState<string>('Início');
  const [linkComponent, setLinkComponent] = useState<string>('Card');
  const [linkSlot, setLinkSlot] = useState('Secundário');
  const [submittingLink, setSubmittingLink] = useState(false);

  // Copy helper
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Format bytes helper
  const formatBytes = (bytes: number): string => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  // RBAC Permission Check
  const canManageAssets =
    currentAdminUser?.role === 'OWNER' ||
    currentAdminUser?.role === 'ADMIN' ||
    currentAdminUser?.permissions?.includes('assets.upload') ||
    currentAdminUser?.permissions?.includes('assets.edit') ||
    currentAdminUser?.permissions?.includes('assets.replace') ||
    currentAdminUser?.permissions?.includes('assets.publish');

  // Load assets from server
  const loadAssets = async () => {
    try {
      setLoading(true);
      const res = await assetService.refresh();
      setAssets((res.assets || []) as AssetRecord[]);
    } catch (err: any) {
      onShowToast(`Erro ao carregar assets: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  // Filtered assets
  const filteredAssets = assets.filter((a) => {
    const matchCat =
      selectedCategory === 'TODOS' ||
      a.category.toUpperCase().trim() === selectedCategory.toUpperCase().trim();

    const matchStatus =
      statusFilter === 'TODOS' ||
      (statusFilter === 'OFFICIAL' && a.is_official) ||
      (statusFilter === 'ACTIVE' && a.status === 'ACTIVE' && !a.is_official) ||
      (statusFilter === 'INACTIVE' && a.status === 'INACTIVE');

    const matchSearch =
      searchQuery === '' ||
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.asset_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.page.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.component.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.description && a.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchCat && matchStatus && matchSearch;
  });

  // Handle file processing with validation
  const processSelectedFile = (
    file: File,
    onSetBase64: (val: string | null) => void,
    onSetName: (name: string) => void,
    onSetSize: (size: number) => void,
    onSetMime: (mime: string) => void
  ) => {
    const allowedExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.svg'];
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

    if (!allowedExtensions.includes(ext)) {
      onShowToast(`Formato não suportado (${ext}). Use PNG, JPG, JPEG, WEBP ou SVG.`);
      return false;
    }

    // Limit 15MB
    if (file.size > 15 * 1024 * 1024) {
      onShowToast(`Arquivo muito grande (${formatBytes(file.size)}). O limite máximo é de 15MB.`);
      return false;
    }

    onSetName(file.name);
    onSetSize(file.size);
    onSetMime(file.type || 'image/png');

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onSetBase64(reader.result);
      }
    };
    reader.readAsDataURL(file);
    return true;
  };

  // Execute Publicar Asset
  const handlePublishAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      onShowToast('Por favor, informe o Nome do Asset.');
      return;
    }
    if (!newFileBase64) {
      onShowToast('Por favor, selecione ou arraste a imagem do asset.');
      return;
    }

    try {
      setSubmittingCreate(true);
      setCreatePhase('enviando');
      setCreateStatusMsg('Enviando imagem para o Cloud Storage...');

      // 1. Upload do arquivo para o Cloud Storage
      const uploadRes = await apiClient.assets.upload(newFileName, newFileBase64, newMimeType);

      // 2. Criar registro no PostgreSQL (assets + asset_versions + asset_component_mapping + audit_logs)
      setCreatePhase('processando');
      setCreateStatusMsg('Registrando metadados no PostgreSQL e criando versão ativa v1...');

      const createRes = await apiClient.assets.create({
        name: newName.trim(),
        description: newDesc.trim(),
        file_url: uploadRes.fileUrl,
        storage_path: uploadRes.storagePath,
        category: newCategory,
        page: newPage,
        component: newComponent,
        slot: newSlot || 'Principal',
        order_num: Number(newOrderNum) || 1,
        status: newStatus,
        mime_type: uploadRes.mimeType,
        file_size: uploadRes.fileSize,
        is_official: false
      });

      const newAssetId = createRes.asset_id || createRes.assetId;

      // Se o OWNER selecionou vincular a um prato diretamente:
      if (linkDirectToProductId && newAssetId) {
        setCreateStatusMsg('Vinculando imagem ao prato selecionado no Cardápio...');
        await linkProductImageAsset(linkDirectToProductId, newAssetId);
      }

      setCreatePhase('concluido');
      setCreateStatusMsg('Asset publicado com sucesso!');
      onShowToast(createRes.message || 'Asset publicado com sucesso!');

      // Sincronizar catálogo e cardápio imediatamente
      await Promise.all([loadAssets(), refreshProducts()]);

      setTimeout(() => {
        setIsCreateModalOpen(false);
        setCreatePhase('idle');
        setCreateStatusMsg('');
        setNewName('');
        setNewDesc('');
        setNewFileBase64(null);
        setNewFileName('');
        setNewFileSize(0);
        setNewMimeType('');
        setLinkDirectToProductId('');
      }, 500);
    } catch (err: any) {
      setCreatePhase('erro');
      setCreateStatusMsg(`Erro: ${err.message}`);
      onShowToast(`Erro ao publicar asset: ${err.message}`);
    } finally {
      setSubmittingCreate(false);
    }
  };

  // Execute Replace Image (New Version)
  const handleExecuteReplace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsset) return;
    if (!replaceFileBase64) {
      onShowToast('Selecione a nova imagem para substituição.');
      return;
    }
    if (!replaceReason.trim()) {
      onShowToast('Informe o motivo da substituição para o registro de auditoria.');
      return;
    }

    try {
      setSubmittingReplace(true);
      setReplacePhase('enviando');
      setReplaceStatusMsg('Enviando nova imagem para o Cloud Storage...');

      // 1. Upload do novo arquivo
      const uploadRes = await apiClient.assets.upload(replaceFileName, replaceFileBase64, replaceMimeType);

      // 2. Substituir versão no PostgreSQL
      setReplacePhase('processando');
      setReplaceStatusMsg('Atualizando versão ativa no PostgreSQL...');

      const replaceRes = await apiClient.assets.replace(selectedAsset.asset_id, {
        newFileUrl: uploadRes.fileUrl,
        newStoragePath: uploadRes.storagePath,
        reason: replaceReason.trim()
      });

      setReplacePhase('concluido');
      setReplaceStatusMsg(`Sucesso! Nova versão v${replaceRes.version} gerada.`);
      onShowToast(`Asset substituído com sucesso para a versão v${replaceRes.version}!`);

      await Promise.all([loadAssets(), refreshProducts()]);

      setTimeout(() => {
        setIsReplaceModalOpen(false);
        setReplacePhase('idle');
        setReplaceStatusMsg('');
        setReplaceFileBase64(null);
        setReplaceFileName('');
        setReplaceReason('');
      }, 500);
    } catch (err: any) {
      setReplacePhase('erro');
      setReplaceStatusMsg(`Erro: ${err.message}`);
      onShowToast(`Erro ao substituir asset: ${err.message}`);
    } finally {
      setSubmittingReplace(false);
    }
  };

  // Execute Rollback
  const handleRollback = async (targetVersion: number) => {
    if (!selectedAsset) return;
    if (!window.confirm(`Deseja realmente reverter o asset "${selectedAsset.name}" para a versão v${targetVersion}?`)) {
      return;
    }

    try {
      const res = await apiClient.assets.rollback(selectedAsset.asset_id, targetVersion);
      onShowToast(res.message);
      setIsHistoryModalOpen(false);
      await Promise.all([loadAssets(), refreshProducts()]);
    } catch (err: any) {
      onShowToast(`Erro no rollback: ${err.message}`);
    }
  };

  // Execute Edit Metadata
  const handleExecuteEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsset) return;

    try {
      setSubmittingEdit(true);
      await apiClient.assets.update(selectedAsset.asset_id, {
        name: editName.trim(),
        description: editDesc.trim(),
        category: editCategory,
        page: editPage,
        component: editComponent,
        status: editStatus
      });
      onShowToast('Dados do asset atualizados com sucesso!');
      setIsEditModalOpen(false);
      await loadAssets();
    } catch (err: any) {
      onShowToast(`Erro ao atualizar: ${err.message}`);
    } finally {
      setSubmittingEdit(false);
    }
  };

  // Execute Toggle Status
  const handleToggleStatus = async (asset: AssetRecord) => {
    const nextStatus = asset.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await apiClient.assets.toggleStatus(asset.asset_id, nextStatus);
      onShowToast(`Status alterado para ${nextStatus === 'ACTIVE' ? 'ATIVO' : 'INATIVO'}.`);
      await loadAssets();
    } catch (err: any) {
      onShowToast(`Erro ao alterar status: ${err.message}`);
    }
  };

  // Execute Delete Asset
  const handleDeleteAsset = async (asset: AssetRecord) => {
    if (asset.is_official) {
      onShowToast('Assets oficiais da marca possuem proteção de imutabilidade e não podem ser excluídos.');
      return;
    }

    if (!window.confirm(`Tem certeza de que deseja excluir permanentemente o asset "${asset.name}" e seus vínculos?`)) {
      return;
    }

    try {
      await apiClient.assets.delete(asset.asset_id);
      onShowToast('Asset excluído com sucesso.');
      await loadAssets();
    } catch (err: any) {
      onShowToast(`Erro ao excluir: ${err.message}`);
    }
  };

  // Execute Add Mapping
  const handleAddMapping = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsset) return;

    try {
      setSubmittingLink(true);
      await apiClient.assets.addMapping(selectedAsset.asset_id, {
        page: linkPage,
        component: linkComponent,
        slot: linkSlot || 'Principal',
        status: 'ACTIVE'
      });
      onShowToast(`Asset vinculado com sucesso à tela "${linkPage} → ${linkComponent}"!`);
      await loadAssets();

      // Atualiza selectedAsset localmente
      const updated = (await apiClient.assets.getAll()).assets?.find((a) => a.asset_id === selectedAsset.asset_id);
      if (updated) setSelectedAsset(updated);
    } catch (err: any) {
      onShowToast(`Erro ao vincular: ${err.message}`);
    } finally {
      setSubmittingLink(false);
    }
  };

  // Execute Delete Mapping
  const handleDeleteMapping = async (mappingId: string) => {
    if (!selectedAsset) return;
    try {
      await apiClient.assets.deleteMapping(selectedAsset.asset_id, mappingId);
      onShowToast('Vínculo removido com sucesso.');
      await loadAssets();

      const updated = (await apiClient.assets.getAll()).assets?.find((a) => a.asset_id === selectedAsset.asset_id);
      if (updated) setSelectedAsset(updated);
    } catch (err: any) {
      onShowToast(`Erro ao remover vínculo: ${err.message}`);
    }
  };

  // Open History modal
  const handleOpenHistory = async (asset: AssetRecord) => {
    setSelectedAsset(asset);
    setIsHistoryModalOpen(true);
    setLoadingHistory(true);
    try {
      const data = await apiClient.assets.getHistory(asset.asset_id);
      setHistoryList(data.history || []);
    } catch (err: any) {
      onShowToast(`Erro ao buscar histórico: ${err.message}`);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Open Edit modal
  const handleOpenEdit = (asset: AssetRecord) => {
    setSelectedAsset(asset);
    setEditName(asset.name);
    setEditDesc(asset.description || '');
    setEditCategory(asset.category);
    setEditPage(asset.page);
    setEditComponent(asset.component);
    setEditStatus(asset.status);
    setIsEditModalOpen(true);
  };

  // Copy link
  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(window.location.origin + url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
    onShowToast('Link da imagem copiado para a área de transferência!');
  };

  // Non-authorized view
  if (!canManageAssets) {
    return (
      <div className="bg-[#13192B] border border-amber-500/30 rounded-3xl p-8 text-center space-y-4 max-w-xl mx-auto my-12">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-black text-white font-['Outfit']">Acesso Restrito ao Asset Manager</h3>
        <p className="text-xs text-stone-300 leading-relaxed">
          Apenas usuários com perfil <strong>OWNER</strong> ou com credenciais administrativas autorizadas têm permissão para cadastrar, substituir ou alterar imagens no ecossistema MERMI FIT LIFE.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* 1. CABEÇALHO DO ASSET MANAGER COM BOTÃO PRINCIPAL EM DESTAQUE */}
      {/* ========================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/40 font-['Outfit'] flex items-center gap-1.5">
              <Database className="w-3 h-3" />
              GERENCIADOR VISUAL DE ASSETS • OWNER CONTROL
            </span>
            <span className="text-[10px] text-stone-400 font-mono">
              CLOUD STORAGE + POSTGRESQL
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white font-['Outfit'] tracking-tight">
            Galeria & Central Visual de Imagens
          </h2>

          <p className="text-xs text-stone-300 max-w-2xl leading-relaxed">
            Cadastre imagens pelo celular ou computador, escolha onde elas aparecem nas telas e substitua conteúdos com versionamento automático sem precisar tocar no código.
          </p>
        </div>

        {/* BOTÃO PRINCIPAL REQUISITADO */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={loadAssets}
            disabled={loading}
            className="p-3 rounded-2xl bg-[#171E31] hover:bg-[#1f2942] text-stone-300 border border-stone-800 transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-50"
            title="Atualizar biblioteca"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-[#0EB24A] hover:bg-[#0ca042] active:scale-95 text-stone-950 font-black text-xs uppercase tracking-wider font-['Outfit'] transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/25 border border-emerald-400/50"
          >
            <Plus className="w-5 h-5 stroke-[3]" />
            <span>+ ADICIONAR ASSET</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. REGRAS DE PROTEÇÃO DA MARCA & ASSETS OFICIAIS */}
      {/* ========================================================================= */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-stone-900 to-[#13192B] border border-emerald-500/30 flex items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="text-xs space-y-0.5">
            <h4 className="font-bold text-white font-['Outfit']">
              Assets Oficiais da Marca Protegidos
            </h4>
            <p className="text-[11px] text-stone-300 leading-relaxed">
              Logotipos, mascotes e identidades da marca são imutáveis contra alterações destrutivas ou IA. Cada substituição cria uma nova versão (ex: v1 → v2) mantendo o histórico intacto para Rollback a qualquer instante.
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-emerald-400 bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-500/30 shrink-0">
          <span>{assets.filter((a) => a.is_official).length} Oficiais</span>
          <span className="text-stone-600">•</span>
          <span>{assets.length} Total</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. FILTROS POR CATEGORIA, STATUS E BARRA DE BUSCA */}
      {/* ========================================================================= */}
      <div className="space-y-3">
        {/* Categorias com scroll horizontal suave */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('TODOS')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedCategory === 'TODOS'
                ? 'bg-[#0EB24A] text-stone-950 font-black shadow-xs'
                : 'bg-[#171E31] text-stone-400 hover:text-white border border-stone-800'
            }`}
          >
            TODOS ({assets.length})
          </button>
          {ASSET_CATEGORIES.map((cat) => {
            const count = assets.filter((a) => a.category.toUpperCase().trim() === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#0EB24A] text-stone-950 font-black shadow-xs'
                    : 'bg-[#171E31] text-stone-400 hover:text-white border border-stone-800'
                }`}
              >
                {cat} {count > 0 && <span className="opacity-70 text-[10px]">({count})</span>}
              </button>
            );
          })}
        </div>

        {/* Busca e Status Filter */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nome, página, componente ou ID..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#171E31] border border-stone-800 text-white text-xs outline-none focus:border-emerald-500 transition-all placeholder:text-stone-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0 text-xs">
            <span className="text-stone-500 text-[11px] font-bold">Status:</span>
            {(['TODOS', 'ACTIVE', 'INACTIVE', 'OFFICIAL'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-stone-700 text-white'
                    : 'bg-[#171E31] text-stone-400 hover:text-white border border-stone-800/80'
                }`}
              >
                {st === 'TODOS'
                  ? 'Todos'
                  : st === 'ACTIVE'
                  ? 'Ativos'
                  : st === 'INACTIVE'
                  ? 'Inativos'
                  : 'Oficiais'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. BIBLIOTECA VISUAL (GALERIA DE ASSETS) */}
      {/* ========================================================================= */}
      {loading ? (
        <div className="py-20 text-center space-y-3 bg-[#13192B] rounded-3xl border border-stone-800/60 p-8">
          <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
          <p className="text-xs text-stone-300 font-bold font-['Outfit']">
            Sincronizando catálogo do PostgreSQL e Cloud Storage...
          </p>
        </div>
      ) : filteredAssets.length === 0 ? (
        /* ESTADO VAZIO LIMPO EXIGIDO NO REQUISITO 12 */
        <div className="py-16 text-center bg-[#13192B] border border-dashed border-stone-800 rounded-3xl p-8 max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-500 mx-auto">
            <ImageIcon className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-base font-bold text-white font-['Outfit']">
              {searchQuery || selectedCategory !== 'TODOS'
                ? 'Nenhum Asset coincide com os filtros'
                : 'Nenhum Asset cadastrado.'}
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              {searchQuery || selectedCategory !== 'TODOS'
                ? 'Tente ajustar os termos da busca ou selecionar outra categoria.'
                : 'Comece adicionando imagens oficiais da marca, banners ou pratos para gerenciar visualmente.'}
            </p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-5 py-2.5 rounded-2xl bg-[#0EB24A] hover:bg-[#0ca042] text-stone-950 font-black text-xs uppercase tracking-wider font-['Outfit'] inline-flex items-center gap-2 cursor-pointer shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ ADICIONAR ASSET</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAssets.map((asset) => (
            <div
              key={asset.asset_id}
              className="bg-[#171E31] border border-stone-800/90 hover:border-emerald-500/40 rounded-3xl p-4 shadow-xl flex flex-col justify-between space-y-4 transition-all group"
            >
              {/* IMAGEM & DADOS BÁSICOS */}
              <div className="space-y-3">
                {/* PREVIEW CONTAINER */}
                <div className="relative w-full h-44 rounded-2xl bg-[#0E131F] border border-stone-800 overflow-hidden flex items-center justify-center p-2 group-hover:border-emerald-500/30 transition-colors">
                  <img
                    src={asset.file_url}
                    alt={asset.name}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = '/assets/brand/mermi-logo.png';
                    }}
                  />

                  {/* Badges superiores flutuantes */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                    {asset.is_official ? (
                      <span className="text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-500/90 text-stone-950 flex items-center gap-1 shadow-sm font-['Outfit']">
                        <ShieldCheck className="w-3 h-3" />
                        OFICIAL
                      </span>
                    ) : (
                      <span
                        className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-sm font-['Outfit'] ${
                          asset.status === 'ACTIVE'
                            ? 'bg-emerald-500 text-stone-950'
                            : 'bg-stone-800 text-stone-400'
                        }`}
                      >
                        {asset.status === 'ACTIVE' ? 'ATIVO' : 'INATIVO'}
                      </span>
                    )}

                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-stone-950/80 backdrop-blur-xs text-emerald-400 border border-emerald-500/30 font-mono">
                      v{asset.version}
                    </span>
                  </div>

                  {/* Botão flutuante de visualizar full */}
                  <button
                    onClick={() => {
                      setSelectedAsset(asset);
                      setIsLightboxOpen(true);
                    }}
                    className="absolute bottom-2.5 right-2.5 p-2 rounded-xl bg-stone-950/80 backdrop-blur-xs text-stone-300 hover:text-white hover:bg-stone-900 border border-stone-800 transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-md"
                    title="Visualizar em tamanho real"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                {/* DADOS DO ASSET */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 font-mono">
                      {asset.category}
                    </span>
                    <span className="text-[10px] text-stone-500 font-mono">
                      {formatBytes(asset.file_size)}
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-white font-['Outfit'] truncate" title={asset.name}>
                    {asset.name}
                  </h3>

                  {asset.description && (
                    <p className="text-[11px] text-stone-400 line-clamp-2 leading-relaxed">
                      {asset.description}
                    </p>
                  )}
                </div>

                {/* ONDE O ASSET APARECE */}
                <div className="p-3 rounded-2xl bg-[#0E131F] border border-stone-800/80 text-[11px] space-y-1.5">
                  <div className="flex items-center justify-between text-stone-400">
                    <span className="flex items-center gap-1 font-bold">
                      <Layers className="w-3 h-3 text-emerald-400" />
                      Página:
                    </span>
                    <strong className="text-white uppercase font-bold">{asset.page}</strong>
                  </div>

                  <div className="flex items-center justify-between text-stone-400">
                    <span className="flex items-center gap-1 font-bold">
                      <Tag className="w-3 h-3 text-cyan-400" />
                      Componente:
                    </span>
                    <strong className="text-cyan-300 font-bold truncate max-w-[140px]">
                      {asset.component}
                    </strong>
                  </div>

                  {asset.usage_locations && asset.usage_locations.length > 1 && (
                    <div className="pt-1 border-t border-stone-800/60 flex items-center justify-between text-[10px]">
                      <span className="text-stone-500">Outros Vínculos:</span>
                      <span className="text-emerald-400 font-bold font-mono">
                        +{asset.usage_locations.length - 1} local(is)
                      </span>
                    </div>
                  )}

                  {/* Vínculo explícito com pratos do cardápio */}
                  {(() => {
                    const linked = products.filter((p) => p.primaryImageAssetId === asset.asset_id);
                    if (linked.length === 0) return null;
                    return (
                      <div className="pt-1.5 border-t border-stone-800/80 flex items-center justify-between text-[10px]">
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <Utensils className="w-3 h-3 text-emerald-400" />
                          Prato:
                        </span>
                        <span className="text-white font-bold truncate max-w-[130px]" title={linked.map((p) => p.name).join(', ')}>
                          {linked[0].name}
                        </span>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* BARRA DE AÇÕES COMPLETAS */}
              <div className="space-y-2 pt-2 border-t border-stone-800/80">
                <div className="grid grid-cols-2 gap-1.5">
                  {/* SUBSTITUIR */}
                  <button
                    onClick={() => {
                      setSelectedAsset(asset);
                      setReplaceFileBase64(null);
                      setReplaceFileName('');
                      setReplaceReason('');
                      setIsReplaceModalOpen(true);
                    }}
                    className="py-2 px-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Substituir</span>
                  </button>

                  {/* VERSÕES / ROLLBACK */}
                  <button
                    onClick={() => handleOpenHistory(asset)}
                    className="py-2 px-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                    <span>Versões</span>
                  </button>
                </div>

                <div className="flex items-center gap-1 justify-between text-[10px]">
                  {/* VISUALIZAR */}
                  <button
                    onClick={() => {
                      setSelectedAsset(asset);
                      setIsLightboxOpen(true);
                    }}
                    className="p-2 rounded-xl bg-[#0E131F] hover:bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer"
                    title="Visualizar em tamanho real"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>

                  {/* EDITAR METADADOS */}
                  <button
                    onClick={() => handleOpenEdit(asset)}
                    className="p-2 rounded-xl bg-[#0E131F] hover:bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer"
                    title="Editar informações"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  {/* VINCULAR A PRATO DO CARDÁPIO */}
                  <button
                    onClick={() => {
                      const linked = products.find((p) => p.primaryImageAssetId === asset.asset_id);
                      setSelectedAsset(asset);
                      setSelectedProductToLink(linked?.id || products[0]?.id || '');
                      setIsLinkProductModalOpen(true);
                    }}
                    className={`p-2 rounded-xl transition-colors cursor-pointer ${
                      products.some((p) => p.primaryImageAssetId === asset.asset_id)
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                        : 'bg-[#0E131F] hover:bg-emerald-950/60 text-stone-400 hover:text-emerald-400'
                    }`}
                    title="Vincular a um prato do Cardápio"
                  >
                    <Utensils className="w-3.5 h-3.5" />
                  </button>

                  {/* VINCULAR A OUTRO LOCAL */}
                  <button
                    onClick={() => {
                      setSelectedAsset(asset);
                      setIsMappingModalOpen(true);
                    }}
                    className="p-2 rounded-xl bg-[#0E131F] hover:bg-stone-800 text-stone-400 hover:text-cyan-400 transition-colors cursor-pointer"
                    title="Gerenciar onde este asset é utilizado"
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                  </button>

                  {/* ATIVAR / DESATIVAR */}
                  <button
                    onClick={() => handleToggleStatus(asset)}
                    className={`p-2 rounded-xl transition-colors cursor-pointer ${
                      asset.status === 'ACTIVE'
                        ? 'bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-400'
                        : 'bg-stone-900 hover:bg-stone-800 text-stone-500'
                    }`}
                    title={asset.status === 'ACTIVE' ? 'Desativar asset' : 'Ativar asset'}
                  >
                    <Power className="w-3.5 h-3.5" />
                  </button>

                  {/* EXCLUIR (Bloqueado para oficiais) */}
                  <button
                    onClick={() => handleDeleteAsset(asset)}
                    disabled={asset.is_official}
                    className={`p-2 rounded-xl transition-colors ${
                      asset.is_official
                        ? 'opacity-30 cursor-not-allowed text-stone-600'
                        : 'bg-[#0E131F] hover:bg-rose-950/50 text-stone-400 hover:text-rose-400 cursor-pointer'
                    }`}
                    title={asset.is_official ? 'Assets oficiais não podem ser excluídos' : 'Excluir asset'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: CADASTRAR NOVO ASSET (FLUXO COMPLETO REQUISITADO) */}
      {/* ========================================================================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <form
            onSubmit={handlePublishAsset}
            className="bg-[#13192B] border border-stone-700 rounded-3xl p-5 sm:p-6 max-w-xl w-full space-y-4 shadow-2xl my-8 animate-in fade-in zoom-in-95 max-h-[92vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-stone-800 pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  +
                </div>
                <div>
                  <h3 className="text-base font-black text-white font-['Outfit']">
                    Adicionar Novo Asset Visual
                  </h3>
                  <p className="text-[11px] text-stone-400">
                    O arquivo será enviado para o Cloud Storage e registrado no banco central.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-stone-400 hover:text-white p-1 rounded-xl hover:bg-stone-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conteúdo rolável */}
            <div className="space-y-4 text-xs overflow-y-auto pr-1 flex-1">
              {/* ÁREA DE SELEÇÃO DE IMAGEM / DRAG AND DROP REQUISITADA */}
              <div>
                <label className="text-stone-300 font-bold block mb-1.5">
                  1. SELECIONE OU ARRASTE SUA IMAGEM
                </label>

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingNew(true);
                  }}
                  onDragLeave={() => setIsDraggingNew(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingNew(false);
                    const droppedFile = e.dataTransfer.files?.[0];
                    if (droppedFile) {
                      processSelectedFile(
                        droppedFile,
                        setNewFileBase64,
                        setNewFileName,
                        setNewFileSize,
                        setNewMimeType
                      );
                    }
                  }}
                  onClick={() => newFileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-3xl p-5 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                    isDraggingNew
                      ? 'border-emerald-400 bg-emerald-950/40 text-emerald-300 scale-[1.01]'
                      : newFileBase64
                      ? 'border-emerald-500/50 bg-[#0E131F]'
                      : 'border-stone-700 hover:border-emerald-500/50 bg-[#0E131F]/80 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <input
                    ref={newFileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        processSelectedFile(
                          file,
                          setNewFileBase64,
                          setNewFileName,
                          setNewFileSize,
                          setNewMimeType
                        );
                      }
                      e.target.value = '';
                    }}
                    className="hidden"
                  />

                  {newFileBase64 ? (
                    <div className="w-full flex flex-col sm:flex-row items-center gap-4 text-left">
                      <div className="w-24 h-24 rounded-2xl bg-stone-900 border border-stone-700 overflow-hidden flex items-center justify-center shrink-0 p-1">
                        <img
                          src={newFileBase64}
                          alt="Prévia"
                          className="w-full h-full object-contain rounded-xl"
                        />
                      </div>
                      <div className="space-y-1 min-w-0">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block font-['Outfit']">
                          ✓ Imagem Selecionada com Sucesso
                        </span>
                        <h4 className="text-xs font-bold text-white truncate max-w-xs">
                          {newFileName}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] text-stone-400 font-mono">
                          <span>{formatBytes(newFileSize)}</span>
                          <span>•</span>
                          <span>{newMimeType || 'image/png'}</span>
                        </div>
                        <p className="text-[10px] text-stone-500 pt-1">
                          Clique aqui caso deseje escolher outro arquivo.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white font-['Outfit']">
                          Clique para selecionar do computador ou celular
                        </p>
                        <p className="text-[11px] text-stone-400 mt-0.5">
                          Ou arraste e solte o arquivo diretamente aqui
                        </p>
                      </div>
                      <span className="text-[10px] text-stone-500 font-mono">
                        Formatos aceitos: PNG, JPG/JPEG, WEBP, SVG • Limite de 15MB
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* DADOS DO ASSET REQUISITADOS */}
              <div className="space-y-3 pt-1 border-t border-stone-800">
                <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider font-['Outfit'] block">
                  2. DADOS DO ASSET
                </span>

                <div>
                  <label className="text-stone-300 font-bold block mb-1">Nome do Asset *</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Ex: Logo Principal do Header, Banner Marmitas Outono..."
                    className="w-full p-2.5 rounded-xl bg-[#0E131F] border border-stone-800 text-white text-xs outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-stone-300 font-bold block mb-1">Descrição</label>
                  <textarea
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Descreva a finalidade ou detalhes visuais deste asset..."
                    rows={2}
                    className="w-full p-2.5 rounded-xl bg-[#0E131F] border border-stone-800 text-white text-xs outline-none focus:border-emerald-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-stone-300 font-bold block mb-1">Categoria *</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#0E131F] border border-stone-800 text-white text-xs outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      {ASSET_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-stone-300 font-bold block mb-1">Status</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl bg-[#0E131F] border border-stone-800 text-white text-xs outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="ACTIVE">ACTIVE (Ativo)</option>
                      <option value="INACTIVE">INACTIVE (Inativo)</option>
                      <option value="DRAFT">DRAFT (Rascunho)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* ESCOLHER ONDE O ASSET APARECE REQUISITADO */}
              <div className="space-y-3 pt-1 border-t border-stone-800">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider font-['Outfit'] block">
                    3. ESCOLHER ONDE O ASSET APARECE
                  </span>
                  <span className="text-[10px] text-stone-500">
                    Vínculo visual automático
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-stone-300 font-bold block mb-1">Página do App *</label>
                    <select
                      value={newPage}
                      onChange={(e) => setNewPage(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#0E131F] border border-stone-800 text-white text-xs outline-none focus:border-cyan-500 cursor-pointer"
                    >
                      {ASSET_PAGES.map((pg) => (
                        <option key={pg} value={pg}>
                          {pg}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-stone-300 font-bold block mb-1">Componente Visual *</label>
                    <select
                      value={newComponent}
                      onChange={(e) => setNewComponent(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#0E131F] border border-stone-800 text-white text-xs outline-none focus:border-cyan-500 cursor-pointer"
                    >
                      {ASSET_COMPONENTS.map((cp) => (
                        <option key={cp} value={cp}>
                          {cp}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-stone-300 font-bold block mb-1">Posição / Slot</label>
                    <input
                      type="text"
                      value={newSlot}
                      onChange={(e) => setNewSlot(e.target.value)}
                      placeholder="Ex: Principal, Topo, Lateral"
                      className="w-full p-2.5 rounded-xl bg-[#0E131F] border border-stone-800 text-white text-xs outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="text-stone-300 font-bold block mb-1">Ordem de Exibição</label>
                    <input
                      type="number"
                      min="1"
                      value={newOrderNum}
                      onChange={(e) => setNewOrderNum(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#0E131F] border border-stone-800 text-white text-xs outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                {/* VINCULAR DIRETAMENTE A UM PRATO DO CARDÁPIO (REQUISITO 4) */}
                <div className="pt-2 border-t border-stone-800">
                  <label className="text-stone-300 font-bold block mb-1">
                    Vincular Imediatamente a um Prato do Cardápio (Opcional)
                  </label>
                  <select
                    value={linkDirectToProductId}
                    onChange={(e) => setLinkDirectToProductId(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#0E131F] border border-stone-800 text-white text-xs outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="">Não vincular a prato agora (Apenas salvar na biblioteca)</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.line === 'fit_premium' ? 'Fit Premium' : 'Linha Fit'})
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-stone-500 mt-1">
                    Se selecionado, o Cardápio atualizará a foto deste prato automaticamente.
                  </p>
                </div>
              </div>
            </div>

            {/* STATUS FEEDBACK BANNER (REQUISITO 1: Enviando..., Processando..., Concluído, Erro) */}
            {createPhase !== 'idle' && (
              <div
                className={`p-3 rounded-2xl flex items-center gap-2.5 text-xs font-mono shrink-0 ${
                  createPhase === 'erro'
                    ? 'bg-rose-950/60 border border-rose-500/40 text-rose-300'
                    : createPhase === 'concluido'
                    ? 'bg-emerald-950/80 border border-emerald-500 text-emerald-300'
                    : 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-300'
                }`}
              >
                {createPhase === 'enviando' || createPhase === 'processando' ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-400 shrink-0" />
                ) : createPhase === 'concluido' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span>{createStatusMsg}</span>
              </div>
            )}

            {/* Ações do Modal */}
            <div className="pt-3 border-t border-stone-800 flex items-center justify-end gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setCreatePhase('idle');
                  setCreateStatusMsg('');
                }}
                disabled={submittingCreate}
                className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
              >
                CANCELAR
              </button>

              <button
                type="submit"
                disabled={submittingCreate || !newFileBase64 || !newName.trim()}
                className="px-6 py-2.5 rounded-xl bg-[#0EB24A] hover:bg-[#0ca042] text-stone-950 text-xs font-black uppercase tracking-wider font-['Outfit'] flex items-center gap-2 cursor-pointer shadow-lg disabled:opacity-40 transition-all active:scale-95"
              >
                {createPhase === 'enviando' ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>ENVIANDO...</span>
                  </>
                ) : createPhase === 'processando' ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>PROCESSANDO...</span>
                  </>
                ) : createPhase === 'concluido' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>CONCLUÍDO!</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>PUBLICAR ASSET</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: SUBSTITUIR IMAGEM (NOVA VERSÃO + PRESERVAÇÃO DE HISTÓRICO) */}
      {/* ========================================================================= */}
      {isReplaceModalOpen && selectedAsset && (
        <div className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <form
            onSubmit={handleExecuteReplace}
            className="bg-[#13192B] border border-stone-700 rounded-3xl p-5 sm:p-6 max-w-lg w-full space-y-4 shadow-2xl my-8 animate-in fade-in zoom-in-95"
          >
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-base font-black text-white font-['Outfit']">
                    Substituir Imagem (v{selectedAsset.version} → v{selectedAsset.version + 1})
                  </h3>
                  <span className="text-[10px] text-stone-400 font-mono truncate block max-w-xs">
                    {selectedAsset.name}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsReplaceModalOpen(false)}
                className="text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Aviso de segurança e versionamento */}
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 space-y-1">
              <span className="font-bold flex items-center gap-1.5 font-['Outfit']">
                <ShieldCheck className="w-4 h-4" />
                Garantia de Versionamento e Segurança
              </span>
              <p className="text-[11px] text-stone-300 leading-relaxed">
                A imagem atual (v{selectedAsset.version}) será preservada no histórico permanente do Cloud Storage + PostgreSQL. Todos os componentes vinculados passarão a usar a nova versão ativa automaticamente sem alterar código.
              </p>
            </div>

            {/* SELEÇÃO DA NOVA IMAGEM */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-stone-300 font-bold block mb-1.5">
                  Selecione ou arraste o novo arquivo de imagem
                </label>

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingReplace(true);
                  }}
                  onDragLeave={() => setIsDraggingReplace(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingReplace(false);
                    const droppedFile = e.dataTransfer.files?.[0];
                    if (droppedFile) {
                      processSelectedFile(
                        droppedFile,
                        setReplaceFileBase64,
                        setReplaceFileName,
                        setReplaceFileSize,
                        setReplaceMimeType
                      );
                    }
                  }}
                  onClick={() => replaceFileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-3xl p-4 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                    isDraggingReplace
                      ? 'border-emerald-400 bg-emerald-950/40'
                      : replaceFileBase64
                      ? 'border-emerald-500/60 bg-[#0E131F]'
                      : 'border-stone-700 bg-[#0E131F]/80 text-stone-400'
                  }`}
                >
                  <input
                    ref={replaceFileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        processSelectedFile(
                          file,
                          setReplaceFileBase64,
                          setReplaceFileName,
                          setReplaceFileSize,
                          setReplaceMimeType
                        );
                      }
                      e.target.value = '';
                    }}
                    className="hidden"
                  />

                  {replaceFileBase64 ? (
                    <div className="flex items-center gap-3 text-left w-full">
                      <div className="w-16 h-16 rounded-xl bg-stone-900 border border-stone-700 overflow-hidden flex items-center justify-center shrink-0 p-1">
                        <img src={replaceFileBase64} alt="Nova" className="w-full h-full object-contain" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] text-emerald-400 font-bold uppercase font-['Outfit'] block">
                          Nova Versão Pronta
                        </span>
                        <h5 className="text-xs font-bold text-white truncate">{replaceFileName}</h5>
                        <span className="text-[10px] text-stone-400 font-mono">
                          {formatBytes(replaceFileSize)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-emerald-400" />
                      <p className="text-xs font-bold text-white font-['Outfit']">
                        Clique ou arraste a nova imagem aqui
                      </p>
                      <span className="text-[10px] text-stone-500 font-mono">
                        PNG, JPG, WEBP, SVG • Máx 15MB
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* MOTIVO OBRIGATÓRIO PARA AUDIT LOG */}
              <div>
                <label className="text-stone-300 font-bold block mb-1">
                  Motivo da Substituição (Audit Trail Obrigatório) *
                </label>
                <textarea
                  value={replaceReason}
                  onChange={(e) => setReplaceReason(e.target.value)}
                  placeholder="Ex: Atualização da foto oficial do prato para nova embalagem sustentável 2026."
                  rows={3}
                  className="w-full p-2.5 rounded-xl bg-[#0E131F] border border-stone-800 text-white text-xs outline-none focus:border-emerald-500 resize-none"
                  required
                />
              </div>
            </div>

            {/* STATUS FEEDBACK BANNER (REQUISITO 1: Enviando..., Processando..., Concluído, Erro) */}
            {replacePhase !== 'idle' && (
              <div
                className={`p-3 rounded-2xl flex items-center gap-2.5 text-xs font-mono shrink-0 ${
                  replacePhase === 'erro'
                    ? 'bg-rose-950/60 border border-rose-500/40 text-rose-300'
                    : replacePhase === 'concluido'
                    ? 'bg-emerald-950/80 border border-emerald-500 text-emerald-300'
                    : 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-300'
                }`}
              >
                {replacePhase === 'enviando' || replacePhase === 'processando' ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-400 shrink-0" />
                ) : replacePhase === 'concluido' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span>{replaceStatusMsg}</span>
              </div>
            )}

            {/* Ações */}
            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setIsReplaceModalOpen(false);
                  setReplacePhase('idle');
                  setReplaceStatusMsg('');
                }}
                disabled={submittingReplace}
                className="px-4 py-2.5 rounded-xl bg-stone-800 text-stone-300 text-xs font-bold cursor-pointer disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={submittingReplace || !replaceFileBase64 || !replaceReason.trim()}
                className="px-5 py-2.5 rounded-xl bg-[#0EB24A] hover:bg-[#0ca042] text-stone-950 text-xs font-black uppercase tracking-wider font-['Outfit'] flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-40"
              >
                {replacePhase === 'enviando' ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Enviando nova imagem...</span>
                  </>
                ) : replacePhase === 'processando' ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processando v{selectedAsset.version + 1}...</span>
                  </>
                ) : replacePhase === 'concluido' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Concluído!</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Publicar Nova Versão</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: HISTÓRICO DE VERSÕES & ROLLBACK IMEDIATO */}
      {/* ========================================================================= */}
      {isHistoryModalOpen && selectedAsset && (
        <div className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-[#13192B] border border-stone-700 rounded-3xl p-5 sm:p-6 max-w-xl w-full space-y-4 shadow-2xl max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-base font-black text-white font-['Outfit']">
                    Histórico de Versões & Rollback
                  </h3>
                  <span className="text-[10px] text-stone-400 font-mono truncate block max-w-xs">
                    {selectedAsset.name} (Versão Ativa Atual: v{selectedAsset.version})
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsHistoryModalOpen(false)}
                className="text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto pr-1 space-y-3 flex-1 text-xs">
              {loadingHistory ? (
                <div className="py-12 text-center space-y-2">
                  <RefreshCw className="w-6 h-6 text-emerald-400 animate-spin mx-auto" />
                  <p className="text-xs text-stone-400">Carregando histórico do Cloud SQL...</p>
                </div>
              ) : historyList.length === 0 ? (
                <div className="py-10 text-center bg-[#0E131F] rounded-2xl border border-stone-800 p-6 text-xs text-stone-400 space-y-2">
                  <RotateCcw className="w-8 h-8 text-stone-600 mx-auto" />
                  <p className="font-bold text-white font-['Outfit']">Asset na Versão Inicial (v1)</p>
                  <p className="text-[11px] text-stone-500">
                    Ainda não há substituições anteriores registradas para este asset. Quando você substituir a imagem, as versões passadas ficarão arquivadas aqui para restauração em 1 clique.
                  </p>
                </div>
              ) : (
                historyList.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-[#0E131F] border border-stone-800 hover:border-stone-700 flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-14 h-14 rounded-xl bg-stone-900 border border-stone-700 overflow-hidden flex items-center justify-center shrink-0 p-1">
                        <img
                          src={item.file_url}
                          alt={`v${item.version}`}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.src = '/assets/brand/mermi-logo.png';
                          }}
                        />
                      </div>

                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-black text-white font-['Outfit']">
                            Versão v{item.version}
                          </span>
                          <span className="text-[10px] text-stone-500 font-mono">
                            {new Date(item.created_at).toLocaleDateString('pt-BR')} às{' '}
                            {new Date(item.created_at).toLocaleTimeString('pt-BR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-300 truncate">{item.reason}</p>
                        <span className="text-[9px] text-stone-500 block">
                          Por: <strong className="text-stone-400">{item.changed_by}</strong>
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRollback(item.version)}
                      className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shrink-0 active:scale-95"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reverter</span>
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 border-t border-stone-800 text-right">
              <button
                onClick={() => setIsHistoryModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: ONDE ESTE ASSET É UTILIZADO (MAPEAMENTO VISUAL COMPLETO) */}
      {/* ========================================================================= */}
      {isMappingModalOpen && selectedAsset && (
        <div className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-[#13192B] border border-stone-700 rounded-3xl p-5 sm:p-6 max-w-lg w-full space-y-4 shadow-2xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-cyan-400" />
                <div>
                  <h3 className="text-base font-black text-white font-['Outfit']">
                    Onde Este Asset é Utilizado
                  </h3>
                  <span className="text-[10px] text-stone-400 font-mono truncate block max-w-xs">
                    {selectedAsset.name}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsMappingModalOpen(false)}
                className="text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Lista de Vínculos Atuais */}
            <div className="space-y-3 overflow-y-auto pr-1 flex-1 text-xs">
              <span className="text-[10px] font-black uppercase text-stone-400 tracking-wider font-['Outfit'] block">
                LOCAIS VINCULADOS ATUALMENTE
              </span>

              {(!selectedAsset.usage_locations || selectedAsset.usage_locations.length === 0) ? (
                <div className="p-3.5 rounded-2xl bg-[#0E131F] border border-stone-800 text-stone-400 text-xs flex items-center justify-between">
                  <div>
                    <span className="text-white font-bold block">{selectedAsset.page}</span>
                    <span className="text-[11px] text-cyan-400">{selectedAsset.component}</span>
                  </div>
                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                    PADRÃO
                  </span>
                </div>
              ) : (
                selectedAsset.usage_locations.map((loc) => (
                  <div
                    key={loc.mapping_id}
                    className="p-3.5 rounded-2xl bg-[#0E131F] border border-stone-800 flex items-center justify-between gap-3"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold uppercase">{loc.page}</span>
                        <ArrowRight className="w-3 h-3 text-stone-500" />
                        <span className="text-cyan-300 font-bold">{loc.component}</span>
                      </div>
                      <span className="text-[10px] text-stone-500 block">
                        Slot: <strong className="text-stone-400">{loc.slot || 'Principal'}</strong>
                      </span>
                    </div>

                    <button
                      onClick={() => handleDeleteMapping(loc.mapping_id)}
                      className="p-1.5 rounded-xl bg-stone-900 hover:bg-rose-950/60 text-stone-500 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Desvincular deste local"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}

              {/* SEÇÃO: + VINCULAR A OUTRO LOCAL REQUISITADA */}
              <form onSubmit={handleAddMapping} className="pt-3 border-t border-stone-800 space-y-3">
                <span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider font-['Outfit'] block">
                  + VINCULAR A OUTRO LOCAL
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-stone-300 font-bold block mb-1">Página de Destino</label>
                    <select
                      value={linkPage}
                      onChange={(e) => setLinkPage(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#0E131F] border border-stone-800 text-white text-xs outline-none focus:border-cyan-500 cursor-pointer"
                    >
                      {ASSET_PAGES.map((pg) => (
                        <option key={pg} value={pg}>
                          {pg}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-stone-300 font-bold block mb-1">Componente de Destino</label>
                    <select
                      value={linkComponent}
                      onChange={(e) => setLinkComponent(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#0E131F] border border-stone-800 text-white text-xs outline-none focus:border-cyan-500 cursor-pointer"
                    >
                      {ASSET_COMPONENTS.map((cp) => (
                        <option key={cp} value={cp}>
                          {cp}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-stone-300 font-bold block mb-1">Slot / Posição</label>
                  <input
                    type="text"
                    value={linkSlot}
                    onChange={(e) => setLinkSlot(e.target.value)}
                    placeholder="Ex: Secundário, Footer, Lateral"
                    className="w-full p-2 rounded-xl bg-[#0E131F] border border-stone-800 text-white text-xs outline-none focus:border-cyan-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingLink}
                  className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-stone-950 font-black text-xs uppercase tracking-wider font-['Outfit'] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
                >
                  {submittingLink ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4 stroke-[3]" />
                  )}
                  <span>Adicionar Novo Vínculo Visual</span>
                </button>
              </form>
            </div>

            <div className="pt-2 border-t border-stone-800 text-right shrink-0">
              <button
                type="button"
                onClick={() => setIsMappingModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 text-xs font-bold cursor-pointer"
              >
                Concluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: VISUALIZAR IMAGEM (LIGHTBOX COMPLETO COM DETALHES TÉCNICOS) */}
      {/* ========================================================================= */}
      {isLightboxOpen && selectedAsset && (
        <div className="fixed inset-0 z-50 bg-stone-950/90 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-[#13192B] border border-stone-700 rounded-3xl p-5 sm:p-6 max-w-2xl w-full space-y-4 shadow-2xl max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div>
                <h3 className="text-base font-black text-white font-['Outfit'] truncate max-w-md">
                  {selectedAsset.name}
                </h3>
                <span className="text-[10px] text-stone-400 font-mono">
                  ID: {selectedAsset.asset_id} • Versão v{selectedAsset.version}
                </span>
              </div>

              <button
                onClick={() => setIsLightboxOpen(false)}
                className="text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Imagem em tamanho grande */}
            <div className="w-full max-h-80 sm:max-h-96 rounded-2xl bg-[#0E131F] border border-stone-800 flex items-center justify-center p-4 overflow-hidden">
              <img
                src={selectedAsset.file_url}
                alt={selectedAsset.name}
                className="max-w-full max-h-full object-contain rounded-xl"
              />
            </div>

            {/* Detalhes Técnicos & Copiar Link */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-[#0E131F] border border-stone-800">
                <span className="text-[9px] text-stone-500 block uppercase">Tamanho</span>
                <span className="text-white font-bold">{formatBytes(selectedAsset.file_size)}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0E131F] border border-stone-800">
                <span className="text-[9px] text-stone-500 block uppercase">Formato</span>
                <span className="text-white font-bold">{selectedAsset.mime_type || 'image/png'}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0E131F] border border-stone-800">
                <span className="text-[9px] text-stone-500 block uppercase">Status</span>
                <span className="text-emerald-400 font-bold">{selectedAsset.status}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0E131F] border border-stone-800">
                <span className="text-[9px] text-stone-500 block uppercase">Oficial</span>
                <span className={selectedAsset.is_official ? 'text-amber-400 font-bold' : 'text-stone-400'}>
                  {selectedAsset.is_official ? 'Sim (Protegido)' : 'Não'}
                </span>
              </div>
            </div>

            {/* Ações */}
            <div className="pt-2 border-t border-stone-800 flex items-center justify-between gap-2">
              <button
                onClick={() => handleCopyLink(selectedAsset.file_url)}
                className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedUrl ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedUrl ? 'Copiado!' : 'Copiar URL Direta'}</span>
              </button>

              <a
                href={selectedAsset.file_url}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <span>Abrir Original</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 6: EDITAR METADADOS DO ASSET */}
      {/* ========================================================================= */}
      {isEditModalOpen && selectedAsset && (
        <div className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <form
            onSubmit={handleExecuteEdit}
            className="bg-[#13192B] border border-stone-700 rounded-3xl p-5 sm:p-6 max-w-lg w-full space-y-4 shadow-2xl animate-in fade-in zoom-in-95"
          >
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-black text-white font-['Outfit']">
                  Editar Metadados do Asset
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-stone-300 font-bold block mb-1">Nome do Asset *</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#0E131F] border border-stone-800 text-white text-xs outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="text-stone-300 font-bold block mb-1">Descrição</label>
                <textarea
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 rounded-xl bg-[#0E131F] border border-stone-800 text-white text-xs outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-300 font-bold block mb-1">Categoria</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#0E131F] border border-stone-800 text-white text-xs outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    {ASSET_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-stone-300 font-bold block mb-1">Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#0E131F] border border-stone-800 text-white text-xs outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="ACTIVE">ACTIVE (Ativo)</option>
                    <option value="INACTIVE">INACTIVE (Inativo)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-300 font-bold block mb-1">Página Principal</label>
                  <select
                    value={editPage}
                    onChange={(e) => setEditPage(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#0E131F] border border-stone-800 text-white text-xs outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    {ASSET_PAGES.map((pg) => (
                      <option key={pg} value={pg}>
                        {pg}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-stone-300 font-bold block mb-1">Componente Principal</label>
                  <select
                    value={editComponent}
                    onChange={(e) => setEditComponent(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#0E131F] border border-stone-800 text-white text-xs outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    {ASSET_COMPONENTS.map((cp) => (
                      <option key={cp} value={cp}>
                        {cp}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-stone-800 text-stone-300 text-xs font-bold cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={submittingEdit || !editName.trim()}
                className="px-5 py-2.5 rounded-xl bg-[#0EB24A] hover:bg-[#0ca042] text-stone-950 text-xs font-black uppercase tracking-wider font-['Outfit'] cursor-pointer shadow-md disabled:opacity-50"
              >
                {submittingEdit ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL VINCULAR ASSET DIRETAMENTE A UM PRATO DO CARDÁPIO */}
      {isLinkProductModalOpen && selectedAsset && (
        <div className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-[#13192B] border border-stone-700 rounded-3xl p-5 sm:p-6 max-w-md w-full space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Utensils className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white font-['Outfit']">
                    Vincular Asset ao Cardápio
                  </h3>
                  <p className="text-[11px] text-stone-400 font-mono">
                    ID: {selectedAsset.asset_id}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsLinkProductModalOpen(false)}
                className="text-stone-400 hover:text-white p-1 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#0E131F] border border-stone-800">
              <div className="w-14 h-14 rounded-xl bg-stone-900 border border-stone-800 overflow-hidden flex items-center justify-center p-1 shrink-0">
                <img src={selectedAsset.file_url} alt={selectedAsset.name} className="w-full h-full object-contain" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-white truncate">{selectedAsset.name}</h4>
                <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-mono">
                  <span>v{selectedAsset.version}</span>
                  <span>•</span>
                  <span>{selectedAsset.category}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <label className="text-stone-300 font-bold block">Selecione o Prato de Destino:</label>
              <select
                value={selectedProductToLink}
                onChange={(e) => setSelectedProductToLink(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#0E131F] border border-stone-800 text-white text-xs outline-none focus:border-emerald-500 cursor-pointer"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.line === 'fit_premium' ? 'Fit Premium' : 'Linha Fit'})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-800">
              <button
                type="button"
                onClick={() => setIsLinkProductModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 text-xs font-bold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (!selectedProductToLink) return;
                  await linkProductImageAsset(selectedProductToLink, selectedAsset.asset_id);
                  setIsLinkProductModalOpen(false);
                  await Promise.all([loadAssets(), refreshProducts()]);
                }}
                className="px-5 py-2 rounded-xl bg-[#0EB24A] hover:bg-[#0ca042] text-stone-950 font-black text-xs uppercase tracking-wider font-['Outfit'] cursor-pointer"
              >
                Confirmar Vínculo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
