import React, { useState } from 'react';
import { useMermiStore } from '../../context/MermiStoreContext';
import { ContentPublication, PublicationType } from '../../types/homeContent';
import { OfficialPointsBadge } from '../brand/OfficialPointsBadge';
import {
  Sparkles,
  ChevronRight,
  Flame,
  Award,
  Zap,
  Tag,
  Calendar,
  Layers,
  LayoutGrid,
  SlidersHorizontal,
  X,
  Share2,
  Bookmark,
  Heart,
  Eye,
  TrendingUp,
  Clock
} from 'lucide-react';

interface ContentCentralSectionProps {
  onNavigate: (destination: string) => void;
}

export const ContentCentralSection: React.FC<ContentCentralSectionProps> = ({ onNavigate }) => {
  const {
    publications,
    weeklyMember,
    audienceProfile,
    trackEvent
  } = useMermiStore();

  const [activeFilter, setActiveFilter] = useState<'todos' | PublicationType>('todos');
  const [activeFormatView, setActiveFormatView] = useState<'todos' | 'carrossel' | 'cards' | 'destaque'>('todos');
  const [selectedPublication, setSelectedPublication] = useState<ContentPublication | null>(null);

  const today = new Date().toISOString().split('T')[0];

  // Filtra publicações ativas, válidas por data e pelo público atual
  const activePubs = publications
    .filter((p) => p.ativo)
    .filter((p) => {
      if (p.dataInicial && p.dataInicial > today) return false;
      if (p.dataFinal && p.dataFinal < today) return false;
      return true;
    })
    .filter((p) => {
      if (p.publico === 'all') return true;
      if (audienceProfile === 'standard') return true;
      if (p.publico === 'new_users' && audienceProfile === 'new_user') return true;
      if (p.publico === 'challenge_active' && audienceProfile === 'challenge_user') return true;
      if (p.publico === 'points_ready' && audienceProfile === 'points_ready_user') return true;
      if (p.publico === 'race_ready' && audienceProfile === 'race_user') return true;
      if (p.publico === 'inactive' && audienceProfile === 'inactive_user') return true;
      return true;
    })
    .sort((a, b) => a.ordem - b.ordem);

  // Aplica filtro por tipo
  const filteredPubs = activeFilter === 'todos'
    ? activePubs
    : activePubs.filter((p) => p.tipo === activeFilter);

  const filterTabs: Array<{ id: 'todos' | PublicationType; label: string; icon?: string }> = [
    { id: 'todos', label: 'Tudo' },
    { id: 'campanha', label: 'Campanhas', icon: '⚡' },
    { id: 'novidade', label: 'Novidades', icon: '🍃' },
    { id: 'membro_semana', label: 'Membro da Semana', icon: '👑' },
    { id: 'mermi_run', label: 'MerMi Run', icon: '🏃' },
    { id: 'promocao', label: 'Promoções', icon: '🏷️' },
    { id: 'desafio', label: 'Desafios', icon: '🎯' },
    { id: 'aviso', label: 'Avisos', icon: '📢' },
    { id: 'post', label: 'Dicas & Posts', icon: '✍️' },
    { id: 'produto_destaque', label: 'Produtos', icon: '🍱' },
  ];

  const getTipoVisual = (tipo: PublicationType) => {
    switch (tipo) {
      case 'campanha':
        return { label: 'CAMPANHA', badgeClass: 'bg-emerald-500/20 text-[#0EB24A] border-emerald-500/40', dot: '⚡' };
      case 'membro_semana':
        return { label: 'MEMBRO DA SEMANA', badgeClass: 'bg-amber-500/20 text-amber-500 border-amber-400/40', dot: '👑' };
      case 'mermi_run':
        return { label: 'MERMI RUN', badgeClass: 'bg-red-500/20 text-red-500 border-red-500/40', dot: '🏃' };
      case 'promocao':
        return { label: 'PROMOÇÃO', badgeClass: 'bg-orange-500/20 text-orange-500 border-orange-500/40', dot: '🏷️' };
      case 'novidade':
        return { label: 'NOVIDADE', badgeClass: 'bg-cyan-500/20 text-cyan-600 border-cyan-500/40', dot: '✨' };
      case 'aviso':
        return { label: 'AVISO', badgeClass: 'bg-stone-500/20 text-stone-700 border-stone-400/40', dot: '📢' };
      case 'desafio':
        return { label: 'DESAFIO', badgeClass: 'bg-blue-500/20 text-blue-600 border-blue-500/40', dot: '🎯' };
      case 'produto_destaque':
        return { label: 'PRODUTO', badgeClass: 'bg-emerald-600/20 text-emerald-700 border-emerald-600/40', dot: '🍱' };
      case 'post':
      default:
        return { label: 'POST / CONTEÚDO', badgeClass: 'bg-stone-200 text-stone-700 border-stone-300', dot: '📝' };
    }
  };

  const handleActionClick = (pub: ContentPublication) => {
    trackEvent('campaign_click', pub.id, pub.titulo);
    if (pub.destino) {
      onNavigate(pub.destino);
    } else {
      setSelectedPublication(pub);
    }
  };

  return (
    <div className="w-full space-y-3">
      {/* CABEÇALHO DO CENTRO DE CONTEÚDO */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
        <div>
          <h2 className="text-xs font-black uppercase tracking-wider text-stone-800 font-['Outfit'] flex items-center gap-1.5">
            <Sparkles size={14} className="text-[#0EB24A]" />
            DESTAQUES MERMI FIT LIFE
          </h2>
          <p className="text-[10px] text-stone-500 font-medium">
            Novidades & Campanhas Oficiais Centralizadas
          </p>
        </div>

        {/* CONTADOR / CHIP */}
        <span className="self-start sm:self-auto text-[10px] font-bold text-stone-400 bg-stone-100 px-2.5 py-1 rounded-full border border-stone-200">
          {filteredPubs.length} publicação(ões)
        </span>
      </div>

      {/* TABS DE FILTRO POR TIPO (Administráveis e dinâmicas) */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 pt-0.5 -mx-1 px-1">
        {filterTabs.map((tab) => {
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                isActive
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white text-stone-600 border border-stone-200/90 hover:bg-stone-50'
              }`}
            >
              {tab.icon && <span>{tab.icon}</span>}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* FEED DINÂMICO DE PUBLICAÇÕES (CARROSSEL + CARDS + BANNERS) */}
      <div className="space-y-3.5">
        {filteredPubs.map((pub) => {
          const visual = getTipoVisual(pub.tipo);
          const isBannerFormat = pub.formato === 'banner' || pub.formato === 'destaque';

          if (isBannerFormat) {
            return (
              <div
                key={pub.id}
                className="relative rounded-3xl overflow-hidden shadow-md border border-stone-800 bg-gradient-to-br from-stone-950 via-[#121212] to-black text-white p-5 sm:p-6 transition-all hover:border-emerald-500/50 group"
              >
                {/* Glow ambient */}
                <div className="absolute top-0 right-0 w-52 h-52 bg-[#0EB24A]/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
                  {/* IMAGEM DO ASSET OFICIAL (SEM DISTORÇÃO) */}
                  <div className="w-full md:w-44 h-36 shrink-0 bg-stone-900/80 rounded-2xl p-2 border border-stone-800 flex items-center justify-center overflow-hidden">
                    <img
                      src={pub.imagem}
                      alt={pub.titulo}
                      className="w-full h-full object-contain object-center"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* CONTEÚDO EDITORIAL */}
                  <div className="flex-1 text-center md:text-left min-w-0">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1.5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border font-['Outfit'] ${visual.badgeClass}`}>
                        <span>{visual.dot}</span>
                        <span>{pub.badge || visual.label}</span>
                      </span>
                      {pub.precoDestaque && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-bold">
                          {pub.precoDestaque}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-white font-['Outfit'] leading-tight">
                      {pub.titulo}
                    </h3>
                    <p className="text-xs text-stone-300 mt-1 line-clamp-2 leading-relaxed">
                      {pub.descricao}
                    </p>

                    {pub.beneficios && (
                      <div className="mt-2 text-[11px] text-amber-300 font-semibold flex items-center justify-center md:justify-start gap-1">
                        <span>🎁 Benefícios:</span>
                        <span className="text-stone-300">{pub.beneficios}</span>
                      </div>
                    )}
                  </div>

                  {/* BOTÃO CLARO DE AÇÃO */}
                  <div className="shrink-0 self-center md:self-center">
                    <button
                      onClick={() => handleActionClick(pub)}
                      className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#0EB24A] to-emerald-600 hover:brightness-110 active:scale-95 text-white font-black text-xs uppercase font-['Outfit'] tracking-wider shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{pub.botao || 'VER DETALHES'}</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          }

          // FORMATO CARD / CARROSSEL
          return (
            <div
              key={pub.id}
              className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200/90 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-center justify-between gap-4 group"
            >
              <div className="flex items-center gap-3.5 w-full sm:w-auto">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-stone-100 border border-stone-200/80 p-1.5 shrink-0 flex items-center justify-center overflow-hidden">
                  <img
                    src={pub.imagem}
                    alt={pub.titulo}
                    className="w-full h-full object-contain object-center rounded-xl"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border font-['Outfit'] ${visual.badgeClass}`}>
                      <span>{visual.dot}</span>
                      <span>{pub.badge || visual.label}</span>
                    </span>
                    {pub.precoDestaque && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[#0EB24A] border border-emerald-200 text-[9px] font-bold">
                        {pub.precoDestaque}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm sm:text-base font-extrabold text-stone-900 font-['Outfit'] leading-snug line-clamp-1 group-hover:text-[#0EB24A] transition-colors">
                    {pub.titulo}
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5 line-clamp-2 leading-relaxed">
                    {pub.descricao}
                  </p>
                </div>
              </div>

              <div className="w-full sm:w-auto flex items-center justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                <button
                  onClick={() => handleActionClick(pub)}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 active:scale-95 text-white font-bold text-xs uppercase font-['Outfit'] tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>{pub.botao || 'ACESSAR'}</span>
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          );
        })}

        {filteredPubs.length === 0 && (
          <div className="bg-white rounded-3xl p-8 border border-stone-200 text-center space-y-2">
            <span className="text-3xl">📭</span>
            <p className="font-bold text-sm text-stone-800 font-['Outfit']">
              Nenhuma publicação ativa nesta categoria
            </p>
            <p className="text-xs text-stone-500">
              O administrador pode publicar novos conteúdos diretamente no MerMi Control.
            </p>
          </div>
        )}
      </div>

      {/* MODAL UNIVERSAL DE LEITURA (Evita criar uma página/template para cada campanha) */}
      {selectedPublication && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="max-w-lg w-full bg-white rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setSelectedPublication(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 cursor-pointer"
            >
              <X size={16} />
            </button>

            <div className="w-full h-48 rounded-2xl bg-stone-900 p-2 flex items-center justify-center overflow-hidden">
              <img
                src={selectedPublication.imagem}
                alt={selectedPublication.titulo}
                className="w-full h-full object-contain object-center"
              />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase text-[#0EB24A] tracking-wider font-['Outfit']">
                {selectedPublication.badge || selectedPublication.tipo}
              </span>
              <h3 className="text-xl font-black text-stone-900 font-['Outfit']">
                {selectedPublication.titulo}
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                {selectedPublication.descricao}
              </p>

              {selectedPublication.beneficios && (
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                  <span className="font-bold block mb-1">Benefícios Inclusos:</span>
                  {selectedPublication.beneficios}
                </div>
              )}
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => {
                  const dest = selectedPublication.destino;
                  setSelectedPublication(null);
                  if (dest) onNavigate(dest);
                }}
                className="flex-1 py-3 rounded-xl bg-[#0EB24A] hover:bg-emerald-600 text-white font-black text-xs font-['Outfit'] uppercase tracking-wider cursor-pointer"
              >
                {selectedPublication.botao || 'Acessar Agora'}
              </button>
              <button
                onClick={() => setSelectedPublication(null)}
                className="px-4 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs uppercase cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
