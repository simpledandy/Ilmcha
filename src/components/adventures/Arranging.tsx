import React, { useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  runOnJS,
  withTiming,
} from "react-native-reanimated";
import { AppImage } from "../AppImage";
import { numbers, letters, shapes } from '@constants';
import { colors } from "@theme/colors";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { AdventureProps } from "@/src/types/common";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const GRID_SIZE = SCREEN_WIDTH * 0.7;
const PIECE_SIZE = GRID_SIZE / 2 - 12;

const initialPositions = [
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: 1, y: 1 },
];

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const Arranging: React.FC<AdventureProps> = ({
  topic,
  islandId,
  onComplete,
}) => {

  const imageMap: Record<string, any> = {
    numbers,
    letters,
    shapes,
  };
  // Get the image for the topic
  const mainImage = imageMap[islandId]?.[topic];
  const [solved, setSolved] = useState(false);
  const fullImageOpacity = useSharedValue(0);
  const fullImageScale = useSharedValue(0.9);

  const fullImageStyle = useAnimatedStyle(() => ({
    opacity: fullImageOpacity.value,
    transform: [{ scale: fullImageScale.value }],
  }));

  // Shuffle initial positions
  const [positions, setPositions] = useState(() =>
    shuffleArray(initialPositions.map((p) => ({ ...p })))
  );

  const offsets = positions.map((pos) => ({
    x: useSharedValue(pos.x * (PIECE_SIZE + 12)),
    y: useSharedValue(pos.y * (PIECE_SIZE + 12)),
    scale: useSharedValue(1),
    opacity: useSharedValue(1),   // NEW
  }));

  const checkSolved = (newPositions: typeof positions) =>
    newPositions.every(
      (pos, idx) =>
        pos.x === initialPositions[idx].x && pos.y === initialPositions[idx].y
    );

  const onSwap = (fromIdx: number, toX: number, toY: number) => {
    const gridX = Math.max(0, Math.min(1, Math.round(toX)));
    const gridY = Math.max(0, Math.min(1, Math.round(toY)));

    const newPositions = [...positions];
    const swapIdx = newPositions.findIndex(
      (p) => p.x === gridX && p.y === gridY
    );

    if (swapIdx !== -1 && swapIdx !== fromIdx) {
      // Swap positions
      const temp = { ...newPositions[swapIdx] };
      newPositions[swapIdx] = { ...newPositions[fromIdx] };
      newPositions[fromIdx] = temp;
    } else {
      newPositions[fromIdx] = { x: gridX, y: gridY };
    }

    setPositions(newPositions);

    // Animate all pieces to their grid spot
    newPositions.forEach((p, i) => {
      offsets[i].x.value = withSpring(p.x * (PIECE_SIZE + 12));
      offsets[i].y.value = withSpring(p.y * (PIECE_SIZE + 12));
    });

    if (checkSolved(newPositions)) {
      setSolved(true);

      // Animate complete image
      fullImageOpacity.value = withSpring(1);
      fullImageScale.value = withSpring(1);

      // Animate pieces fade out
      offsets.forEach((o) => {
        o.scale.value = withSpring(0.8);
        o.opacity.value = withTiming(0, { duration: 400 });  // NEW
      });

      // Delay before triggering onComplete
      setTimeout(() => onComplete(), 1200);
    }
  };

  return (
    <View style={styles.container}>
      {mainImage ? (
        <View style={styles.grid}>
          {positions.map((_, idx) => {
            const pan = Gesture.Pan()
              .onBegin(() => {
                offsets[idx].scale.value = withSpring(1.1);
              })
              .onChange((e) => {
                offsets[idx].x.value = e.translationX + positions[idx].x * (PIECE_SIZE + 12);
                offsets[idx].y.value = e.translationY + positions[idx].y * (PIECE_SIZE + 12);
              })
              .onEnd((e) => {
                offsets[idx].scale.value = withSpring(1);
                const gridX = (e.translationX + positions[idx].x * (PIECE_SIZE + 12)) / (PIECE_SIZE + 12);
                const gridY = (e.translationY + positions[idx].y * (PIECE_SIZE + 12)) / (PIECE_SIZE + 12);
                runOnJS(onSwap)(idx, gridX, gridY);
              });

            const style = useAnimatedStyle(() => ({
              position: "absolute",
              width: PIECE_SIZE,
              height: PIECE_SIZE,
              borderRadius: 12,
              overflow: "hidden",
              backgroundColor: colors.common.white,
              elevation: 4,
              left: offsets[idx].x.value,
              top: offsets[idx].y.value,
              transform: [{ scale: offsets[idx].scale.value }],
              opacity: offsets[idx].opacity.value,   // NEW
            }));


            const imgStyle = {
              width: GRID_SIZE,
              height: GRID_SIZE,
              position: "absolute" as const,
              left: -(idx % 2) * 0.5 * GRID_SIZE,
              top: -Math.floor(idx / 2) * 0.5 * GRID_SIZE,
            };

            return (
              <GestureDetector gesture={pan} key={idx}>
                <Animated.View style={style}>
                  <AppImage source={mainImage} style={imgStyle} contentFit="cover" />
                </Animated.View>
              </GestureDetector>
            );
          })}
          
          {solved && (
            <Animated.View style={[StyleSheet.absoluteFill, fullImageStyle]}>
              <AppImage source={mainImage} style={{ width: GRID_SIZE, height: GRID_SIZE }} />
            </Animated.View>
          )}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  grid: {
    width: GRID_SIZE,
    height: GRID_SIZE,
    backgroundColor: colors.common.white,
    borderRadius: 24,
    elevation: 3,
  },
});
