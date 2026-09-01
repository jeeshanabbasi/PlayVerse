import { memo, useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Zap, Star } from 'lucide-react';
import { gamesCatalog } from '@data/games';
import { CircularProgress } from '@ui';

const STORAGE_PREFIX = 'playverse.game';
const XP_PER_SESSION = 25;
const XP_PER_ACHIEVEMENT = 100;
const XP_PER_LEVEL = 500;

function calculatePlayerStats() {
  try {
    let totalXp = 0;
    
    gamesCatalog.forEach((game) => {
      const playCount = Number(localStorage.getItem(`${STORAGE_PREFIX}.${game.id}.playCount`) || 0);
      totalXp += playCount * XP_PER_SESSION;
      
      const achievementsRaw = localStorage.getItem(`${STORAGE_PREFIX}.${game.id}.achievements`);
      const achievements = achievementsRaw ? JSON.parse(achievementsRaw) : [];
      totalXp += (Array.isArray(achievements) ? achievements.length : 0) * XP_PER_ACHIEVEMENT;
    });

    const level = Math.floor(totalXp / XP_PER_LEVEL) + 1;
    const currentLevelXp = (level - 1) * XP_PER_LEVEL;
    const nextLevelXp = level * XP_PER_LEVEL;
    const xpInLevel = totalXp - currentLevelXp;
    const xpToNextLevel = nextLevelXp - currentLevelXp;
    const xpPercent = (xpInLevel / xpToNextLevel) * 100;

    return {
      totalXp,
      level,
      xpInLevel,
      xpToNextLevel,
      xpPercent,
      nextMilestone: nextLevelXp,
    };
  } catch {
    return {
      totalXp: 0,
      level: 1,
      xpInLevel: 0,
      xpToNextLevel: XP_PER_LEVEL,
      xpPercent: 0,
      nextMilestone: XP_PER_LEVEL,
    };
  }
}

function ProfileLevelCardComponent() {
  const [stats, setStats] = useState(calculatePlayerStats);

  useEffect(() => {
    const refresh = () => setStats(calculatePlayerStats());
    window.addEventListener('playverse_stats_updated', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('playverse_stats_updated', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  const levelMilestones = useMemo(() => {
    const levels = [];
    for (let i = 1; i <= Math.min(stats.level + 1, 10); i++) {
      levels.push({
        level: i,
        xp: (i - 1) * XP_PER_LEVEL,
        isReached: i <= stats.level,
      });
    }
    return levels;
  }, [stats.level]);

  const nextReward = Math.max(500, (stats.level + 1) * 25);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45 }}
      className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-surface to-surface/50 backdrop-blur-sm"
    >
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-l from-primary/15 to-transparent blur-3xl -z-10" aria-hidden="true" />

      <div className="p-6 md:p-8 space-y-8">
        {/* Header with profile summary */}
        <div className="grid gap-6 md:grid-cols-[1fr_auto]">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
                <Zap className="h-3.5 w-3.5 fill-current" />
                Player Progression
              </span>
            </div>
            <h2 className="text-display-md font-bold text-text">Level {stats.level}</h2>
            <p className="text-body-md text-text-secondary">
              You've earned {stats.totalXp.toLocaleString('en-US')} total XP across all your games.
            </p>
          </div>

          {/* Circular progress for level */}
          <div className="flex items-center justify-center md:justify-end">
            <div className="relative">
              <CircularProgress value={stats.xpPercent} size={120}>
                <div className="text-center">
                  <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Progress</p>
                  <p className="text-lg font-bold text-primary">{Math.round(stats.xpPercent)}%</p>
                </div>
              </CircularProgress>
            </div>
          </div>
        </div>

        {/* XP progress bar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-text">Experience to Next Level</span>
            <span className="text-xs font-mono font-bold text-text-secondary">
              {stats.xpInLevel.toLocaleString('en-US')} / {stats.xpToNextLevel.toLocaleString('en-US')}
            </span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-border/50">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stats.xpPercent}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-primary"
            />
          </div>
        </div>

        {/* Reward preview */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-start gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
              <Gift className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-text">Next Level Reward</p>
              <p className="text-xs text-text-secondary mt-0.5">
                Reach Level {stats.level + 1} to claim {nextReward} bonus XP.
              </p>
            </div>
          </div>
        </div>

        {/* Level milestones */}
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-text-muted">Your Journey</p>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {levelMilestones.map((milestone) => (
              <motion.div
                key={milestone.level}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: milestone.level * 0.05 }}
                className={`flex shrink-0 flex-col items-center gap-1.5 rounded-xl border px-3 py-2 text-center ${
                  milestone.isReached
                    ? 'border-primary/40 bg-primary/10'
                    : 'border-border/50 bg-surface/40'
                }`}
              >
                <span className={`text-xs font-bold ${milestone.isReached ? 'text-primary' : 'text-text-muted'}`}>
                  L{milestone.level}
                </span>
                <span className={`text-[10px] ${milestone.isReached ? 'text-primary' : 'text-text-muted'}`}>
                  {milestone.xp.toLocaleString('en-US')} XP
                </span>
                {milestone.isReached && (
                  <Star className="h-3 w-3 fill-primary text-primary" aria-hidden="true" />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3 rounded-xl border border-border/50 bg-surface/30 p-4">
          <div className="text-center">
            <p className="text-2xl font-bold tabular-nums text-primary">{stats.level}</p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-text-muted">Level</p>
          </div>
          <div className="border-l border-r border-border/50">
            <p className="text-2xl font-bold tabular-nums text-accent text-center">{stats.xpInLevel.toLocaleString('en-US')}</p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-text-muted text-center">This Level</p>
          </div>
          <div>
            <p className="text-2xl font-bold tabular-nums text-text text-center">{stats.totalXp.toLocaleString('en-US')}</p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-text-muted text-center">Total XP</p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

export const ProfileLevelCard = memo(ProfileLevelCardComponent);
export default ProfileLevelCard;

function Gift({ className, ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <polyline points="20 12 20 22 4 22 4 12" />
      <rect x="2" y="7" width="20" height="5" />
      <path d="M12 2v5" />
      <path d="M9 7h6" />
    </svg>
  );
}
