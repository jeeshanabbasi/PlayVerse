export class InputManager {
  constructor(scene, boardWidth, boardHeight, cellWidth, cellHeight, cellGap, startX, startY) {
    this.scene = scene;
    this.boardWidth = boardWidth;
    this.boardHeight = boardHeight;
    this.cellWidth = cellWidth;
    this.cellHeight = cellHeight;
    this.cellGap = cellGap;
    this.startX = startX;
    this.startY = startY;

    this.focusedRow = 0;
    this.focusedCol = 0;
    this.keyboardActive = false;

    this.setupListeners();
  }

  setupListeners() {
    if (!this.scene.input?.keyboard) return;

    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.wasd = this.scene.input.keyboard.addKeys({
      up: 'W',
      down: 'S',
      left: 'A',
      right: 'D',
      enter: 'ENTER',
      space: 'SPACE',
    });
  }

  /**
   * Monitor keyboard ticks. Invoke callback if player presses Enter/Space on focused cell.
   */
  update(onMoveRequested) {
    if (!this.cursors) return;

    let rowChanged = false;
    let colChanged = false;

    // Arrow navigation checks (holding down throttle to 250ms)
    if (
      this.scene.input.keyboard.checkDown(this.cursors.up, 250) ||
      this.scene.input.keyboard.checkDown(this.wasd.up, 250)
    ) {
      this.focusedRow = (this.focusedRow - 1 + 3) % 3;
      rowChanged = true;
    } else if (
      this.scene.input.keyboard.checkDown(this.cursors.down, 250) ||
      this.scene.input.keyboard.checkDown(this.wasd.down, 250)
    ) {
      this.focusedRow = (this.focusedRow + 1) % 3;
      rowChanged = true;
    }

    if (
      this.scene.input.keyboard.checkDown(this.cursors.left, 250) ||
      this.scene.input.keyboard.checkDown(this.wasd.left, 250)
    ) {
      this.focusedCol = (this.focusedCol - 1 + 3) % 3;
      colChanged = true;
    } else if (
      this.scene.input.keyboard.checkDown(this.cursors.right, 250) ||
      this.scene.input.keyboard.checkDown(this.wasd.right, 250)
    ) {
      this.focusedCol = (this.focusedCol + 1) % 3;
      colChanged = true;
    }

    if (rowChanged || colChanged) {
      this.keyboardActive = true;
    }

    // Trigger action on Enter or Space
    if (
      this.keyboardActive &&
      (this.scene.input.keyboard.checkDown(this.wasd.enter, 300) ||
        this.scene.input.keyboard.checkDown(this.wasd.space, 300) ||
        this.scene.input.keyboard.checkDown(this.cursors.space, 300))
    ) {
      const idx = this.focusedRow * 3 + this.focusedCol;
      onMoveRequested(idx);
    }

    // Deactivate keyboard cursor if mouse moves
    const pointer = this.scene.input.activePointer;
    if (pointer.velocity.x !== 0 || pointer.velocity.y !== 0) {
      this.keyboardActive = false;
    }
  }

  /**
   * Map pointer down position to board index. Returns index (0-8) or -1.
   */
  getPointerCell(pointer) {
    if (!pointer.isDown) return -1;
    return this.resolveCoordinates(pointer.x, pointer.y);
  }

  /**
   * Map pointer hover coordinates to cell index.
   */
  getHoverCell(pointer) {
    return this.resolveCoordinates(pointer.x, pointer.y);
  }

  resolveCoordinates(px, py) {
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const cx = this.startX + c * (this.cellWidth + this.cellGap);
        const cy = this.startY + r * (this.cellHeight + this.cellGap);

        if (
          px >= cx &&
          px <= cx + this.cellWidth &&
          py >= cy &&
          py <= cy + this.cellHeight
        ) {
          return r * 3 + c;
        }
      }
    }
    return -1;
  }

  isKeyboardActive() {
    return this.keyboardActive;
  }

  getFocusedIndex() {
    return this.focusedRow * 3 + this.focusedCol;
  }

  clear() {
    this.focusedRow = 0;
    this.focusedCol = 0;
    this.keyboardActive = false;
  }

  destroy() {
    // No special events bound outside scene input
  }
}
