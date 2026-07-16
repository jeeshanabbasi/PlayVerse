import { memo } from 'react';
import {
  ArrowLeft,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  Bug,
  Gauge,
} from 'lucide-react';
import { IconButton } from '@ui';
import { cn } from '@utils/index';

export const GameToolbar = memo(function GameToolbar({
  title,
  paused,
  muted,
  volume,
  isFullscreen,
  showFps,
  debug,
  fps,
  onExit,
  onTogglePause,
  onRestart,
  onToggleMute,
  onVolumeChange,
  onToggleFullscreen,
  onToggleFps,
  onToggleDebug,
  className,
}) {
  return (
    <header
      className={cn(
        'flex items-center justify-between gap-3 border-b border-border',
        'bg-background/80 px-3 py-2.5 backdrop-blur-xl md:px-4',
        className,
      )}
    >
      <div className="flex items-center gap-2 min-w-0">
        <IconButton
          variant="ghost"
          size="sm"
          icon={ArrowLeft}
          aria-label="Exit game"
          onClick={onExit}
        />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-text truncate">{title}</p>
          <p className="text-[11px] text-text-muted truncate">
            {paused ? 'Paused' : 'Playing'}
            {showFps ? ` · ${fps} FPS` : ''}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <IconButton
          variant="ghost"
          size="sm"
          icon={paused ? Play : Pause}
          aria-label={paused ? 'Resume' : 'Pause'}
          onClick={onTogglePause}
        />
        <IconButton
          variant="ghost"
          size="sm"
          icon={RotateCcw}
          aria-label="Restart"
          onClick={onRestart}
        />
        <IconButton
          variant="ghost"
          size="sm"
          icon={muted ? VolumeX : Volume2}
          aria-label={muted ? 'Unmute' : 'Mute'}
          onClick={onToggleMute}
        />

        <label className="hidden sm:flex items-center gap-2 px-2" aria-label="Volume">
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={muted ? 0 : volume}
            onChange={(event) => onVolumeChange?.(Number(event.target.value))}
            className="w-20 accent-primary"
          />
        </label>

        <IconButton
          variant="ghost"
          size="sm"
          icon={Gauge}
          aria-label={showFps ? 'Hide FPS' : 'Show FPS'}
          onClick={onToggleFps}
          className={showFps ? 'text-accent' : undefined}
        />
        <IconButton
          variant="ghost"
          size="sm"
          icon={Bug}
          aria-label={debug ? 'Disable debug' : 'Enable debug'}
          onClick={onToggleDebug}
          className={debug ? 'text-warning' : undefined}
        />
        <IconButton
          variant="ghost"
          size="sm"
          icon={isFullscreen ? Minimize2 : Maximize2}
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          onClick={onToggleFullscreen}
        />
      </div>
    </header>
  );
});
