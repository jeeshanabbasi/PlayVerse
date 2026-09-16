import { memo, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, Flame, Swords, Trophy } from 'lucide-react';
import { useQuickPlay } from '@context/index';
import { gamesCatalog } from '@data/games';
import { playUiClick } from '@utils/index';

const TOURNAMENT_KEY = 'playverse_arcade_tournament';
const TOURNAMENT_GAMES = ['snake', '2048', 'tetris', 'flappy-bird'];

function readTournamentState() {
  try {
    const raw = localStorage.getItem(TOURNAMENT_KEY);
    if (!raw) {
      return { entered: false, completed: 0, points: 0 };
    }
    const parsed = JSON.parse(raw);
    return {
      entered: Boolean(parsed.entered),
      completed: Number(parsed.completed) || 0,
      points: Number(parsed.points) || 0,
    };
  } catch {
    return { entered: false, completed: 0, points: 0 };
  }
}

function getTournamentProgress() {
  const state = readTournamentState();
  const entries = TOURNAMENT_GAMES.map((slug) => {
    const game = gamesCatalog.find((item) => item.id === slug);
    const highScore = Number(localStorage.getItem(`playverse.game.${slug}.highScore`) || 0);
    const playCount = Number(localStorage.getItem(`playverse.game.${slug}.playCount`) || 0);
    return {
      slug,
      game,
      highScore,
      playCount,
      points: Math.min(600, Math.round(highScore / 2 + playCount * 10)),
    };
  });

  const totalPoints = entries.reduce((sum, item) => sum + item.points, 0);
  const maxPoints = entries.length * 600;
  const progress = Math.min(100, (totalPoints / maxPoints) * 100);

  return { ...state, entries, totalPoints, maxPoints, progress };
}

export const TournamentSection = memo(function TournamentSection() {
  const { openGame } = useQuickPlay();
  const [status, setStatus] = useState(() => readTournamentState());
  const data = useMemo(() => getTournamentProgress(), [status]);

  const enterTournament = () => {
    playUiClick();
    const next = {
      entered: true,
      completed: Math.max(status.completed, 1),
      points: data.totalPoints,
    };
    localStorage.setItem(TOURNAMENT_KEY, JSON.stringify(next));
    setStatus(next);
    openGame('snake');
  };

  const topEntry = [...data.entries].sort((a, b) => b.points - a.points)[0];

  return (
    <section className="space-y-6 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-surface to-surface/80 p-6 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-label text-primary">Arcade Cup</p>
          <h2 className="text-heading-lg font-bold text-text">Weekend Tournament</h2>
          <p className="text-body-md text-text-secondary">
            Chase the crown by pushing your best scores across the most popular browser games.
          </p>
        </div>

        <button
          type="button"
          onClick={enterTournament}
          className="btn-primary"
        >
          <Swords className="h-4 w-4" aria-hidden="true" />
          {status.entered ? 'Continue Cup' : 'Enter Cup'}
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-text-secondary">
            <span className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-warning" aria-hidden="true" />
              Cup progress
            </span>
            <span className="font-semibold text-text">{Math.round(data.progress)}%</span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-border">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${data.progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-warning"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {data.entries.map((entry) => (
              <div key={entry.slug} className="rounded-xl border border-border bg-background/30 p-3">
                <p className="text-[10px] uppercase tracking-wider text-text-muted">{entry.game?.title || entry.slug}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm font-semibold text-text">{entry.highScore.toLocaleString()} pts</span>
                  <span className="text-[10px] font-bold text-primary">+{entry.points}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-background/35 p-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-muted">
            <Crown className="h-4 w-4 text-warning" aria-hidden="true" />
            Leaderboard snapshot
          </div>

          <div className="mt-4 space-y-3">
            {[topEntry, ...data.entries.filter((item) => item.slug !== topEntry.slug)].slice(0, 3).map((entry, index) => (
              <div key={entry.slug} className="flex items-center justify-between rounded-xl border border-border px-3 py-2">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-[10px] font-bold text-primary">
                    #{index + 1}
                  </span>
                  <span className="text-sm text-text">{entry.game?.title || entry.slug}</span>
                </div>
                <span className="text-sm font-bold text-text">{entry.points}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-xl border border-primary/20 bg-primary/10 p-3 text-sm text-text-secondary">
            <div className="flex items-center gap-2 text-primary">
              <Trophy className="h-4 w-4" aria-hidden="true" />
              <span className="font-semibold text-text">Cup reward</span>
            </div>
            <p className="mt-2">Reach 80% progress to unlock the exclusive neon badge set and 500 bonus XP.</p>
          </div>
        </div>
      </div>
    </section>
  );
});

export default TournamentSection;
