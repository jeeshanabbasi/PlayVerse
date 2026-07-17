export class ItemSpawnSystem {
  constructor(scene, gridWidth, gridHeight, cellWidth, cellHeight, startX, startY) {
    this.scene = scene;
    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;
    this.cellWidth = cellWidth;
    this.cellHeight = cellHeight;
    this.startX = startX;
    this.startY = startY;

    this.items = [];
  }

  /**
   * Spawns an item on a random empty tile.
   * @param {string} type - The item type (e.g. 'food')
   * @param {Array<{x: number, y: number}>} occupiedCells - Coordinate list of cells occupied by the snake
   */
  spawnItem(type = 'food', occupiedCells = []) {
    const freeCells = [];

    // Identify all empty cells
    for (let x = 0; x < this.gridWidth; x++) {
      for (let y = 0; y < this.gridHeight; y++) {
        const isOccupied =
          occupiedCells.some((cell) => cell.x === x && cell.y === y) ||
          this.items.some((item) => item.x === x && item.y === y);

        if (!isOccupied) {
          freeCells.push({ x, y });
        }
      }
    }

    if (freeCells.length === 0) return null;

    // Pick random free coordinate
    const randomIndex = Math.floor(Math.random() * freeCells.length);
    const pos = freeCells[randomIndex];

    // Compute pixel center coordinates
    const px = this.startX + pos.x * this.cellWidth + this.cellWidth / 2;
    const py = this.startY + pos.y * this.cellHeight + this.cellHeight / 2;

    let sprite;
    if (type === 'food') {
      // Create a nice styled food container
      const container = this.scene.add.container(px, py);

      // Glowing aura
      const aura = this.scene.add.circle(0, 0, this.cellWidth * 0.7, 0xef4444, 0.25);
      // Red cherry body
      const cherry = this.scene.add.circle(0, 2, this.cellWidth * 0.4, 0xef4444, 1);
      // Small green leaf stem
      const stem = this.scene.add.line(0, 0, 0, -2, 4, -8, 0x10b981);
      stem.setLineWidth(1.5);

      container.add([aura, cherry, stem]);
      sprite = container;

      // Pulse scale
      this.scene.tweens.add({
        targets: container,
        scaleX: 1.25,
        scaleY: 1.25,
        duration: 600,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });

      // Pulse aura opacity
      this.scene.tweens.add({
        targets: aura,
        alpha: { from: 0.1, to: 0.45 },
        duration: 600,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }

    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      x: pos.x,
      y: pos.y,
      sprite,
    };

    this.items.push(newItem);
    return newItem;
  }

  /**
   * Remove and destroy the item sprite.
   */
  removeItem(item) {
    if (!item) return;
    const index = this.items.findIndex((i) => i.id === item.id);
    if (index !== -1) {
      const target = item.sprite;
      if (target) {
        this.scene.tweens.add({
          targets: target,
          scaleX: 0,
          scaleY: 0,
          alpha: 0,
          duration: 150,
          onComplete: () => {
            target.destroy();
          },
        });
      }
      this.items.splice(index, 1);
    }
  }

  /**
   * Check if a specific coordinate collides with any items.
   */
  checkCollision(headX, headY) {
    return this.items.find((item) => item.x === headX && item.y === headY) || null;
  }

  clear() {
    this.items.forEach((item) => {
      if (item.sprite) item.sprite.destroy();
    });
    this.items = [];
  }

  destroy() {
    this.clear();
  }
}
