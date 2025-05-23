import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  useSharedValue,
  withDelay,
} from 'react-native-reanimated';
import Images from '@constants/images';

export const FlyingPenguin = () => {
  const translateY = useSharedValue(0);

  React.useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(-20, { duration: 1000 }),
        withTiming(20, { duration: 1000 }),
        withDelay(500, withTiming(0, { duration: 1000 }))
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.Image
      source={Images.penguin.poses.flyingOnPlane}
      style={[styles.penguin, animatedStyle]}
      resizeMode="contain"
    />
  );
};

const styles = StyleSheet.create({
  penguin: {
    width: 80,
    height: 80,
    position: 'absolute',
    bottom: 40,
    right: 40,
  },
}); 