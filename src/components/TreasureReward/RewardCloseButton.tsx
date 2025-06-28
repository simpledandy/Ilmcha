import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Text } from "@components/Text";
import { colors } from "@theme/colors";

export interface RewardCloseButtonProps {
  onPress: () => void;
  label: string;
}

export const RewardCloseButton: React.FC<RewardCloseButtonProps> = ({
  onPress,
  label,
}) => (
  <TouchableOpacity style={styles.closeButton} onPress={onPress}>
    <Text variant="button" style={styles.closeButtonText}>
      {label}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  closeButton: {
    backgroundColor: colors.success[500],
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginTop: 16,
  },
  closeButtonText: {
    color: colors.common.white,
    fontWeight: "bold",
    fontSize: 16,
  },
});
