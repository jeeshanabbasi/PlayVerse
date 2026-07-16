import { memo, useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Share2, Users, HardDrive, Shield, Calendar, Building2 } from 'lucide-react';
import {
  PlayButton,
  WishlistButton,
  FavoriteButton,
  GenreBadge,
  PlatformBadge,
  GameRating,
} from '@game';
import { IconButton } from '@ui';
import { useToast } from '@hooks/index';
import { cn } from '@utils/index';

export const DetailHero = memo(function DetailHero({ game }) {
  const navigate = useNavigate();
  const { success, info } = useToast();
  const [wishlisted, setWishlisted] = useState(false);
  const [favorited, setFavorited] = useState(false);

  const share = useCallback(async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: game.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        success('Link copied', game.title);
      }
    } catch {
      info('Share cancelled');
    }
  }, [game.title, success, info]);

  return (
    <section className="relative isolate min-h-[70vh] w-full overflow-hidden md:min-h-[78vh]">
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.08, opacity: 0.6 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        aria-hidden="true"
      >
        <img
          src={game.banner}
          alt=""
          className="h-full w-full object-cover"
          loading="eager"
        />
      </motion.div>

      <div className="absolute inset-0 bg-background/50" aria-hidden="true" />
      <motion.div
        className="absolute inset-0"
        aria-hidden="true"
        animate={{
          background: [
            'radial-gradient(ellipse 60% 50% at 15% 40%, rgba(124,58,237,0.4), transparent 60%), radial-gradient(ellipse 50% 40% at 85% 20%, rgba(34,211,238,0.2), transparent 55%)',
            'radial-gradient(ellipse 55% 45% at 25% 50%, rgba(124,58,237,0.28), transparent 60%), radial-gradient(ellipse 55% 45% at 75% 30%, rgba(34,211,238,0.26), transparent 55%)',
            'radial-gradient(ellipse 60% 50% at 15% 40%, rgba(124,58,237,0.4), transparent 60%), radial-gradient(ellipse 50% 40% at 85% 20%, rgba(34,211,238,0.2), transparent 55%)',
          ],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-transparent" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/20 to-transparent" aria-hidden="true" />

      <div className="container-app relative z-10 flex min-h-[70vh] flex-col justify-end pb-12 pt-28 md:min-h-[78vh] md:pb-16">
        <motion.div
          className="max-w-4xl space-y-6"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-end gap-4">
            <div className="hidden sm:block h-20 w-20 overflow-hidden rounded-xl border border-border bg-surface shadow-[var(--shadow-glow-primary)] md:h-24 md:w-24">
              <img src={game.logo} alt="" className="h-full w-full object-cover" loading="eager" />
            </div>
            <div className="min-w-0 space-y-2">
              <p className="text-label text-primary">Game Details</p>
              <h1 className="text-display-md md:text-display-lg text-text">{game.title}</h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {game.genres.map((genre) => (
              <GenreBadge key={genre} label={genre} />
            ))}
            {game.platforms.map((platform) => (
              <PlatformBadge key={platform} platform={platform} />
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <Meta icon={Building2} label="Developer" value={game.developer} />
            <Meta icon={Calendar} label="Released" value={game.releaseDate} />
            <Meta label="Rating" value={<GameRating rating={game.rating} /> } />
            <Meta label="Difficulty" value={game.difficulty} />
            <Meta icon={Users} label="Players" value={game.players} />
            <Meta icon={HardDrive} label="Size" value={game.size} />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface/70 px-2.5 py-1 text-xs font-medium text-text-secondary backdrop-blur-md">
              <Shield className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
              Age {game.ageRating}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <PlayButton
              size="lg"
              magnetic
              onClick={() => navigate(`/play/${game.slug}`)}
            >
              Play Now
            </PlayButton>
            <WishlistButton
              size="lg"
              active={wishlisted}
              onToggle={setWishlisted}
            />
            <FavoriteButton
              size="lg"
              active={favorited}
              onToggle={setFavorited}
            />
            <IconButton
              variant="secondary"
              size="lg"
              icon={Share2}
              aria-label="Share game"
              onClick={share}
            />
            <Link
              to="/games"
              className="btn-ghost text-sm"
            >
              Back to Explorer
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

function Meta({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-border bg-surface/50 px-3 py-2.5 backdrop-blur-md">
      <p className="text-[10px] uppercase tracking-widest text-text-muted mb-1 flex items-center gap-1">
        {Icon && <Icon className="h-3 w-3" aria-hidden="true" />}
        {label}
      </p>
      <div className={cn('text-sm font-medium text-text truncate')}>{value}</div>
    </div>
  );
}
