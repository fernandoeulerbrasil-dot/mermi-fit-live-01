import React from 'react';
import { OfficialAsset } from './OfficialAsset';

export interface OfficialIconProps {
  icon?: React.ComponentType<{ className?: string; size?: number | string }>;
  src?: string;
  emoji?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | number;
  className?: string;
  containerClassName?: string;
  bgClassName?: string;
  alt?: string;
  onClick?: () => void;
}

/**
 * OfficialIcon
 * 
 * Regra Absoluta:
 * - aspect-ratio fixo 1:1 rigorosamente preservado.
 * - Centralização perfeita (flex items-center justify-center).
 * - Sem distorções ou cortes laterais em ícones, emojis ou mini-gráficos.
 */
export const OfficialIcon: React.FC<OfficialIconProps> = ({
  icon: IconComponent,
  src,
  emoji,
  size = 'md',
  className = '',
  containerClassName = '',
  bgClassName = '',
  alt = 'Ícone Oficial',
  onClick
}) => {
  const sizeMap: Record<string, number> = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 56
  };

  const pixelSize = typeof size === 'number' ? size : sizeMap[size] || 40;
  const iconPixelSize = Math.round(pixelSize * 0.55);

  return (
    <OfficialAsset
      aspectRatio="1 / 1"
      width={pixelSize}
      height={pixelSize}
      containerClassName={`rounded-full shrink-0 ${bgClassName} ${containerClassName} ${
        onClick ? 'cursor-pointer hover:scale-105 active:scale-95 transition-transform' : ''
      }`}
      title={alt}
    >
      <div
        onClick={onClick}
        className="w-full h-full flex items-center justify-center p-1"
        style={{ aspectRatio: '1 / 1' }}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className={`w-full h-full object-contain object-center ${className}`}
            style={{ objectFit: 'contain', objectPosition: 'center', aspectRatio: '1 / 1' }}
          />
        ) : IconComponent ? (
          <IconComponent
            size={iconPixelSize}
            className={`shrink-0 ${className}`}
          />
        ) : emoji ? (
          <span
            className={`leading-none select-none text-center ${className}`}
            style={{ fontSize: `${iconPixelSize}px` }}
          >
            {emoji}
          </span>
        ) : null}
      </div>
    </OfficialAsset>
  );
};
