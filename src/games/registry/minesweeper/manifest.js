import { createMinesweeperScene } from './MinesweeperScene.js';
export const minesweeperDefinition = {
  id: 'minesweeper',
  name: 'Minesweeper',
  description: 'Reveal mines grid.',
  achievements: [
    { id: 'play-10', name: 'Play 10 matches', description: 'Play 10 matches.' },
    { id: 'first-win', name: 'First Win', description: 'Clear a board.' }
  ],
  createScenes({ Phaser }) {
    return [createMinesweeperScene(Phaser)];
  }
};
