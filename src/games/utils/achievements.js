export function mergeAchievements(catalog = [], unlockedIds = []) {
  const unlocked = new Set(unlockedIds);
  return catalog.map((item) => ({
    ...item,
    unlocked: unlocked.has(item.id),
  }));
}

export function achievementProgress(catalog = [], unlockedIds = []) {
  if (!catalog.length) return 0;
  return Math.round((unlockedIds.length / catalog.length) * 100);
}
