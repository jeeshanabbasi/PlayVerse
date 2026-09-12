import { memo, useCallback, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Section, Grid } from '@components/layout';
import { ComingSoonCard } from '@game';
import { Badge } from '@ui';
import { comingSoonGames } from '@data/index';
import { useToast } from '@hooks/index';
import { staggerContainer, staggerItem } from '@utils/index';
import { MotionSection, useCountdown } from './shared';

const REMINDER_KEY = 'playverse_coming_soon_reminders';

function readReminderSet() {
  try {
    const raw = localStorage.getItem(REMINDER_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? new Set(parsed) : new Set();
  } catch {
    return new Set();
  }
}

function CountdownBadge({ releaseDate }) {
  const { days, hours, minutes, expired } = useCountdown(releaseDate);

  if (expired) {
    return <Badge variant="accent">Available soon</Badge>;
  }

  return (
    <Badge variant="warning" className="tabular-nums">
      {days}d {hours}h {minutes}m
    </Badge>
  );
}

export const ComingSoonSection = memo(function ComingSoonSection() {
  const { success, info } = useToast();
  const [reminders, setReminders] = useState(() => readReminderSet());

  useEffect(() => {
    setReminders(readReminderSet());
  }, []);

  const toggleReminder = useCallback(
    (game) => {
      const next = new Set(reminders);
      const isSet = next.has(game.id);

      if (isSet) {
        next.delete(game.id);
        info('Reminder cleared', `${game.title} will no longer be pinned.`);
      } else {
        next.add(game.id);
        success('Notification set', `We'll remind you about ${game.title}`);
        info('Synced', 'Stored in your PlayVerse profile');
      }

      setReminders(next);
      localStorage.setItem(REMINDER_KEY, JSON.stringify([...next]));
      window.dispatchEvent(new Event('playverse_notifications_updated'));
    },
    [reminders, success, info],
  );

  return (
    <Section
      title="Coming Soon"
      description="Lock in alerts before the countdown hits zero."
      spacing="md"
      className="bg-surface/25"
    >
      <MotionSection>
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-60px' }}
        >
          <Grid cols={{ base: 1, sm: 2, lg: 3 }} gap="gap-4 md:gap-5">
            {comingSoonGames.map((game) => {
              const isNotified = reminders.has(game.id);

              return (
                <motion.div key={game.id} variants={staggerItem} className="relative">
                  <div className="absolute top-3 right-3 z-20">
                    <CountdownBadge releaseDate={game.releaseDate} />
                  </div>
                  <ComingSoonCard
                    title={game.title}
                    image={game.image}
                    date={game.dateLabel}
                    isNotified={isNotified}
                    onNotify={() => toggleReminder(game)}
                  />
                </motion.div>
              );
            })}
          </Grid>
        </motion.div>
      </MotionSection>
    </Section>
  );
});
