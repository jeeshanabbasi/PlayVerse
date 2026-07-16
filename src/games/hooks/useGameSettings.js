import { useCallback, useMemo, useState } from 'react';
import { DEFAULT_AUDIO, DEFAULT_SETTINGS } from '../config/defaults';
import { createGameStorage } from '../utils/storage';
import { isTouchDevice } from '../utils/touch';

export function useGameSettings(slug) {
  const storage = useMemo(() => (slug ? createGameStorage(slug) : null), [slug]);

  const [settings, setSettingsState] = useState(() => ({
    ...DEFAULT_SETTINGS,
    touchControls: isTouchDevice(),
    ...(storage?.getSettings?.() ?? {}),
  }));

  const [audio, setAudioState] = useState(() => ({
    ...DEFAULT_AUDIO,
    ...(storage?.getSettings?.()?.audio ?? {}),
  }));

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
