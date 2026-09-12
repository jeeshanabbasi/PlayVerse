import { useEffect, useMemo, useState } from 'react';
import { Bell, CalendarClock, CheckCheck, History, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { comingSoonGames } from '@data/index';
import { gamesCatalog } from '@data/games';
import { playUiClick, playUiTick } from '@utils/index';

const REMINDER_KEY = 'playverse_coming_soon_reminders';
const READ_KEY = 'playverse_notification_reads';

function readArray(key) {
  try {
    const raw = localStorage.getItem(key);
    const value = raw ? JSON.parse(raw) : [];
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function getNotifications() {
  const reminders = new Set(readArray(REMINDER_KEY));
  const history = readArray('playverse_history');
  const items = [];

  comingSoonGames.forEach((game) => {
    if (!reminders.has(game.id)) return;
    items.push({
      id: `reminder-${game.id}`,
      icon: CalendarClock,
      title: 'Release reminder saved',
      description: `${game.title} is pinned to your upcoming games.`,
      tone: 'text-accent',
    });
  });

  const latestGame = gamesCatalog.find((game) => game.id === history[0]);
  if (latestGame) {
    items.push({
      id: `session-${latestGame.id}`,
      icon: History,
      title: 'Ready to continue',
      description: `${latestGame.title} is waiting in your recent sessions.`,
      tone: 'text-primary',
    });
  }

  if (items.length === 0) {
    items.push({
      id: 'welcome',
      icon: Sparkles,
      title: 'Your arcade inbox is ready',
      description: 'Save a release reminder or play a game to see updates here.',
      tone: 'text-warning',
    });
  }

  return items;
}

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(() => getNotifications());
  const [readIds, setReadIds] = useState(() => new Set(readArray(READ_KEY)));

  useEffect(() => {
    const refresh = () => {
      setNotifications(getNotifications());
      setReadIds(new Set(readArray(READ_KEY)));
    };
    window.addEventListener('playverse_notifications_updated', refresh);
    window.addEventListener('playverse_stats_updated', refresh);
    return () => {
      window.removeEventListener('playverse_notifications_updated', refresh);
      window.removeEventListener('playverse_stats_updated', refresh);
    };
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !readIds.has(item.id)).length,
    [notifications, readIds],
  );

  const markAllRead = () => {
    playUiClick();
    const next = new Set([...readIds, ...notifications.map((item) => item.id)]);
    setReadIds(next);
    localStorage.setItem(READ_KEY, JSON.stringify([...next]));
  };

  const toggleOpen = () => {
    playUiClick();
    setOpen((value) => !value);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggleOpen}
        onMouseEnter={playUiTick}
        className="relative rounded-xl border border-border bg-surface p-2 text-text-secondary transition-colors hover:border-border-hover hover:text-text"
        title="Notifications"
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
        aria-expanded={open}
      >
        <Bell className="h-4.5 w-4.5" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full border-2 border-background bg-primary px-1 text-[9px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            className="absolute right-0 top-12 z-[300] w-[min(21rem,calc(100vw-2rem))] rounded-2xl border border-border bg-surface p-3 shadow-2xl"
          >
            <div className="mb-2 flex items-center justify-between px-1">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-text-muted">Notifications</p>
                <p className="mt-0.5 text-[11px] text-text-secondary">Your PlayVerse activity</p>
              </div>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllRead}
                  className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[10px] font-bold uppercase tracking-wider text-text-muted transition-colors hover:bg-surface-hover hover:text-text"
                  title="Mark all notifications as read"
                >
                  <CheckCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  Read all
                </button>
              )}
            </div>

            <div className="space-y-1.5">
              {notifications.map((item) => {
                const Icon = item.icon;
                const isUnread = !readIds.has(item.id);
                return (
                  <div
                    key={item.id}
                    className={`flex gap-3 rounded-xl p-2.5 transition-colors ${isUnread ? 'bg-primary/10' : 'hover:bg-surface-hover'}`}
                  >
                    <div className={`mt-0.5 shrink-0 ${item.tone}`}>
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-xs font-semibold text-text">{item.title}</p>
                        {isUnread && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />}
                      </div>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-text-secondary">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default NotificationCenter;
