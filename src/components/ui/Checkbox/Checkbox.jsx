import { forwardRef, useId } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@utils/index';

export const Checkbox = forwardRef(function Checkbox(
  {
    label,
    description,
    error,
    id,
    checked,
    defaultChecked,
    onChange,
    disabled = false,
    required = false,
    indeterminate = false,
    className,
    ...props
  },
  ref,
) {
  const uid = useId();
  const inputId = id ?? uid;

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <label
        htmlFor={inputId}
        className={cn(
          'group inline-flex items-start gap-3 cursor-pointer select-none',
          disabled && 'opacity-50 cursor-not-allowed',
        )}
      >
        <span className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
          <input
            ref={(node) => {
              if (typeof ref === 'function') ref(node);
              else if (ref) ref.current = node;
              if (node) node.indeterminate = Boolean(indeterminate);
            }}
            id={inputId}
            type="checkbox"
            checked={checked}
            defaultChecked={defaultChecked}
            onChange={onChange}
            disabled={disabled}
            required={required}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${inputId}-error` : undefined}
            className="peer sr-only"
            {...props}
          />
          <span
            className={cn(
              'flex h-5 w-5 items-center justify-center rounded-md border border-border bg-surface',
              'transition-colors duration-200',
              'peer-hover:border-border-hover',
              'peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary',
              'peer-checked:bg-primary peer-checked:border-primary',
              'peer-disabled:pointer-events-none',
              '[&_svg]:opacity-0 [&_svg]:scale-75 peer-checked:[&_svg]:opacity-100 peer-checked:[&_svg]:scale-100',
              error && 'border-error',
            )}
            aria-hidden="true"
          >
            <Check className="h-3.5 w-3.5 text-white transition-all duration-150" strokeWidth={3} />
          </span>
        </span>

        {(label || description) && (
          <span className="flex flex-col gap-0.5">
            {label && <span className="text-sm font-medium text-text">{label}</span>}
            {description && (
              <span className="text-xs text-text-muted">{description}</span>
            )}
          </span>
        )}
      </label>

      {error && (
        <p id={`${inputId}-error`} className="text-xs text-error pl-8" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});
