import React from 'react';
import { OfficialMascot } from './OfficialMascot';

export interface MermiRobotMascotProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'hero' | number;
  mode?: 'full' | 'face';
  showSpeechBubble?: boolean;
  speechText?: string;
  isSpeaking?: boolean;
  className?: string;
  imageSrc?: string;
  alt?: string;
  onClick?: () => void;
}

/**
 * MermiRobotMascot
 * 
 * Regra Absoluta:
 * - Redireciona para o componente central OfficialMascot.
 * - Suporta 'full' (corpo inteiro transparente 3:4) e 'face' (rosto 1:1 transparente).
 * - Garante proporção original rigorosa, object-fit: contain e centralização.
 */
export const MermiRobotMascot: React.FC<MermiRobotMascotProps> = ({
  size = 'md',
  mode = 'full',
  showSpeechBubble = false,
  speechText = 'Olá! Eu sou a IA MerMi!',
  isSpeaking = false,
  className = '',
  imageSrc,
  alt,
  onClick
}) => {
  return (
    <OfficialMascot
      size={size}
      mode={mode}
      showSpeechBubble={showSpeechBubble}
      speechText={speechText}
      isSpeaking={isSpeaking}
      className={className}
      imageSrc={imageSrc}
      alt={alt}
      onClick={onClick}
    />
  );
};
