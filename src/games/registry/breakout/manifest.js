import { createBreakoutScene } from './BreakoutScene.js';
export const breakoutDefinition = {
  id: 'breakout',
  name: 'Breakout',
  description: 'Breakout game.',
  instructions: [
    'Move your mouse cursor left and right to slide the paddle.',
    'Bounce the ball upward to smash the colorful brick layers.',
    'Clear all bricks on the screen to win the match.',
    'If the ball falls past your paddle, you lose a life and the level restarts.'
  ],
  controls: [
    { action: 'Move Paddle', keys: 'Mouse Move / Drag' }
  ],
  achievements: [
    { id: 'play-10', name: 'Play 10 matches', description: 'Play 10 matches.' },
    { id: 'first-win', name: 'First Win', description: 'Clear all bricks.' }
  ],
  createScenes({ Phaser }) {
    return [createBreakoutScene(Phaser)];
  }
};
