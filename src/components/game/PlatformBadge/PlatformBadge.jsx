import { Monitor, Globe, Smartphone } from 'lucide-react';
import { cn } from '@utils/index';

const PLATFORMS = {
  pc: { label: 'PC', Icon: Monitor },
  web: { label: 'Web', Icon: Globe },
  mobile: { label: 'Mobile', Icon: Smartphone },
};

export function PlatformBadge({
  platform = 'pc',
  showLabel = true,
  size = 'md',
  className,
  ...props
}) {
  const key = String(platform).toLowerCase();
  const config = PLATFORMS[key] ?? {
    label: platform,
    Icon: Monitor,
  };
  const { label, Icon } = config;
  const isSm = size === 'sm';

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-lg font-medium text-text-secondary',
        'bg-surface border border-border backdrop-blur-sm',
        isSm ? 'gap-1 px-1.5 py-0.5 text-[10px] bg-black/35' : 'gap-1.5 px-2 py-1 text-xs',
        className,
      )}
      title={label}
      {...props}
    >
      <Icon className={cn(isSm ? 'w-3 h-3' : 'w-3.5 h-3.5', 'text-text-muted')} aria-hidden="true" />
      {showLabel && <span>{label}</span>}
    </span>
  );
}
