import { memo } from 'react';
import { motion } from 'framer-motion';
import { Container } from '@components/layout';
import { Code2, Cpu, Rocket } from 'lucide-react';
import { pageFade } from '@utils/index';

function GithubIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function AboutPageComponent() {
  return (
    <motion.div
      initial={pageFade.initial}
      animate={pageFade.animate}
      exit={pageFade.exit}
      transition={pageFade.transition}
      className="pb-16 pt-8 md:pt-16"
    >
      <Container className="max-w-3xl space-y-12">
        {/* Title */}
        <div className="space-y-4">
          <p className="text-label text-primary">About Platform</p>
          <h1 className="text-display-lg md:text-display-xl font-bold tracking-tight text-text">
            PlayVerse
          </h1>
          <p className="text-body-lg text-text-secondary text-base md:text-lg">
            A premium browser games platform designed with a philosophy of absolute simplicity, high readability, and instant gameplay.
          </p>
        </div>

        {/* Content sections with Apple/Linear spacing */}
        <div className="space-y-8 pt-4">
          
          {/* Purpose */}
          <div className="flex gap-4 items-start">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-elevated border border-border text-primary">
              <Rocket className="h-5 w-5" />
            </span>
            <div className="space-y-2">
              <h2 className="text-heading-md font-semibold text-text">Purpose</h2>
              <p className="text-body-md text-text-secondary">
                To serve as a clean, ad-free portfolio displaying high-quality, lightweight mini browser games. The user experience is optimized for instant play without complex dashboards, store listings, and fake multiplayer statistics.
              </p>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="flex gap-4 items-start">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-elevated border border-border text-accent">
              <Cpu className="h-5 w-5" />
            </span>
            <div className="space-y-2">
              <h2 className="text-heading-md font-semibold text-text">Tech Stack</h2>
              <p className="text-body-md text-text-secondary">
                Built with a modular frontend architecture including React 19, Tailwind CSS, Vite, and Framer Motion. The underlying games run on a modular Phaser 3 canvas with direct state hookups to React and custom local storage progress.
              </p>
            </div>
          </div>

          {/* Future Roadmap */}
          <div className="flex gap-4 items-start">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-elevated border border-border text-primary">
              <Code2 className="h-5 w-5" />
            </span>
            <div className="space-y-2">
              <h2 className="text-heading-md font-semibold text-text">Future Roadmap</h2>
              <p className="text-body-md text-text-secondary">
                We plan to integrate seasonal game skins, modular board sizes, cross-device layout synchronizations, and sound synthesizer customization.
              </p>
            </div>
          </div>

        </div>

        {/* GitHub / Repository Link */}
        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-body-sm text-text-muted">
            Code licensed under MIT.
          </p>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface hover:bg-surface-hover border border-border text-text-secondary hover:text-text text-sm transition-colors"
          >
            <GithubIcon className="h-4.5 w-4.5" />
            <span>GitHub Repository</span>
          </a>
        </div>

      </Container>
    </motion.div>
  );
}

export const AboutPage = memo(AboutPageComponent);
export default AboutPage;
