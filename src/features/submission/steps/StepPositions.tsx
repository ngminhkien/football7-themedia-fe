import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Position } from '../../../api/types';
import { PitchSvg } from '../../../components/pitch/PitchSvg';
import { POSITION_DETAILS } from '../../../lib/constants';

export interface StepPositionsProps {
  positions: Position[];
  preferredPosition: Position | null;
  onSetPositions: (positions: Position[], preferred?: Position | null) => void;
  onSetPreferred: (pos: Position) => void;
}

// Tactical coordinates for 5 positions on vertical pitch:
// FW: top center
// WG: left & right flanks (both trigger 'WG')
// MF: middle center
// DF: lower center
// GK: bottom center
const POSITION_ZONES = [
  { code: 'FW' as Position, label: 'FW', name: 'Tiền đạo', x: 50, y: 18 },
  { code: 'WG' as Position, label: 'WG (T)', name: 'Cánh trái', x: 22, y: 44 },
  { code: 'WG' as Position, label: 'WG (P)', name: 'Cánh phải', x: 78, y: 44 },
  { code: 'MF' as Position, label: 'MF', name: 'Giữa (Tiền vệ)', x: 50, y: 44 },
  { code: 'DF' as Position, label: 'DF', name: 'Thòng (Hậu vệ)', x: 50, y: 70 },
  { code: 'GK' as Position, label: 'GK', name: 'Thủ môn', x: 50, y: 90 },
];

export const StepPositions: React.FC<StepPositionsProps> = ({
  positions,
  preferredPosition,
  onSetPositions,
  onSetPreferred,
}) => {
  const togglePosition = (pos: Position) => {
    let newPositions: Position[];
    let newPreferred = preferredPosition;

    if (positions.includes(pos)) {
      // Deselect
      newPositions = positions.filter((p) => p !== pos);
      if (newPreferred === pos) {
        newPreferred = newPositions.length === 1 ? newPositions[0] : null;
      }
    } else {
      // Select
      newPositions = [...positions, pos];
      if (newPositions.length === 1) {
        newPreferred = pos;
      }
    }

    onSetPositions(newPositions, newPreferred);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h3 className="text-xl sm:text-2xl font-display uppercase tracking-wider text-white font-bold">
          Chọn Vị Trí Bạn Có Thể Đá
        </h3>
        <p className="text-xs text-pitch-muted">
          Chạm trực tiếp vào các vùng trên sa bàn để chọn (có thể chọn nhiều vị trí).
        </p>
      </div>

      {/* Interactive Pitch */}
      <div className="max-w-md mx-auto">
        <PitchSvg isHalfPitch className="shadow-2xl">
          {POSITION_ZONES.map((zone, idx) => {
            const isSelected = positions.includes(zone.code);
            const isPreferred = preferredPosition === zone.code;

            return (
              <div
                key={`${zone.code}-${idx}`}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
              >
                <button
                  type="button"
                  onClick={() => togglePosition(zone.code)}
                  className="group flex flex-col items-center justify-center focus:outline-none select-none active:scale-95 transition-transform"
                >
                  <motion.div
                    whileHover={{ scale: 1.15 }}
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex flex-col items-center justify-center font-display tracking-wider font-bold transition-all shadow-lg ${
                      isPreferred
                        ? 'bg-accent-neon text-pitch-dark border-2 border-white shadow-[0_0_20px_rgba(232,255,58,0.7)] scale-110'
                        : isSelected
                        ? 'bg-emerald-500 text-white border-2 border-white/80 shadow-[0_0_15px_rgba(16,185,129,0.6)]'
                        : 'bg-pitch-dark/85 text-pitch-muted border-2 border-white/20 hover:border-accent-neon/70 hover:text-white'
                    }`}
                  >
                    <span className="text-sm sm:text-base leading-none">{zone.label}</span>
                    {isPreferred && (
                      <span className="text-[8px] font-sans font-black uppercase tracking-tighter text-pitch-dark">
                        ★ SỞ TRƯỜNG
                      </span>
                    )}
                  </motion.div>

                  <span
                    className={`mt-1 px-1.5 py-0.5 rounded text-[10px] sm:text-xs font-semibold backdrop-blur-md ${
                      isPreferred
                        ? 'bg-accent-neon text-pitch-dark font-bold'
                        : isSelected
                        ? 'bg-emerald-600 text-white'
                        : 'bg-black/60 text-white/90 border border-white/10'
                    }`}
                  >
                    {zone.name}
                  </span>
                </button>
              </div>
            );
          })}
        </PitchSvg>
      </div>

      {/* Preferred Position Selector */}
      {positions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-pitch-panel/90 border border-pitch-line/80 space-y-3"
        >
          <div className="flex items-center gap-2 text-xs font-semibold text-accent-neon uppercase tracking-wider">
            <Star className="w-4 h-4 fill-accent-neon" />
            <span>Đâu là vị trí sở trường nhất của bạn? (Chọn 1 vị trí)</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {positions.map((pos) => {
              const details = POSITION_DETAILS[pos];
              const isPreferred = preferredPosition === pos;

              return (
                <button
                  key={pos}
                  type="button"
                  onClick={() => onSetPreferred(pos)}
                  className={`px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all flex items-center gap-2 ${
                    isPreferred
                      ? 'bg-accent-neon text-pitch-dark border-white shadow-[0_0_12px_rgba(232,255,58,0.4)]'
                      : 'bg-pitch-dark/80 text-pitch-text border-pitch-line/60 hover:border-accent-neon/50'
                  }`}
                >
                  <span className="font-display text-sm">{pos}</span>
                  <span>- {details.label}</span>
                  {isPreferred && <span className="text-xs">★</span>}
                </button>
              );
            })}
          </div>

          {!preferredPosition && (
            <p className="text-xs text-rose-400 font-medium animate-pulse">
              * Vui lòng chọn 1 vị trí sở trường để tiếp tục.
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
};
