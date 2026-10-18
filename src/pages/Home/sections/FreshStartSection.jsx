import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Play } from 'lucide-react';
import { useQuickPlay } from '@context/index';
import { gamesCatalog } from '@data/games';

function getFreshStarts() {
  const unplayed = gamesCatalog
    .map((game) => ({
      ...game,
      plays: Number(localStorage.getItem(`playverse.game.${game.id}.playCount`) || 0),
    }))
    .filter((game) => game.plays === 0)
    .slice(0, 3);

  return unplayed.length > 0 ? unplayed : gamesCatalog.slice(0, 3).map((game) => ({ ...game, plays: 0 }));
}

export const FreshStartSection = memo(function FreshStartSection() {
  const { openGame } = useQuickPlay();
  const picks = useMemo(() => getFreshStarts(), []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      className="rounded-2xl border border-border bg-surface px-5 py-4"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
            <Rocket className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-label text-primary">Fresh Start</p>
            <h3 className="mt-1 text-lg font-bold text-text">Games you haven’t touched yet</h3>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {picks.map((game) => (
          <button
            key={game.id}
            type="button"
            onClick={() => openGame(game.id)}
            className="rounded-xl border border-border bg-background/30 p-3 text-left transition hover:border-primary/30 hover:bg-primary/5"
          >
            <p className="text-[10px] uppercase tracking-wider text-text-muted">New run</p>
            <p className="mt-2 text-lg font-bold text-text">{game.title}</p>
            <p className="mt-1 text-xs text-text-secondary">{game.genres?.[0] ?? 'Arcade'} challenge</p>
            <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
              <Play className="h-3.5 w-3.5" aria-hidden="true" />
              Start
            </span>
          </button>
        ))}
      </div>
    </motion.section>
  );
});

export default FreshStartSection;
