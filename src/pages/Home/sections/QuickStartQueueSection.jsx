import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Rocket, Sparkles } from 'lucide-react';
import { useQuickPlay } from '@context/index';
import { gamesCatalog } from '@data/games';
import { getStoredItem, getStoredJson } from '@utils/index';

function readNonNegativeNumber(key) {
  const value = Number(getStoredItem(key) || 0);
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

function buildQueue() {
  const history = getStoredJson('playverse_history', []);
  const recentIds = Array.isArray(history) ? history.filter(Boolean) : [];

  const games = gamesCatalog
    .map((game) => {
      const playCount = readNonNegativeNumber(`playverse.game.${game.id}.playCount`);
      const highScore = readNonNegativeNumber(`playverse.game.${game.id}.highScore`);
      const lastPlayed = readNonNegativeNumber(`playverse.game.${game.id}.lastPlayed`);
      const recentIndex = recentIds.indexOf(game.id);

      return {
        ...game,
        playCount,
        highScore,
        lastPlayed,
        recentIndex: recentIndex >= 0 ? recentIndex : Number.MAX_SAFE_INTEGER,
      };
    })
    .sort((a, b) => {
      const rank = (game) =>
        game.recentIndex !== Number.MAX_SAFE_INTEGER ? 0 : game.playCount === 0 ? 1 : 2;
      const rankDifference = rank(a) - rank(b);
      if (rankDifference !== 0) return rankDifference;
      if (rank(a) === 0 && a.recentIndex !== b.recentIndex) {
        return a.recentIndex - b.recentIndex;
      }
      if (rank(a) === 1 && a.plays !== b.plays) return b.plays - a.plays;
      if (a.lastPlayed !== b.lastPlayed) return b.lastPlayed - a.lastPlayed;
      if (a.highScore !== b.highScore) return b.highScore - a.highScore;
      return a.title.localeCompare(b.title);
    });

  return games.slice(0, 3);
}

export const QuickStartQueueSection = memo(function QuickStartQueueSection() {
  const { openGame } = useQuickPlay();
  const queue = useMemo(() => buildQueue(), []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      className="rounded-2xl border border-border bg-surface px-5 py-4"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-accent">
            <Rocket className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-label text-accent">Quick Start Queue</p>
            <h3 className="mt-1 text-lg font-bold text-text">Best next games to jump into</h3>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {queue.map((game) => (
          <button
            key={game.id}
            type="button"
            onClick={() => openGame(game.id)}
            className="rounded-xl border border-border bg-background/30 p-3 text-left transition hover:border-accent/30 hover:bg-accent/5"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-text-muted">
                <Sparkles className="h-3 w-3 text-accent" aria-hidden="true" />
                {game.playCount === 0 ? 'Fresh' : game.recentIndex === Number.MAX_SAFE_INTEGER ? 'Hot' : 'Resume'}
              </span>
              <ArrowRight className="h-4 w-4 text-text-secondary" aria-hidden="true" />
            </div>

            <p className="mt-3 text-lg font-bold text-text">{game.title}</p>
            <p className="mt-1 text-xs text-text-secondary">
              {game.genres?.[0] ?? 'Arcade'} • {game.difficulty}
            </p>

            <div className="mt-3 flex items-center justify-between text-xs text-text-secondary">
              <span>{game.playCount} plays</span>
              <span>{game.highScore.toLocaleString()} best</span>
            </div>
          </button>
        ))}
      </div>
    </motion.section>
  );
});

export default QuickStartQueueSection;
