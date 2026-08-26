import { memo } from 'react';
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

export const DailyChallengeSection = memo(function DailyChallengeSection() {
  const { openGame } = useQuickPlay();
  const game = getDailyGame();
  const { hours, minutes, expired } = useCountdown(getNextReset());

  const launchChallenge = () => {
    playUiClick();
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
            Play Challenge
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
            <p className="text-sm text-text-secondary">Your best score is saved automatically.</p>
          </div>
        </div>
      </div>
    </motion.section>
  );
});

export default DailyChallengeSection;
