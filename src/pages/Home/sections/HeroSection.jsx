import { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@ui';

export const HeroSection = memo(function HeroSection() {
  return (
    <section className="relative flex flex-col justify-center items-center text-center px-4 pt-24 pb-16 md:pt-36 md:pb-24 overflow-hidden min-h-[60vh]">
      {/* Subtle modern decorative gradient background */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{
          background: 'radial-gradient(circle 600px at 50% -100px, rgba(124, 58, 237, 0.08), transparent 70%), radial-gradient(circle 800px at 50% 100%, rgba(34, 211, 238, 0.03), transparent 70%)'
        }}
        aria-hidden="true" 
      />

      <div className="relative z-10 max-w-3xl mx-auto space-y-6 md:space-y-8 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4"
        >
          <h1 className="text-display-lg md:text-display-xl font-bold tracking-tight text-text">
            Polished Mini Games. <span className="gradient-text">Instant Play.</span>
          </h1>
          
          <p className="text-body-lg max-w-xl mx-auto text-text-secondary text-base md:text-lg">
            A curated portfolio of 12 classic browser games built with a philosophy of absolute simplicity, polished animations, and zero clutter.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <Button
            size="lg"
            className="w-full sm:w-auto px-8"
            onClick={() => {
              document.getElementById('featured-grid')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Play Games
          </Button>

          <Link
            to="/games"
            className="inline-flex h-12 w-full sm:w-auto items-center justify-center rounded-xl border border-border bg-surface/50 hover:bg-surface px-8 text-base font-medium text-text transition-colors duration-200"
          >
            Browse Collection
          </Link>
        </motion.div>
      </div>
    </section>
  );
});
