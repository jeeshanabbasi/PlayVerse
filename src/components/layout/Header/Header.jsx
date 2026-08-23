import { useState } from 'react';
import { History, Menu, Moon, Play, Sun, X, Settings } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Logo } from '@components/layout/Logo';
import { NavList } from '@components/layout/Navigation';
import { NAV_ITEMS } from '@constants/navigation';
import { playUiClick, playUiTick } from '@utils/index';
import { useQuickPlay, useTheme } from '@context/index';
import { gamesCatalog } from '@data/games';

export function Header({ onSettingsClick }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [recentGames, setRecentGames] = useState([]);
  const { isDark, toggleTheme } = useTheme();
  const { openGame } = useQuickPlay();
  const closeMobile = () => setMobileOpen(false);

  const toggleHistory = () => {
    playUiClick();
    if (!historyOpen) {
      try {
        const raw = localStorage.getItem('playverse_history');
        const history = raw ? JSON.parse(raw) : [];
        setRecentGames(
          (Array.isArray(history) ? history : [])
            .map((id) => gamesCatalog.find((game) => game.id === id))
            .filter(Boolean),
        );
      } catch {
        setRecentGames([]);
      }
    }
    setHistoryOpen((current) => !current);
  };

  return (
    <header className="relative sticky top-0 z-[200] w-full border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container-app">
        <div className="flex items-center justify-between h-16 md:h-[72px]">
          <Logo />

          <div className="flex items-center gap-3">
            <NavList
              items={NAV_ITEMS}
              className="hidden md:flex"
            />

            <div className="relative">
              <button
                type="button"
                onClick={toggleHistory}
                onMouseEnter={playUiTick}
                className="p-2 rounded-xl border border-border bg-surface text-text-secondary hover:text-text hover:border-border-hover transition-colors cursor-pointer"
                title="Recently played games"
                aria-label="Recently played games"
                aria-expanded={historyOpen}
              >
                <History className="w-4.5 h-4.5" />
              </button>

              <AnimatePresence>
                {historyOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    className="absolute right-0 top-12 z-[300] w-[min(18rem,calc(100vw-2rem))] rounded-2xl border border-border bg-surface p-3 shadow-2xl"
                  >
                    <div className="mb-2 flex items-center justify-between px-1">
                      <p className="text-xs font-bold uppercase tracking-wider text-text-muted">Recently Played</p>
                      <History className="h-3.5 w-3.5 text-primary" />
                    </div>

                    {recentGames.length > 0 ? (
                      <div className="space-y-1.5">
                        {recentGames.map((game) => (
                          <button
                            key={game.id}
                            type="button"
                            onClick={() => {
                              playUiClick();
                              setHistoryOpen(false);
                              openGame(game.id);
                            }}
                            className="group flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-surface-hover"
                          >
                            <img
                              src={game.image}
                              alt=""
                              className="h-10 w-14 rounded-lg object-cover"
                            />
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-semibold text-text">{game.title}</span>
                              <span className="block truncate text-[11px] text-text-muted">{game.genres.join(' · ')}</span>
                            </span>
                            <Play className="h-4 w-4 shrink-0 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="px-2 py-4 text-center text-xs text-text-secondary">Your played games will appear here.</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <button
              type="button"
              onClick={() => {
                playUiClick();
                toggleTheme();
              }}
              onMouseEnter={playUiTick}
              className="p-2 rounded-xl border border-border bg-surface text-text-secondary hover:text-text hover:border-border-hover transition-colors cursor-pointer"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            <button
              type="button"
              onClick={() => {
                playUiClick();
                onSettingsClick?.();
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
    </header>
  );
}
export default Header;
