import { createDinoRunScene } from './DinoRunScene.js';
export const dinoRunDefinition = {
  id: 'dino-run',
  name: 'Dino Run',
  description: 'Jump over cacti.',
  achievements: [
    { id: 'play-10', name: 'Play 10 matches', description: 'Play 10 matches.' },
    { id: 'first-win', name: 'First Win', description: 'Reach a score of 20.' }
  ],
  createScenes({ Phaser }) {
    return [createDinoRunScene(Phaser)];
  }
};
