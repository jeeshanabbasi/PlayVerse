import { memo } from 'react';
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
        </p>
      </motion.div>
    </div>
  );
});
