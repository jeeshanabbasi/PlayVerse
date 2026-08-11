import { memo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Sparkles, X, Award, CheckCircle } from 'lucide-react';
import { cn, playUiClick, playAchievementUnlockedFanfare } from '@utils/index';

const CONFETTI_COLORS = ['#f59e0b', '#fbbf24', '#22d3ee', '#ec4899', '#7c3aed', '#10b981', '#ffffff'];

function TrophyCelebrationModalComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [trophyData, setTrophyData] = useState(null);
  const canvasRef = useRef(null);
  const autoCloseRef = useRef(null);

  useEffect(() => {
    const handleCelebration = (e) => {
      const data = e.detail || {
        title: 'Achievement Unlocked!',
        description: 'You unlocked a milestone badge.',
        icon: '🏆',
        xp: 500,
        isRecord: false,
      };

      setTrophyData(data);
      setIsOpen(true);
      playAchievementUnlockedFanfare();

      clearTimeout(autoCloseRef.current);
      autoCloseRef.current = setTimeout(() => {
        setIsOpen(false);
      }, 7000);
    };

    window.addEventListener('playverse_achievement_celebration', handleCelebration);
    return () => {
      window.removeEventListener('playverse_achievement_celebration', handleCelebration);
      clearTimeout(autoCloseRef.current);
    };
  }, []);

  // Confetti particles canvas animation
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Erupt 80 particle sparks from center
    const cx = width / 2;
    const cy = height / 2 - 40;
    const particles = Array.from({ length: 85 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 8.5;
      return {
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3.5, // Initial upward burst
        size: 3 + Math.random() * 4.5,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8,
        gravity: 0.12,
        drag: 0.985,
        alpha: 1,
        decay: 0.008 + Math.random() * 0.008,
      };
    });

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.vx *= p.drag;
        p.vy = p.vy * p.drag + p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.alpha -= p.decay;

        if (p.alpha > 0) {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 10;

          // Draw small rotating rectangular confetti ribbon
          ctx.fillRect(-p.size, -p.size / 2, p.size * 2, p.size);
          ctx.restore();
        }
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);

  const handleClose = () => {
    playUiClick();
    clearTimeout(autoCloseRef.current);
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && trophyData && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[900] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl select-none"
          onClick={handleClose}
        >
          {/* Background Rotating Radial Sunburst Beams */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-35">
            <div
              className="w-[850px] h-[850px] rounded-full animate-spin-slow"
              style={{
                background: `conic-gradient(
                  from 0deg,
                  rgba(245, 158, 11, 0.3) 0deg 15deg,
                  transparent 15deg 30deg,
                  rgba(34, 211, 238, 0.3) 30deg 45deg,
                  transparent 45deg 60deg,
                  rgba(236, 72, 153, 0.3) 60deg 75deg,
                  transparent 75deg 90deg,
                  rgba(245, 158, 11, 0.3) 90deg 105deg,
                  transparent 105deg 120deg,
                  rgba(34, 211, 238, 0.3) 120deg 135deg,
                  transparent 135deg 150deg,
                  rgba(236, 72, 153, 0.3) 150deg 165deg,
                  transparent 165deg 180deg,
                  rgba(245, 158, 11, 0.3) 180deg 195deg,
                  transparent 195deg 210deg,
                  rgba(34, 211, 238, 0.3) 210deg 225deg,
                  transparent 225deg 240deg,
                  rgba(236, 72, 153, 0.3) 240deg 255deg,
                  transparent 255deg 270deg,
                  rgba(245, 158, 11, 0.3) 270deg 285deg,
                  transparent 285deg 300deg,
                  rgba(34, 211, 238, 0.3) 300deg 315deg,
                  transparent 315deg 330deg,
                  rgba(236, 72, 153, 0.3) 330deg 345deg,
                  transparent 345deg 360deg
                )`,
                filter: 'blur(30px)',
              }}
            />
          </div>

          {/* Confetti Canvas */}
          <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

          {/* Central 3D Trophy Card */}
          <motion.div
            initial={{ scale: 0.6, y: 50, rotateX: 20 }}
            animate={{ scale: 1, y: 0, rotateX: 0 }}
            exit={{ scale: 0.7, y: 30, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 24 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-warning/40 bg-surface/95 p-8 text-center shadow-[0_0_60px_rgba(245,158,11,0.35)] backdrop-blur-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{ perspective: '1000px' }}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-border/40 text-text-secondary hover:text-text hover:bg-border/60 transition-colors"
              aria-label="Close celebration modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Floating 3D Golden Trophy Shield */}
            <motion.div
              animate={{
                y: [-6, 6, -6],
                rotateZ: [-2, 2, -2],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="relative mx-auto my-3 flex h-32 w-32 items-center justify-center rounded-3xl border-2 border-warning bg-gradient-to-br from-warning/30 via-surface-elevated to-warning/10 shadow-[0_0_40px_rgba(245,158,11,0.5)]"
            >
              {/* Shimmer Specular Light */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none" />

              <span className="text-6xl drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)] filter">
                {trophyData.icon || '🏆'}
              </span>

              {/* Pulsing Corner Badges */}
              <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-warning text-black font-bold shadow-lg animate-bounce">
                <Sparkles className="w-4 h-4 fill-current" />
              </div>
            </motion.div>

            {/* Details Typography */}
            <div className="mt-6 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-warning/15 border border-warning/30 text-warning text-xs font-mono font-bold uppercase tracking-widest">
                <Trophy className="w-3.5 h-3.5" />
                <span>{trophyData.isRecord ? 'NEW RECORD BEATEN' : 'ACHIEVEMENT UNLOCKED'}</span>
              </div>

              <h2 className="text-heading-xl font-bold text-text tracking-tight mt-1">
                {trophyData.title}
              </h2>

              <p className="text-body-sm text-text-secondary max-w-xs mx-auto">
                {trophyData.description}
              </p>

              {/* XP Reward Pill */}
              <div className="inline-flex items-center gap-2 px-4 py-2 mt-3 rounded-2xl bg-surface-elevated border border-border/80 text-sm font-semibold text-text shadow-inner">
                <CheckCircle className="w-4 h-4 text-success" />
                <span>+{trophyData.xp || 500} Gamer XP</span>
                <span className="text-xs text-text-muted">· Trophy Saved</span>
              </div>
            </div>

            {/* Action Claim Button */}
            <div className="mt-7">
              <button
                type="button"
                onClick={handleClose}
                className="w-full btn-primary justify-center py-3.5 text-base font-bold rounded-xl shadow-[0_0_25px_rgba(245,158,11,0.4)] bg-gradient-to-r from-warning via-amber-500 to-warning hover:brightness-110 text-black border-none cursor-pointer"
              >
                <span>Claim & Continue</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export const TrophyCelebrationModal = memo(TrophyCelebrationModalComponent);
export default TrophyCelebrationModal;
