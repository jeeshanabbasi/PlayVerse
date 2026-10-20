import { memo, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Shuffle, Sparkles } from 'lucide-react';
import { SearchInput } from '@ui';
import { useQuickPlay } from '@context/index';
import { useFavorites } from '@hooks/index';
import { gamesCatalog } from '@data/games';

export const GamesHero = memo(function GamesHero({
  query,
  onQueryChange,
  onClear,
  matching,
  total,
}) {
  const searchInputRef = useRef(null);
  const { openGame } = useQuickPlay();
  const { favorites } = useFavorites();

  useEffect(() => {
    const handleShortcut = (event) => {
      const target = event.target;
      const isEditing = target instanceof HTMLElement && (
        target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
      );

      if (event.key === '/' && !event.altKey && !event.ctrlKey && !event.metaKey && !isEditing) {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  const handleRandomFavorite = () => {
    const pool = favorites.length ? favorites : gamesCatalog.map((game) => game.id);
    const id = pool[Math.floor(Math.random() * pool.length)];
    if (id) openGame(id);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-display-lg font-bold tracking-tight text-text">
          Games
        </h1>
        <p className="text-body-md text-text-secondary">
          Explore our collection of classic mini-games.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-3"
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex-1">
            <SearchInput
              ref={searchInputRef}
              size="lg"
              label="Search games"
              placeholder="Search by name or category…"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              onClear={onClear}
              inputClassName="bg-surface/80 border-border shadow-[var(--shadow-soft)] focus:border-primary"
            />
          </div>

          <button
            type="button"
            onClick={handleRandomFavorite}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-3 py-2.5 text-sm font-semibold text-primary transition hover:border-primary/40 hover:bg-primary/15"
            title="Play a random favorite game"
          >
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Random</span>
            <Shuffle className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <p className="flex items-center gap-2 text-xs text-text-muted">
          <Gamepad2 className="h-3.5 w-3.5" aria-hidden="true" />
          <span>
            Showing <strong className="text-text-secondary font-medium">{matching}</strong> of{' '}
            <strong className="text-text-secondary font-medium">{total}</strong> games
          </span>
          <span className="ml-auto hidden items-center gap-1.5 sm:inline-flex">
            Press <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-[10px] text-text-secondary">/</kbd> to search
          </span>
        </p>
      </motion.div>
    </div>
  );
});
