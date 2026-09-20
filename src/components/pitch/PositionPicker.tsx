import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Position, PositionSubmissionDto } from '../../api/types';
import { PitchSvg } from './PitchSvg';
import { POSITION_NAMES } from '../../lib/constants';
import { cn } from '../../lib/cn';
import { Badge } from '../ui/Badge';

export interface PositionPickerProps {
  value: PositionSubmissionDto[];
  onChange: (value: PositionSubmissionDto[]) => void;
  disabled?: boolean;
  className?: string;
}

interface PositionSpot {
  code: Position;
  label: string;
  name: string;
  x: number;
  y: number;
  description: string;
}

const SPOTS: PositionSpot[] = [
  {
    code: 'FW',
    label: 'FW',
    name: 'Tiền đạo',
    x: 50,
    y: 18,
    description: 'Dứt điểm, tì đè, pressing hàng thủ đối phương',
  },
  {
    code: 'WG',
    label: 'WG (T)',
    name: 'Cánh trái',
    x: 22,
    y: 44,
    description: 'Bám biên, leo biên tạt cánh, hỗ trợ phòng ngự',
  },
  {
    code: 'WG',
    label: 'WG (P)',
    name: 'Cánh phải',
    x: 78,
    y: 44,
    description: 'Bám biên, leo biên tạt cánh, hỗ trợ phòng ngự',
  },
  {
    code: 'MF',
    label: 'MF',
    name: 'Giữa (Tiền vệ)',
    x: 50,
    y: 44,
    description: 'Cầm nhịp, phân phối bóng, thu hồi tuyến 2',
  },
  {
    code: 'DF',
    label: 'DF',
    name: 'Thòng (Hậu vệ)',
    x: 50,
    y: 70,
    description: 'Chỉ huy phòng ngự, bọc lót, cắt bóng',
  },
  {
    code: 'GK',
    label: 'GK',
    name: 'Thủ môn',
    x: 50,
    y: 90,
    description: 'Phản xạ, bắt bóng, phát động tấn công',
  },
];

export const PositionPicker: React.FC<PositionPickerProps> = ({
  value,
  onChange,
  disabled = false,
  className,
}) => {
  const primaryPos = value.find((p) => p.isPrimary)?.position;
  const secondaryPos = value.find((p) => !p.isPrimary)?.position;

  const handleSelect = (pos: Position) => {
    if (disabled) return;

    // If clicking primary:
    if (pos === primaryPos) {
      if (secondaryPos) {
        // Promote secondary to primary
        onChange([{ position: secondaryPos, isPrimary: true }]);
      } else {
        // Clear all
        onChange([]);
      }
      return;
    }

    // If clicking secondary:
    if (pos === secondaryPos) {
      // Remove secondary
      onChange([{ position: primaryPos!, isPrimary: true }]);
      return;
    }

    // New selection:
    if (!primaryPos) {
      onChange([{ position: pos, isPrimary: true }]);
    } else if (!secondaryPos) {
      onChange([
        { position: primaryPos, isPrimary: true },
        { position: pos, isPrimary: false },
      ]);
    } else {
      // Already has 2 positions -> replace secondary
      onChange([
        { position: primaryPos, isPrimary: true },
        { position: pos, isPrimary: false },
      ]);
    }
  };

  const getPositionRole = (pos: Position): 'primary' | 'secondary' | null => {
    if (pos === primaryPos) return 'primary';
    if (pos === secondaryPos) return 'secondary';
    return null;
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Selected badges summary */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-pitch-panel/70 border border-pitch-line/60">
        <div className="text-xs text-pitch-muted">
          Chọn tối đa <span className="font-semibold text-pitch-text">2 vị trí</span> (1 chính, 1 phụ)
        </div>
        <div className="flex items-center gap-2">
          {primaryPos ? (
            <Badge variant="neon" size="sm" className="gap-1.5 pl-2 pr-1.5 py-1">
              <span className="font-bold">★ Chính: {primaryPos} ({POSITION_NAMES[primaryPos]})</span>
              <button
                type="button"
                onClick={() => handleSelect(primaryPos)}
                className="hover:bg-black/30 p-0.5 rounded-full"
                title="Bỏ chọn"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ) : (
            <span className="text-xs text-pitch-muted italic">Chưa chọn vị trí chính</span>
          )}

          {secondaryPos && (
            <Badge variant="teamB" size="sm" className="gap-1.5 pl-2 pr-1.5 py-1">
              <span>Phụ: {secondaryPos} ({POSITION_NAMES[secondaryPos]})</span>
              <button
                type="button"
                onClick={() => handleSelect(secondaryPos)}
                className="hover:bg-black/30 p-0.5 rounded-full"
                title="Bỏ chọn"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      </div>

      {/* Interactive Tactical Pitch */}
      <PitchSvg isHalfPitch className="max-w-md mx-auto shadow-2xl">
        {SPOTS.map((spot, idx) => {
          const role = getPositionRole(spot.code);
          const isSelected = role !== null;
          const isPrimary = role === 'primary';
          const isSecondary = role === 'secondary';

          return (
            <div
              key={`${spot.code}-${idx}`}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
            >
              <button
                type="button"
                disabled={disabled}
                onClick={() => handleSelect(spot.code)}
                className={cn(
                  'group relative flex flex-col items-center justify-center focus:outline-none transition-transform active:scale-95',
                  disabled && 'cursor-not-allowed opacity-60'
                )}
                title={`${spot.name}: ${spot.description}`}
              >
                {/* Tactical Node Circle */}
                <motion.div
                  whileHover={disabled ? undefined : { scale: 1.15 }}
                  className={cn(
                    'w-11 h-11 sm:w-13 sm:h-13 rounded-full flex flex-col items-center justify-center font-display tracking-wider font-bold transition-all shadow-lg',
                    !isSelected &&
                      'bg-pitch-dark/85 text-pitch-muted border-2 border-white/20 hover:border-accent-neon/70 hover:text-pitch-text',
                    isPrimary &&
                      'bg-accent-neon text-pitch-dark border-2 border-white shadow-[0_0_20px_rgba(232,255,58,0.7)] scale-110',
                    isSecondary &&
                      'bg-cyan-500 text-pitch-dark border-2 border-white shadow-[0_0_15px_rgba(6,182,212,0.6)] scale-105'
                  )}
                >
                  <span className="text-sm sm:text-base leading-none">{spot.code}</span>
                  <span className="text-[9px] font-sans font-medium uppercase tracking-tighter mt-0.5 opacity-90">
                    {isPrimary ? 'CHÍNH' : isSecondary ? 'PHỤ' : ''}
                  </span>
                </motion.div>

                {/* Subtitle label below */}
                <span
                  className={cn(
                    'mt-1 px-1.5 py-0.5 rounded text-[10px] sm:text-xs font-semibold whitespace-nowrap shadow-sm backdrop-blur-md',
                    isPrimary
                      ? 'bg-accent-neon/90 text-pitch-dark font-bold'
                      : isSecondary
                      ? 'bg-cyan-500/90 text-pitch-dark font-bold'
                      : 'bg-black/60 text-white/90 border border-white/10'
                  )}
                >
                  {spot.name}
                </span>
              </button>
            </div>
          );
        })}
      </PitchSvg>

      {/* Helper legend */}
      <div className="flex items-center justify-center gap-4 text-xs text-pitch-muted">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-accent-neon shadow-[0_0_6px_rgba(232,255,58,0.5)]" />
          <span>Vị trí chính (Sở trường)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-cyan-500 shadow-[0_0_6px_rgba(6,182,212,0.5)]" />
          <span>Vị trí phụ (Sở đoản)</span>
        </div>
      </div>
    </div>
  );
};
