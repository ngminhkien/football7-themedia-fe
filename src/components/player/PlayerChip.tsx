import React from 'react';
import { X } from 'lucide-react';
import { Position } from '../../api/types';
import { cn } from '../../lib/cn';
import { BallAvatar } from './BallAvatar';
import { Badge } from '../ui/Badge';

export interface PlayerChipProps {
  id?: number;
  name: string;
  jerseyNumber?: number | null;
  avatarUrl?: string | null;
  primaryPosition?: Position | null;
  secondaryPosition?: Position | null;
  hasSubmitted?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  showPositions?: boolean;
  showStatus?: boolean;
  className?: string;
}

export const PlayerChip: React.FC<PlayerChipProps> = ({
  name,
  jerseyNumber,
  avatarUrl,
  primaryPosition,
  secondaryPosition,
  hasSubmitted,
  isSelected = false,
  onClick,
  onRemove,
  showPositions = true,
  showStatus = false,
  className,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl border transition-all text-sm select-none',
        onClick ? 'cursor-pointer hover:border-accent-neon/50 hover:bg-pitch-panel' : '',
        isSelected
          ? 'bg-accent-neon/15 border-accent-neon text-white shadow-[0_0_12px_rgba(232,255,58,0.2)]'
          : 'bg-pitch-panel/70 border-pitch-line/60 text-pitch-text',
        className
      )}
    >
      <BallAvatar
        name={name}
        avatarUrl={avatarUrl}
        jerseyNumber={jerseyNumber}
        size="xs"
        teamVariant={isSelected ? 'neon' : 'neutral'}
      />

      <span className="font-medium truncate max-w-[130px]">{name}</span>

      {showPositions && (
        <div className="flex items-center gap-1">
          {primaryPosition && (
            <Badge variant="neon" size="xs">
              {primaryPosition}
            </Badge>
          )}
          {secondaryPosition && (
            <Badge variant="teamB" size="xs">
              {secondaryPosition}
            </Badge>
          )}
        </div>
      )}

      {showStatus && hasSubmitted != null && (
        <span
          className={cn(
            'text-[10px] font-mono px-1.5 py-0.5 rounded-full',
            hasSubmitted
              ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
              : 'bg-amber-950/80 text-amber-400 border border-amber-500/30'
          )}
        >
          {hasSubmitted ? 'Đã nộp' : 'Chưa nộp'}
        </span>
      )}

      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="p-1 rounded-full text-pitch-muted hover:text-rose-400 hover:bg-white/5 transition-colors"
          aria-label="Xoá"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
};
