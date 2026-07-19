import { createBaseGameScene } from '../../scenes/BaseGameScene.js';

export function createTwentyFortyEightScene(Phaser) {
    return class TwentyFortyEightScene extends createBaseGameScene(Phaser, 'TwentyFortyEightScene') {
    constructor() {
        super();
        this.grid = [];
        this.tiles = [];
        this.audioCtx = null;
    }

    create() {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        this.cameras.main.setBackgroundColor('#bbada0');
        
        for (let i = 0; i < 4; i++) {
            this.grid[i] = [0, 0, 0, 0];
            this.tiles[i] = [null, null, null, null];
            for (let j = 0; j < 4; j++) {
                this.add.rectangle(200 + j * 100, 150 + i * 100, 90, 90, 0xcdc1b4);
            }
        }
        
        this.addTile();
        this.addTile();
        
        this.input.keyboard.on('keydown-LEFT', () => this.move('left'));
        this.input.keyboard.on('keydown-RIGHT', () => this.move('right'));
        this.input.keyboard.on('keydown-UP', () => this.move('up'));
        this.input.keyboard.on('keydown-DOWN', () => this.move('down'));
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

    addTile() {
        let empty = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.grid[i][j] === 0) empty.push({ r: i, c: j });
            }
        }
        if (empty.length > 0) {
            let pos = empty[Math.floor(Math.random() * empty.length)];
            this.grid[pos.r][pos.c] = Math.random() < 0.9 ? 2 : 4;
            this.drawGrid();
        }
    }

    drawGrid() {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.tiles[i][j]) {
                    this.tiles[i][j].rect.destroy();
                    this.tiles[i][j].text.destroy();
                    this.tiles[i][j] = null;
                }
                if (this.grid[i][j] > 0) {
                    let val = this.grid[i][j];
                    let color = val === 2 ? 0xeee4da : val === 4 ? 0xede0c8 : 0xf2b179;
                    let rect = this.add.rectangle(200 + j * 100, 150 + i * 100, 90, 90, color);
                    let text = this.add.text(200 + j * 100, 150 + i * 100, val.toString(), { fontSize: '32px', fill: '#000' }).setOrigin(0.5);
                    this.tiles[i][j] = { rect, text };
                }
            }
        }
    }

    move(dir) {
        let moved = false;
        let slide = (row) => {
            let arr = row.filter(val => val);
            let missing = 4 - arr.length;
            let zeros = Array(missing).fill(0);
            return arr.concat(zeros);
        };
        let combine = (row) => {
            for (let i = 0; i < 3; i++) {
                if (row[i] !== 0 && row[i] === row[i + 1]) {
                    row[i] *= 2;
                    row[i + 1] = 0;
                    this.playSound(600, 'sine', 0.1);
                    if (row[i] === 2048 && this.emitAchievement) this.emitAchievement('first-win');
                }
            }
            return row;
        };

        for (let i = 0; i < 4; i++) {
            let row = [];
            for (let j = 0; j < 4; j++) {
                row.push(dir === 'left' || dir === 'right' ? this.grid[i][j] : this.grid[j][i]);
            }
            if (dir === 'right' || dir === 'down') row.reverse();
            
            let original = [...row];
            row = slide(row);
            row = combine(row);
            row = slide(row);
            
            if (dir === 'right' || dir === 'down') row.reverse();
            
            for (let j = 0; j < 4; j++) {
                let r = dir === 'left' || dir === 'right' ? i : j;
                let c = dir === 'left' || dir === 'right' ? j : i;
                if (this.grid[r][c] !== row[j]) moved = true;
                this.grid[r][c] = row[j];
            }
        }

        if (moved) {
            this.playSound(200, 'square', 0.1);
            this.addTile();
        }
    }
};
}
