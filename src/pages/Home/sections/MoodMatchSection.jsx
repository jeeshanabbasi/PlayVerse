import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Wand2 } from 'lucide-react';
import { useQuickPlay } from '@context/index';
import { gamesCatalog } from '@data/games';

function getMoodMatch() {
  const history = JSON.parse(localStorage.getItem('playverse_history') || '[]');
  const favorites = JSON.parse(localStorage.getItem('playverse_favorites') || '[]');
  const played = [...new Set([...(Array.isArray(history) ? history : []), ...(Array.isArray(favorites) ? favorites : [])])];

  const candidates = played.length > 0 ? played : gamesCatalog.map((game) => game.id);
  const target = candidates[Math.floor(Math.random() * candidates.length)];
  const match = gamesCatalog.find((game) => game.id === target) || gamesCatalog[0];

  const moodMap = {
    Arcade: ['snake', 'flappy-bird', 'pong', 'breakout', 'dino-run'],
    Puzzle: ['2048', 'sudoku', 'memory-game', 'tic-tac-toe'],
    Strategy: ['minesweeper', 'sudoku', '2048', 'tic-tac-toe'],
    Casual: ['memory-game', 'flappy-bird', 'pong'],
  };

  const chosenMood = Object.entries(moodMap).find(([, ids]) => ids.includes(match.id))?.[0] || 'Arcade';

  return { match, chosenMood };
}

export const MoodMatchSection = memo(function MoodMatchSection() {
  const { openGame } = useQuickPlay();
  const { match, chosenMood } = useMemo(() => getMoodMatch(), []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      className="rounded-2xl border border-border bg-surface px-5 py-4"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
            <Wand2 className="h-5 w-5" aria-hidden="true" />
          </span>

          <div>
            <p className="text-label text-primary">Mood Match</p>
            <h3 className="mt-1 text-lg font-bold text-text">{chosenMood} vibe for you</h3>
            <p className="mt-1 text-sm text-text-secondary">
              {match.title} matches your play rhythm right now.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-xl border border-border bg-background/30 px-3 py-2 text-sm font-medium text-text-secondary">
            <Sparkles className="h-4 w-4 text-warning" aria-hidden="true" />
            {chosenMood}
          </span>

          <button
            type="button"
            onClick={() => openGame(match.id)}
            className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-95"
          >
            Play
          </button>
        </div>
      </div>
    </motion.section>
  );
});

export default MoodMatchSection;
