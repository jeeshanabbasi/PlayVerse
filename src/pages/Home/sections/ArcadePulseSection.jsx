import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Target, Zap } from 'lucide-react';
import { useQuickPlay } from '@context/index';
import { gamesCatalog } from '@data/games';

function getArcadePulse() {
  const favoriteIds = (() => {
    try {
      return JSON.parse(localStorage.getItem('playverse_favorites') || '[]');
    } catch {
      return [];
    }
  })();

  const ranked = gamesCatalog
    .map((game) => {
      const plays = Number(localStorage.getItem(`playverse.game.${game.id}.playCount`) || 0);
      const highScore = Number(localStorage.getItem(`playverse.game.${game.id}.highScore`) || 0);
      const isFavorite = favoriteIds.includes(game.id);
      return {
        ...game,
        plays,
        highScore,
        isFavorite,
      };
    })
    .sort((a, b) => b.plays - a.plays || b.highScore - a.highScore);

  const topGame = ranked.find((game) => game.plays > 0) ?? gamesCatalog[0];
  const bestGame = ranked.find((game) => game.highScore > 0) ?? topGame ?? gamesCatalog[0];
  const favoriteGame = ranked.find((game) => game.isFavorite) ?? topGame ?? gamesCatalog[0];

  return {
    topGame,
    bestGame,
    favoriteGame,
  };
}

export const ArcadePulseSection = memo(function ArcadePulseSection() {
  const { openGame } = useQuickPlay();
  const pulse = useMemo(() => getArcadePulse(), []);

  const handleSurpriseMe = () => {
    window.dispatchEvent(new CustomEvent('playverse_open_surprise_me'));
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      className="rounded-2xl border border-border bg-surface px-5 py-4"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-accent">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-label text-accent">Arcade Pulse</p>
            <h3 className="mt-1 text-lg font-bold text-text">Your next best play</h3>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-text-muted">
          <Zap className="h-3.5 w-3.5 text-warning" aria-hidden="true" />
          Live
        </span>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <button
          type="button"
          onClick={() => openGame(pulse.topGame.id)}
          className="rounded-xl border border-border bg-background/30 p-3 text-left transition hover:border-primary/30 hover:bg-primary/5"
        >
          <p className="text-[10px] uppercase tracking-wider text-text-muted">Most played</p>
          <p className="mt-2 text-lg font-bold text-text">{pulse.topGame.title}</p>
          <p className="mt-1 text-xs text-text-secondary">{pulse.topGame.plays} plays</p>
        </button>

        <button
          type="button"
          onClick={() => openGame(pulse.bestGame.id)}
          className="rounded-xl border border-border bg-background/30 p-3 text-left transition hover:border-primary/30 hover:bg-primary/5"
        >
          <p className="text-[10px] uppercase tracking-wider text-text-muted">Best score</p>
          <p className="mt-2 text-lg font-bold text-text">{pulse.bestGame.title}</p>
          <p className="mt-1 text-xs text-text-secondary">{pulse.bestGame.highScore.toLocaleString()} high score</p>
        </button>

        <button
          type="button"
          onClick={handleSurpriseMe}
          className="rounded-xl border border-border bg-background/30 p-3 text-left transition hover:border-primary/30 hover:bg-primary/5"
        >
          <p className="text-[10px] uppercase tracking-wider text-text-muted">Pick for me</p>
          <div className="mt-2 flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" aria-hidden="true" />
            <p className="text-lg font-bold text-text">Surprise</p>
          </div>
          <p className="mt-1 text-xs text-text-secondary">Open a random arcade challenge</p>
        </button>
      </div>
    </motion.section>
  );
});

export default ArcadePulseSection;
