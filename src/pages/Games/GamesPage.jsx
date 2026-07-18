import { memo } from 'react';
import { motion } from 'framer-motion';
import { Container } from '@components/layout';
import { pageFade } from '@utils/index';
import { useGamesExplorer } from '@hooks/index';
import { GamesHero, GamesFilters, GamesGrid } from './sections';

function GamesPageComponent() {
  const {
    query,
    setQuery,
    filters,
    setFilter,
    results,
    total,
    matching,
    isLoading,
    hasActiveFilters,
    clearFilters,
  } = useGamesExplorer();

  return (
    <motion.div
      initial={pageFade.initial}
      animate={pageFade.animate}
      exit={pageFade.exit}
      transition={pageFade.transition}
      className="pb-16"
    >
      <Container className="pt-8 md:pt-12 space-y-8 md:space-y-12">
        {/* GamesHero handles only page title & search input */}
        <GamesHero
          query={query}
          onQueryChange={setQuery}
          onClear={() => setQuery('')}
          matching={matching}
          total={total}
        />

        {/* GamesFilters handles only genre chips */}
        <GamesFilters
          genre={filters.genre}
          onGenreChange={(val) => setFilter('genre', val)}
        />

        {/* GamesGrid handles the simplified 12 classics grid */}
        <div className="pt-2 md:pt-4">
          <GamesGrid
            games={results}
            isLoading={isLoading}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearFilters}
          />
        </div>
      </Container>
    </motion.div>
  );
}

export const GamesPage = memo(GamesPageComponent);
export default GamesPage;
