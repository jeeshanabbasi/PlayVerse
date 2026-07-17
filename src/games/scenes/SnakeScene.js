import { createBaseGameScene } from './BaseGameScene';
import { GameOrchestrator } from './systems/GameOrchestrator';

export function createSnakeScene(Phaser) {
  const BaseScene = createBaseGameScene(Phaser, 'SnakeScene');

  return class SnakeScene extends BaseScene {
    constructor() {
      super();
      this.orchestrator = null;
    }

    init(data) {
      super.init(data);
      this.orchestrator = new GameOrchestrator(this);
      this.orchestrator.init(data);
    }

    create() {
      // Set backdrop color
      this.cameras.main.setBackgroundColor('#09090B');

      // Initialize orchestrator systems
      this.orchestrator.create();

      // Listen to Phaser scene lifecycle event for cleanup to prevent memory leaks
      this.events.once('shutdown', () => this.handleCleanup());
      this.events.once('destroy', () => this.handleCleanup());
    }

    update(time, delta) {
      if (this.orchestrator) {
        this.orchestrator.update(time, delta);
      }
    }

    handleCleanup() {
      if (this.orchestrator) {
        this.orchestrator.destroy();
        this.orchestrator = null;
      }
    }
  };
}
