import { memo, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, Sparkles, Star, Trophy } from 'lucide-react';
import { useToast } from '@context/index';
import { gamesCatalog } from '@data/games';

const PASS_KEY = 'playverse_season_pass';

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : fallback;
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function getSeasonStats() {
  let totalSessions = 0;
  let totalAchievements = 0;
  let challengeDays = 0;

  gamesCatalog.forEach((game) => {
    const sessions = Number(localStorage.getItem(`playverse.game.${game.id}.playCount`) || 0);
    totalSessions += sessions;

    try {
      const raw = localStorage.getItem(`playverse.game.${game.id}.achievements`);
      const achievements = raw ? JSON.parse(raw) : [];
      totalAchievements += Array.isArray(achievements) ? achievements.length : 0;
    } catch {
      // ignore malformed payload
    }
  });

  const dailyHistory = readJson('playverse_daily_history', []);
  challengeDays = Array.isArray(dailyHistory) ? dailyHistory.length : 0;

  return { totalSessions, totalAchievements, challengeDays };
}

const PASS_TIERS = [
  {
    id: 'bronze',
    title: 'Bronze Pulse',
    reward: 'Neon avatar frame',
    target: 4,
    description: 'Reach 4 total game sessions',
    progress: (stats) => stats.totalSessions,
    accent: 'from-warning/20 to-warning/5',
  },
  {
    id: 'silver',
    title: 'Silver Circuit',
    reward: '250 bonus XP',
    target: 6,
    description: 'Unlock 6 across all achievements',
    progress: (stats) => stats.totalAchievements,
    accent: 'from-primary/20 to-primary/5',
  },
  {
    id: 'gold',
    title: 'Gold Rush',
    reward: 'Exclusive badge set',
    target: 3,
    description: 'Keep 3 daily challenge streaks alive',
    progress: (stats) => stats.challengeDays,
    accent: 'from-accent/20 to-accent/5',
  },
];

export const SeasonalPassSection = memo(function SeasonalPassSection() {
  const [refreshKey, setRefreshKey] = useState(0);
  const { success } = useToast();

  useEffect(() => {
    const refresh = () => setRefreshKey((value) => value + 1);
    window.addEventListener('storage', refresh);
    window.addEventListener('playverse_stats_updated', refresh);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('playverse_stats_updated', refresh);
    };
  }, []);

  const passData = useMemo(() => {
    const stats = getSeasonStats();
    const claimed = new Set(readJson(PASS_KEY, []));

    return PASS_TIERS.map((tier) => {
      const progress = tier.progress(stats);
      const isComplete = progress >= tier.target;
      const isClaimed = claimed.has(tier.id);
      return {
        ...tier,
        progress,
        isComplete,
        isClaimed,
        percent: Math.min(100, (progress / tier.target) * 100),
      };
    });
  }, [refreshKey]);

  const claimTier = (tierId) => {
    const claimed = new Set(readJson(PASS_KEY, []));
    const tier = passData.find((entry) => entry.id === tierId);
    if (!tier || !tier.isComplete || claimed.has(tierId)) return;

    claimed.add(tierId);
    localStorage.setItem(PASS_KEY, JSON.stringify([...claimed]));
    success('Season pass reward unlocked!', `${tier.title} reward claimed: ${tier.reward}.`);
    setRefreshKey((value) => value + 1);
  };

  const unlockedCount = passData.filter((tier) => tier.isClaimed).length;

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-1.5 text-center md:text-left">
        <p className="text-label text-primary">Seasonal Pass</p>
        <h2 className="text-heading-lg font-bold tracking-tight text-text">Neon Nights Event</h2>
        <p className="text-body-md text-text-secondary">Complete seasonal objectives and unlock premium arcade rewards for the current event cycle.</p>
      </div>

      <div className="rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/8 via-surface to-surface p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Current Season</p>
            <p className="mt-1 text-xl font-bold text-text">Neon Nights 2026</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text-muted">
            <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            {unlockedCount}/{passData.length} rewards unlocked
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {passData.map((tier) => (
          <motion.div
            key={tier.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            className={`rounded-2xl border border-border bg-gradient-to-br ${tier.accent} p-5`}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface/60 text-primary">
                {tier.id === 'bronze' ? <Star className="h-4 w-4" aria-hidden="true" /> : tier.id === 'silver' ? <Trophy className="h-4 w-4" aria-hidden="true" /> : <Gift className="h-4 w-4" aria-hidden="true" />}
              </span>
              <span className="rounded-full border border-border bg-surface/60 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-text-muted">
                {tier.reward}
              </span>
            </div>

            <h3 className="mt-4 text-base font-semibold text-text">{tier.title}</h3>
            <p className="mt-1 text-sm text-text-secondary">{tier.description}</p>

            <div className="mt-4 flex items-center justify-between text-xs text-text-muted">
              <span>{tier.progress} / {tier.target}</span>
              <span>{Math.round(tier.percent)}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-border/60">
              <div
                className={`h-full rounded-full ${tier.isComplete ? 'bg-primary' : 'bg-accent'}`}
                style={{ width: `${tier.percent}%` }}
              />
            </div>

            <button
              type="button"
              disabled={!tier.isComplete || tier.isClaimed}
              onClick={() => claimTier(tier.id)}
              className={`mt-5 w-full rounded-xl border px-3 py-2 text-sm font-semibold transition-all ${
                tier.isClaimed
                  ? 'cursor-default border-border bg-surface text-text-muted'
                  : tier.isComplete
                    ? 'border-primary/30 bg-primary/10 text-primary hover:bg-primary/15'
                    : 'cursor-not-allowed border-border bg-surface text-text-muted'
              }`}
            >
              {tier.isClaimed ? 'Unlocked' : tier.isComplete ? 'Claim Reward' : 'Locked'}
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
});

export default SeasonalPassSection;
