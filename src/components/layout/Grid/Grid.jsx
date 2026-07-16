import { cn } from '@utils/index';

const COL_MAP = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
};

const SM_MAP = {
  1: 'sm:grid-cols-1',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-3',
  4: 'sm:grid-cols-4',
  5: 'sm:grid-cols-5',
  6: 'sm:grid-cols-6',
};

const MD_MAP = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
  5: 'md:grid-cols-5',
  6: 'md:grid-cols-6',
};

const LG_MAP = {
  1: 'lg:grid-cols-1',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
  5: 'lg:grid-cols-5',
  6: 'lg:grid-cols-6',
};

const XL_MAP = {
  1: 'xl:grid-cols-1',
  2: 'xl:grid-cols-2',
  3: 'xl:grid-cols-3',
  4: 'xl:grid-cols-4',
  5: 'xl:grid-cols-5',
  6: 'xl:grid-cols-6',
};

export function Grid({
  as: Component = 'div',
  cols = { base: 1, sm: 2, md: 3, lg: 4 },
  gap = 'gap-4 md:gap-6',
  className,
  children,
  ...props
}) {
  const {
    base = 1,
    sm,
    md,
    lg,
    xl,
  } = typeof cols === 'number' ? { base: cols } : cols;

  return (
    <Component
      className={cn(
        'grid',
        COL_MAP[base] ?? COL_MAP[1],
        sm && (SM_MAP[sm] ?? false),
        md && (MD_MAP[md] ?? false),
        lg && (LG_MAP[lg] ?? false),
        xl && (XL_MAP[xl] ?? false),
        gap,
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export { Grid as ResponsiveGrid };
