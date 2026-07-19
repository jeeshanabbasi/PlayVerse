import { createMemoryScene } from './MemoryScene.js';
export const memoryGameDefinition = {
  id: 'memory-game',
  name: 'Memory Game',
  description: 'A classic 4x4 card matching memory game.',
  achievements: [
    { id: 'play-10', name: 'Play 10 matches', description: 'Play 10 matches.' },
    { id: 'first-win', name: 'First Win', description: 'Match all pairs.' }
  ],
  createScenes({ Phaser }) {
    return [createMemoryScene(Phaser)];
  }
};
