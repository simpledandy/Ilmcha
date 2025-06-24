import { ImageSourcePropType, ViewStyle } from 'react-native';
import { SharedValue } from 'react-native-reanimated';

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

// Reward data type
export interface RewardData {
  treasure: import('../constants/rewards/rewards').Treasure;
  points: number;
  streak: number;
}

// Lesson content types
export interface InstructionContent {
  text?: string;
  image?: string;
  audio?: string;
  animation?: string;
}

export interface TracingContent {
  type: 'tracing';
  exercise: import('../constants/lessons/lessonTypes').TracingExercise;
}

export interface CountingContent {
  type: 'counting';
  exercise: import('../constants/lessons/lessonTypes').CountingExercise;
}

export interface QuizContent {
  type: 'quiz';
  questions: import('../constants/lessons/lessonTypes').QuizQuestion[];
}

export interface RewardContent {
  type: 'reward';
  message: string;
  audio?: string;
}

export type LessonContent = 
  | InstructionContent 
  | TracingContent 
  | CountingContent 
  | QuizContent 
  | RewardContent;

// Function parameter types
export type LessonTemplateParams = (string | number | boolean | string[] | Array<{ word: string; image: string }>)[];

// Style types
export type ContainerStyle = ViewStyle; 