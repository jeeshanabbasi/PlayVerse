import { memo, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Compass, Play } from 'lucide-react';
import { useQuickPlay } from '@context/index';
import { gamesCatalog } from '@data/games';

function getUnplayedGame() {
  const unplayed = gamesCatalog.filter((game) => {
    const count = Number(localStorage.getItem(`playverse.game.${game.id}.playCount`) || 0);
    return count === 0;
  });

  if (unplayed.length > 0) {
    return unplayed[Math.floor(Math.random() * unplayed.length)];
  }

  return gamesCatalog[Math.floor(Math.random() * gamesCatalog.length)] || gamesCatalog[0];
}

export const UnplayedSpotlightSection = memo(function UnplayedSpotlightSection() {
  const { openGame } = useQuickPlay();
  const [game, setGame] = useState(() => getUnplayedGame());

  const statusText = useMemo(() => {
    const totalUnplayed = gamesCatalog.filter((item) => {
      const count = Number(localStorage.getItem(`playverse.game.${item.id}.playCount`) || 0);
      return count === 0;
    }).length;

    if (totalUnplayed > 0) {
      return `${totalUnplayed} unseen games still waiting`;
    }

    return 'You have explored the catalog—try a favorite again';
  }, [game]);

  const nextPick = () => setGame(getUnplayedGame());

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      className="rounded-2xl border border-border bg-surface px-5 py-4"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-accent">
            <Compass className="h-5 w-5" aria-hidden="true" />
          </span>

          <div>
            <p className="text-label text-accent">Fresh Discovery</p>
            <h3 className="mt-1 text-lg font-bold text-text">Try {game.title}</h3>
            <p className="mt-1 text-sm text-text-secondary">{statusText}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={nextPick}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm font-medium text-text-secondary transition hover:border-accent/30 hover:text-text"
          >
            Next
          </button>

          <button
            type="button"
            onClick={() => openGame(game.id)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground transition hover:opacity-95"
          >
            <Play className="h-4 w-4" aria-hidden="true" />
            Play
          </button>
        </div>
      </div>
    </motion.section>
  );
});

export default UnplayedSpotlightSection;
