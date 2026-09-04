import { memo, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, Sparkles, Trophy, Zap } from 'lucide-react';
import { gamesCatalog } from '@data/games';

const WEEKLY_CLAIMS_KEY = 'playverse_weekly_challenge_claims';
const QUEST_CLAIMS_KEY = 'playverse_quest_claims';

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : fallback;
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function getRewardVault() {
  const weeklyClaims = readJson(WEEKLY_CLAIMS_KEY, {});
  const questClaims = new Set(readJson(QUEST_CLAIMS_KEY, []));

  const weeklyRewards = Object.entries(weeklyClaims).flatMap(([weekKey, ids]) =>
    Array.isArray(ids)
      ? ids.map((id) => ({
          id: `${weekKey}-${id}`,
          kind: 'Weekly Reward',
          label: id.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()),
          detail: 'Weekly challenge completion',
          value: 'XP +',
          accent: 'from-primary/20 to-primary/5',
          icon: Trophy,
        }))
      : []
  );

  const questRewards = [...questClaims].map((id) => ({
    id: `quest-${id}`,
    kind: 'Quest Reward',
    label: id
      .split('-')
      .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
      .join(' '),
    detail: 'Quest board reward claimed',
    value: 'XP +',
    accent: 'from-accent/20 to-accent/5',
    icon: Sparkles,
  }));

  const achievementRewards = [];

  gamesCatalog.forEach((game) => {
    try {
      const raw = localStorage.getItem(`playverse.game.${game.id}.achievements`);
      const achievements = raw ? JSON.parse(raw) : [];
      if (Array.isArray(achievements)) {
        achievements.forEach((achievementId) => {
          achievementRewards.push({
            id: `${game.id}-${achievementId}`,
            kind: 'Achievement Badge',
            label: achievementId.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()),
            detail: `${game.title} unlocked`,
            value: 'Badge',
            accent: 'from-warning/20 to-warning/5',
            icon: Zap,
          });
        });
      }
    } catch {
      // ignore malformed data
    }
  });

  return [...weeklyRewards, ...questRewards, ...achievementRewards].slice(0, 12);
}

export const RewardVaultSection = memo(function RewardVaultSection() {
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const refresh = () => setRefreshKey((prev) => prev + 1);
    window.addEventListener('storage', refresh);
    window.addEventListener('playverse_stats_updated', refresh);
    window.addEventListener('playverse_profile_updated', refresh);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('playverse_stats_updated', refresh);
      window.removeEventListener('playverse_profile_updated', refresh);
    };
  }, []);

  const rewards = useMemo(() => getRewardVault(), [refreshKey]);

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-1.5 text-center md:text-left">
        <p className="text-label text-primary">Reward Vault</p>
        <h2 className="text-heading-lg font-bold tracking-tight text-text">Claimed Loot & Badges</h2>
        <p className="text-body-md text-text-secondary">All your unlocked seasonal awards, quest rewards, and achievement trophies in one place.</p>
      </div>

      {rewards.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {rewards.map((reward) => {
            const Icon = reward.icon;
            return (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                className={`rounded-2xl border border-border bg-gradient-to-br ${reward.accent} p-4`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface/60 text-primary">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="rounded-full border border-border bg-surface/60 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-text-muted">
                    {reward.value}
                  </span>
                </div>

                <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-text-muted">{reward.kind}</p>
                <h3 className="mt-1 text-base font-semibold text-text">{reward.label}</h3>
                <p className="mt-1 text-sm text-text-secondary">{reward.detail}</p>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-surface/60 p-6 text-center text-sm text-text-secondary">
          Your reward vault is empty. Complete a quest or unlock an achievement to start collecting loot.
        </div>
      )}
    </section>
  );
});

export default RewardVaultSection;
