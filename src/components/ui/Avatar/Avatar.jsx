import { Children, cloneElement, isValidElement } from 'react';
import { cn } from '@utils/index';

const SIZES = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

const STATUS_RING = {
  online: 'ring-2 ring-success ring-offset-2 ring-offset-background',
  offline: 'ring-2 ring-text-muted ring-offset-2 ring-offset-background',
  busy: 'ring-2 ring-error ring-offset-2 ring-offset-background',
  away: 'ring-2 ring-warning ring-offset-2 ring-offset-background',
};

function getInitials(name = '') {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function Avatar({
  src,
  alt = '',
  name,
  size = 'md',
  status,
  className,
  ...props
}) {
  const initials = getInitials(name || alt);

  return (
    <span
      className={cn(
        'relative inline-flex items-center justify-center shrink-0 overflow-hidden',
        'rounded-full bg-primary/15 text-primary font-semibold border border-border',
        SIZES[size] ?? SIZES.md,
        status && STATUS_RING[status],
        className,
      )}
      role="img"
      aria-label={alt || name || 'Avatar'}
      {...props}
    >
      {src ? (
        <img src={src} alt={alt || name || ''} className="w-full h-full object-cover" />
      ) : (
        <span aria-hidden="true">{initials || '?'}</span>
      )}
    </span>
  );
}

export function AvatarGroup({ children, max = 4, size = 'md', className }) {
  const items = Children.toArray(children).filter(isValidElement);
  const visible = items.slice(0, max);
  const overflow = items.length - visible.length;

  return (
    <div className={cn('flex items-center -space-x-2', className)} role="group">
      {visible.map((child, index) =>
        cloneElement(child, {
          size: child.props.size ?? size,
          className: cn(
            'border-2 border-background',
            child.props.className,
          ),
          style: { zIndex: visible.length - index, ...child.props.style },
        }),
      )}
      {overflow > 0 && (
        <span
          className={cn(
            'relative inline-flex items-center justify-center shrink-0',
            'rounded-full bg-surface-elevated text-text-secondary font-semibold',
            'border-2 border-background z-0',
            SIZES[size] ?? SIZES.md,
          )}
          aria-label={`${overflow} more`}
        >
          +{overflow}
        </span>
      )}
    </div>
  );
}
