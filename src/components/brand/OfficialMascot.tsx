import React from 'react';
import { OfficialAsset } from './OfficialAsset';
import { OFFICIAL_ASSET } from '../../services/officialAssets';

export interface OfficialMascotProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'hero' | number;
  mode?: 'full' | 'face';
  showSpeechBubble?: boolean;
  speechText?: string;
  isSpeaking?: boolean;
  className?: string;
  imageSrc?: string;
  alt?: string;
  onClick?: () => void;
  priority?: boolean;
}

/**
 * OfficialMascot - MerMi IA (Personagem Oficial e Imutável)
 * 
 * Regra Absoluta:
 * - Utiliza a referência única OFFICIAL_ASSET.mermi_ai_official_png (corpo inteiro sem fundo)
 *   ou OFFICIAL_ASSET.mermi_ai_face_png (rosto em close-up 1:1 sem fundo).
 * - Proporção preservada integralmente (3:4 para corpo inteiro, 1:1 para rosto).
 * - object-fit: contain, object-position: center.
 * - Sem achatamento nem estiramento.
 */
export const OfficialMascot: React.FC<OfficialMascotProps> = ({
  size = 'md',
  mode = 'full',
  showSpeechBubble = false,
  speechText = 'Olá! Eu sou a IA Mermi!',
  isSpeaking = false,
  className = '',
  imageSrc,
  alt,
  onClick,
  priority = false
}) => {
  const isFace = mode === 'face';

  const fullSizeMap: Record<string, { width: number; height: number }> = {
    xs: { width: 44, height: 58 },
    sm: { width: 64, height: 85 },
    md: { width: 96, height: 128 },
    lg: { width: 144, height: 192 },
    hero: { width: 210, height: 280 }
  };

  const faceSizeMap: Record<string, { width: number; height: number }> = {
    xs: { width: 44, height: 44 },
    sm: { width: 64, height: 64 },
    md: { width: 96, height: 96 },
    lg: { width: 144, height: 144 },
    hero: { width: 200, height: 200 }
  };

  const sizeMap = isFace ? faceSizeMap : fullSizeMap;

  const currentSize =
    typeof size === 'number'
      ? { width: size, height: isFace ? size : Math.round(size * 1.33) }
      : sizeMap[size] || sizeMap.md;

  const defaultSrc = isFace ? OFFICIAL_ASSET.mermi_ai_face_png : OFFICIAL_ASSET.mermi_ai_official_png;
  const effectiveSrc = imageSrc || defaultSrc;
  const effectiveAlt = alt || (isFace ? 'Rosto Oficial MerMi IA' : 'Mascote Oficial MerMi IA 4K');
  const aspectRatio = isFace ? '1 / 1' : '3 / 4';

  return (
    <div
      onClick={onClick}
      className={`inline-flex flex-col items-center justify-center select-none ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {/* Speech Bubble Oficial */}
      {showSpeechBubble && (
        <div className="relative mb-2 px-3.5 py-1.5 bg-white rounded-2xl border-2 border-[#0EB24A] shadow-md shadow-emerald-500/20 max-w-[240px] text-center z-20 shrink-0 animate-fade-in">
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-[#0EB24A] font-bold text-xs">⚡</span>
            <p className="font-extrabold text-stone-900 text-xs sm:text-sm leading-snug font-['Outfit']">
              {speechText}
            </p>
          </div>
          {/* Triângulo indicador do balão */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[#0EB24A]" />
          <div className="absolute -bottom-[6px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-white" />
        </div>
      )}

      {/* Frame do Personagem Oficial (Sem fundo, proporção perfeita) */}
      <OfficialAsset
        aspectRatio={aspectRatio}
        width={currentSize.width}
        height={currentSize.height}
        src={effectiveSrc}
        alt={effectiveAlt}
        priority={priority}
        containerClassName="shrink-0 transition-transform duration-200 hover:scale-[1.02] drop-shadow-md"
        title={isFace ? 'MerMi IA — Rosto Oficial' : 'MerMi IA — Mascote Oficial 4K'}
        fallbackText="MerMi IA Oficial"
      >
        <div className="w-full h-full rounded-2xl overflow-hidden bg-transparent flex items-center justify-center p-0">
          <img
            src={effectiveSrc}
            alt={effectiveAlt}
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain"
            style={{ aspectRatio, objectFit: 'contain' }}
          />
        </div>
      </OfficialAsset>
    </div>
  );
};
