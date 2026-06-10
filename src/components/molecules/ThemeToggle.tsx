import { useThemeStore } from '../../store/theme.store';
import { cn } from '../../lib/utils';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggle } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
      className={cn(
        'relative inline-flex h-6 w-11 items-center rounded-full',
        'border border-border-2 transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
        isDark ? 'bg-accent' : 'bg-bg-tertiary',
        className,
      )}
    >
      <span
        className={cn(
          'inline-block h-4 w-4 rounded-full bg-text-inverse shadow-sm',
          'transition-transform duration-200',
          isDark ? 'translate-x-6' : 'translate-x-1',
        )}
      />
      <span className="sr-only">{isDark ? 'Modo escuro ativo' : 'Modo claro ativo'}</span>
    </button>
  );
}
