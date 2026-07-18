import { memo } from 'react';
import { motion } from 'framer-motion';
import { GameCard } from '@game';
import { recentlyPlayedGames } from '@data/games';
import { staggerContainer, staggerItem } from '@utils/index';

export const ContinuePlayingSection = memo(function ContinuePlayingSection() {
  const games = recentlyPlayedGames || [];

  if (games.length === 0) return null;

  return (
    <section className="space-y-8 pb-8">
      <div className="flex flex-col gap-1.5 text-center md:text-left">
        <h2 className="text-heading-lg font-bold tracking-tight text-text">
          Recently Played
        </h2>
        <p className="text-body-md text-text-secondary">
          Jump back into your last session.
        </p>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: '-60px' }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8"
      >
        {games.map((game) => (
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
