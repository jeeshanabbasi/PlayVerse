export function destroyGameInstance(game) {
  if (!game) return;

  try {
    game.sound?.removeAll?.();
  } catch {
    // ignore
  }

  try {
    const scenePlugin = game.scene;
    if (scenePlugin?.keys) {
      Object.keys(scenePlugin.keys).forEach((key) => {
        try {
          scenePlugin.stop(key);
          scenePlugin.remove(key);
        } catch {
          // ignore per-scene teardown errors
        }
      });
    }
  } catch {
    // ignore
  }

  try {
    game.destroy(true);
  } catch {
    try {
      game.destroy(true, false);
    } catch {
      // final teardown failed — DOM node may already be gone
    }
  }

  if (game.canvas?.parentNode) {
    try {
      game.canvas.parentNode.removeChild(game.canvas);
    } catch {
      // ignore
    }
  }
}
