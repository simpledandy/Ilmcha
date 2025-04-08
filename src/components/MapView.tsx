import React, { useRef } from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from 'react-native';
import {
  GestureDetector,
  Gesture,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Island } from './Island';
import Images from '@constants/images';
import { colors } from '@theme/colors';
import { islands } from '../constants/mapData';
import { router } from 'expo-router';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAP_SCALE = 3;
const MAP_WIDTH = SCREEN_WIDTH * MAP_SCALE;
const MAP_HEIGHT = SCREEN_HEIGHT * MAP_SCALE;

export const MapView = () => {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = savedScale.value * e.scale;
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = savedTranslateX.value + e.translationX;
      translateY.value = savedTranslateY.value + e.translationY;
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

  return (
    <View style={styles.container}>
      <GestureDetector gesture={composed}>
        <Animated.View style={[styles.mapContainer, animatedStyle]}>
          <ImageBackground
            source={Images.backgrounds.screens.main}
            style={styles.map}
            resizeMode="repeat"
          >
            {/* Add your islands here */}
            {islands.map((island) => (
              <Island
                key={island.id}
                title={island.title}
                subtitle={island.subtitle}
                size={island.size}
                status={island.status}
                onPress={() => router.push({ pathname: '/(app)/[island]', params: { island: island.id } })}
              />
            ))}
          </ImageBackground>
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
  },
  map: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.primary[100],
  },
}); 