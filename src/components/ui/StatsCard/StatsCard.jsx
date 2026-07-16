import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@utils/index';

const TREND_STYLES = {
  up: 'text-success',
  down: 'text-error',
  neutral: 'text-text-muted',
};

const TREND_ICONS = {
  up: TrendingUp,
  down: TrendingDown,
  neutral: Minus,
};

export function StatsCard({
  icon: Icon,
  label,
  value,
  trend = 'neutral',
  delta,
  className,
  ...props
}) {
  const TrendIcon = TREND_ICONS[trend] ?? Minus;

  return (
    <div
      className={cn(
        'card-base flex flex-col gap-3 shadow-[var(--shadow-soft)]',
        className,
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-label">{label}</p>
        {Icon && (
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 text-primary shrink-0">
            <Icon className="w-4 h-4" aria-hidden="true" />
          </span>
        )}
      </div>

      <p className="text-display-md text-text tabular-nums">{value}</p>

      {(delta || trend) && (
        <div className={cn('inline-flex items-center gap-1.5 text-sm', TREND_STYLES[trend])}>
          <TrendIcon className="w-4 h-4 shrink-0" aria-hidden="true" />
          {delta && <span>{delta}</span>}
        </div>
      )}
    </div>
  );
}
