import React from 'react';
import { cn } from '../../lib/cn';
import { getInitials } from '../../lib/format';

export interface BallAvatarProps {
  name: string;
  avatarUrl?: string | null;
  jerseyNumber?: number | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  teamVariant?: 'teamA' | 'teamB' | 'neon' | 'neutral';
  className?: string;
}

export const BallAvatar: React.FC<BallAvatarProps> = ({
  name,
  avatarUrl,
  jerseyNumber,
  size = 'md',
  teamVariant = 'neutral',
  className,
}) => {
  const initials = getInitials(name);

  const sizeClasses = {
    xs: 'w-7 h-7 text-[10px]',
    sm: 'w-9 h-9 text-xs',
    md: 'w-11 h-11 text-sm',
    lg: 'w-14 h-14 text-base font-bold',
    xl: 'w-20 h-20 text-xl font-bold',
  }[size];

  const variantClasses = {
    teamA:
      'bg-gradient-to-br from-emerald-700 to-emerald-950 border-2 border-emerald-400 text-emerald-100 shadow-[0_0_12px_rgba(16,185,129,0.3)]',
    teamB:
      'bg-gradient-to-br from-cyan-700 to-cyan-950 border-2 border-cyan-400 text-cyan-100 shadow-[0_0_12px_rgba(6,182,212,0.3)]',
    neon:
      'bg-gradient-to-br from-pitch-panel to-pitch-dark border-2 border-accent-neon text-accent-neon shadow-[0_0_12px_rgba(232,255,58,0.3)]',
    neutral:
      'bg-gradient-to-br from-pitch-panel to-pitch-dark border border-pitch-line text-pitch-text',
  }[teamVariant];

  return (
    <div className={cn('relative inline-block select-none', className)}>
      <div
        className={cn(
          'rounded-full flex items-center justify-center font-display tracking-wider overflow-hidden uppercase font-semibold transition-transform',
          sizeClasses,
          variantClasses
        )}
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span>{initials}</span>
        )}
      </div>

      {jerseyNumber != null && (
        <span
          className={cn(
            'absolute -top-1 -right-1 font-mono font-bold rounded-full flex items-center justify-center border shadow',
            size === 'xs' || size === 'sm'
              ? 'h-4 w-4 text-[9px] -top-1 -right-1'
              : 'h-5 w-5 text-[10px] -top-1 -right-1',
            teamVariant === 'teamA'
              ? 'bg-emerald-900 border-emerald-400 text-emerald-200'
              : teamVariant === 'teamB'
              ? 'bg-cyan-900 border-cyan-400 text-cyan-200'
              : 'bg-pitch-dark border-accent-neon/80 text-accent-neon'
          )}
        >
          {jerseyNumber}
        </span>
      )}
    </div>
  );
};
