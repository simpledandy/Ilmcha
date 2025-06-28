import { useEffect, useState } from "react";
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  withRepeat,
  withDelay,
} from "react-native-reanimated";

export function useRewardAnimation(
  isVisible: boolean,
  autoHideMs: number = 4000,
  onAutoHide?: () => void,
) {
  const [showContent, setShowContent] = useState(false);
  const treasureScale = useSharedValue(0);
  const treasureRotation = useSharedValue(0);
  const pointsScale = useSharedValue(0);
  const streakScale = useSharedValue(0);

  useEffect(() => {
    let autoHideTimeout: ReturnType<typeof setTimeout> | undefined;
    if (isVisible) {
      setTimeout(() => setShowContent(true), 500);
      treasureScale.value = withDelay(
        800,
        withSpring(1, { damping: 10, stiffness: 200 }),
      );
      treasureRotation.value = withDelay(
        800,
        withRepeat(
          withSequence(
            withTiming(10, { duration: 200 }),
            withTiming(-10, { duration: 200 }),
            withTiming(0, { duration: 200 }),
          ),
          3,
          true,
        ),
      );
      pointsScale.value = withDelay(
        1200,
        withSpring(1, { damping: 8, stiffness: 300 }),
      );
      streakScale.value = withDelay(
        1400,
        withSpring(1, { damping: 8, stiffness: 300 }),
      );
      if (onAutoHide) {
        autoHideTimeout = setTimeout(onAutoHide, autoHideMs);
      }
    } else {
      treasureScale.value = 0;
      treasureRotation.value = 0;
      pointsScale.value = 0;
      streakScale.value = 0;
      setShowContent(false);
    }
    return () => {
      if (autoHideTimeout) clearTimeout(autoHideTimeout);
    };
  }, [
    isVisible,
    autoHideMs,
    onAutoHide,
    pointsScale,
    streakScale,
    treasureRotation,
    treasureScale,
  ]);

  const treasureAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: treasureScale.value },
      { rotate: `${treasureRotation.value}deg` },
    ],
  }));
  const pointsAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pointsScale.value }],
  }));
  const streakAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: streakScale.value }],
  }));

  return {
    showContent,
    treasureAnimatedStyle,
    pointsAnimatedStyle,
    streakAnimatedStyle,
    treasureScale,
    treasureRotation,
    pointsScale,
    streakScale,
  };
}
