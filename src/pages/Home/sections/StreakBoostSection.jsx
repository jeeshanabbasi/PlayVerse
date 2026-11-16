import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CalendarRange, Flame, Sparkles } from 'lucide-react';
import { useQuickPlay } from '@context/index';
import { gamesCatalog } from '@data/games';
import { getStoredItem, getStoredJson } from '@utils/index';

function readNumber(key) {
  const value = Number(getStoredItem(key) || 0);
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

function getStreakBoost() {
  const history = getStoredJson('playverse_history', []);
  const recentGames = Array.isArray(history) ? history.slice(0, 3) : [];

  const slots = recentGames.length > 0
    ? recentGames.map((id) => gamesCatalog.find((game) => game.id === id)).filter(Boolean)
    : gamesCatalog.slice(0, 3);

  const streak = slots.map((game) => ({
    ...game,
    lastPlayed: readNumber(`playverse.game.${game.id}.lastPlayed`),
    playCount: readNumber(`playverse.game.${game.id}.playCount`),
  }));

  const activeStreak = streak.filter((game) => game.lastPlayed > 0).length;
  const weeklyGoal = Math.max(3, streak.length + 2);

  return {
    streak: activeStreak,
    weeklyGoal,
    games: streak,
  };
}

export const StreakBoostSection = memo(function StreakBoostSection() {
  const { openGame } = useQuickPlay();
  const boost = useMemo(() => getStreakBoost(), []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      className="rounded-2xl border border-border bg-surface px-5 py-4"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-accent">
            <Flame className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-label text-accent">Streak Boost</p>
            <h3 className="mt-1 text-lg font-bold text-text">Keep your run alive</h3>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-text-muted">
          <Sparkles className="h-3.5 w-3.5 text-warning" aria-hidden="true" />
          {boost.streak}/{boost.weeklyGoal}
        </span>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {boost.games.map((game) => (
          <button
            key={game.id}
            type="button"
            onClick={() => openGame(game.id)}
            className="rounded-xl border border-border bg-background/30 p-3 text-left transition hover:border-accent/30 hover:bg-accent/5"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] uppercase tracking-wider text-text-muted">Session</span>
              <CalendarRange className="h-3.5 w-3.5 text-text-secondary" aria-hidden="true" />
            </div>

            <p className="mt-3 text-lg font-bold text-text">{game.title}</p>
            <p className="mt-1 text-xs text-text-secondary">{game.playCount} plays</p>
          </button>
        ))}
      </div>
    </motion.section>
  );
});

export default StreakBoostSection;
