import React, { useState } from 'react';
import { useMermiStore } from '../../context/MermiStoreContext';
import { BannerItem, CampaignItem, PromotionOffer } from '../../types/homeContent';

interface HomeCMSAdminProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HomeCMSAdmin: React.FC<HomeCMSAdminProps> = ({ isOpen, onClose }) => {
  const {
    homeBlocks,
    toggleHomeBlock,
    moveHomeBlock,
    banners,
    addBanner,
    updateBanner,
    deleteBanner,
    duplicateBanner,
    toggleBannerActive,
    campaigns,
    addCampaign,
    updateCampaign,
    deleteCampaign,
    promotions,
    updatePromotion,
    addPromotion,
    deletePromotion,
    analyticsEvents,
    clearAnalytics,
    resetToOfficialDefaults
  } = useMermiStore();

  const [activeTab, setActiveTab] = useState<'blocks' | 'banners' | 'campaigns' | 'promotions' | 'analytics'>('blocks');

  // Form states for Banner Editing / Creation
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  const [bannerForm, setBannerForm] = useState<Omit<BannerItem, 'id'>>({
    title: '',
    subtitle: '',
    badge: 'Destaque',
    buttonText: 'Saiba Mais',
    destination: 'cardapio',
    order: 1,
    active: true,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    audience: 'all',
    priority: 'alta',
    visualTheme: 'green'
  });

  // Form states for Campaign Editing / Creation
  const [editingCampaignId, setEditingCampaignId] = useState<string | null>(null);
  const [campaignForm, setCampaignForm] = useState<Omit<CampaignItem, 'id'>>({
    name: '',
    title: '',
    description: '',
    cta: 'Participar',
    destination: 'cardapio',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    status: 'active',
    audience: 'all',
    priority: 'alta',
    type: 'LANÇAMENTO'
  });

  // Form states for Promotion Editing / Creation
  const [editingPromoId, setEditingPromoId] = useState<string | null>(null);
  const [promoForm, setPromoForm] = useState<Omit<PromotionOffer, 'id'>>({
    name: '',
    description: '',
    originalPrice: 29.9,
    discountedPrice: 24.9,
    discountPercent: 15,
    pointsReward: 15,
    validity: 'Válido esta semana',
    badge: 'Oferta',
    buttonText: 'Aproveitar',
    destination: 'cardapio',
    active: true,
    order: 1,
    category: 'marmita'
  });

  if (!isOpen) return null;

  // Banner Actions
  const handleStartCreateBanner = () => {
    setEditingBannerId('NEW');
    setBannerForm({
      title: 'Novo Banner Especial',
      subtitle: 'Descrição atrativa da promoção ou funcionalidade.',
      badge: 'Exclusivo',
      buttonText: 'Conhecer',
      destination: 'cardapio',
      order: banners.length + 1,
      active: true,
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      audience: 'all',
      priority: 'alta',
      visualTheme: 'green'
    });
  };

  const handleStartEditBanner = (b: BannerItem) => {
    setEditingBannerId(b.id);
    setBannerForm({
      title: b.title,
      subtitle: b.subtitle,
      badge: b.badge || '',
      buttonText: b.buttonText,
      destination: b.destination,
      order: b.order,
      active: b.active,
      startDate: b.startDate || '2026-01-01',
      endDate: b.endDate || '2026-12-31',
      audience: b.audience,
      priority: b.priority,
      visualTheme: b.visualTheme
    });
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBannerId === 'NEW') {
      addBanner(bannerForm);
    } else if (editingBannerId) {
      updateBanner(editingBannerId, bannerForm);
    }
    setEditingBannerId(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="bg-[#FAF7F2] rounded-3xl max-w-4xl w-full h-[90vh] flex flex-col shadow-2xl border border-stone-300 overflow-hidden">
        {/* Header */}
        <div className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">⚙️</span>
            <div>
              <h2 className="text-base sm:text-lg font-black font-['Outfit'] tracking-wide">
                Painel Administrativo da Home & CMS
              </h2>
              <p className="text-[11px] text-stone-400">
                Gerencie blocos, banners, campanhas, promoções e consulte analytics
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetToOfficialDefaults}
              className="text-xs text-amber-400 hover:text-amber-300 px-3 py-1 bg-amber-950/60 rounded-lg border border-amber-800/40"
              title="Restaura os dados iniciais dos Blocos 01, 02 e 03"
            >
              Restaurar Padrões
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-stone-300 font-bold transition-all"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white border-b border-stone-200 px-6 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
          {[
            { id: 'blocks', label: '1. Ordem dos Blocos', icon: '📑' },
            { id: 'banners', label: '2. Banners do Carrossel', icon: '🖼️' },
            { id: 'campaigns', label: '3. Campanhas', icon: '📢' },
            { id: 'promotions', label: '4. Ofertas & Promoções', icon: '🏷️' },
            { id: 'analytics', label: '5. Analytics em Tempo Real', icon: '📊' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-[#0EB24A] text-[#0EB24A]'
                  : 'border-transparent text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* TAB 1: BLOCKS ORDERING & TOGGLE */}
          {activeTab === 'blocks' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-stone-900 uppercase tracking-wider font-['Outfit']">
                    Estrutura de Blocos da Home
                  </h3>
                  <p className="text-xs text-stone-500">
                    Ative, desative ou mude a prioridade de exibição dos blocos independentes.
                  </p>
                </div>
                <span className="text-xs font-bold text-stone-500">
                  {homeBlocks.filter((b) => b.enabled).length} de {homeBlocks.length} ativos
                </span>
              </div>

              <div className="space-y-2.5">
                {[...homeBlocks]
                  .sort((a, b) => a.order - b.order)
                  .map((block, idx) => (
                    <div
                      key={block.id}
                      className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                        block.enabled ? 'bg-white border-stone-200 shadow-xs' : 'bg-stone-100/70 border-stone-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-xl bg-stone-100 text-stone-700 font-mono font-bold text-xs flex items-center justify-center">
                          {block.order}
                        </span>
                        <div>
                          <h4 className="text-sm font-bold text-stone-900">
                            {block.title}
                          </h4>
                          <p className="text-xs text-stone-500">
                            {block.subtitle || block.key}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Move Up */}
                        <button
                          disabled={idx === 0}
                          onClick={() => moveHomeBlock(block.id, 'up')}
                          className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 disabled:opacity-30 disabled:cursor-not-allowed text-stone-700 font-bold text-xs"
                          title="Subir bloco"
                        >
                          ▲
                        </button>
                        {/* Move Down */}
                        <button
                          disabled={idx === homeBlocks.length - 1}
                          onClick={() => moveHomeBlock(block.id, 'down')}
                          className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 disabled:opacity-30 disabled:cursor-not-allowed text-stone-700 font-bold text-xs"
                          title="Descer bloco"
                        >
                          ▼
                        </button>
                        {/* Enable/Disable Toggle */}
                        <button
                          onClick={() => toggleHomeBlock(block.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            block.enabled
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                          }`}
                        >
                          {block.enabled ? 'Ativo' : 'Oculto'}
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 2: BANNERS MANAGEMENT */}
          {activeTab === 'banners' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-black text-stone-900 uppercase tracking-wider font-['Outfit']">
                    Carrossel de Destaques
                  </h3>
                  <p className="text-xs text-stone-500">
                    Crie, edite, duplique e programe a exibição de banners no topo da Home.
                  </p>
                </div>
                <button
                  onClick={handleStartCreateBanner}
                  className="px-3.5 py-2 bg-[#0EB24A] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                >
                  <span>+ Criar Novo Banner</span>
                </button>
              </div>

              {/* Form Modal / Panel */}
              {editingBannerId && (
                <div className="mb-6 p-5 bg-white rounded-3xl border-2 border-[#0EB24A]/40 shadow-lg">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-stone-100">
                    <h4 className="text-sm font-black text-stone-900 font-['Outfit']">
                      {editingBannerId === 'NEW' ? 'Novo Banner' : 'Editar Banner'}
                    </h4>
                    <button
                      onClick={() => setEditingBannerId(null)}
                      className="text-stone-400 hover:text-stone-700 text-xs font-bold"
                    >
                      Fechar
                    </button>
                  </div>

                  <form onSubmit={handleSaveBanner} className="space-y-3.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Título</label>
                        <input
                          type="text"
                          required
                          value={bannerForm.title}
                          onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Badge Superior</label>
                        <input
                          type="text"
                          value={bannerForm.badge || ''}
                          onChange={(e) => setBannerForm({ ...bannerForm, badge: e.target.value })}
                          placeholder="Ex: Mais Pedido, Novidade..."
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Subtítulo / Descrição</label>
                      <textarea
                        rows={2}
                        required
                        value={bannerForm.subtitle}
                        onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Texto do Botão</label>
                        <input
                          type="text"
                          required
                          value={bannerForm.buttonText}
                          onChange={(e) => setBannerForm({ ...bannerForm, buttonText: e.target.value })}
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Destino (Página)</label>
                        <select
                          value={bannerForm.destination}
                          onChange={(e) => setBannerForm({ ...bannerForm, destination: e.target.value })}
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900"
                        >
                          <option value="cardapio">Cardápio Fit</option>
                          <option value="points">MerMi Points</option>
                          <option value="resgate">Resgate da Semana</option>
                          <option value="desafios">Desafios</option>
                          <option value="corridas">Corridas</option>
                          <option value="evolucao">Evolução</option>
                          <option value="comunidade">Comunidade</option>
                          <option value="ia">MerMi IA</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Tema Visual</label>
                        <select
                          value={bannerForm.visualTheme}
                          onChange={(e) => setBannerForm({ ...bannerForm, visualTheme: e.target.value as any })}
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900"
                        >
                          <option value="green">Verde MerMi (Saúde)</option>
                          <option value="dark">Preto Gamificação (Points)</option>
                          <option value="amber">Âmbar / Dourado (Conquistas)</option>
                          <option value="crimson">Vermelho Energia (Corridas)</option>
                          <option value="emerald">Esmeralda (Lifestyle)</option>
                        </select>
                      </div>
                    </div>

                    {/* Scheduling Dates */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Data Início</label>
                        <input
                          type="date"
                          value={bannerForm.startDate || '2026-01-01'}
                          onChange={(e) => setBannerForm({ ...bannerForm, startDate: e.target.value })}
                          className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Data Fim</label>
                        <input
                          type="date"
                          value={bannerForm.endDate || '2026-12-31'}
                          onChange={(e) => setBannerForm({ ...bannerForm, endDate: e.target.value })}
                          className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Público-Alvo</label>
                        <select
                          value={bannerForm.audience}
                          onChange={(e) => setBannerForm({ ...bannerForm, audience: e.target.value as any })}
                          className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900"
                        >
                          <option value="all">Todos os Usuários</option>
                          <option value="new_users">Novos Usuários</option>
                          <option value="frequent">Frequentes</option>
                          <option value="challenge_active">Com Desafio Ativo</option>
                          <option value="points_ready">Pronto p/ Resgate</option>
                          <option value="race_ready">Corredores</option>
                          <option value="inactive">Inativos / Retorno</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingBannerId(null)}
                        className="px-4 py-2 bg-stone-100 text-stone-700 text-xs font-bold rounded-xl"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-[#0EB24A] hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-xs"
                      >
                        Salvar Banner
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Banners List */}
              <div className="space-y-3">
                {banners.map((b) => (
                  <div
                    key={b.id}
                    className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          b.active ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                        }`}>
                          {b.active ? 'Ativo' : 'Pausado'}
                        </span>
                        {b.badge && (
                          <span className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full font-bold">
                            {b.badge}
                          </span>
                        )}
                        <span className="text-xs text-stone-400">
                          Público: <strong className="text-stone-700">{b.audience}</strong>
                        </span>
                      </div>

                      <h4 className="text-sm font-extrabold text-stone-900">{b.title}</h4>
                      <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">{b.subtitle}</p>
                      <p className="text-[11px] text-stone-400 mt-1">
                        Destino: <strong className="text-stone-700">/{b.destination}</strong> · Datas: {b.startDate} até {b.endDate}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => toggleBannerActive(b.id)}
                        className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-lg"
                        title={b.active ? 'Desativar' : 'Ativar'}
                      >
                        {b.active ? 'Pausar' : 'Ativar'}
                      </button>
                      <button
                        onClick={() => handleStartEditBanner(b)}
                        className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-lg"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => duplicateBanner(b.id)}
                        className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-lg"
                        title="Duplicar para editar"
                      >
                        Duplicar
                      </button>
                      <button
                        onClick={() => deleteBanner(b.id)}
                        className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-lg"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CAMPAIGNS */}
          {activeTab === 'campaigns' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-black text-stone-900 uppercase tracking-wider font-['Outfit']">
                    Campanhas Ativas & Programadas
                  </h3>
                  <p className="text-xs text-stone-500">
                    Defina tipos de campanha: Lançamento, Corrida, Desafio, Points, Produto, etc.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {campaigns.map((c) => (
                  <div key={c.id} className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-800">
                          {c.type}
                        </span>
                        <span className="text-xs font-bold text-stone-700">{c.name}</span>
                      </div>
                      <h4 className="text-sm font-extrabold text-stone-900">{c.title}</h4>
                      <p className="text-xs text-stone-500 mt-0.5">{c.description}</p>
                      <p className="text-[11px] text-stone-400 mt-1">
                        Período: {c.startDate} a {c.endDate} · CTA: "{c.cta}" → /{c.destination}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => deleteCampaign(c.id)}
                        className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold rounded-lg"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PROMOTIONS */}
          {activeTab === 'promotions' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-black text-stone-900 uppercase tracking-wider font-['Outfit']">
                    Ofertas & Promoções em Destaque
                  </h3>
                  <p className="text-xs text-stone-500">
                    Altere preços promocionais, bônus de points e condições especiais da Home.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {promotions.map((p) => (
                  <div key={p.id} className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {p.badge && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                            {p.badge}
                          </span>
                        )}
                        <span className="text-xs text-stone-400">{p.validity}</span>
                      </div>
                      <h4 className="text-sm font-black text-stone-900">{p.name}</h4>
                      <p className="text-xs text-stone-500">{p.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-black text-emerald-700">
                          R$ {p.discountedPrice?.toFixed(2).replace('.', ',')}
                        </span>
                        {p.originalPrice && (
                          <span className="text-xs text-stone-400 line-through">
                            R$ {p.originalPrice.toFixed(2).replace('.', ',')}
                          </span>
                        )}
                        {p.pointsReward && (
                          <span className="text-xs font-bold text-amber-600">
                            +{p.pointsReward} Points
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => deletePromotion(p.id)}
                        className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold rounded-lg"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: REAL-TIME ANALYTICS */}
          {activeTab === 'analytics' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-black text-stone-900 uppercase tracking-wider font-['Outfit']">
                    Analytics & Telemetria em Tempo Real
                  </h3>
                  <p className="text-xs text-stone-500">
                    Registro de impressões, cliques em banners, leituras e interações no ecossistema.
                  </p>
                </div>
                <button
                  onClick={clearAnalytics}
                  className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-bold rounded-xl"
                >
                  Limpar Histórico
                </button>
              </div>

              {/* Metric Counters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                <div className="p-3 bg-white rounded-2xl border border-stone-200">
                  <span className="text-xs text-stone-500 block">Total de Eventos</span>
                  <span className="text-xl font-black text-stone-900">{analyticsEvents.length}</span>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-stone-200">
                  <span className="text-xs text-stone-500 block">Visualizações de Banner</span>
                  <span className="text-xl font-black text-emerald-700">
                    {analyticsEvents.filter((e) => e.type === 'banner_view').length}
                  </span>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-stone-200">
                  <span className="text-xs text-stone-500 block">Cliques em Banners</span>
                  <span className="text-xl font-black text-blue-700">
                    {analyticsEvents.filter((e) => e.type === 'banner_click').length}
                  </span>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-stone-200">
                  <span className="text-xs text-stone-500 block">Interações na IA</span>
                  <span className="text-xl font-black text-purple-700">
                    {analyticsEvents.filter((e) => e.type === 'ai_click').length}
                  </span>
                </div>
              </div>

              {/* Events Log */}
              <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
                <div className="max-h-72 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-100 text-stone-700 border-b border-stone-200">
                      <tr>
                        <th className="p-2.5">Horário</th>
                        <th className="p-2.5">Tipo</th>
                        <th className="p-2.5">Alvo / Título</th>
                        <th className="p-2.5">ID Alvo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-stone-600">
                      {analyticsEvents.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-4 text-center text-stone-400">
                            Nenhum evento registrado ainda. Navegue pela Home para gerar métricas!
                          </td>
                        </tr>
                      ) : (
                        analyticsEvents.map((evt) => (
                          <tr key={evt.id} className="hover:bg-stone-50">
                            <td className="p-2.5 font-mono text-[11px]">{evt.timestamp}</td>
                            <td className="p-2.5">
                              <span className="px-2 py-0.5 rounded-md bg-stone-100 font-bold text-[10px]">
                                {evt.type}
                              </span>
                            </td>
                            <td className="p-2.5 font-semibold text-stone-800">{evt.targetTitle}</td>
                            <td className="p-2.5 font-mono text-[10px] text-stone-400">{evt.targetId}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
