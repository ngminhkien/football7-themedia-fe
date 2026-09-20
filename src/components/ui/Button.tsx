import React from 'react';
import { cn } from '@/lib/cn';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'neon' | 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'yellow' | 'blue';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'neon',
      size = 'md',
      isLoading = false,
      disabled,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E8FF3A] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 cursor-pointer min-h-[44px] select-none';

    const variants = {
      neon: 'bg-[#E8FF3A] text-[#06251B] hover:bg-[#D4ED26] neon-glow font-bold',
      primary: 'bg-[#14805A] text-[#F4FFF8] hover:bg-[#189b6d] border border-white/10',
      secondary: 'bg-[#06251B] text-[#F4FFF8] hover:bg-[#0E5A3F]/50 border border-white/15',
      ghost: 'bg-transparent text-[#F4FFF8] hover:bg-white/10 active:bg-white/15',
      danger: 'bg-[#FF5D5D] text-white hover:bg-[#ff4343] shadow-lg shadow-red-500/20',
      outline:
        'bg-transparent text-[#F4FFF8] border border-white/20 hover:border-[#E8FF3A] hover:text-[#E8FF3A]',
      yellow: 'bg-[#FFD23F] text-[#06251B] hover:bg-[#f5c72a] font-bold shadow-lg shadow-yellow-500/20',
      blue: 'bg-[#3BA7FF] text-white hover:bg-[#2594eb] font-bold shadow-lg shadow-blue-500/20',
    };

    const sizes = {
      sm: 'text-xs px-3 py-2 min-h-[38px] rounded-xl gap-1.5',
      md: 'text-sm px-5 py-3 min-h-[46px] gap-2',
      lg: 'text-base px-6 py-4 min-h-[54px] rounded-2xl gap-2.5 font-bold tracking-wide',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin shrink-0" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
