import { memo, useCallback, useState } from 'react';
import { Section, Carousel } from '@components/layout';
import { GameCard } from '@game';
import { getTrendingGames } from '@data/index';
import { useToast } from '@hooks/index';

const TRENDING = getTrendingGames(12);

export const TrendingRow = memo(function TrendingRow() {
  const { success } = useToast();
  const [wishlist, setWishlist] = useState({});
  const [favorites, setFavorites] = useState({});

  const toggleWishlist = useCallback((id, next) => {
    setWishlist((prev) => ({ ...prev, [id]: next }));
  }, []);

  const toggleFavorite = useCallback((id, next) => {
    setFavorites((prev) => ({ ...prev, [id]: next }));
  }, []);

  return (
    <Section
      title="Trending Games"
      description="What players are launching right now."
      spacing="md"
      className="overflow-hidden"
    >
      <Carousel
        showDots={false}
        itemClassName="w-[70%] sm:w-[42%] md:w-[30%] lg:w-[18%] xl:w-[15%]"
        trackClassName="gap-4 pb-1"
      >
        {TRENDING.map((game) => (
          <GameCard
            key={game.id}
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
        ))}
      </Carousel>
    </Section>
  );
});
