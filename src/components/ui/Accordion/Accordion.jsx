import {
  createContext,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@utils/index';

const AccordionContext = createContext(null);

function useAccordionContext() {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error('AccordionItem must be used within Accordion');
  return ctx;
}

export function Accordion({
  children,
  type = 'single',
  value: controlledValue,
  defaultValue,
  onChange,
  className,
}) {
  const [uncontrolled, setUncontrolled] = useState(() => {
    if (defaultValue !== undefined) return defaultValue;
    return type === 'multiple' ? [] : null;
  });

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolled;

  const setValue = useCallback(
    (next) => {
      if (!isControlled) setUncontrolled(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  const toggle = useCallback(
    (itemValue) => {
      if (type === 'multiple') {
        const current = Array.isArray(value) ? value : [];
        const next = current.includes(itemValue)
          ? current.filter((v) => v !== itemValue)
          : [...current, itemValue];
        setValue(next);
        return;
      }

      setValue(value === itemValue ? null : itemValue);
    },
    [type, value, setValue],
  );

  const isOpen = useCallback(
    (itemValue) => {
      if (type === 'multiple') {
        return Array.isArray(value) && value.includes(itemValue);
      }
      return value === itemValue;
    },
    [type, value],
  );

  const ctx = useMemo(() => ({ toggle, isOpen }), [toggle, isOpen]);

  return (
    <AccordionContext.Provider value={ctx}>
      <div className={cn('flex flex-col gap-2', className)}>{children}</div>
    </AccordionContext.Provider>
  );
}

export function AccordionItem({
  value,
  title,
  children,
  disabled = false,
  className,
}) {
  const { toggle, isOpen } = useAccordionContext();
  const open = isOpen(value);
  const panelId = useId();
  const headerId = useId();

  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-surface overflow-hidden',
        'transition-colors duration-250',
        open && 'border-border-hover bg-surface-elevated',
        className,
      )}
    >
      <h3 className="m-0">
        <button
          type="button"
          id={headerId}
          aria-expanded={open}
          aria-controls={panelId}
          disabled={disabled}
          onClick={() => toggle(value)}
          className={cn(
            'flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left',
            'text-sm font-medium text-text transition-colors',
            'hover:bg-surface-hover/60 disabled:opacity-50 disabled:pointer-events-none',
          )}
        >
          <span>{title}</span>
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="shrink-0 text-text-muted"
          >
            <ChevronDown className="w-4 h-4" aria-hidden="true" />
          </motion.span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={headerId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 text-body-md">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
