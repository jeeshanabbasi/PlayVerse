import { cn } from '@utils/index';

const VARIANTS = {
  primary: 'bg-primary/15 text-primary border-primary/20',
  accent: 'bg-accent/15 text-accent border-accent/20',
  success: 'bg-success/15 text-success border-success/20',
  warning: 'bg-warning/15 text-warning border-warning/20',
  danger: 'bg-error/15 text-error border-error/20',
  muted: 'bg-surface-elevated text-text-secondary border-border',
  outline: 'bg-transparent text-text-secondary border-border',
};

const DOT_COLORS = {
  primary: 'bg-primary',
  accent: 'bg-accent',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-error',
  muted: 'bg-text-muted',
  outline: 'bg-text-muted',
};

const SIZES = {
  sm: 'px-2 py-0.5 text-[10px] gap-1',
  md: 'px-2.5 py-1 text-xs gap-1.5',
};

export function Badge({
  children,
  variant = 'primary',
  size = 'md',
  dot = false,
  className,
  ...props
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border whitespace-nowrap',
        VARIANTS[variant] ?? VARIANTS.primary,
        SIZES[size] ?? SIZES.md,
        className,
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn('w-1.5 h-1.5 rounded-full shrink-0', DOT_COLORS[variant] ?? DOT_COLORS.primary)}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
