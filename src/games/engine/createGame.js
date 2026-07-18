import { DEFAULT_AUDIO, DEFAULT_GAME_SIZE, DEFAULT_SETTINGS, ENGINE_EVENTS } from '../config/defaults';
import { createEmitter } from '../core/events';
import { SceneManager } from '../core/SceneManager';
import { GameLifecycle } from '../core/GameLifecycle';
import { loadPhaser } from './loadPhaser';
import { destroyGameInstance } from './destroyGame';

export async function createGameEngine({
  parent,
  definition,
  storage,
  settings = {},
  audio = {},
  onEvent,
} = {}) {
  if (!parent) {
    throw new Error('createGameEngine requires a parent element');
  }
  parent.innerHTML = '';
  if (!definition) {
    throw new Error('createGameEngine requires a game definition');
  }

  const Phaser = await loadPhaser();
  const emitter = createEmitter();
  if (typeof onEvent === 'function') {
    Object.values(ENGINE_EVENTS).forEach((event) => {
      emitter.on(event, (payload) => onEvent(event, payload));
    });
  }

  const mergedSettings = {
    ...DEFAULT_SETTINGS,
    ...(storage?.getSettings?.() ?? {}),
    ...settings,
  };

  const mergedAudio = {
    ...DEFAULT_AUDIO,
    ...audio,
  };

  const width = definition.width ?? DEFAULT_GAME_SIZE.width;
  const height = definition.height ?? DEFAULT_GAME_SIZE.height;

  const sceneClasses = typeof definition.createScenes === 'function'
    ? definition.createScenes({ Phaser, storage, emitter })
    : definition.scenes;

  if (!Array.isArray(sceneClasses) || sceneClasses.length === 0) {
    throw new Error(`Game "${definition.id}" did not provide scenes`);
  }

  const config = {
    type: Phaser.AUTO,
    parent,
    width,
    height,
    backgroundColor: definition.backgroundColor ?? '#09090B',
    antialias: true,
    banner: false,
    disableContextMenu: true,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
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
      pixelArt: Boolean(definition.pixelArt),
      antialias: !definition.pixelArt,
      roundPixels: Boolean(definition.pixelArt),
      powerPreference: 'high-performance',
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: definition.gravity ?? { y: 0 },
        debug: Boolean(mergedSettings.debug),
      },
    },
    scene: sceneClasses,
    callbacks: {
      preBoot(game) {
        game.registry.set('playverse.slug', definition.id);
        game.registry.set('playverse.storage', storage);
        game.registry.set('playverse.emitter', emitter);
        game.registry.set('playverse.settings', mergedSettings);
        game.registry.set('playverse.audio', mergedAudio);
      },
    },
  };

  const game = new Phaser.Game(config);
  const sceneManager = new SceneManager(game);
  const lifecycle = new GameLifecycle(emitter);

  lifecycle.setMute(game, mergedAudio.muted);
  lifecycle.setVolume(game, mergedAudio.volume);

  let fpsTimer = null;
  if (mergedSettings.showFps) {
    fpsTimer = window.setInterval(() => {
      if (!game?.loop) return;
      emitter.emit(ENGINE_EVENTS.FPS, {
        fps: Math.round(game.loop.actualFps || 0),
      });
    }, 500);
  }

  storage?.incrementPlayCount?.();
  emitter.emit(ENGINE_EVENTS.READY, { id: definition.id });

  return {
    game,
    Phaser,
    definition,
    sceneManager,
    lifecycle,
    emitter,
    storage,
    destroy() {
      if (fpsTimer) window.clearInterval(fpsTimer);
      emitter.emit(ENGINE_EVENTS.DESTROYED, { id: definition.id });
      emitter.clear();
      destroyGameInstance(game);
    },
  };
}
