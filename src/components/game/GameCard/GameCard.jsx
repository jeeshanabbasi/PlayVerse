import { memo } from 'react';
import { motion } from 'framer-motion';
import { Play, Info } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@utils/index';

function GameCardComponent({
  id,
  title,
  image,
  genres = [],
  className,
}) {
  const navigate = useNavigate();
  const slug = id;

  const handleInfoClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/game/${slug}`);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--shadow-card)] transition-colors duration-300 hover:border-primary/20',
        className
      )}
    >
      {/* Thumbnail Container */}
      <Link to={`/play/${slug}`} className="relative block aspect-[16/10] overflow-hidden bg-surface-elevated">
        {image ? (
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-103"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-surface-elevated to-background" />
        )}
        
        {/* Subtle overlay on hover */}
        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />

        {/* Info Icon Button (Absolute Position) */}
        <button
          onClick={handleInfoClick}
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
          className="mt-auto inline-flex items-center justify-center gap-2 w-full py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-xl transition-all duration-200"
        >
          <Play className="h-4 w-4 fill-current ml-0.5" />
          <span>Play</span>
        </Link>
      </div>
    </motion.div>
  );
}

export const GameCard = memo(GameCardComponent);
