import React, { useEffect, useState } from 'react';
import { cn } from '../../lib/cn';

export interface CountUpProps {
  end: number;
  start?: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export const CountUp: React.FC<CountUpProps> = ({
  end,
  start = 0,
  duration = 1000,
  decimals = 0,
  prefix = '',
  suffix = '',
  className,
}) => {
  const [current, setCurrent] = useState(start);

  useEffect(() => {
    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const val = start + (end - start) * easedProgress;
      setCurrent(val);

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [end, start, duration]);

  return (
    <span className={cn('font-mono font-bold', className)}>
      {prefix}
      {current.toFixed(decimals)}
      {suffix}
    </span>
  );
};
