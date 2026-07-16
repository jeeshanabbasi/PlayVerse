import { createContext, useContext, useCallback, useState, useMemo } from 'react';
import { TOAST_DURATION, TOAST_TYPES } from '@constants/index';
import { generateId } from '@utils/index';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ title, message, type = TOAST_TYPES.INFO, duration = TOAST_DURATION }) => {
      const id = generateId('toast');
      setToasts((prev) => [...prev, { id, title, message, type, duration }]);

      if (duration > 0) {
        setTimeout(() => dismiss(id), duration);
      }

      return id;
    },
    [dismiss],
  );

  const success = useCallback(
    (title, message) => toast({ title, message, type: TOAST_TYPES.SUCCESS }),
    [toast],
  );

  const error = useCallback(
    (title, message) => toast({ title, message, type: TOAST_TYPES.ERROR }),
    [toast],
  );

  const warning = useCallback(
    (title, message) => toast({ title, message, type: TOAST_TYPES.WARNING }),
    [toast],
  );

  const info = useCallback(
    (title, message) => toast({ title, message, type: TOAST_TYPES.INFO }),
    [toast],
  );

  const value = useMemo(
    () => ({ toasts, toast, dismiss, success, error, warning, info }),
    [toasts, toast, dismiss, success, error, warning, info],
  );

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
