import type { ReactNode } from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/shared/lib';

interface AlertProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  children: ReactNode;
  className?: string;
}

export const Alert = ({ type = 'info', children, className }: AlertProps) => {
  const styles = {
    success: 'bg-green-50 text-green-700 border-l-4 border-green-500',
    error: 'bg-red-50 text-red-700 border-l-4 border-red-500',
    warning: 'bg-amber-50 text-amber-700 border-l-4 border-amber-500',
    info: 'bg-primary-50 text-primary-700 border-l-4 border-primary-400',
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 flex-shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 flex-shrink-0" />,
    info: <Info className="w-5 h-5 sm:w-6 sm:h-6 text-primary-400 flex-shrink-0" />,
  };

  return (
    <div
      className={cn(
        'w-full flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border-0',
        styles[type],
        className
      )}
    >
      <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
      <div className="flex-1 text-xs sm:text-sm font-medium">{children}</div>
    </div>
  );
};
