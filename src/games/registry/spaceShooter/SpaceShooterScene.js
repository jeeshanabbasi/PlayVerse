import { createBaseGameScene } from '../../scenes/BaseGameScene.js';

export function createSpaceShooterScene(Phaser) {
    return class SpaceShooterScene extends createBaseGameScene(Phaser, 'SpaceShooterScene') {
    constructor() {
        super();
        this.audioCtx = null;
    }

    create() {
        super.create();
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        this.cameras.main.setBackgroundColor('#000022');

        this.player = this.add.triangle(400, 550, 0, 30, 15, 0, 30, 30, 0x00ffff);
        this.physics.add.existing(this.player);
        this.player.body.setCollideWorldBounds(true);

        this.bullets = this.physics.add.group();
        this.asteroids = this.physics.add.group();

        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.lastFired = 0;

        this.time.addEvent({ delay: 1000, callback: this.spawnAsteroid, callbackScope: this, loop: true });

        this.physics.add.overlap(this.bullets, this.asteroids, this.hitAsteroid, null, this);
        this.physics.add.overlap(this.player, this.asteroids, this.gameOver, null, this);

        this.score = 0;
        this.scoreText = this.add.text(20, 20, 'Score: 0', { fontSize: '24px', fill: '#fff' });
    }

    playSound(freq, type, duration) {
        if (!this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.00001, this.audioCtx.currentTime + duration);
        osc.stop(this.audioCtx.currentTime + duration);
    }

    spawnAsteroid() {
        let x = Phaser.Math.Between(50, 750);
        let ast = this.add.circle(x, -50, 20, 0xaaaaaa);
        this.physics.add.existing(ast);
        ast.body.velocity.y = Phaser.Math.Between(100, 200);
        this.asteroids.add(ast);
    }

    hitAsteroid(bullet, asteroid) {
        bullet.destroy();
        asteroid.destroy();
        this.playSound(200, 'noise', 0.1); // using sine since noise is hard, wait type='sawtooth'
        this.playSound(100, 'sawtooth', 0.1);
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);
        if (this.score === 100 && this.emitAchievement) {
            this.emitAchievement('first-win');
        }
    }

    update(time) {
        this.player.body.setVelocity(0);
        if (this.cursors.left.isDown) this.player.body.setVelocityX(-300);
        else if (this.cursors.right.isDown) this.player.body.setVelocityX(300);

        if (this.spaceBar.isDown && time > this.lastFired) {
            let bullet = this.add.rectangle(this.player.x, this.player.y - 20, 4, 10, 0xffff00);
            this.physics.add.existing(bullet);
            bullet.body.velocity.y = -400;
            this.bullets.add(bullet);
            this.playSound(800, 'square', 0.05);
            this.lastFired = time + 200;
        }

        this.bullets.getChildren().forEach(b => { if (b.y < 0) b.destroy(); });
        this.asteroids.getChildren().forEach(a => { if (a.y > 600) a.destroy(); });
    }

    gameOver() {
        this.playSound(150, 'sawtooth', 0.5);
        this.scene.restart();
    }
};
}
