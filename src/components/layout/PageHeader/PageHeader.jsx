import { cn } from '@utils/index';

export function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  actions,
  className,
  children,
}) {
  return (
    <header
      className={cn(
        'flex flex-col gap-4 md:flex-row md:items-end md:justify-between',
        'pb-6 md:pb-8 border-b border-border',
        className,
      )}
    >
      <div className="space-y-2 min-w-0">
        {breadcrumbs && (
          <div className="text-body-sm flex flex-wrap items-center gap-1.5">
            {breadcrumbs}
          </div>
        )}
        {title && (
          <h1 className="text-display-md text-text truncate">{title}</h1>
        )}
        {subtitle && (
          <p className="text-body-lg max-w-2xl">{subtitle}</p>
        )}
        {children}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {actions}
        </div>
      )}
    </header>
  );
}
