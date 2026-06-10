import { cn } from '../../lib/utils';
import type { ReactNode } from 'react';

interface BadgeProps {
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
  children: ReactNode;
}

const variants = {
  default:  'bg-bg-tertiary text-text-2 border border-border',
  success:  'bg-success-bg text-success border border-success/20',
  error:    'bg-error-bg text-error border border-error/20',
  warning:  'bg-warning-bg text-warning border border-warning/20',
  info:     'bg-info-bg text-info border border-info/20',
  outline:  'bg-transparent text-text border border-border-2',
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs rounded-full',
  md: 'px-2.5 py-1 text-xs rounded-full',
};

export function Badge({ variant = 'default', size = 'sm', className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium',
        variants[variant],
        sizes[size],
        className,
      )}
    >
      {children}
    </span>
  );
}
