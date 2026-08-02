import { createSpaceInvadersScene } from './SpaceInvadersScene.js';

export const spaceInvadersDefinition = {
  id: 'space-invaders',
  name: 'Space Invaders',
  description: 'Classic retro space invaders arcade shooter.',
  instructions: [
    'Move your defender ship Left and Right with Arrow keys.',
    'Press SPACE to shoot lasers at incoming alien invaders.',
    'Defend yourself using the defense barrier shields.',
    'Eliminate all invaders before they reach the ground!'
  ],
  controls: [
    { action: 'Move Left', keys: 'Arrow Left' },
    { action: 'Move Right', keys: 'Arrow Right' },
    { action: 'Shoot Laser', keys: 'Space' }
  ],
  achievements: [
    { id: 'first-win', name: 'Galaxy Defender', description: 'Defeat all alien invaders.', icon: '👾' },
    { id: 'perfect-clear', name: 'Untouchable Warrior', description: 'Clear invaders without losing any lives.', icon: '🛡️' }
  ],
  createScenes({ Phaser }) {
    return [createSpaceInvadersScene(Phaser)];
  }
};
