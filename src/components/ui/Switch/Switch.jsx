import { forwardRef, useId, useState } from 'react';
import { cn } from '@utils/index';

export const Switch = forwardRef(function Switch(
  {
    label,
    description,
    id,
    checked: checkedProp,
    defaultChecked = false,
    onChange,
    disabled = false,
    className,
    ...props
  },
  ref,
) {
  const uid = useId();
  const switchId = id ?? uid;
  const isControlled = checkedProp !== undefined;
  const [uncontrolled, setUncontrolled] = useState(defaultChecked);
  const checked = isControlled ? checkedProp : uncontrolled;

  function toggle() {
    if (disabled) return;
    const next = !checked;
    if (!isControlled) setUncontrolled(next);
    onChange?.({
      target: { checked: next },
      currentTarget: { checked: next },
    });
  }

  function handleKeyDown(event) {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      toggle();
    }
  }

  return (
    <div className={cn('inline-flex items-start gap-3', className)}>
      <button
        ref={ref}
        id={switchId}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={label ? `${switchId}-label` : undefined}
        disabled={disabled}
        onClick={toggle}
        onKeyDown={handleKeyDown}
        className={cn(
          'relative mt-0.5 h-6 w-11 shrink-0 rounded-full border',
          'transition-colors duration-200',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
          'disabled:opacity-50 disabled:pointer-events-none',
          checked
            ? 'bg-primary border-transparent'
            : 'bg-surface-elevated border-border',
        )}
        {...props}
      >
        <span
          className={cn(
            'pointer-events-none absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm',
            'transition-transform duration-200 ease-out',
            checked && 'translate-x-5',
          )}
          aria-hidden="true"
        />
      </button>

      {(label || description) && (
        <label
          htmlFor={switchId}
          className={cn(
            'flex flex-col gap-0.5 cursor-pointer select-none',
            disabled && 'opacity-50 cursor-not-allowed',
          )}
        >
          {label && (
            <span id={`${switchId}-label`} className="text-sm font-medium text-text">
              {label}
            </span>
          )}
          {description && (
            <span className="text-xs text-text-muted">{description}</span>
          )}
        </label>
      )}
    </div>
  );
});
