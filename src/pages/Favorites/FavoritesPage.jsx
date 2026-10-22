import { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Gamepad2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Container } from '@components/layout';
import { GameCard } from '@game';
import { EmptyState } from '@ui';
import { gamesCatalog } from '@data/games';
import { useFavorites } from '@hooks/index';
import { pageFade, staggerContainer, staggerItem } from '@utils/index';

function FavoritesPageComponent() {
  const { favorites } = useFavorites();
  const [sortBy, setSortBy] = useState('saved');
  const games = favorites
    .map((id) => gamesCatalog.find((game) => game.id === id))
    .filter(Boolean)
    .map((game) => ({
      ...game,
      highScore: Number(localStorage.getItem(`playverse.game.${game.id}.highScore`) || 0),
      playCount: Number(localStorage.getItem(`playverse.game.${game.id}.playCount`) || 0),
    }));

  const sortedGames = [...games].sort((a, b) => {
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    if (sortBy === 'score') return b.highScore - a.highScore || a.title.localeCompare(b.title);
    if (sortBy === 'plays') return b.playCount - a.playCount || a.title.localeCompare(b.title);
    return favorites.indexOf(a.id) - favorites.indexOf(b.id);
  });

  return (
    <motion.div initial={pageFade.initial} animate={pageFade.animate} exit={pageFade.exit} transition={pageFade.transition} className="pb-20 pt-8 md:pt-12">
      <Container className="space-y-10">
        <header className="max-w-2xl space-y-3">
          <p className="text-label text-primary">Your Collection</p>
          <h1 className="text-display-lg font-bold tracking-tight text-text">Favorite Games</h1>
          <p className="text-body-lg text-text-secondary">Your personal shelf of games ready for another run.</p>
        </header>

        {games.length ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-text-secondary">{games.length} saved {games.length === 1 ? 'game' : 'games'}</p>
              <label className="flex items-center gap-2 text-sm text-text-secondary">
                Sort by
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
                >
                  <option value="saved">Recently saved</option>
                  <option value="title">Title</option>
                  <option value="score">Highest score</option>
                  <option value="plays">Most played</option>
                </select>
              </label>
            </div>
            <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4 md:gap-8">
              {sortedGames.map((game) => (
              <motion.div key={game.id} variants={staggerItem}>
                <GameCard id={game.id} title={game.title} image={game.image} genres={game.genres} />
              </motion.div>
              ))}
            </motion.div>
          </>
        ) : (
          <EmptyState
            icon={Heart}
            title="No favorites yet"
            description="Tap the heart on any game card and it will appear in your collection."
            action={<Link to="/games" className="btn-primary"><Gamepad2 className="h-4 w-4" /> Browse Games</Link>}
          />
        )}
      </Container>
    </motion.div>
  );
}

export const FavoritesPage = memo(FavoritesPageComponent);
export default FavoritesPage;
