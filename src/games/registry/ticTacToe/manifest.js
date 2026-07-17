import { createTicTacToeScene } from './TicTacToeScene.js';

export const ticTacToeDefinition = Object.freeze({
  id: 'tic-tac-toe',
  title: 'Tic Tac Toe',
  instructions: [
    'Choose to play locally against a friend or challenge the AI.',
    'Align three of your markers (X) horizontally, vertically, or diagonally to win.',
    'Challenge the Hard computer mode to test your strategy limits.',
    'Use the Undo button to roll back moves when playing against the computer.',
  ],
  controls: [
    { action: 'Grid Navigation', keys: 'Arrows / WASD' },
    { action: 'Place Symbol', keys: 'Enter / Space' },
    { action: 'Pointer Selection', keys: 'Mouse Click / Tap' },
    { action: 'Pause Game', keys: 'P / Toolbar' },
    { action: 'Undo last turn', keys: 'Undo Button' },
  ],
  achievements: [
    { id: 'first-win', name: 'First Win', description: 'Win your first game', icon: '🏆' },
    { id: 'play-10', name: 'Play 10', description: 'Play 10 games total', icon: '🎮' },
    { id: 'play-50', name: 'Play 50', description: 'Play 50 games total', icon: '🔥' },
    { id: 'beat-easy', name: 'Beat Easy AI', description: 'Defeat the Easy AI', icon: '🤖' },
    { id: 'beat-medium', name: 'Beat Medium AI', description: 'Defeat the Medium AI', icon: '🧠' },
    { id: 'beat-hard', name: 'Beat Hard AI', description: 'Defeat the Hard AI', icon: '👑' },
    { id: 'streak-5', name: '5 Win Streak', description: 'Hit a 5-game win streak', icon: '⚡' },
    { id: 'streak-10', name: '10 Win Streak', description: 'Hit a 10-game win streak', icon: '☄️' },
    { id: 'perfect-game', name: 'Perfect Game', description: 'Win a match in the minimum (5) total turns', icon: '⭐' },
  ],
  createScenes({ Phaser }) {
    return [createTicTacToeScene(Phaser)];
  },
});
