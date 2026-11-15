import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Target, Zap } from 'lucide-react';
import { useQuickPlay } from '@context/index';
import { gamesCatalog } from '@data/games';
import { getStoredItem, getStoredJson } from '@utils/index';

const XP_PER_SESSION = 25;
const XP_PER_ACHIEVEMENT = 100;
const XP_PER_LEVEL = 500;

function readNonNegativeNumber(key) {
  const value = Number(getStoredItem(key) || 0);
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

function calculateXPGoals() {
  let totalXp = 0;

  gamesCatalog.forEach((game) => {
    const playCount = readNonNegativeNumber(`playverse.game.${game.id}.playCount`);
    totalXp += playCount * XP_PER_SESSION;

    const achievements = getStoredJson(`playverse.game.${game.id}.achievements`, []);
    const count = Array.isArray(achievements) ? achievements.length : 0;
    totalXp += count * XP_PER_ACHIEVEMENT;
  });

  const level = Math.floor(totalXp / XP_PER_LEVEL) + 1;
  const currentLevelXp = (level - 1) * XP_PER_LEVEL;
  const nextLevelXp = level * XP_PER_LEVEL;
  const xpInLevel = totalXp - currentLevelXp;
  const xpToNextLevel = nextLevelXp - totalXp;
  const progress = Math.min(100, (xpInLevel / XP_PER_LEVEL) * 100);

  const history = getStoredJson('playverse_history', []);
  const lastSlug = Array.isArray(history) ? history[0] : null;
  const suggestedGame = gamesCatalog.find((game) => game.id === lastSlug) || gamesCatalog[0];

  return {
    totalXp,
    level,
    xpToNextLevel: Math.max(0, xpToNextLevel),
    progress,
    suggestedGame,
    nextLevelXp,
  };
}

export const XPGoalSection = memo(function XPGoalSection() {
  const { openGame } = useQuickPlay();
  const goal = useMemo(() => calculateXPGoals(), []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      className="rounded-2xl border border-primary/25 bg-gradient-to-r from-primary/10 via-surface to-surface px-5 py-4"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
            <Target className="h-5 w-5" aria-hidden="true" />
          </span>

          <div>
            <p className="text-label text-primary">XP Goal</p>
            <h3 className="mt-1 text-lg font-bold text-text">Level {goal.level} chase</h3>
            <p className="mt-1 text-sm text-text-secondary">
              {goal.xpToNextLevel.toLocaleString()} XP left to unlock level {goal.level + 1}.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => openGame(goal.suggestedGame.id)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-95"
        >
          <Zap className="h-4 w-4" aria-hidden="true" />
          Push forward
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-4 rounded-xl border border-border bg-background/30 p-3">
        <div className="mb-2 flex items-center justify-between gap-3 text-xs text-text-secondary">
          <span>Progress to next rank</span>
          <span>{Math.min(100, Math.round(goal.progress))}%</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-primary"
            style={{ width: `${Math.max(6, Math.min(100, goal.progress))}%` }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-text-secondary">
          <span>{goal.totalXp.toLocaleString()} XP earned</span>
          <span>{goal.nextLevelXp.toLocaleString()} target</span>
        </div>
      </div>
    </motion.section>
  );
});

export default XPGoalSection;
