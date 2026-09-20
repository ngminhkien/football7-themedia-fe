import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, CheckCircle2, AlertCircle } from 'lucide-react';
import { PublicPlayer } from '../../../api/types';
import { BallAvatar } from '../../../components/player/BallAvatar';
import { Input } from '../../../components/ui/Field';
import { getLastPlayerId } from '../draftStorage';

export interface StepNameProps {
  players: PublicPlayer[];
  selectedPlayerId: number | null;
  onSelectPlayer: (player: PublicPlayer) => void;
}

export const StepName: React.FC<StepNameProps> = ({
  players,
  selectedPlayerId,
  onSelectPlayer,
}) => {
  const [search, setSearch] = useState('');
  const lastPlayerId = useMemo(() => getLastPlayerId(), []);

  const filteredPlayers = useMemo(() => {
    if (!search.trim()) return players;
    return players.filter((p) =>
      p.name.toLowerCase().includes(search.trim().toLowerCase())
    );
  }, [players, search]);

  return (
    <div className="space-y-4">
      {/* Header Info */}
      <div className="text-center space-y-1">
        <h3 className="text-xl sm:text-2xl font-display uppercase tracking-wider text-white font-bold">
          Bạn Là Ai Trong Danh Sách?
        </h3>
        <p className="text-xs text-pitch-muted">
          Chọn đúng tên của bạn trong 14 anh em The Media để tiến hành khai báo vị trí.
        </p>
      </div>

      {/* Quick Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-pitch-muted" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm nhanh tên của bạn..."
          className="pl-10 h-11"
        />
      </div>

      {/* Players Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto p-1">
        {filteredPlayers.map((player) => {
          const isSelected = selectedPlayerId === player.id;
          const isLastPlayed = lastPlayerId === player.id;

          return (
            <motion.button
              key={player.id}
              type="button"
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectPlayer(player)}
              className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all select-none ${
                isSelected
                  ? 'bg-accent-neon/15 border-accent-neon text-white shadow-[0_0_15px_rgba(232,255,58,0.25)]'
                  : 'bg-pitch-panel/80 border-pitch-line/70 text-pitch-text hover:border-accent-neon/50 hover:bg-pitch-panel'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <BallAvatar
                  name={player.name}
                  size="md"
                  teamVariant={isSelected ? 'neon' : 'neutral'}
                />

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold truncate leading-tight text-white">
                      {player.name}
                    </p>
                    {isLastPlayed && !isSelected && (
                      <span className="text-[9px] font-mono text-accent-neon bg-accent-neon/10 px-1 py-0.5 rounded border border-accent-neon/30">
                        Lần trước
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-pitch-muted mt-0.5">
                    {player.submitted ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Đã nộp (Nhấp để sửa)
                      </span>
                    ) : (
                      <span className="text-amber-400/90 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Chưa khai báo
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {isSelected && (
                <div className="w-6 h-6 rounded-full bg-accent-neon text-pitch-dark flex items-center justify-center text-xs font-black shadow-[0_0_8px_#E8FF3A] shrink-0">
                  ✓
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
