import React from 'react';
import { useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { Island } from './Island';
import Images from '../constants/images';
import { colors } from '../theme/colors';
import { islands } from '../constants/mapData';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { clamp } from 'react-native-redash';
import Text from './Text';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Number of tiles on each side of center
const TILE_SPREAD = 3; // 3 left, 3 right, 3 up, 3 down

// Calculate tile dimensions to ensure no gaps
const TILE_WIDTH = SCREEN_WIDTH;
const TILE_HEIGHT = SCREEN_WIDTH * 0.5105; // Maintain aspect ratio

const MAP_WIDTH = TILE_WIDTH * (TILE_SPREAD * 2 + 1);
const MAP_HEIGHT = TILE_HEIGHT * (TILE_SPREAD * 2 + 1);

export const MapView = () => {
  const currentIsland = islands.find((island) => island.id === 'alphabet');

  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(
    SCREEN_WIDTH / 2 - (currentIsland?.x ?? MAP_WIDTH / 2)
  );
  const translateY = useSharedValue(
    SCREEN_HEIGHT / 2 - (currentIsland?.y ?? MAP_HEIGHT / 2)
  );
  const savedTranslateX = useSharedValue(translateX.value);
  const savedTranslateY = useSharedValue(translateY.value);

  const MIN_SCALE = 1;
  const MAX_SCALE = 3;
  
  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      const nextScale = savedScale.value * e.scale;
      scale.value = clamp(nextScale, MIN_SCALE, MAX_SCALE);
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });
  
  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      const nextX = savedTranslateX.value + e.translationX;
      const nextY = savedTranslateY.value + e.translationY;
  
      // Limits
      const minX = -MAP_WIDTH + SCREEN_WIDTH;
      const maxX = 0;
      const minY = -MAP_HEIGHT + SCREEN_HEIGHT;
      const maxY = 0;
  
      translateX.value = clamp(nextX, minX, maxX);
      translateY.value = clamp(nextY, minY, maxY);
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  const composed = Gesture.Simultaneous(pinchGesture, panGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const tiles = [];
  for (let row = -TILE_SPREAD; row <= TILE_SPREAD; row++) {
    for (let col = -TILE_SPREAD; col <= TILE_SPREAD; col++) {
      tiles.push({ row, col });
    }
  }

  return (
    <View style={styles.container}>
      <GestureDetector gesture={composed}>
        <Animated.View style={[styles.mapContainer, animatedStyle]}>
          {/* Tiled background */}
          {tiles.map(({ row, col }) => (
            <Image
              key={`tile-${row}-${col}`}
              source={Images.backgrounds.screens.main}
              style={{
                position: 'absolute',
                width: TILE_WIDTH,
                height: TILE_HEIGHT,
                left: (col + TILE_SPREAD) * TILE_WIDTH,
                top: (row + TILE_SPREAD) * TILE_HEIGHT,
              }}
              contentFit="cover"
              transition={0}
            />
          ))}

          {/* Islands */}
          {islands.map((island) => (
            <Island
              key={island.id}
              title={island.title}
              subtitle={island.subtitle}
              size={island.size}
              status={island.status}
              onPress={island.status === 'unlocked' ? () =>
                router.push({ pathname: '/(app)/[island]', params: { island: island.id } })
              : undefined}
              imageSource={island.imageSource}
              style={{
                position: 'absolute',
                left: island.x,
                top: island.y,
              }}
            />
          ))}
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  mapContainer: {
    width: MAP_WIDTH,
    height: MAP_HEIGHT,
    backgroundColor: colors.primary[100],
  },
});
