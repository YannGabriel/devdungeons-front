import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';
import { Spinner } from './Spinner';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
}

const variants = {
  primary:
    'bg-accent text-text-inverse hover:bg-accent-hover active:opacity-90',
  secondary:
    'bg-transparent text-text border border-border hover:bg-bg-secondary active:bg-bg-tertiary',
  ghost:
    'bg-transparent text-text-2 hover:bg-bg-secondary hover:text-text active:bg-bg-tertiary',
  danger:
    'bg-error text-white hover:opacity-90 active:opacity-80',
  success:
    'bg-success text-white hover:opacity-90 active:opacity-80',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm rounded-md gap-1.5',
  md: 'px-4 py-2 text-sm rounded-md gap-2',
  lg: 'px-6 py-3 text-base rounded-lg gap-2',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      disabled,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center font-medium',
          'transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'select-none whitespace-nowrap',
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className,
        )}
        {...props}
      >
        {loading && <Spinner size="sm" />}
        <span className={cn(loading && 'opacity-0 absolute')}>{children}</span>
        {loading && <span className="sr-only">Carregando...</span>}
      </button>
    );
  },
);

Button.displayName = 'Button';
