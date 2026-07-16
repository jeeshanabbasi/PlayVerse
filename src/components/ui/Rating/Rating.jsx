import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@utils/index';

function StarIcon({ filled, half, size }) {
  if (half) {
    return (
      <span className="relative inline-flex" aria-hidden="true">
        <Star className={cn(size, 'text-border')} />
        <span className="absolute inset-0 overflow-hidden w-1/2">
          <Star className={cn(size, 'fill-warning text-warning')} />
        </span>
      </span>
    );
  }

  return (
    <Star
      className={cn(
        size,
        filled ? 'fill-warning text-warning' : 'text-border',
      )}
      aria-hidden="true"
    />
  );
}

export function Rating({
  value = 0,
  max = 5,
  onChange,
  readOnly = false,
  allowHalf = false,
  size = 'md',
  className,
  label = 'Rating',
  ...props
}) {
  const [hover, setHover] = useState(null);
  const interactive = !readOnly && typeof onChange === 'function';
  const display = hover ?? value;

  const iconSize = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }[size] ?? 'w-5 h-5';

  function resolveValue(index, event) {
    if (!allowHalf) return index + 1;
    const rect = event.currentTarget.getBoundingClientRect();
    const isHalf = event.clientX - rect.left < rect.width / 2;
    return isHalf ? index + 0.5 : index + 1;
  }

  return (
    <div
      className={cn('inline-flex items-center gap-0.5', className)}
      role={interactive ? 'slider' : 'img'}
      aria-label={`${label}: ${value} out of ${max}`}
      aria-valuemin={interactive ? 0 : undefined}
      aria-valuemax={interactive ? max : undefined}
      aria-valuenow={interactive ? value : undefined}
      aria-valuetext={`${value} out of ${max}`}
      aria-readonly={readOnly || undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={
        interactive
          ? (event) => {
              const step = allowHalf ? 0.5 : 1;
              if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
                event.preventDefault();
                onChange(Math.min(max, value + step));
              } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
                event.preventDefault();
                onChange(Math.max(0, value - step));
              } else if (event.key === 'Home') {
                event.preventDefault();
                onChange(0);
              } else if (event.key === 'End') {
                event.preventDefault();
                onChange(max);
              }
            }
          : undefined
      }
      onMouseLeave={() => setHover(null)}
      {...props}
    >
      {Array.from({ length: max }, (_, index) => {
        const starValue = index + 1;
        const filled = display >= starValue;
        const half = allowHalf && !filled && display >= starValue - 0.5;

        if (!interactive) {
          return (
            <span key={index} className="p-0.5">
              <StarIcon filled={filled} half={half} size={iconSize} />
            </span>
          );
        }

        return (
          <button
            key={index}
            type="button"
            className="p-0.5 rounded-md text-text-muted hover:scale-110 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            onMouseMove={(event) => setHover(resolveValue(index, event))}
            onClick={(event) => onChange(resolveValue(index, event))}
            aria-label={`${starValue} star${starValue === 1 ? '' : 's'}`}
          >
            <StarIcon filled={filled} half={half} size={iconSize} />
          </button>
        );
      })}
    </div>
  );
}
