import { Pin, X } from 'lucide-react';
import { AdminPlayer } from '../../../api/types';
import { Button } from '../../../components/ui/Button';
import { BallAvatar } from '../../../components/player/BallAvatar';

export interface LockPanelProps {
  players: AdminPlayer[];
  lockedTeamA: number[];
  lockedTeamB: number[];
  onToggleLock: (playerId: number, target: 'A' | 'B' | 'NONE') => void;
  onClearLocks: () => void;
}

export const LockPanel: React.FC<LockPanelProps> = ({
  players,
  lockedTeamA,
  lockedTeamB,
  onToggleLock,
  onClearLocks,
}) => {
  const activePlayers = players.filter((p) => p.isActive);
  const totalLocked = lockedTeamA.length + lockedTeamB.length;

  return (
    <div className="p-4 sm:p-5 rounded-3xl bg-pitch-panel/80 border border-pitch-line/80 space-y-4 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Pin className="w-4 h-4 text-accent-neon" />
          <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
            Ghim Cố Định Cầu Thủ Vào Đội (Lock Panel)
          </h4>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-mono font-semibold">
            Đội A: {lockedTeamA.length}/7
          </span>
          <span className="px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono font-semibold">
            Đội B: {lockedTeamB.length}/7
          </span>

          {totalLocked > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClearLocks}
              className="h-7 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/20"
            >
              Bỏ ghim hết
            </Button>
          )}
        </div>
      </div>

      <p className="text-xs text-pitch-muted">
        Nếu muốn 1 cầu thủ chắc chắn thuộc Đội A hoặc Đội B (ví dụ phân 2 thủ môn hoặc 2 đội trưởng), hãy bấm chọn đội tương ứng. Thuật toán sẽ tối ưu 1.716 tổ hợp dựa trên những người được ghim.
      </p>

      {/* Grid of Players with 3-state buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto p-1">
        {activePlayers.map((player) => {
          const isLockedA = lockedTeamA.includes(player.id);
          const isLockedB = lockedTeamB.includes(player.id);
          const isLockedAny = isLockedA || isLockedB;

          return (
            <div
              key={player.id}
              className={`p-2.5 rounded-2xl border flex items-center justify-between transition-all select-none ${
                isLockedA
                  ? 'bg-emerald-950/70 border-emerald-500/80 text-emerald-100 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                  : isLockedB
                  ? 'bg-cyan-950/70 border-cyan-500/80 text-cyan-100 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                  : 'bg-pitch-panel border-pitch-line/50 text-pitch-text'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <BallAvatar
                  name={player.name}
                  size="xs"
                  teamVariant={isLockedA ? 'teamA' : isLockedB ? 'teamB' : 'neutral'}
                />
                <span className="text-xs font-semibold truncate max-w-[100px]">
                  {player.name}
                </span>
              </div>

              {/* 3 State Toggle */}
              <div className="flex items-center gap-1 bg-pitch-dark/80 p-0.5 rounded-xl border border-pitch-line/60">
                <button
                  type="button"
                  onClick={() => onToggleLock(player.id, isLockedA ? 'NONE' : 'A')}
                  disabled={!isLockedA && lockedTeamA.length >= 7}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold font-mono transition-all ${
                    isLockedA
                      ? 'bg-emerald-500 text-pitch-dark shadow'
                      : 'text-pitch-muted hover:text-emerald-400 hover:bg-emerald-950/40 disabled:opacity-30'
                  }`}
                  title="Ghim vào Đội A"
                >
                  Đội A
                </button>

                <button
                  type="button"
                  onClick={() => onToggleLock(player.id, isLockedB ? 'NONE' : 'B')}
                  disabled={!isLockedB && lockedTeamB.length >= 7}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold font-mono transition-all ${
                    isLockedB
                      ? 'bg-cyan-500 text-pitch-dark shadow'
                      : 'text-pitch-muted hover:text-cyan-400 hover:bg-cyan-950/40 disabled:opacity-30'
                  }`}
                  title="Ghim vào Đội B"
                >
                  Đội B
                </button>

                {isLockedAny && (
                  <button
                    type="button"
                    onClick={() => onToggleLock(player.id, 'NONE')}
                    className="p-1 rounded-lg text-pitch-muted hover:text-rose-400 hover:bg-white/5"
                    title="Bỏ ghim"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
