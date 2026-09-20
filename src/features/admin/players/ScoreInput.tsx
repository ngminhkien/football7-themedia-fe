import React, { useState, useEffect } from 'react';
import { updateAdminPlayer } from '../../../api/admin';
import { useToast } from '../../../components/ui/Toast';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../../api/queryKeys';

export interface ScoreInputProps {
  playerId: number;
  initialScore: number | null;
}

export const ScoreInput: React.FC<ScoreInputProps> = ({ playerId, initialScore }) => {
  const [val, setVal] = useState<string>(initialScore != null ? initialScore.toString() : '');
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    setVal(initialScore != null ? initialScore.toString() : '');
  }, [initialScore]);

  const handleSave = async () => {
    const trimmed = val.trim();
    let numVal: number | null = null;

    if (trimmed !== '') {
      const parsed = parseFloat(trimmed);
      if (isNaN(parsed) || parsed < 1.0 || parsed > 10.0) {
        toast.warning('Điểm Admin phải từ 1.0 đến 10.0');
        setVal(initialScore != null ? initialScore.toString() : '');
        return;
      }
      // Round to nearest 0.5
      numVal = Math.round(parsed * 2) / 2;
    }

    if (numVal === initialScore) return;

    setIsSaving(true);
    try {
      await updateAdminPlayer(playerId, { adminScore: numVal });
      // Invalidate admin players & warnings queries
      queryClient.invalidateQueries({ queryKey: queryKeys.adminPlayers });
      queryClient.invalidateQueries({ queryKey: queryKeys.warnings });
    } catch {
      toast.error('Không thể lưu điểm Admin.');
      setVal(initialScore != null ? initialScore.toString() : '');
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  return (
    <div className="relative inline-block w-20">
      <input
        type="number"
        min={1.0}
        max={10.0}
        step={0.5}
        value={val}
        disabled={isSaving}
        onChange={(e) => setVal(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        placeholder="Chưa chấm"
        className={`w-full text-center px-2 py-1 rounded-xl text-xs font-mono font-bold transition-all border outline-none ${
          isSaving
            ? 'opacity-50 bg-pitch-line'
            : val
            ? 'bg-accent-neon/15 border-accent-neon/70 text-accent-neon shadow-[0_0_8px_rgba(232,255,58,0.2)]'
            : 'bg-pitch-dark/80 border-pitch-line/60 text-pitch-muted hover:border-pitch-line'
        }`}
      />
    </div>
  );
};
