import { forwardRef, useId } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@utils/index';

const sizes = {
  sm: 'h-9 text-sm pl-9 pr-9',
  md: 'h-11 text-sm pl-10 pr-10',
  lg: 'h-12 text-base pl-11 pr-11',
};

export const SearchInput = forwardRef(function SearchInput(
  {
    label = 'Search',
    hideLabel = true,
    value,
    onChange,
    onClear,
    error,
    hint,
    id,
    size = 'md',
    placeholder = 'Search…',
    className,
    inputClassName,
    disabled = false,
    ...props
  },
  ref,
) {
  const uid = useId();
  const inputId = id ?? uid;
  const hasValue = value != null && String(value).length > 0;
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;

  function handleClear() {
    onClear?.();
    if (!onClear && onChange) {
      onChange({ target: { value: '' } });
    }
  }

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label
        htmlFor={inputId}
        className={cn('text-sm font-medium text-text', hideLabel && 'sr-only')}
      >
        {label}
      </label>

      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
          aria-hidden="true"
        />

        <input
          ref={ref}
          id={inputId}
          type="search"
          role="searchbox"
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            'w-full rounded-xl bg-surface border border-border text-text',
            'placeholder:text-text-muted',
            'transition-[border-color,box-shadow] duration-200',
            'hover:border-border-hover',
            'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/25',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            '[&::-webkit-search-cancel-button]:hidden',
            error && 'border-error focus:border-error focus:ring-error/25',
            sizes[size],
            inputClassName,
          )}
          {...props}
        />

        {hasValue && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-lg text-text-muted hover:text-text hover:bg-surface-hover transition-colors"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
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
