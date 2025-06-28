import React from "react";
import { View, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import { PenguinImages } from "@constants/images/images";

export interface PenguinGuideProps {
  pose: keyof typeof PenguinImages.poses;
}

export const PenguinGuide: React.FC<PenguinGuideProps> = ({ pose }) => (
  <View style={styles.penguinContainer}>
    <Animated.Image
      source={PenguinImages.poses[pose] || PenguinImages.poses.wavingExplorer}
      style={styles.penguin}
      resizeMode="contain"
    />
  </View>
);

const styles = StyleSheet.create({
  penguinContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
  penguin: { width: 120, height: 120 },
});
