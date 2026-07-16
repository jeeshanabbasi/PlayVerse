import { memo } from 'react';
import { Section } from '@components/layout';
import { MotionReveal } from '../shared';

export const AboutSection = memo(function AboutSection({ game }) {
  const paragraphs = game.longDescription.split('\n\n').filter(Boolean);

  return (
    <Section title="About the Game" spacing="lg" className="bg-surface/25">
      <MotionReveal>
        <article className="mx-auto max-w-3xl space-y-5">
          {paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="text-body-lg text-text-secondary leading-relaxed md:text-lg">
              {paragraph}
            </p>
          ))}
        </article>
      </MotionReveal>
    </Section>
  );
});
