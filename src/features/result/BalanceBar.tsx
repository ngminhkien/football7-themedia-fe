import React from 'react';
import { motion } from 'framer-motion';
import { Scale } from 'lucide-react';
import { CountUp } from '../../components/fx/CountUp';
import { BALANCE_COMMENTARY } from '../../lib/constants';

export interface BalanceBarProps {
  teamAName: string;
  teamBName: string;
  teamAScore: number;
  teamBScore: number;
  teamAColor?: 'yellow' | 'blue' | string;
  teamBColor?: 'yellow' | 'blue' | string;
}

export const BalanceBar: React.FC<BalanceBarProps> = ({
  teamAName,
  teamBName,
  teamAScore,
  teamBScore,
}) => {
  const diff = Math.abs(teamAScore - teamBScore);
  const total = teamAScore + teamBScore || 1;
  const pctA = Math.round((teamAScore / total) * 100);
  const pctB = 100 - pctA;
  const commentary = BALANCE_COMMENTARY(diff);

  return (
    <div className="w-full p-4 sm:p-5 rounded-3xl bg-pitch-panel/90 border border-pitch-line/80 shadow-2xl space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-display uppercase tracking-wider text-white">
          <Scale className="w-4 h-4 text-accent-neon" />
          <span>Độ Cân Bằng Thực Lực Hai Đội</span>
        </div>
        <span className="text-xs font-mono font-semibold text-accent-neon">
          Chênh lệch: <CountUp end={diff} decimals={1} /> điểm
        </span>
      </div>

      {/* Split Bar */}
      <div className="space-y-1.5">
        <div className="w-full h-4 rounded-full overflow-hidden flex bg-pitch-dark/80 p-0.5 border border-pitch-line/50">
          <motion.div
            initial={{ width: '50%' }}
            animate={{ width: `${pctA}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full rounded-l-full bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
          />
          <motion.div
            initial={{ width: '50%' }}
            animate={{ width: `${pctB}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full rounded-r-full bg-gradient-to-r from-cyan-400 to-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
          />
        </div>

        {/* Labels below bar */}
        <div className="flex items-center justify-between text-xs font-semibold px-1">
          <span className="text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            {teamAName}: <CountUp end={teamAScore} decimals={1} />đ ({pctA}%)
          </span>
          <span className="text-cyan-400 flex items-center gap-1.5">
            {teamBName}: <CountUp end={teamBScore} decimals={1} />đ ({pctB}%)
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
          </span>
        </div>
      </div>

      {/* Funny Vietnamese Commentary */}
      <div className="pt-2 border-t border-pitch-line/50 text-center">
        <p className="text-xs sm:text-sm font-medium text-pitch-text italic">
          "{commentary}"
        </p>
      </div>
    </div>
  );
};
