import { memo, useEffect, useState } from 'react';
import { BarChart3, Clock3, Gamepad2, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { Container } from '@components/layout';
import { gamesCatalog } from '@data/games';
import { pageFade, cn } from '@utils/index';

const STORAGE_PREFIX = 'playverse.game';

function readNumber(key) {
  try {
    return Number(localStorage.getItem(key)) || 0;
  } catch {
    return 0;
  }
}

function getStats() {
  const games = gamesCatalog.map((game) => ({
    ...game,
    playCount: readNumber(`${STORAGE_PREFIX}.${game.id}.playCount`),
    bestScore: readNumber(`${STORAGE_PREFIX}.${game.id}.highScore`),
    lastPlayed: readNumber(`${STORAGE_PREFIX}.${game.id}.lastPlayed`),
  }));
  const playedGames = games.filter((game) => game.playCount > 0);
  const genreCounts = playedGames.reduce((counts, game) => {
    game.genres.forEach((genre) => {
      counts[genre] = (counts[genre] || 0) + game.playCount;
    });
    return counts;
  }, {});
  const favoriteGenre = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Not yet';

  return {
    games,
    playedGames,
    totalSessions: games.reduce((total, game) => total + game.playCount, 0),
    bestScore: Math.max(0, ...games.map((game) => game.bestScore)),
    favoriteGenre,
  };
}

function StatCard({ icon: Icon, label, value, detail }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="mb-5 flex items-center justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-muted text-primary">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <BarChart3 className="h-4 w-4 text-text-muted" aria-hidden="true" />
      </div>
      <p className="text-label text-text-muted">{label}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums text-text">{value}</p>
      <p className="mt-1 text-sm text-text-secondary">{detail}</p>
    </div>
  );
}

function StatsPageComponent() {
  const [stats, setStats] = useState(getStats);

  useEffect(() => {
    const refresh = () => setStats(getStats());
    window.addEventListener('storage', refresh);
    window.addEventListener('playverse_stats_updated', refresh);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('playverse_stats_updated', refresh);
    };
  }, []);

  const rankedGames = [...stats.games]
    .filter((game) => game.playCount > 0 || game.bestScore > 0)
    .sort((a, b) => b.playCount - a.playCount || b.bestScore - a.bestScore);

  return (
    <motion.div
      initial={pageFade.initial}
      animate={pageFade.animate}
      exit={pageFade.exit}
      transition={pageFade.transition}
      className="pb-16 pt-8 md:pt-12"
    >
      <Container className="space-y-10 md:space-y-12">
        <header className="max-w-2xl space-y-3">
          <p className="text-label text-primary">Your Play Profile</p>
          <h1 className="text-display-lg font-bold tracking-tight text-text">Game Statistics</h1>
          <p className="text-body-lg text-text-secondary">
            A quick view of your local PlayVerse activity and best runs.
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Game statistics summary">
          <StatCard icon={Gamepad2} label="Games Played" value={stats.playedGames.length} detail={`of ${stats.games.length} available`} />
          <StatCard icon={Clock3} label="Total Sessions" value={stats.totalSessions} detail="launches recorded" />
          <StatCard icon={Trophy} label="Best Score" value={stats.bestScore.toLocaleString('en-US')} detail="across all games" />
          <StatCard icon={BarChart3} label="Favorite Genre" value={stats.favoriteGenre} detail="based on sessions" />
        </section>

        <section className="space-y-5">
          <div>
            <h2 className="text-heading-lg font-bold text-text">Your Activity</h2>
            <p className="mt-1 text-body-md text-text-secondary">Games ranked by your activity.</p>
          </div>

          {rankedGames.length > 0 ? (
            <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
              {rankedGames.map((game, index) => (
                <div key={game.id} className="flex items-center gap-3 p-4 sm:gap-5 sm:p-5">
                  <span className="w-6 text-center text-sm font-bold tabular-nums text-text-muted">{index + 1}</span>
                  <img src={game.image} alt="" className="h-12 w-16 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-text">{game.title}</p>
                    <p className="truncate text-sm text-text-secondary">{game.genres.join(' · ')}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold tabular-nums text-text">{game.playCount} {game.playCount === 1 ? 'session' : 'sessions'}</p>
                    <p className={cn('text-sm tabular-nums', game.bestScore ? 'text-accent' : 'text-text-muted')}>
                      Best {game.bestScore.toLocaleString('en-US')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-surface/50 px-6 py-12 text-center">
              <Gamepad2 className="mx-auto h-8 w-8 text-primary" aria-hidden="true" />
              <h3 className="mt-4 font-semibold text-text">Your stats are waiting</h3>
              <p className="mx-auto mt-1 max-w-md text-sm text-text-secondary">
                Play a game and your sessions and high scores will appear here automatically.
              </p>
            </div>
          )}
        </section>
      </Container>
    </motion.div>
  );
}

export const StatsPage = memo(StatsPageComponent);
export default StatsPage;
