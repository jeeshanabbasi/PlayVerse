import { memo } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCcw, Zap } from 'lucide-react';
import { cn, playUiTick } from '@utils/index';

function triggerKeyEvent(type, key, code, keyCode) {
  try {
    const event = new KeyboardEvent(type, {
      key,
      code,
      keyCode,
      which: keyCode,
      bubbles: true,
      cancelable: true,
    });
    window.dispatchEvent(event);
  } catch {
    // ignore
  }
}

function ControllerButton({ 
  onPress, 
  onRelease, 
  className, 
  children, 
  ariaLabel 
}) {
  const handleStart = (e) => {
    e.preventDefault();
    onPress();
  };

  const handleEnd = (e) => {
    e.preventDefault();
    onRelease();
  };

  return (
    <button
      type="button"
      onPointerDown={handleStart}
      onPointerUp={handleEnd}
      onPointerLeave={handleEnd}
      onTouchStart={handleStart}
      onTouchEnd={handleEnd}
      onMouseEnter={playUiTick}
      className={cn(
        'flex items-center justify-center select-none active:scale-95 transition-transform cursor-pointer outline-none border',
        className
      )}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}

function VirtualControllerComponent() {
  const bindKey = (key, code, keyCode) => ({
    onPress: () => triggerKeyEvent('keydown', key, code, keyCode),
    onRelease: () => triggerKeyEvent('keyup', key, code, keyCode),
  });

  return (
    <div className="absolute inset-x-0 bottom-4 z-20 pointer-events-none select-none flex items-end justify-between px-6 md:px-8">
      {/* D-Pad Left Grid (Touch Pad) */}
      <div className="pointer-events-auto flex items-center justify-center bg-surface/30 border border-border/60 backdrop-blur-md p-3.5 rounded-2xl shadow-[var(--shadow-soft)]">
        <div className="grid grid-cols-3 grid-rows-3 gap-1 w-28 h-28">
          <div />
          <ControllerButton
            {...bindKey('ArrowUp', 'ArrowUp', 38)}
            className="bg-surface border-border rounded-t-xl hover:border-primary/40 active:border-primary text-text-secondary hover:text-text shadow-sm"
            ariaLabel="D-pad Up"
          >
            <ArrowUp className="w-5 h-5" />
          </ControllerButton>
          <div />

          <ControllerButton
            {...bindKey('ArrowLeft', 'ArrowLeft', 37)}
            className="bg-surface border-border rounded-l-xl hover:border-primary/40 active:border-primary text-text-secondary hover:text-text shadow-sm"
            ariaLabel="D-pad Left"
          >
            <ArrowLeft className="w-5 h-5" />
          </ControllerButton>
          <div className="bg-surface/50 border border-border/40 rounded-lg flex items-center justify-center text-[10px] text-text-muted font-mono font-bold">
            PAD
          </div>
          <ControllerButton
            {...bindKey('ArrowRight', 'ArrowRight', 39)}
            className="bg-surface border-border rounded-r-xl hover:border-primary/40 active:border-primary text-text-secondary hover:text-text shadow-sm"
            ariaLabel="D-pad Right"
          >
            <ArrowRight className="w-5 h-5" />
          </ControllerButton>

          <div />
          <ControllerButton
            {...bindKey('ArrowDown', 'ArrowDown', 40)}
            className="bg-surface border-border rounded-b-xl hover:border-primary/40 active:border-primary text-text-secondary hover:text-text shadow-sm"
            ariaLabel="D-pad Down"
          >
            <ArrowDown className="w-5 h-5" />
          </ControllerButton>
          <div />
        </div>
      </div>

      {/* Action Buttons Right (A/B Action buttons) */}
      <div className="pointer-events-auto flex items-center gap-4 bg-surface/30 border border-border/60 backdrop-blur-md p-3.5 rounded-2xl shadow-[var(--shadow-soft)]">
        {/* Reset / Restart Key */}
        <div className="flex flex-col items-center gap-1">
          <ControllerButton
            {...bindKey('r', 'KeyR', 82)}
            className="h-11 w-11 bg-warning/10 border-warning/25 hover:border-warning/50 text-warning rounded-full shadow-[0_0_12px_rgba(245,158,11,0.1)]"
            ariaLabel="Reset game"
          >
            <RotateCcw className="w-4.5 h-4.5" />
          </ControllerButton>
          <span className="text-[9px] uppercase font-bold tracking-wider text-text-muted">Reset</span>
        </div>

        {/* Spacebar Shoot / Action Key */}
        <div className="flex flex-col items-center gap-1">
          <ControllerButton
            {...bindKey(' ', 'Space', 32)}
            className="h-14 w-14 bg-primary/20 border-primary/40 hover:border-primary text-primary rounded-full shadow-[var(--shadow-glow)]"
            ariaLabel="Action Space key"
          >
            <Zap className="w-6 h-6 fill-current" />
          </ControllerButton>
          <span className="text-[9px] uppercase font-bold tracking-wider text-text-muted">Action</span>
        </div>
      </div>
    </div>
  );
}

export const VirtualController = memo(VirtualControllerComponent);
export default VirtualController;
