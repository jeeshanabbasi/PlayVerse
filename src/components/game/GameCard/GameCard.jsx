import { memo } from 'react';
import { motion } from 'framer-motion';
import { Clock, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn, cardHover } from '@utils/index';
import { GenreBadge } from '../GenreBadge';
import { PlatformBadge } from '../PlatformBadge';
import { GameRating } from '../GameRating';
import { GameBadge } from '../GameBadge';
import { PriceCard } from '../PriceCard';
import { WishlistButton } from '../WishlistButton';
import { FavoriteButton } from '../FavoriteButton';

function GameCardComponent({
  title,
  image,
  genres = [],
  platforms = [],
  rating,
  price,
  originalPrice,
  difficulty,
  playTime,
  isNew = false,
  isTrending = false,
  onPlay,
  onWishlist,
  wishlisted = false,
  onFavorite,
  favorited = false,
  href,
  aspect = 'portrait',
  showMeta = false,
  className,
}) {
  const aspectClass =
    aspect === 'wide'
      ? 'aspect-[16/10]'
      : aspect === 'ultrawide'
        ? 'aspect-[21/9]'
        : 'aspect-[3/4]';

  const content = (
    <>
      <div className={cn('relative overflow-hidden bg-surface-elevated', aspectClass)}>
        {image ? (
          <img
            src={image}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-surface-elevated to-background" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-90" />
        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/25" />

        {(isNew || isTrending) && (
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
            {isTrending && <GameBadge variant="hot" label="Trending" />}
            {isNew && <GameBadge variant="new" />}
          </div>
        )}

        <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5">
          <WishlistButton active={wishlisted} onToggle={onWishlist} size="sm" />
          {onFavorite && (
            <FavoriteButton active={favorited} onToggle={onFavorite} size="sm" />
          )}
        </div>

        <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/90 text-white shadow-[var(--shadow-glow-primary)] backdrop-blur-sm border border-white/15">
            <Play className="w-5 h-5 fill-current ml-0.5" aria-hidden="true" />
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 p-3.5 space-y-2">
          <div className="space-y-1.5">
            <h3 className="text-heading-sm text-text line-clamp-2 drop-shadow-sm">
              {title}
            </h3>
            {genres?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {genres.slice(0, 2).map((genre) => (
                  <GenreBadge key={genre} label={genre} />
                ))}
              </div>
            )}
          </div>

          {showMeta && (platforms?.length > 0 || difficulty || playTime) && (
            <div className="flex flex-wrap items-center gap-1.5">
              {platforms.slice(0, 2).map((platform) => (
                <PlatformBadge key={platform} platform={platform} size="sm" />
              ))}
              {difficulty && (
                <span className="rounded-md border border-border bg-black/35 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-text-secondary backdrop-blur-sm">
                  {difficulty}
                </span>
              )}
              {playTime && (
                <span className="inline-flex items-center gap-1 rounded-md border border-border bg-black/35 px-1.5 py-0.5 text-[10px] font-medium text-text-secondary backdrop-blur-sm">
                  <Clock className="h-3 w-3" aria-hidden="true" />
                  {playTime}
                </span>
              )}
            </div>
          )}

          <div className="flex items-center justify-between gap-2 pt-0.5">
            {rating != null ? <GameRating rating={rating} /> : <span />}
            <PriceCard price={price} originalPrice={originalPrice} />
          </div>
        </div>
      </div>
    </>
  );

  const sharedClassName = cn(
    'group relative block overflow-hidden rounded-xl border border-border bg-surface',
    'shadow-[var(--shadow-card)] transition-[border-color,box-shadow] duration-300',
    'hover:border-primary/35 hover:shadow-[var(--shadow-glow-primary),var(--shadow-lift)]',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
    className,
  );

  const motionProps = {
    variants: cardHover,
    initial: 'rest',
    whileHover: 'hover',
    whileTap: 'tap',
  };

  function handleActivate(event) {
    if (onPlay) {
      event.preventDefault();
      onPlay();
    }
  }

  if (href) {
    return (
      <motion.div {...motionProps} className="h-full">
        <Link to={href} className={sharedClassName} onClick={onPlay ? handleActivate : undefined}>
          {content}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      type="button"
      {...motionProps}
      className={cn(sharedClassName, 'w-full text-left cursor-pointer')}
      onClick={onPlay}
    >
      {content}
    </motion.button>
  );
}

export const GameCard = memo(GameCardComponent);
