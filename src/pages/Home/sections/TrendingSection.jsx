import { memo, useCallback, useState } from 'react';
import { Section, Carousel } from '@components/layout';
import { GameCard } from '@game';
import { trendingGames } from '@data/index';
import { useToast } from '@hooks/index';
import { MotionSection } from './shared';

export const TrendingSection = memo(function TrendingSection() {
  const { success } = useToast();
  const [wishlist, setWishlist] = useState({});

  const toggleWishlist = useCallback((id, active) => {
    setWishlist((prev) => ({ ...prev, [id]: active }));
    success(active ? 'Wishlisted' : 'Removed', id);
  }, [success]);

  return (
    <Section
      title="Trending Now"
      description="What the PlayVerse is playing this hour."
      spacing="md"
      className="overflow-hidden"
    >
      <MotionSection>
        <Carousel
          showDots={false}
          itemClassName="w-[72%] sm:w-[46%] md:w-[32%] lg:w-[23%]"
          trackClassName="gap-4 pb-2 -mx-1 px-1"
          className="px-0"
        >
          {trendingGames.map((game) => (
            <GameCard
              key={game.id}
              title={game.title}
              image={game.image}
              genres={game.genres}
              rating={game.rating}
              price={game.price}
              originalPrice={game.originalPrice}
              wishlisted={Boolean(wishlist[game.id])}
              onWishlist={(next) => toggleWishlist(game.id, next)}
              onPlay={() => success('Launching', game.title)}
              href={`/games/${game.id}`}
            />
          ))}
        </Carousel>
      </MotionSection>
    </Section>
  );
});
