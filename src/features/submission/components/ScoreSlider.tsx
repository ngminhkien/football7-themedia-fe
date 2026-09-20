import React from 'react';
import { motion } from 'framer-motion';
import { CountUp } from '../../../components/fx/CountUp';
import { SCORE_DESCRIPTIONS } from '../../../lib/constants';

export interface ScoreSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export const ScoreSlider: React.FC<ScoreSliderProps> = ({ value, onChange }) => {
  const description = SCORE_DESCRIPTIONS[value] || 'Tự tin với năng lực của mình!';
  const percentage = ((value - 1) / 9) * 100;

  return (
    <div className="space-y-6 py-4">
      {/* Big Animated Rating Display */}
      <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-pitch-panel/90 border border-pitch-line/80 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-accent-neon/5 to-transparent pointer-events-none" />

        <span className="text-xs uppercase tracking-widest text-pitch-muted font-mono mb-1">
          Điểm Tự Đánh Giá
        </span>

        <motion.div
          key={value}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          className="flex items-baseline gap-1"
        >
          <CountUp
            end={value}
            decimals={0}
            className="text-6xl sm:text-7xl font-display font-black text-accent-neon leading-none tracking-tight drop-shadow-[0_0_20px_rgba(232,255,58,0.4)]"
          />
          <span className="text-2xl font-display text-pitch-muted">/10</span>
        </motion.div>

        {/* Dynamic Funny Vietnamese Description */}
        <motion.p
          key={description}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm font-medium text-pitch-text text-center mt-3 max-w-sm leading-relaxed"
        >
          {description}
        </motion.p>
      </div>

      {/* Interactive Range Slider with Ball Thumb */}
      <div className="space-y-3 px-2">
        <div className="relative flex items-center">
          <input
            type="range"
            min={1}
            max={10}
            step={1}
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value, 10))}
            className="w-full h-3 rounded-lg appearance-none cursor-pointer bg-pitch-line/60 focus:outline-none select-none
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:h-8 
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white 
              [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-pitch-dark 
              [&::-webkit-slider-thumb]:shadow-[0_0_15px_rgba(232,255,58,0.8)] 
              [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform 
              [&::-webkit-slider-thumb]:hover:scale-115 active:[&::-webkit-slider-thumb]:scale-125
              [&::-moz-range-thumb]:w-8 [&::-moz-range-thumb]:h-8 [&::-moz-range-thumb]:rounded-full 
              [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-pitch-dark"
            style={{
              background: `linear-gradient(to right, #E8FF3A ${percentage}%, rgba(255,255,255,0.1) ${percentage}%)`,
            }}
          />
        </div>

        {/* Step Ticks 1 - 10 */}
        <div className="flex justify-between items-center text-xs font-mono text-pitch-muted px-1">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => onChange(num)}
              className={`hover:text-accent-neon transition-colors p-1 ${
                value === num ? 'text-accent-neon font-bold scale-110' : ''
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
