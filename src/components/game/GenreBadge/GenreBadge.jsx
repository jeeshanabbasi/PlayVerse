import { cn } from '@utils/index';

export function GenreBadge({ label, className, ...props }) {
  if (!label) return null;

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-md',
        'text-[11px] font-medium tracking-wide text-text-secondary',
        'bg-white/[0.04] border border-border',
        className,
      )}
      {...props}
    >
      {label}
    </span>
  );
}
