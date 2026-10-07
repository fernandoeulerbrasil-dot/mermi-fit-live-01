import React from 'react';

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

// NÍVEL 1: Títulos principais
export const Heading: React.FC<TypographyProps> = ({
  children,
  className = '',
  as: Component = 'h1',
  ...props
}) => {
  return (
    <Component
      className={`text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight uppercase font-['Outfit'] ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

// NÍVEL 2: Títulos de seção
export const SectionTitle: React.FC<TypographyProps> = ({
  children,
  className = '',
  as: Component = 'h2',
  ...props
}) => {
  return (
    <Component
      className={`text-xl sm:text-2xl font-black tracking-tight uppercase font-['Outfit'] ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

// NÍVEL 3: Subtítulos
export const Subtitle: React.FC<TypographyProps> = ({
  children,
  className = '',
  as: Component = 'h3',
  ...props
}) => {
  return (
    <Component
      className={`text-base sm:text-lg font-bold leading-snug ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

// NÍVEL 4: Texto principal
export const BodyText: React.FC<TypographyProps> = ({
  children,
  className = '',
  as: Component = 'p',
  ...props
}) => {
  return (
    <Component
      className={`text-sm sm:text-base font-normal leading-relaxed text-stone-700 dark:text-stone-300 ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

// NÍVEL 5: Texto auxiliar
export const AuxText: React.FC<TypographyProps> = ({
  children,
  className = '',
  as: Component = 'p',
  ...props
}) => {
  return (
    <Component
      className={`text-xs sm:text-sm font-medium leading-normal text-stone-500 dark:text-stone-400 ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

// NÍVEL 6: Labels e metadados
export const LabelText: React.FC<TypographyProps> = ({
  children,
  className = '',
  as: Component = 'span',
  ...props
}) => {
  return (
    <Component
      className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

// NÚMEROS: Preços, Points, Níveis, Indicadores de alto destaque
interface MetricNumberProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: string | number;
  unit?: string;
  prefix?: string;
  highlightColor?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const MetricNumber: React.FC<MetricNumberProps> = ({
  value,
  unit,
  prefix,
  highlightColor = 'text-stone-900 dark:text-white',
  size = 'md',
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'text-lg sm:text-xl',
    md: 'text-2xl sm:text-3xl',
    lg: 'text-3xl sm:text-4xl',
    xl: 'text-4xl sm:text-5xl',
  }[size];

  return (
    <span
      className={`inline-flex items-baseline gap-1 font-black font-['Outfit'] tracking-tight ${sizeClasses} ${highlightColor} ${className}`}
      {...props}
    >
      {prefix && <span className="text-xs sm:text-sm font-bold opacity-80">{prefix}</span>}
      <span>{value}</span>
      {unit && <span className="text-xs sm:text-sm font-extrabold uppercase opacity-80">{unit}</span>}
    </span>
  );
};
