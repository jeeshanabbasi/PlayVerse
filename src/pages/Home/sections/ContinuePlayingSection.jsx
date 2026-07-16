import { memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Section } from '@components/layout';
import { ProgressBar } from '@ui';
import { PlayButton } from '@game';
import { continuePlaying } from '@data/index';
import { useToast } from '@hooks/index';
import { staggerContainer, staggerItem } from '@utils/index';
import { MotionSection } from './shared';

export const ContinuePlayingSection = memo(function ContinuePlayingSection() {
  const { success } = useToast();

  const resume = useCallback(
    (title) => success('Resuming', title),
    [success],
  );

  return (
    <Section
      title="Continue Playing"
      description="Pick up where you left off."
      spacing="md"
    >
      <MotionSection>
        <motion.ul
          className="space-y-3"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-60px' }}
        >
          {continuePlaying.map((game) => (
            <motion.li
              key={game.id}
              variants={staggerItem}
              className="group flex flex-col gap-4 rounded-xl border border-border bg-surface/80 p-3 sm:flex-row sm:items-center sm:gap-5 sm:p-4 hover:border-border-hover hover:bg-surface-hover transition-colors"
            >
              <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-lg sm:h-20 sm:w-36">
                <img
                  src={game.image}
                  alt={game.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              <div className="min-w-0 flex-1 space-y-2.5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <h3 className="text-heading-sm text-text">{game.title}</h3>
                    <p className="text-body-sm">{game.chapter}</p>
                  </div>
                  <span className="text-body-sm">{game.lastPlayed}</span>
                </div>
                <ProgressBar
                  value={game.progress}
                  variant="accent"
                  showValue
                  label="Progress"
                />
              </div>

              <PlayButton
                size="md"
                className="w-full sm:w-auto shrink-0"
                onClick={() => resume(game.title)}
              >
                Resume
              </PlayButton>
            </motion.li>
          ))}
        </motion.ul>
      </MotionSection>
    </Section>
  );
});
