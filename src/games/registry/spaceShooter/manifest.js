import { createSpaceShooterScene } from './SpaceShooterScene.js';
export const spaceShooterDefinition = {
  id: 'space-shooter',
  name: 'Space Shooter',
  description: 'Shoot asteroids.',
  achievements: [
    { id: 'play-10', name: 'Play 10 matches', description: 'Play 10 matches.' },
    { id: 'first-win', name: 'First Win', description: 'Score 100 points.' }
  ],
  createScenes({ Phaser }) {
    return [createSpaceShooterScene(Phaser)];
  }
};
