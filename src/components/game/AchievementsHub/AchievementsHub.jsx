import { memo, useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Medal, Trophy, Star, Volume2, VolumeX, Play } from 'lucide-react';
import { gamesCatalog } from '@data/games';
import { resolvePlayableDefinition } from '@games';
import { CircularProgress } from '@ui';
import { useQuickPlay } from '@context/index';
import { playUiClick, startAmbientSoundscape, stopAmbientSoundscape } from '@utils/index';

function NextBadgePrompt({ badge, onPlay }) {
  if (!badge) return null;

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-accent/20 bg-accent/5 px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <span className="text-xl" aria-hidden="true">{badge.icon ?? '🏅'}</span>
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-accent">Next badge</p>
          <p className="truncate text-sm font-semibold text-text">{badge.name}</p>
          <p className="truncate text-xs text-text-secondary">
            {badge.gameTitle} · {badge.progress}/{badge.total} unlocked
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onPlay(badge.gameId)}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-semibold text-text transition hover:border-accent/40 hover:text-accent"
        aria-label={`Play ${badge.gameTitle}`}
      >
        <Play className="h-3.5 w-3.5" aria-hidden="true" />
        Play
      </button>
    </div>
  );
}

function AchievementsHubComponent() {
  const [ambience, setAmbience] = useState(false);
  const [achievementsUpdateKey, setAchievementsUpdateKey] = useState(0);
  const { openGame } = useQuickPlay();
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
      setAchievementsUpdateKey((k) => k + 1);
    };
    window.addEventListener('playverse_profile_updated', handleProfileUpdate);
    window.addEventListener('playverse_achievements_updated', handleProfileUpdate);
    return () => {
      window.removeEventListener('playverse_profile_updated', handleProfileUpdate);
      window.removeEventListener('playverse_achievements_updated', handleProfileUpdate);
    };
  }, []);

  const toggleAmbience = () => {
    playUiClick();
    if (ambience) {
      stopAmbientSoundscape();
      setAmbience(false);
    } else {
      startAmbientSoundscape();
      setAmbience(true);
    }
  };

  const stats = useMemo(() => {
    let total = 0;
    let unlocked = 0;
    const unlockedBadges = [];
    const nextBadgeCandidates = [];

    gamesCatalog.forEach((game) => {
      const definition = resolvePlayableDefinition(game.id);
      const achievements = definition?.achievements ?? [];
      total += achievements.length;

      let stored = [];
      try {
        const raw = localStorage.getItem(`playverse.game.${game.id}.achievements`);
        if (raw) stored = JSON.parse(raw);
      } catch {
        stored = [];
      }

      achievements.forEach((item) => {
        const isUnlocked = stored.includes(item.id);
        if (isUnlocked) {
          unlocked += 1;
          unlockedBadges.push({
            ...item,
            gameTitle: game.title,
            gameId: game.id,
          });
        }
      });

      const unlockedInGame = achievements.filter((item) => stored.includes(item.id)).length;
      const nextLockedBadge = achievements.find((item) => !stored.includes(item.id));
      if (nextLockedBadge) {
        nextBadgeCandidates.push({
          ...nextLockedBadge,
          gameTitle: game.title,
          gameId: game.id,
          progress: unlockedInGame,
          total: achievements.length,
          progressRatio: unlockedInGame / achievements.length,
        });
      }
    });

    // Check for secret platform Konami code Easter Egg achievement
    if (localStorage.getItem('playverse_konami_unlocked') === 'true') {
      unlocked += 1;
      total += 1;
      unlockedBadges.unshift({
        id: 'konami-code',
        name: 'Classic Codebreaker',
        description: 'Activated the legendary Konami cheat code.',
        icon: '👑',
        gameTitle: 'Secret Code',
        gameId: 'platform',
      });
    }

    const percent = total > 0 ? Math.round((unlocked / total) * 100) : 0;
    nextBadgeCandidates.sort((a, b) => b.progressRatio - a.progressRatio);

    return {
      total,
      unlocked,
      percent,
      unlockedBadges,
      nextBadge: nextBadgeCandidates[0] ?? null,
    };
  }, [achievementsUpdateKey]);

  if (stats.unlocked === 0) {
    return (
      <div className="rounded-2xl border border-border/80 bg-surface/40 p-6 backdrop-blur-xl flex flex-col gap-5 shadow-[var(--shadow-soft)]">
        <div className="flex w-full flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex items-center gap-4 text-left">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/25 text-primary shadow-[var(--shadow-glow)]">
            <Trophy className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-text">
              {profile.avatar} {profile.nickname}'s Achievements
            </h3>
            <p className="text-xs text-text-secondary">
              Play classic games to unlock unique badges and complete your catalog.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 shrink-0">
          <button
            onClick={toggleAmbience}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all duration-200 outline-none select-none ${
              ambience
                ? 'bg-primary/10 border-primary/30 text-primary shadow-[var(--shadow-glow)]'
                : 'bg-surface border-border text-text-secondary hover:text-text'
            }`}
          >
            {ambience ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>80s Ambience</span>
          </button>

          <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Progress</span>
          <div className="px-3.5 py-1 rounded-full bg-border/40 text-xs font-mono font-bold text-text-secondary border border-border/40">
            0 / {stats.total} Badges
          </div>
        </div>
        </div>
        <NextBadgePrompt badge={stats.nextBadge} onPlay={openGame} />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/80 bg-surface/45 p-6 backdrop-blur-xl grid gap-6 md:grid-cols-12 shadow-[var(--shadow-soft)]">
      {/* Profile summary */}
      <div className="md:col-span-4 flex items-center justify-between gap-4 md:flex-col md:justify-center md:border-r md:border-border/60 md:pr-6">
        <div className="space-y-3.5 text-left md:text-center w-full">
          <div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-primary flex items-center gap-1.5 md:justify-center">
              <Star className="h-3 w-3 fill-current" /> Profile Stats
            </p>
            <h3 className="text-lg font-bold text-text mt-1">
              {profile.avatar} {profile.nickname}
            </h3>
            <p className="text-xs text-text-secondary mt-0.5">
              You unlocked {stats.unlocked} out of {stats.total} classic badges!
            </p>
          </div>
          
          <button
            onClick={toggleAmbience}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all duration-200 md:mx-auto outline-none select-none ${
              ambience
                ? 'bg-primary/10 border-primary/30 text-primary shadow-[var(--shadow-glow)]'
                : 'bg-surface border-border text-text-secondary hover:text-text'
            }`}
          >
            {ambience ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>80s Arcade Ambience</span>
          </button>
        </div>
        <div className="shrink-0 flex items-center justify-center">
          <CircularProgress value={stats.percent} size={84}>
            <span className="text-xs font-mono font-bold">{stats.percent}%</span>
          </CircularProgress>
        </div>
      </div>

      <div className="md:col-span-12">
        <NextBadgePrompt badge={stats.nextBadge} onPlay={openGame} />
      </div>

      {/* Unlocked Badges list */}
      <div className="md:col-span-8 space-y-3">
        <p className="text-[10px] uppercase font-bold tracking-widest text-text-muted flex items-center gap-1.5">
          <Medal className="h-3.5 w-3.5 text-accent" /> Unlocked Badges ({stats.unlocked})
        </p>
        
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {stats.unlockedBadges.map((badge, idx) => (
            <motion.div
              key={`${badge.gameId}-${badge.id}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05, duration: 0.2 }}
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent('playverse_achievement_celebration', {
                    detail: {
                      title: badge.name,
                      description: badge.description || `Milestone achieved in ${badge.gameTitle}!`,
                      icon: badge.icon ?? '🏆',
                      xp: 500,
                      isRecord: false,
                    },
                  })
                );
              }}
              className="flex items-center gap-3 shrink-0 px-4 py-3 rounded-xl border border-primary/20 bg-primary/5 hover:border-primary/40 hover:bg-primary/10 transition-all cursor-pointer shadow-sm active:scale-95 select-none"
              title="Click to inspect 3D Trophy celebration"
            >
              <span className="text-xl leading-none" aria-hidden="true">
                {badge.icon ?? '🏆'}
              </span>
              <div className="text-left min-w-0">
                <p className="text-xs font-bold text-text truncate">{badge.name}</p>
                <p className="text-[10px] text-text-secondary truncate mt-0.5">{badge.gameTitle}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const AchievementsHub = memo(AchievementsHubComponent);
export default AchievementsHub;
