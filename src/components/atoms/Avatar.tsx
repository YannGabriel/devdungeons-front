import { cn, initials } from '../../lib/utils';

interface AvatarProps {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizes = {
  xs: 'h-6 w-6 text-xs',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
};

export function Avatar({ name, size = 'md', className }: AvatarProps) {
  return (
    <span
      aria-label={name}
      className={cn(
        'inline-flex items-center justify-center rounded-full',
        'bg-accent text-text-inverse font-bold tracking-wide',
        'select-none flex-shrink-0',
        sizes[size],
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}
