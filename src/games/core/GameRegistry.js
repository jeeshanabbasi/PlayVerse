const registry = new Map();

function assertDefinition(definition) {
  if (!definition?.id) {
    throw new Error('Game definition requires an id');
  }
  if (typeof definition.createScenes !== 'function' && !Array.isArray(definition.scenes)) {
    throw new Error(`Game "${definition.id}" requires createScenes() or scenes[]`);
  }
}

export const GameRegistry = {
  register(definition) {
    assertDefinition(definition);
    const id = String(definition.id).toLowerCase();
    registry.set(id, Object.freeze({
      ...definition,
      id,
      title: definition.title ?? id,
      version: definition.version ?? '1.0.0',
      instructions: definition.instructions ?? [],
      controls: definition.controls ?? [],
      achievements: definition.achievements ?? [],
      width: definition.width,
      height: definition.height,
    }));
    return id;
  },

  unregister(id) {
    return registry.delete(String(id).toLowerCase());
  },

  has(id) {
    return registry.has(String(id).toLowerCase());
  },

  get(id) {
    return registry.get(String(id).toLowerCase()) ?? null;
  },

  list() {
    return [...registry.values()];
  },

  clear() {
    registry.clear();
  },
};

export function registerGame(definition) {
  return GameRegistry.register(definition);
}
