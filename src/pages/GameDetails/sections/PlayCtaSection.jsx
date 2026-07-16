import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '@components/layout';
import { PlayButton } from '@game';
import { MotionReveal } from '../shared';

export const PlayCtaSection = memo(function PlayCtaSection({ game }) {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <div
        className="absolute inset-0 bg-gradient-to-br from-primary/30 via-background to-accent/15"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(124,58,237,0.35),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(34,211,238,0.2),transparent_35%)] opacity-50"
        aria-hidden="true"
      />

      <Container className="relative z-10">
        <MotionReveal>
          <div className="mx-auto max-w-3xl text-center space-y-6 rounded-xl border border-border bg-surface/70 p-8 md:p-12 backdrop-blur-xl shadow-[var(--shadow-blur)]">
            <p className="text-label text-accent">Play Experience</p>
            <h2 className="text-display-md text-text">Ready to drop in?</h2>
            <p className="text-body-lg">
              Launch {game.title} instantly in your browser — no installs, no waiting.
            </p>
            <PlayButton
              size="lg"
              magnetic
              className="mx-auto"
              onClick={() => navigate(`/play/${game.slug}`)}
            >
              Play Now
            </PlayButton>
          </div>
        </MotionReveal>
      </Container>
    </section>
  );
});
