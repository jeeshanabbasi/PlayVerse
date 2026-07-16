import { Star } from 'lucide-react';
import { cn } from '@utils/index';

export function GameRating({
  rating = 0,
  max = 5,
  showValue = true,
  size = 'sm',
  className,
}) {
  const value = Math.max(0, Math.min(Number(rating) || 0, max));
  const iconSize = size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5';
  const textSize = size === 'lg' ? 'text-sm' : 'text-xs';

  return (
    <div
      className={cn('inline-flex items-center gap-1.5', className)}
      aria-label={`Rating ${value.toFixed(1)} out of ${max}`}
    >
      <div className="inline-flex items-center gap-0.5" aria-hidden="true">
        {Array.from({ length: max }, (_, index) => {
          const filled = value >= index + 1;
          const partial = !filled && value > index;
          return (
            <span key={index} className="relative inline-flex">
              <Star
                className={cn(iconSize, 'text-text-muted/40')}
                strokeWidth={1.5}
              />
              {(filled || partial) && (
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={partial ? { width: `${(value - index) * 100}%` } : undefined}
                >
                  <Star
                    className={cn(iconSize, 'fill-warning text-warning')}
                    strokeWidth={1.5}
                  />
                </span>
              )}
            </span>
          );
        })}
      </div>
      {showValue && (
        <span className={cn('font-semibold tabular-nums text-text', textSize)}>
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
}
