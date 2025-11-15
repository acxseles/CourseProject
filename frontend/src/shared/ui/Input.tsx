import type { InputHTMLAttributes } from 'react';
import { cn } from '@/shared/lib';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = ({ label, error, className, ...props }: InputProps) => {
  return (
    <div className="w-full flex flex-col gap-2">
      {label && (
        <label className="text-sm font-semibold text-foreground/70">
          {label}
        </label>
      )}
      <input
        style={{
          backgroundColor: 'var(--bg-primary)',
          color: 'var(--text-primary)',
          borderColor: error ? '#ef4444' : 'var(--color-border)',
        }}
        className={cn(
          'w-full px-3 sm:px-4 py-2 border rounded-lg text-base',
          'focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'transition-all duration-200',
          'placeholder:text-foreground/40',
          error && 'focus:ring-red-400',
          className
        )}
        {...props}
      />
      {error && (
        <span className="text-sm font-medium text-red-500 flex items-center gap-1">
          <span className="inline-block">⚠</span> {error}
        </span>
      )}
    </div>
  );
};
