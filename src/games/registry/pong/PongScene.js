import { createBaseGameScene } from '../../scenes/BaseGameScene.js';

export function createPongScene(Phaser) {
    return class PongScene extends createBaseGameScene(Phaser, 'PongScene') {
    constructor() {
        super();
        this.audioCtx = null;
    }
    
    create() {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        this.physics.world.setBoundsCollision(false, false, true, true);
        
        let cx = this.cameras.main.width / 2;
        let cy = this.cameras.main.height / 2;
        
        this.player = this.add.rectangle(50, cy, 20, 100, 0xffffff);
        this.physics.add.existing(this.player, true);
        
        this.ai = this.add.rectangle(this.cameras.main.width - 50, cy, 20, 100, 0xffffff);
        this.physics.add.existing(this.ai, true);
        
        this.ball = this.add.rectangle(cx, cy, 20, 20, 0xffffff);
        this.physics.add.existing(this.ball);
        this.ball.body.setBounce(1, 1).setCollideWorldBounds(true);
        this.resetBall();
        
        this.cursors = this.input.keyboard.createCursorKeys();
        
        this.physics.add.collider(this.ball, this.player, () => this.playSound(440, 'square', 0.1));
        this.physics.add.collider(this.ball, this.ai, () => this.playSound(440, 'square', 0.1));
        this.ball.body.onWorldBounds = true;
        this.physics.world.on('worldbounds', () => this.playSound(220, 'square', 0.1));
        
        this.score = { player: 0, ai: 0 };
        this.scoreText = this.add.text(cx, 50, '0 - 0', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
    }
    
    resetBall() {
        this.ball.setPosition(this.cameras.main.width/2, this.cameras.main.height/2);
        let speedX = 300 * (Math.random() > 0.5 ? 1 : -1);
        let speedY = 300 * (Math.random() > 0.5 ? 1 : -1);
        this.ball.body.setVelocity(speedX, speedY);
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
    
    update() {
        if (this.cursors.up.isDown) {
            this.player.y -= 5;
        } else if (this.cursors.down.isDown) {
            this.player.y += 5;
        }
        this.player.body.updateFromGameObject();
        
        if (this.ball.y < this.ai.y) {
            this.ai.y -= 3;
        } else if (this.ball.y > this.ai.y) {
            this.ai.y += 3;
        }
        this.ai.body.updateFromGameObject();
        
        if (this.ball.x < 0) {
            this.score.ai++;
            this.scoreText.setText(`${this.score.player} - ${this.score.ai}`);
            this.resetBall();
            this.playSound(150, 'sawtooth', 0.5);
        } else if (this.ball.x > this.cameras.main.width) {
            this.score.player++;
            this.scoreText.setText(`${this.score.player} - ${this.score.ai}`);
            this.resetBall();
            this.playSound(600, 'sine', 0.5);
            if (this.score.player === 5 && this.emitAchievement) {
                this.emitAchievement('first-win');
            }
        }
    }
};
}
