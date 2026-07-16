import { cn } from '@utils/index';

export function GameBanner({
  title,
  subtitle,
  image,
  actions,
  children,
  className,
  minHeight = 'min-h-[280px] md:min-h-[360px] lg:min-h-[420px]',
}) {
  return (
    <section
      className={cn(
        'relative w-full overflow-hidden rounded-xl border border-border',
        'bg-surface shadow-[var(--shadow-card)]',
        minHeight,
        className,
      )}
    >
      {image && (
        <img
          src={image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      <div
        className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-background/10"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent"
        aria-hidden="true"
      />

      <div className="relative z-10 flex h-full min-h-[inherit] flex-col justify-end p-6 md:p-8 lg:p-10">
        <div className="max-w-2xl space-y-3">
          {title && (
            <h2 className="text-display-md text-text drop-shadow-sm">{title}</h2>
          )}
          {subtitle && (
            <p className="text-body-lg max-w-xl">{subtitle}</p>
          )}
          {(actions || children) && (
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {actions}
              {children}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
