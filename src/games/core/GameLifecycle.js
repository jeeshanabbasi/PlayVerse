import { ENGINE_EVENTS } from '../config/defaults';

export class GameLifecycle {
  constructor(emitter) {
    this.emitter = emitter;
    this.paused = false;
  }

  pause(game, sceneManager) {
    if (!game || this.paused) return;
    this.paused = true;
    game.loop?.sleep?.();
    sceneManager?.pause();
    this.emitter?.emit(ENGINE_EVENTS.PAUSE);
  }

  resume(game, sceneManager) {
    if (!game || !this.paused) return;
    this.paused = false;
    game.loop?.wake?.();
    sceneManager?.resume();
    this.emitter?.emit(ENGINE_EVENTS.RESUME);
  }

  restart(game, sceneManager, key, data) {
    this.paused = false;
    game.loop?.wake?.();
    sceneManager?.restart(key, data);
    this.emitter?.emit(ENGINE_EVENTS.RESTART);
  }

  setMute(game, muted) {
    if (!game?.sound) return;
    game.sound.mute = Boolean(muted);
  }

  setVolume(game, volume) {
    if (!game?.sound) return;
    const next = Math.min(1, Math.max(0, Number(volume) || 0));
    game.sound.volume = next;
  }
}
