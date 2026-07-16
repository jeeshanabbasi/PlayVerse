import { cn } from '@utils/index';

const SIZES = {
  default: '',
  narrow: 'max-w-3xl',
  wide: 'max-w-[1600px] 2xl:max-w-[1760px]',
};

export function Container({
  as: Component = 'div',
  size = 'default',
  className,
  children,
  ...props
}) {
  return (
    <Component
      className={cn('container-app', SIZES[size], className)}
      {...props}
    >
      {children}
    </Component>
  );
}
