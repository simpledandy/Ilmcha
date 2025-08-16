import React, { useEffect } from 'react';
import { StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  withSpring,
  withTiming,
  useAnimatedStyle,
  Easing,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { AppImage } from '../AppImage';
import { numbers, letters, shapes } from '@constants';
import { PenguinImages } from '@constants/images/images'; // if penguin comes from here
import { AdventureProps } from '@/src/types/common';

export const Intro: React.FC<AdventureProps> = ({ islandId, topic, onComplete }) => {

  const penguinY = useSharedValue(300);
  const mainScale = useSharedValue(0);

  // Map islandId to the correct images object
  const imageMap: Record<string, any> = {
    numbers,
    letters,
    shapes,
  };

  // Dynamically get the lesson image if available
  const mainImage = imageMap[islandId]?.[topic];

  const penguinStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: penguinY.value }],
  }));

  const mainStyle = useAnimatedStyle(() => ({
    transform: [{ scale: mainScale.value }],
  }));

  useEffect(() => {
    penguinY.value = withTiming(0, { duration: 600, easing: Easing.out(Easing.exp) });
    mainScale.value = withDelay(
      500,
      withSequence(
        withSpring(1.2, { damping: 5 }),
        withSpring(1, { damping: 5 })
      )
    );

    const timer = setTimeout(() => {
      onComplete?.();
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Pressable
      style={styles.container}
      onPress={onComplete}
    >
      <Animated.View style={[styles.penguin, penguinStyle]}>
        <AppImage source={PenguinImages.poses.wavingPink} style={styles.penguinImg} />
      </Animated.View>

      {mainImage && (
        <Animated.View style={[styles.mainSymbol, mainStyle]}>
          <AppImage source={mainImage} style={styles.mainImg} />
        </Animated.View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C6F7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  penguin: {
    position: 'absolute',
    bottom: 50,
  },
  penguinImg: {
    width: 140,
    height: 140,
    resizeMode: 'contain',
  },
  mainSymbol: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainImg: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});
