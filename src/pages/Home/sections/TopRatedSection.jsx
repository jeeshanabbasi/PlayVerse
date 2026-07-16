import { memo, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Section, Grid } from '@components/layout';
import { GameCard } from '@game';
import { Badge } from '@ui';
import { topRatedGames } from '@data/index';
import { useToast } from '@hooks/index';
import { staggerContainer, staggerItem } from '@utils/index';
import { MotionSection } from './shared';

export const TopRatedSection = memo(function TopRatedSection() {
  const { success } = useToast();
  const [wishlist, setWishlist] = useState({});

  const toggleWishlist = useCallback((id, active) => {
    setWishlist((prev) => ({ ...prev, [id]: active }));
  }, []);

  return (
    <Section
      title="Top Rated"
      description="Critically loved. Community approved."
      spacing="md"
    >
      <MotionSection>
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-60px' }}
        >
          <Grid cols={{ base: 2, md: 2, lg: 4 }} gap="gap-3 md:gap-5">
            {topRatedGames.map((game) => (
              <motion.div key={game.id} variants={staggerItem} className="relative">
                <Badge
                  variant="primary"
                  className="absolute top-3 left-3 z-20"
                >
                  #{game.rank}
                </Badge>
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
              </motion.div>
            ))}
          </Grid>
        </motion.div>
      </MotionSection>
    </Section>
  );
});
