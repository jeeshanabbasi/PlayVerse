import { STORAGE_PREFIX } from '../config/defaults';
import { getStoredJson, removeStoredItem, setStoredItem } from '@utils/storage';

function key(slug, suffix) {
  return `${STORAGE_PREFIX}.${slug}.${suffix}`;
}

function readJson(storageKey, fallback) {
  return getStoredJson(storageKey, fallback);
}

function writeJson(storageKey, value) {
  if (setStoredItem(storageKey, JSON.stringify(value))) {
    window.dispatchEvent(new Event('playverse_stats_updated'));
  }
}

function finiteNonNegative(value) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, number) : 0;
}

export function createGameStorage(slug) {
  if (!slug) {
    throw new Error('createGameStorage requires a game slug');
  }

  return {
    getHighScore() {
      return finiteNonNegative(readJson(key(slug, 'highScore'), 0));
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
      return finiteNonNegative(readJson(key(slug, 'playCount'), 0));
    },

    incrementPlayCount() {
      const next = this.getPlayCount() + 1;
      writeJson(key(slug, 'playCount'), next);
      writeJson(key(slug, 'lastPlayed'), Date.now());
      return next;
    },

    getLastPlayed() {
      const value = readJson(key(slug, 'lastPlayed'), null);
      return value == null ? null : finiteNonNegative(value);
    },

    getAchievements() {
      const achievements = readJson(key(slug, 'achievements'), []);
      return Array.isArray(achievements)
        ? achievements.filter((achievementId) => typeof achievementId === 'string')
        : [];
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
      ].forEach((suffix) => removeStoredItem(key(slug, suffix)));
    },
  };
}
