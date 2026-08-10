import { createBaseGameScene } from '../../scenes/BaseGameScene.js';

export function createPongScene(Phaser) {
  return class PongScene extends createBaseGameScene(Phaser, 'PongScene') {
    constructor() {
      super();
      this.audioCtx = null;
      this.isTwoPlayer = false;
      this.isGameOver = false;
      this.winner = null;
    }

    create() {
      const width = this.cameras.main.width;
      const height = this.cameras.main.height;
      const cx = width / 2;
      const cy = height / 2;

      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      this.physics.world.setBoundsCollision(false, false, true, true);

      this.isGameOver = false;
      this.winner = null;
      this.score = { p1: 0, p2: 0 };

      // Background Cyber Grid
      const bg = this.add.graphics();
      bg.fillStyle(0x0a0a14, 1);
      bg.fillRect(0, 0, width, height);

      // Center Dividing Dashed Line
      this.centerLine = this.add.graphics();
      this.centerLine.lineStyle(2, 0x7c3aed, 0.4);
      for (let y = 10; y < height; y += 24) {
        this.centerLine.lineBetween(cx, y, cx, y + 14);
      }

      // Center Circle
      this.centerLine.strokeCircle(cx, cy, 60);

      // Player 1 Paddle (Cyan - Left)
      this.p1 = this.add.rectangle(45, cy, 16, 95, 0x22d3ee);
      this.physics.add.existing(this.p1, true);

      // Player 2 / AI Paddle (Pink/Purple - Right)
      this.p2 = this.add.rectangle(width - 45, cy, 16, 95, 0xec4899);
      this.physics.add.existing(this.p2, true);

      // Neon Ball
      this.ball = this.add.rectangle(cx, cy, 16, 16, 0xffffff);
      this.physics.add.existing(this.ball);
      this.ball.body.setBounce(1.05, 1.05).setCollideWorldBounds(true);
      this.ball.body.setMaxVelocity(650, 650);

      // Keyboard Controls
      this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
      this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
      this.keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
      this.keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
      this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
      this.keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);

      // Collisions
      this.physics.add.collider(this.ball, this.p1, () => this.hitPaddle(this.p1, 0x22d3ee));
      this.physics.add.collider(this.ball, this.p2, () => this.hitPaddle(this.p2, 0xec4899));
      this.physics.world.on('worldbounds', () => this.playSound(240, 'square', 0.08));

      // HUD UI
      this.p1ScoreText = this.add.text(cx - 70, 45, '0', {
        fontFamily: '"Space Grotesk", sans-serif',
        fontSize: '44px',
        fontWeight: 'bold',
        color: '#22d3ee',
      }).setOrigin(0.5);

      this.p2ScoreText = this.add.text(cx + 70, 45, '0', {
        fontFamily: '"Space Grotesk", sans-serif',
        fontSize: '44px',
        fontWeight: 'bold',
        color: '#ec4899',
      }).setOrigin(0.5);

      this.p1Label = this.add.text(cx - 70, 85, 'P1 (W/S)', {
        fontFamily: 'monospace',
        fontSize: '11px',
        color: '#22d3ee',
      }).setOrigin(0.5);

      this.p2Label = this.add.text(cx + 70, 85, this.isTwoPlayer ? 'P2 (↑/↓)' : 'CPU (AI)', {
        fontFamily: 'monospace',
        fontSize: '11px',
        color: '#ec4899',
      }).setOrigin(0.5);

      // Mode Switch Interactive Button (Top Center)
      this.modeBtn = this.add.text(cx, 22, this.isTwoPlayer ? '🎮 2-PLAYER VERSUS MODE' : '🤖 1-PLAYER VS CPU', {
        fontFamily: '"Space Grotesk", sans-serif',
        fontSize: '12px',
        fontWeight: 'bold',
        color: '#ffffff',
        backgroundColor: '#1f1a3a',
        padding: { x: 14, y: 5 },
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

      this.modeBtn.on('pointerdown', () => this.toggleMode());

      // Helper Text at bottom
      this.helpText = this.add.text(cx, height - 20, 'Press [M] to Toggle 1P/2P Mode · First to 5 Wins', {
        fontFamily: 'monospace',
        fontSize: '11px',
        color: '#6b7280',
      }).setOrigin(0.5);

      // Victory Banner (Hidden initially)
      this.banner = this.add.text(cx, cy, '', {
        fontFamily: '"Space Grotesk", sans-serif',
        fontSize: '36px',
        fontWeight: 'bold',
        color: '#ffffff',
        align: 'center',
        backgroundColor: 'rgba(10, 10, 20, 0.95)',
        padding: { x: 24, y: 16 },
      }).setOrigin(0.5).setVisible(false);

      this.resetBall();
    }

    toggleMode() {
      this.isTwoPlayer = !this.isTwoPlayer;
      this.playSound(520, 'sine', 0.15);
      this.modeBtn.setText(this.isTwoPlayer ? '🎮 2-PLAYER VERSUS MODE' : '🤖 1-PLAYER VS CPU');
      this.p2Label.setText(this.isTwoPlayer ? 'P2 (↑/↓)' : 'CPU (AI)');
      this.p2Label.setColor(this.isTwoPlayer ? '#ec4899' : '#a855f7');
    }

    hitPaddle(paddle, color) {
      this.playSound(480, 'square', 0.1);
      this.ball.setFillStyle(color);

      // Add English spin based on impact point
      const deltaY = this.ball.y - paddle.y;
      this.ball.body.velocity.y += deltaY * 4.5;
    }

    resetBall() {
      const cx = this.cameras.main.width / 2;
      const cy = this.cameras.main.height / 2;
      this.ball.setPosition(cx, cy);
      this.ball.setFillStyle(0xffffff);

      const dirX = Math.random() > 0.5 ? 1 : -1;
      const dirY = (Math.random() - 0.5) * 0.8;
      const speed = 320;
      this.ball.body.setVelocity(dirX * speed, dirY * speed);
    }

    playSound(freq, type, duration) {
      if (!this.audioCtx) return;
      try {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
        gain.gain.setValueAtTime(0.03, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start();
        osc.stop(this.audioCtx.currentTime + duration);
      } catch {}
    }

    update() {
      // Toggle mode key
      if (Phaser.Input.Keyboard.JustDown(this.keyM)) {
        this.toggleMode();
      }

      if (this.isGameOver) {
        if (Phaser.Input.Keyboard.JustDown(this.keySpace)) {
          this.scene.restart();
        }
        return;
      }

      const paddleSpeed = 6.5;

      // 1. Control Left Paddle (Player 1)
      // W/S or (if 1P mode, also Up/Down)
      if (this.keyW.isDown || (!this.isTwoPlayer && this.keyUp.isDown)) {
        this.p1.y = Math.max(50, this.p1.y - paddleSpeed);
      } else if (this.keyS.isDown || (!this.isTwoPlayer && this.keyDown.isDown)) {
        this.p1.y = Math.min(this.cameras.main.height - 50, this.p1.y + paddleSpeed);
      }
      this.p1.body.updateFromGameObject();

      // 2. Control Right Paddle (Player 2 or AI)
      if (this.isTwoPlayer) {
        // Player 2 Manual Arrow keys
        if (this.keyUp.isDown) {
          this.p2.y = Math.max(50, this.p2.y - paddleSpeed);
        } else if (this.keyDown.isDown) {
          this.p2.y = Math.min(this.cameras.main.height - 50, this.p2.y + paddleSpeed);
        }
      } else {
        // CPU AI Tracking
        const aiSpeed = 3.6;
        if (this.ball.y < this.p2.y - 12) {
          this.p2.y = Math.max(50, this.p2.y - aiSpeed);
        } else if (this.ball.y > this.p2.y + 12) {
          this.p2.y = Math.min(this.cameras.main.height - 50, this.p2.y + aiSpeed);
        }
      }
      this.p2.body.updateFromGameObject();

      // 3. Goal Checks
      const width = this.cameras.main.width;
      if (this.ball.x < -10) {
        // P2 / AI scores
        this.score.p2++;
        this.p2ScoreText.setText(String(this.score.p2));
        this.playSound(180, 'sawtooth', 0.4);
        this.checkWinCondition();
        if (!this.isGameOver) this.resetBall();
      } else if (this.ball.x > width + 10) {
        // P1 scores
        this.score.p1++;
        this.p1ScoreText.setText(String(this.score.p1));
        this.playSound(620, 'sine', 0.4);
        this.checkWinCondition();
        if (!this.isGameOver) this.resetBall();
      }
    }

    checkWinCondition() {
      const maxScore = 5;
      if (this.score.p1 >= maxScore || this.score.p2 >= maxScore) {
        this.isGameOver = true;
        this.ball.body.setVelocity(0, 0);

        if (this.score.p1 >= maxScore) {
          this.winner = 'PLAYER 1';
          this.banner.setText('🏆 PLAYER 1 WINS!\n\nPress SPACE for Rematch');
          this.banner.setColor('#22d3ee');
          if (this.emitAchievement) {
            this.emitAchievement('first-win');
          }
        } else {
          this.winner = this.isTwoPlayer ? 'PLAYER 2' : 'CPU BOT';
          this.banner.setText(`🏆 ${this.winner} WINS!\n\nPress SPACE for Rematch`);
          this.banner.setColor('#ec4899');
        }

        this.banner.setVisible(true);
        this.playSound(880, 'sine', 0.8);
      }
    }
  };
}
