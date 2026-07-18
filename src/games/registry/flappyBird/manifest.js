import { createFlappyBirdScene } from './FlappyBirdScene.js';
export const flappyBirdDefinition = {
  id: 'flappyBird',
  name: 'Flappy Bird',
  description: 'Fly between pipes.',
  achievements: [
    { id: 'play-10', name: 'Play 10 matches', description: 'Play 10 matches.' },
    { id: 'first-win', name: 'First Win', description: 'Score 10 points.' }
  ],
  createScenes({ Phaser }) {
    return [createFlappyBirdScene(Phaser)];
  }
};
