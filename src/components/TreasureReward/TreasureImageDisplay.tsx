import { AnimatedStyle, ImageSource } from "@/src/types/common";
import React from "react";
import { StyleSheet, Image } from "react-native";
import Animated from "react-native-reanimated";

export interface TreasureImageDisplayProps {
  imageSource: ImageSource;
  animatedStyle: AnimatedStyle;
}

export const TreasureImageDisplay: React.FC<TreasureImageDisplayProps> = ({
  imageSource,
  animatedStyle,
}) => (
  <Animated.View style={[styles.treasureContainer, animatedStyle]}>
    <Image
      source={imageSource}
      style={styles.treasureImage}
      resizeMode="contain"
    />
  </Animated.View>
);

const styles = StyleSheet.create({
  treasureContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 12,
  },
  treasureImage: { width: 100, height: 100 },
});
