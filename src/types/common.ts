import { ImageSourcePropType, ViewStyle } from "react-native";
import { SharedValue } from "react-native-reanimated";

// Error types
export interface ErrorInfo {
  componentStack?: string;
}

// Animation style types
export type AnimatedStyle = SharedValue<ViewStyle> | ViewStyle;

// Image source type (for React Native Image components)
export type ImageSource = ImageSourcePropType;

// Generic context type for logging and error reporting
export type ContextData = Record<string, string | number | boolean | undefined>;

// Progress data type for treasure collection
export interface ProgressData {
  totalTreasures: number;
  totalPoints: number;
  currentStreak: number;
  bestStreak: number;
  islandsUnlocked: number;
  achievementsUnlocked: number;
  lastRewardDate: string;
}

// Enhanced Treasure System
export interface Treasure {
  id: string;
  name: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  type: "knowledge" | "currency" | "achievement" | "key" | "special";
  image?: ImageSource;
  description?: string;
  points: number;
  // Knowledge treasures unlock new content
  unlocksContent?: {
    type: "lesson" | "station" | "island";
    id: string;
  };
  // Currency treasures
  coinValue?: number;
  // Special rewards
  specialEffect?:
    | "character_skin"
    | "background"
    | "sound_effect"
    | "animation";
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon?: string;
  isUnlocked: boolean;
  progress?: number;
  maxProgress?: number;
  points: number;
  category: "learning" | "exploration" | "collection" | "streak";
}

// Simple Lesson System
export interface SimpleLesson {
  id: string;
  title: string;
  type: "tracing" | "counting" | "quiz" | "matching";
  content: {
    target?: string; // For tracing: "A", "1", etc.
    question?: string; // For quiz: "Count the fish"
    options?: string[]; // For quiz: ["3", "4", "5"]
    correctAnswer: string; // "4"
    image?: string; // Optional background
    audio?: string; // Optional audio file
  };
  points: number;
  difficulty: "easy" | "medium" | "hard";
  isCompleted?: boolean;
  isUnlocked?: boolean;
}

// Simple Station System
export interface SimpleStation {
  id: string;
  name: string;
  type:
    | "lake"
    | "cave"
    | "forest"
    | "garden"
    | "yard"
    | "castle"
    | "beach"
    | "mountain";
  lessons: SimpleLesson[];
  background: string;
  isUnlocked: boolean;
  isCompleted?: boolean;
}

// Simple Island System
export interface SimpleIsland {
  id: string;
  title: string;
  subtitle: string;
  background: string;
  stations: SimpleStation[];
  isUnlocked: boolean;
}

// Reward data type
export interface RewardData {
  treasure: Treasure;
  points: number;
  streak: number;
  coins?: number;
  stars?: number;
  keys?: number;
}

// Container style type
export type ContainerStyle = ViewStyle;
