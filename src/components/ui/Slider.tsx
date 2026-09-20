import React from 'react';
import { cn } from '../../lib/cn';

export interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  unit?: string;
  showValueBadge?: boolean;
  disabled?: boolean;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  onChange,
  min = 1,
  max = 10,
  step = 0.5,
  label,
  unit = '',
  showValueBadge = true,
  disabled = false,
  className,
}) => {
  const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  return (
    <div className={cn('w-full space-y-2', className)}>
      {(label || showValueBadge) && (
        <div className="flex items-center justify-between">
          {label && <label className="text-sm font-medium text-pitch-text">{label}</label>}
          {showValueBadge && (
            <span className="font-display text-base font-bold text-accent-neon px-2 py-0.5 rounded bg-pitch-panel border border-accent-neon/30 shadow-[0_0_8px_rgba(232,255,58,0.2)]">
              {value.toFixed(step < 1 ? 1 : 0)}
              {unit}
            </span>
          )}
        </div>
      )}

      <div className="relative flex items-center select-none touch-none">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className={cn(
            'w-full h-2 rounded-lg appearance-none cursor-pointer bg-pitch-line/60 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed',
            // Custom thumb styling
            '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-neon [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(232,255,58,0.5)] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110',
            '[&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-accent-neon [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer'
          )}
          style={{
            background: `linear-gradient(to right, #E8FF3A ${percentage}%, rgba(255,255,255,0.1) ${percentage}%)`,
          }}
        />
      </div>

      <div className="flex justify-between text-[11px] text-pitch-muted font-mono">
        <span>{min}{unit}</span>
        <span>{((min + max) / 2).toFixed(step < 1 ? 1 : 0)}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
};
