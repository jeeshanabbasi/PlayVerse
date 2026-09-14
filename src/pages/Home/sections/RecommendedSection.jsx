import { memo, useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Section } from '@components/layout';
import { GameCard } from '@game';
import { gamesCatalog } from '@data/games';
import { useToast } from '@hooks/index';
import { staggerContainer, staggerItem } from '@utils/index';

function getStoredArray(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : fallback;
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function getSmartRecommendations() {
  const history = getStoredArray('playverse_history');
  const favorites = getStoredArray('playverse_favorites');
  const favoriteGenres = new Set();

  history.forEach((slug) => {
    const game = gamesCatalog.find((item) => item.id === slug);
    if (game) {
      game.genres.forEach((genre) => favoriteGenres.add(genre));
    }
  });

  favorites.forEach((slug) => {
    const game = gamesCatalog.find((item) => item.id === slug);
    if (game) {
      game.genres.forEach((genre) => favoriteGenres.add(genre));
    }
  });

  const scored = gamesCatalog
    .map((game) => {
      let score = 0;
      let reason = 'Trending right now';

      if (history.includes(game.id)) {
        score += 6;
        reason = 'You keep circling back to this one';
      }

      if (favorites.includes(game.id)) {
        score += 8;
        reason = 'Saved in your favorites';
      }

      const playCount = Number(localStorage.getItem(`playverse.game.${game.id}.playCount`) || 0);
      if (playCount > 0) {
        score += Math.min(5, playCount);
      }

      if (game.isTrending) {
        score += 3;
      }

      if (game.rating >= 4.7) {
        score += 2;
      }

      const matchesGenre = game.genres.some((genre) => favoriteGenres.has(genre));
      if (matchesGenre) {
        score += 6;
        const genre = game.genres.find((entry) => favoriteGenres.has(entry)) || game.genres[0];
        reason = `Because you play ${genre.toLowerCase()} games`;
      }

      return { ...game, score, reason };
    })
    .filter((game) => !history.includes(game.id) || game.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  return scored.length > 0 ? scored : gamesCatalog.slice(0, 4).map((game) => ({ ...game, reason: 'Popular with the PlayVerse community' }));
}

export const RecommendedSection = memo(function RecommendedSection() {
  const { success } = useToast();
  const [wishlist, setWishlist] = useState({});
  const recommendations = useMemo(() => getSmartRecommendations(), []);

  const toggleWishlist = useCallback((id, active) => {
    setWishlist((prev) => ({ ...prev, [id]: active }));
  }, []);

  return (
    <Section
      title="Smart Picks"
      description="Curated from your recent sessions, favorite genres, and local scores."
      spacing="md"
    >
      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: '-60px' }}
        className="grid gap-6 md:grid-cols-2 xl:grid-cols-4"
      >
        {recommendations.map((game) => (
          <motion.div key={game.id} variants={staggerItem} className="space-y-3">
            <GameCard
              id={game.id}
              title={game.title}
              image={game.image}
              genres={game.genres}
            />
            <div className="rounded-xl border border-border bg-surface px-3 py-2 text-xs text-text-secondary">
              {game.reason}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
});
