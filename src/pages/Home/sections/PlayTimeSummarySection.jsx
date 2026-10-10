import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Clock3, Gauge } from 'lucide-react';
import { gamesCatalog } from '@data/games';

function getPlayTimeSummary() {
  let totalSessions = 0;
  let avgScore = 0;
  let recentFocus = 'Arcade';

  const scores = [];
  const genreMap = {};

  gamesCatalog.forEach((game) => {
    const playCount = Number(localStorage.getItem(`playverse.game.${game.id}.playCount`) || 0);
    const score = Number(localStorage.getItem(`playverse.game.${game.id}.highScore`) || 0);

    totalSessions += playCount;
    if (score > 0) scores.push(score);

    if (playCount > 0) {
      game.genres.forEach((genre) => {
        genreMap[genre] = (genreMap[genre] || 0) + playCount;
      });
    }
  });

  avgScore = scores.length ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0;

  const topGenre = Object.entries(genreMap).sort((a, b) => b[1] - a[1])[0];
  if (topGenre) recentFocus = topGenre[0];

  return {
    totalSessions,
    avgScore,
    recentFocus,
  };
}

export const PlayTimeSummarySection = memo(function PlayTimeSummarySection() {
  const summary = useMemo(() => getPlayTimeSummary(), []);

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
            <Clock3 className="h-5 w-5" aria-hidden="true" />
          </span>

          <div>
            <p className="text-label text-accent">Play Summary</p>
            <h3 className="mt-1 text-lg font-bold text-text">{summary.totalSessions} total sessions</h3>
            <p className="mt-1 text-sm text-text-secondary">
              Average high score: {summary.avgScore.toLocaleString()} • Most active: {summary.recentFocus}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-border bg-background/30 px-3 py-2">
          <Gauge className="h-4 w-4 text-primary" aria-hidden="true" />
          <div>
            <p className="text-[10px] uppercase tracking-wider text-text-muted">Focus</p>
            <p className="text-sm font-bold text-text">{summary.recentFocus}</p>
          </div>
        </div>
      </div>
    </motion.section>
  );
});

export default PlayTimeSummarySection;
