import { memo, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2 } from 'lucide-react';

const COLORS = [
  '#7c3aed', // Purple
  '#22d3ee', // Cyan
  '#10b981', // Green
  '#f97316', // Orange
  '#ec4899', // Pink
  '#f59e0b', // Amber
];

function ArcadeScreensaverComponent() {
  const [active, setActive] = useState(false);
  const canvasRef = useRef(null);
  const idleTimeoutRef = useRef(null);

  // Reset idle timer on any activity
  useEffect(() => {
    const IDLE_TIME = 60000; // 60 seconds

    const handleActivity = () => {
      setActive(false);
      clearTimeout(idleTimeoutRef.current);
      
      const enabled = localStorage.getItem('playverse_screensaver_enabled') !== 'false';
      if (enabled) {
        idleTimeoutRef.current = setTimeout(() => {
          setActive(true);
        }, IDLE_TIME);
      }
    };

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
    events.forEach((evt) => window.addEventListener(evt, handleActivity, { passive: true }));

    handleActivity(); // initialize timer

    return () => {
      clearTimeout(idleTimeoutRef.current);
      events.forEach((evt) => window.removeEventListener(evt, handleActivity));
    };
  }, []);

  // Run Starfield & Bouncing Logo Canvas animation when active
  useEffect(() => {
    if (!active) return;

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

    // Warp Starfield particles
    const numStars = 180;
    const stars = Array.from({ length: numStars }, () => ({
      x: (Math.random() - 0.5) * width * 2,
      y: (Math.random() - 0.5) * height * 2,
      z: Math.random() * width,
    }));

    // Bouncing Logo Box
    const logo = {
      x: width / 3,
      y: height / 3,
      w: 220,
      h: 60,
      vx: 2.8,
      vy: 2.2,
      colorIndex: 0,
    };

    const render = () => {
      ctx.fillStyle = '#05050a';
      ctx.fillRect(0, 0, width, height);

      // 1. Draw Warp Starfield
      const cx = width / 2;
      const cy = height / 2;

      stars.forEach((star) => {
        star.z -= 4;
        if (star.z <= 0) {
          star.z = width;
          star.x = (Math.random() - 0.5) * width * 2;
          star.y = (Math.random() - 0.5) * height * 2;
        }

        const k = 180 / star.z;
        const px = star.x * k + cx;
        const py = star.y * k + cy;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          const size = Math.max(0.5, (1 - star.z / width) * 2.5);
          const alpha = Math.min(1, (1 - star.z / width) * 1.2);
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.beginPath();
          ctx.arc(px, py, size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // 2. Update and Draw Bouncing Logo
      logo.x += logo.vx;
      logo.y += logo.vy;

      let hit = false;
      if (logo.x <= 10 || logo.x + logo.w >= width - 10) {
        logo.vx *= -1;
        hit = true;
      }
      if (logo.y <= 10 || logo.y + logo.h >= height - 60) {
        logo.vy *= -1;
        hit = true;
      }

      if (hit) {
        logo.colorIndex = (logo.colorIndex + 1) % COLORS.length;
      }

      const currentColor = COLORS[logo.colorIndex];

      // Draw glowing logo capsule
      ctx.save();
      ctx.shadowColor = currentColor;
      ctx.shadowBlur = 24;

      ctx.fillStyle = 'rgba(15, 15, 25, 0.85)';
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = 2.5;

      // Rounded rect
      ctx.beginPath();
      ctx.roundRect(logo.x, logo.y, logo.w, logo.h, 16);
      ctx.fill();
      ctx.stroke();

      // Text inside logo
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px "Space Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('⚡ PLAYVERSE', logo.x + logo.w / 2, logo.y + logo.h / 2);
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [active]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[800] bg-black select-none cursor-none flex flex-col items-center justify-end pb-12"
        >
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

          <div className="relative z-10 text-center space-y-2 pointer-events-none">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 border border-primary/40 text-primary text-xs font-mono font-bold uppercase tracking-widest animate-pulse shadow-[var(--shadow-glow)] backdrop-blur-md">
              <Gamepad2 className="w-4 h-4" />
              <span>ARCADE ATTRACT MODE</span>
            </div>
            <p className="text-sm font-semibold text-text-secondary tracking-wide">
              Press any key or move mouse to resume
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export const ArcadeScreensaver = memo(ArcadeScreensaverComponent);
export default ArcadeScreensaver;
