import React from 'react';
import { useMermiStore } from '../../context/MermiStoreContext';
import { MembroSemanaSpotlight } from '../home/MembroSemanaSpotlight';
import { HeroCarousel } from '../home/HeroCarousel';
import { ContentCentralSection } from '../home/ContentCentralSection';
import { FeaturedProductsBlock } from '../home/FeaturedProductsBlock';
import { PointsCompactBlock } from '../home/PointsCompactBlock';
import { QuickActionsGrid } from '../home/QuickActionsGrid';
import { EvolutionCompactBlock } from '../home/EvolutionCompactBlock';
import { DropSurpresaHomeCard } from '../home/DropSurpresaHomeCard';
import { MermiIABlock } from '../home/MermiIABlock';
import { ActiveChallengeBlock } from '../home/ActiveChallengeBlock';
import { HomeBlockConfig } from '../../types/homeContent';

export interface HomeLifestyleViewProps {
  onNavigate: (tab: string) => void;
  onOpenCustomize?: () => void;
}

/**
 * MERMI FIT LIFE — HOME LIFESTYLE
 * 
 * Regra de Arquitetura (Ajuste Final da Home):
 * - A Home permanece limpa e não transforma cada funcionalidade em template permanente.
 * - Prioridade visual oficial:
 *   1. Saudação / identidade
 *   2. Destaque principal
 *   3. Posts & Campanhas (Centro dinâmico)
 *   4. Marmitas / produtos em destaque
 *   5. MerMi Points
 *   6. Ações rápidas
 *   7. Evolução / rotina
 *   8. Outros módulos conforme configuração (Drop Surpresa, MerMi IA, Desafios)
 * - A ordem e visibilidade dos blocos são configuráveis pelo MERMI CONTROL.
 */
export const HomeLifestyleView: React.FC<HomeLifestyleViewProps> = ({
  onNavigate,
  onOpenCustomize
}) => {
  const { user, homeBlocks, weeklyMember } = useMermiStore();

  const firstName = user.name ? user.name.split(' ')[0] : 'Membro';

  // Ordena os blocos ativos configurados no MerMi Control
  const sortedBlocks = [...homeBlocks]
    .filter((b) => b.enabled)
    .sort((a, b) => a.order - b.order);

  // Renderiza cada bloco dinamicamente respeitando a ordem e visibilidade do MerMi Control
  const renderBlock = (block: HomeBlockConfig) => {
    switch (block.key) {
      case 'greeting_header':
        return (
          <div key={block.id} className="space-y-4">
            {/* 1. SAUDAÇÃO PERSONALIZADA */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200/90 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#0EB24A] flex items-center gap-1 font-['Outfit']">
                  <span>🍃</span> ESCOLHAS MELHORES, DIAS INCRÍVEIS
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-stone-900 font-['Outfit'] mt-0.5">
                  Olá, {firstName}!
                </h1>
                <p className="text-xs text-stone-500 mt-0.5">
                  Saúde hoje. Grandes histórias amanhã.
                </p>
              </div>

              <button
                onClick={() => onNavigate('points')}
                className="flex flex-col items-end p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500/15 via-orange-500/15 to-rose-500/15 border border-amber-300/60 cursor-pointer hover:border-amber-400 transition-all text-right group active:scale-95"
                title="Abrir carteira de MerMi Points"
              >
                <span className="text-[9px] font-bold text-amber-800 uppercase tracking-wider">
                  Saldo de Points
                </span>
                <span className="text-base sm:text-lg font-black text-stone-950 font-['Outfit'] flex items-center gap-1">
                  ⭐ {user.mermiPoints.toLocaleString('pt-BR')} <span className="text-[10px] font-bold text-stone-500">pts</span>
                </span>
              </button>
            </div>

            {/* Destaque opcional do Membro da Semana no topo (apenas quando ativo e configurado) */}
            {weeklyMember.featuredOnHome && (
              <MembroSemanaSpotlight onNavigate={onNavigate} />
            )}
          </div>
        );

      case 'main_highlight':
      case 'hero_carousel':
        return (
          <div key={block.id}>
            <HeroCarousel onNavigate={onNavigate} />
          </div>
        );

      case 'posts_campanhas':
        return (
          <div key={block.id}>
            <ContentCentralSection onNavigate={onNavigate} />
          </div>
        );

      case 'featured_products':
        return (
          <div key={block.id}>
            <FeaturedProductsBlock
              onNavigate={onNavigate}
              onOpenCustomize={onOpenCustomize}
            />
          </div>
        );

      case 'mermi_points':
        return (
          <div key={block.id}>
            <PointsCompactBlock onNavigate={onNavigate} />
          </div>
        );

      case 'quick_actions':
        return (
          <div key={block.id}>
            <QuickActionsGrid onNavigate={onNavigate} />
          </div>
        );

      case 'evolution_summary':
        return (
          <div key={block.id}>
            <EvolutionCompactBlock onNavigate={onNavigate} />
          </div>
        );

      case 'drop_surpresa':
        return (
          <div key={block.id}>
            <DropSurpresaHomeCard onNavigate={onNavigate} />
          </div>
        );

      case 'mermi_ia':
        return (
          <div key={block.id}>
            <MermiIABlock onNavigate={onNavigate} />
          </div>
        );

      case 'active_challenge':
      case 'next_race':
        return (
          <div key={block.id}>
            <ActiveChallengeBlock onNavigate={onNavigate} />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF7EE] text-stone-900 pb-28 pt-2 px-3 sm:px-4">
      <div className="max-w-2xl mx-auto space-y-4 sm:space-y-5">
        {/* Renderiza os blocos na ordem configurada no MerMi Control */}
        {sortedBlocks.map(renderBlock)}

        {/* RODAPÉ INSTITUCIONAL DISCRETO */}
        <div className="pt-4 text-center text-stone-400 text-xs space-y-1">
          <p className="font-bold text-stone-500 font-['Outfit']">
            MERMI FIT LIFE • ALIMENTAÇÃO, SAÚDE E ESTILO DE VIDA
          </p>
          <p className="text-[11px]">
            Mais que um app. Um estilo de vida.
          </p>
        </div>
      </div>
    </div>
  );
};
