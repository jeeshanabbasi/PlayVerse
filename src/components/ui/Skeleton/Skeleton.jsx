import { cn } from '@utils/index';

export function Skeleton({ className, rounded = 'lg', ...props }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden bg-surface-elevated animate-pulse-soft',
        rounded === 'full' ? 'rounded-full' : rounded === 'xl' ? 'rounded-xl' : 'rounded-lg',
        className,
      )}
      aria-hidden="true"
      {...props}
    >
      <div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
        style={{
          backgroundSize: '200% 100%',
          animation: 'shimmer 2s infinite linear',
        }}
      />
    </div>
  );
}

export function SkeletonText({ lines = 3, className }) {
  return (
    <div className={cn('space-y-2', className)} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn('h-3', i === lines - 1 ? 'w-3/5' : 'w-full')}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className }) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-surface p-4 space-y-4 shadow-[var(--shadow-soft)]',
        className,
      )}
      aria-hidden="true"
    >
      <Skeleton className="w-full aspect-video" rounded="xl" />
      <Skeleton className="h-4 w-2/3" />
      <SkeletonText lines={2} />
    </div>
  );
}

export function SkeletonAvatar({ size = 'md', className }) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-16 h-16',
  };

  return (
    <Skeleton
      rounded="full"
      className={cn('shrink-0', sizes[size] ?? sizes.md, className)}
    />
  );
}

export function SkeletonGrid({ count = 6, className }) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4',
        className,
      )}
      aria-label="Loading content"
      role="status"
    >
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
