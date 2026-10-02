import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Compass, Sparkles, Trophy } from 'lucide-react';
import { useQuickPlay } from '@context/index';
import { gamesCatalog } from '@data/games';

function getCatalogStats() {
  const genreCounts = {};
  let playedCount = 0;
  let totalSessions = 0;

  gamesCatalog.forEach((game) => {
    const plays = Number(localStorage.getItem(`playverse.game.${game.id}.playCount`) || 0);
    totalSessions += plays;

    if (plays > 0) {
      playedCount += 1;
    }

    game.genres.forEach((genre) => {
      genreCounts[genre] = (genreCounts[genre] || 0) + plays;
    });
  });

  const favoriteGenre = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0];
  const unplayed = gamesCatalog.length - playedCount;
  const progress = Math.round((playedCount / gamesCatalog.length) * 100);

  return {
    playedCount,
    unplayed,
    progress,
    totalSessions,
    favoriteGenre: favoriteGenre ? favoriteGenre[0] : 'Arcade',
  };
}

export const CatalogProgressSection = memo(function CatalogProgressSection() {
  const { openGame } = useQuickPlay();
  const stats = useMemo(() => getCatalogStats(), []);

  const discoverRandom = () => {
    const unplayedGames = gamesCatalog.filter((game) => {
      const plays = Number(localStorage.getItem(`playverse.game.${game.id}.playCount`) || 0);
      return plays === 0;
    });

    const pool = unplayedGames.length > 0 ? unplayedGames : gamesCatalog;
    const randomGame = pool[Math.floor(Math.random() * pool.length)];
    if (randomGame) openGame(randomGame.id);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      className="rounded-2xl border border-primary/25 bg-gradient-to-r from-primary/10 via-surface to-surface px-5 py-4"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-label text-primary">
            <Compass className="h-4 w-4" aria-hidden="true" />
            Catalog Progress
          </div>

          <div>
            <h3 className="text-lg font-bold text-text">You’ve explored {stats.playedCount} of {gamesCatalog.length} games</h3>
            <p className="mt-1 text-sm text-text-secondary">
              {stats.unplayed} games still waiting, and your most active genre is {stats.favoriteGenre}.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-text-muted">
              <span>Completion</span>
              <span className="font-semibold text-text">{stats.progress}%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-border">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stats.progress}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-warning"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-3 md:min-w-[280px]">
          <div className="rounded-xl border border-border bg-background/30 p-3">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-text-muted">
              <Trophy className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
              Played
            </div>
            <p className="mt-2 text-lg font-bold text-text">{stats.playedCount}</p>
          </div>

          <div className="rounded-xl border border-border bg-background/30 p-3">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-text-muted">
              <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              Unplayed
            </div>
            <p className="mt-2 text-lg font-bold text-text">{stats.unplayed}</p>
          </div>

          <div className="rounded-xl border border-border bg-background/30 p-3">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-text-muted">
              <Compass className="h-3.5 w-3.5 text-warning" aria-hidden="true" />
              Sessions
            </div>
            <p className="mt-2 text-lg font-bold text-text">{stats.totalSessions}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={discoverRandom}
          className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-95"
        >
          Try Something New
        </button>
      </div>
    </motion.section>
  );
});

export default CatalogProgressSection;
