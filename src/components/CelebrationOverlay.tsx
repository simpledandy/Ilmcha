// components/CelebrationOverlay.tsx
import React, { useEffect } from "react";
import {
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { colors } from "@theme/colors";

const { width, height } = Dimensions.get("window");
const PARTICLES = 24;

export type ParticleShape = "circle" | "square" | "triangle" | "diamond" | "star";

type CelebrationOverlayProps = {
  onFinish: () => void;
  shape?: ParticleShape;
};

export const CelebrationOverlay: React.FC<CelebrationOverlayProps> = ({
  onFinish,
  shape = "circle",
}) => {
  const opacities = Array.from({ length: PARTICLES }, () => useSharedValue(0));
  const scales = Array.from({ length: PARTICLES }, () => useSharedValue(0));

  useEffect(() => {
    opacities.forEach((o, i) => {
      o.value = withTiming(1, { duration: 200 });
      scales[i].value = withSpring(1, { damping: 6, stiffness: 120 });

      setTimeout(() => {
        o.value = withTiming(0, { duration: 500 });
      }, 800);
    });

    const timer = setTimeout(() => {
      runOnJS(onFinish)();
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <TouchableWithoutFeedback onPress={onFinish}>
      <View style={styles.overlay}>
        {opacities.map((o, i) => {
          const angle = (i / PARTICLES) * Math.PI * 2;
          const distance = 100 + Math.random() * 120;
          const x = Math.cos(angle) * distance + width / 2 - 10;
          const y = Math.sin(angle) * distance + height / 2 - 10;

          const style = useAnimatedStyle(() => ({
            opacity: o.value,
            transform: [{ scale: scales[i].value }],
            left: x,
            top: y,
          }));

          return (
            <Animated.View
              key={i}
              style={[
                styles.particleBase,
                shapeStyles(shape),
                style,
                { backgroundColor: randomColor() },
              ]}
            />
          );
        })}
      </View>
    </TouchableWithoutFeedback>
  );
};

const randomColor = () =>
  [
    colors.common.brightGreen,
    colors.common.playfulOrange,
    colors.common.teal,
    colors.common.playfulPurple,
  ][Math.floor(Math.random() * 4)];

// Base style
const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
  },
  particleBase: {
    position: "absolute",
    width: 20,
    height: 20,
  },
});

// Dynamic shape styles
function shapeStyles(shape: ParticleShape) {
  switch (shape) {
    case "circle":
      return { borderRadius: 10 };
    case "square":
      return { borderRadius: 4 };
    case "diamond":
      return {
        transform: [{ rotate: "45deg" }],
      };
    case "triangle":
      return {
        width: 0,
        height: 0,
        backgroundColor: "transparent",
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderBottomWidth: 20,
        borderStyle: "solid",
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderBottomColor: randomColor(),
      };
    case "star":
      // crude "star" with rotation (really a plus-shape)
      return {
        width: 4,
        height: 20,
        backgroundColor: randomColor(),
        position: "absolute" as const,
      };
    default:
      return {};
  }
}