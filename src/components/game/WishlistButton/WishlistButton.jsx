import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { cn, SPRING } from '@utils/index';

const SIZES = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-11 h-11',
};

const ICON_SIZES = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

export function WishlistButton({
  active = false,
  onToggle,
  size = 'md',
  className,
  label = 'Wishlist',
  ...props
}) {
  return (
    <motion.button
      type="button"
      aria-label={active ? `Remove from ${label}` : `Add to ${label}`}
      aria-pressed={active}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onToggle?.(!active);
      }}
      whileTap={{ scale: 0.9 }}
      transition={SPRING}
      className={cn(
        'inline-flex items-center justify-center rounded-full',
        'bg-black/45 backdrop-blur-md border border-white/10',
        'text-text-secondary hover:text-text hover:border-white/20',
        'transition-colors duration-200',
        SIZES[size] ?? SIZES.md,
        active && 'text-error border-error/30 bg-error/15',
        className,
      )}
      {...props}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={active ? 'filled' : 'outline'}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.6, opacity: 0 }}
          transition={SPRING}
          className="inline-flex"
        >
          <Heart
            className={cn(ICON_SIZES[size] ?? ICON_SIZES.md, active && 'fill-current')}
            strokeWidth={active ? 0 : 1.75}
            aria-hidden="true"
          />
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
