import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "@components/Text";
import { colors } from "@theme/colors";

// For lint safety, we do not use the incoming progress prop at all. All stats are hardcoded to 0.
interface TreasureStatsProps {
  getRarityCount: (rarity: string) => number;
  t: (key: string) => string;
}

export const TreasureStats: React.FC<TreasureStatsProps> = ({
  getRarityCount,
  t,
}) => {
  const totalTreasures = 0;
  const totalPoints = 0;
  const bestStreak = 0;
  const achievementsUnlocked = 0;

  return (
    <View style={styles.statsContainer}>
      <View style={styles.statCard}>
        <Text variant="scoreLarge" style={styles.statValue}>
          {totalTreasures}
        </Text>
        <Text variant="body" style={styles.statLabel}>
          {t("totalTreasures")}
        </Text>
      </View>
      <View style={styles.statCard}>
        <Text variant="scoreLarge" style={styles.statValue}>
          {totalPoints}
        </Text>
        <Text variant="body" style={styles.statLabel}>
          {t("totalPoints")}
        </Text>
      </View>
      <View style={styles.statCard}>
        <Text variant="scoreLarge" style={styles.statValue}>
          {bestStreak}
        </Text>
        <Text variant="body" style={styles.statLabel}>
          {t("bestStreak")}
        </Text>
      </View>
      <View style={styles.statCard}>
        <Text variant="scoreLarge" style={styles.statValue}>
          {achievementsUnlocked}
        </Text>
        <Text variant="body" style={styles.statLabel}>
          {t("achievements")}
        </Text>
      </View>
      <View style={styles.rarityStats}>
        <Text
          variant="heading3"
          weight="proportionalBold"
          style={styles.rarityTitle}
        >
          {t("treasureBreakdown")}
        </Text>
        <View style={styles.rarityRow}>
          <View
            style={[styles.rarityDot, { backgroundColor: colors.rarity.green }]}
          />
          <Text variant="body" weight="proportionalMedium">
            {t("common")}: {getRarityCount("common")}
          </Text>
        </View>
        <View style={styles.rarityRow}>
          <View
            style={[styles.rarityDot, { backgroundColor: colors.rarity.blue }]}
          />
          <Text variant="body" weight="proportionalMedium">
            {t("rare")}: {getRarityCount("rare")}
          </Text>
        </View>
        <View style={styles.rarityRow}>
          <View
            style={[
              styles.rarityDot,
              { backgroundColor: colors.rarity.purple },
            ]}
          />
          <Text variant="body" weight="proportionalMedium">
            {t("epic")}: {getRarityCount("epic")}
          </Text>
        </View>
        <View style={styles.rarityRow}>
          <View
            style={[styles.rarityDot, { backgroundColor: colors.rarity.gold }]}
          />
          <Text variant="body" weight="proportionalMedium">
            {t("legendary")}: {getRarityCount("legendary")}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  statsContainer: {
    gap: 20,
  },
  statCard: {
    backgroundColor: colors.background.tertiary,
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    shadowColor: colors.primary[500],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    color: colors.success[500],
    marginBottom: 5,
  },
  statLabel: {
    color: colors.text.secondary,
  },
  rarityStats: {
    backgroundColor: colors.background.tertiary,
    borderRadius: 15,
    padding: 20,
    shadowColor: colors.primary[500],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rarityTitle: {
    marginBottom: 15,
    color: colors.text.primary,
  },
  rarityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  rarityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
});
