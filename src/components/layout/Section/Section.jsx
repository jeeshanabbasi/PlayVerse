import { cn } from '@utils/index';

const SPACING = {
  none: 'py-0',
  sm: 'py-8 md:py-10',
  md: 'py-12 md:py-16',
  lg: 'py-16 md:py-24',
};

export function Section({
  as: Component = 'section',
  title,
  description,
  action,
  spacing = 'md',
  contained = true,
  className,
  children,
  ...props
}) {
  return (
    <Component
      className={cn(SPACING[spacing] ?? SPACING.md, className)}
      {...props}
    >
      <div className={cn(contained && 'container-app')}>
        {(title || description || action) && (
          <div className="mb-6 md:mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-1.5 max-w-2xl">
              {title && (
                <h2 className="text-heading-lg text-text">{title}</h2>
              )}
              {description && (
                <p className="text-body-md">{description}</p>
              )}
            </div>
            {action && <div className="shrink-0">{action}</div>}
          </div>
        )}
        {children}
      </div>
    </Component>
  );
}
