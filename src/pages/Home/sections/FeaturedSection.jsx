import { memo, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { Section } from '@components/layout';
import {
  PlayButton,
  WishlistButton,
  GenreBadge,
  PlatformBadge,
  GameRating,
  GameBadge,
  PriceCard,
} from '@game';
import { featuredGame } from '@data/index';
import { useToast } from '@hooks/index';
import { MotionSection } from './shared';

export const FeaturedSection = memo(function FeaturedSection() {
  const { success } = useToast();
  const [wishlisted, setWishlisted] = useState(false);

  const handleWishlist = useCallback((next) => {
    setWishlisted(next);
    success(next ? 'Added to wishlist' : 'Removed from wishlist', featuredGame.title);
  }, [success]);

  const handlePlay = useCallback(() => {
    success('Launching', featuredGame.title);
  }, [success]);

  return (
    <Section id="featured" spacing="lg" className="relative">
      <MotionSection>
        <div className="mb-8 md:mb-10 flex flex-col gap-2">
          <p className="text-label text-primary">Spotlight</p>
          <h2 className="text-heading-lg text-text">Featured Game</h2>
        </div>

        <motion.article
          className="relative overflow-hidden rounded-xl border border-border bg-surface shadow-[var(--shadow-card)]"
          whileHover={{ y: -2 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        >
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] min-h-[420px] lg:min-h-[520px]">
            <div className="relative min-h-[280px] lg:min-h-full overflow-hidden">
              <img
                src={featuredGame.cover}
                alt={featuredGame.title}
                className="absolute inset-0 h-full w-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-surface" />
              <div className="absolute top-4 left-4">
                <GameBadge variant="exclusive" />
              </div>
            </div>

            <div className="relative flex flex-col justify-center gap-5 p-6 md:p-8 lg:p-10">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <GameRating rating={featuredGame.rating} size="lg" />
                  <span className="text-body-sm">
                    {featuredGame.reviewCount} reviews
                  </span>
                </div>

                <h3 className="text-display-md text-text">{featuredGame.title}</h3>
                <p className="text-accent font-medium">{featuredGame.tagline}</p>
                <p className="text-body-md max-w-md">{featuredGame.description}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {featuredGame.genres.map((genre) => (
                  <GenreBadge key={genre} label={genre} />
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {featuredGame.platforms.map((platform) => (
                  <PlatformBadge key={platform} platform={platform} />
                ))}
              </div>

              <div className="flex items-center gap-2 text-body-sm">
                <Users className="w-4 h-4 text-accent" aria-hidden="true" />
                <span>
                  <strong className="text-text font-semibold">{featuredGame.playersOnline}</strong>
                  {' '}online now
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <PlayButton size="lg" magnetic onClick={handlePlay}>
                  Play Now
                </PlayButton>
                <WishlistButton
                  active={wishlisted}
                  onToggle={handleWishlist}
                  size="lg"
                />
                <PriceCard price={featuredGame.price} size="lg" className="ml-auto" />
              </div>
            </div>
          </div>
        </motion.article>
      </MotionSection>
    </Section>
  );
});
