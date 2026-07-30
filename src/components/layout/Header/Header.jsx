import { useState } from 'react';
import { Menu, X, Settings } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Logo } from '@components/layout/Logo';
import { NavList } from '@components/layout/Navigation';
import { NAV_ITEMS } from '@constants/navigation';
import { SettingsDrawer } from './SettingsDrawer';
import { playUiClick, playUiTick } from '@utils/index';

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-[200] w-full border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container-app">
        <div className="flex items-center justify-between h-16 md:h-[72px]">
          <Logo />

          <div className="flex items-center gap-3">
            <NavList
              items={NAV_ITEMS}
              className="hidden md:flex"
            />
            
            <button
              type="button"
              onClick={() => {
                playUiClick();
                setSettingsOpen(true);
              }}
              onMouseEnter={playUiTick}
              className="p-2 rounded-xl border border-border bg-surface text-text-secondary hover:text-text hover:border-border-hover transition-colors cursor-pointer"
              title="Console settings"
              aria-label="Console settings"
            >
              <Settings className="w-4.5 h-4.5" />
            </button>

            <button
              type="button"
              className="btn-ghost p-2.5 md:hidden"
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
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden border-t border-border bg-background"
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

      <SettingsDrawer
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </header>
  );
}
export default Header;
