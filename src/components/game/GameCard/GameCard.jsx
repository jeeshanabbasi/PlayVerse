import { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Info, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cn, playUiTick, playUiClick } from '@utils/index';
import { useQuickPlay } from '@context/index';
import { useFavorites } from '@hooks/index';

function GameCardComponent({
  id,
  title,
  image,
  genres = [],
  className,
}) {
  const navigate = useNavigate();
  const slug = id;
  const [imageLoaded, setImageLoaded] = useState(false);
  const { openGame } = useQuickPlay();
  const { isFavorite, toggleFavorite } = useFavorites();

  const handleInfoClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    playUiClick();
    navigate(`/game/${slug}`);
  };

  const handlePlayClick = (e) => {
    e.preventDefault();
    playUiClick();
    openGame(slug);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--shadow-card)] transition-all duration-300 hover:border-primary/30 hover:shadow-[var(--shadow-glow)]',
        className
      )}
    >
      {/* Thumbnail Container */}
      <Link
        to={`/play/${slug}`}
        onClick={handlePlayClick}
        onMouseEnter={playUiTick}
        className="relative block aspect-[16/10] overflow-hidden bg-surface-elevated"
      >
        {image ? (
          <>
            {/* Shimmer skeleton */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-r from-surface-elevated via-surface-hover to-surface-elevated bg-[length:200%_100%] animate-shimmer" />
            )}
            <img
              src={image}
              alt={title}
              onLoad={() => setImageLoaded(true)}
              className={cn(
                'h-full w-full object-cover transition-all duration-500 group-hover:scale-103',
                imageLoaded ? 'opacity-100' : 'opacity-0 scale-95'
              )}
              loading="lazy"
            />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-surface-elevated to-background" />
        )}
        
        {/* Subtle overlay on hover */}
        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />

        {/* Favorite Heart Button (Absolute Position Top-Left) */}
        <button
          type="button"
          onClick={(e) => toggleFavorite(slug, e)}
          onMouseEnter={playUiTick}
          className={cn(
            'absolute top-3 left-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-200 cursor-pointer',
            isFavorite(slug)
              ? 'bg-primary/20 border-primary/40 text-primary opacity-100 shadow-[var(--shadow-glow)]'
              : 'bg-background/80 text-text-secondary border-border/40 opacity-0 group-hover:opacity-100 hover:bg-background hover:text-text'
          )}
          title={isFavorite(slug) ? 'Remove from favorites' : 'Add to favorites'}
          aria-label={isFavorite(slug) ? `Remove ${title} from favorites` : `Add ${title} to favorites`}
        >
          <Heart className={cn('h-4 w-4 transition-colors', isFavorite(slug) && 'fill-current text-primary')} />
        </button>

        {/* Info Icon Button (Absolute Position Top-Right) */}
        <button
          onClick={handleInfoClick}
          onMouseEnter={playUiTick}
          className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 text-text-secondary border border-border/40 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-background hover:text-text"
          title="Game Info & Achievements"
          aria-label={`View achievements and controls for ${title}`}
        >
          <Info className="h-4.5 w-4.5" />
        </button>
      </Link>

      {/* Card Details */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div className="min-w-0">
          <h3 className="text-heading-md text-text truncate group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-body-sm text-text-muted mt-1">
            {genres.join(' · ')}
          </p>
        </div>

        {/* Apple-style primary play button */}
        <Link
          to={`/play/${slug}`}
          onClick={handlePlayClick}
          onMouseEnter={playUiTick}
          className="btn-primary mt-auto w-full justify-center text-body-sm py-2.5 shadow-[var(--shadow-soft)]"
        >
          <Play className="h-4 w-4 fill-current mr-1.5" />
          <span>Play</span>
        </Link>
      </div>
    </motion.div>
  );
}

export const GameCard = memo(GameCardComponent);
export default GameCard;
