import { memo } from 'react';
import { Section } from '@components/layout';
import { SystemRequirementsCard } from '@game';
import { MotionReveal } from '../shared';

export const RequirementsSection = memo(function RequirementsSection({ game }) {
  return (
    <Section
      title="System Requirements"
      description="Optimized for modern browsers. Check your setup."
      spacing="md"
    >
      <MotionReveal>
        <SystemRequirementsCard
          title={null}
          minimum={game.systemRequirements.minimum}
          recommended={game.systemRequirements.recommended}
        />
      </MotionReveal>
    </Section>
  );
});
