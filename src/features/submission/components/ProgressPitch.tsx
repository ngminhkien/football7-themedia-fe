import React from 'react';
import { motion } from 'framer-motion';
import { WizardStep } from '../wizardReducer';

export interface ProgressPitchProps {
  currentStep: WizardStep;
}

const STEP_LABELS = ['Tên', 'Vị trí', 'Né ai', 'Tự chấm', 'Hoàn tất'];

export const ProgressPitch: React.FC<ProgressPitchProps> = ({ currentStep }) => {
  // Percentage coordinate along the pitch width:
  // Step 1: 10%, Step 2: 30%, Step 3: 50%, Step 4: 70%, Step 5: 90%
  const ballPositions = {
    1: 10,
    2: 30,
    3: 50,
    4: 70,
    5: 90,
  };

  const ballX = ballPositions[currentStep];

  return (
    <div className="w-full space-y-2 select-none">
      {/* Mini Stadium Pitch Banner */}
      <div className="relative w-full h-14 rounded-2xl overflow-hidden border border-pitch-line/80 bg-gradient-to-r from-[#072B20] via-[#0E5A3F] to-[#072B20] shadow-inner flex items-center px-4">
        {/* Subtle Pitch Markings */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[repeating-linear-gradient(90deg,transparent,transparent_30px,rgba(0,0,0,0.3)_30px,rgba(0,0,0,0.3)_60px)]" />
        <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/30 -translate-x-1/2" />
        <div className="absolute top-1/2 left-1/2 w-8 h-8 rounded-full border border-white/30 -translate-x-1/2 -translate-y-1/2" />

        {/* 5 Step Waypoints */}
        {[1, 2, 3, 4, 5].map((step) => {
          const isPassed = step < currentStep;
          const isCurrent = step === currentStep;
          const xPct = ballPositions[step as WizardStep];

          return (
            <div
              key={step}
              className="absolute -translate-x-1/2 flex flex-col items-center z-10"
              style={{ left: `${xPct}%` }}
            >
              <div
                className={`w-3 h-3 rounded-full border transition-all ${
                  isPassed
                    ? 'bg-accent-neon border-accent-neon shadow-[0_0_8px_#E8FF3A]'
                    : isCurrent
                    ? 'bg-white border-white scale-125'
                    : 'bg-pitch-dark/80 border-white/20'
                }`}
              />
            </div>
          );
        })}

        {/* Animated Rolling Football */}
        <motion.div
          animate={{ left: `${ballX}%` }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="absolute -translate-x-1/2 -top-1 z-20"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="w-7 h-7 rounded-full bg-white border-2 border-pitch-dark shadow-[0_0_15px_rgba(232,255,58,0.8)] flex items-center justify-center text-[10px]"
          >
            ⚽
          </motion.div>
        </motion.div>
      </div>

      {/* Step Labels */}
      <div className="grid grid-cols-5 text-center">
        {STEP_LABELS.map((label, idx) => {
          const stepNum = idx + 1;
          const isCurrent = stepNum === currentStep;
          const isPassed = stepNum < currentStep;

          return (
            <span
              key={label}
              className={`text-[11px] font-medium transition-colors ${
                isCurrent
                  ? 'text-accent-neon font-bold'
                  : isPassed
                  ? 'text-pitch-text'
                  : 'text-pitch-muted/60'
              }`}
            >
              {stepNum}. {label}
            </span>
          );
        })}
      </div>
    </div>
  );
};
