export class InputManager {
  constructor(scene) {
    this.scene = scene;
    this.keys = null;
    this.lastDirection = null;

    // Swipe tracking
    this.swipeStartX = 0;
    this.swipeStartY = 0;
    this.swipeStartTime = 0;

    this.setupListeners();
  }

  setupListeners() {
    if (!this.scene.input?.keyboard) return;

    // 1. Keyboard setup
    const cursors = this.scene.input.keyboard.createCursorKeys();
    const wasd = this.scene.input.keyboard.addKeys({
      up: 'W',
      down: 'S',
      left: 'A',
      right: 'D',
      p: 'P',
    });

    this.keys = { cursors, wasd };

    // 2. Touch Swipe setup
    this.scene.input.on('pointerdown', (pointer) => {
      this.swipeStartX = pointer.x;
      this.swipeStartY = pointer.y;
      this.swipeStartTime = pointer.time;
    });

    this.scene.input.on('pointerup', (pointer) => {
      const swipeEndX = pointer.x;
      const swipeEndY = pointer.y;
      const duration = pointer.time - this.swipeStartTime;

      const distX = swipeEndX - this.swipeStartX;
      const distY = swipeEndY - this.swipeStartY;

      // Threshold: 30 pixels minimum distance, 1s maximum duration
      if (duration < 1000 && (Math.abs(distX) > 30 || Math.abs(distY) > 30)) {
        if (Math.abs(distX) > Math.abs(distY)) {
          this.lastDirection = distX > 0 ? 'RIGHT' : 'LEFT';
        } else {
          this.lastDirection = distY > 0 ? 'DOWN' : 'UP';
        }
      }
    });
  }

  update() {
    if (!this.keys) return;

    const { cursors, wasd } = this.keys;

    if (cursors.left.isDown || wasd.left.isDown) {
      this.lastDirection = 'LEFT';
    } else if (cursors.right.isDown || wasd.right.isDown) {
      this.lastDirection = 'RIGHT';
    } else if (cursors.up.isDown || wasd.up.isDown) {
      this.lastDirection = 'UP';
    } else if (cursors.down.isDown || wasd.down.isDown) {
      this.lastDirection = 'DOWN';
    }
  }

  getDirection() {
    return this.lastDirection;
  }

  setDirection(direction) {
    this.lastDirection = direction;
  }

  isPauseJustPressed() {
    if (!this.keys) return false;
    const { wasd } = this.keys;
    // Check if P key is pressed
    return this.scene.input.keyboard.checkDown(wasd.p, 10000); // Check once per press
  }

  clear() {
    this.lastDirection = null;
  }

  destroy() {
    if (this.scene.input) {
      this.scene.input.off('pointerdown');
      this.scene.input.off('pointerup');
    }
  }
}
