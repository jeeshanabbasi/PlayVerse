import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Flame, Trophy, Zap } from 'lucide-react';
import { useQuickPlay } from '@context/index';
import { gamesCatalog } from '@data/games';
import { getStoredItem, getStoredJson } from '@utils/index';

function readNumber(key) {
  const value = Number(getStoredItem(key) || 0);
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

function buildMomentum() {
  const history = getStoredJson('playverse_history', []);
  const totalSessions = Array.isArray(history) ? history.length : 0;

  const games = gamesCatalog.map((game) => ({
    ...game,
    playCount: readNumber(`playverse.game.${game.id}.playCount`),
    highScore: readNumber(`playverse.game.${game.id}.highScore`),
  }));

  const totalPlays = games.reduce((sum, game) => sum + game.playCount, 0);
  const uniquePlayed = games.filter((game) => game.playCount > 0).length;
  const allTimeBest = games.reduce((max, game) => Math.max(max, game.highScore), 0);

  const topGame = games.reduce((best, game) =>
    game.playCount > best.playCount || (game.playCount === best.playCount && game.highScore > best.highScore)
      ? game
      : best,
  games[0] ?? { id: 'asteroids', title: 'Asteroids', playCount: 0, highScore: 0 });

  const milestones = [
    { label: 'Starter streak', target: 10, reward: '3 more sessions' },
    { label: 'Arcade regular', target: 25, reward: '5 more sessions' },
    { label: 'Legend run', target: 50, reward: '8 more sessions' },
  ];

  const nextMilestone = milestones.find((milestone) => totalPlays < milestone.target) ?? milestones[milestones.length - 1];
  const progress = Math.min(100, (totalPlays / nextMilestone.target) * 100);

  return {
    totalSessions,
    totalPlays,
    uniquePlayed,
    allTimeBest,
    topGame,
    nextMilestone,
    progress,
  };
}

export const ArcadeMomentumSection = memo(function ArcadeMomentumSection() {
  const { openGame } = useQuickPlay();
  const momentum = useMemo(() => buildMomentum(), []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      className="rounded-2xl border border-border bg-surface px-5 py-4"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-warning/20 bg-warning/10 text-warning">
            <Flame className="h-5 w-5" aria-hidden="true" />
          </span>

          <div>
            <p className="text-label text-warning">Arcade Momentum</p>
            <h3 className="mt-1 text-lg font-bold text-text">You’re building a strong run</h3>
            <p className="mt-1 text-sm text-text-secondary">
              {momentum.nextMilestone.reward} to reach the next milestone.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => openGame(momentum.topGame.id)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-warning px-4 py-2.5 text-sm font-semibold text-warning-foreground transition hover:opacity-95"
        >
          <Zap className="h-4 w-4" aria-hidden="true" />
          Play top game
        </button>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-background/30 p-3">
          <p className="text-[10px] uppercase tracking-wider text-text-muted">Total sessions</p>
          <p className="mt-2 text-2xl font-bold text-text">{momentum.totalSessions}</p>
        </div>

        <div className="rounded-xl border border-border bg-background/30 p-3">
          <p className="text-[10px] uppercase tracking-wider text-text-muted">Games played</p>
          <p className="mt-2 text-2xl font-bold text-text">{momentum.uniquePlayed}</p>
        </div>

        <div className="rounded-xl border border-border bg-background/30 p-3">
          <p className="text-[10px] uppercase tracking-wider text-text-muted">Best score</p>
          <p className="mt-2 text-2xl font-bold text-text">{momentum.allTimeBest.toLocaleString()}</p>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-border bg-background/30 p-3">
        <div className="mb-2 flex items-center justify-between gap-3 text-xs text-text-secondary">
          <span className="inline-flex items-center gap-1.5">
            <Trophy className="h-3.5 w-3.5 text-warning" aria-hidden="true" />
            {momentum.nextMilestone.label}
          </span>
          <span>{Math.min(100, Math.round(momentum.progress))}%</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-gradient-to-r from-warning to-accent"
            style={{ width: `${Math.min(100, Math.max(8, momentum.progress))}%` }}
          />
        </div>
      </div>
    </motion.section>
  );
});

export default ArcadeMomentumSection;
