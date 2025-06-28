import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "../constants/storageKeys";
import { ToastAndroid } from "react-native";
import { Lesson } from "../constants/lessons/lessonTypes";
import { getTracingDataByCategory } from "../constants/tracing/tracingData";
import { rewardManager } from "./rewardManager";
import { lessons, LessonKey } from "../constants/lessons/lessons";
import { islands } from "../constants/map/mapData";

export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  score: number;
  accuracy: number;
  completedAt: string;
  attempts: number;
  timeSpent: number; // in seconds
}

export interface IslandProgress {
  islandId: string;
  unlocked: boolean;
  completedLessons: string[];
  totalScore: number;
  lastVisited: string;
}

export class LessonManager {
  private completedLessons: Set<string> = new Set();
  private lessonHistory: LessonProgress[] = [];
  private islandProgress: Map<string, IslandProgress> = new Map();

  constructor() {
    void this.loadData();
  }

  async loadData() {
    try {
      const [completedData, historyData, islandData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.COMPLETED_LESSONS),
        AsyncStorage.getItem(STORAGE_KEYS.LESSON_HISTORY),
        AsyncStorage.getItem(STORAGE_KEYS.CURRENT_PROGRESS),
      ]);

      if (completedData) {
        this.completedLessons = new Set<string>(
          JSON.parse(completedData) as string[],
        );
      }
      if (historyData) {
        this.lessonHistory = JSON.parse(historyData) as LessonProgress[];
      }
      if (islandData) {
        this.islandProgress = new Map<string, IslandProgress>(
          Object.entries(
            JSON.parse(islandData) as Record<string, IslandProgress>,
          ),
        );
      }
    } catch (error) {
      ToastAndroid.show("Failed to load lesson data", ToastAndroid.LONG);
      // eslint-disable-next-line no-console
      console.error("Error loading lesson data:", error);
    }
  }

  private async saveData() {
    try {
      await Promise.all([
        AsyncStorage.setItem(
          STORAGE_KEYS.COMPLETED_LESSONS,
          JSON.stringify(Array.from(this.completedLessons)),
        ),
        AsyncStorage.setItem(
          STORAGE_KEYS.LESSON_HISTORY,
          JSON.stringify(this.lessonHistory),
        ),
        AsyncStorage.setItem(
          STORAGE_KEYS.CURRENT_PROGRESS,
          JSON.stringify(Object.fromEntries(this.islandProgress)),
        ),
      ]);
    } catch (error) {
      ToastAndroid.show("Failed to save lesson data", ToastAndroid.LONG);
      // eslint-disable-next-line no-console
      console.error("Error saving lesson data:", error);
    }
  }

  // Create lessons for different islands
  async createIslandLessons(islandId: string): Promise<Lesson[]> {
    await this.loadData();
    const islandLessons: Lesson[] = [];

    // Find the island data
    const island = islands.find((i) => i.id === islandId);
    if (!island || !island.lessons) {
      return islandLessons;
    }

    // Get lessons for this island
    for (const lessonKey of island.lessons) {
      const lesson = lessons[lessonKey as LessonKey];
      if (lesson) {
        // For tracing lessons, update with actual path data
        if (lesson.category === "tracing") {
          const updatedLesson = { ...lesson };
          const tracingData = getTracingDataByCategory(
            lesson.id.includes("number") ? "number" : "letter",
            "en",
          );

          const targetData = (
            tracingData as Array<{
              value: string;
              pathData: string;
              startPoint: { x: number; y: number };
              endPoint: { x: number; y: number };
            }>
          ).find((t) => {
            if (lesson.id.includes("number")) {
              return t.value === lesson.id.split("_").pop();
            } else {
              return t.value === lesson.id.split("_")[2];
            }
          });

          if (targetData) {
            updatedLesson.steps = updatedLesson.steps.map((step) => {
              if (
                step.type === "interaction" &&
                (step.content as { type: string }).type === "tracing"
              ) {
                const tracingContent =
                  step.content as import("../types/common").TracingContent;
                tracingContent.exercise.pathData = targetData.pathData;
                tracingContent.exercise.startPoint = targetData.startPoint;
                tracingContent.exercise.endPoint = targetData.endPoint;
              }
              return step;
            });
            islandLessons.push(updatedLesson);
          } else {
            islandLessons.push(lesson);
          }
        } else {
          islandLessons.push(lesson);
        }
      }
    }

    return islandLessons;
  }

  // Get available lessons for an island
  async getAvailableLessons(islandId: string): Promise<Lesson[]> {
    const allLessons = await this.createIslandLessons(islandId);
    const islandProgress = this.islandProgress.get(islandId);

    if (!islandProgress) {
      // First time visiting this island
      return allLessons.slice(0, 3); // Show first 3 lessons
    }

    // Return lessons based on progress
    const completedCount = islandProgress.completedLessons.length;
    const availableCount = Math.min(completedCount + 3, allLessons.length);

    return allLessons.slice(0, availableCount);
  }

  // Check if a lesson is unlocked
  isLessonUnlocked(lessonId: string): boolean {
    return this.completedLessons.has(lessonId) || this.isFirstLesson(lessonId);
  }

  private isFirstLesson(lessonId: string): boolean {
    // Implement logic to check if this is the first lesson in an island
    // For now, just check if lessonId ends with '1' (example logic)
    return lessonId.endsWith("1");
  }

  // Complete a lesson
  async completeLesson(
    lessonId: string,
    score: number,
    accuracy: number,
    timeSpent: number,
  ): Promise<void> {
    const progress: LessonProgress = {
      lessonId,
      completed: true,
      score,
      accuracy,
      completedAt: new Date().toISOString(),
      attempts: 1, // You can track this from the interaction components
      timeSpent,
    };

    this.completedLessons.add(lessonId);
    this.lessonHistory.push(progress);

    // Update island progress
    const islandId = this.getIslandFromLesson(lessonId);
    if (islandId) {
      const islandProgress = this.islandProgress.get(islandId) || {
        islandId,
        unlocked: true,
        completedLessons: [],
        totalScore: 0,
        lastVisited: new Date().toISOString(),
      };

      islandProgress.completedLessons.push(lessonId);
      islandProgress.totalScore += score;
      islandProgress.lastVisited = new Date().toISOString();

      this.islandProgress.set(islandId, islandProgress);

      // Notify reward manager about island visit
      void rewardManager.visitIsland();
    }

    await this.saveData();
  }

  private getIslandFromLesson(lessonId: string): string | null {
    // Check each island's lessons to find which island this lesson belongs to
    for (const island of islands) {
      if (island.lessons && island.lessons.includes(lessonId as LessonKey)) {
        return island.id;
      }
    }

    // Fallback logic for backward compatibility
    if (
      lessonId.startsWith("number_tracing") ||
      lessonId.startsWith("counting_fish") ||
      lessonId.includes("number")
    ) {
      return "numbers";
    }
    if (
      lessonId.startsWith("letter_tracing") ||
      lessonId.includes("alphabet") ||
      lessonId.includes("word_matching")
    ) {
      return "alphabet";
    }
    if (lessonId.startsWith("basic_")) {
      return "basics";
    }
    if (lessonId.startsWith("color_")) {
      return "colors";
    }
    if (lessonId.startsWith("shape_")) {
      return "shapes";
    }
    if (lessonId.startsWith("family_")) {
      return "family";
    }
    if (lessonId.startsWith("food_")) {
      return "food";
    }
    if (
      lessonId.startsWith("greetings") ||
      lessonId.startsWith("feelings") ||
      lessonId.startsWith("weather") ||
      lessonId.startsWith("daily_routine") ||
      lessonId.includes("conversation")
    ) {
      return "conversation";
    }

    return null;
  }

  // Get lesson statistics
  getLessonStats(): {
    totalLessons: number;
    completedLessons: number;
    totalScore: number;
    averageAccuracy: number;
    totalTimeSpent: number;
  } {
    const totalLessons = this.lessonHistory.length;
    const completedLessons = this.completedLessons.size;
    const totalScore = this.lessonHistory.reduce(
      (sum, lesson) => sum + lesson.score,
      0,
    );
    const averageAccuracy =
      this.lessonHistory.length > 0
        ? this.lessonHistory.reduce((sum, lesson) => sum + lesson.accuracy, 0) /
          this.lessonHistory.length
        : 0;
    const totalTimeSpent = this.lessonHistory.reduce(
      (sum, lesson) => sum + lesson.timeSpent,
      0,
    );

    return {
      totalLessons,
      completedLessons,
      totalScore,
      averageAccuracy,
      totalTimeSpent,
    };
  }

  // Get island progress
  getIslandProgress(islandId: string): IslandProgress | null {
    return this.islandProgress.get(islandId) || null;
  }

  // Get all island progress
  getAllIslandProgress(): Map<string, IslandProgress> {
    return new Map(this.islandProgress);
  }

  // Check if an island should be unlocked
  shouldUnlockIsland(islandId: string): boolean {
    const islandProgress = this.islandProgress.get(islandId);
    if (islandProgress?.unlocked) return false;

    // Unlock conditions
    switch (islandId) {
      case "alphabet":
        return this.completedLessons.size >= 5; // Complete 5 number lessons first
      case "basics":
        return this.completedLessons.size >= 8; // Complete 8 lessons total
      default:
        return false;
    }
  }

  // Unlock an island
  async unlockIsland(islandId: string): Promise<void> {
    const islandProgress = this.islandProgress.get(islandId) || {
      islandId,
      unlocked: true,
      completedLessons: [],
      totalScore: 0,
      lastVisited: new Date().toISOString(),
    };

    islandProgress.unlocked = true;
    this.islandProgress.set(islandId, islandProgress);

    await this.saveData();
    void rewardManager.unlockIsland();
  }

  // Get recommended next lesson
  async getRecommendedLesson(): Promise<string | null> {
    // Find the first incomplete lesson
    const allIslands = ["numbers", "alphabet", "basics"];

    for (const islandId of allIslands) {
      const islandProgress = this.islandProgress.get(islandId);
      if (!islandProgress?.unlocked && this.shouldUnlockIsland(islandId)) {
        return null; // Should unlock this island first
      }

      if (islandProgress?.unlocked) {
        const availableLessons = await this.getAvailableLessons(islandId);
        for (const lesson of availableLessons) {
          if (!this.completedLessons.has(lesson.id)) {
            return lesson.id;
          }
        }
      }
    }

    return null;
  }

  // Reset all progress (for testing)
  async resetProgress(): Promise<void> {
    this.completedLessons.clear();
    this.lessonHistory = [];
    this.islandProgress.clear();
    await this.saveData();
  }

  // Get lesson statistics by island
  getIslandLessonStats(islandId: string): {
    totalLessons: number;
    completedLessons: number;
    totalScore: number;
    averageAccuracy: number;
    completionRate: number;
  } {
    const island = islands.find((i) => i.id === islandId);
    if (!island || !island.lessons) {
      return {
        totalLessons: 0,
        completedLessons: 0,
        totalScore: 0,
        averageAccuracy: 0,
        completionRate: 0,
      };
    }

    const islandLessonIds = island.lessons;
    const completedIslandLessons = this.lessonHistory.filter((lesson) =>
      islandLessonIds.includes(lesson.lessonId as LessonKey),
    );

    const totalLessons = islandLessonIds.length;
    const completedLessons = completedIslandLessons.length;
    const totalScore = completedIslandLessons.reduce(
      (sum, lesson) => sum + lesson.score,
      0,
    );
    const averageAccuracy =
      completedIslandLessons.length > 0
        ? completedIslandLessons.reduce(
            (sum, lesson) => sum + lesson.accuracy,
            0,
          ) / completedIslandLessons.length
        : 0;
    const completionRate =
      totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

    return {
      totalLessons,
      completedLessons,
      totalScore,
      averageAccuracy,
      completionRate,
    };
  }

  // Get next recommended lesson for an island
  getNextRecommendedLesson(islandId: string): string | null {
    const island = islands.find((i) => i.id === islandId);
    if (!island || !island.lessons) {
      return null;
    }

    const completedIslandLessons = this.lessonHistory
      .filter((lesson) =>
        island.lessons!.includes(lesson.lessonId as LessonKey),
      )
      .map((lesson) => lesson.lessonId);

    // Find the first lesson that hasn't been completed
    for (const lessonKey of island.lessons) {
      if (!completedIslandLessons.includes(lessonKey)) {
        return lessonKey;
      }
    }

    return null; // All lessons completed
  }

  // Get lesson progress for an island
  getIslandLessonProgress(islandId: string): {
    lessonId: string;
    completed: boolean;
    score: number;
    accuracy: number;
  }[] {
    const island = islands.find((i) => i.id === islandId);
    if (!island || !island.lessons) {
      return [];
    }

    return island.lessons.map((lessonKey) => {
      const progress = this.lessonHistory.find((p) => p.lessonId === lessonKey);
      return {
        lessonId: lessonKey,
        completed: progress?.completed ?? false,
        score: progress?.score ?? 0,
        accuracy: progress?.accuracy ?? 0,
      };
    });
  }

  // Get progress for a specific lesson
  getLessonProgress(lessonId: string): LessonProgress | null {
    return this.lessonHistory.find((p) => p.lessonId === lessonId) ?? null;
  }
}

// Export singleton instance
export const lessonManager = new LessonManager();
