import React, { useState } from 'react';
import { useMermiStore } from '../../context/MermiStoreContext';
import { ContentArticle, PostCategory } from '../../types/homeContent';

interface ContentSectionProps {
  onNavigate: (destination: string) => void;
}

export const ContentSection: React.FC<ContentSectionProps> = ({ onNavigate }) => {
  const { articles, trackEvent } = useMermiStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [readingArticle, setReadingArticle] = useState<ContentArticle | null>(null);

  const categories: string[] = [
    'Todas',
    'Alimentação',
    'Corrida',
    'Hidratação',
    'Sono',
    'Hábitos',
    'Motivação'
  ];

  const filteredArticles = articles.filter((art) => {
    if (art.status !== 'published') return false;
    if (selectedCategory === 'Todas') return true;
    return art.category === selectedCategory;
  });

  const handleOpenArticle = (article: ContentArticle) => {
    trackEvent('content_view', article.id, article.title);
    setReadingArticle(article);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3 px-1">
        <div>
          <span className="text-[10px] font-extrabold text-[#0EB24A] uppercase tracking-wider">
            Conhecimento que Transforma
          </span>
          <h3 className="text-base sm:text-lg font-black text-stone-900 font-['Outfit']">
            Conteúdos & Dicas MerMi
          </h3>
        </div>

        <button
          onClick={() => onNavigate('conteudo')}
          className="text-xs font-bold text-[#0EB24A] hover:text-emerald-700 flex items-center gap-1 transition-colors"
        >
          <span>Ver blog completo</span>
          <span>→</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2 pt-0.5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 ${
              selectedCategory === cat
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Horizontal Scroll Cards */}
      <div className="flex gap-4 overflow-x-auto no-scrollbar pt-2 pb-2 -mx-1 px-1">
        {filteredArticles.map((art) => (
          <div
            key={art.id}
            onClick={() => handleOpenArticle(art)}
            className="w-72 sm:w-80 shrink-0 bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-[#0EB24A] border border-emerald-200">
                  {art.category}
                </span>
                <span className="text-[11px] font-medium">{art.readTime}</span>
              </div>

              <h4 className="text-sm sm:text-base font-extrabold text-stone-900 font-['Outfit'] group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
                {art.title}
              </h4>
              <p className="text-xs text-stone-500 mt-1.5 line-clamp-2 leading-relaxed">
                {art.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <span className="truncate max-w-[170px] text-[11px] font-medium text-stone-600">
                ✍️ {art.author}
              </span>
              <span className="text-emerald-600 font-bold group-hover:translate-x-0.5 transition-transform">
                Ler artigo →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Reader Modal */}
      {readingArticle && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl relative">
            <button
              onClick={() => setReadingArticle(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 font-bold transition-all"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
                {readingArticle.category}
              </span>
              <span className="text-xs text-stone-400 font-medium">
                {readingArticle.readTime}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-stone-900 font-['Outfit'] leading-snug">
              {readingArticle.title}
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Publicado por <strong className="text-stone-700">{readingArticle.author}</strong> em {readingArticle.date}
            </p>

            <div className="my-5 p-3.5 bg-stone-50 rounded-2xl border border-stone-200 text-xs sm:text-sm text-stone-700 italic">
              "{readingArticle.subtitle}"
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm text-stone-700 leading-relaxed">
              {readingArticle.content.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => trackEvent('content_save', readingArticle.id, readingArticle.title)}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl transition-all"
                >
                  🔖 Salvar Artigo
                </button>
                <button
                  onClick={() => trackEvent('content_share', readingArticle.id, readingArticle.title)}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl transition-all"
                >
                  📤 Compartilhar
                </button>
              </div>

              <button
                onClick={() => {
                  setReadingArticle(null);
                  onNavigate('cardapio');
                }}
                className="px-4 py-2 bg-[#0EB24A] hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-all shadow-xs"
              >
                Ver Cardápio Relacionado
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
