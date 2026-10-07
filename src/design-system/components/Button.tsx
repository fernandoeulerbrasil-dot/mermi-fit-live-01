import React from 'react';
import { Loader2, Check, AlertCircle } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'success' | 'points';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isSuccess = false,
  isError = false,
  leftIcon,
  rightIcon,
  children,
  fullWidth = false,
  disabled,
  className = '',
  ...props
}) => {
  const baseClasses =
    'relative inline-flex items-center justify-center font-black uppercase tracking-wider font-[\'Outfit\'] transition-all duration-200 select-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 rounded-2xl';

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 min-h-[36px]',
    md: 'text-sm px-5 py-2.5 gap-2 min-h-[44px]',
    lg: 'text-base px-6 py-3.5 gap-2.5 min-h-[52px]'
  }[size];

  const variantClasses: Record<ButtonVariant, string> = {
    // Verde Mermi (ação principal, saúde, evolução)
    primary:
      'bg-[#0EB24A] hover:bg-[#0CA042] text-white shadow-md shadow-emerald-500/20 focus:ring-[#0EB24A]',
    
    // Secundário (superfície suave)
    secondary:
      'bg-stone-200 hover:bg-stone-300 text-stone-900 dark:bg-stone-800 dark:hover:bg-stone-700 dark:text-white focus:ring-stone-400',
    
    // Contorno (alternativa elegante)
    outline:
      'bg-transparent border-2 border-stone-300 dark:border-stone-700 hover:border-[#0EB24A] text-stone-800 dark:text-stone-200 hover:text-[#0EB24A] focus:ring-[#0EB24A]',
    
    // Vermelho (energia, alertas, saídas)
    danger:
      'bg-[#E52525] hover:bg-[#CC1F1F] text-white shadow-md shadow-rose-500/20 focus:ring-[#E52525]',
    
    // Sucesso (conclusões e confirmações)
    success:
      'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 focus:ring-emerald-500',
    
    // Points / Gamificação (degrade dourado/laranja com alto impacto)
    points:
      'bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 hover:from-amber-300 hover:to-orange-400 text-stone-950 font-black shadow-lg shadow-amber-500/25 border border-amber-300/40 focus:ring-amber-400'
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseClasses} ${sizeClasses} ${variantClasses[variant]} ${widthClass} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Processando...</span>
        </span>
      ) : isSuccess ? (
        <span className="flex items-center gap-1.5 text-emerald-100">
          <Check className="w-4 h-4" />
          <span>Concluído!</span>
        </span>
      ) : isError ? (
        <span className="flex items-center gap-1.5 text-rose-100">
          <AlertCircle className="w-4 h-4" />
          <span>Erro</span>
        </span>
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};

// Shorthand helpers para consistência direta
export const PrimaryButton: React.FC<ButtonProps> = (props) => <Button variant="primary" {...props} />;
export const SecondaryButton: React.FC<ButtonProps> = (props) => <Button variant="secondary" {...props} />;
export const OutlineButton: React.FC<ButtonProps> = (props) => <Button variant="outline" {...props} />;
export const DangerButton: React.FC<ButtonProps> = (props) => <Button variant="danger" {...props} />;
export const SuccessButton: React.FC<ButtonProps> = (props) => <Button variant="success" {...props} />;
export const PointsButton: React.FC<ButtonProps> = (props) => <Button variant="points" {...props} />;
