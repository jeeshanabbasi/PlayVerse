import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@utils/index';

function range(start, end) {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

function getPageItems(page, totalPages) {
  if (totalPages <= 7) return range(1, totalPages);

  if (page <= 3) return [...range(1, 4), 'ellipsis', totalPages];
  if (page >= totalPages - 2) {
    return [1, 'ellipsis', ...range(totalPages - 3, totalPages)];
  }

  return [1, 'ellipsis', page - 1, page, page + 1, 'ellipsis', totalPages];
}

export function Pagination({
  page = 1,
  totalPages = 1,
  onChange,
  className,
  ...props
}) {
  const safeTotal = Math.max(1, totalPages);
  const current = Math.min(Math.max(1, page), safeTotal);
  const items = getPageItems(current, safeTotal);

  function go(next) {
    if (next < 1 || next > safeTotal || next === current) return;
    onChange?.(next);
  }

  return (
    <nav
      aria-label="Pagination"
      className={cn('flex items-center justify-center gap-1', className)}
      {...props}
    >
      <button
        type="button"
        onClick={() => go(current - 1)}
        disabled={current <= 1}
        className={cn(
          'inline-flex items-center justify-center w-9 h-9 rounded-lg border border-border',
          'text-text-secondary hover:text-text hover:bg-surface-hover transition-colors',
          'disabled:opacity-40 disabled:pointer-events-none',
        )}
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" aria-hidden="true" />
      </button>

      {items.map((item, index) =>
        item === 'ellipsis' ? (
          <span
            key={`ellipsis-${index}`}
            className="w-9 h-9 inline-flex items-center justify-center text-text-muted text-sm"
            aria-hidden="true"
          >
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => go(item)}
            aria-label={`Page ${item}`}
            aria-current={item === current ? 'page' : undefined}
            className={cn(
              'inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm font-medium transition-all duration-250',
              item === current
                ? 'bg-primary text-white shadow-[var(--shadow-glow-primary)]'
                : 'border border-border text-text-secondary hover:text-text hover:bg-surface-hover',
            )}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => go(current + 1)}
        disabled={current >= safeTotal}
        className={cn(
          'inline-flex items-center justify-center w-9 h-9 rounded-lg border border-border',
          'text-text-secondary hover:text-text hover:bg-surface-hover transition-colors',
          'disabled:opacity-40 disabled:pointer-events-none',
        )}
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4" aria-hidden="true" />
      </button>
    </nav>
  );
}
