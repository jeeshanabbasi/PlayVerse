import { memo, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getGameBySlug, getSimilarGames } from '@data/index';
import { pageFade } from '@utils/index';
import { EmptyState } from '@ui';
import {
  DetailHero,
  QuickInfo,
  TrailerSection,
  GallerySection,
  AboutSection,
  RequirementsSection,
  SimilarGames,
  ReviewsSection,
  CommentsSection,
  AchievementsSection,
  PlayCtaSection,
} from './sections';

function GameDetailsPageComponent() {
  const { slug } = useParams();
  const game = useMemo(() => getGameBySlug(slug), [slug]);
  const similar = useMemo(() => (game ? getSimilarGames(game.slug, 10) : []), [game]);

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
      className="pb-8"
    >
      <DetailHero game={game} />
      <QuickInfo game={game} />
      <TrailerSection game={game} />
      <GallerySection game={game} />
      <AboutSection game={game} />
      <RequirementsSection game={game} />
      <SimilarGames games={similar} />
      <ReviewsSection game={game} />
      <CommentsSection game={game} />
      <AchievementsSection game={game} />
      <PlayCtaSection game={game} />
    </motion.div>
  );
}

const GameDetailsPage = memo(GameDetailsPageComponent);

export default GameDetailsPage;
export { GameDetailsPage };
