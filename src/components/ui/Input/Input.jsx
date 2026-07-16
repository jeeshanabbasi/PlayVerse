import { forwardRef, useId } from 'react';
import { cn } from '@utils/index';

const sizes = {
  sm: 'h-9 text-sm px-3',
  md: 'h-11 text-sm px-3.5',
  lg: 'h-12 text-base px-4',
};

const iconPad = {
  sm: { left: 'pl-9', right: 'pr-9' },
  md: { left: 'pl-10', right: 'pr-10' },
  lg: { left: 'pl-11', right: 'pr-11' },
};

export const Input = forwardRef(function Input(
  {
    label,
    error,
    hint,
    id,
    size = 'md',
    leftIcon: LeftIcon,
    rightIcon: RightIcon,
    className,
    inputClassName,
    disabled = false,
    required = false,
    ...props
  },
  ref,
) {
  const uid = useId();
  const inputId = id ?? uid;
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-text">
          {label}
          {required && <span className="ml-1 text-error" aria-hidden="true">*</span>}
        </label>
      )}

      <div className="relative">
        {LeftIcon && (
          <LeftIcon
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
            aria-hidden="true"
          />
        )}

        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            'w-full rounded-xl bg-surface border border-border text-text',
            'placeholder:text-text-muted',
            'transition-[border-color,box-shadow] duration-200',
            'hover:border-border-hover',
            'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/25',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-border',
            error && 'border-error focus:border-error focus:ring-error/25',
            sizes[size],
            LeftIcon && iconPad[size].left,
            RightIcon && iconPad[size].right,
            inputClassName,
          )}
          {...props}
        />

        {RightIcon && (
          <RightIcon
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
            aria-hidden="true"
          />
        )}
      </div>

      {error && (
        <p id={`${inputId}-error`} className="text-xs text-error" role="alert">
          {error}
        </p>
      )}
      {!error && hint && (
        <p id={`${inputId}-hint`} className="text-xs text-text-muted">
          {hint}
        </p>
      )}
    </div>
  );
});
