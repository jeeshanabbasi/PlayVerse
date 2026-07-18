import { memo } from 'react';
import { motion } from 'framer-motion';
import { pageFade } from '@utils/index';
import { HeroSection } from './sections/HeroSection';
import { FeaturedSection } from './sections/FeaturedSection';
import { ContinuePlayingSection } from './sections/ContinuePlayingSection';

function HomePageComponent() {
  return (
    <motion.div
      initial={pageFade.initial}
      animate={pageFade.animate}
      exit={pageFade.exit}
      transition={pageFade.transition}
      className="pb-16 flex flex-col gap-16 md:gap-24"
    >
      <HeroSection />
      
      <div className="container-app flex flex-col gap-16 md:gap-24">
        <FeaturedSection />
        <ContinuePlayingSection />
      </div>
    </motion.div>
  );
}

export const HomePage = memo(HomePageComponent);
export default HomePage;
