import { motion } from 'framer-motion';
import { cn } from '@utils/index';

const sizes = {
  sm: 'h-5 w-5 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-[3px]',
};

export function Loading({ size = 'md', label = 'Loading', className, fullScreen = false }) {
  const spinner = (
    <div className={cn('flex flex-col items-center gap-3', className)} role="status" aria-label={label}>
      <motion.div
        className={cn(
          'rounded-full border-border border-t-primary',
          sizes[size],
        )}
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        aria-hidden="true"
      />
      {label && (
        <span className="text-body-sm text-text-muted">{label}</span>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return spinner;
}

export function LoadingOverlay({ label = 'Loading' }) {
  return <Loading size="lg" label={label} fullScreen />;
}
