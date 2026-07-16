import { cn } from '@utils/index';

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        'rounded-lg bg-surface-elevated animate-pulse-soft',
        className,
      )}
      aria-hidden="true"
      {...props}
    />
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
    <div className={cn('card-base space-y-4', className)} aria-hidden="true">
      <Skeleton className="w-full aspect-video rounded-lg" />
      <Skeleton className="h-4 w-2/3" />
      <SkeletonText lines={2} />
    </div>
  );
}

export function SkeletonAvatar({ size = 'md', className }) {
  const sizes = { sm: 'w-8 h-8', md: 'w-10 h-10', lg: 'w-14 h-14' };
  return (
    <Skeleton className={cn('rounded-full shrink-0', sizes[size], className)} />
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
