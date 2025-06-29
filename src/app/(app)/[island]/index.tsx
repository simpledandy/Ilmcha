import React from "react";
import { View, StyleSheet } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Image as ExpoImage } from "expo-image";
import { BackButton } from "@components/BackButton";
import { BackgroundImages } from "@constants/images/images";

const IslandScreen: React.FC = () => {
  const { island } = useLocalSearchParams();
  const islandId = typeof island === "string" ? island : "";

  const getIslandBackground = () => {
    switch (islandId) {
      case "numbers":
        return BackgroundImages.islands.adventure.numeriya;
      case "alphabet":
        return BackgroundImages.islands.adventure.alifbo;
      case "colors":
        return BackgroundImages.islands.adventure.colors;
      default:
        return BackgroundImages.islands.adventure.default;
    }
  };

  return (
    <View style={styles.container}>
      <ExpoImage
        source={getIslandBackground()}
        style={styles.background}
        contentFit="cover"
      />
      <BackButton
        onPress={() => router.back()}
        size="medium"
        style={styles.backButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 1,
  },
});

export default IslandScreen;
