import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Clock3, Trophy } from 'lucide-react';
import { gamesCatalog } from '@data/games';

function formatRelativeTime(timestamp) {
  if (!timestamp) return 'Recently';
  const diff = Date.now() - Number(timestamp);
  if (diff < 60_000) return 'Just now';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(timestamp));
}

function getActivityFeed() {
  const items = [];

  try {
    const rawHistory = localStorage.getItem('playverse_history');
    const history = rawHistory ? JSON.parse(rawHistory) : [];
    if (Array.isArray(history)) {
      history.forEach((slug) => {
        const game = gamesCatalog.find((entry) => entry.id === slug);
        if (game) {
          const lastPlayed = Number(localStorage.getItem(`playverse.game.${slug}.lastPlayed`) || 0);
          items.push({
            id: `play-${slug}`,
            type: 'play',
            title: `Played ${game.title}`,
            subtitle: 'Jumped back into a run',
            time: lastPlayed || Date.now(),
          });
        }
      });
    }
  } catch {
    // Ignore malformed history data
  }

  gamesCatalog.forEach((game) => {
    try {
      const raw = localStorage.getItem(`playverse.game.${game.id}.achievements`);
      const unlocked = raw ? JSON.parse(raw) : [];
      if (Array.isArray(unlocked) && unlocked.length > 0) {
        const lastPlayed = Number(localStorage.getItem(`playverse.game.${game.id}.lastPlayed`) || 0);
        items.push({
          id: `badge-${game.id}`,
          type: 'achievement',
          title: `${game.title} unlocked ${unlocked.length} badge${unlocked.length > 1 ? 's' : ''}`,
          subtitle: 'Progress milestone reached',
          time: lastPlayed || Date.now(),
        });
      }
    } catch {
      // Ignore malformed payloads
    }
  });

  return items
    .sort((a, b) => Number(b.time) - Number(a.time))
    .slice(0, 6);
}

export const ActivityFeedSection = memo(function ActivityFeedSection() {
  const items = useMemo(() => getActivityFeed(), []);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-label text-primary">Activity</p>
          <h2 className="text-heading-lg font-bold text-text">Recent Highlights</h2>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-text-muted">
          <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
          Live Feed
        </span>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {items.length > 0 ? (
          items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.25 }}
              className="flex items-start gap-3 rounded-2xl border border-border bg-surface p-4"
            >
              <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${item.type === 'achievement' ? 'border-primary/30 bg-primary/10 text-primary' : 'border-accent/30 bg-accent/10 text-accent'}`}>
                {item.type === 'achievement' ? <Trophy className="h-4 w-4" aria-hidden="true" /> : <Clock3 className="h-4 w-4" aria-hidden="true" />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-text">{item.title}</p>
                <p className="mt-0.5 text-sm text-text-secondary">{item.subtitle}</p>
                <p className="mt-2 text-[11px] font-medium uppercase tracking-wider text-text-muted">{formatRelativeTime(item.time)}</p>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="md:col-span-2 xl:col-span-3 rounded-2xl border border-dashed border-border bg-surface/60 p-6 text-center text-sm text-text-secondary">
            Your recent plays and unlocks will appear here.
          </div>
        )}
      </div>
    </section>
  );
});

export default ActivityFeedSection;
