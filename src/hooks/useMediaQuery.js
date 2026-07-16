import { useState, useEffect } from 'react';
import { BREAKPOINTS } from '@constants/breakpoints';

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const media = window.matchMedia(query);
    const handler = (event) => setMatches(event.matches);

    setMatches(media.matches);
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

export function useBreakpoint(breakpoint) {
  const value = BREAKPOINTS[breakpoint] ?? BREAKPOINTS.md;
  return useMediaQuery(`(min-width: ${value}px)`);
}

export function useIsMobile() {
  return !useBreakpoint('md');
}

export function useIsTablet() {
  const isMd = useBreakpoint('md');
  const isLg = useBreakpoint('lg');
  return isMd && !isLg;
}

export function useIsDesktop() {
  return useBreakpoint('lg');
}

export function usePrefersReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
