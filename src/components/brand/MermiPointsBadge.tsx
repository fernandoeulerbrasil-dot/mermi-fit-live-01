import React from 'react';
import { OfficialPointsBadge } from './OfficialPointsBadge';

export interface MermiPointsBadgeProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  points?: number;
  variant?: 'square' | 'horizontal';
  className?: string;
  imageSrc?: string;
  alt?: string;
  onClick?: () => void;
}

/**
 * MermiPointsBadge
 * 
 * Regra Absoluta:
 * - Redireciona para o componente central OfficialPointsBadge.
 * - Garante proporção rigorosa (1:1 ou 3:2), object-fit: contain e centralização.
 * - Sem distorção horizontal ou vertical, sem deformar o texto "MERMI POINTS", sem cortes.
 */
export const MermiPointsBadge: React.FC<MermiPointsBadgeProps> = ({
  size = 'md',
  points,
  variant = 'square',
  className = '',
  imageSrc,
  alt,
  onClick
}) => {
  return (
    <OfficialPointsBadge
      size={size}
      points={points}
      variant={variant}
      className={className}
      imageSrc={imageSrc}
      alt={alt}
      onClick={onClick}
    />
  );
};
