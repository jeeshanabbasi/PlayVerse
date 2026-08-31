import { memo } from 'react';
import { motion } from 'framer-motion';
import { pageFade } from '@utils/index';
import { HeroSection } from './sections/HeroSection';
import { FeaturedSection } from './sections/FeaturedSection';
import { ContinuePlayingSection } from './sections/ContinuePlayingSection';
import { LeaderboardSection } from './sections/LeaderboardSection';
import { DailyChallengeSection } from './sections/DailyChallengeSection';
import { ActivityFeedSection } from './sections/ActivityFeedSection';
import { QuestBoardSection } from './sections/QuestBoardSection';
import { AchievementsHub } from '@components/game';

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
      
      <div className="container-app flex flex-col gap-12 md:gap-16">
        <AchievementsHub />
        <DailyChallengeSection />
        <ActivityFeedSection />
        <QuestBoardSection />
        <FeaturedSection />
        <ContinuePlayingSection />
        <LeaderboardSection />
      </div>
    </motion.div>
  );
}

export const HomePage = memo(HomePageComponent);
export default HomePage;
