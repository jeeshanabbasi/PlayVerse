import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Zap } from 'lucide-react';
import { useQuickPlay } from '@context/index';
import { gamesCatalog } from '@data/games';

function getBestScoreGame() {
  let best = null;

  gamesCatalog.forEach((game) => {
    const score = Number(localStorage.getItem(`playverse.game.${game.id}.highScore`) || 0);
    if (score > 0 && (!best || score > best.score)) {
      best = {
        slug: game.id,
        title: game.title,
        score,
      };
    }
  });

  return best;
}

export const BestScoreSpotlightSection = memo(function BestScoreSpotlightSection() {
  const { openGame } = useQuickPlay();
  const best = useMemo(() => getBestScoreGame(), []);

  if (!best) {
    return null;
  }

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
            <Trophy className="h-5 w-5" aria-hidden="true" />
          </span>

          <div>
            <p className="text-label text-primary">Best Score</p>
            <h3 className="mt-1 text-lg font-bold text-text">{best.title}</h3>
            <p className="mt-1 text-sm text-text-secondary">
              Your personal best is {best.score.toLocaleString()} points.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-xl border border-border bg-background/30 px-3 py-2 text-sm font-medium text-text-secondary">
            <Zap className="h-4 w-4 text-warning" aria-hidden="true" />
            {best.score.toLocaleString()}
          </span>

          <button
            type="button"
            onClick={() => openGame(best.slug)}
            className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-95"
          >
            Replay
          </button>
        </div>
      </div>
    </motion.section>
  );
});

export default BestScoreSpotlightSection;
