import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Sparkles } from 'lucide-react';
import { useQuickPlay } from '@context/index';
import { gamesCatalog } from '@data/games';

function getChallengeBurst() {
  const games = gamesCatalog
    .map((game) => {
      const plays = Number(localStorage.getItem(`playverse.game.${game.id}.playCount`) || 0);
      const score = Number(localStorage.getItem(`playverse.game.${game.id}.highScore`) || 0);
      return {
        ...game,
        plays,
        score,
      };
    })
    .filter((game) => game.plays > 0 && game.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return games.length > 0 ? games : gamesCatalog.slice(0, 3).map((game) => ({ ...game, plays: 0, score: 0 }));
}

export const ChallengeBurstSection = memo(function ChallengeBurstSection() {
  const { openGame } = useQuickPlay();
  const burst = useMemo(() => getChallengeBurst(), []);

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
            <p className="text-label text-primary">Challenge Burst</p>
            <h3 className="mt-1 text-lg font-bold text-text">Top recent scores</h3>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-text-muted">
          <Sparkles className="h-3.5 w-3.5 text-warning" aria-hidden="true" />
          Fresh
        </span>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {burst.map((game) => (
          <button
            key={game.id}
            type="button"
            onClick={() => openGame(game.id)}
            className="rounded-xl border border-border bg-background/30 p-3 text-left transition hover:border-primary/30 hover:bg-primary/5"
          >
            <p className="text-[10px] uppercase tracking-wider text-text-muted">{game.title}</p>
            <p className="mt-2 text-lg font-bold text-text">{game.score.toLocaleString()}</p>
            <p className="mt-1 text-xs text-text-secondary">{game.plays} plays</p>
          </button>
        ))}
      </div>
    </motion.section>
  );
});

export default ChallengeBurstSection;
