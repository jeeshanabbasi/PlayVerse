import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ENGINE_EVENTS } from '../config/defaults';
import { createGameEngine } from '../engine/createGame';
import { resolvePlayableDefinition } from '../registry';
import { formatLastPlayed, formatScore } from '../utils/scores';
import { achievementProgress, mergeAchievements } from '../utils/achievements';

export function useGameEngine({
  slug,
  title,
  enabled = true,
  settings,
  audio,
  storage,
}) {
  const hostRef = useRef(null);
  const engineRef = useRef(null);
  const settingsRef = useRef(settings);
  const audioRef = useRef(audio);

  settingsRef.current = settings;
  audioRef.current = audio;

  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [paused, setPaused] = useState(false);
  const [fps, setFps] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [playCount, setPlayCount] = useState(0);
  const [lastPlayed, setLastPlayed] = useState(null);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [bootKey, setBootKey] = useState(0);

  const definition = useMemo(() => resolvePlayableDefinition(slug), [slug]);

  const refreshStats = useCallback(() => {
    if (!storage) return;
    setHighScore(storage.getHighScore());
    setPlayCount(storage.getPlayCount());
    setLastPlayed(storage.getLastPlayed());
    setUnlockedAchievements(storage.getAchievements());
  }, [storage]);

  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  useEffect(() => {
    if (!enabled || !slug) return undefined;

    let cancelled = false;
    let engine = null;
    let retryId = null;

    async function boot() {
      if (!hostRef.current) {
        retryId = window.setTimeout(boot, 50);
        return;
      }

      setStatus('loading');
      setError(null);
      setPaused(false);

      try {
        engine = await createGameEngine({
          parent: hostRef.current,
          definition: {
            ...definition,
            title: title ?? definition.title,
          },
          storage,
          settings: settingsRef.current,
          audio: audioRef.current,
          onEvent(event, payload) {
            if (event === ENGINE_EVENTS.SCORE) {
              setHighScore(payload?.highScore ?? storage?.getHighScore?.() ?? 0);
            }
            if (event === ENGINE_EVENTS.ACHIEVEMENT) {
              setUnlockedAchievements(payload?.unlocked ?? storage?.getAchievements?.() ?? []);
            }
            if (event === ENGINE_EVENTS.FPS) {
              setFps(payload?.fps ?? 0);
            }
            if (event === ENGINE_EVENTS.PAUSE) setPaused(true);
            if (event === ENGINE_EVENTS.RESUME) setPaused(false);
          },
        });

        if (cancelled) {
          engine.destroy();
          return;
        }

        engineRef.current = engine;
        setStatus('ready');
        refreshStats();
      } catch (err) {
        if (!cancelled) {
          setStatus('error');
          setError(err instanceof Error ? err.message : 'Failed to start engine');
        }
      }
    }

    boot();

    return () => {
      cancelled = true;
      if (retryId) window.clearTimeout(retryId);
      engine?.destroy?.();
      engineRef.current?.destroy?.();
      engineRef.current = null;
      setStatus('idle');
    };
  }, [enabled, slug, definition, title, storage, refreshStats, bootKey]);

  useEffect(() => {
    const engine = engineRef.current;
    if (!engine || status !== 'ready') return;
    engine.lifecycle.setMute(engine.game, audio.muted);
    engine.lifecycle.setVolume(engine.game, audio.volume);
  }, [audio.muted, audio.volume, status]);

  const pause = useCallback(() => {
    const engine = engineRef.current;
    if (!engine) return;
    engine.lifecycle.pause(engine.game, engine.sceneManager);
    setPaused(true);
  }, []);

  const resume = useCallback(() => {
    const engine = engineRef.current;
    if (!engine) return;
    engine.lifecycle.resume(engine.game, engine.sceneManager);
    setPaused(false);
  }, []);

  const togglePause = useCallback(() => {
    if (paused) resume();
    else pause();
  }, [pause, paused, resume]);

  const restart = useCallback(() => {
    const engine = engineRef.current;
    if (!engine) {
      setBootKey((k) => k + 1);
      return;
    }
    engine.lifecycle.restart(engine.game, engine.sceneManager);
    setPaused(false);
  }, []);

  const hardReload = useCallback(() => {
    engineRef.current?.destroy?.();
    engineRef.current = null;
    setBootKey((k) => k + 1);
  }, []);

  const achievementItems = useMemo(
    () => mergeAchievements(definition.achievements, unlockedAchievements),
    [definition.achievements, unlockedAchievements],
  );

  return {
    hostRef,
    definition,
    status,
    error,
    paused,
    fps,
    highScore,
    playCount,
    lastPlayed,
    lastPlayedLabel: formatLastPlayed(lastPlayed),
    highScoreLabel: formatScore(highScore),
    achievements: achievementItems,
    achievementPercent: achievementProgress(definition.achievements, unlockedAchievements),
    pause,
    resume,
    togglePause,
    restart,
    hardReload,
  };
}
