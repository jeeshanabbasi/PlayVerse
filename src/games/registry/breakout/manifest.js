import { createBreakoutScene } from './BreakoutScene.js';
export const breakoutDefinition = {
  id: 'breakout',
  name: 'Breakout',
  description: 'Breakout game.',
  achievements: [
    { id: 'play-10', name: 'Play 10 matches', description: 'Play 10 matches.' },
    { id: 'first-win', name: 'First Win', description: 'Clear all bricks.' }
  ],
  createScenes({ Phaser }) {
    return [createBreakoutScene(Phaser)];
  }
};
