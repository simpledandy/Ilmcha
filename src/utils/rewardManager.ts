import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { ToastAndroid } from 'react-native';
import { Treasure, Achievement, RewardProgress, calculateRewardPoints, getRandomTreasure } from '../constants/rewards/rewards';

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
  private lastActivityDate: string = '';

  constructor() {
    this.loadData();
  }

  private async loadData() {
    try {
      const [progressData, treasuresData, achievementsData, streakData, activityData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.REWARD_PROGRESS),
        AsyncStorage.getItem(STORAGE_KEYS.COLLECTED_TREASURES),
        AsyncStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS),
        AsyncStorage.getItem(STORAGE_KEYS.DAILY_STREAK),
        AsyncStorage.getItem(STORAGE_KEYS.LAST_ACTIVITY_DATE),
      ]);

      if (progressData) this.progress = JSON.parse(progressData);
      if (treasuresData) this.collectedTreasures = JSON.parse(treasuresData);
      if (achievementsData) this.achievements = JSON.parse(achievementsData);
      if (streakData) this.dailyStreak = JSON.parse(streakData);
      if (activityData) this.lastActivityDate = JSON.parse(activityData);
    } catch (error) {
      ToastAndroid.show('Failed to load reward data', ToastAndroid.LONG);
      console.error('Error loading reward data:', error);
    }
  }

  private async saveData() {
    try {
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.REWARD_PROGRESS, JSON.stringify(this.progress)),
        AsyncStorage.setItem(STORAGE_KEYS.COLLECTED_TREASURES, JSON.stringify(this.collectedTreasures)),
        AsyncStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(this.achievements)),
        AsyncStorage.setItem(STORAGE_KEYS.DAILY_STREAK, JSON.stringify(this.dailyStreak)),
        AsyncStorage.setItem(STORAGE_KEYS.LAST_ACTIVITY_DATE, JSON.stringify(this.lastActivityDate)),
      ]);
    } catch (error) {
      ToastAndroid.show('Failed to save reward data', ToastAndroid.LONG);
      console.error('Error saving reward data:', error);
    }
  }

  private updateStreak() {
    const today = new Date().toDateString();
    const lastDate = this.lastActivityDate ? new Date(this.lastActivityDate).toDateString() : '';

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

  private determineTreasureRarity(performance: number, streak: number): 'common' | 'rare' | 'epic' | 'legendary' {
    const random = Math.random();
    
    // Legendary: Very rare (2% chance, or perfect performance + high streak)
    if (random < 0.02 || (performance === 1.0 && streak >= 5)) {
      return 'legendary';
    }
    
    // Epic: Rare (8% chance, or excellent performance + streak)
    if (random < 0.10 || (performance >= 0.9 && streak >= 3)) {
      return 'epic';
    }
    
    // Rare: Uncommon (20% chance, or good performance)
    if (random < 0.30 || performance >= 0.8) {
      return 'rare';
    }
    
    // Common: Most frequent
    return 'common';
  }

  private checkAchievements(activity: string, value: number = 1): Achievement[] {
    const newAchievements: Achievement[] = [];
    
    this.achievements.forEach(achievement => {
      if (achievement.unlocked) return;

      let shouldUnlock = false;
      
      switch (achievement.id) {
        case 'first_letter':
          if (activity === 'tracing' && value > 0) {
            achievement.progress = 1;
            shouldUnlock = true;
          }
          break;
        case 'letter_master':
          if (activity === 'tracing') {
            achievement.progress += value;
            shouldUnlock = achievement.progress >= achievement.maxProgress;
          }
          break;
        case 'number_expert':
          if (activity === 'number_tracing') {
            achievement.progress += value;
            shouldUnlock = achievement.progress >= achievement.maxProgress;
          }
          break;
        case 'counting_pro':
          if (activity === 'counting') {
            achievement.progress += value;
            shouldUnlock = achievement.progress >= achievement.maxProgress;
          }
          break;
        case 'island_explorer':
          if (activity === 'island_visit') {
            achievement.progress += value;
            shouldUnlock = achievement.progress >= achievement.maxProgress;
          }
          break;
        case 'ocean_navigator':
          if (activity === 'island_unlock') {
            achievement.progress += value;
            shouldUnlock = achievement.progress >= achievement.maxProgress;
          }
          break;
        case 'daily_adventurer':
          if (activity === 'daily_streak') {
            achievement.progress = this.dailyStreak;
            shouldUnlock = achievement.progress >= achievement.maxProgress;
          }
          break;
        case 'week_warrior':
          if (activity === 'daily_streak') {
            achievement.progress = this.dailyStreak;
            shouldUnlock = achievement.progress >= achievement.maxProgress;
          }
          break;
      }

      if (shouldUnlock) {
        achievement.unlocked = true;
        achievement.progress = achievement.maxProgress;
        newAchievements.push(achievement);
        this.progress.achievementsUnlocked++;
      }
    });

    return newAchievements;
  }

  async awardTreasure(
    activity: string,
    performance: number = 1.0,
    isPerfect: boolean = false,
    isFirstTime: boolean = false,
    speed: number = 1.0
  ): Promise<RewardResult> {
    // Update streak
    this.updateStreak();

    // Determine treasure rarity based on performance
    const rarity = this.determineTreasureRarity(performance, this.dailyStreak);
    const treasure = getRandomTreasure(rarity);

    // Calculate points
    const points = calculateRewardPoints(
      treasure.value,
      isPerfect,
      this.dailyStreak,
      isFirstTime,
      speed,
      performance
    );

    // Add treasure to collection
    this.collectedTreasures.push(treasure);
    this.progress.totalTreasures++;
    this.progress.totalPoints += points;

    // Check for new achievements
    const newAchievements = this.checkAchievements(activity, 1);

    // Save data
    await this.saveData();

    return {
      treasure,
      points,
      isNewAchievement: newAchievements.length > 0,
      achievements: newAchievements,
      streak: this.dailyStreak,
    };
  }

  async unlockIsland(islandId: string): Promise<void> {
    this.progress.islandsUnlocked++;
    const newAchievements = this.checkAchievements('island_unlock', 1);
    await this.saveData();
  }

  async visitIsland(islandId: string): Promise<void> {
    const newAchievements = this.checkAchievements('island_visit', 1);
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
    this.collectedTreasures.forEach(treasure => {
      counts[treasure.rarity] = (counts[treasure.rarity] || 0) + 1;
    });
    return counts;
  }

  getTotalValue(): number {
    return this.collectedTreasures.reduce((total, treasure) => total + treasure.value, 0);
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
    this.lastActivityDate = '';
    await this.saveData();
  }
}

// Export singleton instance
export const rewardManager = new RewardManager(); 