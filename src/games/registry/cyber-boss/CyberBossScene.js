import { createBaseGameScene } from '../../scenes/BaseGameScene.js';

export function createCyberBossScene(Phaser) {
  return class CyberBossScene extends createBaseGameScene(Phaser, 'CyberBossScene') {
    constructor() {
      super();
      this.audioCtx = null;
    }

    create() {
      const width = this.cameras.main.width;
      const height = this.cameras.main.height;
      const cx = width / 2;

      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      this.physics.world.setBoundsCollision(true, true, false, false);

      this.gameState = 'playing'; // 'playing', 'won', 'lost'
      this.score = 0;
      this.ultimateCharge = 0;

      // 1. Starfield Background
      this.stars = [];
      const starGraphics = this.add.graphics();
      for (let i = 0; i < 70; i++) {
        this.stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          speed: 1 + Math.random() * 3,
          size: 1 + Math.random() * 2,
        });
      }
      this.starGraphics = starGraphics;

      // 2. Player Drone
      this.playerMaxHp = 100;
      this.playerHp = 100;
      this.tookDamage = false;

      this.player = this.add.container(cx, height - 70);
      const playerBody = this.add.polygon(0, 0, [0, -18, -16, 14, 0, 8, 16, 14], 0x22d3ee);
      const playerCore = this.add.circle(0, 2, 4, 0xffffff);
      this.player.add([playerBody, playerCore]);
      this.physics.add.existing(this.player);
      this.player.body.setCollideWorldBounds(true);
      this.player.body.setSize(32, 32);

      // Player Lasers Group
      this.playerLasers = this.physics.add.group();
      this.lastShotTime = 0;

      // 3. Boss "Overlord Zero"
      this.bossMaxHp = 1000;
      this.bossHp = 1000;
      this.bossPhase = 1;

      this.boss = this.add.container(cx, 120);
      const bossHull = this.add.polygon(0, 0, [-45, -20, 45, -20, 60, 10, 0, 35, -60, 10], 0x7c3aed);
      const bossEye = this.add.circle(0, 5, 12, 0xec4899);
      const bossEyeInner = this.add.circle(0, 5, 5, 0xffffff);
      this.boss.add([bossHull, bossEye, bossEyeInner]);
      this.physics.add.existing(this.boss);
      this.boss.body.setSize(100, 55);

      this.bossEye = bossEye;
      this.bossHull = bossHull;
      this.bossLasers = this.physics.add.group();
      this.lastBossAttackTime = 0;
      this.bossMoveAngle = 0;

      // 4. Collisions
      this.physics.add.overlap(this.playerLasers, this.boss, (laser, boss) => {
        laser.destroy();
        this.hitBoss(25);
      });

      this.physics.add.overlap(this.bossLasers, this.player, (laser, player) => {
        laser.destroy();
        this.hitPlayer(20);
      });

      // 5. Controls
      this.cursors = this.input.keyboard.createCursorKeys();
      this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
      this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
      this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
      this.keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

      // 6. Cyber HUD UI
      // Boss Health Bar (Top)
      this.add.text(cx, 22, '⚔️ OVERLORD ZERO [AI CORE]', {
        fontFamily: '"Space Grotesk", sans-serif',
        fontSize: '13px',
        fontWeight: 'bold',
        color: '#ec4899',
      }).setOrigin(0.5);

      this.bossHpBg = this.add.rectangle(cx, 42, 340, 12, 0x1f1a3a);
      this.bossHpBar = this.add.rectangle(cx - 170, 42, 340, 12, 0xec4899).setOrigin(0, 0.5);

      // Player Shield Bar (Bottom Left)
      this.playerHpText = this.add.text(25, height - 32, 'SHIELD: 100%', {
        fontFamily: 'monospace',
        fontSize: '11px',
        fontWeight: 'bold',
        color: '#22d3ee',
      });

      // Ultimate Charge (Bottom Right)
      this.ultText = this.add.text(width - 25, height - 32, 'ION CANNON [E]: 0%', {
        fontFamily: 'monospace',
        fontSize: '11px',
        fontWeight: 'bold',
        color: '#f59e0b',
      }).setOrigin(1, 0);

      // Game Over / Victory Modal (Hidden initially)
      this.statusBanner = this.add.text(cx, height / 2, '', {
        fontFamily: '"Space Grotesk", sans-serif',
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#ffffff',
        align: 'center',
        backgroundColor: 'rgba(10, 10, 25, 0.95)',
        padding: { x: 30, y: 20 },
      }).setOrigin(0.5).setVisible(false);
    }

    hitBoss(damage) {
      if (this.gameState !== 'playing') return;

      this.bossHp = Math.max(0, this.bossHp - damage);
      this.score += damage * 10;
      this.reportScore(this.score);

      // Update ultimate charge
      this.ultimateCharge = Math.min(100, this.ultimateCharge + 4);
      this.ultText.setText(this.ultimateCharge >= 100 ? '🔥 ION CANNON [E]: READY!' : `ION CANNON [E]: ${this.ultimateCharge}%`);
      this.ultText.setColor(this.ultimateCharge >= 100 ? '#22d3ee' : '#f59e0b');

      // Update Boss HP bar
      const pct = this.bossHp / this.bossMaxHp;
      this.bossHpBar.width = Math.max(0, 340 * pct);

      this.playSound(260 + Math.random() * 100, 'square', 0.05);

      // Phase transitions
      if (pct <= 0.3 && this.bossPhase < 3) {
        this.bossPhase = 3;
        this.bossEye.setFillStyle(0xff0044);
        this.bossHull.setFillStyle(0xb91c1c);
        this.playSound(140, 'sawtooth', 0.5);
      } else if (pct <= 0.65 && this.bossPhase < 2) {
        this.bossPhase = 2;
        this.bossEye.setFillStyle(0xf59e0b);
        this.bossHull.setFillStyle(0xd97706);
        this.playSound(200, 'sawtooth', 0.4);
      }

      // Check Boss Defeat
      if (this.bossHp <= 0) {
        this.triggerVictory();
      }
    }

    hitPlayer(damage) {
      if (this.gameState !== 'playing') return;

      this.tookDamage = true;
      this.playerHp = Math.max(0, this.playerHp - damage);
      this.playerHpText.setText(`SHIELD: ${this.playerHp}%`);
      this.playerHpText.setColor(this.playerHp < 30 ? '#ef4444' : '#22d3ee');

      this.playSound(120, 'sawtooth', 0.25);

      if (this.playerHp <= 0) {
        this.triggerDefeat();
      }
    }

    fireIonCannon() {
      if (this.ultimateCharge < 100 || this.gameState !== 'playing') return;

      this.ultimateCharge = 0;
      this.ultText.setText('ION CANNON [E]: 0%');
      this.ultText.setColor('#f59e0b');

      // Giant Beam FX
      const beam = this.add.rectangle(this.player.x, this.cameras.main.height / 2, 28, this.cameras.main.height, 0x22d3ee, 0.85);
      this.playSound(880, 'sine', 0.6);

      // Huge Boss Damage
      this.hitBoss(280);

      this.tweens.add({
        targets: beam,
        alpha: 0,
        width: 48,
        duration: 350,
        onComplete: () => beam.destroy(),
      });

      if (this.emitAchievement) {
        this.emitAchievement('ultimate-unleashed');
      }
    }

    triggerVictory() {
      this.gameState = 'won';
      this.boss.setVisible(false);
      this.statusBanner.setText('👑 OVERLORD ZERO DESTROYED!\n\n🏆 VICTORY ACHIEVED\nPress [SPACE] to Rematch');
      this.statusBanner.setColor('#22d3ee');
      this.statusBanner.setVisible(true);

      this.playSound(880, 'sine', 0.8);

      if (this.emitAchievement) {
        this.emitAchievement('boss-slayer');
        if (!this.tookDamage) {
          this.emitAchievement('flawless-victory');
        }
      }

      window.dispatchEvent(
        new CustomEvent('playverse_achievement_celebration', {
          detail: {
            title: 'Boss Slayer ⚔️',
            description: 'You defeated the legendary AI Overlord Zero!',
            icon: '👑',
            xp: 1500,
            isRecord: true,
          },
        })
      );
    }

    triggerDefeat() {
      this.gameState = 'lost';
      this.player.setVisible(false);
      this.statusBanner.setText('💀 SYSTEM COMPROMISED\n\nCORE BREACHED\nPress [SPACE] to Retry');
      this.statusBanner.setColor('#ef4444');
      this.statusBanner.setVisible(true);

      this.playSound(100, 'sawtooth', 0.7);
    }

    playSound(freq, type, duration) {
      if (!this.audioCtx) return;
      try {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
        gain.gain.setValueAtTime(0.025, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start();
        osc.stop(this.audioCtx.currentTime + duration);
      } catch {}
    }

    update(time) {
      if (this.gameState !== 'playing') {
        if (Phaser.Input.Keyboard.JustDown(this.keySpace) || Phaser.Input.Keyboard.JustDown(this.keyR)) {
          this.scene.restart();
        }
        return;
      }

      const width = this.cameras.main.width;
      const height = this.cameras.main.height;

      // 1. Update Starfield
      this.starGraphics.clear();
      this.starGraphics.fillStyle(0xffffff, 0.8);
      this.stars.forEach((s) => {
        s.y += s.speed;
        if (s.y > height) {
          s.y = 0;
          s.x = Math.random() * width;
        }
        this.starGraphics.fillCircle(s.x, s.y, s.size);
      });

      // 2. Player Movement
      const moveSpeed = 6.5;
      if (this.cursors.left.isDown || this.keyA.isDown) {
        this.player.x = Math.max(30, this.player.x - moveSpeed);
      } else if (this.cursors.right.isDown || this.keyD.isDown) {
        this.player.x = Math.min(width - 30, this.player.x + moveSpeed);
      }
      this.player.body.updateFromGameObject();

      // 3. Player Shooting
      if (this.keySpace.isDown && time > this.lastShotTime + 170) {
        this.lastShotTime = time;
        // Dual laser projectiles
        [-10, 10].forEach((offset) => {
          const laser = this.add.rectangle(this.player.x + offset, this.player.y - 15, 4, 16, 0x22d3ee);
          this.physics.add.existing(laser);
          laser.body.setVelocityY(-550);
          this.playerLasers.add(laser);
        });
        this.playSound(680, 'sine', 0.05);
      }

      // 4. Player Ultimate Ion Cannon
      if (Phaser.Input.Keyboard.JustDown(this.keyE)) {
        this.fireIonCannon();
      }

      // 5. Boss Sway Movement
      this.bossMoveAngle += 0.035 * (this.bossPhase === 3 ? 1.8 : 1);
      this.boss.x = width / 2 + Math.sin(this.bossMoveAngle) * (width * 0.35);
      this.boss.body.updateFromGameObject();

      // 6. Boss Attack Patterns
      const attackCooldown = this.bossPhase === 3 ? 600 : this.bossPhase === 2 ? 900 : 1300;
      if (time > this.lastBossAttackTime + attackCooldown) {
        this.lastBossAttackTime = time;

        if (this.bossPhase === 1) {
          // Triple spread lasers
          [-25, 0, 25].forEach((angle) => {
            const bLaser = this.add.circle(this.boss.x, this.boss.y + 20, 6, 0xec4899);
            this.physics.add.existing(bLaser);
            bLaser.body.setVelocity(angle * 4, 280);
            this.bossLasers.add(bLaser);
          });
        } else if (this.bossPhase === 2) {
          // 4-orb EMP barrage
          [-40, -15, 15, 40].forEach((angle) => {
            const bLaser = this.add.circle(this.boss.x, this.boss.y + 20, 8, 0xf59e0b);
            this.physics.add.existing(bLaser);
            bLaser.body.setVelocity(angle * 5, 340);
            this.bossLasers.add(bLaser);
          });
        } else {
          // Phase 3: Enraged 5-way plasma storm!
          [-50, -25, 0, 25, 50].forEach((angle) => {
            const bLaser = this.add.circle(this.boss.x, this.boss.y + 20, 7, 0xef4444);
            this.physics.add.existing(bLaser);
            bLaser.body.setVelocity(angle * 6, 420);
            this.bossLasers.add(bLaser);
          });
        }
        this.playSound(320, 'square', 0.08);
      }

      // Cleanup out-of-bounds lasers
      this.playerLasers.getChildren().forEach((l) => {
        if (l.y < -20) l.destroy();
      });
      this.bossLasers.getChildren().forEach((l) => {
        if (l.y > height + 20) l.destroy();
      });
    }
  };
}
