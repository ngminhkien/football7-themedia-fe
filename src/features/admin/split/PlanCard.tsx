import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, EyeOff, UserX } from 'lucide-react';
import { SplitPlan } from '../../../api/types';
import { Badge } from '../../../components/ui/Badge';

export interface PlanCardProps {
  plan: SplitPlan;
  isSelected: boolean;
  onSelect: () => void;
}

export const PlanCard: React.FC<PlanCardProps> = ({ plan, isSelected, onSelect }) => {
  const isOptimal = plan.rank === 1;
  const hasConflict = plan.conflictCount > 0;
  const hasOutOfPos = plan.outOfPositionCount > 0;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={onSelect}
      className={`p-4 sm:p-5 rounded-3xl border cursor-pointer transition-all relative overflow-hidden select-none ${
        isSelected
          ? 'bg-pitch-panel/95 border-accent-neon shadow-[0_0_25px_rgba(232,255,58,0.25)] ring-2 ring-accent-neon/60'
          : 'bg-pitch-panel/70 border-pitch-line/70 hover:border-pitch-line hover:bg-pitch-panel'
      }`}
    >
      {/* Top Bar: Rank & Status */}
      <div className="flex items-center justify-between pb-3 border-b border-pitch-line/50">
        <div className="flex items-center gap-2">
          <span className="font-display font-black text-xl text-white">
            Phương Án #{plan.rank}
          </span>
          {isOptimal && (
            <Badge variant="neon" size="xs" className="gap-1 font-bold">
              <span>Đề xuất tối ưu ★</span>
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-1.5 font-mono text-xs">
          <span className="text-pitch-muted">Lệch điểm:</span>
          <strong className="text-accent-neon font-bold">{plan.powerDiff.toFixed(1)}đ</strong>
        </div>
      </div>

      {/* Warnings & Penalty Indicators */}
      <div className="flex flex-wrap gap-2 py-2 text-[11px]">
        {hasConflict ? (
          <span className="px-2 py-0.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-500/40 flex items-center gap-1 font-semibold">
            <EyeOff className="w-3 h-3 text-rose-400" />
            Có {plan.conflictCount} cặp né phải chung đội
          </span>
        ) : (
          <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Thỏa mãn 100% danh sách né
          </span>
        )}

        {hasOutOfPos ? (
          <span className="px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/40 flex items-center gap-1 font-semibold">
            <UserX className="w-3 h-3 text-amber-400" />
            {plan.outOfPositionCount} người bị lệch vị trí
          </span>
        ) : (
          <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            100% đúng vị trí có thể đá
          </span>
        )}

        {/* Tier Balancing */}
        {(plan.tierStrongA > 0 || plan.tierStrongB > 0 ||
          plan.tierWeakA > 0 || plan.tierWeakB > 0) && (
          <span className="px-2 py-0.5 rounded-full bg-violet-950/80 text-violet-300 border border-violet-500/40 flex items-center gap-1 text-[11px]">
            🔥 {plan.tierStrongA} vs {plan.tierStrongB} | 🌱 {plan.tierWeakA} vs {plan.tierWeakB}
          </span>
        )}
      </div>

      {/* Dynamic Vietnamese Explanation */}
      <p className="text-xs text-pitch-text/90 italic line-clamp-2 py-1 leading-relaxed">
        "{plan.explanation}"
      </p>

      {/* Mini Teams Lineup */}
      <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-pitch-line/50 text-[11px]">
        {/* Team A */}
        <div className="p-2 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
          <div className="flex justify-between items-center font-bold text-emerald-300 mb-1">
            <span>{plan.teamA.name}</span>
            <span className="font-mono">{plan.teamA.totalScore.toFixed(1)}đ</span>
          </div>
          <p className="text-pitch-muted truncate text-[10px]">
            {plan.teamA.players.map((p) => p.name).join(', ')}
          </p>
        </div>

        {/* Team B */}
        <div className="p-2 rounded-xl bg-cyan-950/30 border border-cyan-500/30">
          <div className="flex justify-between items-center font-bold text-cyan-300 mb-1">
            <span>{plan.teamB.name}</span>
            <span className="font-mono">{plan.teamB.totalScore.toFixed(1)}đ</span>
          </div>
          <p className="text-pitch-muted truncate text-[10px]">
            {plan.teamB.players.map((p) => p.name).join(', ')}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
