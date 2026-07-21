import { createTetrisScene } from './TetrisScene.js';
export const tetrisDefinition = {
  id: 'tetris',
  name: 'Tetris',
  description: 'Classic falling blocks.',
  instructions: [
    'Guide the falling tetromino shapes left and right.',
    'Rotate shapes using Up arrow key to fit them together.',
    'Complete full horizontal rows to clear them and score points.',
    'Prevent blocks from stacking to the top of the screen to avoid Game Over.'
  ],
  controls: [
    { action: 'Move Left', keys: 'Arrow Left' },
    { action: 'Move Right', keys: 'Arrow Right' },
    { action: 'Rotate Shape', keys: 'Arrow Up' },
    { action: 'Soft Drop', keys: 'Arrow Down' }
  ],
  achievements: [
    { id: 'play-10', name: 'Play 10 matches', description: 'Play 10 matches.', icon: '🧱' },
    { id: 'first-win', name: 'First Win', description: 'Clear 10 lines.', icon: '🏗️' }
  ],
  createScenes({ Phaser }) {
    return [createTetrisScene(Phaser)];
  }
};
