import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Leaf, X, ArrowRight, ArrowLeft } from 'lucide-react';
import { AdminPlayer, PlayerTier } from '../../../api/types';
import { Button } from '../../../components/ui/Button';
import { BallAvatar } from '../../../components/player/BallAvatar';

export interface TierPanelProps {
  players: AdminPlayer[];
  onChangeTier: (playerId: number, tier: PlayerTier) => void;
  isLoading?: boolean;
}

export const TierPanel: React.FC<TierPanelProps> = ({
  players,
  onChangeTier,
  isLoading,
}) => {
  const activePlayers = players.filter((p) => p.isActive);
  
  const strongPlayers = activePlayers.filter((p) => p.tier === 'strong');
  const weakPlayers = activePlayers.filter((p) => p.tier === 'weak');
  const nonePlayers = activePlayers.filter((p) => p.tier === 'none' || !p.tier);

  return (
    <div className="p-4 sm:p-5 rounded-3xl bg-pitch-panel/80 border border-pitch-line/80 space-y-4 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-500" />
          <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
            Phân Nhóm Thực Lực (Tier Balancing)
          </h4>
        </div>
        <p className="text-xs text-pitch-muted">
          Thuật toán sẽ tự động chia đều người trong mỗi nhóm ra 2 đội.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Nhóm Mạnh */}
        <div className="flex flex-col bg-pitch-surface/40 border border-orange-500/20 rounded-2xl p-3 min-h-[200px]">
          <div className="flex items-center justify-between mb-3 border-b border-orange-500/20 pb-2">
            <div className="flex items-center gap-1.5 font-bold text-orange-400 text-sm">
              <Flame className="w-4 h-4" /> Nhóm Mạnh
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300">
              {strongPlayers.length}
            </span>
          </div>
          
          <div className="flex-1 space-y-1.5 overflow-y-auto pr-1">
            <AnimatePresence>
              {strongPlayers.map((p) => (
                <motion.div
                  key={p.id}
                  layoutId={`tier-p-${p.id}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center justify-between bg-black/40 border border-white/5 rounded-xl p-1.5"
                >
                  <div className="flex items-center gap-2 px-1">
                    <BallAvatar name={p.name} size="sm" />
                    <span className="text-sm font-medium text-white truncate max-w-[100px]">{p.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-pitch-muted hover:text-rose-400 shrink-0"
                    onClick={() => onChangeTier(p.id, 'none')}
                    disabled={isLoading}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
            {strongPlayers.length === 0 && (
              <div className="text-xs text-pitch-muted italic text-center py-4">Trống</div>
            )}
          </div>
        </div>

        {/* Chưa Phân Nhóm */}
        <div className="flex flex-col bg-pitch-surface/20 border border-white/10 rounded-2xl p-3 min-h-[200px]">
          <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
            <div className="flex items-center gap-1.5 font-bold text-pitch-text text-sm">
              Chưa phân nhóm
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-pitch-text">
              {nonePlayers.length}
            </span>
          </div>

          <div className="flex-1 space-y-1.5 overflow-y-auto pr-1">
            <AnimatePresence>
              {nonePlayers.map((p) => (
                <motion.div
                  key={p.id}
                  layoutId={`tier-p-${p.id}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center justify-between bg-black/40 border border-white/5 rounded-xl p-1.5 group"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-pitch-muted hover:text-orange-400 shrink-0"
                    onClick={() => onChangeTier(p.id, 'strong')}
                    disabled={isLoading}
                    title="Chuyển vào Nhóm Mạnh"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </Button>
                  
                  <div className="flex items-center justify-center flex-1 min-w-0 px-1">
                    <span className="text-sm font-medium text-white truncate">{p.name}</span>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-pitch-muted hover:text-emerald-400 shrink-0"
                    onClick={() => onChangeTier(p.id, 'weak')}
                    disabled={isLoading}
                    title="Chuyển vào Nhóm Yếu"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
            {nonePlayers.length === 0 && (
              <div className="text-xs text-pitch-muted italic text-center py-4">Đã phân nhóm hết</div>
            )}
          </div>
        </div>

        {/* Nhóm Yếu */}
        <div className="flex flex-col bg-pitch-surface/40 border border-emerald-500/20 rounded-2xl p-3 min-h-[200px]">
          <div className="flex items-center justify-between mb-3 border-b border-emerald-500/20 pb-2">
            <div className="flex items-center gap-1.5 font-bold text-emerald-400 text-sm">
              <Leaf className="w-4 h-4" /> Nhóm Yếu
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
              {weakPlayers.length}
            </span>
          </div>

          <div className="flex-1 space-y-1.5 overflow-y-auto pr-1">
            <AnimatePresence>
              {weakPlayers.map((p) => (
                <motion.div
                  key={p.id}
                  layoutId={`tier-p-${p.id}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center justify-between bg-black/40 border border-white/5 rounded-xl p-1.5"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-pitch-muted hover:text-rose-400 shrink-0"
                    onClick={() => onChangeTier(p.id, 'none')}
                    disabled={isLoading}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <div className="flex items-center gap-2 px-1 justify-end">
                    <span className="text-sm font-medium text-white truncate max-w-[100px]">{p.name}</span>
                    <BallAvatar name={p.name} size="sm" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {weakPlayers.length === 0 && (
              <div className="text-xs text-pitch-muted italic text-center py-4">Trống</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
