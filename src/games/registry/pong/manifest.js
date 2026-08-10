import { createPongScene } from './PongScene.js';

export const pongDefinition = {
  id: 'pong',
  name: 'Pong: 2-Player Versus',
  description: 'Cyberpunk table tennis with 1-Player vs CPU and 2-Player Local Versus modes.',
  instructions: [
    'Press [M] or click the mode banner to toggle between 1-Player vs AI and 2-Player Versus.',
    'Player 1 controls the left cyan paddle using [W] & [S] keys.',
    'Player 2 controls the right pink paddle using [Arrow Up] & [Arrow Down] keys.',
    'First player to reach 5 points wins the match!'
  ],
  controls: [
    { action: 'Player 1 Up / Down', keys: 'W / S' },
    { action: 'Player 2 Up / Down', keys: 'Arrow Up / Down' },
    { action: 'Toggle 1P / 2P Mode', keys: 'M' },
    { action: 'Rematch / Restart', keys: 'Space' }
  ],
  achievements: [
    { id: 'play-10', name: 'Pong Veteran', description: 'Play 10 matches.', icon: '🏓' },
    { id: 'first-win', name: 'First Win', description: 'Score 5 points and win the match.', icon: '⚡' }
  ],
  createScenes({ Phaser }) {
    return [createPongScene(Phaser)];
  }
};
