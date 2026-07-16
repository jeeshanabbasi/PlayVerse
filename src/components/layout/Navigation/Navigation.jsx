import { NavLink } from 'react-router-dom';
import { cn } from '@utils/index';

export function NavItem({ to, label, icon: Icon, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          'relative inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-250',
          isActive
            ? 'text-text bg-surface-hover'
            : 'text-text-secondary hover:text-text hover:bg-surface-hover/60',
        )
      }
      end={to === '/'}
    >
      {({ isActive }) => (
        <>
          {Icon && <Icon className="w-4 h-4" aria-hidden="true" />}
          <span>{label}</span>
          {isActive && (
            <span
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
              aria-hidden="true"
            />
          )}
        </>
      )}
    </NavLink>
  );
}

export function NavList({ items, orientation = 'horizontal', onItemClick, className }) {
  const isVertical = orientation === 'vertical';

  return (
    <nav
      className={cn(
        'flex',
        isVertical ? 'flex-col gap-1' : 'flex-row items-center gap-1',
        className,
      )}
      aria-label="Main navigation"
    >
      {items.map(({ id, path, label, icon }) => (
        <NavItem
          key={id}
          to={path}
          label={label}
          icon={icon}
          onClick={onItemClick}
        />
      ))}
    </nav>
  );
}
