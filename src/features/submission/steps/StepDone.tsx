import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, RotateCcw, Trophy } from 'lucide-react';
import { Position } from '../../../api/types';
import { fireTeamSplitConfetti } from '../../../components/fx/confetti';
import { PlayerCard } from '../../../components/player/PlayerCard';
import { Button } from '../../../components/ui/Button';

export interface StepDoneProps {
  playerId: number;
  playerName: string;
  positions: Position[];
  preferredPosition: Position;
  selfScore: number;
  onEditAgain: () => void;
}

export const StepDone: React.FC<StepDoneProps> = ({
  playerId,
  playerName,
  positions,
  preferredPosition,
  selfScore,
  onEditAgain,
}) => {
  useEffect(() => {
    fireTeamSplitConfetti();
  }, []);

  const secondaryPos = positions.find((p) => p !== preferredPosition) || null;

  return (
    <div className="flex flex-col items-center justify-center space-y-6 text-center py-4">
      {/* Success Badge */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 12, stiffness: 200 }}
        className="w-16 h-16 rounded-3xl bg-emerald-500/10 border-2 border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)]"
      >
        <CheckCircle2 className="w-10 h-10" />
      </motion.div>

      <div className="space-y-1">
        <h3 className="text-2xl sm:text-3xl font-display uppercase tracking-wider text-white font-black">
          Khai Báo Thành Công!
        </h3>
        <p className="text-xs sm:text-sm text-pitch-muted max-w-sm">
          Thông tin của <strong className="text-accent-neon">{playerName}</strong> đã được ghi nhận. Thẻ cầu thủ của bạn đã sẵn sàng!
        </p>
      </div>

      {/* Generated FIFA 3D Tilt Player Card */}
      <div className="py-2">
        <PlayerCard
          id={playerId}
          name={playerName}
          primaryPosition={preferredPosition}
          secondaryPosition={secondaryPos}
          hasSubmitted={true}
          score={selfScore}
          isAdmin={true}
          teamVariant="neon"
        />
        <p className="text-[11px] text-pitch-muted mt-2">
          (Di chuột hoặc chạm để cảm nhận hiệu ứng 3D, nhấp để lật thẻ)
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-sm pt-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onEditAgain}
          className="w-full gap-2 text-xs"
        >
          <RotateCcw className="w-4 h-4" />
          Sửa lại thông tin
        </Button>

        <Link to="/result" className="w-full">
          <Button variant="neon" className="w-full gap-2 text-xs">
            <Trophy className="w-4 h-4" />
            Xem kết quả chia đội
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};
