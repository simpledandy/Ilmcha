import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
} from "react-native-reanimated";

export function useCountingAnimation(itemCount: number) {
  const itemScales = useSharedValue<number[]>(Array<number>(itemCount).fill(1));
  const feedbackScale = useSharedValue(0);
  const successScale = useSharedValue(0);

  const animateItem = (index: number) => {
    const newScales = [...itemScales.value];
    newScales[index] = withSequence(
      withTiming(1.3, { duration: 150 }),
      withTiming(1, { duration: 150 }),
    ) as unknown as number;
    itemScales.value = newScales;
  };

  const animateFeedback = () => {
    feedbackScale.value = withSpring(1, { damping: 10, stiffness: 200 });
  };

  const animateSuccess = () => {
    successScale.value = withSpring(1, { damping: 10, stiffness: 200 });
  };

  const resetFeedback = () => {
    feedbackScale.value = 0;
  };

  const feedbackAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: feedbackScale.value }],
  }));

  const successAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: successScale.value }],
  }));

  return {
    itemScales,
    feedbackScale,
    successScale,
    feedbackAnimatedStyle,
    successAnimatedStyle,
    animateItem,
    animateFeedback,
    animateSuccess,
    resetFeedback,
  };
}
