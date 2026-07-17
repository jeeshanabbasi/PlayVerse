import { createSnakeScene } from '../scenes/SnakeScene';

export const snakeDefinition = Object.freeze({
  id: 'snake',
  title: 'Snake',
  instructions: [
    'Guide the snake to eat food and grow.',
    'Avoid hitting the walls or your own tail.',
    'Speed increases gradually as you eat more food.',
  ],
  controls: [
    { action: 'Move Up', keys: 'Arrow Up / W' },
    { action: 'Move Down', keys: 'Arrow Down / S' },
    { action: 'Move Left', keys: 'Arrow Left / A' },
    { action: 'Move Right', keys: 'Arrow Right / D' },
    { action: 'Pause / Resume', keys: 'P' },
    { action: 'Mobile Controls', keys: 'Touch Swipe' },
  ],
  achievements: [
    { id: 'first-food', name: 'First Food', description: 'Eat your first food', icon: '🍎' },
    { id: 'score-10', name: 'Score 10', description: 'Reach a score of 10', icon: '🥉' },
    { id: 'score-25', name: 'Score 25', description: 'Reach a score of 25', icon: '🥈' },
    { id: 'score-50', name: 'Score 50', description: 'Reach a score of 50', icon: '🥇' },
    { id: 'score-100', name: 'Score 100', description: 'Reach a score of 100', icon: '🏆' },
  ],
  createScenes({ Phaser }) {
    return [createSnakeScene(Phaser)];
  },
});
