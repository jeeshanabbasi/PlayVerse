export class BoardManager {
  constructor(scene, boardWidth, boardHeight, cellWidth, cellHeight, cellGap, startX, startY) {
    this.scene = scene;
    this.boardWidth = boardWidth;
    this.boardHeight = boardHeight;
    this.cellWidth = cellWidth;
    this.cellHeight = cellHeight;
    this.cellGap = cellGap;
    this.startX = startX;
    this.startY = startY;

    this.gridGraphics = null;
    this.highlightGraphics = null;
    this.pieces = Array(9).fill(null); // Pool of X/O container instances
    this.winningLineGraphics = null;

    this.drawGrid();
  }

  drawGrid() {
    if (this.gridGraphics) this.gridGraphics.destroy();
    this.gridGraphics = this.scene.add.graphics();

    // 1. Outer Glass Panel Backdrop
    this.gridGraphics.fillStyle(0x09090b, 0.45);
    this.gridGraphics.lineStyle(2.5, 0x27272a, 1);
    this.gridGraphics.fillRoundedRect(
      this.startX - 12,
      this.startY - 12,
      this.boardWidth + 24,
      this.boardHeight + 24,
      12
    );
    this.gridGraphics.strokeRoundedRect(
      this.startX - 12,
      this.startY - 12,
      this.boardWidth + 24,
      this.boardHeight + 24,
      12
    );

    // 2. Cell Outlines
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const cx = this.startX + c * (this.cellWidth + this.cellGap);
        const cy = this.startY + r * (this.cellHeight + this.cellGap);

        this.gridGraphics.fillStyle(0x18181b, 0.5);
        this.gridGraphics.lineStyle(1.5, 0x27272a, 0.7);
        this.gridGraphics.fillRoundedRect(cx, cy, this.cellWidth, this.cellHeight, 8);
        this.gridGraphics.strokeRoundedRect(cx, cy, this.cellWidth, this.cellHeight, 8);
      }
    }
  }

  getCellCenter(index) {
    const r = Math.floor(index / 3);
    const c = index % 3;
    const cx = this.startX + c * (this.cellWidth + this.cellGap) + this.cellWidth / 2;
    const cy = this.startY + r * (this.cellHeight + this.cellGap) + this.cellHeight / 2;
    return { x: cx, y: cy };
  }

  /**
   * Place O or X marker in cell index with entrance pop tween.
   */
  placePiece(index, symbol, onComplete) {
    if (this.pieces[index]) {
      this.pieces[index].destroy();
    }

    const center = this.getCellCenter(index);
    const container = this.scene.add.container(center.x, center.y);
    this.pieces[index] = container;

    const g = this.scene.add.graphics();
    container.add(g);

    const size = this.cellWidth * 0.28;

    if (symbol === 'X') {
      // Soft outer neon aura (cyan)
      g.lineStyle(14, 0x06b6d4, 0.2);
      g.lineBetween(-size, -size, size, size);
      g.lineBetween(-size, size, size, -size);

      // Bright core stroke
      g.lineStyle(5.5, 0x22d3ee, 1);
      g.lineBetween(-size, -size, size, size);
      g.lineBetween(-size, size, size, -size);
    } else {
      // Soft outer neon aura (green)
      g.lineStyle(14, 0x10b981, 0.2);
      g.strokeCircle(0, 0, size);

      // Bright core stroke
      g.lineStyle(5.5, 0x34d399, 1);
      g.strokeCircle(0, 0, size);
    }

    // Scale pop entrance
    container.setScale(0);
    this.scene.tweens.add({
      targets: container,
      scaleX: 1,
      scaleY: 1,
      duration: 250,
      ease: 'Back.easeOut',
      onComplete: () => {
        if (onComplete) onComplete();
      },
    });
  }

  removePiece(index) {
    if (this.pieces[index]) {
      const target = this.pieces[index];
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
      this.pieces[index] = null;
    }
  }

  /**
   * Draw highlights based on keyboard focus index or mouse pointer hover.
   */
  drawHighlights(hoverIdx, focusIdx, isKeyboardActive) {
    if (!this.highlightGraphics) {
      this.highlightGraphics = this.scene.add.graphics();
    }
    this.highlightGraphics.clear();

    // 1. Draw Keyboard Selection Glow (focused cyan frame)
    if (isKeyboardActive && focusIdx >= 0 && focusIdx < 9) {
      const center = this.getCellCenter(focusIdx);
      const cx = center.x - this.cellWidth / 2;
      const cy = center.y - this.cellHeight / 2;

      this.highlightGraphics.lineStyle(4, 0x06b6d4, 0.4);
      this.highlightGraphics.strokeRoundedRect(cx - 2, cy - 2, this.cellWidth + 4, this.cellHeight + 4, 8);

      this.highlightGraphics.lineStyle(2, 0x22d3ee, 1);
      this.highlightGraphics.strokeRoundedRect(cx, cy, this.cellWidth, this.cellHeight, 8);
    }
    // 2. Draw Mouse Hover Indicator (neon-magenta glow)
    else if (!isKeyboardActive && hoverIdx >= 0 && hoverIdx < 9 && !this.pieces[hoverIdx]) {
      const center = this.getCellCenter(hoverIdx);
      const cx = center.x - this.cellWidth / 2;
      const cy = center.y - this.cellHeight / 2;

      this.highlightGraphics.fillStyle(0xec4899, 0.08);
      this.highlightGraphics.fillRoundedRect(cx, cy, this.cellWidth, this.cellHeight, 8);

      this.highlightGraphics.lineStyle(2, 0xec4899, 0.6);
      this.highlightGraphics.strokeRoundedRect(cx, cy, this.cellWidth, this.cellHeight, 8);
    }
  }

  /**
   * Render winning line crossing winCell Indices.
   */
  drawWinLine(lineCells, onComplete) {
    if (this.winningLineGraphics) this.winningLineGraphics.destroy();
    this.winningLineGraphics = this.scene.add.graphics();

    const start = this.getCellCenter(lineCells[0]);
    const end = this.getCellCenter(lineCells[2]);

    const drawObj = { progress: 0 };

    this.scene.tweens.add({
      targets: drawObj,
      progress: 1,
      duration: 400,
      ease: 'Sine.easeOut',
      onUpdate: () => {
        if (!this.winningLineGraphics) return;
        this.winningLineGraphics.clear();

        const curX = start.x + (end.x - start.x) * drawObj.progress;
        const curY = start.y + (end.y - start.y) * drawObj.progress;

        // Thicker background glow (pink)
        this.winningLineGraphics.lineStyle(16, 0xec4899, 0.25);
        this.winningLineGraphics.lineBetween(start.x, start.y, curX, curY);

        // Core stroke (fuchsia)
        this.winningLineGraphics.lineStyle(6, 0xf472b6, 1);
        this.winningLineGraphics.lineBetween(start.x, start.y, curX, curY);
      },
      onComplete: () => {
        if (this.winningLineGraphics) {
          // Slow pulsing glow on loop
          this.scene.tweens.add({
            targets: this.winningLineGraphics,
            alpha: { from: 1, to: 0.65 },
            duration: 350,
            yoyo: true,
            repeat: -1,
          });
        }
        if (onComplete) onComplete();
      },
    });
  }

  clear() {
    this.pieces.forEach((p) => {
      if (p) p.destroy();
    });
    this.pieces.fill(null);

    if (this.winningLineGraphics) {
      this.winningLineGraphics.destroy();
      this.winningLineGraphics = null;
    }
    if (this.highlightGraphics) {
      this.highlightGraphics.destroy();
      this.highlightGraphics = null;
    }
  }

  destroy() {
    this.clear();
    if (this.gridGraphics) this.gridGraphics.destroy();
  }
}
