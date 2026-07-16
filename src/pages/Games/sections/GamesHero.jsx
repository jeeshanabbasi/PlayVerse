import { memo } from 'react';
import { motion } from 'framer-motion';
import { Gamepad2 } from 'lucide-react';
import { PageHeader } from '@components/layout';
import { SearchInput, Chip } from '@ui';
import { QUICK_FILTERS } from '@data/index';
import { cn } from '@utils/index';

export const GamesHero = memo(function GamesHero({
  query,
  onQueryChange,
  onClear,
  quick,
  onQuickChange,
  matching,
  total,
}) {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Explore Games"
        subtitle="Discover browser games across every genre."
        className="border-none pb-0"
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-4"
      >
        <div className="relative">
          <div
            className="pointer-events-none absolute -inset-1 rounded-xl bg-gradient-to-r from-primary/25 via-accent/10 to-transparent opacity-70 blur-lg"
            aria-hidden="true"
          />
          <SearchInput
            size="lg"
            label="Search games"
            placeholder="Search by name, genre, or platform…"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            onClear={onClear}
            className="relative"
            inputClassName="bg-surface/90 border-border-hover shadow-[var(--shadow-soft)] focus:border-primary focus:shadow-[var(--shadow-glow-primary)]"
          />
        </div>

        <div
          className="flex gap-2 overflow-x-auto pb-1 scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="group"
          aria-label="Quick filters"
        >
          {QUICK_FILTERS.map((item) => {
            const active = quick === item.id;
            return (
              <Chip
                key={item.id}
                selected={active}
                onSelect={() => onQuickChange(item.id)}
                className={cn(
                  'shrink-0',
                  active && 'border-primary/40 bg-primary/15 text-primary',
                )}
              >
                {item.label}
              </Chip>
            );
          })}
        </div>

        <p className="flex items-center gap-2 text-body-sm">
          <Gamepad2 className="h-3.5 w-3.5 text-text-muted" aria-hidden="true" />
          <span>
            Showing <strong className="text-text font-semibold">{matching}</strong> of{' '}
            <strong className="text-text font-semibold">{total}</strong> games
          </span>
        </p>
      </motion.div>
    </div>
  );
});
