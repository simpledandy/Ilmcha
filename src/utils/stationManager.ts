import type { Station } from "../types/common";
import {
  getStationsByIsland,
  getStationById,
} from "../constants/stations/stations";
import { storage } from "./storage";
import { rewardManager } from "./rewardManager";

export interface StationProgress {
  stationId: string;
  completedTasks: string[];
  totalScore: number;
  isCompleted: boolean;
  lastPlayed: string;
  bestScore: number;
}

export interface IslandProgress {
  islandId: string;
  unlockedStations: string[];
  totalScore: number;
  completedStations: number;
  totalStations: number;
}

class StationManager {
  private static instance: StationManager;
  private progressCache: Map<string, StationProgress> = new Map();
  private islandProgressCache: Map<string, IslandProgress> = new Map();

  static getInstance(): StationManager {
    if (!StationManager.instance) {
      StationManager.instance = new StationManager();
    }
    return StationManager.instance;
  }

  // Initialize station manager
  async initialize(): Promise<void> {
    await this.loadProgress();
  }

  // Load progress from storage
  private async loadProgress(): Promise<void> {
    try {
      const progressData = await storage.getStationProgress();
      if (progressData) {
        this.progressCache = new Map(Object.entries(progressData)) as Map<
          string,
          StationProgress
        >;
      }

      const islandData = await storage.getIslandProgress();
      if (islandData) {
        this.islandProgressCache = new Map(Object.entries(islandData)) as Map<
          string,
          IslandProgress
        >;
      }
    } catch (error) {
      console.error("Failed to load station progress:", error);
    }
  }

  // Save progress to storage
  private async saveProgress(): Promise<void> {
    try {
      const progressData = Object.fromEntries(this.progressCache);
      await storage.setStationProgress(progressData);

      const islandData = Object.fromEntries(this.islandProgressCache);
      await storage.setIslandProgress(islandData);
    } catch (error) {
      console.error("Failed to save station progress:", error);
    }
  }

  // Get station progress
  getStationProgress(stationId: string): StationProgress | null {
    return this.progressCache.get(stationId) || null;
  }

  // Get island progress
  getIslandProgress(islandId: string): IslandProgress {
    const cached = this.islandProgressCache.get(islandId);
    if (cached) return cached;

    // Calculate island progress
    const stations = getStationsByIsland(islandId);
    const unlockedStations: string[] = [];
    let totalScore = 0;
    let completedStations = 0;

    stations.forEach((station) => {
      const progress = this.getStationProgress(station.id);
      if (progress) {
        totalScore += progress.totalScore;
        if (progress.isCompleted) {
          completedStations++;
        }
      }

      // Check if station should be unlocked
      if (this.isStationUnlocked(station, islandId)) {
        unlockedStations.push(station.id);
      }
    });

    const islandProgress: IslandProgress = {
      islandId,
      unlockedStations,
      totalScore,
      completedStations,
      totalStations: stations.length,
    };

    this.islandProgressCache.set(islandId, islandProgress);
    return islandProgress;
  }

  // Check if station is unlocked
  private isStationUnlocked(station: Station, islandId: string): boolean {
    // First station is always unlocked
    if ((station.requiredKeys || 0) === 0) return true;

    // Check if user has enough keys to unlock this station
    const userKeys = rewardManager.getUserKeys();
    if (userKeys >= (station.requiredKeys || 0)) return true;

    // Check if previous stations are completed
    const stations = getStationsByIsland(islandId);
    const stationIndex = stations.findIndex((s) => s.id === station.id);

    if (stationIndex <= 0) return true;

    // Check if previous station is completed
    const previousStation = stations[stationIndex - 1];
    const previousProgress = this.getStationProgress(previousStation.id);

    return previousProgress?.isCompleted || false;
  }

  // Complete a task
  async completeTask(
    stationId: string,
    taskId: string,
    success: boolean,
    score: number,
  ): Promise<void> {
    const station = getStationById(stationId);
    if (!station) return;

    let progress = this.getStationProgress(stationId);
    if (!progress) {
      progress = {
        stationId,
        completedTasks: [],
        totalScore: 0,
        isCompleted: false,
        lastPlayed: new Date().toISOString(),
        bestScore: 0,
      };
    }

    // Update progress
    if (success && !progress.completedTasks.includes(taskId)) {
      progress.completedTasks.push(taskId);
      progress.totalScore += score;
    }

    progress.lastPlayed = new Date().toISOString();
    progress.bestScore = Math.max(progress.bestScore, progress.totalScore);

    // Check if station is completed
    const allTasksCompleted = station.tasks.every((task) =>
      progress.completedTasks.includes(task.id),
    );

    if (allTasksCompleted && !progress.isCompleted) {
      progress.isCompleted = true;

      // Award station completion rewards
      this.awardStationCompletion(station);
    }

    // Save progress
    this.progressCache.set(stationId, progress);
    if (station.islandId) {
      this.islandProgressCache.delete(station.islandId); // Invalidate island cache
    }
    await this.saveProgress();
  }

  // Award station completion rewards
  private awardStationCompletion(station: Station): void {
    const baseReward = 50; // Base points for completing a station
    const bonusMultiplier = 1.5; // Bonus for completing all tasks

    const totalReward = Math.floor(baseReward * bonusMultiplier);

    // Award points for completing the station
    rewardManager.awardPoints(totalReward);

    // Generate and award treasure
    const treasureRarity = this.getTreasureRarityForStation(station);
    const treasure = rewardManager.generateTreasure(treasureRarity);
    if (treasure) {
      void rewardManager.awardTreasure(
        "station_completion",
        1.0,
        false,
        false,
        1.0,
      );
    }

    // Award keys if station provides them
    if (station.rewards?.keys) {
      rewardManager.awardKeys(station.rewards.keys);
    }
  }

  // Get treasure rarity based on station difficulty
  private getTreasureRarityForStation(
    station: Station,
  ): "common" | "rare" | "epic" | "legendary" {
    const difficulty = station.difficulty || "easy";

    switch (difficulty) {
      case "easy":
        return "common";
      case "medium":
        return "rare";
      case "hard":
        return "epic";
      default:
        return "common";
    }
  }

  // Get available stations for an island
  getAvailableStations(islandId: string): Station[] {
    const stations = getStationsByIsland(islandId);
    const userKeys = rewardManager.getUserKeys();

    return stations.filter((station) => {
      // Check if user has enough keys
      if ((station.requiredKeys || 0) > userKeys) return false;

      // Check if previous stations are completed
      const stationIndex = stations.findIndex((s) => s.id === station.id);
      if (stationIndex <= 0) return true;

      const previousStation = stations[stationIndex - 1];
      const previousProgress = this.getStationProgress(previousStation.id);

      return previousProgress?.isCompleted || false;
    });
  }

  // Get next recommended station
  getNextRecommendedStation(islandId: string): Station | null {
    const availableStations = this.getAvailableStations(islandId);

    // Return first incomplete station
    return (
      availableStations.find((station) => {
        const progress = this.getStationProgress(station.id);
        return !progress?.isCompleted;
      }) || null
    );
  }

  // Reset progress for a station
  async resetStationProgress(stationId: string): Promise<void> {
    this.progressCache.delete(stationId);
    await this.saveProgress();
  }

  // Reset progress for an island
  async resetIslandProgress(islandId: string): Promise<void> {
    const stations = getStationsByIsland(islandId);
    stations.forEach((station) => {
      this.progressCache.delete(station.id);
    });
    this.islandProgressCache.delete(islandId);
    await this.saveProgress();
  }

  // Get overall progress statistics
  getOverallProgress(): {
    totalStations: number;
    completedStations: number;
    totalScore: number;
    averageScore: number;
  } {
    let totalStations = 0;
    let completedStations = 0;
    let totalScore = 0;

    this.progressCache.forEach((progress) => {
      totalStations++;
      if (progress.isCompleted) {
        completedStations++;
      }
      totalScore += progress.totalScore;
    });

    return {
      totalStations,
      completedStations,
      totalScore,
      averageScore:
        totalStations > 0 ? Math.round(totalScore / totalStations) : 0,
    };
  }

  // Export progress data
  exportProgress(): Record<string, StationProgress> {
    return Object.fromEntries(this.progressCache);
  }

  // Import progress data
  async importProgress(data: Record<string, StationProgress>): Promise<void> {
    this.progressCache = new Map(Object.entries(data));
    this.islandProgressCache.clear(); // Clear island cache to recalculate
    await this.saveProgress();
  }
}

export const stationManager = StationManager.getInstance();
