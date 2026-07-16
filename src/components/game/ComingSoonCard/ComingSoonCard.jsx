import { Calendar, Bell } from 'lucide-react';
import { cn } from '@utils/index';

export function ComingSoonCard({
  title,
  image,
  date,
  onNotify,
  className,
}) {
  return (
    <article
      className={cn(
        'group relative overflow-hidden rounded-xl border border-border bg-surface',
        'shadow-[var(--shadow-card)] transition-all duration-300',
        'hover:border-border-hover hover:shadow-[var(--shadow-lift)]',
        className,
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-elevated">
        {image ? (
          <img
            src={image}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover opacity-55 grayscale-[30%] transition-all duration-500 group-hover:opacity-70 group-hover:grayscale-0"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-surface-elevated to-background" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

        {date && (
          <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-md border border-white/10 text-xs font-medium text-text">
            <Calendar className="w-3.5 h-3.5 text-accent" aria-hidden="true" />
            <time>{date}</time>
          </div>
        )}
      </div>

      <div className="p-4 space-y-3">
        {title && (
          <h3 className="text-heading-sm text-text line-clamp-2">{title}</h3>
        )}
        <button
          type="button"
          onClick={onNotify}
          className="inline-flex w-full items-center justify-center gap-2 h-10 px-4 rounded-xl text-sm font-medium text-text bg-surface-hover border border-border hover:border-border-hover hover:bg-surface-elevated transition-colors duration-200"
        >
          <Bell className="w-4 h-4 text-accent" aria-hidden="true" />
          Notify me
        </button>
      </div>
    </article>
  );
}
