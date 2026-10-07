import React, { useState } from 'react';
import { useMermiStore } from '../../context/MermiStoreContext';
import { CampaignItem, BannerItem, PostItem, NotificationAdminItem } from '../../types/mermiControl';
import {
  FileText,
  Megaphone,
  Image,
  Bell,
  Trophy,
  Users,
  Plus,
  Trash2,
  Edit3,
  Calendar,
  Eye,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  Flame,
  MessageSquare
} from 'lucide-react';

export const MermiContentCampaignsView: React.FC = () => {
  const {
    campaignsAdmin,
    addCampaignAdmin,
    updateCampaignAdmin,
    deleteCampaignAdmin,
    bannersAdmin,
    addBannerAdmin,
    updateBannerAdmin,
    deleteBannerAdmin,
    postsAdmin,
    addPostAdmin,
    updatePostAdmin,
    deletePostAdmin,
    notificationsAdmin,
    addNotificationAdmin,
    deleteNotificationAdmin,
    weeklyMember,
    updateWeeklyMember,
    posts: communityPosts,
    showToast
  } = useMermiStore();

  const [activeSubTab, setActiveSubTab] = useState<'campanhas' | 'banners' | 'posts' | 'membro' | 'notificacoes' | 'comunidade'>('campanhas');

  // Form states for Campaign
  const [isCreatingCamp, setIsCreatingCamp] = useState(false);
  const [campNome, setCampNome] = useState('');
  const [campTitulo, setCampTitulo] = useState('');
  const [campDesc, setCampDesc] = useState('');
  const [campCta, setCampCta] = useState('VER NOVIDADE');
  const [campDestino, setCampDestino] = useState('cardapio');
  const [campPublico, setCampPublico] = useState<CampaignItem['publico']>('todos');

  // Form states for Banner
  const [isCreatingBanner, setIsCreatingBanner] = useState(false);
  const [bannerPage, setBannerPage] = useState<BannerItem['targetPage']>('home');
  const [bannerTitulo, setBannerTitulo] = useState('');
  const [bannerTexto, setBannerTexto] = useState('');
  const [bannerBotao, setBannerBotao] = useState('CONFIRA JÁ');
  const [bannerLink, setBannerLink] = useState('cardapio');

  // Form states for Post
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [postTitulo, setPostTitulo] = useState('');
  const [postDesc, setPostDesc] = useState('');
  const [postCat, setPostCat] = useState<PostItem['categoria']>('ALIMENTAÇÃO');
  const [postCta, setPostCta] = useState('LER MAIS');
  const [postDestino, setPostDestino] = useState('cardapio');

  // Form states for Notification
  const [isCreatingNotif, setIsCreatingNotif] = useState(false);
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [notifCategory, setNotifCategory] = useState<NotificationAdminItem['category']>('CAMPANHAS');
  const [notifAudience, setNotifAudience] = useState('Todos os clientes cadastrados');

  // Member form state
  const [memberName, setMemberName] = useState(weeklyMember.name);
  const [memberHandle, setMemberHandle] = useState(weeklyMember.handle);
  const [memberPeriod, setMemberPeriod] = useState(weeklyMember.weekPeriod);
  const [memberMotivation, setMemberMotivation] = useState(weeklyMember.motivationMessage);
  const [memberBenefits, setMemberBenefits] = useState(weeklyMember.benefits || '');
  const [memberFeaturedOnHome, setMemberFeaturedOnHome] = useState(weeklyMember.featuredOnHome !== false);

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    updateWeeklyMember({
      name: memberName,
      handle: memberHandle,
      weekPeriod: memberPeriod,
      motivationMessage: memberMotivation,
      benefits: memberBenefits,
      featuredOnHome: memberFeaturedOnHome
    });
    showToast('Membro da Semana atualizado com sucesso!');
  };

  const handleCreateCampaignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campNome || !campTitulo) {
      showToast('Preencha ao menos o nome e o título da campanha.');
      return;
    }
    addCampaignAdmin({
      nome: campNome,
      imagem: '/assets/brand/mermi-logo.png',
      titulo: campTitulo,
      descricao: campDesc,
      cta: campCta,
      destino: campDestino,
      dataInicial: '2026-09-20',
      dataFinal: '2026-10-31',
      publico: campPublico,
      ordem: campaignsAdmin.length + 1,
      status: 'ativa',
      viewsCount: 0,
      clicksCount: 0,
      ordersCount: 0,
      revenueGenerated: 0
    });
    setCampNome('');
    setCampTitulo('');
    setCampDesc('');
    setIsCreatingCamp(false);
  };

  const handleCreateBannerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerTitulo || !bannerTexto) {
      showToast('Preencha ao menos o título e o texto do banner.');
      return;
    }
    addBannerAdmin({
      targetPage: bannerPage,
      imagem: '/assets/brand/mermi-logo.png',
      titulo: bannerTitulo,
      texto: bannerTexto,
      botaoTexto: bannerBotao,
      linkInterno: bannerLink,
      ordem: bannersAdmin.length + 1,
      dataInicio: '2026-01-01',
      dataTermino: '2026-12-31',
      status: 'ativo'
    });
    setBannerTitulo('');
    setBannerTexto('');
    setIsCreatingBanner(false);
  };

  const handleCreatePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitulo || !postDesc) {
      showToast('Preencha ao menos o título e a descrição do post.');
      return;
    }
    addPostAdmin({
      imagem: '/assets/brand/mermi-logo.png',
      titulo: postTitulo,
      descricao: postDesc,
      categoria: postCat,
      data: new Date().toISOString().split('T')[0],
      horario: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      status: 'publicado',
      ordem: postsAdmin.length + 1,
      cta: postCta,
      destino: postDestino,
      publico: 'todos'
    });
    setPostTitulo('');
    setPostDesc('');
    setIsCreatingPost(false);
  };

  const handleCreateNotifSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle || !notifMessage) {
      showToast('Preencha o título e a mensagem da notificação.');
      return;
    }
    addNotificationAdmin({
      title: notifTitle,
      message: notifMessage,
      category: notifCategory,
      targetAudience: notifAudience,
      status: 'enviada',
      sentAt: 'Agora mesmo',
      readCount: 0
    });
    setNotifTitle('');
    setNotifMessage('');
    setIsCreatingNotif(false);
  };

  return (
    <div className="space-y-6">

      {/* TOP HEADER & SUBNAVS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 font-['Outfit']">
            CENTRAL DE COMUNICAÇÃO & ENGAGEMENT
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white font-['Outfit']">
            Campanhas, Banners, Posts & Notificações
          </h2>
          <p className="text-xs text-stone-400">
            Administre os conteúdos dinâmicos do app sem necessidade de edição de código
          </p>
        </div>

        {/* SUBTABS */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'campanhas', label: 'Campanhas', icon: Megaphone },
            { id: 'banners', label: 'Banners', icon: Image },
            { id: 'posts', label: 'Posts & Notícias', icon: FileText },
            { id: 'membro', label: 'Membro da Semana', icon: Trophy },
            { id: 'notificacoes', label: 'Notificações', icon: Bell },
            { id: 'comunidade', label: 'Moderação Feed', icon: Users }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  activeSubTab === tab.id
                    ? 'bg-[#0EB24A] text-stone-950 font-black shadow-md'
                    : 'bg-[#171E31] text-stone-400 hover:text-white border border-stone-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SUBTAB 1: CAMPANHAS */}
      {activeSubTab === 'campanhas' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white uppercase tracking-wider font-['Outfit'] flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-[#0EB24A]" />
              Campaign Manager ({campaignsAdmin.length} campanhas ativas/agendadas)
            </h3>

            <button
              onClick={() => setIsCreatingCamp(true)}
              className="px-3 py-1.5 rounded-xl bg-[#0EB24A] hover:bg-[#0ca042] text-stone-950 font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer shadow-md"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Criar Campanha</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {campaignsAdmin.map((camp) => (
              <div
                key={camp.id}
                className="bg-[#171E31] border border-stone-800 rounded-3xl p-5 shadow-lg space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {camp.status.toUpperCase()} · Público: {camp.publico.toUpperCase()}
                    </span>
                    <h4 className="text-base font-black text-white font-['Outfit'] mt-1">
                      {camp.nome}
                    </h4>
                    <p className="text-xs text-stone-300 font-semibold mt-0.5">
                      {camp.titulo}
                    </p>
                  </div>

                  <button
                    onClick={() => deleteCampaignAdmin(camp.id)}
                    className="text-stone-500 hover:text-rose-400 p-1 cursor-pointer"
                    title="Excluir campanha"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-stone-400 leading-relaxed">
                  {camp.descricao}
                </p>

                <div className="grid grid-cols-4 gap-2 pt-2 border-t border-stone-800 text-[11px]">
                  <div>
                    <span className="text-[9px] text-stone-500 block">Views</span>
                    <strong className="text-white font-mono">{camp.viewsCount}</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-stone-500 block">Cliques</span>
                    <strong className="text-cyan-300 font-mono">{camp.clicksCount}</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-stone-500 block">Pedidos</span>
                    <strong className="text-amber-300 font-mono">{camp.ordersCount}</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-stone-500 block">Receita</span>
                    <strong className="text-emerald-400 font-mono">
                      R$ {camp.revenueGenerated.toFixed(0)}
                    </strong>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 text-stone-400">
                  <span>Destino: <strong>/{camp.destino}</strong></span>
                  <span>CTA: <strong>{camp.cta}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 2: BANNERS */}
      {activeSubTab === 'banners' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white uppercase tracking-wider font-['Outfit'] flex items-center gap-2">
              <Image className="w-4 h-4 text-[#0EB24A]" />
              Banners Oficiais por Página ({bannersAdmin.length} banners)
            </h3>

            <button
              onClick={() => setIsCreatingBanner(true)}
              className="px-3 py-1.5 rounded-xl bg-[#0EB24A] hover:bg-[#0ca042] text-stone-950 font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer shadow-md"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo Banner</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {bannersAdmin.map((banner) => (
              <div
                key={banner.id}
                className="bg-[#171E31] border border-stone-800 rounded-3xl p-5 shadow-lg space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      PÁGINA: {banner.targetPage.toUpperCase()}
                    </span>
                    <h4 className="text-base font-black text-white font-['Outfit'] mt-1">
                      {banner.titulo}
                    </h4>
                  </div>

                  <button
                    onClick={() => deleteBannerAdmin(banner.id)}
                    className="text-stone-500 hover:text-rose-400 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-stone-400 leading-relaxed">
                  {banner.texto}
                </p>

                <div className="p-2.5 rounded-2xl bg-[#0E131F] border border-stone-800 flex items-center justify-between text-xs">
                  <span className="text-stone-400">Botão: <strong className="text-emerald-400">{banner.botaoTexto}</strong></span>
                  <span className="text-stone-400">Link: <strong className="text-white">/{banner.linkInterno}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: POSTS & NOTÍCIAS */}
      {activeSubTab === 'posts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white uppercase tracking-wider font-['Outfit'] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#0EB24A]" />
              Gerenciador de Posts & Dicas Oficiais ({postsAdmin.length} posts)
            </h3>

            <button
              onClick={() => setIsCreatingPost(true)}
              className="px-3 py-1.5 rounded-xl bg-[#0EB24A] hover:bg-[#0ca042] text-stone-950 font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer shadow-md"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo Post</span>
            </button>
          </div>

          <div className="space-y-3">
            {postsAdmin.map((post) => (
              <div
                key={post.id}
                className="bg-[#171E31] border border-stone-800 rounded-3xl p-4 sm:p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {post.categoria}
                    </span>
                    <span className="text-[10px] text-stone-500">
                      {post.data} às {post.horario}
                    </span>
                  </div>

                  <h4 className="text-sm font-black text-white font-['Outfit']">
                    {post.titulo}
                  </h4>
                  <p className="text-xs text-stone-400 leading-relaxed line-clamp-2">
                    {post.descricao}
                  </p>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 border-t md:border-t-0 md:border-l border-stone-800 pt-3 md:pt-0 md:pl-4">
                  <div className="text-left md:text-right text-xs">
                    <span className="text-[10px] text-stone-500 block">Destino</span>
                    <strong className="text-white font-mono">/{post.destino || 'cardapio'}</strong>
                  </div>

                  <button
                    onClick={() => deletePostAdmin(post.id)}
                    className="text-stone-500 hover:text-rose-400 p-1 cursor-pointer"
                    title="Excluir post"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 4: MEMBRO DA SEMANA */}
      {activeSubTab === 'membro' && (
        <form onSubmit={handleSaveMember} className="bg-[#171E31] border border-stone-800 rounded-3xl p-6 shadow-xl space-y-4 max-w-xl">
          <div className="border-b border-stone-800 pb-3">
            <h3 className="text-base font-black text-white font-['Outfit'] flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              Configuração do Membro da Semana
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Decida onde e como destacar a história inspiradora da semana
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-stone-300 font-bold block mb-1">Nome do Atleta</label>
              <input
                type="text"
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white font-semibold"
                required
              />
            </div>
            <div>
              <label className="text-stone-300 font-bold block mb-1">@handle no Instagram / App</label>
              <input
                type="text"
                value={memberHandle}
                onChange={(e) => setMemberHandle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white font-mono"
                required
              />
            </div>
          </div>

          <div className="text-xs space-y-1">
            <label className="text-stone-300 font-bold block">Período da Semana</label>
            <input
              type="text"
              value={memberPeriod}
              onChange={(e) => setMemberPeriod(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
            />
          </div>

          <div className="text-xs space-y-1">
            <label className="text-stone-300 font-bold block">Mensagem Motivacional</label>
            <textarea
              rows={3}
              value={memberMotivation}
              onChange={(e) => setMemberMotivation(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white leading-relaxed"
            />
          </div>

          <div className="text-xs space-y-1">
            <label className="text-stone-300 font-bold block">Benefícios Exclusivos do Título</label>
            <input
              type="text"
              value={memberBenefits}
              onChange={(e) => setMemberBenefits(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
            />
          </div>

          {/* ONDE EXIBIR? (REQUISITO SEÇÃO 14) */}
          <div className="p-3.5 rounded-2xl bg-[#0E131F] border border-stone-800 space-y-2 text-xs">
            <span className="font-bold text-white block uppercase tracking-wider text-[10px]">
              Onde Exibir este Módulo?
            </span>
            <label className="flex items-center gap-2 cursor-pointer text-stone-300">
              <input
                type="checkbox"
                checked={memberFeaturedOnHome}
                onChange={(e) => setMemberFeaturedOnHome(e.target.checked)}
                className="rounded accent-emerald-500"
              />
              <span>Exibir em destaque no topo da Tela Principal (Home)</span>
            </label>
            <span className="text-[10px] text-stone-500 block">
              Também disponível sempre dentro da aba Comunidade e Posts.
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-[#0EB24A] hover:bg-[#0ca042] text-stone-950 font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md"
          >
            Salvar Membro da Semana
          </button>
        </form>
      )}

      {/* SUBTAB 5: NOTIFICAÇÕES */}
      {activeSubTab === 'notificacoes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white uppercase tracking-wider font-['Outfit'] flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#0EB24A]" />
              Central de Notificações Push & Alertas ({notificationsAdmin.length} programadas)
            </h3>

            <button
              onClick={() => setIsCreatingNotif(true)}
              className="px-3 py-1.5 rounded-xl bg-[#0EB24A] hover:bg-[#0ca042] text-stone-950 font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer shadow-md"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nova Notificação</span>
            </button>
          </div>

          <div className="space-y-3">
            {notificationsAdmin.map((notif) => (
              <div
                key={notif.id}
                className="bg-[#171E31] border border-stone-800 rounded-3xl p-4 sm:p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {notif.category}
                    </span>
                    <span className="text-[10px] text-stone-500">
                      Público: {notif.targetAudience}
                    </span>
                  </div>

                  <h4 className="text-sm font-black text-white font-['Outfit']">
                    {notif.title}
                  </h4>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    {notif.message}
                  </p>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 border-t md:border-t-0 md:border-l border-stone-800 pt-3 md:pt-0 md:pl-4">
                  <div className="text-left md:text-right text-xs">
                    <span className="text-[10px] text-stone-500 block">Status / Envio</span>
                    <strong className="text-emerald-400 font-mono text-[11px]">
                      {notif.sentAt || notif.scheduledFor || 'Pendente'}
                    </strong>
                  </div>

                  <button
                    onClick={() => deleteNotificationAdmin(notif.id)}
                    className="text-stone-500 hover:text-rose-400 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 6: MODERAÇÃO DO FEED DA COMUNIDADE */}
      {activeSubTab === 'comunidade' && (
        <div className="space-y-4">
          <div className="border-b border-stone-800 pb-3">
            <h3 className="text-sm font-black text-white uppercase tracking-wider font-['Outfit'] flex items-center gap-2">
              <Users className="w-4 h-4 text-[#0EB24A]" />
              Moderação do Feed Social dos Membros ({communityPosts.length} posts na rede)
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Supervisão de publicações públicas, respeito à privacidade e remoção de conteúdo impróprio
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {communityPosts.map((post) => (
              <div
                key={post.id}
                className="bg-[#171E31] border border-stone-800 rounded-3xl p-4 shadow-lg space-y-2.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={post.author.avatar || '/assets/brand/mermi-logo.png'}
                      alt={post.author.name}
                      className="w-7 h-7 rounded-full object-cover border border-stone-700"
                    />
                    <div>
                      <span className="font-bold text-white block leading-tight">{post.author.name}</span>
                      <span className="text-[10px] text-stone-500">{post.date}</span>
                    </div>
                  </div>

                  <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    PUBLICADO
                  </span>
                </div>

                <h5 className="font-black text-white text-xs">{post.title}</h5>
                <p className="text-stone-400 line-clamp-3 leading-relaxed text-[11px]">{post.text}</p>

                <div className="flex items-center justify-between pt-2 border-t border-stone-800 text-[10px] text-stone-500">
                  <span>❤️ {post.likesCount} curtidas · 💬 {post.commentsCount} comentários</span>
                  <span className="text-emerald-500 font-bold">Conteúdo Moderado</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREATE CAMPAIGN MODAL */}
      {isCreatingCamp && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleCreateCampaignSubmit} className="bg-[#171E31] border border-stone-700 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-black text-white font-['Outfit']">Criar Nova Campanha</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-stone-300 font-bold block mb-1">Nome Interno</label>
                <input
                  type="text"
                  value={campNome}
                  onChange={(e) => setCampNome(e.target.value)}
                  placeholder="Ex: Semana Turbo Proteína"
                  className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                  required
                />
              </div>
              <div>
                <label className="text-stone-300 font-bold block mb-1">Título de Chamada</label>
                <input
                  type="text"
                  value={campTitulo}
                  onChange={(e) => setCampTitulo(e.target.value)}
                  placeholder="Ex: Peça 5 marmitas e ganhe frete grátis"
                  className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                  required
                />
              </div>
              <div>
                <label className="text-stone-300 font-bold block mb-1">Descrição</label>
                <textarea
                  rows={2}
                  value={campDesc}
                  onChange={(e) => setCampDesc(e.target.value)}
                  placeholder="Detalhes e regras da oferta..."
                  className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-stone-300 font-bold block mb-1">Texto do Botão (CTA)</label>
                  <input
                    type="text"
                    value={campCta}
                    onChange={(e) => setCampCta(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-stone-300 font-bold block mb-1">Público Alvo</label>
                  <select
                    value={campPublico}
                    onChange={(e) => setCampPublico(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                  >
                    <option value="todos">Todos</option>
                    <option value="novos">Novos</option>
                    <option value="vip">VIPs</option>
                    <option value="inativos">Inativos</option>
                    <option value="run">MerMi Run</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreatingCamp(false)}
                className="flex-1 py-2 rounded-xl bg-stone-800 text-stone-300 text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-[#0EB24A] text-stone-950 text-xs font-black"
              >
                Publicar Campanha
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CREATE BANNER MODAL */}
      {isCreatingBanner && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleCreateBannerSubmit} className="bg-[#171E31] border border-stone-700 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-black text-white font-['Outfit']">Criar Banner Oficial</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-stone-300 font-bold block mb-1">Página Destino do Banner</label>
                <select
                  value={bannerPage}
                  onChange={(e) => setBannerPage(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                >
                  <option value="home">Home Principal</option>
                  <option value="cardapio">Cardápio Fit</option>
                  <option value="points">MerMi Points</option>
                  <option value="run">MerMi Run</option>
                  <option value="promocao">Promoções</option>
                </select>
              </div>
              <div>
                <label className="text-stone-300 font-bold block mb-1">Título do Banner</label>
                <input
                  type="text"
                  value={bannerTitulo}
                  onChange={(e) => setBannerTitulo(e.target.value)}
                  placeholder="Ex: Combo Semanal com Desconto"
                  className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                  required
                />
              </div>
              <div>
                <label className="text-stone-300 font-bold block mb-1">Texto Explicativo</label>
                <textarea
                  rows={2}
                  value={bannerTexto}
                  onChange={(e) => setBannerTexto(e.target.value)}
                  placeholder="Texto curto e direto..."
                  className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                  required
                />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreatingBanner(false)}
                className="flex-1 py-2 rounded-xl bg-stone-800 text-stone-300 text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-[#0EB24A] text-stone-950 text-xs font-black"
              >
                Criar Banner
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CREATE POST MODAL */}
      {isCreatingPost && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleCreatePostSubmit} className="bg-[#171E31] border border-stone-700 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-black text-white font-['Outfit']">Novo Post / Novidade</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-stone-300 font-bold block mb-1">Categoria do Post</label>
                <select
                  value={postCat}
                  onChange={(e) => setPostCat(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                >
                  <option value="NOVIDADES">NOVIDADES</option>
                  <option value="ALIMENTAÇÃO">ALIMENTAÇÃO</option>
                  <option value="TREINO">TREINO</option>
                  <option value="MERMI RUN">MERMI RUN</option>
                  <option value="MERMI POINTS">MERMI POINTS</option>
                  <option value="DESAFIOS">DESAFIOS</option>
                  <option value="COMUNIDADE">COMUNIDADE</option>
                  <option value="CAMPANHAS">CAMPANHAS</option>
                  <option value="MOTIVAÇÃO">MOTIVAÇÃO</option>
                  <option value="EVENTOS">EVENTOS</option>
                </select>
              </div>
              <div>
                <label className="text-stone-300 font-bold block mb-1">Título do Artigo / Dica</label>
                <input
                  type="text"
                  value={postTitulo}
                  onChange={(e) => setPostTitulo(e.target.value)}
                  placeholder="Ex: Como atingir 40g de proteína no almoço"
                  className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                  required
                />
              </div>
              <div>
                <label className="text-stone-300 font-bold block mb-1">Texto / Descrição Completa</label>
                <textarea
                  rows={3}
                  value={postDesc}
                  onChange={(e) => setPostDesc(e.target.value)}
                  placeholder="Conteúdo informativo oficial..."
                  className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                  required
                />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreatingPost(false)}
                className="flex-1 py-2 rounded-xl bg-stone-800 text-stone-300 text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-[#0EB24A] text-stone-950 text-xs font-black"
              >
                Publicar Post
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CREATE NOTIFICATION MODAL */}
      {isCreatingNotif && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleCreateNotifSubmit} className="bg-[#171E31] border border-stone-700 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-black text-white font-['Outfit']">Disparar Notificação</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-stone-300 font-bold block mb-1">Categoria</label>
                <select
                  value={notifCategory}
                  onChange={(e) => setNotifCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                >
                  <option value="PEDIDOS">PEDIDOS</option>
                  <option value="POINTS">POINTS</option>
                  <option value="RUN">RUN</option>
                  <option value="DESAFIOS">DESAFIOS</option>
                  <option value="PROMOCOES">PROMOÇÕES</option>
                  <option value="CAMPANHAS">CAMPANHAS</option>
                  <option value="COMUNIDADE">COMUNIDADE</option>
                  <option value="CONTEUDO">CONTEÚDO</option>
                </select>
              </div>
              <div>
                <label className="text-stone-300 font-bold block mb-1">Título da Notificação</label>
                <input
                  type="text"
                  value={notifTitle}
                  onChange={(e) => setNotifTitle(e.target.value)}
                  placeholder="Ex: Seu almoço saudável está a caminho! 🛵"
                  className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                  required
                />
              </div>
              <div>
                <label className="text-stone-300 font-bold block mb-1">Mensagem</label>
                <textarea
                  rows={2}
                  value={notifMessage}
                  onChange={(e) => setNotifMessage(e.target.value)}
                  placeholder="Corpo da notificação recebida no smartphone..."
                  className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                  required
                />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreatingNotif(false)}
                className="flex-1 py-2 rounded-xl bg-stone-800 text-stone-300 text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-[#0EB24A] text-stone-950 text-xs font-black"
              >
                Programar Envio
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
