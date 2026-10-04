import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, CalendarCheck2 } from 'lucide-react';

function getDateKey(date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next.toISOString().slice(0, 10);
}

function getWeekData() {
  try {
    const raw = localStorage.getItem('playverse_daily_history') || '[]';
    const history = JSON.parse(raw);
    const activeSet = new Set(Array.isArray(history) ? history : []);

    const entries = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      const key = getDateKey(date);
      return {
        key,
        label: date.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 1),
        active: activeSet.has(key),
      };
    });

    const activeCount = entries.filter((item) => item.active).length;
    return {
      entries,
      activeCount,
      percent: Math.round((activeCount / 7) * 100),
    };
  } catch {
    return { entries: [], activeCount: 0, percent: 0 };
  }
}

export const WeeklyMomentumSection = memo(function WeeklyMomentumSection() {
  const data = useMemo(() => getWeekData(), []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      className="rounded-2xl border border-border bg-surface px-5 py-4"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
            <BarChart3 className="h-5 w-5" aria-hidden="true" />
          </span>

          <div>
            <p className="text-label text-primary">Weekly Momentum</p>
            <h3 className="mt-1 text-lg font-bold text-text">{data.activeCount}/7 days active</h3>
            <p className="mt-1 text-sm text-text-secondary">
              {data.activeCount >= 5
                ? 'Strong rhythm this week.'
                : 'A couple more sessions will keep the momentum going.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-border bg-background/30 px-3 py-2">
          <CalendarCheck2 className="h-4 w-4 text-accent" aria-hidden="true" />
          <div>
            <p className="text-[10px] uppercase tracking-wider text-text-muted">This week</p>
            <p className="text-sm font-bold text-text">{data.percent}%</p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-end gap-2">
        {data.entries.map((item) => (
          <div key={item.key} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex h-20 w-full items-end justify-center rounded-xl border border-border bg-background/30 p-1">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: item.active ? '100%' : '18%' }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className={`w-full rounded-md ${item.active ? 'bg-gradient-to-t from-primary to-accent' : 'bg-border'}`}
              />
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">{item.label}</span>
          </div>
        ))}
      </div>
    </motion.section>
  );
});

export default WeeklyMomentumSection;
