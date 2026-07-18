import { memo } from 'react';
import { motion } from 'framer-motion';
import { GameCard } from '@game';
import { gamesCatalog } from '@data/games';
import { staggerContainer, staggerItem } from '@utils/index';

export const FeaturedSection = memo(function FeaturedSection() {
  return (
    <section id="featured-grid" className="space-y-8 scroll-mt-20">
      <div className="flex flex-col gap-1.5 text-center md:text-left">
        <h2 className="text-display-md font-bold tracking-tight text-text">
          Classic Games
        </h2>
        <p className="text-body-md text-text-secondary">
          No installs, no ads, no trackers. Play instantly in your browser.
        </p>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: '-60px' }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8"
      >
        {gamesCatalog.map((game) => (
          <motion.div key={game.id} variants={staggerItem}>
            <GameCard
              id={game.id}
              title={game.title}
              image={game.image}
              genres={game.genres}
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
});
