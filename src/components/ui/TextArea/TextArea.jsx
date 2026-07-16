import { forwardRef, useId } from 'react';
import { cn } from '@utils/index';

const resizeMap = {
  none: 'resize-none',
  vertical: 'resize-y',
  horizontal: 'resize-x',
  both: 'resize',
};

export const TextArea = forwardRef(function TextArea(
  {
    label,
    error,
    hint,
    id,
    resize = 'vertical',
    rows = 4,
    className,
    textareaClassName,
    disabled = false,
    required = false,
    ...props
  },
  ref,
) {
  const uid = useId();
  const areaId = id ?? uid;
  const describedBy = error ? `${areaId}-error` : hint ? `${areaId}-hint` : undefined;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={areaId} className="text-sm font-medium text-text">
          {label}
          {required && <span className="ml-1 text-error" aria-hidden="true">*</span>}
        </label>
      )}

      <textarea
        ref={ref}
        id={areaId}
        rows={rows}
        disabled={disabled}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(
          'w-full rounded-xl bg-surface border border-border text-text text-sm',
          'px-3.5 py-3 placeholder:text-text-muted',
          'transition-[border-color,box-shadow] duration-200',
          'hover:border-border-hover',
          'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/25',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error && 'border-error focus:border-error focus:ring-error/25',
          resizeMap[resize] ?? resizeMap.vertical,
          textareaClassName,
        )}
        {...props}
      />

      {error && (
        <p id={`${areaId}-error`} className="text-xs text-error" role="alert">
          {error}
        </p>
      )}
      {!error && hint && (
        <p id={`${areaId}-hint`} className="text-xs text-text-muted">
          {hint}
        </p>
      )}
    </div>
  );
});
