import type { ReactNode } from 'react';
import { cn } from '@/shared/lib';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className }: CardProps) => {
  return (
    <div
      style={{
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        borderColor: 'var(--color-border)',
      }}
      className={cn(
        'w-full rounded-2xl border shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 sm:p-8',
        className
      )}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  title: string;
  description?: string;
}

export const CardHeader = ({ title, description }: CardHeaderProps) => {
  return (
    <div className="mb-6 pb-4 border-b border-border w-full">
      <h2 className="text-xl sm:text-2xl font-bold text-foreground">
  {title}
</h2>

      {description && (
        <p className="text-sm sm:text-base text-foreground/70 mt-2">{description}</p>
      )}
    </div>
  );
};

