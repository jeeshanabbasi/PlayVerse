import { createWaitingScene } from '../scenes/WaitingScene';

export const enginePlaceholderDefinition = Object.freeze({
  id: '__engine_placeholder__',
  title: 'PlayVerse Engine',
  instructions: [
    'This runtime host is ready for Phaser game modules.',
    'Register a game with GameRegistry.register() to enable play.',
  ],
  controls: [
    { action: 'Pause', keys: 'P / Toolbar' },
    { action: 'Mute', keys: 'Toolbar' },
    { action: 'Fullscreen', keys: 'Toolbar' },
  ],
  achievements: [],
  createScenes({ Phaser }) {
    return [createWaitingScene(Phaser)];
  },
});
