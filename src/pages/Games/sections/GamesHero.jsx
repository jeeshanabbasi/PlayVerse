import { memo, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Gamepad2 } from 'lucide-react';
import { SearchInput } from '@ui';

export const GamesHero = memo(function GamesHero({
  query,
  onQueryChange,
  onClear,
  matching,
  total,
}) {
  const searchInputRef = useRef(null);

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
