import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "@components/Text";
import { Button } from "@components/Button";
import { colors } from "@theme/colors";

interface TreasureCollectionHeaderProps {
  title: string;
  onClose: () => void;
}

export const TreasureCollectionHeader: React.FC<
  TreasureCollectionHeaderProps
> = ({ title, onClose }) => (
  <View style={styles.header}>
    <Text variant="heading1" weight="proportionalBold" style={styles.title}>
      {title}
    </Text>
    <Button
      onPress={onClose}
      variant="outline"
      size="small"
      style={styles.closeButton}
    >
      ✕
    </Button>
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.background.tertiary,
  },
  title: {
    color: colors.text.primary,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.background.tertiary,
    justifyContent: "center",
    alignItems: "center",
  },
});
