import React from 'react';
import { useMermiStore } from '../../context/MermiStoreContext';
import { OfficialLogo } from '../brand/OfficialLogo';
import { Award, ArrowLeft, Bell, ShoppingBag, User } from 'lucide-react';

interface AppHeaderProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  cartCount?: number;
  onOpenCart?: () => void;
  onOpenNotifications?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  currentTab,
  onNavigate,
  cartCount = 0,
  onOpenCart,
  onOpenNotifications
}) => {
  const { user, notifications } = useMermiStore();
  const unreadNotifCount = notifications?.filter((n) => n.status !== 'lida').length || 0;

  const isSubRoute = ![
    'home',
    'splash'
  ].includes(currentTab);

  const getPageTitle = (tab: string) => {
    switch (tab) {
      case 'cardapio':
        return 'Cardápio Fit';
      case 'points':
        return 'MerMi Points';
      case 'resgate':
        return 'Resgate da Semana';
      case 'membro':
        return 'Membro da Semana';
      case 'ia':
        return 'MerMi IA';
      case 'evolucao':
      case 'agua':
      case 'sono':
      case 'atividade':
      case 'treinos':
      case 'metas':
        return 'Minha Evolução';
      case 'comunidade':
        return 'Comunidade';
      case 'mais':
        return 'Mais Módulos';
      case 'desafios':
      case 'corridas':
      case 'conquistas':
        return 'Desafios & Corridas';
      case 'pedidos':
        return 'Meus Pedidos';
      case 'perfil':
        return 'Meu Perfil';
      case 'admin':
        return 'Intelligence & Admin';
      case 'assets':
        return 'Asset Registry Oficial';
      default:
        return 'MerMi Fit Life';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FBF7EE]/95 backdrop-blur-md border-b border-stone-200/80 px-3 sm:px-4 py-2 transition-all">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        
        {/* Left Side: Back button if subroute, or Official Logo */}
        <div className="flex items-center gap-2">
          {isSubRoute && (
            <button
              onClick={() => onNavigate('home')}
              className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center cursor-pointer transition-colors shrink-0"
              title="Voltar para a Página Inicial"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 group text-left cursor-pointer focus:outline-none shrink-0"
          >
            {/* Preserva rigorosamente o aspect-ratio 1:1 e contain */}
            <div className="shrink-0 flex items-center justify-center">
              <OfficialLogo size={36} showSubtitle={false} />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1 leading-none">
                <span className="font-black text-sm sm:text-base tracking-tight text-stone-900 uppercase font-['Outfit']">
                  MERMI
                </span>
                <span className="font-black text-sm sm:text-base tracking-tight text-[#0EB24A] italic uppercase font-['Outfit']">
                  FIT
                </span>
                <span className="font-black text-sm sm:text-base tracking-tight text-[#E52525] italic uppercase font-['Outfit']">
                  LIFE
                </span>
              </div>
              <p className="text-[8px] sm:text-[9px] font-semibold text-stone-500 tracking-wider uppercase mt-0.5 truncate">
                {isSubRoute ? getPageTitle(currentTab) : 'MAIS QUE UM APP. UM ESTILO DE VIDA.'}
              </p>
            </div>
          </button>
        </div>

        {/* Right Side: Points Badge, Cart, Notification & Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          {/* Points Pill (Alto contraste / Gamificação) */}
          <button
            onClick={() => onNavigate('points')}
            title="Ver saldo de MerMi Points"
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-stone-950 font-black text-xs shadow-sm hover:shadow active:scale-95 transition-transform cursor-pointer border border-amber-300"
          >
            <Award className="w-3.5 h-3.5 fill-stone-950" />
            <span>{user.mermiPoints.toLocaleString('pt-BR')} pts</span>
          </button>

          {/* Cart Icon button */}
          {onOpenCart && (
            <button
              onClick={onOpenCart}
              title="Abrir Carrinho"
              className="relative w-8 h-8 rounded-full bg-white border border-stone-200 hover:border-[#0EB24A] text-stone-700 flex items-center justify-center cursor-pointer transition-colors shrink-0 shadow-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#0EB24A] text-white text-[9px] font-black flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {/* Notifications Button */}
          {onOpenNotifications && (
            <button
              onClick={onOpenNotifications}
              title={`Notificações (${unreadNotifCount} não lidas)`}
              className="relative w-8 h-8 rounded-full bg-white border border-stone-200 hover:border-[#0EB24A] text-stone-700 flex items-center justify-center cursor-pointer transition-colors shrink-0 shadow-sm"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center">
                  {unreadNotifCount > 9 ? '9+' : unreadNotifCount}
                </span>
              )}
            </button>
          )}

          {/* Profile Shortcut */}
          <button
            onClick={() => onNavigate('perfil')}
            title="Meu Perfil"
            className="w-8 h-8 rounded-full overflow-hidden border border-stone-300 hover:border-[#0EB24A] cursor-pointer transition-colors shrink-0"
          >
            <img
              src={user.avatar}
              alt={user.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </button>

        </div>
      </div>
    </header>
  );
};
