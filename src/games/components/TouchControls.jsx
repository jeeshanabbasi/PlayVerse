import { memo } from 'react';
import { Pause, Zap } from 'lucide-react';
import { cn } from '@utils/index';

export const TouchControls = memo(function TouchControls({
  visible = true,
  onDirection,
  onAction,
  onPause,
  className,
}) {
  if (!visible) return null;

  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-x-0 bottom-3 z-30 flex items-end justify-between px-3 md:hidden',
        className,
      )}
      aria-label="Touch controls"
    >
      <div className="pointer-events-auto grid grid-cols-3 gap-1.5">
        <span />
        <Pad label="Up" onPress={() => onDirection?.('up')} />
        <span />
        <Pad label="Left" onPress={() => onDirection?.('left')} />
        <Pad label="Down" onPress={() => onDirection?.('down')} />
        <Pad label="Right" onPress={() => onDirection?.('right')} />
      </div>

      <div className="pointer-events-auto flex items-center gap-2">
        <Pad label="Pause" icon={Pause} onPress={onPause} />
        <Pad label="Action" icon={Zap} large onPress={onAction} />
      </div>
    </div>
  );
});

function Pad({ label, onPress, icon: Icon, large = false }) {
  return (
    <button
      type="button"
      aria-label={label}
      onPointerDown={(event) => {
        event.preventDefault();
        onPress?.();
      }}
      className={cn(
        'inline-flex items-center justify-center rounded-xl border border-white/15',
        'bg-black/50 text-white backdrop-blur-md active:scale-95 transition-transform',
        large ? 'h-14 w-14' : 'h-11 w-11',
      )}
    >
      {Icon ? <Icon className="h-4 w-4" aria-hidden="true" /> : (
        <span className="text-[10px] font-semibold uppercase">{label[0]}</span>
      )}
    </button>
  );
}
