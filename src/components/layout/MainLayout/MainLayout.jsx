import { useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Header } from '@components/layout/Header';
import { Footer } from '@components/layout/Footer';
import { QuickPlayProvider } from '@context/index';
import { CommandPalette } from '@components/common';

export function MainLayout() {
  const location = useLocation();
  const outlet = useOutlet();

  return (
    <QuickPlayProvider>
      <div className="flex flex-col min-h-dvh overflow-x-hidden">
        <a
          href="#main-content"
          className="sr-only-focusable fixed top-4 left-4 z-[600] px-4 py-2 bg-primary text-white rounded-xl"
        >
          Skip to content
        </a>

        <Header />

        <main id="main-content" className="flex-1 flex flex-col min-w-0">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              className="flex-1 flex flex-col min-w-0"
            >
              {outlet}
            </motion.div>
          </AnimatePresence>
        </main>

        <Footer />
        <CommandPalette />
      </div>
    </QuickPlayProvider>
  );
}
