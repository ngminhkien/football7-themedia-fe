import React from 'react';
import { cn } from '../../lib/cn';

export interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'neon' | 'white' | 'muted';
  className?: string;
  label?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  variant = 'neon',
  className,
  label,
}) => {
  const sizeClasses = {
    xs: 'h-3.5 w-3.5 border-2',
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-8 w-8 border-3',
    xl: 'h-12 w-12 border-4',
  }[size];

  const variantClasses = {
    neon: 'border-pitch-line border-t-accent-neon shadow-[0_0_10px_rgba(232,255,58,0.2)]',
    white: 'border-white/20 border-t-white',
    muted: 'border-pitch-line border-t-pitch-muted',
  }[variant];

  return (
    <div className={cn('inline-flex items-center gap-2.5', className)} role="status">
      <div
        className={cn(
          'rounded-full animate-spin',
          sizeClasses,
          variantClasses
        )}
      />
      {label && <span className="text-xs text-pitch-muted font-medium">{label}</span>}
      <span className="sr-only">Đang tải...</span>
    </div>
  );
};
