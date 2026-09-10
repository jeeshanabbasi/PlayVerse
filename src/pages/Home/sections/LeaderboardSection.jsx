import { memo, useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Gamepad2 } from 'lucide-react';
import { gamesCatalog } from '@data/games';
import { createGameStorage } from '@games/utils/storage';
import { staggerContainer, staggerItem } from '@utils/index';

const LOCAL_BEST_SCORE_KEY = 'playverse_local_rankings';

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : fallback;
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function getNormalizedRankings(gameId, userName, userScore, snapshot) {
  const userEntry = {
    name: userName,
    score: Math.max(0, Number(userScore) || 0),
    isUser: true,
  };

  const persisted = Array.isArray(snapshot[gameId]) ? snapshot[gameId] : [];
  const merged = [...persisted, userEntry]
    .filter((entry) => entry && typeof entry.name === 'string' && Number.isFinite(Number(entry.score)))
    .map((entry) => ({
      name: entry.name,
      score: Math.max(0, Number(entry.score) || 0),
      isUser: Boolean(entry.isUser),
    }))
    .filter((entry, index, array) => array.findIndex((item) => item.name === entry.name) === index)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  const nextSnapshot = { ...snapshot, [gameId]: merged };
  localStorage.setItem(LOCAL_BEST_SCORE_KEY, JSON.stringify(nextSnapshot));

  return merged;
}

function LeaderboardSectionComponent() {
  const [profile, setProfile] = useState(() => {
    try {
      const stored = localStorage.getItem('playverse_profile');
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          nickname: parsed.nickname || 'Jeeshan Abbasi',
          avatar: parsed.avatar || '👾',
        };
      }
    } catch {}
    return { nickname: 'Jeeshan Abbasi', avatar: '👾' };
  });

  useEffect(() => {
    const handleProfileUpdate = () => {
      try {
        const stored = localStorage.getItem('playverse_profile');
        if (stored) {
          const parsed = JSON.parse(stored);
          setProfile({
            nickname: parsed.nickname || 'Jeeshan Abbasi',
            avatar: parsed.avatar || '👾',
          });
        }
      } catch {}
    };
    window.addEventListener('playverse_profile_updated', handleProfileUpdate);
    window.addEventListener('playverse_stats_updated', handleProfileUpdate);
    return () => {
      window.removeEventListener('playverse_profile_updated', handleProfileUpdate);
      window.removeEventListener('playverse_stats_updated', handleProfileUpdate);
    };
  }, []);

  const leaderboardData = useMemo(() => {
    const scoringGames = gamesCatalog.filter((game) =>
      ['snake', 'tetris', 'breakout', 'pong', 'flappy-bird', 'dino-run', 'space-shooter', '2048'].includes(game.id)
    );

    return scoringGames.map((game) => {
      let userScore = 0;
      try {
        const storage = createGameStorage(game.id);
        userScore = storage.getHighScore() || 0;
      } catch {
        userScore = 0;
      }

      const profileName = `You (${profile.avatar} ${profile.nickname})`;
      const snapshot = readJson(LOCAL_BEST_SCORE_KEY, {});
      const rankings = getNormalizedRankings(game.id, profileName, userScore, snapshot);
      const userRank = rankings.findIndex((item) => item.isUser) + 1;

      return {
        gameId: game.id,
        gameTitle: game.title,
        userScore: Number(userScore) || 0,
        userRank,
        rankings,
      };
    });
  }, [profile]);

  return (
    <section className="space-y-8 pb-12">
      <div className="flex flex-col gap-1.5 text-center md:text-left">
        <h2 className="text-heading-lg font-bold tracking-tight text-text flex items-center gap-2 md:justify-start justify-center">
          <Trophy className="h-6 w-6 text-warning" />
          <span>Arcade Hall of Fame</span>
        </h2>
        <p className="text-body-md text-text-secondary">
          Your real local high scores ranked against nearby challenge rivals.
        </p>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: '-60px' }}
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {leaderboardData.map((board) => (
          <motion.div
            key={board.gameId}
            variants={staggerItem}
            className="flex flex-col rounded-2xl border border-border/85 bg-surface/40 p-5 backdrop-blur-xl hover:border-primary/20 transition-all duration-300"
          >
            <div className="flex items-center gap-3 border-b border-border/60 pb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 border border-primary/25 text-primary">
                <Gamepad2 className="w-4 h-4" />
              </div>
              <div className="text-left min-w-0">
                <h3 className="text-sm font-bold text-text truncate">{board.gameTitle}</h3>
                <p className="text-[10px] text-text-muted">Local rankings</p>
              </div>
            </div>

            <div className="flex-1 mt-4 space-y-2.5">
              {board.rankings.map((rank, index) => {
                const isGold = index === 0;
                const isSilver = index === 1;
                const isBronze = index === 2;
                return (
                  <div
                    key={`${board.gameId}-${rank.name}-${index}`}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all duration-200 ${
                      rank.isUser
                        ? 'bg-primary/10 border border-primary/20 font-semibold text-text shadow-[var(--shadow-glow)]'
                        : 'border border-transparent text-text-secondary'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md font-mono text-[10px] font-bold ${
                          isGold
                            ? 'bg-warning/20 text-warning border border-warning/35'
                            : isSilver
                            ? 'bg-text-muted/20 text-text border border-text-muted/30'
                            : isBronze
                            ? 'bg-accent/20 text-accent border border-accent/35'
                            : 'bg-border/30 text-text-muted border border-border/40'
                        }`}
                      >
                        {index + 1}
                      </span>
                      <span className="truncate">{rank.name}</span>
                    </div>
                    <span className="font-mono font-bold text-text shrink-0">{rank.score}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 border-t border-border/50 pt-3 flex items-center justify-between text-[10px]">
              <span className="text-text-secondary">Your Rank:</span>
              <span className="font-bold flex items-center gap-1 text-primary">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>#{board.userRank || '—'}</span>
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

export const LeaderboardSection = memo(LeaderboardSectionComponent);
export default LeaderboardSection;
