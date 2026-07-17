export class AnimationManager {
  constructor(scene, boardManager) {
    this.scene = scene;
    this.boardManager = boardManager;
    this.activeTweens = [];
  }

  /**
   * Scale up and down the winning X or O pieces on loop.
   */
  pulseWinningPieces(winCells) {
    winCells.forEach((idx) => {
      const container = this.boardManager.pieces[idx];
      if (container) {
        const tween = this.scene.tweens.add({
          targets: container,
          scaleX: 1.22,
          scaleY: 1.22,
          duration: 300,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        });
        this.activeTweens.push(tween);
      }
    });
  }

  /**
   * Dim and shrink losing cells.
   */
  fadeLosingPieces(winCells) {
    for (let i = 0; i < 9; i++) {
      if (!winCells.includes(i) && this.boardManager.pieces[i]) {
        const tween = this.scene.tweens.add({
          targets: this.boardManager.pieces[i],
          alpha: 0.2,
          scaleX: 0.8,
          scaleY: 0.8,
          duration: 300,
          ease: 'Power2.easeOut',
        });
        this.activeTweens.push(tween);
      }
    }
  }

  /**
   * Explodes falling neon confetti squares from top-middle.
   */
  triggerVictoryConfetti() {
    const colors = [0xec4899, 0x06b6d4, 0x10b981, 0xfbbf24, 0xa855f7];
    const count = 70;

    for (let i = 0; i < count; i++) {
      const sx = 960 / 2 + (Math.random() * 300 - 150);
      const sy = 160 + (Math.random() * 80 - 40);

      const rect = this.scene.add.rectangle(
        sx,
        sy,
        Math.random() * 6 + 6,
        Math.random() * 6 + 6,
        colors[Math.floor(Math.random() * colors.length)]
      );

      const angle = Math.random() * -110 - 35; // Angle upwards
      const speed = Math.random() * 200 + 150;
      const rad = (angle * Math.PI) / 180;

      const vx = Math.cos(rad) * speed;
      const vy = Math.sin(rad) * speed;

      // Tween translation representing projection + gravity falling
      this.scene.tweens.add({
        targets: rect,
        x: sx + vx * 1.4,
        y: 540 + 20,
        angle: Math.random() * 360 + 360,
        duration: Math.random() * 1000 + 1500,
        ease: 'Quad.easeOut',
        onComplete: () => {
          rect.destroy();
        },
      });
    }
  }

  /**
   * Shake board on tie / loss.
   */
  triggerImpactShake() {
    this.scene.cameras.main.shake(250, 0.01);
  }

  triggerVictoryFlash() {
    this.scene.cameras.main.flash(200, 6, 182, 212, 0.35); // soft cyan flash
  }

  clear() {
    this.activeTweens.forEach((t) => {
      if (t) t.remove();
    });
    this.activeTweens = [];
  }

  destroy() {
    this.clear();
  }
}
