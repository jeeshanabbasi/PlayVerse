export { GameRegistry, registerGame } from './core/GameRegistry';
export { SceneManager } from './core/SceneManager';
export { GameLifecycle } from './core/GameLifecycle';
export { createEmitter } from './core/events';

export { createGameEngine } from './engine/createGame';
export { destroyGameInstance } from './engine/destroyGame';
export { loadPhaser } from './engine/loadPhaser';

export { ENGINE_EVENTS, DEFAULT_GAME_SIZE, DEFAULT_SETTINGS, DEFAULT_AUDIO } from './config/defaults';
export { createPhaserConfig } from './config/phaserConfig';

export { createGameStorage } from './utils/storage';
export { formatScore, formatLastPlayed } from './utils/scores';
export { mergeAchievements, achievementProgress } from './utils/achievements';
export { isTouchDevice, createVirtualJoystickState } from './utils/touch';

export { createWaitingScene } from './scenes/WaitingScene';
export { createBaseGameScene } from './scenes/BaseGameScene';

export { resolvePlayableDefinition, ensurePlaceholderRegistered } from './registry';
export { enginePlaceholderDefinition } from './registry/placeholder';

export {
  useGameEngine,
  useGameSettings,
  useFullscreen,
} from './hooks';

export {
  GamePlayShell,
  GameToolbar,
  GameCanvas,
  GameSidebar,
  GameLoadingScreen,
  TouchControls,
  RelatedGamesBar,
} from './components';
