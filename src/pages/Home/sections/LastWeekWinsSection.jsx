import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Medal } from 'lucide-react';
import { gamesCatalog } from '@data/games';

function getLastWeekWins() {
  const today = new Date();
  const results = [];

  gamesCatalog.forEach((game) => {
    const highScore = Number(localStorage.getItem(`playverse.game.${game.id}.highScore`) || 0);
    const playCount = Number(localStorage.getItem(`playverse.game.${game.id}.playCount`) || 0);

    if (highScore > 0 || playCount > 0) {
      results.push({
        title: game.title,
        score: highScore,
        plays: playCount,
        slug: game.id,
      });
    }
  });

  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

export const LastWeekWinsSection = memo(function LastWeekWinsSection() {
  const topWins = useMemo(() => getLastWeekWins(), []);

  if (topWins.length === 0) {
    return null;
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      className="rounded-2xl border border-border bg-surface px-5 py-4"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-warning/20 bg-warning/10 text-warning">
            <Medal className="h-5 w-5" aria-hidden="true" />
          </span>

          <div>
            <p className="text-label text-warning">Top Wins</p>
            <h3 className="mt-1 text-lg font-bold text-text">Your best moments</h3>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-text-muted">
          Last activity
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {topWins.map((item, index) => (
          <div key={item.slug} className="rounded-xl border border-border bg-background/30 p-3">
            <p className="text-[10px] uppercase tracking-wider text-text-muted">#{index + 1}</p>
            <h4 className="mt-2 text-sm font-semibold text-text">{item.title}</h4>
            <p className="mt-2 text-lg font-bold text-primary">{item.score.toLocaleString()}</p>
            <p className="mt-1 text-xs text-text-secondary">{item.plays} plays</p>
          </div>
        ))}
      </div>
    </motion.section>
  );
});

export default LastWeekWinsSection;
