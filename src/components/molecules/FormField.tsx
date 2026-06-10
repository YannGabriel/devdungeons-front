import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { Input, type InputProps } from '../atoms/Input';

interface FormFieldProps extends InputProps {
  label: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children?: ReactNode;
}

export function FormField({
  label,
  hint,
  required,
  className,
  id,
  children,
  ...inputProps
}: FormFieldProps) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={fieldId} className="text-sm font-medium text-text">
        {label}
        {required && <span className="ml-1 text-error">*</span>}
      </label>
      {children ?? <Input id={fieldId} {...inputProps} />}
      {hint && <p className="text-xs text-text-3">{hint}</p>}
    </div>
  );
}
