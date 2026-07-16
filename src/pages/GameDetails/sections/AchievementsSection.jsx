import { memo } from 'react';
import { motion } from 'framer-motion';
import { Section } from '@components/layout';
import { ProgressBar, CircularProgress } from '@ui';
import { staggerContainer, staggerItem } from '@utils/index';
import { cn } from '@utils/index';
import { MotionReveal } from '../shared';

export const AchievementsSection = memo(function AchievementsSection({ game }) {
  return (
    <Section
      title="Achievements"
      description="Track badges and completion across your profile."
      spacing="md"
      className="bg-surface/20"
    >
      <MotionReveal className="space-y-6">
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-label text-primary">Overall Completion</p>
            <p className="text-heading-md text-text">{game.overallCompletion}% unlocked</p>
          </div>
          <CircularProgress value={game.overallCompletion} size={72} />
        </div>

        <motion.ul
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-40px' }}
        >
          {game.achievements.map((item) => (
            <motion.li
              key={item.id}
              variants={staggerItem}
              className={cn(
                'rounded-xl border p-4 space-y-3 transition-colors',
                item.unlocked
                  ? 'border-primary/30 bg-primary/5'
                  : 'border-border bg-surface opacity-80',
              )}
            >
              <div className="flex items-start gap-3">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-elevated border border-border text-lg"
                  aria-hidden="true"
                >
                  {item.icon}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-text">{item.name}</p>
                  <p className="text-body-sm">{item.description}</p>
                </div>
              </div>
              <ProgressBar
                value={item.completion}
                variant={item.unlocked ? 'primary' : 'accent'}
                showValue
                label="Completion"
              />
            </motion.li>
          ))}
        </motion.ul>
      </MotionReveal>
    </Section>
  );
});
