import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Flame, TrendingUp } from 'lucide-react';

function getDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getSessionStats() {
  try {
    const history = JSON.parse(localStorage.getItem('playverse_daily_history') || '[]');
    const uniqueDates = Array.isArray(history) ? [...new Set(history.map((item) => item.date || item))] : [];
    const today = getDateKey(new Date());
    const streak = (() => {
      let count = 0;
      const cursor = new Date();

      while (true) {
        const key = getDateKey(cursor);
        if (uniqueDates.includes(key)) {
          count += 1;
          cursor.setDate(cursor.getDate() - 1);
        } else {
          break;
        }
      }

      return count;
    })();

    const totalDays = uniqueDates.length;
    const activeToday = uniqueDates.includes(today);

    return { streak, totalDays, activeToday };
  } catch {
    return { streak: 0, totalDays: 0, activeToday: false };
  }
}

export const SessionStreakSection = memo(function SessionStreakSection() {
  const stats = useMemo(() => getSessionStats(), []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      className="rounded-2xl border border-warning/20 bg-warning/10 px-5 py-4"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-warning/30 bg-warning/20 text-warning">
            <Flame className="h-5 w-5" aria-hidden="true" />
          </span>

          <div>
            <p className="text-label text-warning">Session Streak</p>
            <h3 className="mt-1 text-lg font-bold text-text">{stats.streak} day streak</h3>
            <p className="mt-1 text-sm text-text-secondary">
              {stats.activeToday
                ? 'You are on a roll today.'
                : 'Play once today to keep it alive.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-border bg-background/30 px-3 py-2">
          <TrendingUp className="h-4 w-4 text-primary" aria-hidden="true" />
          <div>
            <p className="text-[10px] uppercase tracking-wider text-text-muted">Total active days</p>
            <p className="text-sm font-bold text-text">{stats.totalDays}</p>
          </div>
        </div>
      </div>
    </motion.section>
  );
});

export default SessionStreakSection;
