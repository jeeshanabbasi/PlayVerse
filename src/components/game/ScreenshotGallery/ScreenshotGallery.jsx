import { useCallback, useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Download, Maximize2, ZoomIn, ZoomOut } from 'lucide-react';
import { cn, fadeIn, scaleIn } from '@utils/index';
import { useLockBodyScroll } from '@hooks/index';

function normalizeScreenshots(screenshots = []) {
  return screenshots.map((item, index) => {
    if (typeof item === 'string') {
      return { id: String(index), src: item, alt: `Screenshot ${index + 1}` };
    }
    return {
      id: item.id ?? String(index),
      src: item.src ?? item.url ?? item.image,
      alt: item.alt ?? `Screenshot ${index + 1}`,
    };
  }).filter((item) => item.src);
}

export function ScreenshotGallery({
  screenshots = [],
  layout = 'grid',
  className,
}) {
  const items = normalizeScreenshots(screenshots);
  const [selected, setSelected] = useState(0);
  const [lightbox, setLightbox] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  useLockBodyScroll(lightbox != null);

  const closeLightbox = useCallback(() => {
    setLightbox(null);
    setZoom(1);
    setIsFullscreen(false);
  }, []);

  const handleDownload = useCallback(() => {
    if (lightbox == null) return;
    const img = items[lightbox];
    const link = document.createElement('a');
    link.href = img.src;
    link.download = img.alt || `screenshot-${lightbox + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [lightbox, items]);

  const handleZoom = useCallback((direction) => {
    setZoom((prev) => {
      const newZoom = direction === 'in' ? prev + 0.25 : Math.max(1, prev - 0.25);
      return Math.min(3, newZoom);
    });
  }, []);

  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback((e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchStartX.current - touchEndX;
    const diffY = Math.abs(touchStartY.current - touchEndY);

    if (Math.abs(diffX) > 50 && diffY < 50) {
      if (diffX > 0) {
        setLightbox((current) => (current == null ? 0 : (current + 1) % items.length));
      } else {
        setLightbox((current) =>
          current == null ? 0 : (current - 1 + items.length) % items.length,
        );
      }
      setZoom(1);
    }
  }, [items.length]);

  useEffect(() => {
    if (lightbox == null) return undefined;

    function onKeyDown(event) {
      if (event.key === 'Escape') {
        closeLightbox();
        return;
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        setZoom(1);
        setLightbox((current) => (current == null ? 0 : (current + 1) % items.length));
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setZoom(1);
        setLightbox((current) =>
          current == null ? 0 : (current - 1 + items.length) % items.length,
        );
      }
      if (event.key === '+' || event.key === '=') {
        event.preventDefault();
        handleZoom('in');
      }
      if (event.key === '-') {
        event.preventDefault();
        handleZoom('out');
      }
      if (event.key === 'f') {
        event.preventDefault();
        setIsFullscreen((prev) => !prev);
      }
      if (event.key === 'd') {
        event.preventDefault();
        handleDownload();
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightbox, closeLightbox, items.length, handleZoom, handleDownload]);

  if (!items.length) return null;

  const isScroll = layout === 'scroll' || layout === 'horizontal';

  return (
    <>
      <div
        className={cn(
          isScroll
            ? 'flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-thin'
            : 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3',
          className,
        )}
      >
        {items.map((item, index) => {
          const isSelected = selected === index;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setSelected(index);
                setLightbox(index);
              }}
              className={cn(
                'group relative overflow-hidden rounded-xl border bg-surface text-left',
                'aspect-video transition-all duration-250',
                isScroll && 'min-w-[220px] md:min-w-[280px] snap-start shrink-0',
                isSelected
                  ? 'border-primary shadow-[var(--shadow-glow-primary)]'
                  : 'border-border hover:border-border-hover',
              )}
            >
              <img
                src={item.src}
                alt={item.alt}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-400 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors duration-250 group-hover:bg-black/20" />
            </button>
          );
        })}
      </div>

      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {lightbox != null && items[lightbox] && (
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
                {...fadeIn}
              >
                <button
                  type="button"
                  aria-label="Close screenshot"
                  className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                  onClick={closeLightbox}
                />
                <motion.div
                  className="relative z-10 w-full"
                  style={{ maxWidth: isFullscreen ? '100%' : 'max(90vw, 320px)' }}
                  {...scaleIn}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                  <div className="absolute -top-8 left-0 right-0 md:top-3 md:left-3 md:right-auto flex items-center gap-2 z-30 flex-wrap">
                    <span className="text-xs text-text-muted bg-black/60 px-3 py-1 rounded-full">
                      {lightbox + 1} / {items.length}
                    </span>
                    <span className="hidden md:inline-block text-xs text-text-muted bg-black/60 px-3 py-1 rounded-full">
                      ← → | +/- | F | D
                    </span>
                  </div>

                  <div className="absolute top-3 right-14 md:right-20 z-20 flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleZoom('in')}
                      disabled={zoom >= 3}
                      className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-black/60 border border-white/10 text-text hover:bg-black/80 disabled:opacity-50 transition-colors"
                      aria-label="Zoom in"
                      title="Zoom in (+)"
                    >
                      <ZoomIn className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleZoom('out')}
                      disabled={zoom <= 1}
                      className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-black/60 border border-white/10 text-text hover:bg-black/80 disabled:opacity-50 transition-colors"
                      aria-label="Zoom out"
                      title="Zoom out (-)"
                    >
                      <ZoomOut className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsFullscreen(!isFullscreen)}
                      className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-black/60 border border-white/10 text-text hover:bg-black/80 transition-colors"
                      aria-label="Fullscreen"
                      title="Fullscreen (F)"
                    >
                      <Maximize2 className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleDownload}
                      className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-black/60 border border-white/10 text-text hover:bg-black/80 transition-colors"
                      aria-label="Download"
                      title="Download (D)"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={closeLightbox}
                    className="absolute -top-2 -right-2 md:top-3 md:right-3 z-40 inline-flex items-center justify-center w-10 h-10 rounded-full bg-black/60 border border-white/10 text-text hover:bg-black/80 transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" aria-hidden="true" />
                  </button>

                  <div className="overflow-hidden rounded-xl border border-border shadow-[var(--shadow-lift)]">
                    <img
                      src={items[lightbox].src}
                      alt={items[lightbox].alt}
                      className={cn(
                        'w-full bg-surface transition-transform duration-300 object-contain',
                        isFullscreen ? 'h-screen' : 'max-h-[80vh]',
                      )}
                      style={{ transform: `scale(${zoom})` }}
                    />
                  </div>
                  {items.length > 1 && (
                    <div className="mt-4 flex gap-2 overflow-x-auto pb-2 justify-center">
                      {items.map((item, index) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setLightbox(index)}
                          className={cn(
                            'relative h-12 w-16 flex-shrink-0 rounded-lg border transition-all overflow-hidden',
                            lightbox === index
                              ? 'border-primary ring-2 ring-primary/50'
                              : 'border-border/50 hover:border-border',
                          )}
                          aria-label={`Go to image ${index + 1}`}
                        >
                          <img
                            src={item.src}
                            alt={item.alt}
                            className="h-full w-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
