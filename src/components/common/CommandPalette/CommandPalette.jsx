import { memo, useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Gamepad2, Landmark, Info, Terminal, Sparkles, X } from 'lucide-react';
import { gamesCatalog } from '@data/games';
import { useQuickPlay } from '@context/index';
import { cn, playUiTick, playUiClick } from '@utils/index';

function CommandPaletteComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { openGame } = useQuickPlay();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  // Listen for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        playUiClick();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Reset indices and focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    const resolvedGames = gamesCatalog.filter((game) =>
      game.title.toLowerCase().includes(q) ||
      game.genres.some((g) => g.toLowerCase().includes(q))
    ).map((game) => ({
      type: 'game',
      id: game.id,
      title: game.title,
      subtitle: game.genres.join(' · '),
      icon: Gamepad2,
      action: () => {
        openGame(game.id);
        setIsOpen(false);
      },
    }));

    const navigationLinks = [
      {
        type: 'link',
        id: 'nav-games',
        title: 'Go to Games Page',
        subtitle: 'Explore the full retro catalog',
        icon: Landmark,
        action: () => {
          navigate('/games');
          setIsOpen(false);
        },
      },
      {
        type: 'link',
        id: 'nav-about',
        title: 'Go to About Page',
        subtitle: 'Read about the platform and author credit',
        icon: Info,
        action: () => {
          navigate('/about');
          setIsOpen(false);
        },
      },
    ].filter((link) => link.title.toLowerCase().includes(q));

    return [...resolvedGames, ...navigationLinks];
  }, [query, navigate, openGame]);

  // Navigate elements using arrow keys
  useEffect(() => {
    const handleNavigationKeys = (e) => {
      if (!isOpen) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const activeItem = filteredItems[selectedIndex];
        if (activeItem) {
          playUiClick();
          activeItem.action();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleNavigationKeys);
    return () => window.removeEventListener('keydown', handleNavigationKeys);
  }, [isOpen, filteredItems, selectedIndex]);

  return (
    <>
      {/* Floating Spotlight Indicator in Header / Screen bottom */}
      <button
        onClick={() => {
          playUiClick();
          setIsOpen(true);
        }}
        onMouseEnter={playUiTick}
        className="fixed bottom-4 left-4 z-[40] flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl border border-border bg-surface/80 text-text-secondary backdrop-blur-md hover:text-text hover:border-primary/40 transition-all duration-200 shadow-xl"
        title="Open search console (Ctrl + K)"
      >
        <Terminal className="w-3.5 h-3.5 text-primary animate-pulse" />
        <span className="hidden sm:inline">Search Console</span>
        <kbd className="px-1.5 py-0.5 rounded bg-border/40 font-mono text-[9px] border border-border">Ctrl K</kbd>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[700] flex items-start justify-center pt-[15vh] px-4 bg-black/75 backdrop-blur-md"
            onClick={() => setIsOpen(false)}
          >
            {/* Main console card */}
            <motion.div
              initial={{ scale: 0.95, y: -10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: -10 }}
              transition={{ type: 'spring', stiffness: 350, damping: 26 }}
              className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border/80 bg-surface/95 backdrop-blur-xl shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Input bar */}
              <div className="flex items-center gap-3 border-b border-border/60 px-4 py-3">
                <Search className="w-5 h-5 text-text-muted shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Type to search games or navigation..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  className="flex-1 bg-transparent text-sm text-text placeholder-text-muted focus:outline-none"
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg hover:bg-border/30 text-text-muted hover:text-text transition-colors shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Items List */}
              <div className="max-h-[300px] overflow-y-auto p-2 space-y-1">
                {filteredItems.length === 0 ? (
                  <div className="text-center py-8 text-text-muted space-y-2">
                    <Sparkles className="w-8 h-8 mx-auto text-text-muted opacity-40" />
                    <p className="text-xs">No matching elements found</p>
                  </div>
                ) : (
                  filteredItems.map((item, idx) => {
                    const Icon = item.icon;
                    const isSelected = idx === selectedIndex;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          playUiClick();
                          item.action();
                        }}
                        onMouseEnter={() => {
                          setSelectedIndex(idx);
                          playUiTick();
                        }}
                        className={cn(
                          'relative w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-left transition-all duration-150',
                          isSelected
                            ? 'bg-primary/10 border border-primary/20 text-text'
                            : 'border border-transparent text-text-secondary hover:text-text'
                        )}
                      >
                        <div
                          className={cn(
                            'flex h-8 w-8 items-center justify-center rounded-lg border transition-colors duration-150 shrink-0',
                            isSelected
                              ? 'bg-primary/15 border-primary/30 text-primary'
                              : 'bg-surface-elevated border-border text-text-muted'
                          )}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold truncate">{item.title}</p>
                          <p className="text-[10px] text-text-muted truncate mt-0.5">{item.subtitle}</p>
                        </div>
                        {isSelected && (
                          <span className="text-[10px] font-semibold text-primary font-mono uppercase tracking-widest shrink-0">
                            Enter
                          </span>
                        )}
                      </button>
                    );
                  })
                )}
              </div>

              {/* Footer info strip */}
              <div className="border-t border-border/40 px-4 py-2 bg-background/45 flex items-center justify-between text-[9px] text-text-muted font-mono">
                <span className="flex items-center gap-1">Use arrow keys <span className="font-bold">↑↓</span> to navigate</span>
                <span>Press <span className="font-bold">Esc</span> to close</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export const CommandPalette = memo(CommandPaletteComponent);
