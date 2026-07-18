import { createPongScene } from './PongScene.js';
export const pongDefinition = {
  id: 'pong',
  name: 'Pong',
  description: 'Classic Pong game.',
  achievements: [
    { id: 'play-10', name: 'Play 10 matches', description: 'Play 10 matches.' },
    { id: 'first-win', name: 'First Win', description: 'Score 5 points against AI.' }
  ],
  createScenes({ Phaser }) {
    return [createPongScene(Phaser)];
  }
};
