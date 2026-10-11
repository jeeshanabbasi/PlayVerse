import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Dice5, Play } from 'lucide-react';
import { useQuickPlay } from '@context/index';
import { gamesCatalog } from '@data/games';

function getLuckyPick() {
  const played = gamesCatalog.filter((game) => {
    const count = Number(localStorage.getItem(`playverse.game.${game.id}.playCount`) || 0);
    return count > 0;
  });

  const pool = played.length > 0 ? played : gamesCatalog;
  const pick = pool[Math.floor(Math.random() * pool.length)];

  return pick || gamesCatalog[0];
}

export const LuckyPickSection = memo(function LuckyPickSection() {
  const { openGame } = useQuickPlay();
  const pick = useMemo(() => getLuckyPick(), []);

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
            <Dice5 className="h-5 w-5" aria-hidden="true" />
          </span>

          <div>
            <p className="text-label text-warning">Lucky Pick</p>
            <h3 className="mt-1 text-lg font-bold text-text">Try {pick.title}</h3>
            <p className="mt-1 text-sm text-text-secondary">
              A quick win from your personal library and recent sessions.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => openGame(pick.id)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-warning px-4 py-2.5 text-sm font-semibold text-warning-foreground transition hover:opacity-95"
        >
          <Play className="h-4 w-4" aria-hidden="true" />
          Play
        </button>
      </div>
    </motion.section>
  );
});

export default LuckyPickSection;
