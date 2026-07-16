import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useId,
  useMemo,
} from 'react';
import { cn } from '@utils/index';

const RadioGroupContext = createContext(null);

export function RadioGroup({
  name,
  value,
  defaultValue,
  onChange,
  label,
  error,
  orientation = 'vertical',
  disabled = false,
  required = false,
  className,
  children,
  ...props
}) {
  const groupId = useId();
  const generatedName = useId();
  const groupName = name ?? generatedName;

  const ctx = useMemo(
    () => ({
      name: groupName,
      value,
      defaultValue,
      onChange,
      disabled,
      required,
      error,
    }),
    [groupName, value, defaultValue, onChange, disabled, required, error],
  );

  return (
    <RadioGroupContext.Provider value={ctx}>
      <fieldset
        className={cn('flex flex-col gap-2 border-0 p-0 m-0', className)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${groupId}-error` : undefined}
        disabled={disabled}
        {...props}
      >
        {label && (
          <legend className="mb-1 text-sm font-medium text-text">{label}</legend>
        )}
        <div
          role="radiogroup"
          aria-required={required || undefined}
          className={cn(
            'flex gap-3',
            orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap',
          )}
        >
          {children}
        </div>
        {error && (
          <p id={`${groupId}-error`} className="text-xs text-error" role="alert">
            {error}
          </p>
        )}
      </fieldset>
    </RadioGroupContext.Provider>
  );
}

export const Radio = forwardRef(function Radio(
  {
    label,
    description,
    value,
    id,
    checked: checkedProp,
    defaultChecked,
    onChange,
    disabled: disabledProp = false,
    name: nameProp,
    className,
    ...props
  },
  ref,
) {
  const ctx = useContext(RadioGroupContext);
  const uid = useId();
  const inputId = id ?? uid;

  const name = nameProp ?? ctx?.name;
  const disabled = disabledProp || ctx?.disabled;
  const isControlled = ctx?.value !== undefined || checkedProp !== undefined;
  const checked = ctx
    ? ctx.value !== undefined
      ? ctx.value === value
      : undefined
    : checkedProp;

  const handleChange = useCallback(
    (event) => {
      onChange?.(event);
      ctx?.onChange?.(event.target.value, event);
    },
    [onChange, ctx],
  );

  return (
    <label
      htmlFor={inputId}
      className={cn(
        'group inline-flex items-start gap-3 cursor-pointer select-none',
        disabled && 'opacity-50 cursor-not-allowed',
        className,
      )}
    >
      <span className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
        <input
          ref={ref}
          id={inputId}
          type="radio"
          name={name}
          value={value}
          checked={isControlled ? checked : undefined}
          defaultChecked={
            !isControlled
              ? defaultChecked ??
                (ctx?.defaultValue !== undefined
                  ? ctx.defaultValue === value
                  : undefined)
              : undefined
          }
          onChange={handleChange}
          disabled={disabled}
          required={ctx?.required}
          className="peer sr-only"
          {...props}
        />
        <span
          className={cn(
            'flex h-5 w-5 items-center justify-center rounded-full border border-border bg-surface',
            'transition-colors duration-200',
            'peer-hover:border-border-hover',
            'peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary',
            'peer-checked:border-primary',
            'peer-disabled:pointer-events-none',
            '[&>span]:scale-0 [&>span]:opacity-0 peer-checked:[&>span]:scale-100 peer-checked:[&>span]:opacity-100',
            ctx?.error && 'border-error',
          )}
          aria-hidden="true"
        >
          <span className="h-2.5 w-2.5 rounded-full bg-primary transition-all duration-150" />
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
  );
});
