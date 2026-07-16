import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@utils/index';

export function Carousel({
  children,
  showDots = true,
  showArrows = true,
  className,
  trackClassName,
  itemClassName,
}) {
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(0);

  const updateFromScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el || !el.children.length) return;
    const child = el.children[0];
    const itemWidth = child.getBoundingClientRect().width || 1;
    const gap = parseFloat(getComputedStyle(el).columnGap || getComputedStyle(el).gap || '0') || 0;
    const stride = itemWidth + gap;
    const next = Math.round(el.scrollLeft / stride);
    setIndex(Math.max(0, Math.min(next, el.children.length - 1)));
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return undefined;
    setCount(el.children.length);
    el.addEventListener('scroll', updateFromScroll, { passive: true });
    return () => el.removeEventListener('scroll', updateFromScroll);
  }, [children, updateFromScroll]);

  function scrollTo(i) {
    const el = trackRef.current;
    if (!el || !el.children[i]) return;
    el.children[i].scrollIntoView({
      behavior: 'smooth',
      inline: 'start',
      block: 'nearest',
    });
    setIndex(i);
  }

  function prev() {
    scrollTo(Math.max(0, index - 1));
  }

  function next() {
    scrollTo(Math.min(count - 1, index + 1));
  }

  const items = Array.isArray(children) ? children : [children];

  return (
    <div className={cn('relative', className)}>
      {showArrows && count > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            disabled={index <= 0}
            aria-label="Previous"
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 inline-flex items-center justify-center w-10 h-10 rounded-full bg-black/55 backdrop-blur-md border border-white/10 text-text hover:bg-black/70 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ChevronLeft className="w-5 h-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={next}
            disabled={index >= count - 1}
            aria-label="Next"
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 inline-flex items-center justify-center w-10 h-10 rounded-full bg-black/55 backdrop-blur-md border border-white/10 text-text hover:bg-black/70 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ChevronRight className="w-5 h-5" aria-hidden="true" />
          </button>
        </>
      )}

      <div
        ref={trackRef}
        className={cn(
          'flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth',
          'scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none]',
          '[&::-webkit-scrollbar]:hidden',
          trackClassName,
        )}
      >
        {items.map((child, i) => (
          <div
            key={child?.key ?? i}
            className={cn('snap-start shrink-0', itemClassName ?? 'w-full')}
          >
            {child}
          </div>
        ))}
      </div>

      {showDots && count > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2" role="tablist">
          {Array.from({ length: count }, (_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => scrollTo(i)}
              className={cn(
                'h-1.5 rounded-full transition-all duration-250',
                i === index
                  ? 'w-6 bg-primary'
                  : 'w-1.5 bg-border-hover hover:bg-text-muted',
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
