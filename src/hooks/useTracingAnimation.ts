import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
} from "react-native-reanimated";

export function useTracingAnimation() {
  const targetScale = useSharedValue(1);
  const successScale = useSharedValue(0);
  const hintOpacity = useSharedValue(0);

  const animateSuccess = () => {
    successScale.value = withSpring(1, { damping: 10, stiffness: 200 });
    targetScale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 200 }),
        withTiming(1, { duration: 200 }),
      ),
      3,
      true,
    );
  };

  const animateHint = () => {
    hintOpacity.value = withTiming(1, { duration: 300 });
  };

  const resetSuccess = () => {
    successScale.value = 0;
    targetScale.value = 1;
  };

  const resetHint = () => {
    hintOpacity.value = 0;
  };

  const targetAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: targetScale.value }],
  }));

  const successAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: successScale.value }],
  }));

  const hintAnimatedStyle = useAnimatedStyle(() => ({
    opacity: hintOpacity.value,
  }));

  return {
    targetAnimatedStyle,
    successAnimatedStyle,
    hintAnimatedStyle,
    animateSuccess,
    animateHint,
    resetSuccess,
    resetHint,
  };
}
