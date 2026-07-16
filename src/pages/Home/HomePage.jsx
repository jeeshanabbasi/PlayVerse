import { Suspense, lazy, memo } from 'react';
import { motion } from 'framer-motion';
import { pageFade } from '@utils/index';
import { Skeleton } from '@ui';
import { HeroSection } from './sections/HeroSection';
import { FeaturedSection } from './sections/FeaturedSection';

const TrendingSection = lazy(() =>
  import('./sections/TrendingSection').then((m) => ({ default: m.TrendingSection })),
);
const ContinuePlayingSection = lazy(() =>
  import('./sections/ContinuePlayingSection').then((m) => ({
    default: m.ContinuePlayingSection,
  })),
);
const CategoriesSection = lazy(() =>
  import('./sections/CategoriesSection').then((m) => ({ default: m.CategoriesSection })),
);
const TopRatedSection = lazy(() =>
  import('./sections/TopRatedSection').then((m) => ({ default: m.TopRatedSection })),
);
const NewReleasesSection = lazy(() =>
  import('./sections/NewReleasesSection').then((m) => ({ default: m.NewReleasesSection })),
);
const ComingSoonSection = lazy(() =>
  import('./sections/ComingSoonSection').then((m) => ({ default: m.ComingSoonSection })),
);
const RecommendedSection = lazy(() =>
  import('./sections/RecommendedSection').then((m) => ({ default: m.RecommendedSection })),
);
const CommunitySection = lazy(() =>
  import('./sections/CommunitySection').then((m) => ({ default: m.CommunitySection })),
);
const NewsSection = lazy(() =>
  import('./sections/NewsSection').then((m) => ({ default: m.NewsSection })),
);
const NewsletterSection = lazy(() =>
  import('./sections/NewsletterSection').then((m) => ({ default: m.NewsletterSection })),
);

function SectionFallback() {
  return (
    <div className="container-app py-12 md:py-16 space-y-4" aria-hidden="true">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-72 max-w-full" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
        <Skeleton className="aspect-[3/4] rounded-xl" />
        <Skeleton className="aspect-[3/4] rounded-xl" />
        <Skeleton className="aspect-[3/4] rounded-xl hidden md:block" />
        <Skeleton className="aspect-[3/4] rounded-xl hidden md:block" />
      </div>
    </div>
  );
}

function LazyBlock({ children }) {
  return <Suspense fallback={<SectionFallback />}>{children}</Suspense>;
}

function HomePageComponent() {
  return (
    <motion.div
      initial={pageFade.initial}
      animate={pageFade.animate}
      exit={pageFade.exit}
      transition={pageFade.transition}
      className="pb-8"
    >
      <HeroSection />
      <FeaturedSection />

      <LazyBlock>
        <TrendingSection />
      </LazyBlock>
      <LazyBlock>
        <ContinuePlayingSection />
      </LazyBlock>
      <LazyBlock>
        <CategoriesSection />
      </LazyBlock>
      <LazyBlock>
        <TopRatedSection />
      </LazyBlock>
      <LazyBlock>
        <NewReleasesSection />
      </LazyBlock>
      <LazyBlock>
        <ComingSoonSection />
      </LazyBlock>
      <LazyBlock>
        <RecommendedSection />
      </LazyBlock>
      <LazyBlock>
        <CommunitySection />
      </LazyBlock>
      <LazyBlock>
        <NewsSection />
      </LazyBlock>
      <LazyBlock>
        <NewsletterSection />
      </LazyBlock>
    </motion.div>
  );
}

const HomePage = memo(HomePageComponent);

export default HomePage;
export { HomePage };
