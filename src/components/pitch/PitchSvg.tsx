import React from 'react';
import { cn } from '../../lib/cn';

export interface PitchSvgProps {
  className?: string;
  isHalfPitch?: boolean;
  children?: React.ReactNode;
}

export const PitchSvg: React.FC<PitchSvgProps> = ({
  className,
  isHalfPitch = true,
  children,
}) => {
  return (
    <div
      className={cn(
        'relative w-full aspect-[3/4] sm:aspect-[4/5] rounded-2xl overflow-hidden border-2 border-pitch-line shadow-[inset_0_0_60px_rgba(0,0,0,0.6)] bg-gradient-to-b from-[#0A3D2C] via-[#0E5A3F] to-[#0A3D2C]',
        className
      )}
    >
      {/* Turf Stripes Pattern */}
      <div className="absolute inset-0 opacity-25 pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_40px,rgba(0,0,0,0.25)_40px,rgba(0,0,0,0.25)_80px)]" />

      {/* SVG Pitch Lines */}
      <svg
        viewBox="0 0 100 130"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full pointer-events-none stroke-white/40 fill-none"
        strokeWidth="0.8"
      >
        {/* Outer Boundary */}
        <rect x="5" y="5" width="90" height="120" rx="2" />

        {isHalfPitch ? (
          <>
            {/* Halfway line (at the top) */}
            <line x1="5" y1="5" x2="95" y2="5" strokeWidth="1.2" />
            {/* Center Circle Arc (at the top) */}
            <path d="M 35 5 A 15 15 0 0 0 65 5" />
            {/* Center Spot */}
            <circle cx="50" cy="5" r="1" className="fill-white/60" />

            {/* Penalty Box (bottom) */}
            <rect x="22" y="98" width="56" height="27" />
            {/* Goal Area / 6-yard box */}
            <rect x="36" y="113" width="28" height="12" />
            {/* Penalty Spot */}
            <circle cx="50" cy="107" r="0.8" className="fill-white/60" />
            {/* Penalty Arc */}
            <path d="M 38 98 A 12 12 0 0 1 62 98" />
            {/* Goal Line Frame */}
            <rect x="40" y="125" width="20" height="3" className="stroke-accent-neon/30 fill-accent-neon/5" />
          </>
        ) : (
          <>
            {/* Full pitch halfway line */}
            <line x1="5" y1="65" x2="95" y2="65" strokeWidth="1" />
            {/* Center Circle */}
            <circle cx="50" cy="65" r="14" />
            <circle cx="50" cy="65" r="1" className="fill-white/60" />

            {/* Top Penalty Box */}
            <rect x="22" y="5" width="56" height="25" />
            <rect x="36" y="5" width="28" height="11" />
            <circle cx="50" cy="22" r="0.8" className="fill-white/60" />
            <path d="M 38 30 A 12 12 0 0 0 62 30" />

            {/* Bottom Penalty Box */}
            <rect x="22" y="100" width="56" height="25" />
            <rect x="36" y="114" width="28" height="11" />
            <circle cx="50" cy="108" r="0.8" className="fill-white/60" />
            <path d="M 38 100 A 12 12 0 0 1 62 100" />
          </>
        )}

        {/* Corner Arcs */}
        <path d="M 5 9 A 4 4 0 0 0 9 5" />
        <path d="M 91 5 A 4 4 0 0 0 95 9" />
        <path d="M 5 121 A 4 4 0 0 1 9 125" />
        <path d="M 91 125 A 4 4 0 0 1 95 121" />
      </svg>

      {/* Children placed on pitch (player markers, slots) */}
      <div className="absolute inset-0">{children}</div>
    </div>
  );
};
