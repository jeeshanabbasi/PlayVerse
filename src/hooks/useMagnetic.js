import { useRef } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';
import { usePrefersReducedMotion } from './useMediaQuery';

export function useMagnetic({ strength = 0.28, range = 48 } = {}) {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 300, damping: 24 });
  const springY = useSpring(y, { stiffness: 300, damping: 24 });

  function onMouseMove(event) {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const deltaX = event.clientX - (rect.left + rect.width / 2);
    const deltaY = event.clientY - (rect.top + rect.height / 2);

    if (Math.hypot(deltaX, deltaY) < range) {
      x.set(deltaX * strength);
      y.set(deltaY * strength);
    }
  }

  function onMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return {
    ref,
    style: reduced ? undefined : { x: springX, y: springY },
    handlers: { onMouseMove, onMouseLeave },
  };
}
