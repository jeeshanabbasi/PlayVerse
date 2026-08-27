import { memo } from 'react';
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
  const games = favorites
    .map((id) => gamesCatalog.find((game) => game.id === id))
    .filter(Boolean);

  return (
    <motion.div initial={pageFade.initial} animate={pageFade.animate} exit={pageFade.exit} transition={pageFade.transition} className="pb-20 pt-8 md:pt-12">
      <Container className="space-y-10">
        <header className="max-w-2xl space-y-3">
          <p className="text-label text-primary">Your Collection</p>
          <h1 className="text-display-lg font-bold tracking-tight text-text">Favorite Games</h1>
          <p className="text-body-lg text-text-secondary">Your personal shelf of games ready for another run.</p>
        </header>

        {games.length ? (
          <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4 md:gap-8">
            {games.map((game) => (
              <motion.div key={game.id} variants={staggerItem}>
                <GameCard id={game.id} title={game.title} image={game.image} genres={game.genres} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <EmptyState
            icon={Heart}
            title="No favorites yet"
            description="Tap the heart on any game card and it will appear in your collection."
            action={<a href="/games" className="btn-primary"><Gamepad2 className="h-4 w-4" /> Browse Games</a>}
          />
        )}
      </Container>
    </motion.div>
  );
}

export const FavoritesPage = memo(FavoritesPageComponent);
export default FavoritesPage;
