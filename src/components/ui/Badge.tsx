import React from 'react';
import { cn } from '../../lib/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'neon' | 'teamA' | 'teamB' | 'warning' | 'danger' | 'success' | 'outline';
  size?: 'xs' | 'sm' | 'md';
  dot?: boolean;
  pulseDot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'default',
  size = 'sm',
  dot = false,
  pulseDot = false,
  ...props
}) => {
  const variantStyles = {
    default: 'bg-pitch-panel text-pitch-muted border-pitch-line/50',
    neon: 'bg-pitch-panel/90 text-accent-neon border-accent-neon/40 shadow-[0_0_8px_rgba(232,255,58,0.15)]',
    teamA: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.15)]',
    teamB: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40 shadow-[0_0_8px_rgba(6,182,212,0.15)]',
    warning: 'bg-amber-950/80 text-amber-300 border-amber-500/40',
    danger: 'bg-rose-950/80 text-rose-300 border-rose-500/40',
    success: 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40',
    outline: 'bg-transparent text-pitch-text border-pitch-line',
  }[variant];

  const sizeStyles = {
    xs: 'text-[10px] px-1.5 py-0.5 font-medium tracking-wide',
    sm: 'text-xs px-2 py-0.5 font-medium',
    md: 'text-sm px-2.5 py-1 font-semibold',
  }[size];

  const dotColor = {
    default: 'bg-pitch-muted',
    neon: 'bg-accent-neon',
    teamA: 'bg-emerald-400',
    teamB: 'bg-cyan-400',
    warning: 'bg-amber-400',
    danger: 'bg-rose-400',
    success: 'bg-emerald-400',
    outline: 'bg-pitch-muted',
  }[variant];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border transition-all select-none',
        variantStyles,
        sizeStyles,
        className
      )}
      {...props}
    >
      {dot && (
        <span className="relative flex h-2 w-2">
          {pulseDot && (
            <span
              className={cn(
                'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
                dotColor
              )}
            />
          )}
          <span className={cn('relative inline-flex rounded-full h-2 w-2', dotColor)} />
        </span>
      )}
      {children}
    </span>
  );
};
