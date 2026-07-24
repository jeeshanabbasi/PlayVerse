import { memo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { EmptyState } from '@ui';
import { Link } from 'react-router-dom';
import { useGameEngine, useGameSettings, useFullscreen } from '../hooks';
import { GameToolbar } from './GameToolbar';
import { GameCanvas } from './GameCanvas';
import { GameSidebar } from './GameSidebar';
import { TouchControls } from './TouchControls';
import { RelatedGamesBar } from './RelatedGamesBar';
import { cn } from '@utils/index';

export const GamePlayShell = memo(function GamePlayShell({
  slug,
  title,
  meta,
  className,
}) {
  const navigate = useNavigate();
  const shellRef = useRef(null);
  const { isFullscreen, toggle: toggleFullscreen } = useFullscreen(shellRef);

  const {
    storage,
    settings,
    setSettings,
    audio,
    setAudio,
    toggleMute,
  } = useGameSettings(slug);

  const engine = useGameEngine({
    slug,
    title: title ?? meta?.title,
    storage,
    settings,
    audio,
  });

  const exit = useCallback(() => {
    navigate(slug ? `/game/${slug}` : '/games');
  }, [navigate, slug]);

  if (!slug) {
    return (
      <div className="min-h-dvh flex items-center justify-center p-6">
        <EmptyState
          title="Missing game"
          description="No slug provided for the play session."
          action={
            <Link to="/games" className="btn-primary">
              Browse Games
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div
      ref={shellRef}
      className={cn(
        'min-h-dvh bg-background text-text flex flex-col',
        isFullscreen && 'fixed inset-0 z-[600]',
        className,
      )}
    >
      <GameToolbar
        title={title ?? meta?.title ?? engine.definition.title}
        paused={engine.paused}
        muted={audio.muted}
        volume={audio.volume}
        isFullscreen={isFullscreen}
        showFps={settings.showFps}
        debug={settings.debug}
        crt={settings.crt}
        fps={engine.fps}
        onExit={exit}
        onTogglePause={engine.togglePause}
        onRestart={engine.restart}
        onToggleMute={toggleMute}
        onVolumeChange={(value) => {
          if (value <= 0) {
            setAudio({ muted: true, volume: 0 });
            return;
          }
          setAudio({ muted: false, volume: value });
        }}
        onToggleFullscreen={toggleFullscreen}
        onToggleFps={() => {
          setSettings({ showFps: !settings.showFps });
          engine.hardReload();
        }}
        onToggleDebug={() => {
          setSettings({ debug: !settings.debug });
          engine.hardReload();
        }}
        onToggleCrt={() => {
          setSettings({ crt: !settings.crt });
        }}
      />

      <div className="flex-1 container-app w-full py-4 md:py-6">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="relative min-w-0 space-y-4">
            <GameCanvas
              hostRef={engine.hostRef}
              status={engine.status}
              error={engine.error}
              paused={engine.paused}
              crt={settings.crt}
            />
            <TouchControls
              visible={settings.touchControls}
              onPause={engine.togglePause}
              onAction={() => {}}
              onDirection={() => {}}
            />
          </div>

          <GameSidebar
            instructions={engine.definition.instructions}
            controls={engine.definition.controls}
            highScoreLabel={engine.highScoreLabel}
            bestScoreLabel={engine.highScoreLabel}
            playCount={engine.playCount}
            lastPlayedLabel={engine.lastPlayedLabel}
            achievements={engine.achievements}
            achievementPercent={engine.achievementPercent}
          />
        </div>

        <div className="mt-6 md:mt-8">
          <RelatedGamesBar slug={slug} />
        </div>
      </div>
    </div>
  );
});
