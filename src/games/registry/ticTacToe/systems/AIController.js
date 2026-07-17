export class AIController {
  constructor(aiSymbol = 'O', playerSymbol = 'X') {
    this.aiSymbol = aiSymbol;
    this.playerSymbol = playerSymbol;
  }

  /**
   * Compute the best grid index (0-8) based on difficulty settings.
   * @param {Array<string|null>} board - The flat board array
   * @param {string} difficulty - 'Easy', 'Medium', or 'Hard'
   */
  computeMove(board, difficulty) {
    const availableMoves = this.getAvailableMoves(board);
    if (availableMoves.length === 0) return -1;

    if (difficulty === 'Easy') {
      return this.getRandomMove(availableMoves);
    } else if (difficulty === 'Medium') {
      return this.getMediumMove(board, availableMoves);
    } else {
      // Hard mode: Perfect Minimax
      return this.getMinimaxMove(board);
    }
  }

  getAvailableMoves(board) {
    const moves = [];
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        moves.push(i);
      }
    }
    return moves;
  }

  getRandomMove(availableMoves) {
    const idx = Math.floor(Math.random() * availableMoves.length);
    return availableMoves[idx];
  }

  getMediumMove(board, availableMoves) {
    // 1. Check if AI can win in the next turn
    for (let i = 0; i < availableMoves.length; i++) {
      const move = availableMoves[i];
      const nextBoard = [...board];
      nextBoard[move] = this.aiSymbol;
      if (this.checkWin(nextBoard, this.aiSymbol)) {
        return move;
      }
    }

    // 2. Check if player can win, block them
    for (let i = 0; i < availableMoves.length; i++) {
      const move = availableMoves[i];
      const nextBoard = [...board];
      nextBoard[move] = this.playerSymbol;
      if (this.checkWin(nextBoard, this.playerSymbol)) {
        return move;
      }
    }

    // 3. Fallback: play random
    return this.getRandomMove(availableMoves);
  }

  getMinimaxMove(board) {
    let bestVal = -Infinity;
    let bestMove = -1;

    // Loop through all empty cells
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = this.aiSymbol;
        const moveVal = this.minimax(board, 0, false);
        board[i] = null; // undo

        if (moveVal > bestVal) {
          bestVal = moveVal;
          bestMove = i;
        }
      }
    }

    return bestMove;
  }

  minimax(board, depth, isMax) {
    const score = this.evaluateBoard(board);

    // Terminal states
    if (score === 10) return score - depth; // Prefer winning sooner
    if (score === -10) return score + depth; // Prefer losing later
    if (!board.includes(null)) return 0; // Tie

    if (isMax) {
      let best = -Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
          board[i] = this.aiSymbol;
          best = Math.max(best, this.minimax(board, depth + 1, false));
          board[i] = null;
        }
      }
      return best;
    } else {
      let best = Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
          board[i] = this.playerSymbol;
          best = Math.min(best, this.minimax(board, depth + 1, true));
          board[i] = null;
        }
      }
      return best;
    }
  }

  evaluateBoard(board) {
    const winLines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
      [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (let i = 0; i < winLines.length; i++) {
      const [a, b, c] = winLines[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        if (board[a] === this.aiSymbol) return 10;
        if (board[a] === this.playerSymbol) return -10;
      }
    }
    return 0;
  }

  checkWin(board, symbol) {
    return this.evaluateBoard(board) === (symbol === this.aiSymbol ? 10 : -10);
  }
}
