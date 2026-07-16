import { ChevronRight } from 'lucide-react';
import { cn } from '@utils/index';

export function Breadcrumb({ items = [], separator, className, ...props }) {
  const Separator = separator ?? (
    <ChevronRight className="w-3.5 h-3.5 text-text-muted shrink-0" aria-hidden="true" />
  );

  return (
    <nav aria-label="Breadcrumb" className={cn('w-full', className)} {...props}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5 min-w-0">
              {index > 0 && Separator}

              {isLast || !item.href ? (
                <span
                  className={cn(
                    'truncate',
                    isLast ? 'text-text font-medium' : 'text-text-secondary',
                  )}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <a
                  href={item.href}
                  className="truncate text-text-secondary hover:text-text transition-colors"
                >
                  {item.label}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
