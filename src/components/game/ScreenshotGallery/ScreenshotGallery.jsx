import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
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

  useLockBodyScroll(lightbox != null);

  const closeLightbox = useCallback(() => setLightbox(null), []);

  useEffect(() => {
    if (lightbox == null) return undefined;

    function onKeyDown(event) {
      if (event.key === 'Escape') {
        closeLightbox();
        return;
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        setLightbox((current) => (current == null ? 0 : (current + 1) % items.length));
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setLightbox((current) =>
          current == null ? 0 : (current - 1 + items.length) % items.length,
        );
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightbox, closeLightbox, items.length]);

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
                  className="relative z-10 max-w-5xl w-full"
                  {...scaleIn}
                >
                  <button
                    type="button"
                    onClick={closeLightbox}
                    className="absolute -top-2 -right-2 md:top-3 md:right-3 z-20 inline-flex items-center justify-center w-10 h-10 rounded-full bg-black/60 border border-white/10 text-text hover:bg-black/80 transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" aria-hidden="true" />
                  </button>
                  <img
                    src={items[lightbox].src}
                    alt={items[lightbox].alt}
                    className="w-full max-h-[80vh] object-contain rounded-xl border border-border shadow-[var(--shadow-lift)] bg-surface"
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
