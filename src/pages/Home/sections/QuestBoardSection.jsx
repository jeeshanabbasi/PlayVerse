import { memo, useMemo, useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Flame, Gift, Rocket, Trophy } from 'lucide-react';
import { useToast } from '@context/index';
import { gamesCatalog } from '@data/games';

const STORAGE_KEY = 'playverse_quest_claims';

function readStorageValue(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function getQuestProgress() {
  const totalSessions = gamesCatalog.reduce((sum, game) => {
    const raw = localStorage.getItem(`playverse.game.${game.id}.playCount`);
    return sum + (Number(raw) || 0);
  }, 0);

  const totalAchievements = gamesCatalog.reduce((sum, game) => {
    const raw = localStorage.getItem(`playverse.game.${game.id}.achievements`);
    try {
      const parsed = raw ? JSON.parse(raw) : [];
      return sum + (Array.isArray(parsed) ? parsed.length : 0);
    } catch {
      return sum;
    }
  }, 0);

  const dailyHistory = readStorageValue('playverse_daily_history', []);
  const streakDays = Array.isArray(dailyHistory) ? dailyHistory.length : 0;

  const bestScore = gamesCatalog.reduce((highest, game) => {
    const raw = localStorage.getItem(`playverse.game.${game.id}.highScore`);
    return Math.max(highest, Number(raw) || 0);
  }, 0);

  return { totalSessions, totalAchievements, streakDays, bestScore };
}

const QUEST_DEFS = [
  {
    id: 'play-3-runs',
    title: 'Three-Run Warmup',
    icon: Rocket,
    reward: '150 XP',
    target: 3,
    description: 'Finish 3 total game sessions.',
    progressFrom: (stats) => stats.totalSessions,
  },
  {
    id: 'achievements-push',
    title: 'Badge Hunter',
    icon: Trophy,
    reward: '250 XP',
    target: 3,
    description: 'Unlock 3 achievement badges.',
    progressFrom: (stats) => stats.totalAchievements,
  },
  {
    id: 'streak-guard',
    title: 'Daily Flame',
    icon: Flame,
    reward: '200 XP',
    target: 2,
    description: 'Keep your challenge streak alive for 2 days.',
    progressFrom: (stats) => stats.streakDays,
  },
  {
    id: 'score-king',
    title: 'High Score Rush',
    icon: Gift,
    reward: '300 XP',
    target: 1000,
    description: 'Reach a personal best above 1000 points.',
    progressFrom: (stats) => stats.bestScore,
  },
];

export const QuestBoardSection = memo(function QuestBoardSection() {
  const [refreshKey, setRefreshKey] = useState(0);
  const { success } = useToast();
  const completedRef = useRef(new Set());

  useEffect(() => {
    const handleRefresh = () => setRefreshKey((value) => value + 1);
    window.addEventListener('storage', handleRefresh);
    window.addEventListener('playverse_stats_updated', handleRefresh);
    window.addEventListener('playverse_profile_updated', handleRefresh);
    return () => {
      window.removeEventListener('storage', handleRefresh);
      window.removeEventListener('playverse_stats_updated', handleRefresh);
      window.removeEventListener('playverse_profile_updated', handleRefresh);
    };
  }, []);

  const quests = useMemo(() => {
    const stats = getQuestProgress();
    const claimed = new Set(readStorageValue(STORAGE_KEY, []));

    return QUEST_DEFS.map((quest) => {
      const progress = quest.progressFrom(stats);
      const isComplete = progress >= quest.target;
      const isClaimed = claimed.has(quest.id);

      return {
        ...quest,
        progress,
        target: quest.target,
        isComplete,
        isClaimed,
        percent: Math.min(100, (progress / quest.target) * 100),
      };
    });
  }, [refreshKey]);

  useEffect(() => {
    quests.forEach((quest) => {
      if (quest.isComplete && !completedRef.current.has(quest.id)) {
        completedRef.current.add(quest.id);
        success('Quest complete!', `${quest.title} is ready to claim for ${quest.reward}.`);
      }
    });
  }, [quests, success]);

  const claimQuest = (questId) => {
    const claimed = new Set(readStorageValue(STORAGE_KEY, []));
    if (claimed.has(questId)) return;

    const quest = quests.find((item) => item.id === questId);
    if (!quest || !quest.isComplete) return;

    claimed.add(questId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...claimed]));
    success('Reward claimed!', `${quest.title} redeemed for ${quest.reward}.`);
    window.dispatchEvent(new Event('playverse_stats_updated'));
    setRefreshKey((value) => value + 1);
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-1.5 text-center md:text-left">
        <p className="text-label text-primary">Quest Board</p>
        <h2 className="text-heading-lg font-bold tracking-tight text-text">Arcade Missions</h2>
        <p className="text-body-md text-text-secondary">Complete local objectives and claim XP rewards for your profile.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {quests.map((quest) => {
          const Icon = quest.icon;
          return (
            <motion.div
              key={quest.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              className="rounded-2xl border border-border bg-surface p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="rounded-full border border-border bg-background px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-text-muted">
                  {quest.reward}
                </span>
              </div>

              <h3 className="mt-4 text-base font-semibold text-text">{quest.title}</h3>
              <p className="mt-1 text-sm text-text-secondary">{quest.description}</p>

              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between text-xs text-text-muted">
                  <span>{quest.progress.toLocaleString()} / {quest.target.toLocaleString()}</span>
                  <span>{Math.round(quest.percent)}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-border">
                  <div
                    className={`h-full rounded-full ${quest.isComplete ? 'bg-primary' : 'bg-accent'}`}
                    style={{ width: `${quest.percent}%` }}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => claimQuest(quest.id)}
                disabled={!quest.isComplete || quest.isClaimed}
                className={`mt-4 w-full rounded-xl px-3 py-2 text-sm font-semibold transition-all ${
                  quest.isClaimed
                    ? 'cursor-default border border-border bg-surface text-text-muted'
                    : quest.isComplete
                      ? 'border border-primary/30 bg-primary/10 text-primary hover:bg-primary/15'
                      : 'cursor-not-allowed border border-border bg-surface text-text-muted'
                }`}
              >
                {quest.isClaimed ? 'Claimed' : quest.isComplete ? 'Claim Reward' : 'In Progress'}
              </button>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
});

export default QuestBoardSection;
