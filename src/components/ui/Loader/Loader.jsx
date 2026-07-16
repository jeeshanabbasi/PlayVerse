import { motion } from 'framer-motion';
import { cn } from '@utils/index';

const SIZES = {
  sm: 'h-5 w-5',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16',
};

export function Loader({
  size = 'md',
  label = 'Loading',
  showLabel = false,
  className,
  ...props
}) {
  return (
    <div
      className={cn('inline-flex flex-col items-center gap-3', className)}
      role="status"
      aria-label={label}
      {...props}
    >
      <div className={cn('relative', SIZES[size] ?? SIZES.md)} aria-hidden="true">
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-border"
        />
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary border-r-accent"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
        />
        <motion.span
          className="absolute inset-[22%] rounded-full bg-primary/20"
          animate={{ opacity: [0.35, 0.85, 0.35], scale: [0.92, 1, 0.92] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {showLabel && (
        <span className="text-body-sm">{label}</span>
      )}
    </div>
  );
}

export function PageLoader({
  label = 'Loading',
  size = 'lg',
  className,
  ...props
}) {
  return (
    <div
      className={cn(
        'flex min-h-[16rem] w-full items-center justify-center',
        'rounded-xl bg-surface/40 border border-border backdrop-blur-sm',
        className,
      )}
      {...props}
    >
      <Loader size={size} label={label} showLabel />
    </div>
  );
}
