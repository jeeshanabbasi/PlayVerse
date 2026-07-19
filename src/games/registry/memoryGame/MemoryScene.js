import { createBaseGameScene } from '../../scenes/BaseGameScene.js';

export function createMemoryScene(Phaser) {
    return class MemoryScene extends createBaseGameScene(Phaser, 'MemoryScene') {
    constructor() {
        super();
        this.cards = [];
        this.selectedCards = [];
        this.matches = 0;
        this.audioCtx = null;
    }

    create() {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        this.cameras.main.setBackgroundColor('#2d2d2d');
        const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff, 0xffffff, 0xff8800];
        let deck = [...colors, ...colors];
        Phaser.Utils.Array.Shuffle(deck);

        let startX = this.cameras.main.width / 2 - 150;
        let startY = this.cameras.main.height / 2 - 150;

        for (let i = 0; i < 16; i++) {
            let row = Math.floor(i / 4);
            let col = i % 4;
            let card = this.add.rectangle(startX + col * 100, startY + row * 100, 80, 80, 0x888888).setInteractive();
            card.cardColor = deck[i];
            card.isFlipped = false;
            card.on('pointerdown', () => this.flipCard(card));
            this.cards.push(card);
        }
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

    flipCard(card) {
        if (card.isFlipped || this.selectedCards.length >= 2) return;
        this.playSound(400, 'sine', 0.1);
        card.setFillStyle(card.cardColor);
        card.isFlipped = true;
        this.selectedCards.push(card);

        if (this.selectedCards.length === 2) {
            this.time.delayedCall(1000, this.checkMatch, [], this);
        }
    }

    checkMatch() {
        let [c1, c2] = this.selectedCards;
        if (c1.cardColor === c2.cardColor) {
            this.playSound(600, 'square', 0.2);
            this.matches++;
            if (this.matches === 8) {
                this.playSound(800, 'triangle', 0.5);
                this.add.text(this.cameras.main.width/2, 50, 'You Win!', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
                this.emitAchievement && this.emitAchievement('first-win');
            }
        } else {
            this.playSound(200, 'sawtooth', 0.2);
            c1.setFillStyle(0x888888);
            c2.setFillStyle(0x888888);
            c1.isFlipped = false;
            c2.isFlipped = false;
        }
        this.selectedCards = [];
    }
};
}
