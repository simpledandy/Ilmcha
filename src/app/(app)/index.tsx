import React, { useState, useEffect } from "react";
import {
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  View,
} from "react-native";
import { MapView } from "@components/MapView";
import { colors } from "@theme/colors";
import { FlyingPenguin } from "@components/FlyingPenguin";
import { TreasureCollection } from "@components/TreasureCollection";
import { rewardManager } from "@utils/rewardManager";
import { Text } from "@components/Text";
import { useTranslation } from "react-i18next";
import { navigate } from "@utils/navigation";
import { AppIcons } from "@constants/images/images";

export const HomeScreen: React.FC = () => {
  const { t } = useTranslation();
  const [showTreasureCollection, setShowTreasureCollection] = useState(false);
  const [progress, setProgress] = useState({
    totalPoints: 0,
    currentStreak: 0,
    totalTreasures: 0,
  });

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = () => {
    const userProgress = rewardManager.getProgress();
    setProgress({
      totalPoints: userProgress.totalPoints,
      currentStreak: userProgress.currentStreak,
      totalTreasures: userProgress.totalTreasures,
    });
  };

  const handleTreasureCollectionPress = () => {
    setShowTreasureCollection(true);
  };

  const handleCloseTreasureCollection = () => {
    setShowTreasureCollection(false);
    loadProgress(); // Refresh progress when closing
  };

  const handleTalePress = () => {
    navigate("/tale");
  };

  const handleParentalZonePress = () => {
    navigate("/parental-zone");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with buttons */}
      <View style={styles.header}>
        {/* Tales Button */}
        <TouchableOpacity style={styles.taleButton} onPress={handleTalePress}>
          <Image
            source={AppIcons.taleIcon}
            style={styles.icon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* Progress Display */}
        <View style={styles.progressContainer}>
          <View style={styles.progressItem}>
            <Text variant="caption" style={styles.progressLabel}>
              {t("points")}
            </Text>
            <Text variant="score" style={styles.progressValue}>
              {progress.totalPoints}
            </Text>
          </View>
          {progress.currentStreak > 0 && (
            <View style={styles.progressItem}>
              <Text variant="caption" style={styles.progressLabel}>
                {t("streak")}
              </Text>
              <Text variant="score" style={styles.progressValue}>
                🔥 {progress.currentStreak}
              </Text>
            </View>
          )}
        </View>

        {/* Treasure Collection Button */}
        <TouchableOpacity
          style={styles.treasureButton}
          onPress={handleTreasureCollectionPress}
        >
          <Image
            source={AppIcons.chest}
            style={styles.icon}
            resizeMode="contain"
          />
          {progress.totalTreasures > 0 && (
            <View style={styles.badge}>
              <Text
                variant="captionSmall"
                weight="proportionalBold"
                style={styles.badgeText}
              >
                {progress.totalTreasures}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Parental Zone Button */}
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={handleParentalZonePress}
        >
          <Image
            source={AppIcons.lockIcon}
            style={styles.icon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* Map View - takes up remaining space */}
      <View style={styles.mapContainer}>
        <MapView />
      </View>

      {/* Flying Penguin - positioned absolutely above the map */}
      <FlyingPenguin />

      {/* Treasure Collection Modal */}
      <TreasureCollection
        isVisible={showTreasureCollection}
        onClose={handleCloseTreasureCollection}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary[100],
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    zIndex: 10, // Ensure buttons stay above other elements
  },
  taleButton: {
    zIndex: 10,
  },
  progressContainer: {
    flexDirection: "row",
    gap: 15,
  },
  progressItem: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  progressLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  progressValue: {
    fontSize: 14,
    color: "#4CAF50",
  },
  treasureButton: {
    zIndex: 10,
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#FF6B35",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
  },
  settingsButton: {
    zIndex: 10,
  },
  icon: {
    width: 40,
    height: 40,
  },
  mapContainer: {
    flex: 1,
    position: "relative", // Needed for absolute positioning of children
  },
});

export default HomeScreen;
