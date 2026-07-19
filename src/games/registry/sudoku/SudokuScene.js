import { createBaseGameScene } from '../../scenes/BaseGameScene.js';

export function createSudokuScene(Phaser) {
    return class SudokuScene extends createBaseGameScene(Phaser, 'SudokuScene') {
    constructor() {
        super();
        this.grid = [];
        this.cells = [];
        this.selected = null;
        this.audioCtx = null;
    }

    create() {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        this.cameras.main.setBackgroundColor('#ffffff');
        
        let startX = 200, startY = 100, size = 40;
        
        // Very simple partial grid for demonstration (0 = empty)
        const puzzle = [
            [5,3,0,0,7,0,0,0,0],
            [6,0,0,1,9,5,0,0,0],
            [0,9,8,0,0,0,0,6,0],
            [8,0,0,0,6,0,0,0,3],
            [4,0,0,8,0,3,0,0,1],
            [7,0,0,0,2,0,0,0,6],
            [0,6,0,0,0,0,2,8,0],
            [0,0,0,4,1,9,0,0,5],
            [0,0,0,0,8,0,0,7,9]
        ];

        for (let r = 0; r < 9; r++) {
            this.grid[r] = [];
            this.cells[r] = [];
            for (let c = 0; c < 9; c++) {
                this.grid[r][c] = puzzle[r][c];
                let rect = this.add.rectangle(startX + c * size, startY + r * size, size, size).setInteractive().setStrokeStyle(1, 0x000000);
                if (c % 3 === 2) rect.setStrokeStyle(2, 0x000000);
                if (r % 3 === 2) rect.setStrokeStyle(2, 0x000000);
                
                let textStr = puzzle[r][c] !== 0 ? puzzle[r][c].toString() : '';
                let text = this.add.text(startX + c * size, startY + r * size, textStr, { fontSize: '20px', fill: puzzle[r][c] !== 0 ? '#000' : '#00f' }).setOrigin(0.5);
                this.cells[r][c] = { rect, text, fixed: puzzle[r][c] !== 0 };
                
                rect.on('pointerdown', () => {
                    if (this.selected) this.selected.rect.setFillStyle();
                    if (!this.cells[r][c].fixed) {
                        this.selected = { r, c, rect };
                        rect.setFillStyle(0xddddff);
                        this.playSound(400, 'square', 0.05);
                    }
                });
            }
        }
        
        this.input.keyboard.on('keydown', (e) => {
            if (this.selected && e.key >= '1' && e.key <= '9') {
                this.grid[this.selected.r][this.selected.c] = parseInt(e.key);
                this.cells[this.selected.r][this.selected.c].text.setText(e.key);
                this.playSound(600, 'sine', 0.1);
                this.checkWin();
            }
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

    checkWin() {
        let complete = true;
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (this.grid[r][c] === 0) complete = false;
            }
        }
        if (complete) {
            this.playSound(800, 'triangle', 0.5);
            this.add.text(400, 50, 'You Win!', { fontSize: '32px', fill: '#0a0' }).setOrigin(0.5);
            if (this.emitAchievement) this.emitAchievement('first-win');
        }
    }
};
}
