import { STORAGE_PREFIX } from '../config/defaults';

function key(slug, suffix) {
  return `${STORAGE_PREFIX}.${slug}.${suffix}`;
}

function readJson(storageKey, fallback) {
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw == null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeJson(storageKey, value) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(value));
  } catch {
    // Storage quota / private mode — fail silently
  }
}

export function createGameStorage(slug) {
  if (!slug) {
    throw new Error('createGameStorage requires a game slug');
  }

  return {
    getHighScore() {
      return Number(readJson(key(slug, 'highScore'), 0)) || 0;
    },

    setHighScore(score) {
      const next = Math.max(0, Number(score) || 0);
      const current = this.getHighScore();
      if (next > current) {
        writeJson(key(slug, 'highScore'), next);
        return next;
      }
      return current;
    },

    getBestScore() {
      return this.getHighScore();
    },

    getPlayCount() {
      return Number(readJson(key(slug, 'playCount'), 0)) || 0;
    },

    incrementPlayCount() {
      const next = this.getPlayCount() + 1;
      writeJson(key(slug, 'playCount'), next);
      writeJson(key(slug, 'lastPlayed'), Date.now());
      return next;
    },

    getLastPlayed() {
      const value = readJson(key(slug, 'lastPlayed'), null);
      return value == null ? null : Number(value);
    },

    getAchievements() {
      return readJson(key(slug, 'achievements'), []);
    },

    unlockAchievement(achievementId) {
      if (!achievementId) return this.getAchievements();
      const current = this.getAchievements();
      if (current.includes(achievementId)) return current;
      const next = [...current, achievementId];
      writeJson(key(slug, 'achievements'), next);
      return next;
    },

    getProgress() {
      return readJson(key(slug, 'progress'), null);
    },

    setProgress(progress) {
      writeJson(key(slug, 'progress'), progress ?? null);
      return progress;
    },

    getSettings() {
      return readJson(key(slug, 'settings'), null);
    },

    setSettings(settings) {
      writeJson(key(slug, 'settings'), settings ?? {});
      return settings;
    },

    clear() {
      [
        'highScore',
        'playCount',
        'lastPlayed',
        'achievements',
        'progress',
        'settings',
      ].forEach((suffix) => localStorage.removeItem(key(slug, suffix)));
    },
  };
}
