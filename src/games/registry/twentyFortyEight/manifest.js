import { createTwentyFortyEightScene } from './TwentyFortyEightScene.js';
export const twentyFortyEightDefinition = {
  id: '2048',
  name: '2048',
  description: 'Slide numbers to 2048.',
  instructions: [
    'Use Arrow keys or WASD to slide all tiles in that direction.',
    'When two tiles with the same number touch, they merge into one with double value.',
    'A new tile (2 or 4) randomly spawns after each move.',
    'Try to reach the ultimate 2048 tile to win the game!'
  ],
  controls: [
    { action: 'Slide Grid', keys: 'Arrows / WASD' }
  ],
  achievements: [
    { id: 'play-10', name: 'Play 10 matches', description: 'Play 10 matches.' },
    { id: 'first-win', name: 'First Win', description: 'Reach the 2048 tile.' }
  ],
  createScenes({ Phaser }) {
    return [createTwentyFortyEightScene(Phaser)];
  }
};
