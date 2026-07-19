import { createBaseGameScene } from '../../scenes/BaseGameScene.js';

export function createFlappyBirdScene(Phaser) {
    return class FlappyBirdScene extends createBaseGameScene(Phaser, 'FlappyBirdScene') {
    constructor() {
        super();
        this.audioCtx = null;
    }

    create() {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        this.cameras.main.setBackgroundColor('#70c5ce');
        
        this.bird = this.add.rectangle(100, 300, 30, 30, 0xffff00);
        this.physics.add.existing(this.bird);
        this.bird.body.gravity.y = 1000;
        
        this.pipes = this.physics.add.group();
        this.score = 0;
        this.scoreText = this.add.text(this.cameras.main.width/2, 50, '0', { fontSize: '48px', fill: '#fff' }).setOrigin(0.5);
        
        this.input.on('pointerdown', this.flap, this);
        this.input.keyboard.on('keydown-SPACE', this.flap, this);
        
        this.time.addEvent({ delay: 1500, callback: this.addPipes, callbackScope: this, loop: true });
        
        this.physics.add.overlap(this.bird, this.pipes, this.gameOver, null, this);
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

    flap() {
        this.bird.body.velocity.y = -350;
        this.playSound(400, 'sine', 0.1);
    }

    addPipes() {
        let hole = Math.floor(Math.random() * 300) + 150;
        let topPipe = this.add.rectangle(this.cameras.main.width + 50, hole - 400, 50, 600, 0x00ff00);
        let bottomPipe = this.add.rectangle(this.cameras.main.width + 50, hole + 400, 50, 600, 0x00ff00);
        
        this.physics.add.existing(topPipe);
        this.physics.add.existing(bottomPipe);
        
        topPipe.body.allowGravity = false;
        bottomPipe.body.allowGravity = false;
        
        topPipe.body.velocity.x = -200;
        bottomPipe.body.velocity.x = -200;
        
        this.pipes.add(topPipe);
        this.pipes.add(bottomPipe);
        
        topPipe.passed = false;
    }

    update() {
        if (this.bird.y > this.cameras.main.height || this.bird.y < 0) {
            this.gameOver();
        }

        this.pipes.getChildren().forEach(pipe => {
            if (pipe.x < pipe.width && pipe.y < 0 && !pipe.passed) {
                pipe.passed = true;
                this.score++;
                this.scoreText.setText(this.score.toString());
                this.playSound(600, 'square', 0.1);
                if (this.score === 10 && this.emitAchievement) {
                    this.emitAchievement('first-win');
                }
            }
            if (pipe.x < -50) {
                pipe.destroy();
            }
        });
    }

    gameOver() {
        this.playSound(150, 'sawtooth', 0.5);
        this.scene.restart();
    }
};
}
