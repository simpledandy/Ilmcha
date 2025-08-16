import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Image, Pressable } from 'react-native';
import Animated, { useSharedValue, withSpring, withSequence, withTiming, useAnimatedStyle, runOnJS } from 'react-native-reanimated';
import { AppImage } from '@components/AppImage';
import ConfettiCannon from 'react-native-confetti-cannon';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface CountingProps {
  background: number;
  itemImage: number;
  positions: { x: number; y: number }[];
  onComplete?: () => void;
}

export const Counting: React.FC<CountingProps> = ({
  background,
  itemImage,
  positions,
  onComplete,
}) => {
  const [tapped, setTapped] = useState(Array(positions.length).fill(false));
  const [completed, setCompleted] = useState(false);

  const handleTap = (idx: number) => {
    if (tapped[idx]) return;

    const updated = [...tapped];
    updated[idx] = true;
    setTapped(updated);

    if (updated.every(Boolean)) {
      setCompleted(true);
      setTimeout(() => {
        onComplete?.();
      }, 1200);
    }
  };

  return (
    <View style={styles.container}>
      <AppImage source={background} style={styles.bg} contentFit="cover" />
      {positions.map((pos, idx) => {
        const scale = useSharedValue(1);
        const opacity = useSharedValue(1);

        const styleAnim = useAnimatedStyle(() => ({
          transform: [{ scale: scale.value }],
          opacity: opacity.value,
        }));

        const onPress = () => {
          scale.value = withSequence(withSpring(1.2), withSpring(1));
          opacity.value = withTiming(0.3, { duration: 300 });
          runOnJS(handleTap)(idx);
        };

        return (
          <Animated.View
            key={idx}
            style={[
              styles.itemWrapper,
              { left: pos.x * SCREEN_WIDTH - 40, top: pos.y * SCREEN_HEIGHT * 0.7 - 40 },
              styleAnim,
            ]}
          >
            <Pressable onPress={onPress}>
              <Image source={itemImage} style={styles.itemImage} contentFit="contain" />
            </Pressable>
          </Animated.View>
        );
      })}
      {completed && (
        <ConfettiCannon
          count={60}
          origin={{ x: SCREEN_WIDTH / 2, y: 0 }}
          autoStart
          fadeOut
          onAnimationEnd={() => setCompleted(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%', height: '100%' },
  bg: { ...StyleSheet.absoluteFillObject },
  itemWrapper: { position: 'absolute', width: 80, height: 80 },
  itemImage: { width: 80, height: 80 },
  celebration: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  confetti: { position: 'absolute', width: '100%', height: '100%' },
  penguin: { width: 150, height: 150, contentFit: 'contain' },
});
