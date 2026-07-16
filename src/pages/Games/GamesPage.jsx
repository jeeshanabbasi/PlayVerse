import { memo } from 'react';
import { motion } from 'framer-motion';
import { Container, Section } from '@components/layout';
import { pageFade } from '@utils/index';
import { useGamesExplorer } from '@hooks/index';
import {
  GamesHero,
  GamesFilters,
  TrendingRow,
  RecentlyPlayedRow,
  GamesGrid,
} from './sections';

function GamesPageComponent() {
  const {
    query,
    setQuery,
    filters,
    setFilter,
    setQuick,
    clearFilters,
    results,
    total,
    matching,
    isLoading,
    hasActiveFilters,
  } = useGamesExplorer();

  return (
    <motion.div
      initial={pageFade.initial}
      animate={pageFade.animate}
      exit={pageFade.exit}
      transition={pageFade.transition}
      className="pb-16"
    >
      <Container className="pt-8 md:pt-12 space-y-10 md:space-y-12">
        <GamesHero
          query={query}
          onQueryChange={setQuery}
          onClear={() => setQuery('')}
          quick={filters.quick}
          onQuickChange={setQuick}
          matching={matching}
          total={total}
        />

        <GamesFilters
          filters={filters}
          onFilterChange={setFilter}
          onClear={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </Container>

      <TrendingRow />
      <RecentlyPlayedRow />

      <Section
        title="All Games"
        description="Browse the full PlayVerse catalog."
        spacing="md"
      >
        <GamesGrid
          games={results}
          isLoading={isLoading}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
        />
      </Section>
    </motion.div>
  );
}

const GamesPage = memo(GamesPageComponent);

export default GamesPage;
export { GamesPage };
