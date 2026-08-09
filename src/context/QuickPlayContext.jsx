import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GamePlayShell } from '@games';
import { X } from 'lucide-react';
import { playUiClick, playWarpSound } from '@utils/index';
import { CyberWarpOverlay } from '@components/common';

const QuickPlayContext = createContext({
  activeSlug: null,
  openGame: () => {},
  closeGame: () => {},
});

export function QuickPlayProvider({ children }) {
  const [activeSlug, setActiveSlug] = useState(null);
  const [warpActive, setWarpActive] = useState(false);

  const openGame = useCallback((slug) => {
    playWarpSound();
    setWarpActive(true);
    setActiveSlug(slug);

    setTimeout(() => {
      setWarpActive(false);
    }, 450);
  }, []);

  const closeGame = useCallback(() => {
    playUiClick();
    setActiveSlug(null);
  }, []);

  const value = useMemo(
    () => ({ activeSlug, openGame, closeGame }),
    [activeSlug, openGame, closeGame]
  );

  return (
    <QuickPlayContext.Provider value={value}>
      {children}

      <CyberWarpOverlay active={warpActive} />

      <AnimatePresence>
        {activeSlug && !warpActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[600] flex justify-end bg-black/60 backdrop-blur-md"
            onClick={closeGame}
          >
            {/* Slide-over panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative w-full md:w-[85vw] lg:w-[75vw] h-full bg-background border-l border-border flex flex-col shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Floating Close Button at top-right for mobile view safety */}
              <button
                onClick={closeGame}
                className="absolute top-4 right-4 z-[700] p-2 rounded-xl bg-surface border border-border text-text-secondary hover:text-text md:hidden"
                aria-label="Close session"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex-1 overflow-y-auto">
                <GamePlayShell slug={activeSlug} onExit={closeGame} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </QuickPlayContext.Provider>
  );
}

export function useQuickPlay() {
  const context = useContext(QuickPlayContext);
  if (!context) {
    throw new Error('useQuickPlay must be used within a QuickPlayProvider');
  }
  return context;
}
