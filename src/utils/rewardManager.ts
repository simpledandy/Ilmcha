import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "../constants/storageKeys";
import { ToastAndroid } from "react-native";
import {
  Treasure,
  Achievement,
  RewardProgress,
  calculateRewardPoints,
  getRandomTreasure,
} from "../constants/rewards/rewards";

export interface RewardResult {
  treasure: Treasure;
  points: number;
  isNewAchievement: boolean;
  achievements: Achievement[];
  streak: number;
}

export class RewardManager {
  private progress: RewardProgress = {
    totalTreasures: 0,
    totalPoints: 0,
    currentStreak: 0,
    bestStreak: 0,
    islandsUnlocked: 0,
    achievementsUnlocked: 0,
    lastRewardDate: new Date().toISOString(),
  };

  private collectedTreasures: Treasure[] = [];
  private achievements: Achievement[] = [];
  private dailyStreak: number = 0;
  private lastActivityDate: string = "";

  constructor() {
    void this.loadData();
  }

  private async loadData() {
    try {
      const [
        progressData,
        treasuresData,
        achievementsData,
        streakData,
        activityData,
      ] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.REWARD_PROGRESS),
        AsyncStorage.getItem(STORAGE_KEYS.COLLECTED_TREASURES),
        AsyncStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS),
        AsyncStorage.getItem(STORAGE_KEYS.DAILY_STREAK),
        AsyncStorage.getItem(STORAGE_KEYS.LAST_ACTIVITY_DATE),
      ]);

      if (progressData)
        this.progress = JSON.parse(progressData) as RewardProgress;
      if (treasuresData)
        this.collectedTreasures = JSON.parse(treasuresData) as Treasure[];
      if (achievementsData)
        this.achievements = JSON.parse(achievementsData) as Achievement[];
      if (streakData) this.dailyStreak = JSON.parse(streakData) as number;
      if (activityData)
        this.lastActivityDate = JSON.parse(activityData) as string;
    } catch (error) {
      ToastAndroid.show("Failed to load reward data", ToastAndroid.LONG);
      // eslint-disable-next-line no-console
      console.error("Error loading reward data:", error);
    }
  }

  private async saveData() {
    try {
      await Promise.all([
        AsyncStorage.setItem(
          STORAGE_KEYS.REWARD_PROGRESS,
          JSON.stringify(this.progress),
        ),
        AsyncStorage.setItem(
          STORAGE_KEYS.COLLECTED_TREASURES,
          JSON.stringify(this.collectedTreasures),
        ),
        AsyncStorage.setItem(
          STORAGE_KEYS.ACHIEVEMENTS,
          JSON.stringify(this.achievements),
        ),
        AsyncStorage.setItem(
          STORAGE_KEYS.DAILY_STREAK,
          JSON.stringify(this.dailyStreak),
        ),
        AsyncStorage.setItem(
          STORAGE_KEYS.LAST_ACTIVITY_DATE,
          JSON.stringify(this.lastActivityDate),
        ),
      ]);
    } catch (error) {
      ToastAndroid.show("Failed to save reward data", ToastAndroid.LONG);
      console.error("Error saving reward data:", error);
    }
  }

  private updateStreak() {
    const today = new Date().toDateString();
    const lastDate = this.lastActivityDate
      ? new Date(this.lastActivityDate).toDateString()
      : "";

    if (today === lastDate) {
      // Already completed today
      return;
    }

    if (lastDate && this.isConsecutiveDay(lastDate, today)) {
      this.dailyStreak++;
    } else {
      this.dailyStreak = 1;
    }

    this.lastActivityDate = new Date().toISOString();

    if (this.dailyStreak > this.progress.bestStreak) {
      this.progress.bestStreak = this.dailyStreak;
    }
  }

  private isConsecutiveDay(lastDate: string, currentDate: string): boolean {
    const last = new Date(lastDate);
    const current = new Date(currentDate);
    const diffTime = Math.abs(current.getTime() - last.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 1;
  }

  private determineTreasureRarity(
    performance: number,
    streak: number,
  ): "common" | "rare" | "epic" | "legendary" {
    const random = Math.random();

    // Legendary: Very rare (2% chance, or perfect performance + high streak)
    if (random < 0.02 || (performance === 1.0 && streak >= 5)) {
      return "legendary";
    }

    // Epic: Rare (8% chance, or excellent performance + streak)
    if (random < 0.1 || (performance >= 0.9 && streak >= 3)) {
      return "epic";
    }

    // Rare: Uncommon (20% chance, or good performance)
    if (random < 0.3 || performance >= 0.8) {
      return "rare";
    }

    // Common: Most frequent
    return "common";
  }

  private checkAchievements(
    activity: string,
    value: number = 1,
  ): Achievement[] {
    const _newAchievements: Achievement[] = [];

    this.achievements.forEach((achievement) => {
      if (achievement.isUnlocked) return;

      let shouldUnlock = false;

      switch (achievement.id) {
        case "first_letter":
          if (activity === "tracing" && value > 0) {
            achievement.progress = 1;
            shouldUnlock = true;
          }
          break;
        case "letter_master":
          if (activity === "tracing") {
            achievement.progress = (achievement.progress ?? 0) + value;
            shouldUnlock =
              (achievement.progress ?? 0) >= (achievement.maxProgress ?? 1);
          }
          break;
        case "number_expert":
          if (activity === "number_tracing") {
            achievement.progress = (achievement.progress ?? 0) + value;
            shouldUnlock =
              (achievement.progress ?? 0) >= (achievement.maxProgress ?? 1);
          }
          break;
        case "counting_pro":
          if (activity === "counting") {
            achievement.progress = (achievement.progress ?? 0) + value;
            shouldUnlock =
              (achievement.progress ?? 0) >= (achievement.maxProgress ?? 1);
          }
          break;
        case "island_explorer":
          if (activity === "island_visit") {
            achievement.progress = (achievement.progress ?? 0) + value;
            shouldUnlock =
              (achievement.progress ?? 0) >= (achievement.maxProgress ?? 1);
          }
          break;
        case "ocean_navigator":
          if (activity === "island_unlock") {
            achievement.progress = (achievement.progress ?? 0) + value;
            achievement.progress += value;
            shouldUnlock =
              achievement.progress >= (achievement.maxProgress ?? 1);
          }
          break;
        case "daily_adventurer":
          if (activity === "daily_streak") {
            achievement.progress = this.dailyStreak;
            shouldUnlock =
              achievement.progress >= (achievement.maxProgress ?? 1);
          }
          break;
        case "week_warrior":
          if (activity === "daily_streak") {
            achievement.progress = this.dailyStreak;
            shouldUnlock =
              achievement.progress >= (achievement.maxProgress ?? 1);
          }
          break;
      }

      if (shouldUnlock) {
        achievement.isUnlocked = true;
        achievement.progress = achievement.maxProgress;
        _newAchievements.push(achievement);
        this.progress.achievementsUnlocked++;
      }
    });

    return _newAchievements;
  }

  async awardTreasure(
    activity: string,
    performance: number = 1.0,
    isPerfect: boolean = false,
    isFirstTime: boolean = false,
    speed: number = 1.0,
  ): Promise<RewardResult> {
    // Update streak
    this.updateStreak();

    // Determine treasure rarity based on performance
    const rarity = this.determineTreasureRarity(performance, this.dailyStreak);
    const treasure = getRandomTreasure(rarity);

    // Calculate points
    const points = calculateRewardPoints(
      treasure.points,
      isPerfect,
      this.dailyStreak,
      isFirstTime,
      speed,
      performance,
    );

    // Add treasure to collection
    this.collectedTreasures.push(treasure);
    this.progress.totalTreasures++;
    this.progress.totalPoints += points;

    // Check for new achievements
    const _newAchievements = this.checkAchievements(activity, 1);

    // Save data
    await this.saveData();

    return {
      treasure,
      points,
      isNewAchievement: _newAchievements.length > 0,
      achievements: _newAchievements,
      streak: this.dailyStreak,
    };
  }

  async unlockIsland(): Promise<void> {
    this.progress.islandsUnlocked++;
    await this.saveData();
  }

  async visitIsland(): Promise<void> {
    await this.saveData();
  }

  // Getters
  getProgress(): RewardProgress {
    return { ...this.progress };
  }

  getCollectedTreasures(): Treasure[] {
    return [...this.collectedTreasures];
  }

  getAchievements(): Achievement[] {
    return [...this.achievements];
  }

  getDailyStreak(): number {
    return this.dailyStreak;
  }

  getTreasureCountByRarity(): Record<string, number> {
    const counts: Record<string, number> = {};
    this.collectedTreasures.forEach((treasure) => {
      counts[treasure.rarity] = (counts[treasure.rarity] || 0) + 1;
    });
    return counts;
  }

  getTotalValue(): number {
    return this.collectedTreasures.reduce(
      (total, treasure) => total + treasure.points,
      0,
    );
  }

  // Additional methods for station management
  getUserKeys(): number {
    // For now, return 0. This should be implemented based on your key system
    return 0;
  }

  awardPoints(points: number): void {
    this.progress.totalPoints += points;
    void this.saveData();
  }

  generateTreasure(
    rarity: "common" | "rare" | "epic" | "legendary",
  ): Treasure | null {
    // Generate a random treasure of the specified rarity
    const treasures = this.collectedTreasures.filter(
      (t) => t.rarity === rarity,
    );
    if (treasures.length === 0) {
      // Fallback to any treasure if none of specified rarity
      return this.collectedTreasures[0] || null;
    }
    return treasures[Math.floor(Math.random() * treasures.length)];
  }

  awardKeys(keys: number): void {
    // For now, just log. This should be implemented based on your key system
    console.log(`Awarded ${keys} keys`);
  }

  // Reset data (for testing or user reset)
  async resetData(): Promise<void> {
    this.progress = {
      totalTreasures: 0,
      totalPoints: 0,
      currentStreak: 0,
      bestStreak: 0,
      islandsUnlocked: 0,
      achievementsUnlocked: 0,
      lastRewardDate: new Date().toISOString(),
    };
    this.collectedTreasures = [];
    this.achievements = [];
    this.dailyStreak = 0;
    this.lastActivityDate = "";
    await this.saveData();
  }
}

// Export singleton instance
export const rewardManager = new RewardManager();
