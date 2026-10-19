import { memo } from 'react';
import { CalendarDays, Play } from 'lucide-react';
import { useQuickPlay } from '@context/index';
import { gamesCatalog } from '@data/games';

function getDailyPick() {
  if (gamesCatalog.length === 0) return null;

  const today = new Date();
  const daySeed = today.getFullYear() * 372 + today.getMonth() * 31 + today.getDate();
  return gamesCatalog[daySeed % gamesCatalog.length];
}

export const DailyArcadePick = memo(function DailyArcadePick() {
  const { openGame } = useQuickPlay();
  const game = getDailyPick();

  if (!game) return null;

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-4 sm:flex-row sm:items-center">
      <img
        src={game.image}
        alt=""
        className="h-24 w-full rounded-xl object-cover sm:w-36"
        loading="lazy"
      />
      <div className="min-w-0 flex-1">
        <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-accent">
          <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
          Daily arcade pick
        </p>
        <h2 className="mt-1 text-lg font-bold text-text">{game.title}</h2>
        <p className="mt-1 text-sm text-text-secondary">
          {game.genres?.[0] ?? 'Arcade'} · {game.difficulty ?? 'All levels'}
        </p>
      </div>
      <button
        type="button"
        onClick={() => openGame(game.id)}
        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground transition hover:opacity-90"
      >
        <Play className="h-4 w-4" aria-hidden="true" />
        Play today’s pick
      </button>
    </section>
  );
});

export default DailyArcadePick;