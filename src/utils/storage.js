function getStorage() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

export function getStoredItem(key, fallback = null) {
  try {
    return getStorage()?.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

export function getStoredJson(key, fallback) {
  const raw = getStoredItem(key);
  if (raw == null) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function setStoredItem(key, value) {
  try {
    const storage = getStorage();
    if (!storage) return false;
    storage.setItem(key, String(value));
    return true;
  } catch {
    return false;
  }
}

export function removeStoredItem(key) {
  try {
    const storage = getStorage();
    if (!storage) return false;
    storage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export function getStoredKeys(prefix = '') {
  try {
    const storage = getStorage();
    if (!storage) return [];
    const keys = [];
    for (let index = 0; index < storage.length; index += 1) {
      const key = storage.key(index);
      if (key && key.startsWith(prefix)) keys.push(key);
    }
    return keys;
  } catch {
    return [];
  }
}