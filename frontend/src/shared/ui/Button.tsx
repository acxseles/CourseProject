import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/shared/lib';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: ReactNode;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className,
  style,
  ...props
}: ButtonProps) => {
  const variantStyles = {
    primary: {
      backgroundImage: 'linear-gradient(to right, var(--color-primary-600), var(--color-primary-500))',
      color: 'white',
    },
    secondary: {
      backgroundColor: 'var(--bg-primary)',
      color: 'var(--color-secondary-600)',
      borderColor: 'var(--color-secondary-500)',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--color-neutral-900)',
    },
    danger: {
      backgroundColor: 'var(--color-error)',
      color: 'white',
    },
    outline: {
      borderColor: 'var(--color-neutral-200)',
      color: 'var(--color-neutral-900)',
    },
  };

  const variantClasses = {
    primary: 'shadow-lg hover:shadow-xl text-white',
    secondary: 'border-2 hover:bg-secondary-50',
    ghost: 'hover:bg-neutral-100 hover:text-accent-600',
    danger: 'hover:bg-red-600 shadow-lg hover:shadow-xl',
    outline: 'border-2 hover:border-primary-400 hover:bg-primary-50',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      disabled={disabled || loading}
      style={{
        ...variantStyles[variant],
        ...style,
      } as React.CSSProperties}
      className={cn(
        'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300',
        'disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-400',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Загрузка...
        </span>
      ) : (
        children
      )}
    </button>
  );
};
