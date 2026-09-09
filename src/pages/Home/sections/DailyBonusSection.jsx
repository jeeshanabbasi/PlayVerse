import { memo, useMemo, useState } from 'react';
import { Check, Gift } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@context/index';

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

export const DailyBonusSection = memo(function DailyBonusSection() {
  const { success } = useToast();
  const todayKey = getTodayKey();
  const [claimed, setClaimed] = useState(() => localStorage.getItem('playverse_daily_bonus') === todayKey);
  const reward = useMemo(() => 50 + (new Date().getDate() % 5) * 25, []);

  const claimBonus = () => {
    if (claimed) return;
    localStorage.setItem('playverse_daily_bonus', todayKey);
    setClaimed(true);
    success('Daily bonus claimed!', `You received ${reward} bonus XP.`);
    window.dispatchEvent(new Event('playverse_stats_updated'));
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      className="flex flex-col gap-4 rounded-2xl border border-accent/25 bg-accent/10 p-5 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-accent/30 bg-accent/15 text-accent">
          <Gift className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-label text-accent">Daily Bonus</p>
          <h2 className="mt-1 text-lg font-bold text-text">Come back tomorrow for another reward</h2>
          <p className="mt-1 text-sm text-text-secondary">Claim {reward} bonus XP today.</p>
        </div>
      </div>
      <button
        type="button"
        onClick={claimBonus}
        disabled={claimed}
        className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors ${claimed ? 'cursor-default border-border bg-surface text-text-muted' : 'border-accent/30 bg-accent/15 text-accent hover:bg-accent/25'}`}
      >
        {claimed && <Check className="h-4 w-4" aria-hidden="true" />}
        {claimed ? 'Claimed Today' : 'Claim Bonus'}
      </button>
    </motion.section>
  );
});

export default DailyBonusSection;
