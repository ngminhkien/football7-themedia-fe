import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../lib/cn';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-pitch-line/40 bg-pitch-panel/40 backdrop-blur-sm',
        className
      )}
    >
      {Icon && (
        <div className="w-14 h-14 mb-4 rounded-2xl bg-pitch-line/30 flex items-center justify-center text-accent-neon shadow-[0_0_15px_rgba(232,255,58,0.1)]">
          <Icon className="w-7 h-7" />
        </div>
      )}
      <h4 className="text-lg font-display uppercase tracking-wider text-pitch-text mb-1.5">
        {title}
      </h4>
      <p className="text-sm text-pitch-muted max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button variant="neon" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
