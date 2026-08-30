import { memo, useEffect, useState } from 'react';
import { CalendarDays, Flame, Play, TimerReset } from 'lucide-react';
import { motion } from 'framer-motion';
import { gamesCatalog } from '@data/games';
import { useQuickPlay } from '@context/index';
import { useCountdown } from './shared';
import { playUiClick } from '@utils/index';

function getDailyGame() {
  const dayNumber = Math.floor(Date.now() / 86_400_000);
  return gamesCatalog[dayNumber % gamesCatalog.length] || gamesCatalog[0];
}

function getNextReset() {
  const nextDay = new Date();
  nextDay.setHours(24, 0, 0, 0);
  return nextDay.toISOString();
}

function getDateKey(date = new Date()) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next.toISOString().slice(0, 10);
}

function getStreakStats() {
  try {
    const raw = localStorage.getItem('playverse_daily_history');
    const entries = raw ? JSON.parse(raw) : [];
    const seen = new Set(Array.isArray(entries) ? entries : []);

    if (!seen.size) {
      return { currentStreak: 0, bestStreak: 0, totalDays: 0, recentDays: [] };
    }

    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let cursor = new Date(today);
    while (seen.has(getDateKey(cursor))) {
      currentStreak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }

    const sorted = [...seen].sort();
    let bestStreak = 0;
    let runCount = 0;
    let previous = null;

    sorted.forEach((key) => {
      const date = new Date(`${key}T00:00:00`);
      if (previous && date.getTime() - previous.getTime() === 86400000) {
        runCount += 1;
      } else {
        runCount = 1;
      }
      bestStreak = Math.max(bestStreak, runCount);
      previous = date;
    });

    const recentDays = Array.from({ length: 7 }, (_, index) => {
      const day = new Date(today);
      day.setDate(today.getDate() - (6 - index));
      const key = getDateKey(day);
      return { key, active: seen.has(key), label: day.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 1) };
    });

    return {
      currentStreak,
      bestStreak,
      totalDays: sorted.length,
      recentDays,
    };
  } catch {
    return { currentStreak: 0, bestStreak: 0, totalDays: 0, recentDays: [] };
  }
}

export const DailyChallengeSection = memo(function DailyChallengeSection() {
  const { openGame } = useQuickPlay();
  const game = getDailyGame();
  const { hours, minutes, expired } = useCountdown(getNextReset());
  const dateKey = getDateKey();
  const [attempted, setAttempted] = useState(() => localStorage.getItem(`playverse_daily_${dateKey}`) === 'true');
  const [streakStats, setStreakStats] = useState(getStreakStats);

  useEffect(() => {
    const refresh = () => {
      setAttempted(localStorage.getItem(`playverse_daily_${dateKey}`) === 'true');
      setStreakStats(getStreakStats());
    };
    refresh();
    window.addEventListener('storage', refresh);
    window.addEventListener('playverse_stats_updated', refresh);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('playverse_stats_updated', refresh);
    };
  }, [dateKey]);

  const launchChallenge = () => {
    playUiClick();
    localStorage.setItem(`playverse_daily_${dateKey}`, 'true');
    const history = JSON.parse(localStorage.getItem('playverse_daily_history') || '[]');
    const next = Array.isArray(history) ? history : [];
    if (!next.includes(dateKey)) {
      next.push(dateKey);
      localStorage.setItem('playverse_daily_history', JSON.stringify(next));
    }
    setAttempted(true);
    setStreakStats(getStreakStats());
    openGame(game.id);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45 }}
      className="relative overflow-hidden rounded-2xl border border-accent/30 bg-surface"
      aria-labelledby="daily-challenge-title"
    >
      <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-accent/15 to-transparent" aria-hidden="true" />
      <div className="relative grid items-stretch md:grid-cols-[minmax(0,1fr)_minmax(260px,0.75fr)]">
        <div className="space-y-5 p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-widest">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1.5 text-accent">
              <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
              Daily Challenge
            </span>
            <span className="inline-flex items-center gap-1.5 text-text-muted">
              <Flame className="h-3.5 w-3.5 text-warning" aria-hidden="true" />
              New every day
            </span>
          </div>
          <div className="space-y-2">
            <h2 id="daily-challenge-title" className="text-heading-lg font-bold text-text md:text-display-md">
              Master {game.title}
            </h2>
            <p className="max-w-xl text-body-md text-text-secondary">
              Take today&apos;s featured run and beat your personal best before the challenge resets.
            </p>
          </div>
          <button
            type="button"
            onClick={launchChallenge}
            className="btn-primary"
          >
            <Play className="h-4 w-4 fill-current" aria-hidden="true" />
            {attempted ? 'Play Again' : 'Play Challenge'}
          </button>
        </div>

        <div className="relative min-h-48 overflow-hidden border-t border-border md:border-l md:border-t-0">
          <img src={game.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/45 to-transparent" />
          <div className="relative flex h-full flex-col justify-end gap-2 p-6">
            <p className="text-label text-accent">Resets in</p>
            <p className="flex items-center gap-2 text-2xl font-bold tabular-nums text-text">
              <TimerReset className="h-5 w-5 text-accent" aria-hidden="true" />
              {expired ? '00h 00m' : `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m`}
            </p>
            <p className="text-sm text-text-secondary">{attempted ? 'Attempt logged today. Beat your best score.' : "Your first attempt starts today's streak."}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-border bg-surface/40 p-4 md:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Streak Tracker</p>
            <p className="mt-1 text-2xl font-bold text-text">{streakStats.currentStreak} days</p>
          </div>
          <div className="flex items-center gap-4 text-sm text-text-secondary">
            <span>Best: <strong className="text-text">{streakStats.bestStreak}</strong></span>
            <span>Days: <strong className="text-text">{streakStats.totalDays}</strong></span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-7 gap-2">
          {streakStats.recentDays.map((day) => (
            <div key={day.key} className="flex flex-col items-center gap-1">
              <span className="text-[10px] text-text-muted">{day.label}</span>
              <span className={`flex h-7 w-full rounded-md border ${day.active ? 'border-primary/40 bg-primary/15 text-primary' : 'border-border bg-surface text-text-muted'}`} />
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
});

export default DailyChallengeSection;
