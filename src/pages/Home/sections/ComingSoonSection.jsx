import { memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Section, Grid } from '@components/layout';
import { ComingSoonCard } from '@game';
import { Badge } from '@ui';
import { comingSoonGames } from '@data/index';
import { useToast } from '@hooks/index';
import { staggerContainer, staggerItem } from '@utils/index';
import { MotionSection, useCountdown } from './shared';

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

  const notify = useCallback(
    (title) => {
      success('Notification set', `We'll remind you about ${title}`);
      info('Synced', 'Across your PlayVerse profile');
    },
    [success, info],
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
            {comingSoonGames.map((game) => (
              <motion.div key={game.id} variants={staggerItem} className="relative">
                <div className="absolute top-3 right-3 z-20">
                  <CountdownBadge releaseDate={game.releaseDate} />
                </div>
                <ComingSoonCard
                  title={game.title}
                  image={game.image}
                  date={game.dateLabel}
                  onNotify={() => notify(game.title)}
                />
              </motion.div>
            ))}
          </Grid>
        </motion.div>
      </MotionSection>
    </Section>
  );
});
