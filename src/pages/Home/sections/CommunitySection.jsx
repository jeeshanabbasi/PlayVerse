import { memo } from 'react';
import { motion } from 'framer-motion';
import { Flame, Gift, Users } from 'lucide-react';
import { Section } from '@components/layout';
import { Avatar, Badge, Button } from '@ui';
import { communityHighlights } from '@data/index';
import { staggerContainer, staggerItem } from '@utils/index';
import { MotionSection } from './shared';

export const CommunitySection = memo(function CommunitySection() {
  const { creators, topPlayers, challenge } = communityHighlights;

  return (
    <Section
      title="Community Highlights"
      description="Creators, climbboards, and this week's challenge."
      spacing="lg"
    >
      <MotionSection>
        <motion.div
          className="grid gap-4 lg:grid-cols-12 lg:gap-5"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-60px' }}
        >
          <motion.div
            variants={staggerItem}
            className="rounded-xl border border-border bg-surface p-5 md:p-6 lg:col-span-4 space-y-5"
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" aria-hidden="true" />
              <h3 className="text-heading-sm text-text">Featured Creators</h3>
            </div>
            <ul className="space-y-4">
              {creators.map((creator) => (
                <li key={creator.id} className="flex items-center gap-3">
                  <Avatar src={creator.avatar} name={creator.name} size="md" status="online" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-text truncate">{creator.name}</p>
                    <p className="text-body-sm">{creator.role} · {creator.followers}</p>
                  </div>
                  <Button size="sm" variant="ghost">Follow</Button>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            variants={staggerItem}
            className="rounded-xl border border-border bg-surface p-5 md:p-6 lg:col-span-4 space-y-5"
          >
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-accent" aria-hidden="true" />
              <h3 className="text-heading-sm text-text">Top Players</h3>
            </div>
            <ol className="space-y-3">
              {topPlayers.map((player) => (
                <li
                  key={player.id}
                  className="flex items-center gap-3 rounded-lg border border-border/60 bg-background/40 px-3 py-2.5"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-sm font-bold text-primary">
                    {player.rank}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-text">{player.name}</p>
                    <p className="text-body-sm truncate">{player.game}</p>
                  </div>
                  <span className="text-sm font-semibold tabular-nums text-accent">
                    {player.score}
                  </span>
                </li>
              ))}
            </ol>
          </motion.div>

          <motion.div
            variants={staggerItem}
            className="relative overflow-hidden rounded-xl border border-primary/25 bg-gradient-to-br from-primary/20 via-surface to-surface p-5 md:p-6 lg:col-span-4 flex flex-col"
          >
            <div
              className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent/20 blur-3xl"
              aria-hidden="true"
            />
            <div className="relative flex flex-1 flex-col gap-4">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="accent" dot>{challenge.title}</Badge>
                <span className="text-body-sm tabular-nums">Ends in {challenge.endsIn}</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-display-md text-text leading-tight">{challenge.name}</h3>
                <p className="text-body-md">{challenge.description}</p>
              </div>
              <div className="mt-auto flex flex-wrap items-center gap-3 pt-2">
                <div className="inline-flex items-center gap-2 text-body-sm">
                  <Gift className="w-4 h-4 text-warning" aria-hidden="true" />
                  <span>{challenge.reward}</span>
                </div>
                <span className="text-body-sm text-text-muted">
                  {challenge.participants} joined
                </span>
              </div>
              <Button size="lg" magnetic className="w-full sm:w-auto">
                Join Challenge
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </MotionSection>
    </Section>
  );
});
