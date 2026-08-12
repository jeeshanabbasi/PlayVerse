import { createCyberBossScene } from './CyberBossScene.js';

export const cyberBossDefinition = {
  id: 'cyber-boss',
  name: 'Cyber Boss: Overlord Zero',
  description: 'Multi-phase cyberpunk reflex battle against rogue AI Overlord Zero.',
  instructions: [
    'Dodge incoming laser spirals and EMP barrage attacks.',
    'Hold [Spacebar] to fire rapid dual plasma cannons.',
    'Charge your ultimate meter to 100% by landing hits, then press [E] to fire the Cyber Ion Cannon!',
    'Defeat all 3 combat phases of Overlord Zero to achieve victory!'
  ],
  controls: [
    { action: 'Move Left / Right', keys: 'A / D or Left / Right' },
    { action: 'Fire Plasma Cannons', keys: 'Space (Hold)' },
    { action: 'Fire Cyber Ion Cannon (Ultimate)', keys: 'E' },
    { action: 'Restart / Rematch', keys: 'R or Space' }
  ],
  achievements: [
    { id: 'boss-slayer', name: 'Boss Slayer', description: 'Defeat Overlord Zero AI.', icon: '👑' },
    { id: 'ultimate-unleashed', name: 'Ion Annihilator', description: 'Unleash the Cyber Ion Cannon beam.', icon: '⚡' },
    { id: 'flawless-victory', name: 'Flawless S-Rank', description: 'Defeat Overlord Zero without taking damage.', icon: '🏆' }
  ],
  createScenes({ Phaser }) {
    return [createCyberBossScene(Phaser)];
  }
};
