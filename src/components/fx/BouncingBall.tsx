import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/cn';

export interface BouncingBallProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

export const BouncingBall: React.FC<BouncingBallProps> = ({
  size = 'md',
  className,
  label = 'Đang xử lý...',
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  }[size];

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div className="relative flex items-center justify-center h-20">
        {/* Ball */}
        <motion.div
          animate={{
            y: [-25, 0, -25],
            rotate: [0, 180, 360],
          }}
          transition={{
            y: { duration: 0.6, repeat: Infinity, ease: 'easeInOut' },
            rotate: { duration: 1.2, repeat: Infinity, ease: 'linear' },
          }}
          className={cn(
            'rounded-full bg-white border-2 border-pitch-dark flex items-center justify-center text-pitch-dark font-bold shadow-xl overflow-hidden',
            sizeClasses
          )}
        >
          {/* Football pattern SVG */}
          <svg viewBox="0 0 24 24" className="w-full h-full fill-none stroke-pitch-dark" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" className="fill-white" />
            <polygon points="12,7 16,10 14.5,15 9.5,15 8,10" className="fill-pitch-dark" />
            <line x1="12" y1="2" x2="12" y2="7" />
            <line x1="21.5" y1="8.5" x2="16" y2="10" />
            <line x1="18" y1="19.5" x2="14.5" y2="15" />
            <line x1="6" y1="19.5" x2="9.5" y2="15" />
            <line x1="2.5" y1="8.5" x2="8" y2="10" />
          </svg>
        </motion.div>

        {/* Shadow on turf */}
        <motion.div
          animate={{
            scale: [0.6, 1.2, 0.6],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute bottom-1 w-8 h-2 rounded-full bg-black/50 blur-[2px]"
        />
      </div>

      {label && <p className="text-xs font-medium text-pitch-muted animate-pulse">{label}</p>}
    </div>
  );
};
