import { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap } from 'lucide-react';
import { useQuickPlay } from '@context/index';
import { gamesCatalog } from '@data/games';

function getSuggestedGame() {
  try {
    const favorites = JSON.parse(localStorage.getItem('playverse_favorites') || '[]');
    const history = JSON.parse(localStorage.getItem('playverse_history') || '[]');
    const candidates = [...new Set([...(Array.isArray(history) ? history : []), ...(Array.isArray(favorites) ? favorites : [])])];

    if (candidates.length > 0) {
      const slug = candidates[Math.floor(Math.random() * candidates.length)];
      const match = gamesCatalog.find((game) => game.id === slug);
      if (match) return match;
    }
  } catch {
    // ignore storage issues and fall back below
  }

  const preferred = ['snake', '2048', 'tetris', 'memory-game', 'flappy-bird'];
  return gamesCatalog.find((game) => preferred.includes(game.id)) || gamesCatalog[0];
}

export const QuickPickSection = memo(function QuickPickSection() {
  const { openGame } = useQuickPlay();
  const [game, setGame] = useState(() => getSuggestedGame());

  const shuffleGame = () => {
    setGame(getSuggestedGame());
  };

  const playQuickPick = () => {
    openGame(game.id);
  };

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
            <Zap className="h-5 w-5" aria-hidden="true" />
          </span>

          <div>
            <p className="text-label text-primary">Quick Pick</p>
            <h3 className="mt-1 text-lg font-bold text-text">Play a fast game that fits your mood</h3>
            <p className="mt-1 text-sm text-text-secondary">
              {game.title} is a great short session pick right now.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={shuffleGame}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm font-medium text-text-secondary transition hover:border-primary/30 hover:text-text"
          >
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Shuffle
          </button>

          <button
            type="button"
            onClick={playQuickPick}
            className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-95"
          >
            Play Now
          </button>
        </div>
      </div>
    </motion.section>
  );
});

export default QuickPickSection;
