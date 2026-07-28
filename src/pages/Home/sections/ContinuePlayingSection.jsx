import { memo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GameCard } from '@game';
import { gamesCatalog } from '@data/games';
import { staggerContainer, staggerItem } from '@utils/index';

export const ContinuePlayingSection = memo(function ContinuePlayingSection() {
  const [games, setGames] = useState([]);
  const [isHistory, setIsHistory] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('playverse_history');
      const historySlugs = raw ? JSON.parse(raw) : [];
      
      if (Array.isArray(historySlugs) && historySlugs.length > 0) {
        const resolved = historySlugs
          .map((slug) => gamesCatalog.find((game) => game.id === slug))
          .filter(Boolean);
        
        if (resolved.length > 0) {
          setGames(resolved);
          setIsHistory(true);
          return;
        }
      }
    } catch {
      // fallback
    }

    // Default fallback: display first 4 games as recommendations
    setGames(gamesCatalog.slice(0, 4));
    setIsHistory(false);
  }, []);

  if (games.length === 0) return null;

  return (
    <section className="space-y-8 pb-8">
      <div className="flex flex-col gap-1.5 text-center md:text-left">
        <h2 className="text-heading-lg font-bold tracking-tight text-text">
          {isHistory ? 'Recently Played' : 'Recommended For You'}
        </h2>
        <p className="text-body-md text-text-secondary">
          {isHistory ? 'Jump back into your last session.' : 'Start playing some of our trending classic games.'}
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
