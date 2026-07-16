import { cn } from '@utils/index';

const BAR_VARIANTS = {
  primary: 'bg-primary shadow-[var(--shadow-glow-primary)]',
  accent: 'bg-accent shadow-[var(--shadow-glow-accent)]',
  success: 'bg-success',
};

export function ProgressBar({
  value = 0,
  max = 100,
  variant = 'primary',
  label,
  showValue = false,
  className,
  ...props
}) {
  const clamped = Math.min(Math.max(value, 0), max);
  const percent = max === 0 ? 0 : Math.round((clamped / max) * 100);

  return (
    <div className={cn('w-full space-y-2', className)} {...props}>
      {(label || showValue) && (
        <div className="flex items-center justify-between gap-2">
          {label && <span className="text-sm font-medium text-text">{label}</span>}
          {showValue && (
            <span className="text-xs text-text-muted tabular-nums">{percent}%</span>
          )}
        </div>
      )}

      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || 'Progress'}
        className="h-2 w-full overflow-hidden rounded-full bg-surface-elevated border border-border"
      >
        <div
          className={cn(
            'h-full rounded-full transition-[width] duration-500 ease-out',
            BAR_VARIANTS[variant] ?? BAR_VARIANTS.primary,
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export function CircularProgress({
  value = 0,
  max = 100,
  size = 48,
  stroke = 4,
  variant = 'primary',
  label,
  showValue = true,
  className,
  ...props
}) {
  const clamped = Math.min(Math.max(value, 0), max);
  const percent = max === 0 ? 0 : (clamped / max) * 100;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  const strokeColor = {
    primary: 'stroke-primary',
    accent: 'stroke-accent',
    success: 'stroke-success',
  }[variant] ?? 'stroke-primary';

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label || 'Progress'}
      {...props}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className="stroke-border"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className={cn('transition-[stroke-dashoffset] duration-500 ease-out', strokeColor)}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>

      {showValue && (
        <span className="absolute text-xs font-semibold text-text tabular-nums">
          {Math.round(percent)}%
        </span>
      )}
    </div>
  );
}
