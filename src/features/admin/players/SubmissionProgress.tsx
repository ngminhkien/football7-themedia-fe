import React from 'react';
import { motion } from 'framer-motion';
import { UserCheck, AlertCircle } from 'lucide-react';
import { AdminPlayer } from '../../../api/types';
import { Badge } from '../../../components/ui/Badge';

export interface SubmissionProgressProps {
  players: AdminPlayer[];
}

export const SubmissionProgress: React.FC<SubmissionProgressProps> = ({ players }) => {
  const activePlayers = players.filter((p) => p.isActive);
  const total = activePlayers.length;
  const submittedCount = activePlayers.filter((p) => p.submitted).length;
  const percentage = total > 0 ? Math.round((submittedCount / total) * 100) : 0;
  const missingPlayers = activePlayers.filter((p) => !p.submitted);

  return (
    <div className="p-4 sm:p-5 rounded-3xl bg-pitch-panel/80 border border-pitch-line/80 space-y-3 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-white uppercase tracking-wider">
          <UserCheck className="w-4 h-4 text-accent-neon" />
          <span>Tiến Độ Khai Báo Cầu Thủ</span>
        </div>
        <span className="text-xs font-mono font-bold text-accent-neon">
          {submittedCount}/{total} Người ({percentage}%)
        </span>
      </div>

      {/* Progress Track */}
      <div className="w-full h-3 rounded-full bg-pitch-dark/80 p-0.5 border border-pitch-line/50 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full transition-all ${
            percentage === 100
              ? 'bg-gradient-to-r from-emerald-500 to-accent-neon shadow-[0_0_12px_#E8FF3A]'
              : 'bg-gradient-to-r from-amber-500 to-accent-neon'
          }`}
        />
      </div>

      {/* Missing players list if any */}
      {missingPlayers.length > 0 ? (
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
          <span className="text-pitch-muted flex items-center gap-1 text-[11px]">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            Chưa nộp:
          </span>
          {missingPlayers.map((p) => (
            <Badge key={p.id} variant="warning" size="xs">
              {p.name}
            </Badge>
          ))}
        </div>
      ) : (
        <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1 pt-1">
          ✓ Tất cả {total} cầu thủ The Media đã hoàn tất nộp phiếu! Sẵn sàng chia đội.
        </p>
      )}
    </div>
  );
};
