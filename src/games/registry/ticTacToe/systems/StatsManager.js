export class StatsManager {
  constructor(scene) {
    this.scene = scene;
    this.stats = {
      wins: 0,
      losses: 0,
      draws: 0,
      bestStreak: 0,
      currentStreak: 0,
      timePlayed: 0,
    };
  }

  /**
   * Load stats progress from LocalStorage.
   */
  load() {
    const saved = this.scene.storage?.getProgress();
    if (saved) {
      this.stats = { ...this.stats, ...saved };
    }

    // Check play count achievements on launch
    const playCount = this.scene.storage?.getPlayCount() ?? 0;
    this.checkPlayCountAchievements(playCount);
  }

  save() {
    this.scene.storage?.setProgress(this.stats);
  }

  recordWin(mode, difficulty, totalMoves) {
    this.stats.wins += 1;
    this.stats.currentStreak += 1;
    if (this.stats.currentStreak > this.stats.bestStreak) {
      this.stats.bestStreak = this.stats.currentStreak;
    }
    this.save();

    // Achievements check
    this.scene.unlockAchievement('first-win');

    if (mode === 'PvC') {
      if (difficulty === 'Easy') this.scene.unlockAchievement('beat-easy');
      else if (difficulty === 'Medium') this.scene.unlockAchievement('beat-medium');
      else if (difficulty === 'Hard') this.scene.unlockAchievement('beat-hard');
    }

    if (this.stats.currentStreak >= 5) this.scene.unlockAchievement('streak-5');
    if (this.stats.currentStreak >= 10) this.scene.unlockAchievement('streak-10');

    // Perfect Game: Win in 5 total turns (minimum turns possible)
    if (totalMoves === 5) {
      this.scene.unlockAchievement('perfect-game');
    }
  }

  recordLoss() {
    this.stats.losses += 1;
    this.stats.currentStreak = 0;
    this.save();
  }

  recordDraw() {
    this.stats.draws += 1;
    this.save();
  }

  incrementPlayTime(seconds) {
    this.stats.timePlayed += seconds;
    this.save();
  }

  checkPlayCountAchievements(playCount) {
    if (playCount >= 10) {
      this.scene.unlockAchievement('play-10');
    }
    if (playCount >= 50) {
      this.scene.unlockAchievement('play-50');
    }
  }

  getWins() {
    return this.stats.wins;
  }

  getLosses() {
    return this.stats.losses;
  }

  getDraws() {
    return this.stats.draws;
  }

  getBestStreak() {
    return this.stats.bestStreak;
  }

  getTimePlayed() {
    return this.stats.timePlayed;
  }
}
