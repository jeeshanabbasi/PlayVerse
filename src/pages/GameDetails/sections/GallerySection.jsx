import { memo } from 'react';
import { Section } from '@components/layout';
import { ScreenshotGallery } from '@game';
import { MotionReveal } from '../shared';

export const GallerySection = memo(function GallerySection({ game }) {
  return (
    <Section
      title="Screenshots"
      description="Capture the look, feel, and battlefield energy."
      spacing="md"
    >
      <MotionReveal>
        <ScreenshotGallery screenshots={game.screenshots} />
      </MotionReveal>
    </Section>
  );
});
