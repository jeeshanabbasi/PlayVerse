import { memo } from 'react';
import { Chip } from '@ui';
import { GAME_GENRES } from '@data/games';
import { cn } from '@utils/index';

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
        // Map "All" to 'all' value
        const val = g.toLowerCase();
        const active = genre === val;
        
        return (
          <Chip
            key={g}
            selected={active}
            onSelect={() => onGenreChange(val)}
            className={cn(
              'shrink-0 text-sm font-medium border border-border bg-surface px-4 py-1.5 rounded-full transition-colors cursor-pointer',
              active && 'border-primary bg-primary/10 text-primary hover:bg-primary/15'
            )}
          >
            {g}
          </Chip>
        );
      })}
    </div>
  );
});
