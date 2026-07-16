import { DEFAULT_AUDIO, DEFAULT_GAME_SIZE, DEFAULT_SETTINGS } from './defaults';

export function createPhaserConfig({
  parent,
  width = DEFAULT_GAME_SIZE.width,
  height = DEFAULT_GAME_SIZE.height,
  scenes = [],
  backgroundColor = '#09090B',
  debug = DEFAULT_SETTINGS.debug,
} = {}) {
  return {
    type: undefined,
    parent,
    width,
    height,
    backgroundColor,
    transparent: false,
    antialias: true,
    scale: {
      mode: undefined,
      autoCenter: undefined,
      width,
      height,
    },
    audio: {
      disableWebAudio: false,
    },
    fps: {
      target: 60,
      forceSetTimeOut: false,
    },
    render: {
      pixelArt: false,
      antialias: true,
      roundPixels: false,
      powerPreference: 'high-performance',
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 },
        debug,
      },
    },
    scene: scenes,
    banner: false,
    disableContextMenu: true,
    callbacks: {
      preBoot(game) {
        game.registry.set('playverse.settings', { ...DEFAULT_SETTINGS, debug });
        game.registry.set('playverse.audio', { ...DEFAULT_AUDIO });
      },
    },
  };
}
