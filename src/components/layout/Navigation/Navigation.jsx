import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn, playUiTick, playUiClick } from '@utils/index';

export function NavItem({ to, label, icon: Icon, onClick, layoutId }) {
  return (
    <NavLink
      to={to}
      onClick={(e) => {
        playUiClick();
        if (onClick) onClick(e);
      }}
      onMouseEnter={playUiTick}
      className={({ isActive }) =>
        cn(
          'relative inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 z-10',
          isActive
            ? 'text-text font-semibold'
            : 'text-text-secondary hover:text-text',
        )
      }
      end={to === '/'}
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.span
              layoutId={layoutId}
              className="absolute inset-0 rounded-xl bg-surface-hover border border-border/40 z-[-1] shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            />
          )}
          {Icon && <Icon className="w-4 h-4" aria-hidden="true" />}
          <span>{label}</span>
        </>
      )}
    </NavLink>
  );
}

export function NavList({ items, orientation = 'horizontal', onItemClick, className }) {
  const isVertical = orientation === 'vertical';
  const layoutId = isVertical ? 'mobileActiveNav' : 'desktopActiveNav';

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
          layoutId={layoutId}
        />
      ))}
    </nav>
  );
}
