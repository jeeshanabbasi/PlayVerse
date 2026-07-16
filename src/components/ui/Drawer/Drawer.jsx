import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn, fadeIn, SPRING } from '@utils/index';
import { useFocusTrap, useLockBodyScroll } from '@hooks/index';

const SIDE_STYLES = {
  left: 'inset-y-0 left-0 h-full w-full max-w-sm rounded-r-xl',
  right: 'inset-y-0 right-0 h-full w-full max-w-sm rounded-l-xl',
  bottom: 'inset-x-0 bottom-0 w-full max-h-[85vh] rounded-t-xl',
};

const SIDE_MOTION = {
  left: {
    initial: { x: '-100%' },
    animate: { x: 0 },
    exit: { x: '-100%' },
  },
  right: {
    initial: { x: '100%' },
    animate: { x: 0 },
    exit: { x: '100%' },
  },
  bottom: {
    initial: { y: '100%' },
    animate: { y: 0 },
    exit: { y: '100%' },
  },
};

export function Drawer({
  open = false,
  onClose,
  side = 'right',
  title,
  description,
  children,
  footer,
  closeOnOverlay = true,
  showClose = true,
  className,
  contentClassName,
}) {
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useRef(null);

  useFocusTrap(panelRef, open);
  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) return undefined;

    function onKeyDown(event) {
      if (event.key === 'Escape') onClose?.();
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (typeof document === 'undefined') return null;

  const motionProps = SIDE_MOTION[side] ?? SIDE_MOTION.right;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[400]">
          <motion.div
            className="absolute inset-0 bg-background/70 backdrop-blur-sm"
            {...fadeIn}
            onClick={closeOnOverlay ? onClose : undefined}
            aria-hidden="true"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            aria-describedby={description ? descriptionId : undefined}
            className={cn(
              'absolute z-10 flex flex-col glass-panel shadow-[var(--shadow-lift)] overflow-hidden',
              SIDE_STYLES[side] ?? SIDE_STYLES.right,
              className,
            )}
            initial={motionProps.initial}
            animate={motionProps.animate}
            exit={motionProps.exit}
            transition={SPRING}
          >
            {(title || showClose) && (
              <div className="flex items-start justify-between gap-4 px-5 pt-5 pb-3 shrink-0">
                <div className="min-w-0 space-y-1">
                  {title && (
                    <h2 id={titleId} className="text-heading-md text-text truncate">
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p id={descriptionId} className="text-body-md">
                      {description}
                    </p>
                  )}
                </div>

                {showClose && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="shrink-0 p-2 -mr-1 -mt-1 rounded-lg text-text-muted hover:text-text hover:bg-surface-hover transition-colors"
                    aria-label="Close drawer"
                  >
                    <X className="w-4 h-4" aria-hidden="true" />
                  </button>
                )}
              </div>
            )}

            <div className={cn('flex-1 overflow-y-auto px-5 py-3', contentClassName)}>
              {children}
            </div>

            {footer && (
              <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border shrink-0">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
