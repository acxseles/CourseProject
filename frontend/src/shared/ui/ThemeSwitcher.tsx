import { Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/shared/lib';

interface ThemeSwitcherProps {
  className?: string;
}

export const ThemeSwitcher = ({ className }: ThemeSwitcherProps) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const htmlElement = document.documentElement;
    const currentTheme = htmlElement.getAttribute('data-theme') === 'dark';
    setIsDark(currentTheme);
  }, []);

  const toggleTheme = () => {
    const htmlElement = document.documentElement;
    const newTheme = isDark ? 'light' : 'dark';
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    setIsDark(!isDark);
  };

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'p-2.5 rounded-lg transition-all duration-300',
        'hover:bg-neutral-100',
        'focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2',
        className
      )}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-yellow-500" />
      ) : (
        <Moon className="w-5 h-5 text-neutral-600" />
      )}
    </button>
  );
};
