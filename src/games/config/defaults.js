export const ENGINE_EVENTS = Object.freeze({
  READY: 'engine:ready',
  DESTROYED: 'engine:destroyed',
  PAUSE: 'engine:pause',
  RESUME: 'engine:resume',
  RESTART: 'engine:restart',
  SCORE: 'engine:score',
  ACHIEVEMENT: 'engine:achievement',
  SCENE_CHANGE: 'engine:scene',
  ERROR: 'engine:error',
  FPS: 'engine:fps',
});

export const STORAGE_PREFIX = 'playverse.game';

export const DEFAULT_GAME_SIZE = Object.freeze({
  width: 960,
  height: 540,
});

export const DEFAULT_AUDIO = Object.freeze({
  muted: false,
  volume: 0.8,
});

export const DEFAULT_SETTINGS = Object.freeze({
  showFps: false,
  debug: false,
  touchControls: true,
  crt: false,
});
