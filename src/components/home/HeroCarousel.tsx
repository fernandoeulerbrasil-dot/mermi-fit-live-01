import React, { useState, useEffect, useRef } from 'react';
import { BannerItem } from '../../types/homeContent';
import { useMermiStore } from '../../context/MermiStoreContext';

interface HeroCarouselProps {
  onNavigate: (destination: string) => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ onNavigate }) => {
  const { banners, audienceProfile, trackEvent } = useMermiStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const viewedBannersRef = useRef<Set<string>>(new Set());

  // Filter banners based on active state and scheduling
  const today = new Date().toISOString().split('T')[0];
  const activeBanners = banners
    .filter((b) => b.active)
    .filter((b) => {
      if (b.startDate && b.startDate > today) return false;
      if (b.endDate && b.endDate < today) return false;
      return true;
    })
    .filter((b) => {
      if (b.audience === 'all') return true;
      if (audienceProfile === 'standard') return true;
      if (b.audience === 'new_users' && audienceProfile === 'new_user') return true;
      if (b.audience === 'challenge_active' && audienceProfile === 'challenge_user') return true;
      if (b.audience === 'points_ready' && audienceProfile === 'points_ready_user') return true;
      if (b.audience === 'race_ready' && audienceProfile === 'race_user') return true;
      if (b.audience === 'inactive' && audienceProfile === 'inactive_user') return true;
      return false;
    })
    .sort((a, b) => a.order - b.order);

  const displayBanners = activeBanners.length > 0 ? activeBanners : banners.slice(0, 1);

  // Auto advance
  useEffect(() => {
    if (isPaused || displayBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayBanners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, displayBanners.length]);

  // Track view when index changes
  useEffect(() => {
    const current = displayBanners[currentIndex];
    if (current && !viewedBannersRef.current.has(current.id)) {
      viewedBannersRef.current.add(current.id);
      trackEvent('banner_view', current.id, current.title);
    }
  }, [currentIndex, displayBanners, trackEvent]);

  if (displayBanners.length === 0) return null;

  const currentBanner = displayBanners[currentIndex] || displayBanners[0];

  const handleAction = () => {
    trackEvent('banner_click', currentBanner.id, currentBanner.title);
    onNavigate(currentBanner.destination);
  };

  const getThemeClasses = (theme: BannerItem['visualTheme']) => {
    switch (theme) {
      case 'dark':
        return {
          bg: 'bg-gradient-to-br from-stone-950 via-[#141414] to-black text-white border-stone-800',
          accent: 'text-[#F59E0B]',
          badge: 'bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/40',
          button: 'bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-stone-950 hover:brightness-110'
        };
      case 'crimson':
        return {
          bg: 'bg-gradient-to-br from-[#2D0B0D] via-[#1E090A] to-[#120405] text-white border-red-950/60',
          accent: 'text-[#E53935]',
          badge: 'bg-[#E53935]/20 text-[#FF6B6B] border-[#E53935]/40',
          button: 'bg-gradient-to-r from-[#E53935] to-[#C62828] text-white hover:brightness-110'
        };
      case 'amber':
        return {
          bg: 'bg-gradient-to-br from-[#231805] via-[#171003] to-stone-950 text-white border-amber-950/60',
          accent: 'text-[#FBBF24]',
          badge: 'bg-[#FBBF24]/20 text-[#FBBF24] border-[#FBBF24]/40',
          button: 'bg-gradient-to-r from-[#FBBF24] to-[#F59E0B] text-stone-950 hover:brightness-110'
        };
      case 'emerald':
        return {
          bg: 'bg-gradient-to-br from-[#062015] via-[#04170F] to-stone-950 text-white border-emerald-950/60',
          accent: 'text-emerald-400',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          button: 'bg-gradient-to-r from-[#0EB24A] to-emerald-600 text-white hover:brightness-110'
        };
      case 'green':
      default:
        return {
          bg: 'bg-gradient-to-br from-[#0B2E1D] via-[#092216] to-[#04120B] text-white border-emerald-900/40',
          accent: 'text-[#00FF66]',
          badge: 'bg-[#0EB24A]/25 text-[#00FF66] border-[#0EB24A]/40',
          button: 'bg-gradient-to-r from-[#0EB24A] to-emerald-600 text-white hover:brightness-110'
        };
    }
  };

  const theme = getThemeClasses(currentBanner.visualTheme);

  return (
    <div
      className="relative w-full rounded-3xl overflow-hidden shadow-xl border select-none transition-all duration-300"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className={`p-6 sm:p-8 min-h-[220px] sm:min-h-[250px] flex flex-col justify-between relative ${theme.bg}`}>
        {/* Glow ambient background effect */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-[#0EB24A]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Top bar: Badge and Slide count */}
        <div className="flex items-center justify-between z-10">
          {currentBanner.badge ? (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border backdrop-blur-sm ${theme.badge}`}>
              <span>✦</span>
              <span>{currentBanner.badge}</span>
            </span>
          ) : (
            <span className="text-xs uppercase font-extrabold text-stone-400 tracking-wider">
              Destaque Oficial
            </span>
          )}

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-stone-400 font-mono">
              {currentIndex + 1} / {displayBanners.length}
            </span>
          </div>
        </div>

        {/* Center content with Authentic Asset Photo */}
        <div className="my-3 z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="max-w-md flex-1 text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white font-['Outfit'] tracking-tight leading-snug">
              {currentBanner.title}
            </h2>
            <p className="mt-2 text-stone-300 text-xs sm:text-sm md:text-base leading-relaxed line-clamp-2 sm:line-clamp-3">
              {currentBanner.subtitle}
            </p>
          </div>

          {/* Authentic Photo from Assets Folder (Sem distorção, sem corte, qualidade original 4K) */}
          <div className="shrink-0 flex items-center justify-center">
            <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-2xl bg-white/10 p-2 sm:p-2.5 border border-white/20 shadow-2xl backdrop-blur-md flex items-center justify-center overflow-hidden">
              <img
                src={
                  currentBanner.assetPath ||
                  (currentBanner.id.includes('points') || currentBanner.id.includes('exclusivo')
                    ? '/assets/mermi-points/mermi-points-horizontal-trans.png'
                    : '/assets/brand/mermi-logo.png')
                }
                alt={currentBanner.title}
                className="w-full h-full object-contain object-center drop-shadow-md transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>
        </div>

        {/* Bottom bar: CTA and Navigation */}
        <div className="flex items-center justify-between gap-4 z-10 pt-2">
          <button
            onClick={handleAction}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center gap-2 font-['Outfit'] ${theme.button}`}
          >
            <span>{currentBanner.buttonText}</span>
            <span className="text-base font-normal">→</span>
          </button>

          {/* Controls: Prev / Next */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentIndex((prev) => (prev - 1 + displayBanners.length) % displayBanners.length)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 flex items-center justify-center text-white transition-all backdrop-blur-sm"
              title="Anterior"
            >
              ‹
            </button>
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % displayBanners.length)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 flex items-center justify-center text-white transition-all backdrop-blur-sm"
              title="Próximo"
            >
              ›
            </button>
          </div>
        </div>

        {/* Indicators Dots */}
        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
          {displayBanners.map((b, idx) => (
            <button
              key={b.id}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'w-6 bg-white shadow-sm' : 'w-1.5 bg-white/30 hover:bg-white/50'
              }`}
              title={`Ir para banner ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
