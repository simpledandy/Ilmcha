import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { useAudio } from '@/src/providers/AudioProvider';
import { AppImage } from '@components/AppImage';
import { PenguinImages } from '../constants';

const FlyingPenguin = () => {
  const { play } = useAudio();
  const translateY = useSharedValue(0);

  useEffect(() => {
    // TODO: Implement isFirstOceanVisit and markOceanVisited in storage if needed
    // Play audio only on first visit
    play('whereToFly', true);
  }, [play]);

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

  const { width, height } = Dimensions.get('window');

  return (
    <View style={{ position: 'absolute', left: width * 0.5, top: height * 0.7 }}>
      <Animated.View style={[styles.penguin, animatedStyle]}>
        <AppImage
          source={PenguinImages.poses.flyingOnPlane}
          style={styles.penguin}
          contentFit="contain"
        />
      </Animated.View>
    </View>
  );
};

export { FlyingPenguin };
const styles = StyleSheet.create({
  penguin: {
    width: 200,
    height: 200,
    position: 'absolute',
  },
});