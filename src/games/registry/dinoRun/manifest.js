import { createDinoRunScene } from './DinoRunScene.js';
export const dinoRunDefinition = {
  id: 'dino-run',
  name: 'Dino Run',
  description: 'Jump over cacti.',
  instructions: [
    'Press Spacebar, Up Arrow key, or Left Click to jump.',
    'Time your jumps to leap over incoming cacti obstacles.',
    'Survival time increments your score automatically.',
    'Colliding with any cacti obstacle ends the run and restarts the game.'
  ],
  controls: [
    { action: 'Jump', keys: 'Spacebar / Arrow Up / Click' }
  ],
  achievements: [
    { id: 'play-10', name: 'Play 10 matches', description: 'Play 10 matches.' },
    { id: 'first-win', name: 'First Win', description: 'Reach a score of 20.' }
  ],
  createScenes({ Phaser }) {
    return [createDinoRunScene(Phaser)];
  }
};
