// src/components/OceanMap.tsx
import React, { useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { clamp } from 'react-native-redash';
import { useRouter } from 'expo-router';
import { colors } from '@theme/colors';
import { islands } from '@constants/mapData';
import { AppImage } from './AppImage';
import { Island } from './Island';
import { BackgroundImages } from '@constants';
import { useProgress } from '../hooks/useProgress';
import { getCurrentTopic, getTopicImage } from '../utils/islands';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Fewer tiles for performance (since we have only 5 islands)
const TILE_SPREAD = 2;
const TILE_WIDTH = SCREEN_WIDTH;
const TILE_HEIGHT = SCREEN_WIDTH * 0.5105;
const MAP_WIDTH = TILE_WIDTH * (TILE_SPREAD * 2 + 1);
const MAP_HEIGHT = TILE_HEIGHT * (TILE_SPREAD * 2 + 1);

export function OceanMap() {
  const router = useRouter();

  // Optional: Center on a specific island, else fallback to map center
  const currentIsland = islands.find((island) => island.id === 'alphabet');
  const initialTranslateX =
    currentIsland
      ? SCREEN_WIDTH / 2 - currentIsland.x
      : SCREEN_WIDTH / 2 - MAP_WIDTH / 2;
  const initialTranslateY =
    currentIsland
      ? SCREEN_HEIGHT / 2 - currentIsland.y
      : SCREEN_HEIGHT / 2 - MAP_HEIGHT / 2;

  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(initialTranslateX);
  const translateY = useSharedValue(initialTranslateY);
  const savedTranslateX = useSharedValue(initialTranslateX);
  const savedTranslateY = useSharedValue(initialTranslateY);

  const MIN_SCALE = 1;
  const MAX_SCALE = 3;

  // Pinch zoom gesture
  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      const nextScale = savedScale.value * e.scale;
      scale.value = clamp(nextScale, MIN_SCALE, MAX_SCALE);
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  // Pan gesture
  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      const nextX = savedTranslateX.value + e.translationX;
      const nextY = savedTranslateY.value + e.translationY;

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

  const composedGesture = Gesture.Simultaneous(pinchGesture, panGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const tiles = useMemo(() => {
    const arr = [];
    for (let row = -TILE_SPREAD; row <= TILE_SPREAD; row++) {
      for (let col = -TILE_SPREAD; col <= TILE_SPREAD; col++) {
        arr.push({ row, col });
      }
    }
    return arr;
  }, []);

  type IslandKey = keyof typeof BackgroundImages.islands;

  function getIslandData(id: IslandKey) {
  return BackgroundImages.islands[id];
}

  return (
    <View style={styles.container}>
      <GestureDetector gesture={composedGesture}>
        <Animated.View style={[styles.mapContainer, animatedStyle]}>
          {/* Ocean background tiles */}
          {tiles.map(({ row, col }) => (
            <AppImage
              key={`tile-${row}-${col}`}
              source={BackgroundImages.oceanBg}
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
          {islands.map((island) => {
            const { progress } = useProgress(island.id);
            const currentTopic = getCurrentTopic(island.id, progress.unlockedTopics);
            const topicImage = currentTopic ? getTopicImage(island.id as any, currentTopic) : null;
            return (
            <Island
              key={island.id}
              topicImage={topicImage}
              title={island.title}
              size={island.size}
              onPress={() => {
                if (island.id === 'colors') {
                  router.push('/(app)/island/colors');
                } else if (island.id === 'time') {
                  router.push('/(app)/island/time');
                } else {
                  // Shared structure for numbers, letters, shapes
                  router.push({
                    pathname: '/(app)/island',
                    params: { id: island.id },
                  });
                }
              }
            }
            style = {{
              position: 'absolute',
              left: island.x,
              top: island.y,
            }}
            />
          )})}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: colors.common.teal, // Ocean look from first version
  },
  mapContainer: {
    width: MAP_WIDTH,
    height: MAP_HEIGHT,
    backgroundColor: colors.common.teal,
  },
});
