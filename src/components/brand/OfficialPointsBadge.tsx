import React from 'react';
import { OfficialAsset } from './OfficialAsset';
import { OFFICIAL_ASSET } from '../../services/officialAssets';

export interface OfficialPointsBadgeProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  points?: number;
  variant?: 'square' | 'horizontal';
  className?: string;
  imageSrc?: string;
  alt?: string;
  onClick?: () => void;
}

/**
 * OfficialPointsBadge - Selo Oficial MERMI POINTS
 * 
 * Regra Absoluta:
 * - Mantém aspect-ratio rigorosamente intacto (1:1 no formato quadrado, 3:2 no formato horizontal).
 * - object-fit: contain, object-position: center.
 * - Utiliza as imagens oficiais fornecidas pelo proprietário.
 * - Não substituir por texto simples nem recriar artes.
 */
export const OfficialPointsBadge: React.FC<OfficialPointsBadgeProps> = ({
  size = 'md',
  points,
  variant = 'square',
  className = '',
  imageSrc,
  alt = 'Logo Oficial MERMI POINTS',
  onClick
}) => {
  const sizeMap: Record<string, number> = {
    sm: 64,
    md: 100,
    lg: 148,
    xl: 200
  };

  const pixelSize = typeof size === 'number' ? size : sizeMap[size] || 100;
  const isHorizontal = variant === 'horizontal';
  
  const effectiveSrc = imageSrc || (isHorizontal 
    ? OFFICIAL_ASSET.mermi_points_horizontal
    : OFFICIAL_ASSET.mermi_points_square);

  return (
    <div
      onClick={onClick}
      className={`inline-flex flex-col items-center justify-center select-none ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      <OfficialAsset
        aspectRatio={isHorizontal ? '3 / 2' : '1 / 1'}
        width={isHorizontal ? Math.round(pixelSize * 1.5) : pixelSize}
        height={pixelSize}
        src={effectiveSrc}
        alt={alt}
        containerClassName="shrink-0 transition-transform duration-200 hover:scale-[1.03]"
        title="MERMI POINTS — Identidade Oficial"
        fallbackText="MERMI POINTS"
      />

      {/* Dynamic Points Pill */}
      {points !== undefined && (
        <div className="mt-2 px-3.5 py-1 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-stone-950 font-black text-xs rounded-full shadow-md border border-amber-300 flex items-center gap-1.5 shrink-0">
          <span>⭐</span>
          <span className="tracking-tight">{points.toLocaleString('pt-BR')} Points</span>
        </div>
      )}
    </div>
  );
};
