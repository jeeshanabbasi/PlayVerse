import { createTetrisScene } from './TetrisScene.js';
export const tetrisDefinition = {
  id: 'tetris',
  name: 'Tetris',
  description: 'Classic falling blocks.',
  achievements: [
    { id: 'play-10', name: 'Play 10 matches', description: 'Play 10 matches.' },
    { id: 'first-win', name: 'First Win', description: 'Clear 10 lines.' }
  ],
  createScenes({ Phaser }) {
    return [createTetrisScene(Phaser)];
  }
};
