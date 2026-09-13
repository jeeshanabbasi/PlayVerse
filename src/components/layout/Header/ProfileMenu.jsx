import { useEffect, useMemo, useState } from 'react';
import { BarChart3, Gamepad2, Settings } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { gamesCatalog } from '@data/games';
import { playUiClick, playUiTick } from '@utils/index';

const PROFILE_KEY = 'playverse_profile';
const FAVORITES_KEY = 'playverse_favorites';
const XP_PER_SESSION = 25;
const XP_PER_ACHIEVEMENT = 100;
const XP_PER_LEVEL = 500;

function readProfile() {
  try {
    const value = JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}');
    return {
      nickname: value.nickname || 'Jeeshan Abbasi',
      avatar: value.avatar || '👾',
    };
  } catch {
    return { nickname: 'Jeeshan Abbasi', avatar: '👾' };
  }
}

function readFavoritesCount() {
  try {
    const value = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
    return Array.isArray(value) ? value.length : 0;
  } catch {
    return 0;
  }
}

function getPlayerStats() {
  let sessions = 0;
  let achievements = 0;

  gamesCatalog.forEach((game) => {
    sessions += Number(localStorage.getItem(`playverse.game.${game.id}.playCount`) || 0);
    try {
      const value = JSON.parse(localStorage.getItem(`playverse.game.${game.id}.achievements`) || '[]');
      achievements += Array.isArray(value) ? value.length : 0;
    } catch {
      // Ignore malformed per-game data.
    }
  });

  const totalXp = sessions * XP_PER_SESSION + achievements * XP_PER_ACHIEVEMENT;
  return {
    sessions,
    level: Math.floor(totalXp / XP_PER_LEVEL) + 1,
    favorites: readFavoritesCount(),
  };
}

export function ProfileMenu({ onSettingsClick }) {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState(readProfile);
  const [stats, setStats] = useState(getPlayerStats);

  useEffect(() => {
    const refresh = () => {
      setProfile(readProfile());
      setStats(getPlayerStats());
    };
    window.addEventListener('playverse_profile_updated', refresh);
    window.addEventListener('playverse_stats_updated', refresh);
    window.addEventListener('playverse_favorites_updated', refresh);
    return () => {
      window.removeEventListener('playverse_profile_updated', refresh);
      window.removeEventListener('playverse_stats_updated', refresh);
      window.removeEventListener('playverse_favorites_updated', refresh);
    };
  }, []);

  const initials = useMemo(
    () => profile.nickname.trim().slice(0, 2).toUpperCase() || 'PV',
    [profile.nickname],
  );

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => {
          playUiClick();
          setOpen((value) => !value);
        }}
        onMouseEnter={playUiTick}
        className="flex h-9 items-center gap-2 rounded-xl border border-border bg-surface px-2 text-text-secondary transition-colors hover:border-border-hover hover:text-text"
        title="Open player profile"
        aria-label="Open player profile"
        aria-expanded={open}
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/15 text-base">{profile.avatar}</span>
        <span className="hidden max-w-24 truncate text-xs font-semibold text-text md:block">{profile.nickname}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            className="absolute right-0 top-12 z-[300] w-[min(18rem,calc(100vw-2rem))] rounded-2xl border border-border bg-surface p-3 shadow-2xl"
          >
            <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/10 p-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-background/50 text-2xl">{profile.avatar}</span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-text">{profile.nickname}</p>
                <p className="mt-0.5 text-xs font-semibold text-primary">Level {stats.level} Player</p>
              </div>
            </div>

            <div className="my-3 grid grid-cols-3 divide-x divide-border rounded-xl border border-border bg-background/30 py-2">
              <Stat label="Sessions" value={stats.sessions} />
              <Stat label="Favorites" value={stats.favorites} />
              <Stat label="Level" value={stats.level} />
            </div>

            <div className="space-y-1">
              <Link
                to="/stats"
                onClick={() => {
                  playUiClick();
                  setOpen(false);
                }}
                className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-text-secondary transition-colors hover:bg-surface-hover hover:text-text"
              >
                <BarChart3 className="h-4 w-4 text-accent" />
                View full stats
              </Link>
              <Link
                to="/games"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-text-secondary transition-colors hover:bg-surface-hover hover:text-text"
              >
                <Gamepad2 className="h-4 w-4 text-primary" />
                Browse games
              </Link>
              <button
                type="button"
                onClick={() => {
                  playUiClick();
                  setOpen(false);
                  onSettingsClick?.();
                }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm text-text-secondary transition-colors hover:bg-surface-hover hover:text-text"
              >
                <Settings className="h-4 w-4 text-warning" />
                Edit profile
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="text-center">
      <p className="text-sm font-bold tabular-nums text-text">{value}</p>
      <p className="mt-0.5 text-[9px] font-bold uppercase tracking-wider text-text-muted">{label}</p>
    </div>
  );
}

export default ProfileMenu;
