import { createBaseGameScene } from '../../scenes/BaseGameScene.js';
import { StatsManager } from './systems/StatsManager.js';
import { GameStateManager } from './systems/GameStateManager.js';
import { AIController } from './systems/AIController.js';
import { AudioSynthController } from './systems/AudioSynthController.js';
import { BoardManager } from './systems/BoardManager.js';
import { AnimationManager } from './systems/AnimationManager.js';
import { InputManager } from './systems/InputManager.js';
import { MenuUIManager } from './systems/MenuUIManager.js';

export function createTicTacToeScene(Phaser) {
  const BaseScene = createBaseGameScene(Phaser, 'TicTacToeScene');

  return class TicTacToeScene extends BaseScene {
    constructor() {
      super();
      this.state = 'MENU'; // MENU, PLAYING, GAMEOVER

      // Coordinators
      this.statsManager = null;
      this.stateManager = null;
      this.aiController = null;
      this.audioController = null;
      this.boardManager = null;
      this.animationManager = null;
      this.inputManager = null;
      this.menuUIManager = null;

      // Layout constants
      this.boardWidth = 332;
      this.boardHeight = 332;
      this.cellWidth = 100;
      this.cellHeight = 100;
      this.cellGap = 16;
      this.startX = Math.floor((960 - this.boardWidth) / 2);
      this.startY = Math.floor((540 - this.boardHeight) / 2) + 20; // push down slightly for HUD space

      this.timeTimer = null;
    }

    init(data) {
      super.init(data);

      this.statsManager = new StatsManager(this);
      this.statsManager.load();

      this.stateManager = new GameStateManager(3, 3);
      this.aiController = new AIController('O', 'X');
    }

    create() {
      this.cameras.main.setBackgroundColor('#09090B');

      // Initialize managers
      this.audioController = new AudioSynthController(this);

      this.boardManager = new BoardManager(
        this,
        this.boardWidth,
        this.boardHeight,
        this.cellWidth,
        this.cellHeight,
        this.cellGap,
        this.startX,
        this.startY
      );

      this.animationManager = new AnimationManager(this, this.boardManager);

      this.inputManager = new InputManager(
        this,
        this.boardWidth,
        this.boardHeight,
        this.cellWidth,
        this.cellHeight,
        this.cellGap,
        this.startX,
        this.startY
      );

      this.menuUIManager = new MenuUIManager(
        this,
        this.boardWidth,
        this.boardHeight,
        this.cellWidth,
        this.cellHeight,
        this.cellGap,
        this.startX,
        this.startY
      );

      // Create stats HUD
      this.menuUIManager.createHUD(
        this.statsManager.getWins(),
        this.statsManager.getLosses(),
        this.statsManager.getDraws(),
        this.statsManager.getBestStreak(),
        this.stateManager.mode,
        this.stateManager.difficulty
      );

      // Increment game playtime every second
      this.timeTimer = this.time.addEvent({
        delay: 1000,
        callback: () => {
          if (this.state === 'PLAYING') {
            this.statsManager.incrementPlayTime(1);
          }
        },
        loop: true,
      });

      // Listen for click/touch inputs on board cells
      this.input.on('pointerdown', (pointer) => {
        if (this.state !== 'PLAYING') return;
        const isHumanTurn = this.stateManager.getCurrentTurn() === 'X';
        if (!isHumanTurn) return;

        const clickedIndex = this.inputManager.resolveCoordinates(pointer.x, pointer.y);
        if (clickedIndex !== -1) {
          this.handlePlayerMove(clickedIndex);
        }
      });

      // Listen for Phaser cleanups
      this.events.once('shutdown', () => this.handleCleanup());
      this.events.once('destroy', () => this.handleCleanup());

      // Boot Start Menu
      this.showStartMenu();
    }

    update(time, delta) {
      if (this.state !== 'PLAYING') return;

      const isHumanTurn = this.stateManager.getCurrentTurn() === 'X';

      if (isHumanTurn) {
        // 1. Accessibility keyboard update
        this.inputManager.update((cellIndex) => this.handlePlayerMove(cellIndex));

        // Draw selection cursor / hovers
        const pointer = this.input.activePointer;
        const hoverIdx = this.inputManager.getHoverCell(pointer);
        const focusIdx = this.inputManager.getFocusedIndex();
        const isKb = this.inputManager.isKeyboardActive();
        this.boardManager.drawHighlights(hoverIdx, focusIdx, isKb);
      } else {
        // Clear hovers on AI turn
        this.boardManager.drawHighlights(-1, -1, false);
      }
    }

    showStartMenu() {
      this.state = 'MENU';
      this.stateManager.reset();
      this.boardManager.clear();
      this.animationManager.clear();
      this.inputManager.clear();

      this.menuUIManager.showStartMenu((mode, diff) => {
        this.startGame(mode, diff);
      });
    }

    startGame(mode, diff) {
      this.state = 'PLAYING';
      this.stateManager.reset();
      this.stateManager.setMode(mode);
      this.stateManager.setDifficulty(diff);

      this.boardManager.clear();
      this.animationManager.clear();
      this.inputManager.clear();

      // Redraw glass board
      this.boardManager.drawGrid();

      // Clear Turn indicator to X (X always starts)
      this.menuUIManager.updateTurn('X', mode, false);

      // Refresh HUD score numbers
      this.menuUIManager.updateStats(
        this.statsManager.getWins(),
        this.statsManager.getLosses(),
        this.statsManager.getDraws(),
        this.statsManager.getBestStreak()
      );

      // Render Undo Button
      this.updateUndoButton();
    }

    handlePlayerMove(index) {
      if (this.state !== 'PLAYING') return;
      if (this.stateManager.getCurrentTurn() !== 'X') return;

      const success = this.stateManager.makeMove(index, 'X');
      if (!success) return;

      // Play synth beeps
      this.audioController.playMove();

      // Place item visually, then verify game rules on complete
      this.boardManager.placePiece(index, 'X', () => this.checkGameStatus());

      // Refresh Undo button
      this.updateUndoButton();

      // Display turn change banner if game goes on
      if (this.state === 'PLAYING') {
        const next = this.stateManager.getCurrentTurn();
        this.menuUIManager.updateTurn(next, this.stateManager.mode, next === 'O');
      }
    }

    handleAIMove() {
      if (this.state !== 'PLAYING') return;
      if (this.stateManager.getCurrentTurn() !== 'O') return;

      const boardState = this.stateManager.getBoard();
      const move = this.aiController.computeMove(boardState, this.stateManager.difficulty);

      if (move === -1) return;

      const success = this.stateManager.makeMove(move, 'O');
      if (!success) return;

      this.audioController.playMove();

      this.boardManager.placePiece(move, 'O', () => this.checkGameStatus());

      this.updateUndoButton();

      if (this.state === 'PLAYING') {
        this.menuUIManager.updateTurn('X', this.stateManager.mode, false);
      }
    }

    checkGameStatus() {
      if (this.state !== 'PLAYING') return;

      // 1. Victory Check
      const win = this.stateManager.checkWin();
      if (win) {
        this.handleGameEnd(win);
        return;
      }

      // 2. Draw Check
      if (this.stateManager.checkDraw()) {
        this.handleGameEnd(null);
        return;
      }

      // 3. AI Turn Trigger
      if (this.stateManager.mode === 'PvC' && this.stateManager.getCurrentTurn() === 'O') {
        this.menuUIManager.updateTurn('O', 'PvC', true); // Shows computer thinking
        // Deferred AI calculation to make it feel premium
        this.time.delayedCall(600, () => this.handleAIMove());
      }
    }

    handleGameEnd(win) {
      this.state = 'GAMEOVER';

      // Hide Undo button
      this.menuUIManager.drawUndoButton(false);

      if (win) {
        const isPlayerXWin = win.winner === 'X';

        // Winning Line highlight + tapered losing cells fade
        this.boardManager.drawWinLine(win.line);
        this.animationManager.fadeLosingPieces(win.line);
        this.animationManager.pulseWinningPieces(win.line);

        if (this.stateManager.mode === 'PvP') {
          // Local PvP win: Confetti particles + win arpeggio
          this.audioController.playWin();
          this.animationManager.triggerVictoryConfetti();
          this.animationManager.triggerVictoryFlash();

          this.statsManager.recordWin('PvP', '', this.stateManager.getTotalMoves());
          this.menuUIManager.showGameOver('win', () => this.showStartMenu());
        } else {
          // PvC mode
          if (isPlayerXWin) {
            this.audioController.playWin();
            this.animationManager.triggerVictoryConfetti();
            this.animationManager.triggerVictoryFlash();

            this.statsManager.recordWin('PvC', this.stateManager.difficulty, this.stateManager.getTotalMoves());
            this.menuUIManager.showGameOver('win', () => this.showStartMenu());
          } else {
            // Defeat: Camera Shake + sad synth sweep
            this.audioController.playLose();
            this.animationManager.triggerImpactShake();

            this.statsManager.recordLoss();
            this.menuUIManager.showGameOver('lose', () => this.showStartMenu());
          }
        }
      } else {
        // Draw: tie tone + camera shake
        this.audioController.playDraw();
        this.animationManager.triggerImpactShake();

        this.statsManager.recordDraw();
        this.menuUIManager.showGameOver('draw', () => this.showStartMenu());
      }

      // Refresh HUD score numbers
      this.menuUIManager.updateStats(
        this.statsManager.getWins(),
        this.statsManager.getLosses(),
        this.statsManager.getDraws(),
        this.statsManager.getBestStreak()
      );
    }

    handleUndo() {
      if (this.state !== 'PLAYING') return;

      const success = this.stateManager.undo();
      if (!success) return;

      // Re-synchronize board cells graphics
      const boardState = this.stateManager.getBoard();
      for (let i = 0; i < 9; i++) {
        const symbol = boardState[i];
        if (symbol) {
          this.boardManager.placePiece(i, symbol);
        } else {
          this.boardManager.removePiece(i);
        }
      }

      // Clear any visual overlays / tweens
      this.animationManager.clear();

      // Restore turn HUD to player
      this.menuUIManager.updateTurn('X', 'PvC', false);

      this.updateUndoButton();
    }

    updateUndoButton() {
      // Undo button is visible in PvC mode during active playing when at least 2 moves have been made (1 player + 1 AI)
      const hasMoves = this.stateManager.history.length >= 2;
      const visible = this.state === 'PLAYING' && this.stateManager.mode === 'PvC' && hasMoves;
      this.menuUIManager.drawUndoButton(visible, () => this.handleUndo());
    }

    handleCleanup() {
      if (this.timeTimer) {
        this.timeTimer.destroy();
        this.timeTimer = null;
      }
      if (this.boardManager) this.boardManager.destroy();
      if (this.animationManager) this.animationManager.destroy();
      if (this.inputManager) this.inputManager.destroy();
      if (this.menuUIManager) this.menuUIManager.destroy();
    }
  };
}
