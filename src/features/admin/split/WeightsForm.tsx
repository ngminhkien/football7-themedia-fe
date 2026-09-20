import React from 'react';
import { RotateCcw, Sliders } from 'lucide-react';
import { SplitWeights } from '../../../api/types';
import { Button } from '../../../components/ui/Button';

export interface WeightsFormProps {
  weights: SplitWeights;
  onChange: (weights: SplitWeights) => void;
  onReset: () => void;
}

export const WeightsForm: React.FC<WeightsFormProps> = ({ weights, onChange, onReset }) => {
  const updateWeight = (key: keyof SplitWeights, val: number) => {
    onChange({
      ...weights,
      [key]: val,
    });
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-pitch-dark/80 border border-pitch-line/60 space-y-4 text-xs">
      <div className="flex items-center justify-between border-b border-pitch-line/40 pb-3">
        <div className="flex items-center gap-2 text-white font-semibold">
          <Sliders className="w-4 h-4 text-accent-neon" />
          <span>Tùy Chỉnh Trọng Số Thuật Toán (Nâng Cao)</span>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-7 text-xs text-pitch-muted hover:text-accent-neon gap-1"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Mặc định</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Admin Weight */}
        <div className="space-y-1">
          <div className="flex justify-between font-mono">
            <span className="text-pitch-text">Trọng số Điểm Admin:</span>
            <strong className="text-accent-neon">{weights.adminWeight}</strong>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={weights.adminWeight}
            onChange={(e) => updateWeight('adminWeight', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-pitch-line rounded cursor-pointer accent-[#E8FF3A]"
          />
          <p className="text-[10px] text-pitch-muted">Tỉ lệ tin cậy vào điểm do ban quản trị chấm (mặc định 0.7).</p>
        </div>

        {/* Self Weight */}
        <div className="space-y-1">
          <div className="flex justify-between font-mono">
            <span className="text-pitch-text">Trọng số Tự Chấm:</span>
            <strong className="text-accent-neon">{weights.selfWeight}</strong>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={weights.selfWeight}
            onChange={(e) => updateWeight('selfWeight', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-pitch-line rounded cursor-pointer accent-[#E8FF3A]"
          />
          <p className="text-[10px] text-pitch-muted">Tỉ lệ điểm do cầu thủ tự khai báo (mặc định 0.3).</p>
        </div>

        {/* Power Weight */}
        <div className="space-y-1">
          <div className="flex justify-between font-mono">
            <span className="text-pitch-text">Phạt Lệch Điểm Hai Đội:</span>
            <strong className="text-accent-neon">{weights.powerWeight}</strong>
          </div>
          <input
            type="range"
            min="0.1"
            max="5"
            step="0.1"
            value={weights.powerWeight}
            onChange={(e) => updateWeight('powerWeight', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-pitch-line rounded cursor-pointer accent-[#E8FF3A]"
          />
          <p className="text-[10px] text-pitch-muted">Hệ số phạt chênh lệch tổng điểm giữa 2 đội (mặc định 1.0).</p>
        </div>

        {/* Conflict Weight */}
        <div className="space-y-1">
          <div className="flex justify-between font-mono">
            <span className="text-pitch-text">Phạt Trùng Cặp Né Nhau:</span>
            <strong className="text-rose-400">{weights.conflictWeight}</strong>
          </div>
          <input
            type="range"
            min="1"
            max="20"
            step="1"
            value={weights.conflictWeight}
            onChange={(e) => updateWeight('conflictWeight', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-pitch-line rounded cursor-pointer accent-[#FF5D5D]"
          />
          <p className="text-[10px] text-pitch-muted">Mức phạt rất nặng khi vô tình xếp 2 người né nhau vào chung 1 đội.</p>
        </div>

        {/* Out of Position Weight */}
        <div className="space-y-1">
          <div className="flex justify-between font-mono">
            <span className="text-pitch-text">Phạt Xếp Trái Vị Trí:</span>
            <strong className="text-rose-400">{weights.outOfPositionWeight}</strong>
          </div>
          <input
            type="range"
            min="20"
            max="200"
            step="10"
            value={weights.outOfPositionWeight}
            onChange={(e) => updateWeight('outOfPositionWeight', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-pitch-line rounded cursor-pointer accent-[#FF5D5D]"
          />
          <p className="text-[10px] text-pitch-muted">Mức phạt tối đa nếu xếp cầu thủ vào vị trí họ không thể đá.</p>
        </div>

        {/* Preferred Bonus */}
        <div className="space-y-1">
          <div className="flex justify-between font-mono">
            <span className="text-pitch-text">Thưởng Đúng Sở Trường:</span>
            <strong className="text-emerald-400">{weights.preferredBonus}</strong>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={weights.preferredBonus}
            onChange={(e) => updateWeight('preferredBonus', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-pitch-line rounded cursor-pointer accent-[#10B981]"
          />
          <p className="text-[10px] text-pitch-muted">Điểm thưởng cho mỗi cầu thủ được đá đúng vị trí sở trường nhất.</p>
        </div>
      </div>
    </div>
  );
};
