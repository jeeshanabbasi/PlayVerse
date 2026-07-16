import { cn } from '@utils/index';
import { NavList } from '../Navigation';

export function DesktopNav({
  items = [],
  children,
  className,
  onItemClick,
  ...props
}) {
  return (
    <div
      className={cn(
        'hidden md:flex items-center gap-1',
        className,
      )}
      {...props}
    >
      {children ?? (
        <NavList
          items={items}
          orientation="horizontal"
          onItemClick={onItemClick}
        />
      )}
    </div>
  );
}
