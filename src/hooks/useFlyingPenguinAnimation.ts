import React from "react";
import {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  cancelAnimation,
  Easing,
} from "react-native-reanimated";

interface AnimationConfig {
  duration?: number;
  easing?: "linear" | "easeIn" | "easeOut" | "easeInOut";
  repeatCount?: number;
  reverse?: boolean;
}

export const useFlyingPenguinAnimation = (config: AnimationConfig = {}) => {
  const {
    duration = 2000,
    easing = "easeInOut",
    repeatCount = -1, // Infinite
    reverse = true,
  } = config;

  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);
  const scale = useSharedValue(1);

  // Animation timing functions
  const getTimingConfig = React.useCallback(
    (customDuration?: number) => {
      const timingDuration = customDuration || duration;

      switch (easing) {
        case "linear":
          return { duration: timingDuration };
        case "easeIn":
          return { duration: timingDuration, easing: Easing.in(Easing.ease) };
        case "easeOut":
          return { duration: timingDuration, easing: Easing.out(Easing.ease) };
        case "easeInOut":
        default:
          return {
            duration: timingDuration,
            easing: Easing.inOut(Easing.ease),
          };
      }
    },
    [duration, easing],
  );

  // Start the animation when the component mounts
  React.useEffect(() => {
    // Gentle floating motion with easing
    translateY.value = withRepeat(
      withSequence(
        withTiming(-10, getTimingConfig()),
        withTiming(10, getTimingConfig()),
      ),
      repeatCount,
      reverse,
    );

    // Gentle rotation with different timing
    rotate.value = withRepeat(
      withSequence(
        withTiming(5, getTimingConfig(3000)),
        withTiming(-5, getTimingConfig(3000)),
      ),
      repeatCount,
      reverse,
    );

    // Subtle scale animation for breathing effect
    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, getTimingConfig(4000)),
        withTiming(0.95, getTimingConfig(4000)),
      ),
      repeatCount,
      reverse,
    );

    // Cleanup function to cancel animations on unmount
    return () => {
      cancelAnimation(translateY);
      cancelAnimation(rotate);
      cancelAnimation(scale);
    };
  }, [
    duration,
    easing,
    repeatCount,
    reverse,
    translateY,
    rotate,
    scale,
    getTimingConfig,
  ]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
      { scale: scale.value },
    ],
  }));

  // Expose animation controls
  const pauseAnimation = React.useCallback(() => {
    cancelAnimation(translateY);
    cancelAnimation(rotate);
    cancelAnimation(scale);
  }, [translateY, rotate, scale]);

  const resumeAnimation = React.useCallback(() => {
    // Restart animations
    translateY.value = withRepeat(
      withSequence(
        withTiming(-10, getTimingConfig()),
        withTiming(10, getTimingConfig()),
      ),
      repeatCount,
      reverse,
    );

    rotate.value = withRepeat(
      withSequence(
        withTiming(5, getTimingConfig(3000)),
        withTiming(-5, getTimingConfig(3000)),
      ),
      repeatCount,
      reverse,
    );

    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, getTimingConfig(4000)),
        withTiming(0.95, getTimingConfig(4000)),
      ),
      repeatCount,
      reverse,
    );
  }, [repeatCount, reverse, translateY, rotate, scale, getTimingConfig]);

  const resetAnimation = React.useCallback(() => {
    translateY.value = 0;
    rotate.value = 0;
    scale.value = 1;
  }, [translateY, rotate, scale]);

  return {
    animatedStyle,
    pauseAnimation,
    resumeAnimation,
    resetAnimation,
    // Expose shared values for external control
    translateY,
    rotate,
    scale,
  };
};
