import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Trophy } from 'lucide-react';
import { useQuickPlay } from '@context/index';
import { gamesCatalog } from '@data/games';
import { getStoredItem } from '@utils/index';

function readScore(key) {
  const value = Number(getStoredItem(key) || 0);
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

function getLadder() {
  const scored = gamesCatalog
    .map((game) => ({
      ...game,
      highScore: readScore(`playverse.game.${game.id}.highScore`),
    }))
    .filter((game) => game.highScore > 0)
    .sort((a, b) => b.highScore - a.highScore)
    .slice(0, 3);

  return scored.length > 0
    ? scored
    : gamesCatalog.slice(0, 3).map((game) => ({ ...game, highScore: 0 }));
}

export const HighScoreLadderSection = memo(function HighScoreLadderSection() {
  const { openGame } = useQuickPlay();
  const ladder = useMemo(() => getLadder(), []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      className="rounded-2xl border border-border bg-surface px-5 py-4"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-warning/20 bg-warning/10 text-warning">
            <Trophy className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-label text-warning">High Score Ladder</p>
            <h3 className="mt-1 text-lg font-bold text-text">Your top score targets</h3>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {ladder.map((game, index) => (
          <button
            key={game.id}
            type="button"
            onClick={() => openGame(game.id)}
            className="rounded-xl border border-border bg-background/30 p-3 text-left transition hover:border-warning/30 hover:bg-warning/5"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] uppercase tracking-wider text-text-muted">#{index + 1}</span>
              <ArrowRight className="h-4 w-4 text-text-secondary" aria-hidden="true" />
            </div>

            <p className="mt-3 text-lg font-bold text-text">{game.title}</p>
            <p className="mt-1 text-xs text-text-secondary">{game.genres?.[0] ?? 'Arcade'} • {game.difficulty}</p>

            <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-warning/20 bg-warning/10 px-2.5 py-1 text-sm font-semibold text-warning">
              <Trophy className="h-3.5 w-3.5" aria-hidden="true" />
              {game.highScore > 0 ? game.highScore.toLocaleString() : 'No score yet'}
            </div>
          </button>
        ))}
      </div>
    </motion.section>
  );
});

export default HighScoreLadderSection;
