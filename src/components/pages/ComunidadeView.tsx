import React, { useState } from 'react';
import {
  Users,
  Sparkles,
  Flame,
  Award,
  Heart,
  MessageCircle,
  Share2,
  Plus,
  TrendingUp,
  Star
} from 'lucide-react';
import { CardPost, CardBase } from '../../design-system/components/Cards';
import { PrimaryButton, OutlineButton } from '../../design-system/components/Button';
import { SectionTitle, Subtitle } from '../../design-system/components/Typography';
import { useMermiStore } from '../../context/MermiStoreContext';

interface ComunidadeViewProps {
  onNavigate: (tab: string) => void;
}

export const ComunidadeView: React.FC<ComunidadeViewProps> = ({ onNavigate }) => {
  const { weeklyMember, showToast } = useMermiStore();
  const [filter, setFilter] = useState<'feed' | 'desafios' | 'conquistas'>('feed');
  const [newPostText, setNewPostText] = useState('');
  const [posts, setPosts] = useState([
    {
      id: 'p1',
      authorName: 'Camila Fernandes',
      authorHandle: '@camilafit',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      timestamp: 'Há 25 minutos',
      content: 'Minha semana tá paga com marmitas MerMi Fit! Acabei de completar 7 dias sem furar a dieta e bati a meta de 10.000 passos hoje. Rumo ao Resgate da Semana! 🔥🥗',
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=700&q=80',
      likesCount: 38,
      commentsCount: 9,
      pointsBadge: '+15 Points'
    },
    {
      id: 'p2',
      authorName: 'Lucas Andrade',
      authorHandle: '@lucas_runner',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
      timestamp: 'Há 2 horas',
      content: 'Quem mais vai na Corrida MerMi 10k mês que vem? Já garanti o kit e tô combinando o grupo de treino para sábado de manhã no parque!',
      likesCount: 54,
      commentsCount: 16,
      pointsBadge: 'Desafio 10k'
    }
  ]);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const newPost = {
      id: `p_${Date.now()}`,
      authorName: 'Você (Atleta MerMi)',
      authorHandle: '@meuperfil',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
      timestamp: 'Agora mesmo',
      content: newPostText,
      likesCount: 1,
      commentsCount: 0,
      pointsBadge: '+5 Points'
    };

    setPosts([newPost, ...posts]);
    setNewPostText('');
    showToast('Post publicado com sucesso na Comunidade MerMi!');
  };

  return (
    <div className="min-h-screen bg-[#FBF7EE] text-stone-900 pb-28 pt-4 px-3 sm:px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
          <div>
            <SectionTitle className="text-stone-900">
              Comunidade MerMi
            </SectionTitle>
            <p className="text-xs text-stone-500 mt-0.5">
              Conecte-se com pessoas reais vivendo o estilo de vida saudável
            </p>
          </div>

          <button
            onClick={() => onNavigate('membro')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-stone-950 text-xs font-black uppercase font-['Outfit'] shadow-sm hover:scale-105 transition-transform self-start sm:self-auto cursor-pointer"
          >
            <Star className="w-3.5 h-3.5 fill-stone-950" />
            <span>Membro da Semana</span>
          </button>
        </div>

        {/* Highlight Card: Membro da Semana */}
        <CardBase
          environment="escuro"
          elevation="glow"
          onClick={() => onNavigate('membro')}
          className="flex items-center gap-4 cursor-pointer group"
        >
          <div className="w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 to-orange-500 shrink-0">
            <img
              src={weeklyMember.photoUrl}
              alt={weeklyMember.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
              Inspiração da Semana
            </span>
            <h4 className="font-black text-sm text-white font-['Outfit'] uppercase truncate">
              {weeklyMember.name} ({weeklyMember.handle})
            </h4>
            <p className="text-xs text-stone-400 truncate mt-0.5">
              "{weeklyMember.motivationMessage}"
            </p>
          </div>
          <span className="text-xs font-black text-amber-400 font-['Outfit'] shrink-0 group-hover:translate-x-1 transition-transform">
            Ver Perfil →
          </span>
        </CardBase>

        {/* Feed Composer */}
        <CardBase environment="claro" elevation="subtle" className="p-4 space-y-3">
          <form onSubmit={handleCreatePost} className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-[#0EB24A] flex items-center justify-center font-black text-xs shrink-0">
                EU
              </div>
              <textarea
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                placeholder="Compartilhe seu prato, seu treino ou sua vitória de hoje..."
                rows={2}
                className="w-full p-2.5 rounded-2xl bg-[#FBF7EE] border border-stone-200 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#0EB24A] resize-none"
              />
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-stone-100">
              <span className="text-[10px] text-stone-400 font-bold">
                Compartilhar vale +5 Points
              </span>
              <PrimaryButton size="sm" type="submit">
                Publicar
              </PrimaryButton>
            </div>
          </form>
        </CardBase>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
          <button
            onClick={() => setFilter('feed')}
            className={`px-3 py-1 rounded-full text-xs font-black uppercase font-['Outfit'] transition-all cursor-pointer ${
              filter === 'feed'
                ? 'bg-[#0EB24A] text-white shadow-sm'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Feed Geral
          </button>
          <button
            onClick={() => onNavigate('desafios')}
            className="px-3 py-1 rounded-full text-xs font-black uppercase font-['Outfit'] text-stone-500 hover:text-stone-900 cursor-pointer"
          >
            Desafios da Comunidade
          </button>
          <button
            onClick={() => onNavigate('corridas')}
            className="px-3 py-1 rounded-full text-xs font-black uppercase font-['Outfit'] text-stone-500 hover:text-stone-900 cursor-pointer"
          >
            Corridas & Encontros
          </button>
        </div>

        {/* Post Feed */}
        <div className="space-y-4">
          {posts.map((post) => (
            <CardPost
              key={post.id}
              authorName={post.authorName}
              authorHandle={post.authorHandle}
              authorAvatar={post.authorAvatar}
              timestamp={post.timestamp}
              content={post.content}
              imageUrl={post.imageUrl}
              likesCount={post.likesCount}
              commentsCount={post.commentsCount}
              pointsBadge={post.pointsBadge}
              onComment={() => showToast('Abrindo comentários do post...')}
              onShare={() => showToast('Link do post copiado para compartilhamento!')}
            />
          ))}
        </div>

      </div>
    </div>
  );
};
