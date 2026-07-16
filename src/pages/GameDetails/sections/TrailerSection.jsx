import { memo, useState } from 'react';
import { Section } from '@components/layout';
import { TrailerCard } from '@game';
import { Skeleton } from '@ui';
import { MotionReveal } from '../shared';

export const TrailerSection = memo(function TrailerSection({ game }) {
  const [playing, setPlaying] = useState(false);
  const [imageReady, setImageReady] = useState(false);
  const trailer = game.trailer;

  return (
    <Section title="Trailer" description="Watch the official cinematic." spacing="md">
      <MotionReveal>
        {playing && trailer.src ? (
          <div className="overflow-hidden rounded-xl border border-border bg-black aspect-video">
            <video
              className="h-full w-full"
              controls
              autoPlay
              poster={trailer.thumbnail}
              src={trailer.src}
            >
              <track kind="captions" />
            </video>
          </div>
        ) : (
          <div className="relative">
            {!imageReady && (
              <Skeleton className="absolute inset-0 z-10 aspect-video w-full rounded-xl" />
            )}
            <img
              src={trailer.thumbnail}
              alt=""
              className="sr-only"
              loading="lazy"
              onLoad={() => setImageReady(true)}
            />
            <TrailerCard
              title={trailer.title}
              thumbnail={trailer.thumbnail}
              duration={trailer.duration}
              onPlay={() => {
                if (trailer.src) setPlaying(true);
              }}
            />
            {!trailer.src && (
              <p className="mt-3 text-body-sm text-center">
                Trailer preview ready — stream placeholder supported for future assets.
              </p>
            )}
          </div>
        )}
      </MotionReveal>
    </Section>
  );
});
