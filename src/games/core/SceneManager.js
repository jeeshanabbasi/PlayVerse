export class SceneManager {
  constructor(game) {
    this.game = game;
  }

  get keys() {
    return this.game?.scene?.keys ? Object.keys(this.game.scene.keys) : [];
  }

  get active() {
    const scenes = this.game?.scene?.getScenes?.(true) ?? [];
    return scenes[0] ?? null;
  }

  start(key, data) {
    if (!this.game?.scene) return;
    this.game.scene.start(key, data);
  }

  pause(key) {
    if (!this.game?.scene) return;
    if (key) {
      this.game.scene.pause(key);
      return;
    }
    this.game.scene.getScenes(true).forEach((scene) => {
      this.game.scene.pause(scene.scene.key);
    });
  }

  resume(key) {
    if (!this.game?.scene) return;
    if (key) {
      this.game.scene.resume(key);
      return;
    }
    this.game.scene.getScenes(false).forEach((scene) => {
      if (scene.sys?.isPaused?.()) {
        this.game.scene.resume(scene.scene.key);
      }
    });
  }

  restart(key, data) {
    if (!this.game?.scene) return;
    const target = key ?? this.active?.scene?.key;
    if (!target) return;
    this.game.scene.stop(target);
    this.game.scene.start(target, data);
  }

  stopAll() {
    if (!this.game?.scene) return;
    this.keys.forEach((key) => {
      this.game.scene.stop(key);
    });
  }
}
