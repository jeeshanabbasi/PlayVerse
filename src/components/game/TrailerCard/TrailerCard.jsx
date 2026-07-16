import { Play } from 'lucide-react';
import { cn } from '@utils/index';

function formatDuration(seconds) {
  if (seconds == null) return null;
  const total = Math.max(0, Math.floor(Number(seconds)));
  if (!Number.isFinite(total)) return String(seconds);
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

export function TrailerCard({
  title,
  thumbnail,
  duration,
  onPlay,
  className,
}) {
  const durationLabel = formatDuration(duration);

  return (
    <button
      type="button"
      onClick={onPlay}
      className={cn(
        'group relative block w-full overflow-hidden rounded-xl border border-border bg-surface text-left',
        'shadow-[var(--shadow-card)] transition-all duration-300',
        'hover:border-primary/35 hover:shadow-[var(--shadow-glow-primary)]',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        className,
      )}
    >
      <div className="relative aspect-video overflow-hidden bg-surface-elevated">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-surface-elevated to-background" />
        )}

        <div className="absolute inset-0 bg-black/25 transition-colors duration-300 group-hover:bg-black/40" />

        <span className="absolute inset-0 flex items-center justify-center">
          <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/90 text-white border border-white/15 shadow-[var(--shadow-glow-primary)] backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
            <Play className="w-6 h-6 fill-current ml-0.5" aria-hidden="true" />
          </span>
        </span>

        {durationLabel && (
          <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md text-[11px] font-semibold tabular-nums text-text bg-black/65 backdrop-blur-md border border-white/10">
            {durationLabel}
          </span>
        )}
      </div>

      {title && (
        <div className="p-3.5">
          <h3 className="text-heading-sm text-text line-clamp-1">{title}</h3>
        </div>
      )}
    </button>
  );
}
