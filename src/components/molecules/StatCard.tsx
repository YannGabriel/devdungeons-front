import { cn } from '../../lib/utils';
import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  variant?: 'default' | 'highlight';
  className?: string;
}

export function StatCard({
  label,
  value,
  description,
  icon,
  variant = 'default',
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2 rounded-lg border p-4 transition-shadow hover:shadow-sm',
        variant === 'default'
          ? 'bg-surface border-border'
          : 'bg-accent text-text-inverse border-accent',
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span
          className={cn(
            'text-xs font-medium uppercase tracking-wider',
            variant === 'default' ? 'text-text-3' : 'text-text-inverse/70',
          )}
        >
          {label}
        </span>
        {icon && (
          <span className={cn('text-lg', variant === 'default' ? 'text-text-2' : 'text-text-inverse/80')}>
            {icon}
          </span>
        )}
      </div>
      <span
        className={cn(
          'text-2xl font-bold tracking-tight',
          variant === 'default' ? 'text-text' : 'text-text-inverse',
        )}
      >
        {value}
      </span>
      {description && (
        <span
          className={cn(
            'text-xs',
            variant === 'default' ? 'text-text-3' : 'text-text-inverse/60',
          )}
        >
          {description}
        </span>
      )}
    </div>
  );
}
