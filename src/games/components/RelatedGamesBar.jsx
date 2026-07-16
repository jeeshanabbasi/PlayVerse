import { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getSimilarGames } from '@data/index';
import { cn } from '@utils/index';

export const RelatedGamesBar = memo(function RelatedGamesBar({
  slug,
  className,
}) {
  const related = useMemo(() => getSimilarGames(slug, 8).filter(Boolean), [slug]);

  if (!related.length) return null;

  return (
    <section
      className={cn('space-y-3', className)}
      aria-label="Related games"
    >
      <h2 className="text-heading-sm text-text">Related Games</h2>
      <ul className="flex gap-3 overflow-x-auto pb-1 scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {related.map((game) => (
          <li key={game.id} className="shrink-0 w-36">
            <Link
              to={`/play/${game.slug}`}
              className="group block overflow-hidden rounded-xl border border-border bg-surface hover:border-primary/35 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={game.image}
                  alt={game.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <p className="truncate px-2.5 py-2 text-xs font-medium text-text">
                {game.title}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
});
