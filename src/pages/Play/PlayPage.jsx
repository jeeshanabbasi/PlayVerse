import { memo, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getGameBySlug } from '@data/index';
import { EmptyState } from '@ui';
import { GamePlayShell } from '@games';

function PlayPageComponent() {
  const { slug } = useParams();
  const game = useMemo(() => getGameBySlug(slug), [slug]);

  if (!slug || !game) {
    return (
      <div className="min-h-dvh bg-background flex items-center justify-center p-6">
        <EmptyState
          title="Unable to launch"
          description="This game could not be found."
          action={
            <Link to="/games" className="btn-primary">
              Back to Games
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <GamePlayShell
      slug={game.slug}
      title={game.title}
      meta={game}
    />
  );
}

const PlayPage = memo(PlayPageComponent);

export default PlayPage;
export { PlayPage };
