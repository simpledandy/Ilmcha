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

// Station System
export interface Station {
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
  theme: string;
  description: string;
  backgroundImage: string;
  isUnlocked: boolean;
  requiredKeys?: number;
  tasks: StationTask[];
  position: { x: number; y: number };
  visualEffects?: {
    particles?: boolean;
    ambientSound?: string;
    lighting?: "day" | "night" | "mystical";
  };
  // Additional properties used in the code
  islandId?: string;
  difficulty?: "easy" | "medium" | "hard";
  rewards?: {
    keys?: number;
    coins?: number;
    stars?: number;
  };
}

export interface StationTask {
  id: string;
  type: "warmup" | "learning" | "quiz" | "challenge" | "reward";
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  estimatedDuration: number; // in minutes
  points: number;
  rewards: TaskReward[];
  isCompleted: boolean;
  isUnlocked: boolean;
  // Task-specific data
  content: TaskContent;
  // Special properties for final tasks
  unlocksNextStation?: boolean;
  unlocksNextIsland?: boolean;
}

export interface TaskContent {
  type:
    | "counting"
    | "quiz"
    | "tracing"
    | "matching"
    | "listening"
    | "interactive";
  data:
    | CountingData
    | QuizData
    | TracingData
    | MatchingData
    | ListeningData
    | InteractiveData;
  audioFile?: string;
  backgroundImage?: string;
  interactiveElements?: InteractiveElement[];
}

export interface CountingData {
  targetNumber: number;
  items: Array<{
    id: string;
    type: string;
    position: { x: number; y: number };
    image?: string;
  }>;
  question: string;
  audioFile?: string;
}

export interface QuizData {
  questions: Array<{
    id: string;
    question: string;
    options: string[];
    correctAnswer: string;
    points: number;
  }>;
}

export interface TracingData {
  target: string;
  pathData: string;
  startPoint: { x: number; y: number };
  endPoint: { x: number; y: number };
  difficulty: "easy" | "medium" | "hard";
  hints: string[];
}

export interface MatchingData {
  pairs: Array<{
    id: string;
    item1: { id: string; image: string; label: string };
    item2: { id: string; image: string; label: string };
  }>;
}

export interface ListeningData {
  message: string;
  audioFile?: string;
}

export interface InteractiveData {
  elements: InteractiveElement[];
  instructions: string;
}

export interface InteractiveElement {
  id: string;
  type: "clickable" | "draggable" | "animated";
  position: { x: number; y: number };
  image?: string;
  audio?: string;
  action: "count" | "select" | "move" | "trigger";
}

export interface TaskReward {
  type: "coins" | "stars" | "treasure" | "key" | "special";
  value: number;
  itemId?: string;
  message: string;
  audioFile?: string;
}

// Island System Enhancement
export interface Island {
  id: string;
  name: string;
  title: string;
  subtitle: string;
  theme:
    | "numbers"
    | "letters"
    | "colors"
    | "shapes"
    | "animals"
    | "food"
    | "family";
  backgroundImage: string;
  isUnlocked: boolean;
  stations: Station[];
  totalStations: number;
  completedStations: number;
  requiredKeys: number;
  position: { x: number; y: number };
  // Island-specific properties
  difficulty: "beginner" | "intermediate" | "advanced";
  ageGroup: "2-3" | "4-5" | "6-7" | "7+";
  estimatedDuration: number; // total time to complete island
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

// Lesson content types
export interface InstructionContent {
  text?: string;
  image?: string;
  audio?: string;
  animation?: string;
}

export interface TracingContent {
  type: "tracing";
  exercise: import("../constants/lessons/lessonTypes").TracingExercise;
}

export interface CountingContent {
  type: "counting";
  exercise: import("../constants/lessons/lessonTypes").CountingExercise;
}

export interface QuizContent {
  type: "quiz";
  questions: import("../constants/lessons/lessonTypes").QuizQuestion[];
}

export interface MatchingContent {
  type: "matching";
  exercise: import("../constants/lessons/lessonTypes").MatchingExercise;
}

export interface ListeningContent {
  type: "listening";
  words: Array<{
    word: string;
    audio: string;
    image: string;
  }>;
}

export interface RewardContent {
  type: "reward";
  message: string;
  audio?: string;
}

export type LessonContent =
  | InstructionContent
  | TracingContent
  | CountingContent
  | QuizContent
  | MatchingContent
  | ListeningContent
  | RewardContent;

// Function parameter types
export type LessonTemplateParams = (
  | string
  | number
  | boolean
  | string[]
  | Array<{ word: string; image: string }>
)[];

// Style types
export type ContainerStyle = ViewStyle;
