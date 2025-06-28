import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Text } from "@components/Text";
import { colors } from "@theme/colors";

interface TreasureTabsProps {
  activeTab: "treasures" | "achievements" | "stats";
  setActiveTab: (tab: "treasures" | "achievements" | "stats") => void;
  t: (key: string) => string;
}

const TreasureTabs: React.FC<TreasureTabsProps> = ({
  activeTab,
  setActiveTab,
  t,
}) => (
  <View style={styles.tabs}>
    <TouchableOpacity
      style={[styles.tab, activeTab === "treasures" && styles.activeTab]}
      onPress={() => setActiveTab("treasures")}
    >
      <Text
        variant="tabLabel"
        weight={
          activeTab === "treasures" ? "proportionalBold" : "proportionalMedium"
        }
        style={[
          styles.tabText,
          activeTab === "treasures" && styles.activeTabText,
        ]}
      >
        💎 {t("treasures")}
      </Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.tab, activeTab === "achievements" && styles.activeTab]}
      onPress={() => setActiveTab("achievements")}
    >
      <Text
        variant="tabLabel"
        weight={
          activeTab === "achievements"
            ? "proportionalBold"
            : "proportionalMedium"
        }
        style={[
          styles.tabText,
          activeTab === "achievements" && styles.activeTabText,
        ]}
      >
        🏆 {t("achievements")}
      </Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.tab, activeTab === "stats" && styles.activeTab]}
      onPress={() => setActiveTab("stats")}
    >
      <Text
        variant="tabLabel"
        weight={
          activeTab === "stats" ? "proportionalBold" : "proportionalMedium"
        }
        style={[styles.tabText, activeTab === "stats" && styles.activeTabText]}
      >
        📊 {t("stats")}
      </Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 12,
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginHorizontal: 2,
  },
  activeTab: {
    backgroundColor: colors.primary[50],
    borderBottomColor: colors.success[500],
  },
  tabText: {
    color: colors.text.secondary,
  },
  activeTabText: {
    color: colors.success[500],
  },
});

export { TreasureTabs };
