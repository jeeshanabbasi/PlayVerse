import { createBaseGameScene } from '../../scenes/BaseGameScene.js';

export function createTetrisScene(Phaser) {
    return class TetrisScene extends createBaseGameScene(Phaser, 'TetrisScene') {
    constructor() {
        super();
        this.cols = 10;
        this.rows = 20;
        this.grid = [];
        this.audioCtx = null;
    }

    create() {
        super.create();
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        this.cameras.main.setBackgroundColor('#111');
        
        for (let r = 0; r < this.rows; r++) {
            this.grid[r] = new Array(this.cols).fill(0);
        }
        
        this.boardX = 250;
        this.boardY = 50;
        this.cellSize = 25;
        this.graphics = this.add.graphics();
        
        this.shapes = [
            [[1,1,1,1]], // I
            [[1,1],[1,1]], // O
            [[0,1,0],[1,1,1]], // T
            [[1,0,0],[1,1,1]], // L
            [[0,0,1],[1,1,1]], // J
            [[0,1,1],[1,1,0]], // S
            [[1,1,0],[0,1,1]]  // Z
        ];
        
        this.colors = [0x000000, 0x00ffff, 0xffff00, 0xaa00ff, 0xffa500, 0x0000ff, 0x00ff00, 0xff0000];
        this.currentPiece = null;
        this.score = 0;
        this.scoreText = this.add.text(550, 100, 'Score: 0', { fill: '#fff', fontSize: '24px' });
        
        this.spawnPiece();
        
        this.input.keyboard.on('keydown-LEFT', () => this.move(-1));
        this.input.keyboard.on('keydown-RIGHT', () => this.move(1));
        this.input.keyboard.on('keydown-DOWN', () => this.drop());
        this.input.keyboard.on('keydown-UP', () => this.rotate());
        
        this.time.addEvent({ delay: 500, callback: this.drop, callbackScope: this, loop: true });
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

    spawnPiece() {
        let type = Math.floor(Math.random() * this.shapes.length);
        this.currentPiece = {
            shape: this.shapes[type],
            color: type + 1,
            x: 3,
            y: 0
        };
        if (!this.isValid(0, 0, this.currentPiece.shape)) {
            this.scene.restart();
            this.playSound(150, 'sawtooth', 0.5);
        }
        this.draw();
    }

    isValid(dx, dy, shape) {
        for (let r = 0; r < shape.length; r++) {
            for (let c = 0; c < shape[r].length; c++) {
                if (shape[r][c]) {
                    let nx = this.currentPiece.x + c + dx;
                    let ny = this.currentPiece.y + r + dy;
                    if (nx < 0 || nx >= this.cols || ny >= this.rows || (ny >= 0 && this.grid[ny][nx])) return false;
                }
            }
        }
        return true;
    }

    move(dx) {
        if (this.isValid(dx, 0, this.currentPiece.shape)) {
            this.currentPiece.x += dx;
            this.draw();
        }
    }

    drop() {
        if (this.isValid(0, 1, this.currentPiece.shape)) {
            this.currentPiece.y += 1;
        } else {
            this.merge();
            this.clearLines();
            this.spawnPiece();
            this.playSound(200, 'square', 0.1);
        }
        this.draw();
    }

    rotate() {
        let s = this.currentPiece.shape;
        let newShape = [];
        for (let c = 0; c < s[0].length; c++) {
            newShape[c] = [];
            for (let r = 0; r < s.length; r++) {
                newShape[c][r] = s[s.length - 1 - r][c];
            }
        }
        if (this.isValid(0, 0, newShape)) {
            this.currentPiece.shape = newShape;
            this.draw();
        }
    }

    merge() {
        let s = this.currentPiece.shape;
        for (let r = 0; r < s.length; r++) {
            for (let c = 0; c < s[r].length; c++) {
                if (s[r][c]) {
                    this.grid[this.currentPiece.y + r][this.currentPiece.x + c] = this.currentPiece.color;
                }
            }
        }
    }

    clearLines() {
        let lines = 0;
        for (let r = this.rows - 1; r >= 0; r--) {
            if (this.grid[r].every(val => val > 0)) {
                this.grid.splice(r, 1);
                this.grid.unshift(new Array(this.cols).fill(0));
                lines++;
                r++;
            }
        }
        if (lines > 0) {
            this.playSound(600, 'sine', 0.2);
            this.score += lines * 10;
            this.scoreText.setText('Score: ' + this.score);
            if (this.score >= 100 && this.emitAchievement) this.emitAchievement('first-win');
        }
    }

    draw() {
        this.graphics.clear();
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (this.grid[r][c]) {
                    this.graphics.fillStyle(this.colors[this.grid[r][c]]);
                    this.graphics.fillRect(this.boardX + c * this.cellSize, this.boardY + r * this.cellSize, this.cellSize-1, this.cellSize-1);
                }
            }
        }
        let s = this.currentPiece.shape;
        for (let r = 0; r < s.length; r++) {
            for (let c = 0; c < s[r].length; c++) {
                if (s[r][c]) {
                    this.graphics.fillStyle(this.colors[this.currentPiece.color]);
                    this.graphics.fillRect(this.boardX + (this.currentPiece.x + c) * this.cellSize, this.boardY + (this.currentPiece.y + r) * this.cellSize, this.cellSize-1, this.cellSize-1);
                }
            }
        }
        this.graphics.lineStyle(2, 0xffffff);
        this.graphics.strokeRect(this.boardX, this.boardY, this.cols * this.cellSize, this.rows * this.cellSize);
    }
};
}
