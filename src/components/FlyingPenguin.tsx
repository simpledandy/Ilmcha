import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';
import { PenguinImages } from '@constants/images/images';
import { useAudioPlayer } from '@hooks/useAudioPlayer';
import { useFlyingPenguinAnimation } from '@hooks/useFlyingPenguinAnimation';

export const FlyingPenguin = () => {
  useAudioPlayer('whereToFly', { autoPlay: true });
  const { animatedStyle } = useFlyingPenguinAnimation();

  return (
    <Animated.Image
      source={PenguinImages.poses.flyingOnPlane}
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