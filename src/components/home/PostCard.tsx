import React, { useState } from 'react';
import { PostItem } from '../../types/homeContent';
import { useMermiStore } from '../../context/MermiStoreContext';

interface PostCardProps {
  post: PostItem;
  onNavigate: (destination: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onNavigate }) => {
  const { togglePostLike, togglePostSave, addPostComment, showToast, trackEvent } = useMermiStore();
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [commentInput, setCommentInput] = useState('');

  const handleLike = () => {
    togglePostLike(post.id);
    trackEvent('post_click', post.id, `Curtir: ${post.title}`);
  };

  const handleSave = () => {
    togglePostSave(post.id);
    trackEvent('post_click', post.id, `Salvar: ${post.title}`);
  };

  const handleShare = () => {
    trackEvent('post_click', post.id, `Compartilhar: ${post.title}`);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link do post copiado para a área de transferência!');
    } else {
      showToast('Post compartilhado com sucesso!');
    }
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    addPostComment(post.id, commentInput);
    setCommentInput('');
  };

  const handleAction = () => {
    if (post.destination) {
      trackEvent('post_click', post.id, `CTA: ${post.actionButtonText}`);
      onNavigate(post.destination);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-xs hover:shadow-md transition-all relative">
      {/* Featured Badge */}
      {post.isFeatured && (
        <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-black uppercase tracking-wider">
          <span>⭐</span>
          <span>Destaque</span>
        </div>
      )}

      {/* Author Header */}
      <div className="flex items-center gap-3 mb-3">
        <img
          src={post.author.avatar}
          alt={post.author.name}
          className="w-10 h-10 rounded-full object-cover border border-stone-200"
        />
        <div>
          <h4 className="text-xs sm:text-sm font-bold text-stone-900 leading-tight">
            {post.author.name}
          </h4>
          <p className="text-[11px] text-stone-500">
            {post.author.role} · <span className="text-stone-400">{post.date}</span>
          </p>
        </div>
      </div>

      {/* Category Pill */}
      <div className="mb-2">
        <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 text-[10px] font-bold uppercase tracking-wider">
          {post.category}
        </span>
      </div>

      {/* Post Title & Text */}
      <h3 className="text-base sm:text-lg font-black text-stone-900 font-['Outfit'] leading-snug">
        {post.title}
      </h3>
      <p className="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed">
        {post.text}
      </p>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {post.tags.map((t, idx) => (
            <span key={idx} className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-medium">
              #{t}
            </span>
          ))}
        </div>
      )}

      {/* Action Button CTA if exists */}
      {post.actionButtonText && post.destination && (
        <div className="mt-4 pt-3 border-t border-stone-100">
          <button
            onClick={handleAction}
            className="w-full sm:w-auto px-4 py-2 bg-[#0EB24A]/10 hover:bg-[#0EB24A]/20 active:scale-98 text-[#0EB24A] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 font-['Outfit']"
          >
            <span>{post.actionButtonText}</span>
            <span>→</span>
          </button>
        </div>
      )}

      {/* Interaction Bar (Likes, Comments, Shares, Saves) */}
      <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
        <div className="flex items-center gap-4">
          {/* Like */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 transition-colors font-medium ${
              post.isLiked ? 'text-rose-600 font-bold' : 'hover:text-rose-600'
            }`}
          >
            <span>{post.isLiked ? '❤️' : '🤍'}</span>
            <span>{post.likesCount}</span>
          </button>

          {/* Comment */}
          <button
            onClick={() => setShowCommentsModal(true)}
            className="flex items-center gap-1.5 hover:text-stone-900 transition-colors font-medium"
          >
            <span>💬</span>
            <span>{post.commentsCount}</span>
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 hover:text-stone-900 transition-colors font-medium"
          >
            <span>📤</span>
            <span className="hidden sm:inline">Compartilhar</span>
          </button>
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          className={`flex items-center gap-1 transition-colors ${
            post.isSaved ? 'text-amber-500 font-bold' : 'hover:text-stone-900'
          }`}
          title={post.isSaved ? 'Salvo' : 'Salvar post'}
        >
          <span>{post.isSaved ? '🔖' : '🏷️'}</span>
          <span className="text-[11px] hidden sm:inline">{post.isSaved ? 'Salvo' : 'Salvar'}</span>
        </button>
      </div>

      {/* Comments Modal */}
      {showCommentsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6 shadow-2xl relative flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h4 className="text-base font-black text-stone-900 font-['Outfit']">
                  Comentários ({post.commentsCount})
                </h4>
                <button
                  onClick={() => setShowCommentsModal(false)}
                  className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              {/* List of comments */}
              <div className="my-4 space-y-3 max-h-60 overflow-y-auto pr-1">
                {post.comments && post.comments.length > 0 ? (
                  post.comments.map((c) => (
                    <div key={c.id} className="p-3 bg-stone-50 rounded-2xl border border-stone-100">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-stone-900">{c.userName}</span>
                        <span className="text-stone-400 text-[10px]">{c.timestamp}</span>
                      </div>
                      <p className="text-xs text-stone-700">{c.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-stone-400 text-center py-4">
                    Seja o primeiro a comentar neste post!
                  </p>
                )}
              </div>
            </div>

            {/* Input form */}
            <form onSubmit={handleSendComment} className="pt-3 border-t border-stone-100 flex gap-2">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Escreva um comentário..."
                className="flex-1 px-3.5 py-2 bg-stone-100 border border-stone-200 rounded-xl text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#0EB24A]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#0EB24A] hover:bg-emerald-600 text-white text-xs font-bold rounded-xl active:scale-95 transition-all"
              >
                Enviar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
