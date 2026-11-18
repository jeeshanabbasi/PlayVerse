import { memo, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Command, Search, Shuffle, X } from 'lucide-react';

const shortcuts = [
  { keys: ['Ctrl', 'K'], label: 'Open command palette', icon: Command },
  { keys: ['/'], label: 'Focus games search', icon: Search },
  { keys: ['R'], label: 'Launch a random game', icon: Shuffle },
  { keys: ['Esc'], label: 'Close dialogs and overlays', icon: X },
];

function ShortcutGuideModalComponent({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[750] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
          onMouseDown={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.18 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="shortcut-guide-title"
            className="w-full max-w-md rounded-2xl border border-border bg-surface p-5 shadow-2xl"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-label text-primary">Shortcuts</p>
                <h2 id="shortcut-guide-title" className="mt-1 text-xl font-bold text-text">Keyboard guide</h2>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-text-secondary transition hover:border-primary/40 hover:text-primary"
                aria-label="Close keyboard guide"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-5 space-y-2">
              {shortcuts.map(({ keys, label, icon: Icon }) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background/30 px-3 py-3"
                >
                  <span className="flex items-center gap-2 text-sm text-text-secondary">
                    <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                    {label}
                  </span>

                  <span className="flex items-center gap-1">
                    {keys.map((key) => (
                      <kbd
                        key={key}
                        className="min-w-7 rounded-md border border-border bg-surface px-2 py-1 text-center text-xs font-semibold text-text"
                      >
                        {key}
                      </kbd>
                    ))}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export const ShortcutGuideModal = memo(ShortcutGuideModalComponent);
export default ShortcutGuideModal;
