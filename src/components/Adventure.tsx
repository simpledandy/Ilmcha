import React, { useEffect } from "react";
import { Pressable, StyleSheet, View, Dimensions } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
} from "react-native-reanimated";
import { LockIcon } from "@/src/components/LockIcon";
import { AppImage } from "@components";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const ADV_HEIGHT = SCREEN_HEIGHT * 0.5;

export type AdventureProps = {
  img: any;
  idx: number;
  scrollY: Animated.SharedValue<number>;
  side: "left" | "right";
  onPress: () => void;
  unlocked: boolean;
  highlighted?: boolean;
};

export const Adventure: React.FC<AdventureProps> = ({
  img,
  idx,
  scrollY,
  side,
  onPress,
  unlocked,
  highlighted,
}) => {
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (highlighted) {
      pulse.value = withRepeat(
        withSequence(withSpring(1.2), withSpring(1)),
        -1,
        true
      );
    }
  }, [highlighted]);

  const animatedStyle = useAnimatedStyle(() => {
    // Compute this adventure’s center position
    const position = idx * ADV_HEIGHT;
    const center = scrollY.value + SCREEN_HEIGHT / 2 - ADV_HEIGHT / 2;
    const distance = position - center;

    // Scale: bigger near bottom, smaller near top
    const scale = interpolate(
      distance,
      [-SCREEN_HEIGHT, 0, SCREEN_HEIGHT],
      [2.2, 1.5, 0.5],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ scale }, { scale: pulse.value }],
    };
  });

  return (
    <Pressable
      onPress={unlocked ? onPress : undefined}
      style={styles.advContainer}
    >
      <Animated.View
        style={[
          styles.topic,
          side === "left" ? styles.left : styles.right,
          animatedStyle,
        ]}
      >
        <AppImage source={img} style={styles.topicImage} />
        {!unlocked && (
          <View style={styles.lockOverlay}>
            <LockIcon />
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  advContainer: {
    width: SCREEN_WIDTH,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    zIndex: 1,
  },
  topic: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  topicImage: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },
  left: {
    alignItems: "flex-start",
    paddingLeft: 48,
  },
  right: {
    alignItems: "flex-end",
    paddingRight: 48,
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 60,
  },
});
