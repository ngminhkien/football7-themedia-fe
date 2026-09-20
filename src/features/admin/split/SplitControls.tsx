import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Shuffle, Sliders, ChevronDown, ChevronUp, History, AlertTriangle } from 'lucide-react';
import { SplitWeights } from '../../../api/types';
import { Button } from '../../../components/ui/Button';
import { WeightsForm } from './WeightsForm';
import { SplitSessionHistory } from './useSplitSession';

export interface SplitControlsProps {
  onSplit: () => void;
  onResplit: () => void;
  isSplitting: boolean;
  hasPlans: boolean;
  canSplit: boolean;
  disabledReason?: string;
  allowIncomplete: boolean;
  onToggleAllowIncomplete: (val: boolean) => void;
  weights: SplitWeights;
  onChangeWeights: (weights: SplitWeights) => void;
  onResetWeights: () => void;
  history: SplitSessionHistory[];
  activeHistoryId: string | null;
  onSelectHistory: (id: string) => void;
}

export const SplitControls: React.FC<SplitControlsProps> = ({
  onSplit,
  onResplit,
  isSplitting,
  hasPlans,
  canSplit,
  disabledReason,
  allowIncomplete,
  onToggleAllowIncomplete,
  weights,
  onChangeWeights,
  onResetWeights,
  history,
  activeHistoryId,
  onSelectHistory,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="space-y-4">
      {/* Primary Action Bar */}
      <div className="p-5 rounded-3xl bg-pitch-panel/90 border border-pitch-line/80 shadow-xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Split Button */}
            <Button
              type="button"
              variant="neon"
              size="lg"
              onClick={onSplit}
              disabled={isSplitting || !canSplit}
              className="h-12 px-7 font-display font-black text-lg tracking-wider shadow-[0_0_25px_rgba(232,255,58,0.35)] disabled:opacity-50 disabled:shadow-none"
            >
              <Play className="w-5 h-5 mr-2 fill-current" />
              {isSplitting ? 'ĐANG CHIA...' : hasPlans ? 'CHIA LẠI TỪ ĐẦU' : 'BẮT ĐẦU CHIA ĐỘI'}
            </Button>

            {/* Resplit with Jitter */}
            {hasPlans && (
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={onResplit}
                disabled={isSplitting || !canSplit}
                className="h-12 border-accent-cyan/50 text-accent-cyan hover:bg-accent-cyan/10 font-bold"
              >
                <Shuffle className="w-4 h-4 mr-2" />
                Chia Lại (Jitter 0.6)
              </Button>
            )}

            {/* Advanced Weights Toggle */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs text-pitch-muted hover:text-white"
            >
              <Sliders className="w-4 h-4 mr-1.5" />
              Trọng số nâng cao
              {showAdvanced ? (
                <ChevronUp className="w-3.5 h-3.5 ml-1" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 ml-1" />
              )}
            </Button>
          </div>

          {/* Allow Incomplete Switch */}
          <label className="flex items-center gap-2.5 cursor-pointer select-none px-3 py-2 rounded-xl bg-pitch-dark/70 border border-pitch-line/60 hover:border-pitch-line">
            <input
              type="checkbox"
              checked={allowIncomplete}
              onChange={(e) => onToggleAllowIncomplete(e.target.checked)}
              className="w-4 h-4 rounded bg-pitch-card border-pitch-line text-accent-neon focus:ring-accent-neon/50 accent-[#E8FF3A]"
            />
            <span className="text-xs text-pitch-text font-medium">
              Vẫn chia dù chưa nộp đủ
            </span>
          </label>
        </div>

        {/* Disabled Warning Reason */}
        {!canSplit && disabledReason && (
          <div className="mt-3 flex items-center gap-2 text-xs text-amber-300 bg-amber-950/40 border border-amber-500/30 px-3 py-2 rounded-xl">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>{disabledReason}</span>
          </div>
        )}

        {/* Collapsible Advanced Weights Form */}
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-pitch-line/60"
          >
            <WeightsForm
              weights={weights}
              onChange={onChangeWeights}
              onReset={onResetWeights}
            />
          </motion.div>
        )}
      </div>

      {/* History Tabs */}
      {history.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-pitch-muted flex items-center gap-1 shrink-0 font-mono">
            <History className="w-3.5 h-3.5" /> Các lần chia:
          </span>
          {history.map((hist, index) => {
            const isActive = hist.id === activeHistoryId;
            return (
              <button
                key={hist.id}
                type="button"
                onClick={() => onSelectHistory(hist.id)}
                className={`px-3 py-1.5 rounded-xl border transition-all font-mono whitespace-nowrap ${
                  isActive
                    ? 'bg-accent-neon/20 border-accent-neon text-accent-neon font-bold shadow-sm'
                    : 'bg-pitch-panel/60 border-pitch-line text-pitch-muted hover:text-white'
                }`}
              >
                Lần #{history.length - index} ({hist.timestamp})
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
