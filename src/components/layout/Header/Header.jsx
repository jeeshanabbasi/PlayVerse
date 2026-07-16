import { useState } from 'react';
import { Menu, X, Search, Bell, User } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Logo } from '@components/layout/Logo';
import { NavList } from '@components/layout/Navigation';
import { NAV_ITEMS } from '@constants/navigation';

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-[200] w-full border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container-app">
        <div className="flex items-center justify-between h-16 md:h-[72px]">
          <Logo />

          <NavList
            items={NAV_ITEMS}
            className="hidden lg:flex"
          />

          <div className="flex items-center gap-1">
            <button
              type="button"
              className="btn-ghost p-2.5"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              type="button"
              className="btn-ghost p-2.5 hidden sm:inline-flex"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
            </button>

            <button
              type="button"
              className="btn-ghost p-2.5 hidden sm:inline-flex"
              aria-label="Profile"
            >
              <User className="w-5 h-5" />
            </button>

            <button
              type="button"
              className="btn-ghost p-2.5 lg:hidden"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((prev) => !prev)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="lg:hidden overflow-hidden border-t border-border"
          >
            <div className="container-app py-4">
              <NavList
                items={NAV_ITEMS}
                orientation="vertical"
                onItemClick={closeMobile}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
