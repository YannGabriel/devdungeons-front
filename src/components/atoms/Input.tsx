import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, icon, className, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {icon && (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-text-3">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full rounded-md border bg-surface px-3 py-2 text-sm text-text',
            'placeholder:text-text-3',
            'transition-colors duration-150',
            'focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error
              ? 'border-error focus:ring-error'
              : 'border-border hover:border-border-2',
            !!icon && 'pl-10',
            className,
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-error">{error}</p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
