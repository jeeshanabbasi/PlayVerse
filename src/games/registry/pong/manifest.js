import { createPongScene } from './PongScene.js';
export const pongDefinition = {
  id: 'pong',
  name: 'Pong',
  description: 'Classic Pong game.',
  instructions: [
    'Control the left paddle using Up and Down arrow keys.',
    'Bounce the ball past the AI-controlled right paddle.',
    'A point is scored when the ball goes past a paddle.',
    'First player to reach 5 points wins!'
  ],
  controls: [
    { action: 'Move Paddle Up', keys: 'Arrow Up' },
    { action: 'Move Paddle Down', keys: 'Arrow Down' }
  ],
  achievements: [
    { id: 'play-10', name: 'Play 10 matches', description: 'Play 10 matches.', icon: '🏓' },
    { id: 'first-win', name: 'First Win', description: 'Score 5 points against AI.', icon: '⚡' }
  ],
  createScenes({ Phaser }) {
    return [createPongScene(Phaser)];
  }
};
