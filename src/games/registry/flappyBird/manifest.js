import { createFlappyBirdScene } from './FlappyBirdScene.js';
export const flappyBirdDefinition = {
  id: 'flappy-bird',
  name: 'Flappy Bird',
  description: 'Fly between pipes.',
  instructions: [
    'Tap the screen or press Spacebar to flap wings and gain height.',
    'Carefully maneuver the bird through the gaps in the scrolling neon pipes.',
    'Each pipe gap cleared awards 1 point.',
    'Colliding with a pipe or falling to the ground triggers Game Over.'
  ],
  controls: [
    { action: 'Flap Wings', keys: 'Spacebar / Left Click' }
  ],
  achievements: [
    { id: 'play-10', name: 'Play 10 matches', description: 'Play 10 matches.' },
    { id: 'first-win', name: 'First Win', description: 'Score 10 points.' }
  ],
  createScenes({ Phaser }) {
    return [createFlappyBirdScene(Phaser)];
  }
};
