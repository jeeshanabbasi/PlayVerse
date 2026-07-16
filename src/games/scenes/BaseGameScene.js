export function createBaseGameScene(Phaser, key = 'BaseGameScene') {
  return class BaseGameScene extends Phaser.Scene {
    constructor() {
      super(key);
      this.playverse = {
        storage: null,
        emitter: null,
        settings: null,
      };
    }

    init(data) {
      this.playverse.storage = this.registry.get('playverse.storage');
      this.playverse.emitter = this.registry.get('playverse.emitter');
      this.playverse.settings = this.registry.get('playverse.settings');
      this.bootData = data ?? {};
    }

    get storage() {
      return this.playverse.storage;
    }

    get emitter() {
      return this.playverse.emitter;
    }

    reportScore(score) {
      const next = this.storage?.setHighScore?.(score) ?? score;
      this.emitter?.emit('engine:score', { score, highScore: next });
      return next;
    }

    unlockAchievement(id) {
      const list = this.storage?.unlockAchievement?.(id) ?? [];
      this.emitter?.emit('engine:achievement', { id, unlocked: list });
      return list;
    }

    saveProgress(progress) {
      return this.storage?.setProgress?.(progress);
    }
  };
}
