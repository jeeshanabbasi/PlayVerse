import { memo, useEffect, useMemo, useState } from 'react';
import { CalendarRange, Flame, Gamepad2, Target, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@context/index';
import { gamesCatalog } from '@data/games';

const CLAIMS_KEY = 'playverse_weekly_challenge_claims';

function getWeekStart(date = new Date()) {
  const start = new Date(date);
  const day = start.getDay();
  const distance = day === 0 ? 6 : day - 1;
  start.setDate(start.getDate() - distance);
  start.setHours(0, 0, 0, 0);
  return start;
}

function getWeekKey(date = new Date()) {
  return getWeekStart(date).toISOString().slice(0, 10);
}

function getDaysUntilReset() {
  const nextWeek = getWeekStart();
  nextWeek.setDate(nextWeek.getDate() + 7);
  return Math.max(1, Math.ceil((nextWeek.getTime() - Date.now()) / 86_400_000));
}

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    const value = raw ? JSON.parse(raw) : fallback;
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function getWeeklyStats() {
  const weekStart = getWeekStart().getTime();
  let sessions = 0;
  let activeGames = 0;
  let bestScore = 0;
  let recentPlays = 0;

  gamesCatalog.forEach((game) => {
    const playCount = Number(localStorage.getItem(`playverse.game.${game.id}.playCount`) || 0);
    const lastPlayed = Number(localStorage.getItem(`playverse.game.${game.id}.lastPlayed`) || 0);
    const highScore = Number(localStorage.getItem(`playverse.game.${game.id}.highScore`) || 0);
    bestScore = Math.max(bestScore, highScore);

    if (lastPlayed >= weekStart) {
      activeGames += 1;
      recentPlays += 1;
    }
    sessions += playCount;
  });

  return { sessions, activeGames, bestScore, recentPlays };
}

const CHALLENGES = [
  {
    id: 'weekly-explorer',
    title: 'Arcade Explorer',
    description: 'Play 3 different games this week.',
    icon: Gamepad2,
    target: 3,
    progress: (stats) => stats.activeGames,
    reward: '400 XP',
  },
  {
    id: 'weekly-grinder',
    title: 'Keep The Combo',
    description: 'Complete 5 game sessions this week.',
    icon: Flame,
    target: 5,
    progress: (stats) => stats.sessions,
    reward: '500 XP',
  },
  {
    id: 'weekly-champion',
    title: 'Score Chaser',
    description: 'Set a high score of 1,000 or more.',
    icon: Trophy,
    target: 1000,
    progress: (stats) => stats.bestScore,
    reward: '650 XP',
  },
];

export const WeeklyChallengesSection = memo(function WeeklyChallengesSection() {
  const [refreshKey, setRefreshKey] = useState(0);
  const { success } = useToast();
  const weekKey = getWeekKey();

  useEffect(() => {
    const refresh = () => setRefreshKey((value) => value + 1);
    window.addEventListener('storage', refresh);
    window.addEventListener('playverse_stats_updated', refresh);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('playverse_stats_updated', refresh);
    };
  }, []);

  const challenges = useMemo(() => {
    const stats = getWeeklyStats();
    const claims = readJson(CLAIMS_KEY, {});
    const weekClaims = new Set(Array.isArray(claims[weekKey]) ? claims[weekKey] : []);

    return CHALLENGES.map((challenge) => {
      const progress = challenge.progress(stats);
      return {
        ...challenge,
        progress,
        percent: Math.min(100, (progress / challenge.target) * 100),
        isComplete: progress >= challenge.target,
        isClaimed: weekClaims.has(challenge.id),
      };
    });
  }, [refreshKey, weekKey]);

  const claimChallenge = (challenge) => {
    if (!challenge.isComplete || challenge.isClaimed) return;

    const claims = readJson(CLAIMS_KEY, {});
    const weekClaims = new Set(Array.isArray(claims[weekKey]) ? claims[weekKey] : []);
    weekClaims.add(challenge.id);
    localStorage.setItem(CLAIMS_KEY, JSON.stringify({ ...claims, [weekKey]: [...weekClaims] }));
    success('Weekly reward claimed!', `${challenge.title} redeemed for ${challenge.reward}.`);
    setRefreshKey((value) => value + 1);
  };

  const completedCount = challenges.filter((challenge) => challenge.isClaimed).length;

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1.5 text-center md:text-left">
          <p className="text-label text-accent">Weekly Challenges</p>
          <h2 className="text-heading-lg font-bold tracking-tight text-text">This Week in the Arcade</h2>
          <p className="text-body-md text-text-secondary">Three rotating missions. Fresh rewards every Monday.</p>
        </div>
        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-text-muted md:justify-end">
          <CalendarRange className="h-4 w-4 text-accent" aria-hidden="true" />
          <span>{getDaysUntilReset()} days left</span>
          <span className="text-border">|</span>
          <span>{completedCount}/{challenges.length} claimed</span>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {challenges.map((challenge) => {
          const Icon = challenge.icon;
          return (
            <motion.article
              key={challenge.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              className="rounded-2xl border border-border bg-surface p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-accent/25 bg-accent/10 text-accent">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="rounded-full border border-border bg-background px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-text-muted">
                  {challenge.reward}
                </span>
              </div>

              <h3 className="mt-4 text-base font-semibold text-text">{challenge.title}</h3>
              <p className="mt-1 min-h-10 text-sm text-text-secondary">{challenge.description}</p>

              <div className="mt-4 flex items-center justify-between text-xs text-text-muted">
                <span>{challenge.progress.toLocaleString()} / {challenge.target.toLocaleString()}</span>
                <span className="font-semibold">{Math.round(challenge.percent)}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-border">
                <div
                  className={`h-full rounded-full ${challenge.isComplete ? 'bg-primary' : 'bg-accent'}`}
                  style={{ width: `${challenge.percent}%` }}
                />
              </div>

              <button
                type="button"
                disabled={!challenge.isComplete || challenge.isClaimed}
                onClick={() => claimChallenge(challenge)}
                className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition-colors ${
                  challenge.isClaimed
                    ? 'cursor-default border-border bg-background text-text-muted'
                    : challenge.isComplete
                      ? 'border-primary/30 bg-primary/10 text-primary hover:bg-primary/15'
                      : 'cursor-not-allowed border-border bg-background text-text-muted'
                }`}
              >
                {challenge.isClaimed ? 'Claimed This Week' : challenge.isComplete ? <><Target className="h-4 w-4" aria-hidden="true" /> Claim Reward</> : 'In Progress'}
              </button>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
});

export default WeeklyChallengesSection;
