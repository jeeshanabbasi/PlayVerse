import { createBaseGameScene } from '../../scenes/BaseGameScene.js';

export function createSpaceInvadersScene(Phaser) {
  return class SpaceInvadersScene extends createBaseGameScene(Phaser, 'SpaceInvadersScene') {
    constructor() {
      super();
      this.player = null;
      this.cursors = null;
      this.lasers = null;
      this.invaders = null;
      this.invaderLasers = null;
      this.shields = null;
      
      this.score = 0;
      this.scoreText = null;
      
      this.lives = 3;
      this.livesText = null;
      
      this.gameOverText = null;
      
      this.invaderDirection = 1;
      this.invaderSpeed = 40;
      this.invaderTimer = null;
      this.audioCtx = null;
    }

    create() {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      this.cameras.main.setBackgroundColor('#05050c');

      // Score Text
      this.scoreText = this.add.text(16, 16, 'Score: 0', {
        fontSize: '18px',
        fill: '#ffffff',
        fontFamily: 'monospace',
      });

      // Lives Text
      this.livesText = this.add.text(800, 16, 'Lives: ❤️❤️❤️', {
        fontSize: '18px',
        fill: '#ffffff',
        fontFamily: 'monospace',
      });

      // Player Ship (Green Vector Triangle)
      this.player = this.add.polygon(480, 500, [0, -15, -15, 10, 15, 10], 0x00ff66);
      this.physics.add.existing(this.player);
      this.player.body.setCollideWorldBounds(true);

      // Projects
      this.lasers = this.physics.add.group();
      this.invaderLasers = this.physics.add.group();

      // Spawn Invaders Grid (5 rows, 8 columns)
      this.invaders = this.physics.add.group();
      this.spawnInvaders();

      // Spawn Defense Shields (3 barriers)
      this.shields = this.physics.add.staticGroup();
      this.spawnShields();

      // Controls
      this.cursors = this.input.keyboard.createCursorKeys();
      this.input.keyboard.on('keydown-SPACE', () => this.fireLaser());

      // Collisions
      this.physics.add.collider(this.lasers, this.invaders, this.hitInvader, null, this);
      this.physics.add.collider(this.invaderLasers, this.player, this.hitPlayer, null, this);
      this.physics.add.collider(this.lasers, this.shields, this.hitShield, null, this);
      this.physics.add.collider(this.invaderLasers, this.shields, this.hitShield, null, this);

      // Invaders Tick Timer
      this.invaderTimer = this.time.addEvent({
        delay: 800,
        callback: this.moveInvaders,
        callbackScope: this,
        loop: true,
      });

      // Alien Auto Shooting Timer
      this.time.addEvent({
        delay: 1500,
        callback: this.alienShoot,
        callbackScope: this,
        loop: true,
      });
    }

    spawnInvaders() {
      const colors = [0xff3366, 0xff9933, 0xffff33, 0x33ccff, 0xcc33ff];
      for (let row = 0; row < 5; row++) {
        const color = colors[row];
        for (let col = 0; col < 8; col++) {
          const invader = this.add.rectangle(180 + col * 80, 80 + row * 45, 30, 20, color);
          this.physics.add.existing(invader);
          invader.body.setImmovable(true);
          this.invaders.add(invader);
        }
      }
    }

    spawnShields() {
      // 3 barrier coordinates
      const barrierXCoords = [240, 480, 720];
      barrierXCoords.forEach((bx) => {
        // Build barrier using 4x4 small pixel block tiles
        for (let r = 0; r < 4; r++) {
          for (let c = 0; c < 6; c++) {
            const tile = this.add.rectangle(bx - 40 + c * 16, 420 + r * 12, 14, 10, 0x3399ff);
            this.shields.add(tile);
          }
        }
      });
    }

    fireLaser() {
      if (this.lives <= 0 || this.invaders.countActive() === 0) return;
      
      const laser = this.add.rectangle(this.player.x, this.player.y - 20, 4, 14, 0x00ff66);
      this.physics.add.existing(laser);
      laser.body.setVelocityY(-450);
      this.lasers.add(laser);

      this.playSound(660, 'sine', 0.08, 0.02); // Shoot sweep sound
    }

    alienShoot() {
      if (this.lives <= 0 || this.invaders.countActive() === 0) return;

      const activeAliens = this.invaders.getChildren().filter((a) => a.active);
      if (activeAliens.length === 0) return;

      // Pick a random invader to shoot
      const randomAlien = Phaser.Utils.Array.GetRandom(activeAliens);
      const laser = this.add.rectangle(randomAlien.x, randomAlien.y + 15, 4, 14, 0xff3333);
      this.physics.add.existing(laser);
      laser.body.setVelocityY(250);
      this.invaderLasers.add(laser);

      this.playSound(280, 'triangle', 0.12, 0.04);
    }

    moveInvaders() {
      if (this.lives <= 0 || this.invaders.countActive() === 0) return;

      let hitWall = false;
      const aliens = this.invaders.getChildren();

      aliens.forEach((alien) => {
        if (alien.active) {
          alien.x += this.invaderDirection * 15;
          if (alien.x >= 910 || alien.x <= 50) {
            hitWall = true;
          }
        }
      });

      // Simple walk ticking sweep
      this.playSound(110 + (30 * this.invaderDirection), 'square', 0.05, 0.005);

      if (hitWall) {
        this.invaderDirection *= -1;
        aliens.forEach((alien) => {
          if (alien.active) {
            alien.y += 24;
            // Check if invaders reached player level
            if (alien.y >= 480) {
              this.endGame(false);
            }
          }
        });
      }
    }

    hitInvader(laser, invader) {
      laser.destroy();
      invader.destroy();

      this.score += 10;
      this.scoreText.setText(`Score: ${this.score}`);
      this.playSound(380, 'sine', 0.1, 0.05);

      if (this.invaders.countActive() === 0) {
        this.endGame(true);
      }
    }

    hitPlayer(player, laser) {
      laser.destroy();
      this.lives--;
      
      const hearts = '❤️'.repeat(Math.max(0, this.lives));
      this.livesText.setText(`Lives: ${hearts || 'None'}`);
      
      this.playSound(180, 'sawtooth', 0.4, 0.15); // Explosion crash sweep

      if (this.lives <= 0) {
        this.endGame(false);
      }
    }

    hitShield(laser, shieldTile) {
      laser.destroy();
      shieldTile.destroy();
      this.playSound(450, 'square', 0.04, 0.01);
    }

    endGame(win) {
      this.invaderTimer.destroy();
      this.player.body.setVelocity(0, 0);

      const message = win ? 'GALAXY CLEARED!' : 'GAME OVER';
      const color = win ? '#00ff66' : '#ff3333';

      this.gameOverText = this.add.text(480, 250, message, {
        fontSize: '48px',
        fill: color,
        fontFamily: 'monospace',
        fontWeight: 'bold',
      }).setOrigin(0.5);

      this.add.text(480, 310, 'Press R to Restart', {
        fontSize: '20px',
        fill: '#ffffff',
        fontFamily: 'monospace',
      }).setOrigin(0.5);

      // Handle scores and achievements
      if (win) {
        this.reportScore(this.score);
        this.unlockAchievement('first-win');
        if (this.lives === 3) {
          this.unlockAchievement('perfect-clear');
        }
      }

      this.input.keyboard.once('keydown-R', () => {
        this.scene.restart();
      });
    }

    update() {
      if (this.lives <= 0 || this.invaders.countActive() === 0) return;

      if (this.cursors.left.isDown) {
        this.player.body.setVelocityX(-320);
      } else if (this.cursors.right.isDown) {
        this.player.body.setVelocityX(320);
      } else {
        this.player.body.setVelocityX(0);
      }

      // Cleanup offscreen lasers
      this.lasers.getChildren().forEach((l) => {
        if (l.y < 0) l.destroy();
      });
      this.invaderLasers.getChildren().forEach((l) => {
        if (l.y > 540) l.destroy();
      });
    }

    playSound(freq, type, duration, gainVal = 0.02) {
      if (!this.audioCtx || this.audioCtx.state === 'suspended') return;
      try {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
        
        gain.gain.setValueAtTime(gainVal, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start();
        osc.stop(this.audioCtx.currentTime + duration);
      } catch {
        // ignore
      }
    }
  };
}
