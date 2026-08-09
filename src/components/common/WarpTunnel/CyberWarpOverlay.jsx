import { memo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function CyberWarpOverlayComponent({ active }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const cx = width / 2;
    const cy = height / 2;

    const streaks = Array.from({ length: 90 }, () => ({
      angle: Math.random() * Math.PI * 2,
      dist: 20 + Math.random() * 80,
      length: 10 + Math.random() * 40,
      speed: 18 + Math.random() * 25,
      color: Math.random() > 0.5 ? '#22d3ee' : '#7c3aed',
      width: 1.5 + Math.random() * 2,
    }));

    const render = () => {
      ctx.fillStyle = 'rgba(5, 5, 12, 0.25)';
      ctx.fillRect(0, 0, width, height);

      streaks.forEach((s) => {
        s.dist += s.speed;
        s.speed *= 1.08; // acceleration
        s.length *= 1.05;

        const x1 = cx + Math.cos(s.angle) * s.dist;
        const y1 = cy + Math.sin(s.angle) * s.dist;
        const x2 = cx + Math.cos(s.angle) * (s.dist + s.length);
        const y2 = cy + Math.sin(s.angle) * (s.dist + s.length);

        ctx.save();
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.width;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 10;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => cancelAnimationFrame(animId);
  }, [active]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[750] pointer-events-none flex items-center justify-center bg-background/90 backdrop-blur-md overflow-hidden"
        >
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

          {/* Central Expanding Cyber Ring */}
          <motion.div
            initial={{ scale: 0.2, opacity: 1 }}
            animate={{ scale: 3.5, opacity: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="w-48 h-48 rounded-full border-4 border-accent shadow-[0_0_50px_rgba(34,211,238,0.8)]"
          />

          <motion.div
            initial={{ scale: 0.1, opacity: 1 }}
            animate={{ scale: 4.5, opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease: 'easeOut' }}
            className="absolute w-40 h-40 rounded-full border-2 border-primary shadow-[0_0_40px_rgba(124,58,237,0.8)]"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export const CyberWarpOverlay = memo(CyberWarpOverlayComponent);
export default CyberWarpOverlay;
