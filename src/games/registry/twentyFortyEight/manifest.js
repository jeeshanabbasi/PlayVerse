import { createTwentyFortyEightScene } from './TwentyFortyEightScene.js';
export const twentyFortyEightDefinition = {
  id: 'twentyFortyEight',
  name: '2048',
  description: 'Slide numbers to 2048.',
  achievements: [
    { id: 'play-10', name: 'Play 10 matches', description: 'Play 10 matches.' },
    { id: 'first-win', name: 'First Win', description: 'Reach the 2048 tile.' }
  ],
  createScenes({ Phaser }) {
    return [createTwentyFortyEightScene(Phaser)];
  }
};
