import { createMemoryScene } from './MemoryScene.js';
export const memoryGameDefinition = {
  id: 'memory-game',
  name: 'Memory Game',
  description: 'A classic 4x4 card matching memory game.',
  instructions: [
    'Click on any card to flip and reveal its hidden color.',
    'Click on a second card to find its matching pair.',
    'If the colors match, the cards remain revealed.',
    'Match all 8 pairs on the board to complete the game.'
  ],
  controls: [
    { action: 'Select Card', keys: 'Left Click / Tap' }
  ],
  achievements: [
    { id: 'play-10', name: 'Play 10 matches', description: 'Play 10 matches.' },
    { id: 'first-win', name: 'First Win', description: 'Match all pairs.' }
  ],
  createScenes({ Phaser }) {
    return [createMemoryScene(Phaser)];
  }
};
