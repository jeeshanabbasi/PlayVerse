export class SnakeEntityManager {
  constructor(scene, cellWidth, cellHeight, startX, startY) {
    this.scene = scene;
    this.cellWidth = cellWidth;
    this.cellHeight = cellHeight;
    this.startX = startX;
    this.startY = startY;

    this.segments = []; // Array of { x, y, sprite }
    this.direction = 'RIGHT';
    this.nextDirection = 'RIGHT';
    this.growAmount = 0;
  }

  /**
   * Initialize the snake with 3 segments at the center.
   */
  reset(gridWidth, gridHeight) {
    // Clear old segment sprites
    this.segments.forEach((seg) => {
      if (seg.sprite) seg.sprite.destroy();
    });
    this.segments = [];

    this.direction = 'RIGHT';
    this.nextDirection = 'RIGHT';
    this.growAmount = 0;

    // Start at middle-left crawling right
    const startGridX = Math.floor(gridWidth * 0.25);
    const startGridY = Math.floor(gridHeight / 2);

    for (let i = 0; i < 3; i++) {
      const gx = startGridX - i;
      const gy = startGridY;
      const px = this.startX + gx * this.cellWidth + this.cellWidth / 2;
      const py = this.startY + gy * this.cellHeight + this.cellHeight / 2;

      // Create a Phaser Graphics object for drawing
      const graphics = this.scene.add.graphics({ x: px, y: py });
      this.segments.push({
        x: gx,
        y: gy,
        sprite: graphics,
      });
    }

    this.redrawAll();
  }

  /**
   * Set direction, rejecting opposite direction turns.
   */
  setDirection(newDir) {
    const opp = {
      UP: 'DOWN',
      DOWN: 'UP',
      LEFT: 'RIGHT',
      RIGHT: 'LEFT',
    };
    if (opp[newDir] !== this.direction) {
      this.nextDirection = newDir;
    }
  }

  /**
   * Perform one step movement on the grid.
   * Returns true if successful, false if collided with self.
   */
  move(gridWidth, gridHeight, stepTime) {
    // Commit the queued direction
    this.direction = this.nextDirection;

    const head = this.segments[0];
    let nextX = head.x;
    let nextY = head.y;

    if (this.direction === 'UP') nextY -= 1;
    else if (this.direction === 'DOWN') nextY += 1;
    else if (this.direction === 'LEFT') nextX -= 1;
    else if (this.direction === 'RIGHT') nextX += 1;

    // Check self-collision
    const selfCollided = this.segments.some((seg) => seg.x === nextX && seg.y === nextY);
    if (selfCollided) {
      return false;
    }

    // Shift segments
    const newHead = { x: nextX, y: nextY, sprite: null };
    this.segments.unshift(newHead);

    let tailObj = null;
    if (this.growAmount > 0) {
      this.growAmount -= 1;
    } else {
      tailObj = this.segments.pop();
    }

    // Reuse tail sprite for the new head (Object pooling)
    if (tailObj && tailObj.sprite) {
      newHead.sprite = tailObj.sprite;
      // Position it where the head currently is so it slides forward
      const oldHeadPx = this.startX + head.x * this.cellWidth + this.cellWidth / 2;
      const oldHeadPy = this.startY + head.y * this.cellHeight + this.cellHeight / 2;
      newHead.sprite.setPosition(oldHeadPx, oldHeadPy);
    } else {
      // Allocate new sprite
      const px = this.startX + nextX * this.cellWidth + this.cellWidth / 2;
      const py = this.startY + nextY * this.cellHeight + this.cellHeight / 2;
      newHead.sprite = this.scene.add.graphics({ x: px, y: py });
    }

    // Redraw all segment shapes
    this.redrawAll();

    // Trigger smooth interpolation tween on each segment
    this.segments.forEach((seg) => {
      const tx = this.startX + seg.x * this.cellWidth + this.cellWidth / 2;
      const ty = this.startY + seg.y * this.cellHeight + this.cellHeight / 2;

      this.scene.tweens.add({
        targets: seg.sprite,
        x: tx,
        y: ty,
        duration: stepTime,
        ease: 'Linear',
      });
    });

    return true;
  }

  grow(amount = 1) {
    this.growAmount += amount;
  }

  /**
   * Returns list of all active grid coordinates occupied by the snake.
   */
  getCoordinates() {
    return this.segments.map((seg) => ({ x: seg.x, y: seg.y }));
  }

  getHead() {
    return this.segments[0];
  }

  /**
   * Gray out the snake on death.
   */
  deathAnimation() {
    this.segments.forEach((seg, index) => {
      if (!seg.sprite) return;
      seg.sprite.clear();
      const radius = (index === 0 ? 11 : 9.5) * (1 - (index / this.segments.length) * 0.3);

      // Draw dark gray segments
      seg.sprite.fillStyle(0x4b5563, 1);
      seg.sprite.fillCircle(0, 0, radius);

      if (index === 0) {
        // Dead eyes (crosses or simple markers)
        seg.sprite.fillStyle(0x9ca3af, 1);
        seg.sprite.fillCircle(-3, -3, 1.5);
        seg.sprite.fillCircle(3, -3, 1.5);
      }
    });

    // Make the snake fall down slightly or fade out
    this.scene.tweens.add({
      targets: this.segments.map((s) => s.sprite),
      y: '+=20',
      alpha: 0,
      duration: 1000,
      ease: 'Power2.easeIn',
    });
  }

  /**
   * Redraw all graphic buffers.
   */
  redrawAll() {
    const total = this.segments.length;
    this.segments.forEach((seg, index) => {
      const isHead = index === 0;
      const graphics = seg.sprite;
      if (!graphics) return;

      graphics.clear();

      // Taper segment size towards the tail
      const radius = (isHead ? 11 : 9.5) * (1 - (index / total) * 0.3);

      if (isHead) {
        // Cyan Head
        graphics.fillStyle(0x06b6d4, 1);
        graphics.fillCircle(0, 0, radius);

        // White glowing eyes
        graphics.fillStyle(0xffffff, 1);
        const dir = this.direction;
        if (dir === 'RIGHT') {
          graphics.fillCircle(4, -4, 2.5);
          graphics.fillCircle(4, 4, 2.5);
          graphics.fillStyle(0x09090b, 1);
          graphics.fillCircle(5, -4, 1);
          graphics.fillCircle(5, 4, 1);
        } else if (dir === 'LEFT') {
          graphics.fillCircle(-4, -4, 2.5);
          graphics.fillCircle(-4, 4, 2.5);
          graphics.fillStyle(0x09090b, 1);
          graphics.fillCircle(-5, -4, 1);
          graphics.fillCircle(-5, 4, 1);
        } else if (dir === 'UP') {
          graphics.fillCircle(-4, -4, 2.5);
          graphics.fillCircle(4, -4, 2.5);
          graphics.fillStyle(0x09090b, 1);
          graphics.fillCircle(-4, -5, 1);
          graphics.fillCircle(4, -5, 1);
        } else if (dir === 'DOWN') {
          graphics.fillCircle(-4, 4, 2.5);
          graphics.fillCircle(4, 4, 2.5);
          graphics.fillStyle(0x09090b, 1);
          graphics.fillCircle(-4, 5, 1);
          graphics.fillCircle(4, 5, 1);
        }
      } else {
        // Body: Gradient blend from Neon Purple (0xa855f7) to Neon Indigo (0x6366f1)
        const ratio = index / total;
        const r = Math.round(168 - (168 - 99) * ratio);
        const g = Math.round(85 - (85 - 102) * ratio);
        const b = Math.round(247 - (247 - 241) * ratio);
        const color = (r << 16) + (g << 8) + b;

        graphics.fillStyle(color, 1);
        graphics.fillCircle(0, 0, radius);
      }
    });
  }

  clear() {
    this.segments.forEach((seg) => {
      if (seg.sprite) seg.sprite.destroy();
    });
    this.segments = [];
  }

  destroy() {
    this.clear();
  }
}
