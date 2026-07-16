import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@utils/index';

const POSITIONS = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

export function Tooltip({
  content,
  children,
  position = 'top',
  delay = 200,
  className,
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const tooltipId = useId();
  const showTimer = useRef(null);
  const hideTimer = useRef(null);

  function clearTimers() {
    if (showTimer.current) clearTimeout(showTimer.current);
    if (hideTimer.current) clearTimeout(hideTimer.current);
  }

  function show() {
    if (disabled || !content) return;
    clearTimers();
    showTimer.current = setTimeout(() => setOpen(true), delay);
  }

  function hide() {
    clearTimers();
    hideTimer.current = setTimeout(() => setOpen(false), 80);
  }

  useEffect(() => () => clearTimers(), []);

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      <span aria-describedby={open ? tooltipId : undefined} className="inline-flex">
        {children}
      </span>

      <AnimatePresence>
        {open && (
          <motion.span
            id={tooltipId}
            role="tooltip"
            className={cn(
              'absolute z-[300] pointer-events-none whitespace-nowrap',
              'px-2.5 py-1.5 text-xs font-medium text-text',
              'rounded-lg bg-surface-elevated border border-border shadow-[var(--shadow-soft)]',
              POSITIONS[position] ?? POSITIONS.top,
              className,
            )}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.15 }}
          >
            {content}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
