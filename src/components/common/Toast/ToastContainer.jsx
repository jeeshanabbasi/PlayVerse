import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useToast } from '@context/ToastContext';
import { TOAST_TYPES } from '@constants/index';
import { cn } from '@utils/index';

const ICON_MAP = {
  [TOAST_TYPES.SUCCESS]: CheckCircle,
  [TOAST_TYPES.ERROR]: AlertCircle,
  [TOAST_TYPES.WARNING]: AlertTriangle,
  [TOAST_TYPES.INFO]: Info,
};

const STYLE_MAP = {
  [TOAST_TYPES.SUCCESS]: 'border-success/20 bg-success/5',
  [TOAST_TYPES.ERROR]: 'border-error/20 bg-error/5',
  [TOAST_TYPES.WARNING]: 'border-warning/20 bg-warning/5',
  [TOAST_TYPES.INFO]: 'border-info/20 bg-info/5',
};

const ICON_COLOR_MAP = {
  [TOAST_TYPES.SUCCESS]: 'text-success',
  [TOAST_TYPES.ERROR]: 'text-error',
  [TOAST_TYPES.WARNING]: 'text-warning',
  [TOAST_TYPES.INFO]: 'text-info',
};

function ToastItem({ toast, onDismiss }) {
  const Icon = ICON_MAP[toast.type] ?? Info;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 48, scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={cn(
        'flex items-start gap-3 w-full max-w-sm p-4 rounded-xl border backdrop-blur-xl shadow-card',
        'bg-surface/90',
        STYLE_MAP[toast.type],
      )}
      role="alert"
      aria-live="polite"
    >
      <Icon className={cn('w-5 h-5 shrink-0 mt-0.5', ICON_COLOR_MAP[toast.type])} aria-hidden="true" />

      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className="text-sm font-medium text-text">{toast.title}</p>
        )}
        {toast.message && (
          <p className="text-xs text-text-secondary mt-0.5">{toast.message}</p>
        )}
      </div>

      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 p-1 rounded-lg text-text-muted hover:text-text hover:bg-surface-hover transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

export function ToastContainer() {
  const { toasts, dismiss } = useToast();

  return (
    <div
      className="fixed bottom-4 right-4 z-[500] flex flex-col gap-2 pointer-events-none"
      aria-label="Notifications"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} onDismiss={dismiss} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
