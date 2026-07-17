import { GameRegistry } from '../core/GameRegistry';
import { enginePlaceholderDefinition } from './placeholder';
import { snakeDefinition } from './snake';
import { ticTacToeDefinition } from './ticTacToe/manifest';

export function ensurePlaceholderRegistered() {
  if (!GameRegistry.has(enginePlaceholderDefinition.id)) {
    GameRegistry.register(enginePlaceholderDefinition);
  }
  if (!GameRegistry.has(snakeDefinition.id)) {
    GameRegistry.register(snakeDefinition);
  }
  if (!GameRegistry.has(ticTacToeDefinition.id)) {
    GameRegistry.register(ticTacToeDefinition);
  }
}

export function resolvePlayableDefinition(slug) {
  ensurePlaceholderRegistered();
  const registered = GameRegistry.get(slug);
  if (registered) return registered;
  return {
    ...enginePlaceholderDefinition,
    id: slug || enginePlaceholderDefinition.id,
    title: slug ? `Awaiting: ${slug}` : enginePlaceholderDefinition.title,
  };
}

export * from './placeholder';
export * from './snake';
export * from './ticTacToe/manifest';


