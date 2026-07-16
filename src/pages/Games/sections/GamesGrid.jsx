import { memo, useCallback, useState } from 'react';
import { Gamepad2 } from 'lucide-react';
import { GameCard } from '@game';
import { EmptyState, Skeleton, Button } from '@ui';
import { useToast } from '@hooks/index';
import { cn } from '@utils/index';

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
  isLoading,
  hasActiveFilters,
  onClearFilters,
}) {
  const { success } = useToast();
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
