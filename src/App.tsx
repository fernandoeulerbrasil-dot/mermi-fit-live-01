import React, { useState } from 'react';
import { MermiStoreProvider, useMermiStore } from './context/MermiStoreContext';
import { AppHeader } from './components/navigation/AppHeader';
import { BottomNav } from './components/navigation/BottomNav';
import { SplashOnboardingView } from './components/pages/SplashOnboardingView';
import { HomeLifestyleView } from './components/pages/HomeLifestyleView';
import { CardapioView } from './components/pages/CardapioView';
import { MerMiPointsView } from './components/pages/MerMiPointsView';
import { ResgateSemanaView } from './components/pages/ResgateSemanaView';
import { MembroSemanaView } from './components/pages/MembroSemanaView';
import { MerMiIAView } from './components/pages/MerMiIAView';
import { EvolucaoView } from './components/pages/EvolucaoView';
import { ComunidadeView } from './components/pages/ComunidadeView';
import { MenuMaisView } from './components/pages/MenuMaisView';
import { DesafiosCorridasView } from './components/pages/DesafiosCorridasView';
import { MeusPedidosView } from './components/pages/MeusPedidosView';
import { PerfilUsuarioView } from './components/pages/PerfilUsuarioView';
import { AssetRegistryView } from './components/pages/AssetRegistryView';
import { AdminIntelligenceView } from './components/pages/AdminIntelligenceView';
import { DropSurpresaView } from './components/pages/DropSurpresaView';
import { MermiControlView } from './components/pages/MermiControlView';

// Modals
import { CarrinhoModal } from './components/modals/CarrinhoModal';
import { MontarMarmitaFlow } from './components/food/MontarMarmitaFlow';
import { NotificacoesDrawer } from './components/modals/NotificacoesDrawer';

import { Sparkles } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const { toastMessage, showToast, cartItems } = useMermiStore();

  // Cart state
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Customization modal state
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);

  // Notification drawer state
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const handleNavigate = (tab: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cartTotalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#FBF7EE] text-stone-900 font-sans selection:bg-[#0EB24A] selection:text-white">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 max-w-md w-11/12 bg-stone-950/95 text-white px-4 py-3 rounded-2xl shadow-2xl border-2 border-emerald-500 flex items-center gap-3 backdrop-blur-md animate-bounce">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <p className="text-xs font-bold leading-tight flex-1 font-['Outfit']">
            {toastMessage}
          </p>
        </div>
      )}

      {/* Global Header */}
      {currentTab !== 'splash' && (
        <AppHeader
          currentTab={currentTab}
          onNavigate={handleNavigate}
          cartCount={cartTotalItems}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenNotifications={() => setIsNotifOpen(true)}
        />
      )}

      {/* Main View Router */}
      <main>
        {currentTab === 'splash' && (
          <SplashOnboardingView
            onEnter={() => handleNavigate('home')}
            onEnterAsGuest={() => handleNavigate('home')}
          />
        )}

        {currentTab === 'home' && (
          <HomeLifestyleView
            onNavigate={handleNavigate}
            onOpenCustomize={() => setIsCustomizeOpen(true)}
          />
        )}

        {currentTab === 'cardapio' && (
          <CardapioView onOpenCart={() => setIsCartOpen(true)} />
        )}

        {currentTab === 'points' && (
          <MerMiPointsView onNavigate={handleNavigate} />
        )}

        {currentTab === 'resgate' && (
          <ResgateSemanaView />
        )}

        {currentTab === 'membro' && (
          <MembroSemanaView />
        )}

        {currentTab === 'ia' && (
          <MerMiIAView onNavigate={handleNavigate} />
        )}

        {(currentTab === 'evolucao' ||
          currentTab === 'agua' ||
          currentTab === 'sono' ||
          currentTab === 'atividade' ||
          currentTab === 'treinos' ||
          currentTab === 'metas') && (
          <EvolucaoView
            onNavigate={handleNavigate}
            initialTab={
              currentTab === 'agua'
                ? 'agua'
                : currentTab === 'sono'
                ? 'sono'
                : currentTab === 'atividade' || currentTab === 'treinos'
                ? 'atividades'
                : currentTab === 'metas'
                ? 'metas'
                : 'meu_dia'
            }
          />
        )}

        {currentTab === 'comunidade' && (
          <ComunidadeView onNavigate={handleNavigate} />
        )}

        {currentTab === 'mais' && (
          <MenuMaisView onNavigate={handleNavigate} />
        )}

        {(currentTab === 'desafios' || currentTab === 'corridas' || currentTab === 'conquistas') && (
          <DesafiosCorridasView
            onNavigate={handleNavigate}
            initialTab={currentTab as any}
          />
        )}

        {currentTab === 'pedidos' && (
          <MeusPedidosView onNavigate={handleNavigate} onOpenCart={() => setIsCartOpen(true)} />
        )}

        {currentTab === 'perfil' && (
          <PerfilUsuarioView onNavigate={handleNavigate} />
        )}

        {currentTab === 'assets' && (
          <AssetRegistryView onNavigateToComponent={handleNavigate} />
        )}

        {currentTab === 'drop_surpresa' && (
          <DropSurpresaView onNavigate={handleNavigate} />
        )}

        {(currentTab === 'admin' || currentTab === 'mermi_control') && (
          <MermiControlView
            onNavigateHome={() => handleNavigate('home')}
            onNavigateTab={handleNavigate}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      {currentTab !== 'splash' && (
        <BottomNav currentTab={currentTab} onNavigate={handleNavigate} />
      )}

      {/* Modals & Drawers */}
      <CarrinhoModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckoutSuccess={() => {
          handleNavigate('pedidos');
        }}
      />

      <MontarMarmitaFlow
        isOpen={isCustomizeOpen}
        onClose={() => setIsCustomizeOpen(false)}
      />

      <NotificacoesDrawer
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* Floating Shortcut to Return to Splash/Onboarding for reference */}
      {currentTab !== 'splash' && (
        <div className="fixed bottom-16 right-3 z-30">
          <button
            onClick={() => handleNavigate('splash')}
            title="Ver Referência Splash / Onboarding (Foto 01)"
            className="px-2.5 py-1.5 rounded-full bg-stone-900/80 hover:bg-stone-900 text-stone-200 text-[10px] font-bold border border-stone-700 shadow-md backdrop-blur-sm cursor-pointer transition-all flex items-center gap-1"
          >
            <span>📱</span>
            <span className="hidden sm:inline">Splash (Foto 01)</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <MermiStoreProvider>
      <MainAppContent />
    </MermiStoreProvider>
  );
}
