import { memo, useState, useCallback } from 'react';
import { Section, Carousel } from '@components/layout';
import { GameCard } from '@game';
import { Chip } from '@ui';
import { recommendedGames } from '@data/index';
import { useToast } from '@hooks/index';
import { MotionSection } from './shared';

export const RecommendedSection = memo(function RecommendedSection() {
  const { success } = useToast();
  const [wishlist, setWishlist] = useState({});

  const toggleWishlist = useCallback((id, active) => {
    setWishlist((prev) => ({ ...prev, [id]: active }));
  }, []);

  return (
    <Section
      title="Recommended For You"
      description="Curated from your play style and community."
      spacing="md"
    >
      <MotionSection>
        <Carousel
          showDots={false}
          itemClassName="w-[78%] sm:w-[48%] md:w-[36%] lg:w-[28%]"
          trackClassName="gap-4 pb-2"
        >
          {recommendedGames.map((game) => (
            <div key={game.id} className="space-y-3">
              <GameCard
                title={game.title}
                image={game.image}
                genres={game.genres}
                rating={game.rating}
                price={game.price}
                wishlisted={Boolean(wishlist[game.id])}
                onWishlist={(next) => toggleWishlist(game.id, next)}
                onPlay={() => success('Launching', game.title)}
                href={`/games/${game.id}`}
              />
              <Chip className="max-w-full truncate">{game.reason}</Chip>
            </div>
          ))}
        </Carousel>
      </MotionSection>
    </Section>
  );
});
