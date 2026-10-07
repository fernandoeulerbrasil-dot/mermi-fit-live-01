import React, { useState } from 'react';
import { useMermiStore } from '../../context/MermiStoreContext';
import { PostCard } from './PostCard';

interface CommunitySectionProps {
  onNavigate: (destination: string) => void;
}

export const CommunitySection: React.FC<CommunitySectionProps> = ({ onNavigate }) => {
  const { weeklyMember, posts, createPost, showToast } = useMermiStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newText, setNewText] = useState('');
  const [newCategory, setNewCategory] = useState<'Alimentação' | 'Fitness' | 'Hábitos' | 'Motivação'>('Motivação');

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newText.trim()) return;

    createPost({
      title: newTitle.trim(),
      text: newText.trim(),
      category: newCategory,
      author: {
        name: 'Você (Membro MerMi)',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        role: 'Comunidade MerMi Life'
      },
      date: 'Agora mesmo',
      readTimeMinutes: 2,
      likesCount: 1,
      commentsCount: 0,
      sharesCount: 0,
      savesCount: 0,
      isLiked: true,
      status: 'published',
      order: 0,
      tags: [newCategory, 'Comunidade'],
      comments: []
    });

    setNewTitle('');
    setNewText('');
    setShowCreateModal(false);
    showToast('História publicada com sucesso no feed da comunidade!');
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3 px-1">
        <div>
          <span className="text-[10px] font-extrabold text-[#0EB24A] uppercase tracking-wider">
            Juntos por Uma Rotina Mais Saudável
          </span>
          <h3 className="text-base sm:text-lg font-black text-stone-900 font-['Outfit']">
            Comunidade & Membros em Foco
          </h3>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-3 py-1.5 bg-[#0EB24A] hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95 flex items-center gap-1 font-['Outfit']"
        >
          <span>+ Publicar</span>
        </button>
      </div>

      {/* Membro da Semana Mini Card */}
      <div
        onClick={() => onNavigate('membro_semana')}
        className="mb-4 bg-gradient-to-r from-stone-900 via-stone-950 to-stone-900 text-white rounded-3xl p-4 sm:p-5 border border-yellow-500/30 flex items-center justify-between gap-4 cursor-pointer hover:border-yellow-500/60 transition-all shadow-md group"
      >
        <div className="flex items-center gap-3.5">
          <div className="relative shrink-0">
            <img
              src={weeklyMember.photoUrl}
              alt={weeklyMember.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-[#F59E0B]"
            />
            <span className="absolute -bottom-1 -right-1 text-xs">👑</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#FBBF24]">
                Membro da Semana
              </span>
              <span className="text-[11px] text-stone-400">{weeklyMember.handle}</span>
            </div>
            <h4 className="text-sm sm:text-base font-black text-white font-['Outfit']">
              {weeklyMember.name} · {weeklyMember.points} Points
            </h4>
            <p className="text-xs text-stone-300 italic line-clamp-1">
              "{weeklyMember.motivationMessage}"
            </p>
          </div>
        </div>

        <span className="text-xs font-bold text-[#FBBF24] group-hover:translate-x-1 transition-transform shrink-0 hidden sm:inline">
          Ver Perfil Completo →
        </span>
      </div>

      {/* Feed of Posts */}
      <div className="space-y-4">
        {posts.map((p) => (
          <PostCard key={p.id} post={p} onNavigate={onNavigate} />
        ))}
      </div>

      {/* Create Story Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 font-bold"
            >
              ✕
            </button>

            <h3 className="text-lg font-black text-stone-900 font-['Outfit'] mb-1">
              Compartilhar com a Comunidade
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Inspire outros membros com seus pratos favoritos, conquistas e evolução.
            </p>

            <form onSubmit={handleCreatePost} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Categoria
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:ring-2 focus:ring-[#0EB24A]"
                >
                  <option value="Motivação">Motivação</option>
                  <option value="Alimentação">Alimentação</option>
                  <option value="Fitness">Fitness</option>
                  <option value="Hábitos">Hábitos</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Título do Post
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Minha primeira semana completa no plano fit!"
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:ring-2 focus:ring-[#0EB24A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Texto / Relato
                </label>
                <textarea
                  rows={4}
                  required
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="Conte sua história, como a MerMi te ajuda a economizar tempo e manter o foco..."
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:ring-2 focus:ring-[#0EB24A]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0EB24A] hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-xs font-['Outfit']"
                >
                  Publicar Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
