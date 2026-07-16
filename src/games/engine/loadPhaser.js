let phaserPromise = null;

export function loadPhaser() {
  if (!phaserPromise) {
    phaserPromise = import('phaser').then((mod) => mod.default ?? mod);
  }
  return phaserPromise;
}

export function resetPhaserLoader() {
  phaserPromise = null;
}
