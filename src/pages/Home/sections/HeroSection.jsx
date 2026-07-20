import { memo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@ui';

export const HeroSection = memo(function HeroSection() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    // Mouse interactive coordinates
    const mouse = { x: width / 2, y: height / 2, active: false };

    // Stars particle pool for background
    const stars = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * (height * 0.4), // upper part
      size: 0.5 + Math.random() * 1.5,
      alpha: 0.2 + Math.random() * 0.8,
      speed: 0.05 + Math.random() * 0.15,
    }));

    let gridOffset = 0;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Dark background fill
      ctx.fillStyle = '#09090B';
      ctx.fillRect(0, 0, width, height);

      // 1. Draw Starfield in the sky
      stars.forEach((star) => {
        star.y -= star.speed;
        if (star.y < 0) {
          star.y = height * 0.4;
          star.x = Math.random() * width;
        }
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Draw 3D Retro Synthwave Grid
      const horizonY = height * 0.45;
      const gridHeight = height - horizonY;
      gridOffset = (gridOffset + 0.6) % 40; // speed of grid movement

      ctx.lineWidth = 1;

      // Draw Perspective (Vertical) Lines
      const lineCount = 28;
      const spacingX = width / lineCount;
      for (let i = 0; i <= lineCount; i++) {
        const xBottom = i * spacingX;
        const xTop = width / 2 + (xBottom - width / 2) * 0.05; // converge at horizon center

        // Create gradient stroke for lines to fade at horizon
        const grad = ctx.createLinearGradient(0, horizonY, 0, height);
        grad.addColorStop(0, 'rgba(124, 58, 237, 0.02)');   // Fade to dark purple
        grad.addColorStop(0.5, 'rgba(124, 58, 237, 0.15)'); // Neon purple
        grad.addColorStop(1, 'rgba(34, 211, 238, 0.25)');   // Cyan at bottom edge

        ctx.strokeStyle = grad;
        ctx.beginPath();
        ctx.moveTo(xTop, horizonY);
        ctx.lineTo(xBottom, height);
        ctx.stroke();
      }

      // Draw Horizontal Lines using exponential spacing for 3D depth
      const horizontalLineCount = 12;
      for (let i = 0; i < horizontalLineCount; i++) {
        // Map line index + offset into perspective ratio
        const ratio = ((i * 40 + gridOffset) / (horizontalLineCount * 40));
        const y = horizonY + Math.pow(ratio, 2.5) * gridHeight;

        if (y > horizonY && y < height) {
          // Fade line out as it approaches the horizon
          const alpha = Math.min((y - horizonY) / (gridHeight * 0.45), 1.0);
          ctx.strokeStyle = `rgba(34, 211, 238, ${alpha * 0.18})`;

          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      }

      // 3. Draw Horizon soft glow line
      const horizonGrad = ctx.createLinearGradient(0, horizonY - 10, 0, horizonY + 10);
      horizonGrad.addColorStop(0, 'rgba(124, 58, 237, 0)');
      horizonGrad.addColorStop(0.5, 'rgba(124, 58, 237, 0.35)');
      horizonGrad.addColorStop(1, 'rgba(34, 211, 238, 0)');
      ctx.fillStyle = horizonGrad;
      ctx.fillRect(0, horizonY - 10, width, 20);

      // 4. Interactive Mouse Pointer Glow
      if (mouse.active) {
        const mouseGrad = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          150
        );
        mouseGrad.addColorStop(0, 'rgba(124, 58, 237, 0.15)');
        mouseGrad.addColorStop(1, 'rgba(124, 58, 237, 0)');
        ctx.fillStyle = mouseGrad;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 150, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <section className="relative flex flex-col justify-center items-center text-center px-4 pt-24 pb-16 md:pt-36 md:pb-24 overflow-hidden min-h-[60vh] md:min-h-[65vh]">
      {/* Interactive 3D Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block pointer-events-auto"
        style={{ zIndex: 1 }}
      />

      {/* Decorative gradient overlay */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{
          background: 'linear-gradient(to bottom, rgba(9, 9, 11, 0.5) 0%, transparent 40%, rgba(9, 9, 11, 1) 100%)',
          zIndex: 2
        }}
        aria-hidden="true" 
      />

      <div className="relative max-w-3xl mx-auto space-y-6 md:space-y-8 flex flex-col items-center" style={{ zIndex: 10 }}>
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
