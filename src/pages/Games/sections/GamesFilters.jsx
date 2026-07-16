import { memo } from 'react';
import { Dropdown, Button } from '@ui';
import {
  GAME_GENRES,
  GAME_PLATFORMS,
  GAME_DIFFICULTIES,
  GAME_SORT_OPTIONS,
  RATING_FILTERS,
  POPULARITY_FILTERS,
  STATUS_FILTER_OPTIONS,
} from '@data/index';

const ALL = { value: 'all', label: 'All' };

function toOptions(list, allLabel = 'All') {
  return [{ value: 'all', label: allLabel }, ...list.map((item) => ({ value: item, label: item }))];
}

const platformOptions = [
  ALL,
  ...GAME_PLATFORMS.map((p) => ({
    value: p,
    label: p === 'pc' ? 'PC' : p === 'web' ? 'Web' : 'Mobile',
  })),
];

export const GamesFilters = memo(function GamesFilters({
  filters,
  onFilterChange,
  onClear,
  hasActiveFilters,
}) {
  return (
    <div className="space-y-3" role="region" aria-label="Game filters">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
        <Dropdown
          label="Genre"
          value={filters.genre}
          onChange={(value) => onFilterChange('genre', value)}
          options={toOptions(GAME_GENRES, 'All genres')}
        />
        <Dropdown
          label="Platform"
          value={filters.platform}
          onChange={(value) => onFilterChange('platform', value)}
          options={platformOptions}
        />
        <Dropdown
          label="Difficulty"
          value={filters.difficulty}
          onChange={(value) => onFilterChange('difficulty', value)}
          options={toOptions(GAME_DIFFICULTIES, 'All difficulties')}
        />
        <Dropdown
          label="Rating"
          value={filters.rating}
          onChange={(value) => onFilterChange('rating', value)}
          options={RATING_FILTERS}
        />
        <Dropdown
          label="Popularity"
          value={filters.popularity}
          onChange={(value) => onFilterChange('popularity', value)}
          options={POPULARITY_FILTERS}
        />
        <Dropdown
          label="Release Status"
          value={filters.status}
          onChange={(value) => onFilterChange('status', value)}
          options={STATUS_FILTER_OPTIONS}
        />
        <Dropdown
          label="Sort"
          value={filters.sort}
          onChange={(value) => onFilterChange('sort', value)}
          options={GAME_SORT_OPTIONS}
        />
      </div>

      {hasActiveFilters && (
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={onClear}>
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
});
