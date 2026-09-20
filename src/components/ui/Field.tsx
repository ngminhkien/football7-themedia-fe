import React from 'react';
import { cn } from '../../lib/cn';

export interface FieldProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const Field: React.FC<FieldProps> = ({
  label,
  error,
  hint,
  required = false,
  className,
  children,
}) => {
  return (
    <div className={cn('space-y-1.5 w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-pitch-text">
          {label}
          {required && <span className="text-rose-400 ml-1">*</span>}
        </label>
      )}
      {children}
      {error && <p className="text-xs text-rose-400 mt-1 font-medium">{error}</p>}
      {!error && hint && <p className="text-xs text-pitch-muted mt-1">{hint}</p>}
    </div>
  );
};

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, hasError, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'w-full px-4 py-2.5 rounded-xl bg-pitch-panel/80 border text-pitch-text placeholder:text-pitch-muted/60',
          'transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-neon/50 focus:border-accent-neon',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          hasError
            ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/30'
            : 'border-pitch-line/80 hover:border-pitch-line',
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';
