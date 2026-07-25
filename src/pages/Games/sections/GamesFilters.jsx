import { memo } from 'react';
import { motion } from 'framer-motion';
import { GAME_GENRES } from '@data/games';
import { cn, playUiTick, playUiClick } from '@utils/index';

export const GamesFilters = memo(function GamesFilters({
  genre = 'all',
  onGenreChange,
}) {
  return (
    <div
      className="flex gap-2 overflow-x-auto pb-2 scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      role="group"
      aria-label="Filter by genre"
    >
      {GAME_GENRES.map((g) => {
        const val = g.toLowerCase();
        const active = genre === val;
        
        return (
          <button
            key={g}
            type="button"
            onClick={() => {
              playUiClick();
              onGenreChange(val);
            }}
            onMouseEnter={playUiTick}
            className={cn(
              'relative shrink-0 text-sm font-medium border px-4 py-1.5 rounded-full transition-colors cursor-pointer z-10 duration-200 outline-none select-none',
              active 
                ? 'border-primary/20 text-text font-semibold shadow-[var(--shadow-glow)]' 
                : 'border-border bg-surface text-text-secondary hover:text-text hover:border-border-hover'
            )}
          >
            {active && (
              <motion.span
                layoutId="activeGenreBackground"
                className="absolute inset-0 rounded-full bg-primary/15 border border-primary/40 z-[-1]"
                transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              />
            )}
            <span>{g}</span>
          </button>
        );
      })}
    </div>
  );
});
