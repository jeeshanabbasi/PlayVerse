import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Star } from 'lucide-react';
import { useQuickPlay } from '@context/index';
import { gamesCatalog } from '@data/games';

function getStoredArray(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : fallback;
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function getFavoriteGenre() {
  const history = getStoredArray('playverse_history');
  const favorites = getStoredArray('playverse_favorites');
  const scores = {};

  gamesCatalog.forEach((game) => {
    const playCount = Number(localStorage.getItem(`playverse.game.${game.id}.playCount`) || 0);
    const isHistory = history.includes(game.id);
    const isFavorite = favorites.includes(game.id);

    game.genres.forEach((genre) => {
      const weight = (isHistory ? 2 : 0) + (isFavorite ? 3 : 0) + Math.min(playCount, 5);
      scores[genre] = (scores[genre] || 0) + weight;
    });
  });

  const [genre = 'Arcade'] = Object.entries(scores).sort((a, b) => b[1] - a[1])[0] || [];
  const genreGames = gamesCatalog.filter((game) => game.genres.includes(genre));
  const suggested = genreGames[Math.floor(Math.random() * genreGames.length)] || gamesCatalog[0];

  return { genre, suggested };
}

export const FavoriteGenreSpotlightSection = memo(function FavoriteGenreSpotlightSection() {
  const { openGame } = useQuickPlay();
  const { genre, suggested } = useMemo(() => getFavoriteGenre(), []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      className="rounded-2xl border border-primary/25 bg-gradient-to-r from-primary/10 via-surface to-surface px-5 py-4"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </span>

          <div>
            <p className="text-label text-primary">Favorite Genre</p>
            <h3 className="mt-1 text-lg font-bold text-text">You lean toward {genre}</h3>
            <p className="mt-1 text-sm text-text-secondary">
              {suggested.title} is a strong match based on your sessions and favorites.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-xl border border-border bg-background/30 px-3 py-2 text-sm font-medium text-text-secondary">
            <Star className="h-4 w-4 text-warning" aria-hidden="true" />
            {genre}
          </span>

          <button
            type="button"
            onClick={() => openGame(suggested.id)}
            className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-95"
          >
            Play Now
          </button>
        </div>
      </div>
    </motion.section>
  );
});

export default FavoriteGenreSpotlightSection;
