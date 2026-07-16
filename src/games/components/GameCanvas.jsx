import { memo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { cn } from '@utils/index';
import { GameLoadingScreen } from './GameLoadingScreen';

export const GameCanvas = memo(function GameCanvas({
  hostRef,
  status,
  error,
  paused,
  className,
}) {
  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-xl border border-border bg-black',
        'shadow-[var(--shadow-lift)] aspect-video',
        className,
      )}
    >
      <div
        ref={hostRef}
        className="absolute inset-0 [&_canvas]:h-full [&_canvas]:w-full [&_canvas]:object-contain"
        data-playverse-canvas
      />

      <AnimatePresence>
        {status === 'loading' && (
          <GameLoadingScreen title="Starting session" progress={42} />
        )}
      </AnimatePresence>

      {status === 'error' && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/90 p-6 text-center">
          <div className="space-y-2 max-w-sm">
            <p className="text-heading-sm text-error">Engine failed to start</p>
            <p className="text-body-sm">{error || 'Unknown error'}</p>
          </div>
        </div>
      )}

      {paused && status === 'ready' && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-black/45 backdrop-blur-[2px]">
          <p className="rounded-xl border border-white/10 bg-black/50 px-4 py-2 text-sm font-semibold text-white">
            Paused
          </p>
        </div>
      )}
    </div>
  );
});
