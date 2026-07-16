import { memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@utils/index';

export const GameLoadingScreen = memo(function GameLoadingScreen({
  title = 'Loading',
  progress = 0,
  visible = true,
  className,
}) {
  if (!visible) return null;

  return (
    <motion.div
      className={cn(
        'absolute inset-0 z-20 flex flex-col items-center justify-center gap-5',
        'bg-background/90 backdrop-blur-md',
        className,
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="status"
      aria-live="polite"
      aria-label="Loading game engine"
    >
      <div className="h-14 w-14 rounded-xl border border-primary/30 bg-primary/15 flex items-center justify-center shadow-[var(--shadow-glow-primary)]">
        <motion.span
          className="h-6 w-6 rounded-full border-2 border-border border-t-primary"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
          aria-hidden="true"
        />
      </div>
      <div className="text-center space-y-2 px-4">
        <p className="text-heading-sm text-text">{title}</p>
        <p className="text-body-sm">Booting Phaser runtime…</p>
      </div>
      <div className="w-48 h-1.5 rounded-full bg-surface-elevated overflow-hidden border border-border">
        <motion.div
          className="h-full rounded-full bg-primary origin-left"
          initial={false}
          animate={{ scaleX: Math.min(1, Math.max(0.08, progress / 100)) }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  );
});
