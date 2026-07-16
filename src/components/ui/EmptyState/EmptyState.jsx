import { Inbox } from 'lucide-react';
import { cn } from '@utils/index';

export function EmptyState({
  icon: Icon = Inbox,
  title = 'Nothing here yet',
  description = 'Content will appear here once available.',
  action,
  className,
  ...props
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center gap-5 py-16 px-6',
        'rounded-xl border border-border bg-surface/50 backdrop-blur-sm',
        className,
      )}
      role="status"
      {...props}
    >
      <div
        className={cn(
          'flex items-center justify-center w-16 h-16 rounded-xl',
          'bg-primary/10 border border-primary/20',
          'shadow-[var(--shadow-glow)]',
        )}
      >
        <Icon className="w-7 h-7 text-primary" aria-hidden="true" />
      </div>

      <div className="max-w-sm space-y-2">
        <h2 className="text-heading-sm text-text">{title}</h2>
        <p className="text-body-md">{description}</p>
      </div>

      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
