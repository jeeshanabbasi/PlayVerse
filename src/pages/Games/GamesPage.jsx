import { memo } from 'react';
import { motion } from 'framer-motion';
import { Container } from '@components/layout';
import { pageFade } from '@utils/index';
import { useGamesExplorer } from '@hooks/index';
import { GamesHero, GamesFilters, GamesGrid, DailyArcadePick } from './sections';

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

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <GamesFilters
              genre={filters.genre}
              onGenreChange={(val) => setFilter('genre', val)}
            />
          </div>
          <label className="flex shrink-0 items-center gap-2 text-sm text-text-secondary">
            Sort
            <select
              value={filters.sort}
              onChange={(event) => setFilter('sort', event.target.value)}
              className="rounded-xl border border-border bg-surface px-3 py-2 text-sm text-text outline-none focus:border-primary/50"
            >
              <option value="trending">Trending</option>
              <option value="recently-played">Recently played</option>
              <option value="personal-best">Personal Best</option>
              <option value="most-played">Most played</option>
              <option value="highest-rated">Highest rated</option>
              <option value="alphabetical">A-Z</option>
            </select>
          </label>
        </div>

        <DailyArcadePick />

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
