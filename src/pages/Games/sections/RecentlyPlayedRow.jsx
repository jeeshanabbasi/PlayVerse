import { memo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Trophy } from 'lucide-react';
import { Section } from '@components/layout';
import { useQuickPlay } from '@context/index';
import { gamesCatalog } from '@data/games';
import { staggerContainer, staggerItem } from '@utils/index';

function readRecentlyPlayed() {
  try {
    const history = JSON.parse(localStorage.getItem('playverse_history') || '[]');
    if (!Array.isArray(history)) return [];

    return history
      .map((id) => gamesCatalog.find((game) => game.id === id))
      .filter(Boolean)
      .slice(0, 4)
      .map((game) => ({
        ...game,
        playCount: Number(localStorage.getItem(`playverse.game.${game.id}.playCount`) || 0),
        highScore: Number(localStorage.getItem(`playverse.game.${game.id}.highScore`) || 0),
      }));
  } catch {
    return [];
  }
}

export const RecentlyPlayedRow = memo(function RecentlyPlayedRow() {
  const { openGame } = useQuickPlay();
  const [games, setGames] = useState(readRecentlyPlayed);

  useEffect(() => {
    const refresh = () => setGames(readRecentlyPlayed());
    window.addEventListener('playverse_stats_updated', refresh);
    return () => window.removeEventListener('playverse_stats_updated', refresh);
  }, []);

  if (!games.length) return null;

  return (
    <Section
      title="Recently Played"
      description="Jump back into your last sessions."
      spacing="md"
    >
      <motion.ul
        className="flex gap-4 overflow-x-auto pb-1 snap-x snap-mandatory scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: '-40px' }}
        aria-label="Recently played games"
      >
        {games.map((game) => (
          <motion.li
            key={game.id}
            variants={staggerItem}
            className="snap-start shrink-0 w-[85%] sm:w-[360px]"
          >
            <article className="flex h-full flex-col gap-3 rounded-xl border border-border bg-surface/80 p-3 hover:border-border-hover hover:bg-surface-hover transition-colors">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
                <img
                  src={game.image}
                  alt={game.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="flex min-w-0 items-center justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-heading-sm text-text truncate">{game.title}</h3>
                  <p className="text-body-sm text-text-secondary">Played {game.playCount} times</p>
                </div>
                {game.highScore > 0 && (
                  <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-warning">
                    <Trophy className="h-3.5 w-3.5" aria-hidden="true" />
                    {game.highScore.toLocaleString()}
                  </span>
                )}
              </div>
              <button
                type="button"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                onClick={() => openGame(game.id)}
              >
                <Play className="h-4 w-4" aria-hidden="true" />
                Play again
              </button>
            </article>
          </motion.li>
        ))}
      </motion.ul>
    </Section>
  );
});
