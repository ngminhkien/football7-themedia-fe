import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Heart } from 'lucide-react';
import { PublicPlayer } from '../../../api/types';
import { useToast } from '../../../components/ui/Toast';
import { BallAvatar } from '../../../components/player/BallAvatar';
import { Button } from '../../../components/ui/Button';

export interface AvoidPickerProps {
  players: PublicPlayer[];
  currentPlayerId: number;
  selectedAvoidIds: number[];
  onToggleAvoid: (id: number) => void;
  onClearAvoids: () => void;
}

export const AvoidPicker: React.FC<AvoidPickerProps> = ({
  players,
  currentPlayerId,
  selectedAvoidIds,
  onToggleAvoid,
  onClearAvoids,
}) => {
  const toast = useToast();

  // Exclude current player
  const candidatePlayers = players.filter((p) => p.id !== currentPlayerId);

  const handleCardClick = (player: PublicPlayer) => {
    const isSelected = selectedAvoidIds.includes(player.id);
    if (!isSelected && selectedAvoidIds.length >= 2) {
      toast.warning('Tối đa 2 người thôi, đừng khó tính quá 😅', 'Giới hạn né');
      return;
    }
    onToggleAvoid(player.id);
  };

  return (
    <div className="space-y-4">
      {/* Privacy Notice Banner */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-black/40 border border-pitch-line/60">
        <div className="flex items-center gap-2.5 text-xs text-pitch-muted">
          <Lock className="w-4 h-4 text-accent-neon shrink-0" />
          <span>
            <strong className="text-white">Bảo mật tuyệt đối:</strong> Chỉ Admin và thuật toán thấy danh sách này để chia khác đội.
          </span>
        </div>

        {selectedAvoidIds.length > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClearAvoids}
            className="text-xs text-accent-neon hover:text-accent-neon hover:bg-accent-neon/10 h-8 gap-1.5 shrink-0"
          >
            <Heart className="w-3.5 h-3.5" />
            Mình chơi với ai cũng được
          </Button>
        )}
      </div>

      {/* Avoid Selection Counter */}
      <div className="flex items-center justify-between px-1 text-xs">
        <span className="text-pitch-muted">
          Đã chọn né: <strong className="text-accent-neon font-mono">{selectedAvoidIds.length}/2</strong> người
        </span>
        <span className="text-pitch-muted/70 italic text-[11px]">
          (Không bắt buộc chọn)
        </span>
      </div>

      {/* Grid of Players */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[360px] overflow-y-auto p-1">
        {candidatePlayers.map((player) => {
          const isSelected = selectedAvoidIds.includes(player.id);
          const isMaxReached = selectedAvoidIds.length >= 2 && !isSelected;

          return (
            <motion.button
              key={player.id}
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => handleCardClick(player)}
              className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all select-none ${
                isSelected
                  ? 'bg-rose-950/80 border-rose-500/80 text-rose-100 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                  : isMaxReached
                  ? 'bg-pitch-panel/40 border-pitch-line/30 text-pitch-muted/40 cursor-not-allowed opacity-50'
                  : 'bg-pitch-panel/70 border-pitch-line/60 text-pitch-text hover:border-pitch-line hover:bg-pitch-panel'
              }`}
            >
              <BallAvatar
                name={player.name}
                size="sm"
                teamVariant={isSelected ? 'neutral' : 'neutral'}
              />

              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate leading-tight">{player.name}</p>
                <span className="text-[10px] text-pitch-muted block truncate mt-0.5">
                  {isSelected ? 'Đã chọn né ✕' : 'Nhấp để né'}
                </span>
              </div>

              {isSelected && (
                <span className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] shrink-0 font-bold">
                  ✕
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
