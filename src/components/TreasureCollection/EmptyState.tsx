import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "@components/Text";
import { colors } from "@theme/colors";
import { textStyles } from "@theme/typography";

interface EmptyStateProps {
  message: string;
  subtext?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ message, subtext }) => (
  <View style={styles.emptyState}>
    <Text variant="heading2" style={styles.emptyText}>
      {message}
    </Text>
    {subtext && (
      <Text variant="caption" style={styles.emptySubtext}>
        {subtext}
      </Text>
    )}
  </View>
);

const styles = StyleSheet.create({
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
