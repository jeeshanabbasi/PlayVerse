import { X } from 'lucide-react';
import { cn } from '@utils/index';

const CHIP_VARIANTS = {
  default: 'bg-surface border-border text-text-secondary hover:border-border-hover hover:text-text',
  primary: 'bg-primary/15 border-primary/25 text-primary',
  accent: 'bg-accent/15 border-accent/25 text-accent',
};

const TAG_VARIANTS = {
  primary: 'bg-primary/15 text-primary border-primary/20',
  accent: 'bg-accent/15 text-accent border-accent/20',
  success: 'bg-success/15 text-success border-success/20',
  warning: 'bg-warning/15 text-warning border-warning/20',
  danger: 'bg-error/15 text-error border-error/20',
  muted: 'bg-surface-elevated text-text-secondary border-border',
};

export function Chip({
  children,
  selected = false,
  onSelect,
  onRemove,
  disabled = false,
  variant = 'default',
  className,
  ...props
}) {
  const interactive = typeof onSelect === 'function';
  const Component = interactive ? 'button' : 'span';

  return (
    <Component
      type={interactive ? 'button' : undefined}
      aria-pressed={interactive ? selected : undefined}
      disabled={interactive ? disabled : undefined}
      onClick={interactive ? onSelect : undefined}
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full border',
        'transition-all duration-250',
        CHIP_VARIANTS[variant] ?? CHIP_VARIANTS.default,
        selected && 'bg-primary/20 border-primary/40 text-text shadow-[var(--shadow-glow)]',
        interactive && 'cursor-pointer active:scale-[0.98]',
        disabled && 'opacity-50 pointer-events-none',
        className,
      )}
      {...props}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onRemove(event);
          }}
          className="p-0.5 -mr-1 rounded-full text-current opacity-70 hover:opacity-100 hover:bg-white/10 transition-opacity"
          aria-label="Remove"
        >
          <X className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      )}
    </Component>
  );
}

export function Tag({ children, variant = 'muted', className, ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md border',
        TAG_VARIANTS[variant] ?? TAG_VARIANTS.muted,
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
