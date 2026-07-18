import { createBaseGameScene } from '../../scenes/BaseGameScene.js';

export function createBreakoutScene(Phaser) {
    return class BreakoutScene extends createBaseGameScene(Phaser, 'BreakoutScene') {
    constructor() {
        super();
        this.audioCtx = null;
    }

    create() {
        super.create();
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        this.physics.world.setBoundsCollision(true, true, true, false);

        this.paddle = this.add.rectangle(400, 550, 100, 20, 0xffffff);
        this.physics.add.existing(this.paddle, true);

        this.ball = this.add.rectangle(400, 500, 15, 15, 0xffffff);
        this.physics.add.existing(this.ball);
        this.ball.body.setCollideWorldBounds(true).setBounce(1, 1);
        this.ball.body.setVelocity(200, -200);
        this.ball.body.onWorldBounds = true;

        this.bricks = this.physics.add.staticGroup();
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 10; j++) {
                let color = [0xff0000, 0xff8800, 0xffff00, 0x00ff00, 0x0000ff][i];
                let brick = this.add.rectangle(80 + j * 70, 80 + i * 30, 60, 20, color);
                this.bricks.add(brick);
            }
        }

        this.physics.add.collider(this.ball, this.paddle, this.hitPaddle, null, this);
        this.physics.add.collider(this.ball, this.bricks, this.hitBrick, null, this);
        this.physics.world.on('worldbounds', (body, up, down, left, right) => {
            if (up || left || right) this.playSound(220, 'square', 0.1);
        });

        this.input.on('pointermove', (pointer) => {
            this.paddle.x = Phaser.Math.Clamp(pointer.x, 50, this.cameras.main.width - 50);
            this.paddle.body.updateFromGameObject();
        });
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

    hitPaddle(ball, paddle) {
        this.playSound(440, 'square', 0.1);
        let diff = ball.x - paddle.x;
        ball.body.setVelocityX(10 * diff);
    }

    hitBrick(ball, brick) {
        this.playSound(600, 'sine', 0.1);
        brick.destroy();
        if (this.bricks.countActive() === 0) {
            this.ball.body.setVelocity(0, 0);
            this.add.text(400, 300, 'You Win!', { fontSize: '48px', fill: '#fff' }).setOrigin(0.5);
            if (this.emitAchievement) this.emitAchievement('first-win');
        }
    }

    update() {
        if (this.ball.y > this.cameras.main.height) {
            this.playSound(150, 'sawtooth', 0.5);
            this.scene.restart();
        }
    }
};
}
