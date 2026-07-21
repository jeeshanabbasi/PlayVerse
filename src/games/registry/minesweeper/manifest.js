import { createMinesweeperScene } from './MinesweeperScene.js';
export const minesweeperDefinition = {
  id: 'minesweeper',
  name: 'Minesweeper',
  description: 'Reveal mines grid.',
  instructions: [
    'Left click or tap on tiles to reveal them.',
    'A number indicates how many mines are adjacent to that cell.',
    'Avoid clicking on mines! Clicking a mine triggers Game Over.',
    'Reveal all safe cells on the board to win.'
  ],
  controls: [
    { action: 'Reveal Cell', keys: 'Left Click / Tap' }
  ],
  achievements: [
    { id: 'play-10', name: 'Play 10 matches', description: 'Play 10 matches.', icon: '💣' },
    { id: 'first-win', name: 'First Win', description: 'Clear a board.', icon: '🏆' }
  ],
  createScenes({ Phaser }) {
    return [createMinesweeperScene(Phaser)];
  }
};
