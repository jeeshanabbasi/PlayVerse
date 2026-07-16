import { memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Section } from '@components/layout';
import { ProgressBar } from '@ui';
import { PlayButton } from '@game';
import { recentlyPlayedGames } from '@data/index';
import { useToast } from '@hooks/index';
import { staggerContainer, staggerItem } from '@utils/index';

export const RecentlyPlayedRow = memo(function RecentlyPlayedRow() {
  const { success } = useToast();

  const resume = useCallback(
    (title) => success('Resuming', title),
    [success],
  );

  return (
    <Section
      title="Recently Played"
      description="Jump back into your last sessions."
      spacing="md"
    >
      <motion.ul
        className="flex gap-4 overflow-x-auto pb-1 snap-x snap-mandatory scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: '-40px' }}
        aria-label="Recently played games"
      >
        {recentlyPlayedGames.map((game) => (
          <motion.li
            key={game.id}
            variants={staggerItem}
            className="snap-start shrink-0 w-[85%] sm:w-[420px]"
          >
            <article className="flex h-full flex-col gap-4 rounded-xl border border-border bg-surface/80 p-3 sm:flex-row sm:items-center sm:p-4 hover:border-border-hover hover:bg-surface-hover transition-colors">
              <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-lg sm:h-24 sm:w-36">
                <img
                  src={game.image}
                  alt={game.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="min-w-0 flex-1 space-y-2.5">
                <div>
                  <h3 className="text-heading-sm text-text truncate">{game.title}</h3>
                  <p className="text-body-sm">{game.chapter} · {game.lastPlayed}</p>
                </div>
                <ProgressBar value={game.progress} variant="accent" showValue label="Progress" />
              </div>
              <PlayButton
                size="md"
                className="w-full sm:w-auto shrink-0"
                onClick={() => resume(game.title)}
              >
                Continue
              </PlayButton>
            </article>
          </motion.li>
        ))}
      </motion.ul>
    </Section>
  );
});
