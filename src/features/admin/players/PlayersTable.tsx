import React, { useState, useMemo } from 'react';
import { Edit2, Trash2, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { AdminPlayer } from '../../../api/types';
import { ScoreInput } from './ScoreInput';
import { Button } from '../../../components/ui/Button';
import { BallAvatar } from '../../../components/player/BallAvatar';
import { POSITION_NAMES } from '../../../lib/constants';

export interface PlayersTableProps {
  players: AdminPlayer[];
  onEditPlayer: (player: AdminPlayer) => void;
  onDeletePlayer: (player: AdminPlayer) => void;
}

type FilterType = 'all' | 'unsubmitted' | 'noScore' | 'inactive';

export const PlayersTable: React.FC<PlayersTableProps> = ({
  players,
  onEditPlayer,
  onDeletePlayer,
}) => {
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredPlayers = useMemo(() => {
    return players.filter((p) => {
      if (filter === 'unsubmitted') return p.isActive && !p.submitted;
      if (filter === 'noScore') return p.isActive && p.adminScore == null;
      if (filter === 'inactive') return !p.isActive;
      return true;
    });
  }, [players, filter]);

  const unsubmittedCount = players.filter((p) => p.isActive && !p.submitted).length;
  const noScoreCount = players.filter((p) => p.isActive && p.adminScore == null).length;
  const inactiveCount = players.filter((p) => !p.isActive).length;

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant={filter === 'all' ? 'neon' : 'secondary'}
          size="sm"
          onClick={() => setFilter('all')}
          className="text-xs"
        >
          Tất cả ({players.length})
        </Button>

        <Button
          variant={filter === 'unsubmitted' ? 'neon' : 'secondary'}
          size="sm"
          onClick={() => setFilter('unsubmitted')}
          className="text-xs"
        >
          Chưa nộp ({unsubmittedCount})
        </Button>

        <Button
          variant={filter === 'noScore' ? 'neon' : 'secondary'}
          size="sm"
          onClick={() => setFilter('noScore')}
          className="text-xs"
        >
          Chưa chấm điểm ({noScoreCount})
        </Button>

        {inactiveCount > 0 && (
          <Button
            variant={filter === 'inactive' ? 'neon' : 'secondary'}
            size="sm"
            onClick={() => setFilter('inactive')}
            className="text-xs"
          >
            Nghỉ đá / Inactive ({inactiveCount})
          </Button>
        )}
      </div>

      {/* Desktop Table View (>= md) */}
      <div className="hidden md:block overflow-x-auto rounded-3xl border border-pitch-line/80 bg-pitch-panel/80 shadow-2xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-pitch-line/80 bg-pitch-dark/80 text-pitch-muted uppercase font-mono tracking-wider">
              <th className="py-3.5 px-4">Cầu Thủ</th>
              <th className="py-3.5 px-4">Trạng Thái</th>
              <th className="py-3.5 px-4">Đã Nộp</th>
              <th className="py-3.5 px-4">Vị Trí Sở Trường / Có Thể Đá</th>
              <th className="py-3.5 px-4 text-center">Tự Chấm</th>
              <th className="py-3.5 px-4 text-center">Điểm Admin (1-10)</th>
              <th className="py-3.5 px-4 text-center">Né</th>
              <th className="py-3.5 px-4 text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-pitch-line/40">
            {filteredPlayers.map((player) => {
              const diff =
                player.selfScore != null && player.adminScore != null
                  ? Math.abs(Number(player.adminScore) - player.selfScore)
                  : 0;
              const hasBigDiff = diff >= 2.0;

              return (
                <tr
                  key={player.id}
                  className={`hover:bg-white/[0.02] transition-colors ${
                    !player.isActive ? 'opacity-40 bg-black/20' : ''
                  }`}
                >
                  {/* Name & Avatar */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <BallAvatar name={player.name} size="xs" teamVariant="neutral" />
                      <div>
                        <p className="font-semibold text-white text-sm">{player.name}</p>
                        <span className="text-[10px] text-pitch-muted font-mono">ID: #{player.id}</span>
                      </div>
                    </div>
                  </td>

                  {/* Active status */}
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        player.isActive
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                          : 'bg-pitch-dark text-pitch-muted border-pitch-line'
                      }`}
                    >
                      {player.isActive ? 'Active' : 'Nghỉ'}
                    </span>
                  </td>

                  {/* Submitted */}
                  <td className="py-3 px-4">
                    {player.submitted ? (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Đã nộp</span>
                      </span>
                    ) : (
                      <span className="text-amber-400 font-medium flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Chưa nộp</span>
                      </span>
                    )}
                  </td>

                  {/* Positions */}
                  <td className="py-3 px-4">
                    {player.positions && player.positions.length > 0 ? (
                      <div className="flex flex-wrap items-center gap-1">
                        {player.positions.map((pos) => {
                          const isPref = player.preferredPosition === pos;
                          return (
                            <span
                              key={pos}
                              className={`px-1.5 py-0.5 rounded text-[10px] font-mono border ${
                                isPref
                                  ? 'bg-accent-neon text-pitch-dark font-black border-accent-neon shadow-[0_0_6px_#E8FF3A]'
                                  : 'bg-pitch-dark text-pitch-muted border-pitch-line/60'
                              }`}
                              title={isPref ? `Vị trí sở trường: ${POSITION_NAMES[pos]}` : POSITION_NAMES[pos]}
                            >
                              {pos} {isPref && '★'}
                            </span>
                          );
                        })}
                      </div>
                    ) : (
                      <span className="text-pitch-muted/60 italic text-[11px]">Chưa chọn vị trí</span>
                    )}
                  </td>

                  {/* Self Score */}
                  <td className="py-3 px-4 text-center">
                    {player.selfScore != null ? (
                      <span className="font-mono font-bold text-sm text-pitch-text">
                        {player.selfScore}đ
                      </span>
                    ) : (
                      <span className="text-pitch-muted/40 font-mono">--</span>
                    )}
                  </td>

                  {/* Admin Score input */}
                  <td className="py-3 px-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <ScoreInput
                        playerId={player.id}
                        initialScore={player.adminScore != null ? Number(player.adminScore) : null}
                      />
                      {hasBigDiff && (
                        <span
                          className="text-[9px] font-mono text-amber-300 bg-amber-950/80 px-1 py-0.2 rounded border border-amber-500/30 flex items-center gap-0.5"
                          title={`Tự chấm ${player.selfScore}đ vs Admin chấm ${player.adminScore}đ (Lệch ${diff.toFixed(1)}đ)`}
                        >
                          <AlertTriangle className="w-2.5 h-2.5 text-amber-400" />
                          Lệch {diff.toFixed(1)}đ
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Avoid Count */}
                  <td className="py-3 px-4 text-center">
                    {player.avoidIds && player.avoidIds.length > 0 ? (
                      <span className="px-2 py-0.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-500/30 font-mono font-bold text-[10px]">
                        {player.avoidIds.length} người
                      </span>
                    ) : (
                      <span className="text-pitch-muted/40 font-mono text-[11px]">0</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditPlayer(player)}
                        className="h-8 w-8 p-0 text-pitch-muted hover:text-accent-neon hover:bg-white/5"
                        title="Chỉnh sửa thông tin"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeletePlayer(player)}
                        className="h-8 w-8 p-0 text-pitch-muted hover:text-rose-400 hover:bg-rose-950/20"
                        title="Xóa cầu thủ"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View (< md) */}
      <div className="space-y-3 md:hidden">
        {filteredPlayers.map((player) => {
          const diff =
            player.selfScore != null && player.adminScore != null
              ? Math.abs(Number(player.adminScore) - player.selfScore)
              : 0;

          return (
            <div
              key={player.id}
              className={`p-4 rounded-2xl border border-pitch-line/80 bg-pitch-panel/80 space-y-3 ${
                !player.isActive ? 'opacity-40' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <BallAvatar name={player.name} size="sm" teamVariant="neutral" />
                  <div>
                    <h4 className="font-semibold text-white text-sm">{player.name}</h4>
                    <span className="text-[10px] text-pitch-muted font-mono">
                      ID: #{player.id} • {player.isActive ? 'Active' : 'Nghỉ'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditPlayer(player)}
                    className="h-8 w-8 p-0 text-pitch-muted"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeletePlayer(player)}
                    className="h-8 w-8 p-0 text-pitch-muted hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>

              {/* Positions */}
              <div className="text-xs">
                <span className="text-pitch-muted text-[11px] block mb-1">Vị trí:</span>
                {player.positions && player.positions.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {player.positions.map((pos) => (
                      <span
                        key={pos}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                          player.preferredPosition === pos
                            ? 'bg-accent-neon text-pitch-dark font-bold'
                            : 'bg-pitch-dark text-pitch-muted border border-pitch-line/50'
                        }`}
                      >
                        {pos} {player.preferredPosition === pos && '★'}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-pitch-muted/60 italic text-[11px]">Chưa chọn vị trí</span>
                )}
              </div>

              {/* Score comparison & direct input */}
              <div className="flex items-center justify-between pt-2 border-t border-pitch-line/50 text-xs">
                <div>
                  <span className="text-pitch-muted text-[11px] block">Tự chấm:</span>
                  <span className="font-bold text-white">
                    {player.selfScore != null ? `${player.selfScore}đ` : '--'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="text-pitch-muted text-[11px] block">Admin chấm:</span>
                    {diff >= 2.0 && (
                      <span className="text-[9px] text-amber-300 block font-mono">
                        Lệch {diff.toFixed(1)}đ
                      </span>
                    )}
                  </div>
                  <ScoreInput
                    playerId={player.id}
                    initialScore={player.adminScore != null ? Number(player.adminScore) : null}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
