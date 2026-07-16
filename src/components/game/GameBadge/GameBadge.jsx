import { cn } from '@utils/index';

const VARIANTS = {
  new: {
    label: 'New',
    className: 'bg-accent-muted text-accent border-accent/25',
  },
  hot: {
    label: 'Hot',
    className: 'bg-error/15 text-error border-error/25',
  },
  exclusive: {
    label: 'Exclusive',
    className: 'bg-primary-muted text-primary border-primary/30',
  },
  updated: {
    label: 'Updated',
    className: 'bg-info/15 text-info border-info/25',
  },
  beta: {
    label: 'Beta',
    className: 'bg-warning/15 text-warning border-warning/25',
  },
};

export function GameBadge({
  variant = 'new',
  label,
  className,
  ...props
}) {
  const config = VARIANTS[variant] ?? VARIANTS.new;

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-md',
        'text-[10px] font-semibold uppercase tracking-widest',
        'border backdrop-blur-sm',
        config.className,
        className,
      )}
      {...props}
    >
      {label ?? config.label}
    </span>
  );
}
