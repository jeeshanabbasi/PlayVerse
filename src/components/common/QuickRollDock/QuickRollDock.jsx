import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Dices, Sparkles } from 'lucide-react';
import { playUiClick, playWarpSound } from '@utils/index';

export function QuickRollDock() {
  const [isHovered, setIsHovered] = useState(false);
  const [isRolling, setIsRolling] = useState(false);

  const handleLaunch = () => {
    if (isRolling) return;
    setIsRolling(true);
    playUiClick();
    playWarpSound();

    setTimeout(() => {
      window.dispatchEvent(new Event('playverse_open_surprise_me'));
      setIsRolling(false);
    }, 280);
  };

  // Optional keyboard shortcut [R] to trigger Quick Roll when not typing in form fields
  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') return;
      if (e.key === 'r' || e.key === 'R') {
        if (!e.ctrlKey && !e.metaKey && !e.altKey) {
          handleLaunch();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRolling]);

  return (
    <aside aria-label="Quick Roll Arcade Launcher" className="fixed bottom-20 right-4 sm:bottom-8 sm:right-8 z-40 pointer-events-auto select-none">
      <motion.button
        type="button"
        onClick={handleLaunch}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.06, y: -3 }}
        whileTap={{ scale: 0.92 }}
        initial={{ opacity: 0, scale: 0.6, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="group relative flex items-center gap-2.5 rounded-full p-1.5 pr-4 pl-2 sm:pr-5 sm:pl-2.5 bg-surface/90 backdrop-blur-xl border border-primary/40 shadow-[0_0_24px_rgba(124,58,237,0.35)] hover:shadow-[0_0_35px_rgba(124,58,237,0.65)] hover:border-primary transition-all duration-300 cursor-pointer overflow-hidden"
        title="Quick Roll - Launch a random arcade game (Press R)"
        aria-label="Quick Roll - Launch a random arcade game"
      >
        {/* Animated Cyber Glow Backlight */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          aria-hidden="true"
        />

        {/* Outer Rotating Shimmer Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="absolute -inset-1 rounded-full bg-[conic-gradient(from_0deg,transparent_0_300deg,rgba(168,85,247,0.5)_360deg)] pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity"
          aria-hidden="true"
        />

        {/* Dice Orb Icon */}
        <div className="relative z-10 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent shadow-md text-white">
          <motion.div
            animate={isRolling ? { rotate: [0, 180, 360], scale: [1, 1.25, 1] } : { rotate: isHovered ? 45 : 0 }}
            transition={{ duration: isRolling ? 0.35 : 0.2 }}
          >
            <Dices className="h-5 w-5 sm:h-5 sm:w-5 drop-shadow" />
          </motion.div>

          {/* Mini sparkle ping */}
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
          </span>
        </div>

        {/* Text Details */}
        <div className="relative z-10 text-left">
          <div className="flex items-center gap-1.5">
            <span className="text-xs sm:text-sm font-bold tracking-wide text-text group-hover:text-white transition-colors">
              Quick Roll
            </span>
            <Sparkles className="h-3 w-3 text-accent animate-pulse" />
          </div>
          <span className="block text-[10px] font-mono uppercase tracking-wider text-text-muted group-hover:text-text-secondary transition-colors">
            Random Play <kbd className="hidden sm:inline-block px-1 py-0.2 rounded bg-surface border border-border text-[9px] text-primary ml-1">R</kbd>
          </span>
        </div>
      </motion.button>
    </aside>
  );
}

export default QuickRollDock;
