import { createSudokuScene } from './SudokuScene.js';
export const sudokuDefinition = {
  id: 'sudoku',
  name: 'Sudoku',
  description: 'Number puzzle.',
  achievements: [
    { id: 'play-10', name: 'Play 10 matches', description: 'Play 10 matches.' },
    { id: 'first-win', name: 'First Win', description: 'Solve the board.' }
  ],
  createScenes({ Phaser }) {
    return [createSudokuScene(Phaser)];
  }
};
