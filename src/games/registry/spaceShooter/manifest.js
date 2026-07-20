import { createSpaceShooterScene } from './SpaceShooterScene.js';
export const spaceShooterDefinition = {
  id: 'space-shooter',
  name: 'Space Shooter',
  description: 'Shoot asteroids.',
  instructions: [
    'Control your spaceship left and right using the Arrow keys.',
    'Press Spacebar to fire lasers at incoming asteroids.',
    'Destroy asteroids to score points (+10 points each).',
    'Avoid letting asteroids collide with your ship to survive.'
  ],
  controls: [
    { action: 'Move Ship Left', keys: 'Arrow Left' },
    { action: 'Move Ship Right', keys: 'Arrow Right' },
    { action: 'Fire Laser', keys: 'Spacebar' }
  ],
  achievements: [
    { id: 'play-10', name: 'Play 10 matches', description: 'Play 10 matches.' },
    { id: 'first-win', name: 'First Win', description: 'Score 100 points.' }
  ],
  createScenes({ Phaser }) {
    return [createSpaceShooterScene(Phaser)];
  }
};
