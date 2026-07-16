import { motion } from 'framer-motion';
import { Play, Loader2 } from 'lucide-react';
import { cn, SPRING } from '@utils/index';
import { useMagnetic } from '@hooks/index';

const SIZES = {
  sm: 'h-9 px-3.5 text-sm gap-1.5',
  md: 'h-11 px-5 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2.5',
};

const ICON_SIZES = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

export function PlayButton({
  children = 'Play',
  onClick,
  size = 'md',
  loading = false,
  magnetic = false,
  disabled = false,
  className,
  ...props
}) {
  const { ref, style, handlers } = useMagnetic({ strength: 0.22, range: 56 });
  const isDisabled = disabled || loading;

  return (
    <motion.button
      ref={magnetic ? ref : undefined}
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      style={magnetic ? style : undefined}
      {...(magnetic ? handlers : {})}
      whileHover={isDisabled ? undefined : { scale: 1.02 }}
      whileTap={isDisabled ? undefined : { scale: 0.97 }}
      transition={SPRING}
      className={cn(
        'inline-flex items-center justify-center font-semibold rounded-xl',
        'bg-primary text-white',
        'shadow-[var(--shadow-glow-primary)]',
        'hover:bg-primary-hover',
        'disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none',
        'transition-colors duration-200',
        SIZES[size] ?? SIZES.md,
        className,
      )}
      {...props}
    >
      {loading ? (
        <Loader2
          className={cn(ICON_SIZES[size] ?? ICON_SIZES.md, 'animate-spin')}
          aria-hidden="true"
        />
      ) : (
        <Play
          className={cn(ICON_SIZES[size] ?? ICON_SIZES.md, 'fill-current')}
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
    </motion.button>
  );
}
