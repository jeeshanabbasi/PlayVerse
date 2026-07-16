import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';
import { cn, scaleIn, SPRING_SOFT } from '@utils/index';
import { usePrefersReducedMotion } from '@hooks/index';

export const Dropdown = forwardRef(function Dropdown(
  {
    options = [],
    value,
    defaultValue,
    onChange,
    placeholder = 'Select…',
    label,
    error,
    hint,
    id,
    disabled = false,
    className,
    ...props
  },
  ref,
) {
  const uid = useId();
  const dropdownId = id ?? uid;
  const listboxId = `${dropdownId}-listbox`;
  const isControlled = value !== undefined;
  const [uncontrolled, setUncontrolled] = useState(defaultValue ?? null);
  const selected = isControlled ? value : uncontrolled;

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef(null);
  const listRef = useRef(null);
  const reduced = usePrefersReducedMotion();

  const selectedOption = options.find((o) => o.value === selected) ?? null;
  const SelectedIcon = selectedOption?.icon;

  const close = useCallback(() => {
    setOpen(false);
    setActiveIndex(-1);
  }, []);

  const selectOption = useCallback(
    (option) => {
      if (option.disabled) return;
      if (!isControlled) setUncontrolled(option.value);
      onChange?.(option.value, option);
      close();
    },
    [isControlled, onChange, close],
  );

  useEffect(() => {
    if (!open) return undefined;

    function onPointerDown(event) {
      if (!containerRef.current?.contains(event.target)) {
        close();
      }
    }

    function onKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
      }
    }

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, close]);

  useEffect(() => {
    if (!open || activeIndex < 0) return;
    const el = listRef.current?.querySelector(`[data-index="${activeIndex}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [open, activeIndex]);

  function openMenu() {
    if (disabled) return;
    setOpen(true);
    const idx = Math.max(
      0,
      options.findIndex((o) => o.value === selected),
    );
    setActiveIndex(idx === -1 ? 0 : idx);
  }

  function handleTriggerKeyDown(event) {
    if (disabled) return;

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp':
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (!open) openMenu();
        break;
      case 'Escape':
        if (open) {
          event.preventDefault();
          close();
        }
        break;
      default:
        break;
    }
  }

  function handleListKeyDown(event) {
    const enabled = options
      .map((opt, i) => ({ opt, i }))
      .filter(({ opt }) => !opt.disabled);

    if (enabled.length === 0) return;

    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault();
        const currentPos = enabled.findIndex(({ i }) => i === activeIndex);
        const next = enabled[(currentPos + 1) % enabled.length];
        setActiveIndex(next.i);
        break;
      }
      case 'ArrowUp': {
        event.preventDefault();
        const currentPos = enabled.findIndex(({ i }) => i === activeIndex);
        const prev = enabled[(currentPos - 1 + enabled.length) % enabled.length];
        setActiveIndex(prev.i);
        break;
      }
      case 'Home': {
        event.preventDefault();
        setActiveIndex(enabled[0].i);
        break;
      }
      case 'End': {
        event.preventDefault();
        setActiveIndex(enabled[enabled.length - 1].i);
        break;
      }
      case 'Enter':
      case ' ': {
        event.preventDefault();
        const opt = options[activeIndex];
        if (opt) selectOption(opt);
        break;
      }
      case 'Escape': {
        event.preventDefault();
        close();
        break;
      }
      case 'Tab':
        close();
        break;
      default:
        break;
    }
  }

  const describedBy = error
    ? `${dropdownId}-error`
    : hint
      ? `${dropdownId}-hint`
      : undefined;

  return (
    <div
      ref={(node) => {
        containerRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}
      className={cn('relative flex flex-col gap-1.5', className)}
      {...props}
    >
      {label && (
        <label id={`${dropdownId}-label`} className="text-sm font-medium text-text">
          {label}
        </label>
      )}

      <button
        type="button"
        id={dropdownId}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-labelledby={label ? `${dropdownId}-label ${dropdownId}` : dropdownId}
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
        onClick={() => (open ? close() : openMenu())}
        onKeyDown={handleTriggerKeyDown}
        className={cn(
          'flex h-11 w-full items-center justify-between gap-3 rounded-xl px-3.5 text-sm',
          'bg-surface border border-border text-left',
          'transition-[border-color,box-shadow] duration-200',
          'hover:border-border-hover',
          'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/25',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error && 'border-error focus:border-error focus:ring-error/25',
          open && 'border-primary ring-2 ring-primary/25',
        )}
      >
        <span className="flex min-w-0 items-center gap-2">
          {SelectedIcon && (
            <SelectedIcon className="h-4 w-4 shrink-0 text-text-muted" aria-hidden="true" />
          )}
          <span className={cn('truncate', !selectedOption && 'text-text-muted')}>
            {selectedOption?.label ?? placeholder}
          </span>
        </span>
        <ChevronDown
          className={cn(
            'h-4 w-4 shrink-0 text-text-muted transition-transform duration-200',
            open && 'rotate-180',
          )}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            ref={listRef}
            id={listboxId}
            role="listbox"
            tabIndex={-1}
            aria-labelledby={label ? `${dropdownId}-label` : dropdownId}
            initial={reduced ? false : scaleIn.initial}
            animate={reduced ? undefined : scaleIn.animate}
            exit={reduced ? undefined : scaleIn.exit}
            transition={SPRING_SOFT}
            onKeyDown={handleListKeyDown}
            className={cn(
              'absolute left-0 right-0 top-full z-[100] mt-2 max-h-60 overflow-auto p-1.5',
              'rounded-xl border border-border bg-surface-elevated/95 backdrop-blur-xl',
              'shadow-[var(--shadow-lift)] outline-none',
            )}
          >
            {options.map((option, index) => {
              const isSelected = option.value === selected;
              const isActive = index === activeIndex;
              const Icon = option.icon;

              return (
                <li
                  key={option.value}
                  role="option"
                  data-index={index}
                  aria-selected={isSelected}
                  aria-disabled={option.disabled || undefined}
                  onMouseEnter={() => !option.disabled && setActiveIndex(index)}
                  onClick={() => selectOption(option)}
                  className={cn(
                    'flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-sm',
                    'transition-colors duration-150',
                    isActive && 'bg-primary-muted text-text',
                    isSelected && 'text-primary',
                    option.disabled && 'opacity-40 pointer-events-none cursor-not-allowed',
                  )}
                >
                  {Icon && <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />}
                  <span className="min-w-0 flex-1 truncate">{option.label}</span>
                  {isSelected && (
                    <Check className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  )}
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>

      {error && (
        <p id={`${dropdownId}-error`} className="text-xs text-error" role="alert">
          {error}
        </p>
      )}
      {!error && hint && (
        <p id={`${dropdownId}-hint`} className="text-xs text-text-muted">
          {hint}
        </p>
      )}
    </div>
  );
});
