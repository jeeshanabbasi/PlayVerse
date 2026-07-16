import { GameRegistry } from '../core/GameRegistry';
import { enginePlaceholderDefinition } from './placeholder';

export function ensurePlaceholderRegistered() {
  if (!GameRegistry.has(enginePlaceholderDefinition.id)) {
    GameRegistry.register(enginePlaceholderDefinition);
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
