import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Dimensions } from "react-native";
import Animated from "react-native-reanimated";
import { colors } from "@theme/colors";
import { textStyles } from "@theme/typography";
import { useTranslation } from "react-i18next";
import { rewardManager } from "@utils/rewardManager";
import type { Treasure, Achievement } from "../types/common";
import { TreasureTabs } from "./TreasureCollection/TreasureTabs";
import { TreasureGrid } from "./TreasureCollection/TreasureGrid";
import { AchievementList } from "./TreasureCollection/AchievementList";
import { useAnimatedModal } from "@hooks/useAnimatedModal";
import { TreasureCollectionHeader } from "./TreasureCollection/TreasureCollectionHeader";
import { TreasureStats } from "./TreasureCollection/TreasureStats";
import { EmptyState } from "./TreasureCollection/EmptyState";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface TreasureCollectionProps {
  isVisible: boolean;
  onClose: () => void;
}

export const TreasureCollection: React.FC<TreasureCollectionProps> = ({
  isVisible,
  onClose,
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<
    "treasures" | "achievements" | "stats"
  >("treasures");
  const [treasures, setTreasures] = useState<Treasure[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  // Modal animation
  const { modalAnimatedStyle } = useAnimatedModal(isVisible);

  useEffect(() => {
    if (isVisible) {
      loadData();
    }
  }, [isVisible]);

  const loadData = () => {
    const collected = rewardManager.getCollectedTreasures();
    setTreasures(
      Array.isArray(collected)
        ? collected.filter(
            (t): t is Treasure =>
              typeof t === "object" &&
              t !== null &&
              "rarity" in t &&
              typeof t.rarity === "string",
          )
        : [],
    );
    const ach = rewardManager.getAchievements();
    setAchievements(
      Array.isArray(ach)
        ? ach.filter(
            (a): a is Achievement =>
              typeof a === "object" &&
              a !== null &&
              "id" in a &&
              typeof a.id === "string",
          )
        : [],
    );
  };

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

  const getRarityCount = (rarity: string) => {
    return treasures.filter((t) => t.rarity === rarity).length;
  };

  return (
    <View style={[styles.container, { display: isVisible ? "flex" : "none" }]}>
      <View style={styles.overlay} />
      <Animated.View style={[styles.modal, modalAnimatedStyle]}>
        {/* Header */}
        <TreasureCollectionHeader
          title={t("treasureCollection")}
          onClose={onClose}
        />
        {/* Tabs */}
        <TreasureTabs activeTab={activeTab} setActiveTab={setActiveTab} t={t} />
        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {activeTab === "treasures" &&
            (treasures.length > 0 ? (
              <TreasureGrid
                treasures={treasures}
                getRarityColor={getRarityColor}
              />
            ) : (
              <EmptyState
                message={t("noTreasuresYet")}
                subtext={t("collectTreasuresToSeeThemHere")}
              />
            ))}
          {activeTab === "achievements" &&
            (achievements.length > 0 ? (
              <AchievementList achievements={achievements} />
            ) : (
              <EmptyState
                message={t("noAchievementsYet")}
                subtext={t("completeLessonsToEarnAchievements")}
              />
            ))}
          {activeTab === "stats" && (
            <TreasureStats getRarityCount={getRarityCount} t={t} />
          )}
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modal: {
    flex: 1,
    backgroundColor: colors.common.white,
    margin: 20,
    borderRadius: 20,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.background.tertiary,
  },
  title: {
    fontSize: textStyles.heading1.fontSize,
    fontWeight: "bold",
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.background.tertiary,
    justifyContent: "center",
    alignItems: "center",
  },
  closeText: {
    fontSize: textStyles.caption.fontSize,
    color: colors.text.secondary,
  },
  tabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.background.tertiary,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: colors.success[500],
  },
  tabText: {
    fontSize: textStyles.body.fontSize,
    color: colors.text.secondary,
  },
  activeTabText: {
    color: colors.success[500],
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  treasuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  treasureItem: {
    width: (SCREEN_WIDTH - 80) / 2 - 10,
    backgroundColor: colors.background.tertiary,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    alignItems: "center",
    position: "relative",
  },
  rarityIndicator: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  treasureImage: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  treasureInfo: {
    alignItems: "center",
  },
  treasureName: {
    fontSize: textStyles.body.fontSize,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  treasureValue: {
    fontSize: textStyles.caption.fontSize,
    color: colors.rarity.gold,
    fontWeight: "bold",
  },
  achievementsList: {
    gap: 15,
  },
  achievementItem: {
    flexDirection: "row",
    backgroundColor: colors.background.tertiary,
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
  },
  achievementIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.common.white,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  achievementEmoji: {
    fontSize: textStyles.body.fontSize,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementName: {
    fontSize: textStyles.body.fontSize,
    fontWeight: "bold",
    marginBottom: 5,
  },
  achievementDescription: {
    fontSize: textStyles.caption.fontSize,
    color: colors.text.secondary,
    marginBottom: 10,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.background.tertiary,
    borderRadius: 3,
    marginBottom: 5,
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.success[500],
    borderRadius: 3,
  },
  progressText: {
    fontSize: textStyles.caption.fontSize,
    color: colors.text.secondary,
  },
  unlockedBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.success[500],
    justifyContent: "center",
    alignItems: "center",
  },
  unlockedText: {
    color: colors.common.white,
    fontSize: textStyles.body.fontSize,
    fontWeight: "bold",
  },
  statsContainer: {
    gap: 20,
  },
  statCard: {
    backgroundColor: colors.background.tertiary,
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
  },
  statValue: {
    fontSize: textStyles.heading2.fontSize,
    fontWeight: "bold",
    color: colors.success[500],
    marginBottom: 5,
  },
  statLabel: {
    fontSize: textStyles.body.fontSize,
    color: colors.text.secondary,
  },
  rarityStats: {
    backgroundColor: colors.background.tertiary,
    borderRadius: 15,
    padding: 20,
  },
  rarityTitle: {
    fontSize: textStyles.heading3.fontSize,
    fontWeight: "bold",
    marginBottom: 15,
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
  emptyState: {
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: textStyles.body.fontSize,
    fontWeight: "bold",
    color: colors.text.secondary,
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: textStyles.caption.fontSize,
    color: colors.text.tertiary,
    textAlign: "center",
  },
});
