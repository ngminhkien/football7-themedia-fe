import React from 'react';
import { motion } from 'framer-motion';
import { TeamPlayerDto } from '../../api/types';
import { PitchSvg } from './PitchSvg';
import { FORMATION_11212 } from './formation';
import { cn } from '../../lib/cn';
import { BallAvatar } from '../player/BallAvatar';

export interface TeamPitchProps {
  teamName: string;
  color?: string;
  players: TeamPlayerDto[];
  onPlayerClick?: (player: TeamPlayerDto) => void;
  className?: string;
  isTeamB?: boolean;
  showAdminDetails?: boolean;
}

export const TeamPitch: React.FC<TeamPitchProps> = ({
  teamName,
  color: _color,
  players,
  onPlayerClick,
  className,
  isTeamB = false,
  showAdminDetails = false,
}) => {
  // Map the 7 players to the 7 formation slots:
  // Slots: GK (1), DF (1), WG_L (1), WG_R (1), MF (1), FW_L (1), FW_R (1)
  const slotAssignments: Record<string, TeamPlayerDto | undefined> = {};

  const gks = players.filter((p) => p.assignedPosition === 'GK');
  const dfs = players.filter((p) => p.assignedPosition === 'DF');
  const wgs = players.filter((p) => p.assignedPosition === 'WG');
  const mfs = players.filter((p) => p.assignedPosition === 'MF');
  const fws = players.filter((p) => p.assignedPosition === 'FW');

  if (gks[0]) slotAssignments['GK'] = gks[0];
  if (dfs[0]) slotAssignments['DF'] = dfs[0];
  if (wgs[0]) slotAssignments['WG_L'] = wgs[0];
  if (wgs[1]) slotAssignments['WG_R'] = wgs[1];
  if (mfs[0]) slotAssignments['MF'] = mfs[0];
  if (fws[0]) slotAssignments['FW_L'] = fws[0];
  if (fws[1]) slotAssignments['FW_R'] = fws[1];

  // Fallback if any unassigned players exist
  const assignedIds = new Set(Object.values(slotAssignments).filter(Boolean).map((p) => p!.id));
  const unassigned = players.filter((p) => !assignedIds.has(p.id));
  let unassignedIdx = 0;

  FORMATION_11212.forEach((slot) => {
    if (!slotAssignments[slot.slotId] && unassigned[unassignedIdx]) {
      slotAssignments[slot.slotId] = unassigned[unassignedIdx];
      unassignedIdx++;
    }
  });

  return (
    <div className={cn('relative flex flex-col items-center', className)}>
      {/* Team Header Banner */}
      <div className="w-full flex items-center justify-between px-4 py-2 mb-2 rounded-xl bg-pitch-panel/80 border border-pitch-line/60">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'w-3 h-3 rounded-full',
              isTeamB ? 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]' : 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
            )}
          />
          <h3 className="font-display uppercase tracking-wider text-base sm:text-lg text-white font-bold">
            {teamName}
          </h3>
        </div>
        <span className="text-xs text-pitch-muted font-mono">Sơ đồ 1-1-2-1-2</span>
      </div>

      {/* Pitch Grid */}
      <PitchSvg isHalfPitch className="w-full shadow-2xl">
        {FORMATION_11212.map((slot) => {
          const player = slotAssignments[slot.slotId];

          return (
            <div
              key={slot.slotId}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
            >
              {player ? (
                <motion.div
                  whileHover={{ scale: 1.1, y: -2 }}
                  onClick={() => onPlayerClick?.(player)}
                  className="group flex flex-col items-center cursor-pointer select-none"
                >
                  {/* Player Avatar */}
                  <div className="relative">
                    <BallAvatar
                      name={player.name}
                      jerseyNumber={player.jerseyNumber}
                      teamVariant={isTeamB ? 'teamB' : 'teamA'}
                      size="md"
                    />
                    {/* Assigned Position Pill */}
                    <span
                      className={cn(
                        'absolute -bottom-1 -right-1 text-[9px] font-mono font-bold px-1 rounded-sm shadow-md border',
                        isTeamB
                          ? 'bg-cyan-950 text-cyan-300 border-cyan-500/50'
                          : 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                      )}
                    >
                      {player.assignedPosition}
                    </span>

                    {/* Admin Badges: Preferred (⭐) or Out of Position (⚠️) */}
                    {showAdminDetails && (player.isPreferredPosition || player.isPrimaryPosition) && (
                      <span
                        className="absolute -top-1.5 -right-1.5 bg-amber-400 text-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-md ring-1 ring-black select-none z-10"
                        title="Đúng sở trường"
                      >
                        ⭐
                      </span>
                    )}
                    {showAdminDetails && player.isOutOfPosition && (
                      <span
                        className="absolute -top-1.5 -left-1.5 bg-rose-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-md ring-1 ring-black select-none z-10"
                        title="Lệch vị trí"
                      >
                        ⚠️
                      </span>
                    )}
                  </div>

                  {/* Player Name Tag */}
                  <div className="mt-1 px-1.5 py-0.5 rounded bg-pitch-dark/90 border border-pitch-line/80 shadow-md backdrop-blur-md max-w-[85px] sm:max-w-[100px] text-center">
                    <p className="text-[11px] font-semibold text-pitch-text truncate leading-tight">
                      {player.name}
                    </p>
                    {showAdminDetails && typeof player.score === 'number' && (
                      <p className="text-[10px] font-mono text-accent-neon font-bold mt-0.5">
                        {player.score.toFixed(1)}đ
                      </p>
                    )}
                  </div>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center opacity-40">
                  <div className="w-10 h-10 rounded-full border border-dashed border-white/40 flex items-center justify-center text-xs text-white/50 font-mono">
                    {slot.position}
                  </div>
                  <span className="text-[10px] text-white/40 mt-1">{slot.label}</span>
                </div>
              )}
            </div>
          );
        })}
      </PitchSvg>
    </div>
  );
};
