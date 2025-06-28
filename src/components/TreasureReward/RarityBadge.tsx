import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "@components/Text";
import { colors } from "@theme/colors";

export interface RarityBadgeProps {
  _rarity: string;
  color: string;
  text: string;
}

export const RarityBadge: React.FC<RarityBadgeProps> = ({
  _rarity,
  color,
  text,
}) => (
  <View style={[styles.rarityBadge, { backgroundColor: color }]}>
    <Text variant="button" style={styles.rarityText}>
      {text}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  rarityBadge: {
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 10,
  },
  rarityText: { color: colors.common.white, fontWeight: "bold", fontSize: 16 },
});
