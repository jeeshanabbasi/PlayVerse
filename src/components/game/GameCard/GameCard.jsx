import { memo, useState, useRef } from 'react';
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
  const cardRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, shineX: 50, shineY: 50, active: false });
  const { openGame } = useQuickPlay();
  const { isFavorite, toggleFavorite } = useFavorites();

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    setTilt({
      rx: -y * 12,
      ry: x * 12,
      shineX: (x + 0.5) * 100,
      shineY: (y + 0.5) * 100,
      active: true,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0, shineX: 50, shineY: 50, active: false });
  };

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
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn('relative perspective-1000 select-none', className)}
      style={{ perspective: '1000px' }}
    >
      <motion.div
        animate={{
          rotateX: tilt.rx,
          rotateY: tilt.ry,
          scale: tilt.active ? 1.025 : 1,
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        style={{ transformStyle: 'preserve-3d' }}
        className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--shadow-card)] transition-colors duration-300 hover:border-primary/40 hover:shadow-[var(--shadow-glow-primary)]"
      >
        {/* Holographic 3D Rainbow Foil Shine Overlay */}
        <div
          className={cn(
            'pointer-events-none absolute inset-0 z-30 transition-opacity duration-300 rounded-2xl',
            tilt.active ? 'opacity-80' : 'opacity-0'
          )}
          style={{
            background: `
              radial-gradient(circle at ${tilt.shineX}% ${tilt.shineY}%, rgba(255, 255, 255, 0.45) 0%, rgba(244, 114, 182, 0.25) 25%, rgba(34, 211, 238, 0.25) 50%, transparent 75%),
              linear-gradient(${tilt.shineX * 2}deg, rgba(255,0,128,0.08), rgba(0,255,255,0.08), rgba(255,255,0,0.08))
            `,
            mixBlendMode: 'color-dodge',
          }}
        />

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
                  'h-full w-full object-cover transition-all duration-500 group-hover:scale-105',
                  imageLoaded ? 'opacity-100' : 'opacity-0 scale-95'
                )}
                loading="lazy"
              />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-surface-elevated to-background" />
          )}
          
          {/* Subtle overlay on hover */}
          <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/15" />

          {/* Favorite Heart Button (Absolute Position Top-Left) */}
          <button
            type="button"
            onClick={(e) => toggleFavorite(slug, e)}
            onMouseEnter={playUiTick}
            className={cn(
              'absolute top-3 left-3 z-20 flex h-8 w-8 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-200 cursor-pointer',
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
            className="absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 text-text-secondary border border-border/40 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-background hover:text-text cursor-pointer"
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
    </div>
  );
}

export const GameCard = memo(GameCardComponent);
export default GameCard;
