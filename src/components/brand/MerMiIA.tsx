import React from 'react';

export interface MerMiIAProps {
  officialAssetId?: 'mermi-ia-official';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero' | number;
  className?: string;
  showSpeechBubble?: boolean;
  speechText?: string;
  isSpeaking?: boolean;
  onClick?: () => void;
  alt?: string;
  priority?: boolean;
}

/**
 * MerMiIA — Componente Oficial e Imutável da Assistente Inteligente do Ecossistema
 * 
 * Regra Absoluta (Bloco 09):
 * - Vinculado exclusivamente ao Asset oficial registrado: "mermi-ia-official".
 * - Utiliza exatamente o PNG oficial fornecido pelo proprietário em /assets/ia/mermi-ia-official.png.
 * - NUNCA recriar, redesenhar, substituir, estilizar, alterar proporções ou gerar imagem alternativa.
 */
export const MerMiIA: React.FC<MerMiIAProps> = ({
  officialAssetId = 'mermi-ia-official',
  size = 'md',
  className = '',
  showSpeechBubble = false,
  speechText = 'Olá! Eu sou a IA Mermi!',
  isSpeaking = false,
  onClick,
  alt = 'MerMi IA Oficial - Assistente Inteligente do Ecossistema MerMi Fit Life',
  priority = false
}) => {
  // Caminho único e oficial do asset fornecido
  const officialSrc = '/assets/ia/mermi-ia-official.png';

  const sizePresets: Record<string, { width: number; height: number; classNames: string }> = {
    xs: { width: 48, height: 64, classNames: 'w-12 h-16' },
    sm: { width: 64, height: 85, classNames: 'w-16 h-[85px]' },
    md: { width: 110, height: 146, classNames: 'w-[110px] h-[146px]' },
    lg: { width: 160, height: 213, classNames: 'w-40 h-[213px]' },
    xl: { width: 220, height: 293, classNames: 'w-[220px] h-[293px]' },
    hero: { width: 280, height: 373, classNames: 'w-[280px] h-[373px]' }
  };

  const preset = typeof size === 'string' && sizePresets[size]
    ? sizePresets[size]
    : { width: typeof size === 'number' ? size : 120, height: typeof size === 'number' ? Math.round(size * 1.33) : 160, classNames: '' };

  const customStyle = typeof size === 'number' ? { width: `${preset.width}px`, height: `${preset.height}px` } : undefined;

  return (
    <div
      data-asset-id={officialAssetId}
      className={`relative inline-flex flex-col items-center select-none ${onClick ? 'cursor-pointer group' : ''} ${className}`}
      onClick={onClick}
    >
      {/* Balão de fala contextual opcional (quando solicitado pela interface) */}
      {showSpeechBubble && (
        <div className="absolute -top-10 z-20 animate-bounce duration-1000">
          <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-lg border border-emerald-400 text-emerald-950 font-black text-xs font-['Outfit'] whitespace-nowrap flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {speechText}
          </div>
        </div>
      )}

      {/* Renderização estrita do PNG oficial mantendo 100% das proporções */}
      <div
        className={`relative flex items-center justify-center ${preset.classNames}`}
        style={customStyle}
      >
        {isSpeaking && (
          <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-xl animate-pulse pointer-events-none" />
        )}
        <img
          src={officialSrc}
          alt={alt}
          width={preset.width}
          height={preset.height}
          loading={priority ? 'eager' : 'lazy'}
          className={`w-full h-full object-contain object-center drop-shadow-md transition-transform duration-300 ${
            onClick ? 'group-hover:scale-105' : ''
          } ${isSpeaking ? 'scale-[1.02]' : ''}`}
          onError={(e) => {
            // Garantia de fallback estrito para o caminho direto caso necessário
            const target = e.currentTarget;
            if (target.src !== `${window.location.origin}/file_00000000e860820e90b97bd246881e99.png`) {
              target.src = '/file_00000000e860820e90b97bd246881e99.png';
            }
          }}
        />
      </div>
    </div>
  );
};
