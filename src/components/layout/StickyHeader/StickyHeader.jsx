import { cn } from '@utils/index';

export function StickyHeader({
  as: Component = 'div',
  blur = true,
  bordered = true,
  offset = 'top-0',
  zIndex = 'z-30',
  className,
  children,
  ...props
}) {
  return (
    <Component
      className={cn(
        'sticky',
        offset,
        zIndex,
        blur && 'backdrop-blur-xl bg-background/75',
        !blur && 'bg-background',
        bordered && 'border-b border-border',
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
