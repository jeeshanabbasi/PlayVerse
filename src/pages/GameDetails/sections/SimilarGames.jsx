import { memo, useCallback, useState } from 'react';
import { Section, Carousel } from '@components/layout';
import { GameCard } from '@game';
import { useToast } from '@hooks/index';
import { MotionReveal } from '../shared';

export const SimilarGames = memo(function SimilarGames({ games }) {
  const { success } = useToast();
  const [wishlist, setWishlist] = useState({});

  const toggleWishlist = useCallback((id, next) => {
    setWishlist((prev) => ({ ...prev, [id]: next }));
  }, []);

  if (!games?.length) return null;

  return (
    <Section
      title="Similar Games"
      description="If you like this, you may love these."
      spacing="md"
      className="overflow-hidden"
    >
      <MotionReveal>
        <Carousel
          showDots={false}
          itemClassName="w-[70%] sm:w-[42%] md:w-[30%] lg:w-[18%]"
          trackClassName="gap-4 pb-1"
        >
          {games.map((game) => (
            <GameCard
              key={game.id}
              title={game.title}
              image={game.image}
              genres={game.genres}
              rating={game.rating}
              price={game.price}
              isNew={game.isNew}
              isTrending={game.isTrending}
              wishlisted={Boolean(wishlist[game.id])}
              onWishlist={(next) => toggleWishlist(game.id, next)}
              onPlay={() => success('Launching', game.title)}
              href={`/game/${game.slug}`}
            />
          ))}
        </Carousel>
      </MotionReveal>
    </Section>
  );
});
