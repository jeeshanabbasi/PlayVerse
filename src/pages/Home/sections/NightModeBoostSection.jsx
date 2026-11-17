import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MoonStar, Sparkles, Zap } from 'lucide-react';
import { useQuickPlay } from '@context/index';
import { gamesCatalog } from '@data/games';
import { getStoredItem, getStoredJson } from '@utils/index';

function readNumber(key) {
  const value = Number(getStoredItem(key) || 0);
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

function buildNightBoost() {
  const history = getStoredJson('playverse_history', []);
  const recentIds = Array.isArray(history) ? history.slice(0, 4) : [];

  const allGames = gamesCatalog
    .map((game) => ({
      ...game,
      playCount: readNumber(`playverse.game.${game.id}.playCount`),
      highScore: readNumber(`playverse.game.${game.id}.highScore`),
      recent: recentIds.includes(game.id),
    }))
    .filter((game) => game.playCount > 0 || game.recent)
    .sort((a, b) => b.playCount - a.playCount || b.highScore - a.highScore)
    .slice(0, 3);

  const totalBoost = allGames.reduce((sum, game) => sum + (game.playCount || 1), 0);

  return {
    totalBoost,
    games: allGames.length > 0 ? allGames : gamesCatalog.slice(0, 3).map((game) => ({ ...game, playCount: 0, highScore: 0 })),
  };
}

export const NightModeBoostSection = memo(function NightModeBoostSection() {
  const { openGame } = useQuickPlay();
  const boost = useMemo(() => buildNightBoost(), []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      className="rounded-2xl border border-border bg-surface px-5 py-4"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
            <MoonStar className="h-5 w-5" aria-hidden="true" />
          </span>

          <div>
            <p className="text-label text-primary">Night Boost</p>
            <h3 className="mt-1 text-lg font-bold text-text">Late-night sessions are trending</h3>
            <p className="mt-1 text-sm text-text-secondary">
              {boost.totalBoost} active momentum points across your recent arcade picks.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-95"
          onClick={() => openGame(boost.games[0]?.id ?? gamesCatalog[0].id)}
        >
          <Zap className="h-4 w-4" aria-hidden="true" />
          Go again
        </button>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {boost.games.map((game) => (
          <button
            key={game.id}
            type="button"
            onClick={() => openGame(game.id)}
            className="rounded-xl border border-border bg-background/30 p-3 text-left transition hover:border-primary/30 hover:bg-primary/5"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-text-muted">
                <Sparkles className="h-3 w-3 text-primary" aria-hidden="true" />
                peak
              </span>
            </div>

            <p className="mt-3 text-lg font-bold text-text">{game.title}</p>
            <p className="mt-1 text-xs text-text-secondary">{game.highScore.toLocaleString()} best</p>
          </button>
        ))}
      </div>
    </motion.section>
  );
});

export default NightModeBoostSection;
