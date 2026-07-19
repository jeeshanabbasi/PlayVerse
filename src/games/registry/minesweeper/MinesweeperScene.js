import { createBaseGameScene } from '../../scenes/BaseGameScene.js';

export function createMinesweeperScene(Phaser) {
    return class MinesweeperScene extends createBaseGameScene(Phaser, 'MinesweeperScene') {
    constructor() {
        super();
        this.rows = 8;
        this.cols = 8;
        this.mines = 10;
        this.grid = [];
        this.cells = [];
        this.audioCtx = null;
    }

    create() {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        this.cameras.main.setBackgroundColor('#bdbdbd');
        
        let startX = 200;
        let startY = 150;
        let size = 40;

        for (let r = 0; r < this.rows; r++) {
            this.grid[r] = [];
            this.cells[r] = [];
            for (let c = 0; c < this.cols; c++) {
                this.grid[r][c] = { mine: false, revealed: false, count: 0 };
                let rect = this.add.rectangle(startX + c * size, startY + r * size, size - 2, size - 2, 0xaaaaaa).setInteractive();
                let text = this.add.text(startX + c * size, startY + r * size, '', { fill: '#000' }).setOrigin(0.5);
                this.cells[r][c] = { rect, text };
                
                rect.on('pointerdown', () => this.reveal(r, c));
            }
        }
        
        let minesPlaced = 0;
        while(minesPlaced < this.mines) {
            let r = Math.floor(Math.random() * this.rows);
            let c = Math.floor(Math.random() * this.cols);
            if (!this.grid[r][c].mine) {
                this.grid[r][c].mine = true;
                minesPlaced++;
            }
        }
        
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (!this.grid[r][c].mine) {
                    let count = 0;
                    for (let i = -1; i <= 1; i++) {
                        for (let j = -1; j <= 1; j++) {
                            let nr = r + i, nc = c + j;
                            if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols && this.grid[nr][nc].mine) {
                                count++;
                            }
                        }
                    }
                    this.grid[r][c].count = count;
                }
            }
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

    reveal(r, c) {
        if (r < 0 || r >= this.rows || c < 0 || c >= this.cols || this.grid[r][c].revealed) return;
        
        this.grid[r][c].revealed = true;
        this.cells[r][c].rect.setFillStyle(0xdddddd);
        this.playSound(600, 'square', 0.05);

        if (this.grid[r][c].mine) {
            this.cells[r][c].text.setText('M').setColor('#f00');
            this.playSound(150, 'sawtooth', 0.5);
            this.add.text(400, 50, 'Game Over', { fontSize: '32px', fill: '#f00' }).setOrigin(0.5);
            return;
        }

        if (this.grid[r][c].count > 0) {
            this.cells[r][c].text.setText(this.grid[r][c].count.toString());
        } else {
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    this.reveal(r + i, c + j);
                }
            }
        }
        this.checkWin();
    }
    
    checkWin() {
        let unrevealedSafe = 0;
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (!this.grid[r][c].revealed && !this.grid[r][c].mine) {
                    unrevealedSafe++;
                }
            }
        }
        if (unrevealedSafe === 0) {
            this.playSound(800, 'sine', 0.5);
            this.add.text(400, 50, 'You Win!', { fontSize: '32px', fill: '#0f0' }).setOrigin(0.5);
            if (this.emitAchievement) this.emitAchievement('first-win');
        }
    }
};
}
