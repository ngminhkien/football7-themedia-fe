import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Send } from 'lucide-react';
import { SplitPlan, TeamPlayerDto } from '../../../api/types';
import { TeamPitch } from '../../../components/pitch/TeamPitch';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

export interface PlanCompareProps {
  plan: SplitPlan;
  onOpenPublish: () => void;
}

export const PlanCompare: React.FC<PlanCompareProps> = ({ plan, onOpenPublish }) => {
  const teamAPlayers: TeamPlayerDto[] = plan.teamA.players.map((p) => ({
    id: p.id,
    name: p.name,
    assignedPosition: p.position,
    score: p.score,
    isPreferredPosition: p.isPreferredPosition,
    isOutOfPosition: p.isOutOfPosition,
  }));

  const teamBPlayers: TeamPlayerDto[] = plan.teamB.players.map((p) => ({
    id: p.id,
    name: p.name,
    assignedPosition: p.position,
    score: p.score,
    isPreferredPosition: p.isPreferredPosition,
    isOutOfPosition: p.isOutOfPosition,
  }));

  return (
    <div className="space-y-6">
      {/* Overview & Action Header */}
      <div className="p-5 sm:p-6 rounded-3xl bg-pitch-panel/90 border border-pitch-line/80 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-pitch-line/60">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-display font-black text-2xl sm:text-3xl text-white">
                Chi Tiết Phương Án #{plan.rank}
              </span>
              {plan.rank === 1 && (
                <Badge variant="neon" size="sm" className="gap-1 font-bold">
                  <Trophy className="w-3.5 h-3.5" />
                  <span>Đề Xuất Số 1</span>
                </Badge>
              )}
            </div>
            <p className="text-xs sm:text-sm text-pitch-muted mt-1">
              {plan.explanation || 'Thuật toán tối ưu cân bằng điểm lực và giảm thiểu vi phạm nguyện vọng né.'}
            </p>
          </div>

          <Button
            variant="neon"
            size="lg"
            onClick={onOpenPublish}
            className="shadow-[0_0_20px_rgba(232,255,58,0.3)] shrink-0 font-display font-black tracking-wide"
          >
            <Send className="w-4 h-4 mr-2" />
            CÔNG BỐ PHƯƠNG ÁN NÀY
          </Button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
          <div className="p-3 rounded-2xl bg-pitch-dark/80 border border-pitch-line/60 text-center">
            <span className="text-[11px] text-pitch-muted uppercase font-mono">Đội Vàng (A)</span>
            <div className="font-display font-black text-xl text-emerald-400 mt-0.5">
              {plan.teamA.totalScore.toFixed(1)}đ
            </div>
            <span className="text-[10px] text-pitch-muted">{plan.teamA.name}</span>
          </div>

          <div className="p-3 rounded-2xl bg-pitch-dark/80 border border-pitch-line/60 text-center">
            <span className="text-[11px] text-pitch-muted uppercase font-mono">Đội Xanh (B)</span>
            <div className="font-display font-black text-xl text-cyan-400 mt-0.5">
              {plan.teamB.totalScore.toFixed(1)}đ
            </div>
            <span className="text-[10px] text-pitch-muted">{plan.teamB.name}</span>
          </div>

          <div className="p-3 rounded-2xl bg-pitch-dark/80 border border-pitch-line/60 text-center">
            <span className="text-[11px] text-pitch-muted uppercase font-mono">Chênh Lệch Lực</span>
            <div className="font-display font-black text-xl text-accent-neon mt-0.5">
              {plan.powerDiff.toFixed(1)}đ
            </div>
            <span className="text-[10px] text-pitch-muted">
              {plan.powerDiff <= 0.5 ? 'Rất cân bằng' : plan.powerDiff <= 1.5 ? 'Khá cân' : 'Lệch tương đối'}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-pitch-dark/80 border border-pitch-line/60 text-center">
            <span className="text-[11px] text-pitch-muted uppercase font-mono">Vi Phạm Tránh</span>
            <div className={`font-display font-black text-xl mt-0.5 ${plan.conflictCount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {plan.conflictCount} cặp
            </div>
            <span className="text-[10px] text-pitch-muted">
              {plan.conflictCount === 0 ? 'Thỏa mãn 100%' : 'Bị dính chung đội'}
            </span>
          </div>
        </div>

        {/* Legend for Admin */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-pitch-line/40 text-xs text-pitch-muted">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="text-amber-400 font-bold">⭐</span> Đúng sở trường (+bonus)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-rose-400 font-bold">⚠️</span> Trái vị trí đăng ký
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-accent-neon font-mono font-bold">7.5đ</span> Điểm lực (chỉ admin thấy)
            </span>
          </div>
          <span className="text-[11px] font-mono text-pitch-muted/80">
            Tổng chi phí thuật toán: {plan.cost.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Two Team Pitches: Stacked on mobile, side-by-side on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team A Pitch */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-4 sm:p-5 rounded-3xl bg-pitch-panel/70 border border-emerald-500/30 shadow-xl backdrop-blur-md"
        >
          <div className="flex items-center justify-between mb-3 px-2">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
              <h4 className="font-display font-bold text-lg text-white tracking-wide">
                {plan.teamA.name}
              </h4>
            </div>
            <span className="font-mono text-xs text-emerald-400 font-bold bg-emerald-950/70 border border-emerald-500/40 px-2 py-0.5 rounded-full">
              Tổng: {plan.teamA.totalScore.toFixed(1)}đ
            </span>
          </div>

          <TeamPitch
            teamName={plan.teamA.name}
            players={teamAPlayers}
            showAdminDetails={true}
            isTeamB={false}
          />
        </motion.div>

        {/* Team B Pitch */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-4 sm:p-5 rounded-3xl bg-pitch-panel/70 border border-cyan-500/30 shadow-xl backdrop-blur-md"
        >
          <div className="flex items-center justify-between mb-3 px-2">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
              <h4 className="font-display font-bold text-lg text-white tracking-wide">
                {plan.teamB.name}
              </h4>
            </div>
            <span className="font-mono text-xs text-cyan-400 font-bold bg-cyan-950/70 border border-cyan-500/40 px-2 py-0.5 rounded-full">
              Tổng: {plan.teamB.totalScore.toFixed(1)}đ
            </span>
          </div>

          <TeamPitch
            teamName={plan.teamB.name}
            players={teamBPlayers}
            showAdminDetails={true}
            isTeamB={true}
          />
        </motion.div>
      </div>
    </div>
  );
};
