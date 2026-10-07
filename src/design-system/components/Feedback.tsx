import React from 'react';
import {
  Loader2,
  AlertTriangle,
  Inbox,
  CheckCircle2,
  X,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { PrimaryButton, OutlineButton } from './Button';

// 1. BADGE
export interface BadgeProps {
  variant?: 'green' | 'amber' | 'red' | 'neutral' | 'dark';
  children: React.ReactNode;
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'green',
  children,
  size = 'md',
  className = ''
}) => {
  const variantStyles = {
    green: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    amber: 'bg-amber-100 text-amber-900 border-amber-300',
    red: 'bg-rose-100 text-rose-800 border-rose-200',
    neutral: 'bg-stone-100 text-stone-700 border-stone-200',
    dark: 'bg-stone-900 text-amber-300 border-stone-800'
  }[variant];

  const sizeStyles = size === 'sm' ? 'text-[9px] px-2 py-0.5' : 'text-[11px] px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1 font-black uppercase tracking-wider font-['Outfit'] rounded-full border ${variantStyles} ${sizeStyles} ${className}`}
    >
      {children}
    </span>
  );
};

// 2. CHIP (Filtros e seleção)
export interface ChipProps {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  count?: number;
  className?: string;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  isActive = false,
  onClick,
  count,
  className = ''
}) => {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black uppercase font-['Outfit'] tracking-wide transition-all cursor-pointer select-none ${
        isActive
          ? 'bg-[#0EB24A] text-white shadow-sm shadow-emerald-500/30'
          : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200/80'
      } ${className}`}
    >
      <span>{label}</span>
      {count !== undefined && (
        <span
          className={`text-[10px] px-1.5 py-0.2 rounded-full ${
            isActive ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-600'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
};

// 3. PROGRESS BAR
export interface ProgressBarProps {
  value: number; // 0 a 100
  color?: string;
  height?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  color = 'from-[#0EB24A] to-emerald-400',
  height = 'md',
  showLabel = false,
  className = ''
}) => {
  const clamped = Math.min(100, Math.max(0, value));
  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  }[height];

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-[10px] font-bold text-stone-400 mb-1">
          <span>Progresso</span>
          <span>{clamped}%</span>
        </div>
      )}
      <div className={`w-full bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden p-0.5 border border-stone-200/60 dark:border-stone-700/60 ${heightClasses}`}>
        <div
          className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-300`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};

// 4. EMPTY STATE
export interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  icon = <Inbox className="w-8 h-8 text-stone-400" />
}) => {
  return (
    <div className="rounded-3xl border-2 border-dashed border-stone-200 dark:border-stone-800 p-8 text-center flex flex-col items-center justify-center max-w-md mx-auto my-4 space-y-3">
      <div className="w-14 h-14 rounded-2xl bg-stone-100 dark:bg-stone-900 flex items-center justify-center">
        {icon}
      </div>
      <h4 className="text-base font-black text-stone-900 dark:text-white uppercase font-['Outfit']">
        {title}
      </h4>
      <p className="text-xs text-stone-500 leading-relaxed max-w-xs">{description}</p>
      {actionText && onAction && (
        <PrimaryButton size="sm" onClick={onAction}>
          {actionText}
        </PrimaryButton>
      )}
    </div>
  );
};

// 5. LOADING STATE
export const LoadingState: React.FC<{ message?: string }> = ({
  message = 'Carregando ecossistema Mermi...'
}) => {
  return (
    <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
      <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-[#0EB24A] animate-spin flex items-center justify-center" />
      <p className="text-xs font-bold text-stone-500 uppercase tracking-wider font-['Outfit']">
        {message}
      </p>
    </div>
  );
};

// 6. ERROR STATE
export const ErrorState: React.FC<{
  title?: string;
  message?: string;
  onRetry?: () => void;
}> = ({
  title = 'Ops! Algo deu errado',
  message = 'Não conseguimos carregar agora. Verifique sua conexão e tente novamente.',
  onRetry
}) => {
  return (
    <div className="rounded-3xl bg-rose-50 border border-rose-200 p-6 text-center flex flex-col items-center justify-center max-w-md mx-auto my-4 space-y-2">
      <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
        <AlertTriangle className="w-5 h-5" />
      </div>
      <h4 className="text-sm font-black text-rose-900 uppercase font-['Outfit']">{title}</h4>
      <p className="text-xs text-rose-700">{message}</p>
      {onRetry && (
        <OutlineButton size="sm" onClick={onRetry} className="mt-2">
          Tentar novamente
        </OutlineButton>
      )}
    </div>
  );
};

// 7. MODAL
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-lg'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className={`w-full ${maxWidth} bg-[#FBF7EE] dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col max-h-[90vh]`}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <h3 className="text-lg font-black uppercase text-stone-900 dark:text-white font-['Outfit']">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 hover:text-stone-900 dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};

// 8. BOTTOM SHEET
export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  children
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg mx-auto bg-[#FBF7EE] dark:bg-stone-900 rounded-t-3xl border-t border-stone-200 dark:border-stone-800 p-5 shadow-2xl max-h-[85vh] overflow-y-auto">
        <div className="w-12 h-1 bg-stone-300 dark:bg-stone-700 rounded-full mx-auto mb-4" />
        {title && (
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-200 dark:border-stone-800">
            <h3 className="text-base font-black uppercase text-stone-900 dark:text-white font-['Outfit']">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="text-xs font-bold text-stone-500 hover:text-stone-900 cursor-pointer"
            >
              Fechar
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};
