import { createBaseGameScene } from '../../scenes/BaseGameScene.js';

export function createDinoRunScene(Phaser) {
    return class DinoRunScene extends createBaseGameScene(Phaser, 'DinoRunScene') {
    constructor() {
        super();
        this.audioCtx = null;
    }

    create() {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        this.cameras.main.setBackgroundColor('#eeeeee');

        this.ground = this.add.rectangle(400, 500, 800, 20, 0x555555);
        this.physics.add.existing(this.ground, true);

        this.dino = this.add.rectangle(100, 470, 40, 40, 0x333333);
        this.physics.add.existing(this.dino);
        this.dino.body.gravity.y = 1500;

        this.physics.add.collider(this.dino, this.ground);

        this.obstacles = this.physics.add.group();
        
        this.input.on('pointerdown', this.jump, this);
        this.input.keyboard.on('keydown-SPACE', this.jump, this);
        this.input.keyboard.on('keydown-UP', this.jump, this);

        this.time.addEvent({ delay: 1500, callback: this.addObstacle, callbackScope: this, loop: true });

        this.physics.add.overlap(this.dino, this.obstacles, this.gameOver, null, this);

        this.score = 0;
        this.scoreText = this.add.text(20, 20, 'Score: 0', { fontSize: '32px', fill: '#333' });
        this.time.addEvent({ delay: 100, callback: this.addScore, callbackScope: this, loop: true });
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

    jump() {
        if (this.dino.body.touching.down) {
            this.dino.body.velocity.y = -600;
            this.playSound(400, 'square', 0.1);
        }
    }

    addObstacle() {
        let obs = this.add.rectangle(850, 470, 20, 40, 0x00aa00);
        this.physics.add.existing(obs);
        obs.body.velocity.x = -300;
        obs.body.allowGravity = false;
        this.obstacles.add(obs);
    }

    addScore() {
        this.score++;
        this.scoreText.setText('Score: ' + this.score);
        if (this.score % 100 === 0) {
            this.playSound(800, 'sine', 0.1);
        }
        if (this.score === 200 && this.emitAchievement) {
            this.emitAchievement('first-win');
        }
    }

    update() {
        this.obstacles.getChildren().forEach(obs => {
            if (obs.x < -20) obs.destroy();
        });
    }

    gameOver() {
        this.playSound(150, 'sawtooth', 0.5);
        this.scene.restart();
    }
};
}
