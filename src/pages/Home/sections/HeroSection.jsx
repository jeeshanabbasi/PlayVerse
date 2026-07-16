import { memo, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Button } from '@ui';
import { Container } from '@components/layout';
import { heroData } from '@data/index';
import { cn } from '@utils/index';
import { usePrefersReducedMotion } from '@hooks/index';

function Particles({ count = 28 }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${(i * 37) % 100}%`,
        top: `${(i * 53) % 100}%`,
        size: 2 + (i % 4),
        delay: (i % 10) * 0.35,
        duration: 4 + (i % 5),
      })),
    [count],
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-white/50"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -18, 0],
            opacity: [0.15, 0.55, 0.15],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

export const HeroSection = memo(function HeroSection() {
  const reduced = usePrefersReducedMotion();
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], reduced ? ['0%', '0%'] : ['0%', '18%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, reduced ? 1 : 0.35]);

  return (
    <section ref={sectionRef} className="relative isolate min-h-dvh w-full overflow-hidden">
      <motion.div className="absolute inset-0 scale-110 will-change-transform" style={{ y: bgY }} aria-hidden="true">
        {heroData.backgroundVideo ? (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster={heroData.backgroundImage}
            aria-hidden="true"
          >
            <source src={heroData.backgroundVideo} type="video/mp4" />
          </video>
        ) : (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroData.backgroundImage})` }}
          />
        )}
      </motion.div>

      <div className="absolute inset-0 bg-background/55" aria-hidden="true" />

      <motion.div
        className="absolute inset-0"
        aria-hidden="true"
        animate={
          reduced
            ? undefined
            : {
                background: [
                  'radial-gradient(ellipse 70% 55% at 20% 30%, rgba(124,58,237,0.35), transparent 60%), radial-gradient(ellipse 50% 40% at 80% 20%, rgba(34,211,238,0.18), transparent 55%)',
                  'radial-gradient(ellipse 65% 50% at 30% 40%, rgba(124,58,237,0.28), transparent 60%), radial-gradient(ellipse 55% 45% at 70% 30%, rgba(34,211,238,0.22), transparent 55%)',
                  'radial-gradient(ellipse 70% 55% at 20% 30%, rgba(124,58,237,0.35), transparent 60%), radial-gradient(ellipse 50% 40% at 80% 20%, rgba(34,211,238,0.18), transparent 55%)',
                ],
              }
        }
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div
        className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/30"
        aria-hidden="true"
      />

      {!reduced && <Particles />}

      <div
        className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-background to-transparent"
        aria-hidden="true"
      />

      <Container className="relative z-10 flex min-h-dvh flex-col justify-end pb-24 pt-28 md:justify-center md:pb-32 md:pt-24">
        <motion.div style={{ opacity: contentOpacity }}>
          <motion.div
            className="max-w-3xl space-y-6 md:space-y-8"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-label text-primary">{heroData.brand}</p>

            <div className="space-y-4">
              <h1 className="text-display-lg md:text-display-xl text-text">
                <span className="gradient-text">{heroData.heading}</span>
              </h1>
              <p className="text-body-lg max-w-xl text-text-secondary md:text-lg">
                {heroData.subtitle}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                size="lg"
                magnetic
                className="w-full sm:w-auto"
                onClick={() => {
                  document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {heroData.ctaPrimary.label}
              </Button>
              <Link
                to={heroData.ctaSecondary.href}
                className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-border bg-surface-elevated/80 px-6 text-base font-medium text-text backdrop-blur-md transition-colors hover:border-border-hover hover:bg-surface-hover sm:w-auto"
              >
                {heroData.ctaSecondary.label}
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </Container>

      <motion.a
        href="#featured"
        className={cn(
          'absolute bottom-8 left-1/2 z-10 -translate-x-1/2',
          'inline-flex flex-col items-center gap-2 text-text-muted',
          'hover:text-text transition-colors',
        )}
        aria-label="Scroll to featured games"
        animate={reduced ? undefined : { y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="text-label">Scroll</span>
        <ChevronDown className="w-5 h-5" aria-hidden="true" />
      </motion.a>
    </section>
  );
});
