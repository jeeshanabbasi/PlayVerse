import { memo, useCallback, useState } from 'react';
import { Gamepad2, Play, Trophy } from 'lucide-react';
import { GameCard } from '@game';
import { EmptyState, Skeleton, Button } from '@ui';
import { useToast } from '@hooks/index';
import { cn, getStoredItem, playUiClick } from '@utils/index';
import { useQuickPlay } from '@context/index';

const MemoGameCard = memo(GameCard);

function GamesGridSkeleton({ count = 10 }) {
  return (
    <div
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 2xl:grid-cols-6 gap-3 md:gap-4"
      role="status"
      aria-label="Loading games"
    >
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="aspect-[3/4] rounded-xl" />
      ))}
    </div>
  );
}

export const GamesGrid = memo(function GamesGrid({
  games,
  viewMode = 'grid',
  isLoading,
  hasActiveFilters,
  onClearFilters,
}) {
  const { success } = useToast();
  const { openGame } = useQuickPlay();
  const [wishlist, setWishlist] = useState({});
  const [favorites, setFavorites] = useState({});

  const toggleWishlist = useCallback((id, next) => {
    setWishlist((prev) => ({ ...prev, [id]: next }));
    success(next ? 'Wishlisted' : 'Removed', 'Library updated');
  }, [success]);

  const toggleFavorite = useCallback((id, next) => {
    setFavorites((prev) => ({ ...prev, [id]: next }));
  }, []);

  if (isLoading) {
    return <GamesGridSkeleton />;
  }

  if (!games.length) {
    return (
      <EmptyState
        icon={Gamepad2}
        title="No games found"
        description="Try another search or clear your filters to explore the full catalog."
        action={
          hasActiveFilters ? (
            <Button variant="secondary" onClick={onClearFilters}>
              Clear filters
            </Button>
          ) : null
        }
      />
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-2" role="list" aria-label="Games catalog">
        {games.map((game) => {
          const rawBest = getStoredItem(`playverse.game.${game.id}.highScore`);
          const best = Number(rawBest || 0);

          return (
            <div
              key={game.id}
              role="listitem"
              className="grid grid-cols-[5rem_1fr_auto] items-center gap-3 rounded-xl border border-border bg-surface p-2.5 transition hover:border-primary/30 md:grid-cols-[7rem_1fr_10rem_auto]"
            >
              <img
                src={game.image}
                alt=""
                loading="lazy"
                className="aspect-[16/10] w-full rounded-lg object-cover"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-text">{game.title}</p>
                <p className="mt-0.5 truncate text-xs text-text-muted">{game.genres.join(' · ')}</p>
              </div>
              <div className="hidden items-center gap-1.5 text-xs text-warning md:flex">
                <Trophy className="h-3.5 w-3.5" aria-hidden="true" />
                {Number.isFinite(best) && best > 0 ? best.toLocaleString() : 'No record'}
              </div>
              <button
                type="button"
                onClick={() => {
                  playUiClick();
                  openGame(game.id);
                }}
                className="btn-primary px-3 py-2 text-xs"
              >
                <Play className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                <span className="hidden sm:inline">Play</span>
              </button>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 2xl:grid-cols-6 gap-3 md:gap-4',
      )}
      role="list"
      aria-label="Games catalog"
    >
      {games.map((game) => (
        <div key={game.id} role="listitem" className="min-w-0">
          <MemoGameCard
            title={game.title}
            image={game.image}
            genres={game.genres}
            platforms={game.platforms}
            rating={game.rating}
            price={game.price}
            originalPrice={game.originalPrice}
            difficulty={game.difficulty}
            playTime={game.playTime}
            isNew={game.isNew}
            isTrending={game.isTrending}
            showMeta
            wishlisted={Boolean(wishlist[game.id])}
            favorited={Boolean(favorites[game.id])}
            onWishlist={(next) => toggleWishlist(game.id, next)}
            onFavorite={(next) => toggleFavorite(game.id, next)}
            onPlay={() => success('Launching', game.title)}
            href={`/games/${game.id}`}
          />
        </div>
      ))}
    </div>
  );
});
