import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import Images from '../constants/images';
import { playAudio } from '../utils/audio';

export const FlyingPenguin = () => {
  playAudio('whereToFly');
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(-20, { duration: 1000 }),
        withTiming(20, { duration: 1000 }),
        withDelay(500, withTiming(0, { duration: 1000 }))
      ),
      -1,
      true
    );
  }, [translateY]);

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
    width: 200,
    height: 200,
    position: 'absolute',
    bottom: 40,
    right: 40,
    zIndex: 5, // Ensure penguin stays above map but below buttons
  },
});