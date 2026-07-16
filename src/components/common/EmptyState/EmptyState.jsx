import { Inbox } from 'lucide-react';
import { cn } from '@utils/index';

export function EmptyState({
  icon: Icon = Inbox,
  title = 'Nothing here yet',
  description = 'Content will appear here once available.',
  action,
  className,
}) {
  return (
    <div
      className={cn('flex flex-col items-center text-center gap-4 py-16 px-4', className)}
      role="status"
    >
      <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-surface border border-border">
        <Icon className="w-7 h-7 text-text-muted" aria-hidden="true" />
      </div>

      <div className="max-w-sm space-y-2">
        <h2 className="text-heading-sm text-text">{title}</h2>
        <p className="text-body-md">{description}</p>
      </div>

      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
