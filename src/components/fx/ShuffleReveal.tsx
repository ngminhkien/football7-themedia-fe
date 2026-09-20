import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { fireTeamSplitConfetti } from './confetti';
import { cn } from '../../lib/cn';

export interface ShuffleRevealProps {
  isRevealed: boolean;
  onComplete?: () => void;
  children: React.ReactNode;
  title?: string;
  durationMs?: number;
  className?: string;
}

export const ShuffleReveal: React.FC<ShuffleRevealProps> = ({
  isRevealed,
  onComplete,
  children,
  title = 'ĐANG PHÂN CHIA ĐỘI HÌNH...',
  durationMs = 2000,
  className,
}) => {
  const [stage, setStage] = useState<'idle' | 'shuffling' | 'revealed'>(
    isRevealed ? 'revealed' : 'idle'
  );

  useEffect(() => {
    if (isRevealed && stage !== 'revealed') {
      setStage('shuffling');
      const timer = setTimeout(() => {
        setStage('revealed');
        fireTeamSplitConfetti();
        onComplete?.();
      }, durationMs);
      return () => clearTimeout(timer);
    }
  }, [isRevealed, stage, durationMs, onComplete]);

  return (
    <div className={cn('relative w-full', className)}>
      <AnimatePresence mode="wait">
        {stage === 'shuffling' ? (
          <motion.div
            key="shuffling"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="flex flex-col items-center justify-center py-20 px-6 rounded-3xl bg-pitch-panel/90 border-2 border-accent-neon/60 shadow-[0_0_50px_rgba(232,255,58,0.2)] text-center backdrop-blur-xl"
          >
            {/* Pulsing Tactical Icon */}
            <motion.div
              animate={{
                rotate: [0, 180, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-20 h-20 rounded-2xl bg-accent-neon/10 border-2 border-accent-neon flex items-center justify-center text-accent-neon mb-6 shadow-[0_0_25px_rgba(232,255,58,0.5)]"
            >
              <Trophy className="w-10 h-10" />
            </motion.div>

            <h3 className="text-2xl sm:text-3xl font-display uppercase tracking-widest text-white font-black mb-2 animate-pulse">
              {title}
            </h3>
            <p className="text-sm text-pitch-muted font-mono max-w-sm">
              Đang tối ưu 1.716 tổ hợp đội hình và cân bằng điểm số thực lực...
            </p>
          </motion.div>
        ) : stage === 'revealed' ? (
          <motion.div
            key="revealed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, type: 'spring', damping: 25 }}
          >
            {children}
          </motion.div>
        ) : (
          <div key="idle">{children}</div>
        )}
      </AnimatePresence>
    </div>
  );
};
