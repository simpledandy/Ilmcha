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

// Container style type
export type ContainerStyle = ViewStyle;

export type Segment = {
  points: { x: number; y: number }[];
  isCritical?: boolean;
}

export type AdventureProps = {
  islandId: string;
  topic: string;
  onComplete?: () => void;
}
export type IslandId = "numbers" | "letters" | "shapes";