import { memo, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Section } from '@components/layout';
import { GameCard, GameBadge } from '@game';
import { newReleases } from '@data/index';
import { useToast } from '@hooks/index';
import { staggerContainer, staggerItem } from '@utils/index';
import { MotionSection } from './shared';

export const NewReleasesSection = memo(function NewReleasesSection() {
  const { success } = useToast();
  const [wishlist, setWishlist] = useState({});

  const toggleWishlist = useCallback((id, active) => {
    setWishlist((prev) => ({ ...prev, [id]: active }));
  }, []);

  const [featured, ...rest] = newReleases;

  return (
    <Section
      title="New Releases"
      description="Fresh drops straight into the PlayVerse."
      spacing="lg"
    >
      <MotionSection>
        <motion.div
          className="grid gap-4 lg:grid-cols-12 lg:gap-5"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-60px' }}
        >
          <motion.div variants={staggerItem} className="relative lg:col-span-7 space-y-2">
            <div className="flex items-center gap-2">
              <GameBadge variant="new" />
              <span className="text-label text-accent">{featured.releasedAt}</span>
            </div>
            <GameCard
              title={featured.title}
              image={featured.image}
              genres={featured.genres}
              rating={featured.rating}
              price={featured.price}
              aspect="wide"
              wishlisted={Boolean(wishlist[featured.id])}
              onWishlist={(next) => toggleWishlist(featured.id, next)}
              onPlay={() => success('Launching', featured.title)}
              href={`/games/${featured.id}`}
            />
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
            {rest.map((game) => (
              <motion.div key={game.id} variants={staggerItem} className="space-y-2">
                <span className="text-label text-accent">{game.releasedAt}</span>
                <GameCard
                  title={game.title}
                  image={game.image}
                  genres={game.genres}
                  rating={game.rating}
                  price={game.price}
                  aspect="ultrawide"
                  wishlisted={Boolean(wishlist[game.id])}
                  onWishlist={(next) => toggleWishlist(game.id, next)}
                  onPlay={() => success('Launching', game.title)}
                  href={`/games/${game.id}`}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </MotionSection>
    </Section>
  );
});
