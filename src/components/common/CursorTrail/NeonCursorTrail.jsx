import { memo, useEffect, useRef } from 'react';

const SPARK_COLORS = ['#7c3aed', '#22d3ee', '#10b981', '#f97316', '#ec4899', '#ffffff'];

function NeonCursorTrailComponent() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Disable on touch screens
    if (window.matchMedia('(pointer: coarse)').matches) return;

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

    const trail = [];
    const maxTrail = 20;
    const sparks = [];

    const handleMouseMove = (e) => {
      const isEnabled = localStorage.getItem('playverse_cursor_trail') !== 'false';
      if (!isEnabled) return;

      trail.push({
        x: e.clientX,
        y: e.clientY,
        alpha: 1,
        size: 5,
      });

      if (trail.length > maxTrail) {
        trail.shift();
      }
    };

    const handlePointerDown = (e) => {
      const isEnabled = localStorage.getItem('playverse_cursor_trail') !== 'false';
      if (!isEnabled) return;

      // Spawn 16 glowing spark particles
      const count = 16;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
        const speed = 2.5 + Math.random() * 4.5;
        sparks.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 2.5 + Math.random() * 2.5,
          color: SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)],
          alpha: 1,
          decay: 0.025 + Math.random() * 0.02,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Render Comet Trail
      for (let i = 0; i < trail.length; i++) {
        const point = trail[i];
        point.alpha *= 0.88;
        point.size *= 0.94;

        if (point.alpha > 0.01) {
          const ratio = i / trail.length;
          const color = ratio > 0.5 ? '#22d3ee' : '#7c3aed';

          ctx.save();
          ctx.shadowColor = color;
          ctx.shadowBlur = 10;
          ctx.fillStyle = color;
          ctx.globalAlpha = point.alpha * 0.7;
          ctx.beginPath();
          ctx.arc(point.x, point.y, Math.max(1, point.size), 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      // 2. Render Click Spark Particles
      for (let i = sparks.length - 1; i >= 0; i--) {
        const spark = sparks[i];
        spark.x += spark.vx;
        spark.y += spark.vy;
        spark.vy += 0.08; // subtle gravity
        spark.vx *= 0.96; // drag
        spark.alpha -= spark.decay;

        if (spark.alpha <= 0) {
          sparks.splice(i, 1);
        } else {
          ctx.save();
          ctx.shadowColor = spark.color;
          ctx.shadowBlur = 12;
          ctx.fillStyle = spark.color;
          ctx.globalAlpha = Math.max(0, spark.alpha);
          ctx.beginPath();
          ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[999]" />;
}

export const NeonCursorTrail = memo(NeonCursorTrailComponent);
export default NeonCursorTrail;
