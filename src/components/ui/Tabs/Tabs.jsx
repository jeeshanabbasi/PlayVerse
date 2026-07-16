import {
  createContext,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState,
} from 'react';
import { cn } from '@utils/index';

const TabsContext = createContext(null);

function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('Tabs compound components must be used within Tabs');
  return ctx;
}

export function Tabs({
  value: controlledValue,
  defaultValue,
  onChange,
  children,
  className,
}) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolled;
  const baseId = useId();

  const setValue = useCallback(
    (next) => {
      if (!isControlled) setUncontrolled(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  const ctx = useMemo(
    () => ({ value, setValue, baseId }),
    [value, setValue, baseId],
  );

  return (
    <TabsContext.Provider value={ctx}>
      <div className={cn('w-full', className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabList({ children, className, ...props }) {
  const { setValue } = useTabsContext();

  function onKeyDown(event) {
    const tabs = [...event.currentTarget.querySelectorAll('[role="tab"]:not([disabled])')];
    const index = tabs.indexOf(document.activeElement);
    if (index < 0) return;

    let next = index;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      next = (index + 1) % tabs.length;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      next = (index - 1 + tabs.length) % tabs.length;
    } else if (event.key === 'Home') {
      event.preventDefault();
      next = 0;
    } else if (event.key === 'End') {
      event.preventDefault();
      next = tabs.length - 1;
    } else {
      return;
    }

    tabs[next]?.focus();
    const id = tabs[next]?.getAttribute('data-value');
    if (id != null) setValue(id);
  }

  return (
    <div
      role="tablist"
      className={cn(
        'flex items-center gap-1 p-1 rounded-xl bg-surface border border-border',
        className,
      )}
      onKeyDown={onKeyDown}
      {...props}
    >
      {children}
    </div>
  );
}

export function Tab({ value, children, disabled = false, className, ...props }) {
  const { value: active, setValue, baseId } = useTabsContext();
  const selected = active === value;

  return (
    <button
      type="button"
      role="tab"
      id={`${baseId}-tab-${value}`}
      data-value={value}
      aria-selected={selected}
      aria-controls={`${baseId}-panel-${value}`}
      tabIndex={selected ? 0 : -1}
      disabled={disabled}
      onClick={() => setValue(value)}
      className={cn(
        'relative flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-250',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        selected
          ? 'bg-primary/15 text-text shadow-[var(--shadow-glow)]'
          : 'text-text-secondary hover:text-text hover:bg-surface-hover',
        disabled && 'opacity-50 pointer-events-none',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function TabPanel({ value, children, className, ...props }) {
  const { value: active, baseId } = useTabsContext();
  if (active !== value) return null;

  return (
    <div
      role="tabpanel"
      id={`${baseId}-panel-${value}`}
      aria-labelledby={`${baseId}-tab-${value}`}
      tabIndex={0}
      className={cn('pt-4 outline-none', className)}
      {...props}
    >
      {children}
    </div>
  );
}
