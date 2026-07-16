import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDebounce } from './useDebounce';
import { gamesCatalog } from '@data/games';

export const INITIAL_GAME_FILTERS = {
  genre: 'all',
  platform: 'all',
  difficulty: 'all',
  rating: 'any',
  popularity: 'any',
  status: 'any',
  sort: 'trending',
  quick: 'all',
};

function matchesSearch(game, query) {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    game.title.toLowerCase().includes(q) ||
    game.genres.some((g) => g.toLowerCase().includes(q)) ||
    game.platforms.some((p) => p.toLowerCase().includes(q))
  );
}

function matchesPopularity(game, popularity) {
  if (popularity === 'any') return true;
  if (popularity === 'hot') return game.plays >= 1_000_000;
  if (popularity === 'popular') return game.plays >= 100_000;
  if (popularity === 'rising') return game.plays < 100_000 && game.isTrending;
  return true;
}

function matchesQuick(game, quick) {
  if (quick === 'all') return true;
  if (quick === 'free') return game.price === 0;
  if (quick === 'trending') return game.isTrending;
  if (quick === 'new') return game.isNew;
  if (quick === 'multiplayer') {
    return game.genres.some((g) =>
      ['Action', 'Shooter', 'Sports', 'Fighting', 'Racing'].includes(g),
    );
  }
  if (quick === 'singleplayer') {
    return game.genres.some((g) =>
      ['Adventure', 'Puzzle', 'Horror', 'RPG', 'Simulation'].includes(g),
    );
  }
  return true;
}

function sortGames(list, sort) {
  const next = [...list];
  switch (sort) {
    case 'newest':
      return next.sort((a, b) => b.releasedAt - a.releasedAt);
    case 'most-played':
      return next.sort((a, b) => b.plays - a.plays);
    case 'highest-rated':
      return next.sort((a, b) => b.rating - a.rating || b.plays - a.plays);
    case 'alphabetical':
      return next.sort((a, b) => a.title.localeCompare(b.title));
    case 'trending':
    default:
      return next.sort(
        (a, b) =>
          Number(b.isTrending) - Number(a.isTrending) ||
          b.plays - a.plays ||
          b.rating - a.rating,
      );
  }
}

export function useGamesExplorer(source = gamesCatalog) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState(INITIAL_GAME_FILTERS);
  const [isLoading, setIsLoading] = useState(true);
  const debouncedQuery = useDebounce(query, 280);

  useEffect(() => {
    const id = setTimeout(() => setIsLoading(false), 450);
    return () => clearTimeout(id);
  }, []);

  const setFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const setQuick = useCallback((quick) => {
    setFilters((prev) => ({ ...prev, quick }));
  }, []);

  const clearFilters = useCallback(() => {
    setQuery('');
    setFilters(INITIAL_GAME_FILTERS);
  }, []);

  const results = useMemo(() => {
    const filtered = source.filter((game) => {
      if (!matchesSearch(game, debouncedQuery)) return false;
      if (filters.genre !== 'all' && !game.genres.includes(filters.genre)) return false;
      if (filters.platform !== 'all' && !game.platforms.includes(filters.platform)) return false;
      if (filters.difficulty !== 'all' && game.difficulty !== filters.difficulty) return false;
      if (filters.rating !== 'any' && game.rating < Number(filters.rating)) return false;
      if (!matchesPopularity(game, filters.popularity)) return false;
      if (filters.status !== 'any' && game.status !== filters.status) return false;
      if (!matchesQuick(game, filters.quick)) return false;
      return true;
    });

    return sortGames(filtered, filters.sort);
  }, [source, debouncedQuery, filters]);

  const hasActiveFilters = useMemo(() => {
    return (
      Boolean(query.trim()) ||
      filters.genre !== 'all' ||
      filters.platform !== 'all' ||
      filters.difficulty !== 'all' ||
      filters.rating !== 'any' ||
      filters.popularity !== 'any' ||
      filters.status !== 'any' ||
      filters.quick !== 'all' ||
      filters.sort !== 'trending'
    );
  }, [query, filters]);

  return {
    query,
    setQuery,
    filters,
    setFilter,
    setQuick,
    clearFilters,
    results,
    total: source.length,
    matching: results.length,
    isSearching: query !== debouncedQuery,
    isLoading,
    hasActiveFilters,
    debouncedQuery,
  };
}
