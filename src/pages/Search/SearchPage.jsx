import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '@components/layout';
import { GameCard } from '@game';
import { SearchInput, EmptyState } from '@ui';
import { pageFade, staggerContainer, staggerItem } from '@utils/index';
import { useGamesExplorer } from '@hooks/index';
import { GAME_GENRES, GAME_DIFFICULTIES } from '@data/games';
import { Gamepad2 } from 'lucide-react';

function SearchPageComponent() {
  const { query, setQuery, filters, setFilter, results, total } = useGamesExplorer();

  return (
    <motion.div
      initial={pageFade.initial}
      animate={pageFade.animate}
      exit={pageFade.exit}
      transition={pageFade.transition}
      className="pb-20 pt-10 md:pt-16 relative"
    >
      {/* Background neon glow */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{
          background: 'radial-gradient(circle 500px at 50% -120px, rgba(124, 58, 237, 0.09), transparent 70%)'
        }}
        aria-hidden="true" 
      />

      <Container className="space-y-12 relative z-10">
        {/* Header Block */}
        <div className="space-y-6 max-w-2xl mx-auto text-center">
          <div className="space-y-3">
            <p className="text-label text-primary">Explore Platform</p>
            <h1 className="text-display-lg font-bold tracking-tight text-text">
              Search <span className="gradient-text">Games Collection</span>
            </h1>
            <p className="text-body-md text-text-secondary max-w-md mx-auto">
              Type to live-filter the catalog. Click any game to start playing instantly.
            </p>
          </div>

          {/* Premium Spotlight-style Search Input */}
          <div className="relative group max-w-xl mx-auto">
            <div 
              className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 opacity-70 blur-md transition-opacity duration-300 group-focus-within:opacity-100" 
              aria-hidden="true" 
            />
            <SearchInput
              size="lg"
              label="Search game database"
              placeholder="Search Snake, Tic Tac Toe, Tetris..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onClear={() => setQuery('')}
              className="relative"
              inputClassName="bg-surface/90 border-border/80 py-4 px-6 text-base md:text-lg rounded-2xl shadow-[var(--shadow-soft)] focus:border-primary/40 focus:ring-4 focus:ring-primary/10 transition-all duration-200"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 text-left sm:grid-cols-3">
            <label className="space-y-1 text-xs font-semibold text-text-secondary">
              Genre
              <select value={filters.genre} onChange={(event) => setFilter('genre', event.target.value)} className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-text outline-none focus:border-primary/50">
                {GAME_GENRES.map((genre) => <option key={genre} value={genre.toLowerCase() === 'all' ? 'all' : genre.toLowerCase()}>{genre}</option>)}
              </select>
            </label>
            <label className="space-y-1 text-xs font-semibold text-text-secondary">
              Difficulty
              <select value={filters.difficulty} onChange={(event) => setFilter('difficulty', event.target.value)} className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-text outline-none focus:border-primary/50">
                <option value="all">All levels</option>
                {GAME_DIFFICULTIES.map((difficulty) => <option key={difficulty} value={difficulty}>{difficulty}</option>)}
              </select>
            </label>
            <label className="space-y-1 text-xs font-semibold text-text-secondary">
              Sort by
              <select value={filters.sort} onChange={(event) => setFilter('sort', event.target.value)} className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-text outline-none focus:border-primary/50">
                <option value="trending">Trending</option>
                <option value="most-played">Most played</option>
                <option value="highest-rated">Highest rated</option>
                <option value="alphabetical">A-Z</option>
              </select>
            </label>
          </div>
        </div>

        {/* Results / Catalog Grid */}
        <div className="pt-4 border-t border-border/40">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
              {query.trim() ? `Search Results (${results.length})` : 'All Classic Games'}
            </h2>
          </div>

          <AnimatePresence mode="wait">
            {results.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <EmptyState
                  icon={Gamepad2}
                  title="No games found"
                  description={`We couldn't find any games matching "${query}". Try searching for another keyword.`}
                />
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8"
              >
                {results.map((game) => (
                  <motion.div key={game.id} variants={staggerItem}>
                    <GameCard
                      id={game.id}
                      title={game.title}
                      image={game.image}
                      genres={game.genres}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Container>
    </motion.div>
  );
}

export const SearchPage = memo(SearchPageComponent);
export default SearchPage;
