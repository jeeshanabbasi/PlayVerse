import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn, slideInLeft } from '@utils/index';

export function Sidebar({
  open = true,
  onOpenChange,
  collapsible = true,
  width = 'w-64',
  collapsedWidth = 'w-[72px]',
  header,
  footer,
  className,
  children,
}) {
  return (
    <aside
      className={cn(
        'relative flex shrink-0 flex-col border-r border-border bg-surface/80 backdrop-blur-xl',
        'transition-[width] duration-300 ease-out',
        open ? width : collapsedWidth,
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2 px-3 py-3 border-b border-border">
        <AnimatePresence mode="wait" initial={false}>
          {open && header ? (
            <motion.div
              key="header"
              className="min-w-0 flex-1"
              {...slideInLeft}
            >
              {header}
            </motion.div>
          ) : (
            <span className="flex-1" />
          )}
        </AnimatePresence>

        {collapsible && (
          <button
            type="button"
            onClick={() => onOpenChange?.(!open)}
            className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-text-secondary hover:text-text hover:bg-surface-hover transition-colors"
            aria-label={open ? 'Collapse sidebar' : 'Expand sidebar'}
            aria-expanded={open}
          >
            {open ? (
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            ) : (
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            )}
          </button>
        )}
      </div>

      <div className={cn('flex-1 overflow-y-auto p-3', !open && 'px-2')}>
        {children}
      </div>

      {footer && (
        <div className={cn('border-t border-border p-3', !open && 'px-2')}>
          {footer}
        </div>
      )}
    </aside>
  );
}
