export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export const MEDIA_QUERIES = {
  tablet: `(min-width: ${BREAKPOINTS.md}px)`,
  laptop: `(min-width: ${BREAKPOINTS.lg}px)`,
  desktop: `(min-width: ${BREAKPOINTS.xl}px)`,
  ultraWide: `(min-width: ${BREAKPOINTS['2xl']}px)`,
};
