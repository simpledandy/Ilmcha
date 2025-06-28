import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { runOnJS, withTiming } from "react-native-reanimated";
import { Treasure } from "@constants/rewards/rewards";
import { Text } from "./Text";
import { useTranslation } from "react-i18next";
import { TreasureRewardModal } from "./TreasureReward/TreasureRewardModal";
import { TreasureImageDisplay } from "./TreasureReward/TreasureImageDisplay";
import { RarityBadge } from "./TreasureReward/RarityBadge";
import { PointsEarnedDisplay } from "./TreasureReward/PointsEarnedDisplay";
import { StreakInfo } from "./TreasureReward/StreakInfo";
import { RewardCloseButton } from "./TreasureReward/RewardCloseButton";
import { useAnimatedModal } from "@hooks/useAnimatedModal";
import { useRewardAnimation } from "@hooks/useRewardAnimation";
import { playCongratsSequence } from "@hooks/useAudioPlayer";
import { colors } from "@theme/colors";
import { textStyles } from "@theme/typography";
import chest from "@assets/images/chest.png";

interface TreasureRewardProps {
  treasure: Treasure;
  points: number;
  streak: number;
  isVisible: boolean;
  onClose: () => void;
}

export const TreasureReward: React.FC<TreasureRewardProps> = ({
  treasure,
  points,
  streak,
  isVisible,
  onClose,
}) => {
  const { t } = useTranslation();
  // Modal animation
  const { modalAnimatedStyle, scale, opacity } = useAnimatedModal(isVisible);
  // Reward animation
  const { treasureAnimatedStyle, pointsAnimatedStyle, streakAnimatedStyle } =
    useRewardAnimation(isVisible, 4000, handleClose);
  // Clamp points for congrats sequence and display
  const clampedPoints = Math.max(1, Math.min(9, points));
  // Audio
  useEffect(() => {
    if (isVisible) {
      void playCongratsSequence(clampedPoints);
    }
  }, [isVisible, clampedPoints]);

  function handleClose() {
    scale.value = withTiming(0, { duration: 200 });
    opacity.value = withTiming(0, { duration: 200 }, () => {
      runOnJS(onClose)();
    });
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return colors.rarity.gold;
      case "epic":
        return colors.rarity.purple;
      case "rare":
        return colors.rarity.blue;
      case "common":
        return colors.rarity.green;
      default:
        return colors.rarity.gold;
    }
  };

  const getRarityText = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return "LEGENDARY!";
      case "epic":
        return "EPIC!";
      case "rare":
        return "RARE!";
      case "common":
        return "TREASURE!";
      default:
        return "TREASURE!";
    }
  };

  return (
    <TreasureRewardModal
      isVisible={isVisible}
      modalAnimatedStyle={modalAnimatedStyle}
      onRequestClose={handleClose}
    >
      {/* Background glow effect */}
      <View
        style={[
          styles.glowEffect,
          { backgroundColor: getRarityColor(treasure.rarity) },
        ]}
      />

      {/* Rarity badge */}
      <RarityBadge
        _rarity={treasure.rarity}
        color={getRarityColor(treasure.rarity)}
        text={getRarityText(treasure.rarity)}
      />

      {/* Treasure image */}
      <TreasureImageDisplay
        imageSource={treasure.image ?? chest}
        animatedStyle={treasureAnimatedStyle}
      />

      {/* Treasure info */}
      <View style={styles.treasureInfo}>
        <Text variant="heading2" style={styles.treasureName}>
          {treasure.name}
        </Text>
        <Text variant="body" style={styles.treasureDescription}>
          {treasure.description}
        </Text>
      </View>

      {/* Points earned */}
      <PointsEarnedDisplay
        points={clampedPoints}
        animatedStyle={pointsAnimatedStyle}
        label={t("pointsEarned")}
      />

      {/* Streak info */}
      {streak > 1 && (
        <StreakInfo
          streak={streak}
          animatedStyle={streakAnimatedStyle}
          label={t("streak")}
          daysLabel={t("days")}
        />
      )}

      {/* Close button */}
      <RewardCloseButton onPress={handleClose} label={t("awesome")} />
    </TreasureRewardModal>
  );
};

const styles = StyleSheet.create({
  glowEffect: {
    position: "absolute",
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: 30,
    opacity: 0.3,
    zIndex: -1,
  },
  treasureInfo: {
    alignItems: "center",
    marginBottom: 20,
  },
  treasureName: {
    fontSize: textStyles.heading2.fontSize,
    marginBottom: 8,
    textAlign: "center",
  },
  treasureDescription: {
    fontSize: textStyles.body.fontSize,
    textAlign: "center",
    color: colors.text.secondary,
    lineHeight: 22,
  },
});
