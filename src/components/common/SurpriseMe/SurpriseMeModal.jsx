import { memo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dices, Play, RotateCw, X, Sparkles } from 'lucide-react';
import { gamesCatalog } from '@data/games';
import { useQuickPlay } from '@context/index';
import { cn, playUiTick, playUiClick, playAchievementUnlockedFanfare } from '@utils/index';

function SurpriseMeModalComponent({ isOpen, onClose }) {
  const { openGame } = useQuickPlay();
  const [spinning, setSpinning] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [winner, setWinner] = useState(null);
  const spinIntervalRef = useRef(null);

  const startSpin = () => {
    setWinner(null);
    setSpinning(true);

    let speed = 60;
    let elapsed = 0;
    const totalDuration = 2200;

    const tick = () => {
      setSelectedIndex((prev) => (prev + 1) % gamesCatalog.length);
      playUiTick();
      elapsed += speed;

      if (elapsed < totalDuration) {
        // Gradually slow down
        if (elapsed > totalDuration * 0.6) {
          speed += 25;
        } else if (elapsed > totalDuration * 0.8) {
          speed += 50;
        }
        spinIntervalRef.current = setTimeout(tick, speed);
      } else {
        // Pick final winner
        const randomIndex = Math.floor(Math.random() * gamesCatalog.length);
        setSelectedIndex(randomIndex);
        setWinner(gamesCatalog[randomIndex]);
        setSpinning(false);
        playAchievementUnlockedFanfare();
      }
    };

    tick();
  };

  useEffect(() => {
    if (isOpen) {
      startSpin();
    } else {
      clearTimeout(spinIntervalRef.current);
      setSpinning(false);
      setWinner(null);
    }
    return () => clearTimeout(spinIntervalRef.current);
  }, [isOpen]);

  const handleLaunch = () => {
    if (!winner) return;
    playUiClick();
    onClose();
    openGame(winner.id);
  };

  const currentGame = winner || gamesCatalog[selectedIndex] || gamesCatalog[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[700] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 26 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-primary/30 bg-surface/90 p-6 md:p-8 text-center shadow-[var(--shadow-glow-primary)] backdrop-blur-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => {
                playUiClick();
                onClose();
              }}
              className="absolute top-4 right-4 p-2 rounded-full bg-border/40 text-text-secondary hover:text-text hover:bg-border/60 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Title */}
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-semibold uppercase tracking-wider">
                <Dices className="w-4 h-4 animate-spin-slow" />
                <span>Arcade Roulette</span>
              </div>
              <h3 className="text-heading-lg font-bold text-text mt-2">
                {spinning ? 'Selecting Random Game...' : 'Your Next Quest!'}
              </h3>
              <p className="text-xs text-text-secondary">
                {spinning ? 'Shuffling through the classic vault' : 'The arcade oracle has chosen'}
              </p>
            </div>

            {/* Game Card Spinner Showcase */}
            <div className="relative my-6 aspect-[16/10] overflow-hidden rounded-2xl border border-border/80 bg-surface-elevated shadow-inner">
              <img
                src={currentGame?.image}
                alt={currentGame?.title}
                className={cn(
                  'h-full w-full object-cover transition-all duration-200',
                  spinning ? 'blur-[1px] scale-98' : 'scale-100'
                )}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent flex flex-col justify-end p-4 text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-accent flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {currentGame?.genres?.join(' · ')}
                </span>
                <h4 className="text-xl font-bold text-text drop-shadow-md">
                  {currentGame?.title}
                </h4>
              </div>

              {/* Roulette Highlight Glow */}
              {!spinning && winner && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 border-2 border-primary rounded-2xl shadow-[inset_0_0_24px_rgba(124,58,237,0.4)] pointer-events-none"
                />
              )}
            </div>

            {/* Action controls */}
            <div className="flex gap-3 mt-4">
              <button
                type="button"
                disabled={spinning}
                onClick={startSpin}
                className="flex-1 btn-secondary justify-center py-3 text-sm font-semibold rounded-xl border border-border hover:border-border-hover disabled:opacity-50"
              >
                <RotateCw className={cn('w-4 h-4 mr-1.5', spinning && 'animate-spin')} />
                <span>Spin Again</span>
              </button>

              <button
                type="button"
                disabled={spinning || !winner}
                onClick={handleLaunch}
                className="flex-1 btn-primary justify-center py-3 text-sm font-semibold rounded-xl shadow-[var(--shadow-glow)] disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-current mr-1.5" />
                <span>Play Now</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export const SurpriseMeModal = memo(SurpriseMeModalComponent);
export default SurpriseMeModal;
