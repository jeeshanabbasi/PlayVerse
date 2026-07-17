import { ticTacToeDefinition } from '../src/games/registry/ticTacToe/manifest.js';

console.log('Successfully imported ticTacToeDefinition!');
console.log('ID:', ticTacToeDefinition.id);
console.log('Title:', ticTacToeDefinition.title);
console.log('Achievements:', ticTacToeDefinition.achievements.map(a => a.id));

// Mock Phaser Scene class loading
const mockPhaser = {
  Scene: class MockScene {}
};

try {
  const scenes = ticTacToeDefinition.createScenes({ Phaser: mockPhaser });
  console.log('Successfully created scenes!', scenes.length);
  const SceneClass = scenes[0];
  const instance = new SceneClass();
  console.log('Successfully instantiated scene class!');
} catch (err) {
  console.error('Failed to create or instantiate scenes:', err);
}
