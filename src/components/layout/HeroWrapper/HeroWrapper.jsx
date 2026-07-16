import { cn } from '@utils/index';

export function HeroWrapper({
  as: Component = 'section',
  minHeight = 'min-h-[70vh] md:min-h-[80vh]',
  overlay = true,
  overlayClassName,
  backgroundImage,
  background,
  className,
  style,
  children,
  ...props
}) {
  return (
    <Component
      className={cn(
        'relative w-full overflow-hidden',
        minHeight,
        className,
      )}
      style={
        backgroundImage
          ? {
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              ...style,
            }
          : style
      }
      {...props}
    >
      {background}
      {overlay && (
        <div
          className={cn(
            'absolute inset-0 pointer-events-none',
            'bg-gradient-to-t from-background via-background/50 to-background/20',
            overlayClassName,
          )}
          aria-hidden="true"
        />
      )}
      <div className="relative z-10 h-full min-h-[inherit]">{children}</div>
    </Component>
  );
}
