export class MenuUIManager {
  constructor(scene, boardWidth, boardHeight, cellWidth, cellHeight, cellGap, startX, startY) {
    this.scene = scene;
    this.boardWidth = boardWidth;
    this.boardHeight = boardHeight;
    this.cellWidth = cellWidth;
    this.cellHeight = cellHeight;
    this.cellGap = cellGap;
    this.startX = startX;
    this.startY = startY;

    this.hudTurnText = null;
    this.hudWinsText = null;
    this.hudLossesText = null;
    this.hudDrawsText = null;
    this.hudStreakText = null;

    this.menuContainer = null;
    this.gameOverContainer = null;
    this.undoButtonContainer = null;
  }

  /**
   * Render HUD labels and score trackers on canvas.
   */
  createHUD(wins, losses, draws, bestStreak, mode, difficulty) {
    const textStyle = {
      fontFamily: 'Space Grotesk, sans-serif',
      fontSize: '13px',
      color: '#71717a',
      fontStyle: 'bold',
    };

    const valueStyle = {
      fontFamily: 'Space Grotesk, sans-serif',
      fontSize: '16px',
      color: '#ffffff',
      fontStyle: 'bold',
    };

    // Label Y coordinates
    const ly = 18;
    const vy = 34;

    // Turn indicator (Centered)
    this.hudTurnText = this.scene.add.text(960 / 2, 76, 'READY', {
      fontFamily: 'Space Grotesk, sans-serif',
      fontSize: '22px',
      color: '#06b6d4',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Left HUD: Stats Group
    this.scene.add.text(this.startX - 12, ly, 'RECORD (W-L-D)', textStyle);
    this.hudWinsText = this.scene.add.text(
      this.startX - 12,
      vy,
      `${wins} - ${losses} - ${draws}`,
      valueStyle
    );

    // Right HUD: Streak Group
    this.scene.add.text(this.startX + this.boardWidth + 12, ly, 'BEST STREAK', textStyle).setOrigin(1, 0);
    this.hudStreakText = this.scene.add.text(
      this.startX + this.boardWidth + 12,
      vy,
      `🔥 ${bestStreak}`,
      valueStyle
    ).setOrigin(1, 0);
  }

  updateTurn(turn, mode, isAITurn = false) {
    if (!this.hudTurnText) return;

    if (mode === 'PvC') {
      if (isAITurn) {
        this.hudTurnText.setText('COMPUTER THINKING...');
        this.hudTurnText.setColor('#10b981');
      } else {
        this.hudTurnText.setText('YOUR TURN (X)');
        this.hudTurnText.setColor('#06b6d4');
      }
    } else {
      this.hudTurnText.setText(`PLAYER ${turn} TURN`);
      this.hudTurnText.setColor(turn === 'X' ? '#06b6d4' : '#10b981');
    }
  }

  updateStats(wins, losses, draws, bestStreak) {
    if (this.hudWinsText) {
      this.hudWinsText.setText(`${wins} - ${losses} - ${draws}`);
    }
    if (this.hudStreakText) {
      this.hudStreakText.setText(`🔥 ${bestStreak}`);
    }
  }

  /**
   * Renders the glassmorphic Main Settings Menu.
   */
  showStartMenu(onStart) {
    this.hideAllContainers();

    const cx = 960 / 2;
    const cy = 540 / 2;

    this.menuContainer = this.scene.add.container(0, 0);

    // Dark backdrop overlay
    const overlay = this.scene.add.rectangle(cx, cy, 960, 540, 0x09090b, 0.88);
    this.menuContainer.add(overlay);

    // Dialog Box
    const box = this.scene.add.rectangle(cx, cy, 500, 390, 0x18181b, 0.95);
    box.setStrokeStyle(2, 0x27272a);
    this.menuContainer.add(box);

    // Glowing Neon Title
    const titleText = this.scene.add.text(cx, cy - 145, 'TIC TAC TOE', {
      fontFamily: 'Space Grotesk, sans-serif',
      fontSize: '28px',
      color: '#f4f4f5',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.menuContainer.add(titleText);

    const descText = this.scene.add.text(cx, cy - 115, 'Select mode & difficulty configuration', {
      fontFamily: 'Space Grotesk, sans-serif',
      fontSize: '12px',
      color: '#71717a',
    }).setOrigin(0.5);
    this.menuContainer.add(descText);

    // State parameters
    let selectedMode = 'PvC'; // default
    let selectedDiff = 'Normal'; // default

    // Create buttons group
    const modeButtons = [];
    const diffButtons = [];
    const diffContainer = this.scene.add.container(0, 0);
    this.menuContainer.add(diffContainer);

    const drawModeButtons = () => {
      // Clear old buttons
      modeButtons.forEach((btn) => btn.destroy());
      modeButtons.length = 0;

      const modes = [
        { label: 'VS COMPUTER', val: 'PvC', x: cx - 110 },
        { label: 'LOCAL PVP', val: 'PvP', x: cx + 110 },
      ];

      modes.forEach((m) => {
        const active = selectedMode === m.val;
        const color = active ? 0x06b6d4 : 0x27272a;
        const textColor = active ? '#ffffff' : '#a1a1aa';

        const btn = this.scene.add.rectangle(m.x, cy - 35, 200, 42, active ? 0x06b6d4 : 0x18181b, 0.8)
          .setStrokeStyle(1.5, color)
          .setInteractive({ useHandCursor: true });

        const txt = this.scene.add.text(m.x, cy - 35, m.label, {
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: '13px',
          color: textColor,
          fontStyle: 'bold',
        }).setOrigin(0.5);

        this.menuContainer.add([btn, txt]);
        modeButtons.push(btn, txt);

        btn.on('pointerdown', () => {
          this.scene.audioController?.playClick();
          selectedMode = m.val;
          if (selectedMode === 'PvP') {
            diffContainer.setVisible(false);
          } else {
            diffContainer.setVisible(true);
          }
          drawModeButtons();
        });
      });
    };

    const drawDifficultyButtons = () => {
      // Clear old buttons from diffContainer
      diffButtons.forEach((btn) => btn.destroy());
      diffButtons.length = 0;

      const diffLabel = this.scene.add.text(cx, cy + 30, 'DIFFICULTY', {
        fontFamily: 'Space Grotesk, sans-serif',
        fontSize: '11px',
        color: '#71717a',
        fontStyle: 'bold',
      }).setOrigin(0.5);
      diffContainer.add(diffLabel);
      diffButtons.push(diffLabel);

      const diffs = [
        { label: 'Easy', val: 'Easy', x: cx - 120 },
        { label: 'Medium', val: 'Normal', x: cx },
        { label: 'Hard', val: 'Hard', x: cx + 120 },
      ];

      diffs.forEach((d) => {
        const active = selectedDiff === d.val;
        const color = active ? 0x10b981 : 0x27272a;
        const textColor = active ? '#ffffff' : '#a1a1aa';

        const btn = this.scene.add.rectangle(d.x, cy + 70, 100, 36, active ? 0x10b981 : 0x18181b, 0.8)
          .setStrokeStyle(1.5, color)
          .setInteractive({ useHandCursor: true });

        const txt = this.scene.add.text(d.x, cy + 70, d.label, {
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: '12px',
          color: textColor,
          fontStyle: 'bold',
        }).setOrigin(0.5);

        diffContainer.add([btn, txt]);
        diffButtons.push(btn, txt);

        btn.on('pointerdown', () => {
          this.scene.audioController?.playClick();
          selectedDiff = d.val;
          drawDifficultyButtons();
        });
      });
    };

    // Draw buttons initial states
    drawModeButtons();
    drawDifficultyButtons();

    // START BUTTON
    const startBtn = this.scene.add.rectangle(cx, cy + 140, 240, 44, 0xec4899, 0.15)
      .setStrokeStyle(1.5, 0xec4899)
      .setInteractive({ useHandCursor: true });

    const startTxt = this.scene.add.text(cx, cy + 140, 'START SYSTEM', {
      fontFamily: 'Space Grotesk, sans-serif',
      fontSize: '14px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.menuContainer.add([startBtn, startTxt]);

    startBtn.on('pointerover', () => {
      this.scene.tweens.add({
        targets: [startBtn, startTxt],
        scale: 1.03,
        duration: 100,
      });
      startBtn.setFillStyle(0xec4899, 0.3);
    });

    startBtn.on('pointerout', () => {
      this.scene.tweens.add({
        targets: [startBtn, startTxt],
        scale: 1.0,
        duration: 100,
      });
      startBtn.setFillStyle(0xec4899, 0.15);
    });

    startBtn.on('pointerdown', () => {
      this.scene.audioController?.playClick();
      onStart(selectedMode, selectedDiff);
    });

    // Fade entrance
    this.menuContainer.setAlpha(0);
    this.scene.tweens.add({
      targets: this.menuContainer,
      alpha: 1,
      duration: 300,
    });
  }

  /**
   * Draw canvas level interactive Undo button (only in PvC when history permits).
   */
  drawUndoButton(visible, onUndo) {
    if (this.undoButtonContainer) {
      this.undoButtonContainer.destroy();
      this.undoButtonContainer = null;
    }

    if (!visible) return;

    const cx = 960 / 2;
    const cy = 485;

    this.undoButtonContainer = this.scene.add.container(cx, cy);

    const btnBg = this.scene.add.rectangle(0, 0, 110, 30, 0x27272a, 0.25)
      .setStrokeStyle(1.2, 0x27272a, 0.8)
      .setInteractive({ useHandCursor: true });

    const btnText = this.scene.add.text(0, 0, '↩ UNDO MOVE', {
      fontFamily: 'Space Grotesk, sans-serif',
      fontSize: '11px',
      color: '#a1a1aa',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.undoButtonContainer.add([btnBg, btnText]);

    btnBg.on('pointerover', () => {
      btnBg.setFillStyle(0x27272a, 0.55);
      btnText.setColor('#ffffff');
    });

    btnBg.on('pointerout', () => {
      btnBg.setFillStyle(0x27272a, 0.25);
      btnText.setColor('#a1a1aa');
    });

    btnBg.on('pointerdown', () => {
      this.scene.audioController?.playClick();
      onUndo();
    });
  }

  /**
   * Render Victory, Defeat, or Draw dialog overlay.
   */
  showGameOver(result, onRestart) {
    this.hideAllContainers();

    const cx = 960 / 2;
    const cy = 540 / 2;

    this.gameOverContainer = this.scene.add.container(0, 0);

    // Determine colors/texts
    let title = 'DRAW MATCH';
    let titleColor = '#fbbf24'; // gold/yellow
    let bgTint = 0xfbbf24;

    if (result === 'win') {
      title = 'VICTORY';
      titleColor = '#06b6d4'; // neon cyan
      bgTint = 0x06b6d4;
    } else if (result === 'lose') {
      title = 'DEFEAT';
      titleColor = '#ef4444'; // neon red
      bgTint = 0xef4444;
    }

    // Backdrop
    const overlay = this.scene.add.rectangle(cx, cy, 960, 540, bgTint, 0.1);
    this.gameOverContainer.add(overlay);

    // Box
    const box = this.scene.add.rectangle(cx, cy - 20, 440, 240, 0x09090b, 0.95);
    box.setStrokeStyle(2, bgTint, 0.5);
    this.gameOverContainer.add(box);

    // Title
    const titleText = this.scene.add.text(cx, cy - 80, title, {
      fontFamily: 'Space Grotesk, sans-serif',
      fontSize: '28px',
      color: titleColor,
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.gameOverContainer.add(titleText);

    // Subtext
    const subText = this.scene.add.text(cx, cy - 30, 'System offline. Returning to settings.', {
      fontFamily: 'Space Grotesk, sans-serif',
      fontSize: '12px',
      color: '#71717a',
    }).setOrigin(0.5);
    this.gameOverContainer.add(subText);

    // Countdown timer
    const restartTimerText = this.scene.add.text(cx, cy + 25, 'Restarting in 3...', {
      fontFamily: 'Space Grotesk, sans-serif',
      fontSize: '14px',
      color: '#a1a1aa',
    }).setOrigin(0.5);
    this.gameOverContainer.add(restartTimerText);

    // Skip Button
    const skipBtn = this.scene.add.text(cx, cy + 65, 'TAP TO SKIP', {
      fontFamily: 'Space Grotesk, sans-serif',
      fontSize: '10px',
      color: '#71717a',
      backgroundColor: '#18181b',
      padding: { left: 10, right: 10, top: 5, bottom: 5 },
    })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });
    this.gameOverContainer.add(skipBtn);

    let timeLeft = 3;
    const interval = window.setInterval(() => {
      timeLeft -= 1;
      if (timeLeft <= 0) {
        window.clearInterval(interval);
        cleanupAndRestart();
      } else {
        restartTimerText.setText(`Restarting in ${timeLeft}...`);
      }
    }, 1000);

    const cleanupAndRestart = () => {
      window.clearInterval(interval);
      onRestart();
    };

    skipBtn.on('pointerdown', () => {
      this.scene.audioController?.playClick();
      cleanupAndRestart();
    });

    // Fade entrance
    this.gameOverContainer.setAlpha(0);
    this.scene.tweens.add({
      targets: this.gameOverContainer,
      alpha: 1,
      duration: 350,
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
    if (this.undoButtonContainer) {
      this.undoButtonContainer.destroy();
      this.undoButtonContainer = null;
    }
  }

  clear() {
    this.hideAllContainers();
    this.hudTurnText = null;
    this.hudWinsText = null;
    this.hudLossesText = null;
    this.hudDrawsText = null;
    this.hudStreakText = null;
  }

  destroy() {
    this.clear();
  }
}
