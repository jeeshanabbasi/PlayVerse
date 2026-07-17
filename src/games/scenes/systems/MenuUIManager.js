export class MenuUIManager {
  constructor(scene, gridWidth, gridHeight, cellWidth, cellHeight, startX, startY) {
    this.scene = scene;
    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;
    this.cellWidth = cellWidth;
    this.cellHeight = cellHeight;
    this.startX = startX;
    this.startY = startY;

    this.boardWidth = gridWidth * cellWidth;
    this.boardHeight = gridHeight * cellHeight;

    // UI elements references
    this.scoreText = null;
    this.highScoreText = null;
    this.difficultyText = null;

    this.menuContainer = null;
    this.gameOverContainer = null;
    this.countdownText = null;

    this.bgGraphics = null;
  }

  /**
   * Draw board borders and checkers pattern.
   */
  drawBoard() {
    if (this.bgGraphics) this.bgGraphics.destroy();
    this.bgGraphics = this.scene.add.graphics();

    // 1. Draw outer border (zinc-800)
    this.bgGraphics.lineStyle(3, 0x27272a, 1);
    this.bgGraphics.strokeRect(
      this.startX - 3,
      this.startY - 3,
      this.boardWidth + 6,
      this.boardHeight + 6
    );

    // 2. Checkerboard grid spaces
    this.bgGraphics.fillStyle(0x18181b, 0.35); // zinc-900 translucent
    for (let x = 0; x < this.gridWidth; x++) {
      for (let y = 0; y < this.gridHeight; y++) {
        if ((x + y) % 2 === 1) {
          this.bgGraphics.fillRect(
            this.startX + x * this.cellWidth,
            this.startY + y * this.cellHeight,
            this.cellWidth,
            this.cellHeight
          );
        }
      }
    }
  }

  /**
   * Create standard HUD texts.
   */
  createHUD(bestScore) {
    const textStyle = {
      fontFamily: 'Space Grotesk, sans-serif',
      fontSize: '15px',
      color: '#a1a1aa',
      fontStyle: 'bold',
    };

    const valueStyle = {
      fontFamily: 'Space Grotesk, sans-serif',
      fontSize: '18px',
      color: '#ffffff',
      fontStyle: 'bold',
    };

    // Label coordinates
    const ly = 20;
    const vy = 38;

    // Score Group
    this.scene.add.text(this.startX, ly, 'SCORE', textStyle);
    this.scoreText = this.scene.add.text(this.startX, vy, '000', valueStyle);

    // High Score Group
    this.scene.add.text(this.startX + 140, ly, 'BEST', textStyle);
    this.highScoreText = this.scene.add.text(this.startX + 140, vy, String(bestScore).padStart(3, '0'), valueStyle);

    // Difficulty Group
    this.scene.add.text(this.startX + this.boardWidth, ly, 'SPEED', textStyle).setOrigin(1, 0);
    this.difficultyText = this.scene.add.text(this.startX + this.boardWidth, vy, 'READY', valueStyle).setOrigin(1, 0);
  }

  updateScore(score) {
    if (this.scoreText) {
      this.scoreText.setText(String(score).padStart(3, '0'));
    }
  }

  updateHighScore(highScore) {
    if (this.highScoreText) {
      this.highScoreText.setText(String(highScore).padStart(3, '0'));
    }
  }

  updateDifficulty(label) {
    if (this.difficultyText) {
      this.difficultyText.setText(label.toUpperCase());
    }
  }

  animateScorePop() {
    if (!this.scoreText) return;
    this.scene.tweens.add({
      targets: this.scoreText,
      scaleX: 1.25,
      scaleY: 1.25,
      duration: 100,
      yoyo: true,
      repeat: 0,
      ease: 'Back.easeOut',
    });
  }

  /**
   * Create interactive Start / Difficulty Menu.
   */
  showDifficultyMenu(onSelect) {
    this.hideAllContainers();

    const cx = 960 / 2;
    const cy = 540 / 2;

    this.menuContainer = this.scene.add.container(0, 0);

    // Backdrop overlay
    const overlay = this.scene.add.rectangle(cx, cy, 960, 540, 0x09090b, 0.85);
    this.menuContainer.add(overlay);

    // Dialog Box
    const box = this.scene.add.rectangle(cx, cy - 20, 480, 260, 0x18181b, 0.95);
    box.setStrokeStyle(2, 0x27272a);
    this.menuContainer.add(box);

    // Title
    const titleText = this.scene.add.text(cx, cy - 100, 'CHOOSE DIFFICULTY', {
      fontFamily: 'Space Grotesk, sans-serif',
      fontSize: '20px',
      color: '#f4f4f5',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.menuContainer.add(titleText);

    // Subtitle
    const subtitleText = this.scene.add.text(cx, cy - 70, 'Select speed level to begin playing', {
      fontFamily: 'Space Grotesk, sans-serif',
      fontSize: '13px',
      color: '#71717a',
    }).setOrigin(0.5);
    this.menuContainer.add(subtitleText);

    const levels = [
      { name: 'Easy', color: 0x10b981, yOffset: -10, speed: 'Easy' },
      { name: 'Normal', color: 0x3b82f6, yOffset: 45, speed: 'Normal' },
      { name: 'Hard', color: 0xef4444, yOffset: 100, speed: 'Hard' },
    ];

    levels.forEach((lvl) => {
      // Button Background
      const btnBg = this.scene.add.rectangle(cx, cy + lvl.yOffset, 280, 40, lvl.color, 0.15)
        .setInteractive({ useHandCursor: true })
        .setStrokeStyle(1.5, lvl.color, 0.5);

      const btnText = this.scene.add.text(cx, cy + lvl.yOffset, lvl.name, {
        fontFamily: 'Space Grotesk, sans-serif',
        fontSize: '14px',
        color: '#ffffff',
        fontStyle: 'bold',
      }).setOrigin(0.5);

      this.menuContainer.add([btnBg, btnText]);

      // Hover Tweens
      btnBg.on('pointerover', () => {
        this.scene.tweens.add({
          targets: [btnBg, btnText],
          scale: 1.03,
          duration: 100,
        });
        btnBg.setFillStyle(lvl.color, 0.3);
      });

      btnBg.on('pointerout', () => {
        this.scene.tweens.add({
          targets: [btnBg, btnText],
          scale: 1.0,
          duration: 100,
        });
        btnBg.setFillStyle(lvl.color, 0.15);
      });

      btnBg.on('pointerdown', () => {
        onSelect(lvl.speed);
      });
    });

    // Animate container entry
    this.menuContainer.setAlpha(0);
    this.scene.tweens.add({
      targets: this.menuContainer,
      alpha: 1,
      duration: 300,
    });
  }

  /**
   * Run the 3-2-1 countdown sequence.
   */
  startCountdown(callback) {
    this.hideAllContainers();

    const cx = 960 / 2;
    const cy = 540 / 2;

    this.countdownText = this.scene.add.text(cx, cy, '', {
      fontFamily: 'Space Grotesk, sans-serif',
      fontSize: '100px',
      color: '#a855f7',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const sequence = ['3', '2', '1', 'GO!'];
    let idx = 0;

    const runStep = () => {
      if (idx >= sequence.length) {
        this.countdownText.destroy();
        this.countdownText = null;
        callback();
        return;
      }

      const textValue = sequence[idx];
      this.countdownText.setText(textValue);
      this.countdownText.setScale(0.2);
      this.countdownText.setAlpha(0);

      // Color mapping
      if (textValue === 'GO!') {
        this.countdownText.setColor('#06b6d4');
      } else {
        this.countdownText.setColor('#a855f7');
      }

      this.scene.tweens.add({
        targets: this.countdownText,
        scaleX: 1.2,
        scaleY: 1.2,
        alpha: 1,
        duration: 350,
        ease: 'Back.easeOut',
        yoyo: true,
        hold: 400,
        onComplete: () => {
          idx += 1;
          runStep();
        },
      });
    };

    runStep();
  }

  /**
   * Show Game Over modal with stats and restart countdown.
   */
  showGameOver(score, isNewHighScore, onRestart) {
    this.hideAllContainers();

    const cx = 960 / 2;
    const cy = 540 / 2;

    this.gameOverContainer = this.scene.add.container(0, 0);

    // Backdrop
    const overlay = this.scene.add.rectangle(cx, cy, 960, 540, 0xef4444, 0.1);
    this.gameOverContainer.add(overlay);

    // Dialog Box
    const box = this.scene.add.rectangle(cx, cy - 20, 480, 260, 0x09090b, 0.95);
    box.setStrokeStyle(2, 0xef4444, 0.4);
    this.gameOverContainer.add(box);

    // Title
    const titleText = this.scene.add.text(cx, cy - 90, 'GAME OVER', {
      fontFamily: 'Space Grotesk, sans-serif',
      fontSize: '28px',
      color: '#ef4444',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.gameOverContainer.add(titleText);

    // Score text
    const scoreVal = this.scene.add.text(cx, cy - 35, `Final Score: ${score}`, {
      fontFamily: 'Space Grotesk, sans-serif',
      fontSize: '16px',
      color: '#e4e4e7',
    }).setOrigin(0.5);
    this.gameOverContainer.add(scoreVal);

    if (isNewHighScore) {
      const bestText = this.scene.add.text(cx, cy - 10, '🏆 NEW HIGH SCORE! 🏆', {
        fontFamily: 'Space Grotesk, sans-serif',
        fontSize: '15px',
        color: '#fbbf24',
        fontStyle: 'bold',
      }).setOrigin(0.5);

      this.gameOverContainer.add(bestText);

      // Gold shimmer pulsing
      this.scene.tweens.add({
        targets: bestText,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 300,
        yoyo: true,
        repeat: -1,
      });
    }

    // Auto restart text
    const restartTimerText = this.scene.add.text(cx, cy + 50, 'Restarting in 3...', {
      fontFamily: 'Space Grotesk, sans-serif',
      fontSize: '14px',
      color: '#71717a',
    }).setOrigin(0.5);
    this.gameOverContainer.add(restartTimerText);

    // Set interactive manually for click to skip restart timer
    const skipBtn = this.scene.add.text(cx, cy + 90, 'TAP TO SKIP', {
      fontFamily: 'Space Grotesk, sans-serif',
      fontSize: '11px',
      color: '#a1a1aa',
      backgroundColor: '#27272a',
      padding: { x: 12, y: 6 },
    })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    this.gameOverContainer.add(skipBtn);

    let timeLeft = 3;
    const timerInterval = window.setInterval(() => {
      timeLeft -= 1;
      if (timeLeft <= 0) {
        window.clearInterval(timerInterval);
        cleanupAndRestart();
      } else {
        restartTimerText.setText(`Restarting in ${timeLeft}...`);
      }
    }, 1000);

    const cleanupAndRestart = () => {
      window.clearInterval(timerInterval);
      onRestart();
    };

    skipBtn.on('pointerdown', cleanupAndRestart);

    // Fade in
    this.gameOverContainer.setAlpha(0);
    this.scene.tweens.add({
      targets: this.gameOverContainer,
      alpha: 1,
      duration: 400,
    });
  }

  hideAllContainers() {
    if (this.menuContainer) {
      this.menuContainer.destroy();
      this.menuContainer = null;
    }
    if (this.gameOverContainer) {
      this.gameOverContainer.destroy();
      this.gameOverContainer = null;
    }
    if (this.countdownText) {
      this.countdownText.destroy();
      this.countdownText = null;
    }
  }

  clear() {
    this.hideAllContainers();
    if (this.bgGraphics) {
      this.bgGraphics.destroy();
      this.bgGraphics = null;
    }
    this.scoreText = null;
    this.highScoreText = null;
    this.difficultyText = null;
  }

  destroy() {
    this.clear();
  }
}
