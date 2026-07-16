import { forwardRef, useId, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@utils/index';

const sizes = {
  sm: 'h-9 text-sm px-3 pr-10',
  md: 'h-11 text-sm px-3.5 pr-11',
  lg: 'h-12 text-base px-4 pr-12',
};

export const PasswordInput = forwardRef(function PasswordInput(
  {
    label,
    error,
    hint,
    id,
    size = 'md',
    className,
    inputClassName,
    disabled = false,
    required = false,
    ...props
  },
  ref,
) {
  const [visible, setVisible] = useState(false);
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
        <input
          ref={ref}
          id={inputId}
          type={visible ? 'text' : 'password'}
          disabled={disabled}
          required={required}
          autoComplete="current-password"
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            'w-full rounded-xl bg-surface border border-border text-text',
            'placeholder:text-text-muted',
            'transition-[border-color,box-shadow] duration-200',
            'hover:border-border-hover',
            'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/25',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-error focus:border-error focus:ring-error/25',
            sizes[size],
            inputClassName,
          )}
          {...props}
        />

        <button
          type="button"
          tabIndex={-1}
          disabled={disabled}
          onClick={() => setVisible((v) => !v)}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-lg text-text-muted hover:text-text hover:bg-surface-hover transition-colors disabled:pointer-events-none"
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? (
            <EyeOff className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Eye className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
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
