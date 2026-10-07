import React from 'react';
import { OfficialLogo } from './OfficialLogo';

export interface MermiLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'splash' | number;
  className?: string;
  showSubtitle?: boolean;
  imageSrc?: string;
  alt?: string;
  onClick?: () => void;
}

/**
 * MermiLogo
 * 
 * Regra Absoluta:
 * - Redireciona para o componente central OfficialLogo.
 * - Garante proporção 1:1 rigorosa (aspect-ratio: 1/1), object-fit: contain e centralização.
 * - Sem distorção horizontal ou vertical, sem cortes.
 */
export const MermiLogo: React.FC<MermiLogoProps> = ({
  size = 'md',
  className = '',
  showSubtitle = false,
  imageSrc,
  alt,
  onClick
}) => {
  return (
    <OfficialLogo
      size={size}
      className={className}
      showSubtitle={showSubtitle}
      imageSrc={imageSrc}
      alt={alt}
      onClick={onClick}
    />
  );
};
