function getStorage() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

export function createSafeStorage(storage = getStorage()) {
  const source = storage ?? {
    getItem: () => null,
    setItem: () => undefined,
    removeItem: () => undefined,
    clear: () => undefined,
    key: () => null,
    get length() {
      return 0;
    },
  };

  return {
    getItem(key) {
      try {
        return source.getItem(key);
      } catch {
        return null;
      }
    },
    setItem(key, value) {
      try {
        source.setItem(key, value);
        return true;
      } catch {
        return false;
      }
    },
    removeItem(key) {
      try {
        source.removeItem(key);
        return true;
      } catch {
        return false;
      }
    },
    clear() {
      try {
        source.clear();
        return true;
      } catch {
        return false;
      }
    },
    key(index) {
      try {
        return source.key(index);
      } catch {
        return null;
      }
    },
    get length() {
      try {
        return source.length ?? 0;
      } catch {
        return 0;
      }
    },
  };
}

export function installSafeStorage() {
  const safeStorage = createSafeStorage();

  try {
    const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
    const canOverride = !descriptor || descriptor.configurable !== false;

    if (canOverride) {
      Object.defineProperty(globalThis, 'localStorage', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: safeStorage,
      });
    }
  } catch {
    // Ignore browser security restrictions; the safe getter above still keeps reads non-crashing.
  }

  return globalThis.localStorage ?? safeStorage;
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