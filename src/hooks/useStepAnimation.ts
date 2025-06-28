import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export function useStepAnimation(progress: number) {
  const stepOpacity = useSharedValue(0);
  const stepScale = useSharedValue(0.8);
  const progressBarWidth = useSharedValue(0);

  const animateStep = () => {
    stepOpacity.value = withTiming(1, { duration: 500 });
    stepScale.value = withSpring(1, { damping: 15, stiffness: 150 });
    progressBarWidth.value = withTiming(progress, { duration: 300 });
  };

  const stepAnimatedStyle = useAnimatedStyle(() => ({
    opacity: stepOpacity.value,
    transform: [{ scale: stepScale.value }],
  }));

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressBarWidth.value}%`,
  }));

  return { stepAnimatedStyle, progressAnimatedStyle, animateStep };
}
