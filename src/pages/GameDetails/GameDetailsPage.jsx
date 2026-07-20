import { memo, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getGameBySlug, getSimilarGames } from '@data/index';
import { pageFade } from '@utils/index';
import { EmptyState } from '@ui';
import {
  DetailHero,
  QuickInfo,
  AboutSection,
  SimilarGames,
  AchievementsSection,
} from './sections';

function GameDetailsPageComponent() {
  const { slug } = useParams();
  const game = useMemo(() => getGameBySlug(slug), [slug]);
  const similar = useMemo(() => (game ? getSimilarGames(game.slug, 8) : []), [game]);

  if (!game) {
    return (
      <div className="container-app py-20">
        <EmptyState
          title="Game not found"
          description="This title may have moved or the link is invalid."
          action={
            <Link to="/games" className="btn-primary">
              Browse Games
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <motion.div
      key={game.slug}
      initial={pageFade.initial}
      animate={pageFade.animate}
      exit={pageFade.exit}
      transition={pageFade.transition}
      className="pb-16 space-y-16 md:space-y-24"
    >
      <DetailHero game={game} />
      
      <div className="container-app space-y-16 md:space-y-24">
        <QuickInfo game={game} />
        <AboutSection game={game} />
        <AchievementsSection game={game} />
        <SimilarGames games={similar} />
      </div>
    </motion.div>
  );
}

export const GameDetailsPage = memo(GameDetailsPageComponent);
export default GameDetailsPage;
