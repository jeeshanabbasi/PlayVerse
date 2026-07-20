import { createSudokuScene } from './SudokuScene.js';
export const sudokuDefinition = {
  id: 'sudoku',
  name: 'Sudoku',
  description: 'Number puzzle.',
  instructions: [
    'Click or tap on any empty blue cell to select it.',
    'Press keyboard numbers 1 through 9 to fill the selected cell.',
    'Each row, column, and 3x3 box must contain numbers 1-9 without duplicates.',
    'Fill all empty cells correctly to win the puzzle.'
  ],
  controls: [
    { action: 'Select Cell', keys: 'Left Click / Tap' },
    { action: 'Input Number', keys: 'Keys 1 - 9' }
  ],
  achievements: [
    { id: 'play-10', name: 'Play 10 matches', description: 'Play 10 matches.' },
    { id: 'first-win', name: 'First Win', description: 'Solve the board.' }
  ],
  createScenes({ Phaser }) {
    return [createSudokuScene(Phaser)];
  }
};
