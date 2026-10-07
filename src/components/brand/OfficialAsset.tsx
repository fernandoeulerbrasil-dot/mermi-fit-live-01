import React, { useState } from 'react';

export interface OfficialAssetProps {
  src?: string;
  alt?: string;
  aspectRatio?: string | number; // Default '1 / 1'
  className?: string;
  containerClassName?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  width?: number | string;
  height?: number | string;
  title?: string;
  priority?: boolean;
  fallbackText?: string;
}

/**
 * OfficialAsset Component
 * 
 * Regra Absoluta:
 * - Preserva EXATAMENTE a proporção original (aspect-ratio).
 * - Utiliza object-fit: contain e object-position: center.
 * - Impede stretch horizontal, vertical, compressão ou corte de bordas.
 * - NUNCA exibe imagem quebrada no navegador quando o arquivo não carregar.
 * - Se ausente, exibe contêiner oficial elegante e seguro.
 */
export const OfficialAsset: React.FC<OfficialAssetProps> = ({
  src,
  alt = 'Asset Oficial MerMi Fit Life',
  aspectRatio = '1 / 1',
  className = '',
  containerClassName = '',
  style,
  children,
  width,
  height,
  title,
  priority = false,
  fallbackText
}) => {
  const [hasError, setHasError] = useState(false);

  const containerStyle: React.CSSProperties = {
    aspectRatio: typeof aspectRatio === 'number' ? `${aspectRatio}` : aspectRatio,
    width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
    height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
    ...style
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none overflow-visible ${containerClassName}`}
      style={containerStyle}
      title={title || alt}
    >
      {src && !hasError ? (
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setHasError(true)}
          className={`object-contain object-center block ${className}`}
          style={{
            objectFit: 'contain',
            objectPosition: 'center',
            maxWidth: '100%',
            maxHeight: '100%',
            width: width ? (typeof width === 'number' ? `${width}px` : width) : 'auto',
            height: height ? (typeof height === 'number' ? `${height}px` : height) : 'auto',
            aspectRatio: typeof aspectRatio === 'number' ? `${aspectRatio}` : aspectRatio
          }}
        />
      ) : children ? (
        children
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-2 rounded-2xl bg-[#0EB24A]/10 border border-[#0EB24A]/30 text-stone-700 text-center select-none">
          <span className="text-[10px] font-black uppercase text-[#0EB24A] font-['Outfit'] tracking-wider">
            {fallbackText || title || 'Asset Oficial MerMi'}
          </span>
        </div>
      )}
    </div>
  );
};

