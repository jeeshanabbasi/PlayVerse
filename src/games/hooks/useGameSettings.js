import { useCallback, useMemo, useState } from 'react';
import { DEFAULT_AUDIO, DEFAULT_SETTINGS } from '../config/defaults';
import { createGameStorage } from '../utils/storage';
import { isTouchDevice } from '../utils/touch';

function asRecord(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

function readAudioSettings(value) {
  const saved = asRecord(value);
  const volume = Number(saved.volume);
  return {
    ...DEFAULT_AUDIO,
    muted: typeof saved.muted === 'boolean' ? saved.muted : DEFAULT_AUDIO.muted,
    volume: Number.isFinite(volume) ? Math.min(1, Math.max(0, volume)) : DEFAULT_AUDIO.volume,
  };
}

export function useGameSettings(slug) {
  const storage = useMemo(() => (slug ? createGameStorage(slug) : null), [slug]);

  const [settings, setSettingsState] = useState(() => {
    const savedSettings = asRecord(storage?.getSettings?.());
    return {
      ...DEFAULT_SETTINGS,
      touchControls: isTouchDevice(),
      ...savedSettings,
    };
  });

  const [audio, setAudioState] = useState(() =>
    readAudioSettings(asRecord(storage?.getSettings?.()).audio),
  );

  const persist = useCallback(
    (nextSettings, nextAudio) => {
      storage?.setSettings?.({
        ...nextSettings,
        audio: nextAudio,
      });
    },
    [storage],
  );

  const setSettings = useCallback(
    (patch) => {
      setSettingsState((prev) => {
        const next = { ...prev, ...patch };
        persist(next, audio);
        return next;
      });
    },
    [audio, persist],
  );

  const setAudio = useCallback(
    (patch) => {
      setAudioState((prev) => {
        const next = { ...prev, ...patch };
        persist(settings, next);
        return next;
      });
    },
    [persist, settings],
  );

  const toggleMute = useCallback(() => {
    setAudio({ muted: !audio.muted });
  }, [audio.muted, setAudio]);

  const setVolume = useCallback(
    (volume) => {
      setAudio({ volume: Math.min(1, Math.max(0, Number(volume) || 0)) });
    },
    [setAudio],
  );

  return {
    storage,
    settings,
    setSettings,
    audio,
    setAudio,
    toggleMute,
    setVolume,
  };
}
