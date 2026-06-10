import { cn } from '../../lib/utils';

interface ProgressProps {
  value: number;
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'xs' | 'sm' | 'md';
  animated?: boolean;
  className?: string;
  label?: string;
}

const trackSizes = {
  xs: 'h-1',
  sm: 'h-2',
  md: 'h-3',
};

const fillColors = {
  default: 'bg-accent',
  success: 'bg-success',
  warning: 'bg-warning',
  error:   'bg-error',
};

export function Progress({
  value,
  variant = 'default',
  size = 'sm',
  animated = false,
  className,
  label,
}: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={cn('w-full overflow-hidden rounded-full bg-[var(--color-xp-track)]', trackSizes[size], className)}
    >
      <div
        style={{ width: `${clamped}%` }}
        className={cn(
          'h-full rounded-full transition-[width] duration-500 ease-out',
          fillColors[variant],
          animated && 'animate-pulse',
        )}
      />
    </div>
  );
}
