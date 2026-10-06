import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Play, Trophy } from 'lucide-react';
import { useQuickPlay } from '@context/index';
import { gamesCatalog } from '@data/games';

function getQuickResume() {
  try {
    const history = JSON.parse(localStorage.getItem('playverse_history') || '[]');
    const lastSlug = Array.isArray(history) ? history[0] : null;

    if (!lastSlug) {
      return null;
    }

    const game = gamesCatalog.find((item) => item.id === lastSlug);
    if (!game) {
      return null;
    }

    const highScore = Number(localStorage.getItem(`playverse.game.${game.id}.highScore`) || 0);
    const playCount = Number(localStorage.getItem(`playverse.game.${game.id}.playCount`) || 0);

    return { ...game, highScore, playCount };
  } catch {
    return null;
  }
}

export const QuickResumeSection = memo(function QuickResumeSection() {
  const { openGame } = useQuickPlay();
  const game = useMemo(() => getQuickResume(), []);

  if (!game) {
    return null;
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      className="rounded-2xl border border-border bg-surface px-5 py-4"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-accent">
            <Play className="h-5 w-5" aria-hidden="true" />
          </span>

          <div>
            <p className="text-label text-accent">Quick Resume</p>
            <h3 className="mt-1 text-lg font-bold text-text">Continue {game.title}</h3>
            <p className="mt-1 text-sm text-text-secondary">
              Best score: {game.highScore.toLocaleString()} • Played {game.playCount} times
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-xl border border-border bg-background/30 px-3 py-2 text-sm font-medium text-text-secondary">
            <Trophy className="h-4 w-4 text-warning" aria-hidden="true" />
            {game.highScore.toLocaleString()}
          </span>

          <button
            type="button"
            onClick={() => openGame(game.id)}
            className="inline-flex items-center justify-center rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground transition hover:opacity-95"
          >
            Resume
          </button>
        </div>
      </div>
    </motion.section>
  );
});

export default QuickResumeSection;
