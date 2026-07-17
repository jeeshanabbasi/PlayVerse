export class GameStateManager {
  constructor(size = 3, winLength = 3) {
    this.size = size;
    this.winLength = winLength;
    this.board = Array(size * size).fill(null);
    this.currentTurn = 'X'; // X starts
    this.mode = 'PvP'; // PvP or PvC
    this.difficulty = 'Normal';
    this.history = []; // History stack for undo rollback
  }

  reset() {
    this.board = Array(this.size * this.size).fill(null);
    this.currentTurn = 'X';
    this.history = [];
  }

  setMode(mode) {
    this.mode = mode;
  }

  setDifficulty(difficulty) {
    this.difficulty = difficulty;
  }

  /**
   * Set symbol at index.
   * Pushes the prior state onto the history stack.
   */
  makeMove(index, symbol) {
    if (index < 0 || index >= this.board.length || this.board[index] !== null) {
      return false;
    }

    // Save copy of current board state to history
    this.history.push([...this.board]);

    this.board[index] = symbol;
    this.currentTurn = symbol === 'X' ? 'O' : 'X';
    return true;
  }

  /**
   * Rollback the last move (player + computer) if in PvC mode.
   */
  undo() {
    if (this.mode !== 'PvC' || this.history.length < 2) {
      return false;
    }

    // Pop the computer's turn state
    this.history.pop();
    // Pop the player's turn state, restoring the board
    const playerPrevState = this.history.pop();
    this.board = playerPrevState;
    this.currentTurn = 'X'; // Restores to player's turn

    return true;
  }

  /**
   * Checks if there is a winner. Returns { winner, line } if found, otherwise null.
   */
  checkWin() {
    const winLines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
      [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (let i = 0; i < winLines.length; i++) {
      const [a, b, c] = winLines[i];
      if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
        return {
          winner: this.board[a],
          line: winLines[i]
        };
      }
    }
    return null;
  }

  /**
   * Checks if game has reached a tie state.
   */
  checkDraw() {
    return !this.board.includes(null) && this.checkWin() === null;
  }

  getBoard() {
    return this.board;
  }

  getCurrentTurn() {
    return this.currentTurn;
  }

  getTotalMoves() {
    return this.board.filter((cell) => cell !== null).length;
  }
}
