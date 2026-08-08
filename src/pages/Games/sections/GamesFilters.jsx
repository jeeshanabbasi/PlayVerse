import { memo } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { GAME_GENRES, gamesCatalog } from '@data/games';
import { cn, playUiTick, playUiClick } from '@utils/index';
import { useFavorites } from '@hooks/index';

export const GamesFilters = memo(function GamesFilters({
  genre = 'all',
  onGenreChange,
}) {
  const { favorites } = useFavorites();

  const allFilters = [
    { label: 'All', value: 'all', count: gamesCatalog.length },
    { label: 'Favorites', value: 'favorites', count: favorites.length, isFav: true },
    ...GAME_GENRES.filter((g) => g.toLowerCase() !== 'all').map((g) => {
      const val = g.toLowerCase();
      const count = gamesCatalog.filter((game) =>
        game.genres.some((genreName) => genreName.toLowerCase() === val)
      ).length;
      return { label: g, value: val, count };
    }),
  ];

  return (
    <div
      className="flex gap-2 overflow-x-auto pb-2 scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      role="group"
      aria-label="Filter by genre"
    >
      {allFilters.map((f) => {
        const active = genre === f.value;

        return (
          <button
            key={f.value}
            type="button"
            onClick={() => {
              playUiClick();
              onGenreChange(f.value);
            }}
            onMouseEnter={playUiTick}
            className={cn(
              'relative shrink-0 text-sm font-medium border px-4 py-1.5 rounded-full transition-colors cursor-pointer z-10 duration-200 outline-none select-none flex items-center gap-1.5',
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
            
            <span className="flex items-center gap-1.5">
              {f.isFav && (
                <Heart className={cn('w-3.5 h-3.5', active ? 'fill-current text-primary' : 'text-text-muted')} />
              )}
              <span>{f.label}</span>
              <span className={cn(
                'text-[10px] font-mono rounded-full px-1.5 py-0.5 border transition-colors',
                active
                  ? 'bg-primary/25 border-primary/30 text-primary'
                  : 'bg-border/30 border-border text-text-muted'
              )}>
                {f.count}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
});
export default GamesFilters;
