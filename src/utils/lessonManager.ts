import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { ToastAndroid } from 'react-native';
import { Lesson, lessonTemplates, createLesson } from '../constants/lessons/lessonTypes';
import { getTracingDataByCategory } from '../constants/tracing/tracingData';
import { rewardManager } from './rewardManager';

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
    this.loadData();
  }

  private async loadData() {
    try {
      const [completedData, historyData, islandData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.COMPLETED_LESSONS),
        AsyncStorage.getItem(STORAGE_KEYS.LESSON_HISTORY),
        AsyncStorage.getItem(STORAGE_KEYS.CURRENT_PROGRESS),
      ]);

      if (completedData) {
        this.completedLessons = new Set(JSON.parse(completedData));
      }
      if (historyData) {
        this.lessonHistory = JSON.parse(historyData);
      }
      if (islandData) {
        this.islandProgress = new Map(Object.entries(JSON.parse(islandData)));
      }
    } catch (error) {
      ToastAndroid.show('Failed to load lesson data', ToastAndroid.LONG);
      console.error('Error loading lesson data:', error);
    }
  }

  private async saveData() {
    try {
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.COMPLETED_LESSONS, JSON.stringify(Array.from(this.completedLessons))),
        AsyncStorage.setItem(STORAGE_KEYS.LESSON_HISTORY, JSON.stringify(this.lessonHistory)),
        AsyncStorage.setItem(STORAGE_KEYS.CURRENT_PROGRESS, JSON.stringify(Object.fromEntries(this.islandProgress))),
      ]);
    } catch (error) {
      ToastAndroid.show('Failed to save lesson data', ToastAndroid.LONG);
      console.error('Error saving lesson data:', error);
    }
  }

  // Create lessons for different islands
  async createIslandLessons(islandId: string): Promise<Lesson[]> {
    const lessons: Lesson[] = [];

    switch (islandId) {
      case 'numbers':
        // Create number tracing lessons
        for (let i = 1; i <= 10; i++) {
          const tracingData = getTracingDataByCategory('number', 'en');
          const numberData = tracingData.find(t => t.value === i.toString());
          
          if (numberData) {
            const lesson = lessonTemplates.numberTracing(i.toString());
            // Update the tracing exercise with actual path data
            lesson.steps = lesson.steps.map(step => {
              if (step.type === 'interaction' && step.content.type === 'tracing') {
                step.content.exercise.pathData = numberData.pathData;
                step.content.exercise.startPoint = numberData.startPoint;
                step.content.exercise.endPoint = numberData.endPoint;
              }
              return step;
            });
            lessons.push(lesson);
          }
        }

        // Add counting lessons
        lessons.push(lessonTemplates.countingFish(3));
        lessons.push(lessonTemplates.countingFish(5));
        lessons.push(lessonTemplates.countingFish(7));
        break;

      case 'alphabet':
        // Create letter tracing lessons
        const letters = ['A', 'B', 'C', 'D', 'E'];
        for (const letter of letters) {
          const tracingData = getTracingDataByCategory('letter', 'en');
          const letterData = tracingData.find(t => t.value === letter);
          
          if (letterData) {
            const lesson = lessonTemplates.letterTracing(letter, 'en');
            // Update the tracing exercise with actual path data
            lesson.steps = lesson.steps.map(step => {
              if (step.type === 'interaction' && step.content.type === 'tracing') {
                step.content.exercise.pathData = letterData.pathData;
                step.content.exercise.startPoint = letterData.startPoint;
                step.content.exercise.endPoint = letterData.endPoint;
              }
              return step;
            });
            lessons.push(lesson);
          }
        }

        // Add word matching lesson
        lessons.push(lessonTemplates.wordMatching([
          { word: 'Apple', image: 'apple' },
          { word: 'Ball', image: 'ball' },
          { word: 'Cat', image: 'cat' },
        ]));

        // Add alphabet quiz
        lessons.push(lessonTemplates.alphabetQuiz(['A', 'B', 'C']));
        break;

      case 'basics':
        // Create basic greeting lessons
        lessons.push(lessonTemplates.listeningExercise(['Hello', 'Goodbye', 'Thank you']));
        lessons.push(lessonTemplates.wordMatching([
          { word: 'Hello', image: 'hello' },
          { word: 'Goodbye', image: 'goodbye' },
        ]));
        break;

      default:
        // Default lessons for other islands
        lessons.push(lessonTemplates.countingFish(3));
        lessons.push(lessonTemplates.letterTracing('A', 'en'));
    }

    return lessons;
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
    // Check if this is the first lesson in any island
    const firstLessons = [
      'number_tracing_1',
      'letter_tracing_A_en',
      'listening_Hello_Goodbye_Thank_you'
    ];
    return firstLessons.includes(lessonId);
  }

  // Complete a lesson
  async completeLesson(lessonId: string, score: number, accuracy: number, timeSpent: number): Promise<void> {
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
      await rewardManager.visitIsland(islandId);
    }

    await this.saveData();
  }

  private getIslandFromLesson(lessonId: string): string | null {
    if (lessonId.startsWith('number_tracing_') || lessonId.startsWith('counting_fish_')) {
      return 'numbers';
    }
    if (lessonId.startsWith('letter_tracing_') || lessonId.startsWith('word_matching_') || lessonId.startsWith('alphabet_quiz_')) {
      return 'alphabet';
    }
    if (lessonId.startsWith('listening_')) {
      return 'basics';
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
    const totalScore = this.lessonHistory.reduce((sum, lesson) => sum + lesson.score, 0);
    const averageAccuracy = this.lessonHistory.length > 0 
      ? this.lessonHistory.reduce((sum, lesson) => sum + lesson.accuracy, 0) / this.lessonHistory.length
      : 0;
    const totalTimeSpent = this.lessonHistory.reduce((sum, lesson) => sum + lesson.timeSpent, 0);

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
      case 'alphabet':
        return this.completedLessons.size >= 5; // Complete 5 number lessons first
      case 'basics':
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
    await rewardManager.unlockIsland(islandId);
  }

  // Get recommended next lesson
  getRecommendedLesson(): string | null {
    // Find the first incomplete lesson
    const allIslands = ['numbers', 'alphabet', 'basics'];
    
    for (const islandId of allIslands) {
      const islandProgress = this.islandProgress.get(islandId);
      if (!islandProgress?.unlocked && this.shouldUnlockIsland(islandId)) {
        return null; // Should unlock this island first
      }
      
      if (islandProgress?.unlocked) {
        const availableLessons = this.getAvailableLessons(islandId);
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
}

// Export singleton instance
export const lessonManager = new LessonManager(); 