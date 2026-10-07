import React from 'react';
import { OfficialAsset } from './OfficialAsset';
import { OFFICIAL_ASSET } from '../../services/officialAssets';

export interface OfficialLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'splash' | number;
  className?: string;
  showSubtitle?: boolean;
  imageSrc?: string;
  alt?: string;
  onClick?: () => void;
  priority?: boolean;
}

/**
 * OfficialLogo - MERMI FIT LIFE
 *
 * Regra Absoluta:
 * - Utiliza EXATAMENTE o arquivo original fornecido pelo proprietário.
 * - Mantém proporção estrita 1:1 (aspect-ratio: 1/1).
 * - object-fit: contain, object-position: center.
 * - Nunca redesenha, nunca deforma, nunca substitui por emoji ou versão gerada por IA.
 * - Preservação integral em Splash, Header, Home, Perfil e Loading.
 */
export const OfficialLogo: React.FC<OfficialLogoProps> = ({
  size = 'md',
  className = '',
  showSubtitle = false,
  imageSrc,
  alt = 'Logo Oficial MERMI FIT LIFE',
  onClick,
  priority = false
}) => {
  // Preset dimensions (locked aspect-ratio 1:1)
  const sizePixelMap: Record<string, number> = {
    xs: 36,
    sm: 48,
    md: 80,
    lg: 144,
    xl: 192,
    splash: 180
  };

  const pixelSize = typeof size === 'number' ? size : sizePixelMap[size] || 80;
  const effectiveSrc = imageSrc || OFFICIAL_ASSET.mermi_logo_png;

  return (
    <div
      onClick={onClick}
      className={`inline-flex flex-col items-center justify-center select-none ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      <OfficialAsset
        aspectRatio="1 / 1"
        width={pixelSize}
        height={pixelSize}
        src={effectiveSrc}
        alt={alt}
        priority={priority || size === 'splash'}
        containerClassName="shrink-0 transition-transform duration-200 hover:scale-[1.02]"
        title="MERMI FIT LIFE — Marca Oficial"
        fallbackText="MERMI FIT LIFE"
      />

      {showSubtitle && (
        <div className="mt-2 text-center pointer-events-none">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#0EB24A] font-['Outfit'] block">
            Alimentação & Vida Saudável
          </span>
          <span className="text-[9px] font-bold text-stone-400">
            Mais que um app. Um estilo de vida.
          </span>
        </div>
      )}
    </div>
  );
};
