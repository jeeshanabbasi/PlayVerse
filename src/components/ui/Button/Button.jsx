import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn, SPRING_SOFT } from '@utils/index';
import { useMagnetic, usePrefersReducedMotion } from '@hooks/index';

const variants = {
  primary:
    'bg-primary text-white hover:bg-primary-hover hover:shadow-[var(--shadow-glow-primary)]',
  secondary:
    'bg-surface-elevated text-text border border-border hover:bg-surface-hover hover:border-border-hover',
  ghost: 'bg-transparent text-text-secondary hover:text-text hover:bg-surface-hover',
  danger: 'bg-error text-white hover:bg-error/90 shadow-[0_0_24px_rgba(239,68,68,0.2)]',
  outline:
    'bg-transparent text-text border border-border hover:border-primary hover:text-primary hover:bg-primary-muted',
};

const sizes = {
  sm: 'h-9 px-3.5 text-sm gap-1.5',
  md: 'h-11 px-5 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2.5',
};

const iconSizes = {
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
};

const iconOnlySizes = {
  sm: 'h-9 w-9',
  md: 'h-11 w-11',
  lg: 'h-12 w-12',
};

export const Button = forwardRef(function Button(
  {
    variant = 'primary',
    size = 'md',
    iconLeft: IconLeft,
    iconRight: IconRight,
    loading = false,
    magnetic = false,
    disabled = false,
    className,
    children,
    type = 'button',
    ...props
  },
  ref,
) {
  const reduced = usePrefersReducedMotion();
  const magneticFx = useMagnetic({ strength: 0.22, range: 56 });
  const isDisabled = disabled || loading;

  const classes = cn(
    'relative inline-flex items-center justify-center font-medium rounded-xl',
    'transition-colors duration-200 select-none',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
    'disabled:opacity-50 disabled:pointer-events-none',
    variants[variant],
    sizes[size],
    className,
  );

  const content = (
    <>
      {loading && (
        <Loader2
          className={cn(iconSizes[size], 'absolute animate-spin')}
          aria-hidden="true"
        />
      )}
      <span className={cn('inline-flex items-center justify-center gap-[inherit]', loading && 'invisible')}>
        {IconLeft && <IconLeft className={iconSizes[size]} aria-hidden="true" />}
        {children}
        {IconRight && <IconRight className={iconSizes[size]} aria-hidden="true" />}
      </span>
    </>
  );

  if (magnetic && !isDisabled) {
    return (
      <motion.div
        ref={magneticFx.ref}
        style={magneticFx.style}
        {...magneticFx.handlers}
        className="inline-flex"
      >
        <motion.button
          ref={ref}
          type={type}
          disabled={isDisabled}
          className={classes}
          whileHover={reduced ? undefined : { scale: 1.02 }}
          whileTap={reduced ? undefined : { scale: 0.98 }}
          transition={SPRING_SOFT}
          aria-busy={loading || undefined}
          {...props}
        >
          {content}
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={isDisabled}
      className={classes}
      whileHover={reduced || isDisabled ? undefined : { scale: 1.02 }}
      whileTap={reduced || isDisabled ? undefined : { scale: 0.98 }}
      transition={SPRING_SOFT}
      aria-busy={loading || undefined}
      {...props}
    >
      {content}
    </motion.button>
  );
});

export const IconButton = forwardRef(function IconButton(
  {
    variant = 'ghost',
    size = 'md',
    icon: Icon,
    loading = false,
    magnetic = false,
    disabled = false,
    className,
    'aria-label': ariaLabel,
    type = 'button',
    children,
    ...props
  },
  ref,
) {
  const reduced = usePrefersReducedMotion();
  const magneticFx = useMagnetic({ strength: 0.22, range: 48 });
  const isDisabled = disabled || loading;

  const classes = cn(
    'relative inline-flex items-center justify-center rounded-xl',
    'transition-colors duration-200 select-none',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
    'disabled:opacity-50 disabled:pointer-events-none',
    variants[variant],
    iconOnlySizes[size],
    className,
  );

  const content = loading ? (
    <Loader2 className={cn(iconSizes[size], 'animate-spin')} aria-hidden="true" />
  ) : (
    <>
      {Icon && <Icon className={iconSizes[size]} aria-hidden="true" />}
      {children}
    </>
  );

  if (magnetic && !isDisabled) {
    return (
      <motion.div
        ref={magneticFx.ref}
        style={magneticFx.style}
        {...magneticFx.handlers}
        className="inline-flex"
      >
        <motion.button
          ref={ref}
          type={type}
          disabled={isDisabled}
          className={classes}
          whileHover={reduced ? undefined : { scale: 1.02 }}
          whileTap={reduced ? undefined : { scale: 0.98 }}
          transition={SPRING_SOFT}
          aria-label={ariaLabel}
          aria-busy={loading || undefined}
          {...props}
        >
          {content}
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={isDisabled}
      className={classes}
      whileHover={reduced || isDisabled ? undefined : { scale: 1.02 }}
      whileTap={reduced || isDisabled ? undefined : { scale: 0.98 }}
      transition={SPRING_SOFT}
      aria-label={ariaLabel}
      aria-busy={loading || undefined}
      {...props}
    >
      {content}
    </motion.button>
  );
});
