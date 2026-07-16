import { Link } from 'react-router-dom';
import { cn } from '@utils/index';

export function BottomNav({
  items = [],
  activeId,
  onSelect,
  className,
}) {
  if (!items.length) return null;

  return (
    <nav
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 md:hidden',
        'border-t border-border bg-surface/90 backdrop-blur-xl',
        'pb-[env(safe-area-inset-bottom)]',
        className,
      )}
      aria-label="Mobile navigation"
    >
      <ul className="flex items-stretch justify-around px-1 py-1.5">
        {items.map((item) => {
          const {
            id,
            label,
            icon: Icon,
            href,
            to,
            onClick,
          } = item;
          const isActive = activeId === id;
          const path = to ?? href;

          const content = (
            <>
              {Icon && (
                <Icon
                  className={cn(
                    'w-5 h-5 transition-colors',
                    isActive ? 'text-primary' : 'text-text-muted',
                  )}
                  aria-hidden="true"
                />
              )}
              <span
                className={cn(
                  'text-[10px] font-medium tracking-wide',
                  isActive ? 'text-text' : 'text-text-muted',
                )}
              >
                {label}
              </span>
              {isActive && (
                <span
                  className="absolute top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                  aria-hidden="true"
                />
              )}
            </>
          );

          const sharedClass = cn(
            'relative flex flex-1 flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl',
            'transition-colors duration-200',
            isActive ? 'bg-primary-muted/40' : 'hover:bg-surface-hover/60',
          );

          function handleClick(event) {
            onClick?.(event);
            onSelect?.(id);
          }

          return (
            <li key={id} className="flex flex-1">
              {path ? (
                <Link
                  to={path}
                  onClick={handleClick}
                  className={sharedClass}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {content}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={handleClick}
                  className={sharedClass}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {content}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
