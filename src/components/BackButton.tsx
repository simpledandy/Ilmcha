import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from "react-native";
import { Text } from "@components/Text";
import { colors } from "@theme/colors";

interface BackButtonProps {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  size?: "small" | "medium" | "large";
}

export const BackButton: React.FC<BackButtonProps> = ({
  onPress,
  style,
  size = "medium",
}) => {
  const getButtonStyle = () => {
    const baseStyle = [styles.base, styles[size]];
    return baseStyle;
  };

  const getIconStyle = () => {
    switch (size) {
      case "small":
        return styles.iconSmall;
      case "large":
        return styles.iconLarge;
      default:
        return styles.iconMedium;
    }
  };

  return (
    <TouchableOpacity style={[getButtonStyle(), style]} onPress={onPress}>
      <Text style={[styles.icon, getIconStyle()]}>←</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  small: {
    width: 32,
    height: 32,
  },
  medium: {
    width: 40,
    height: 40,
  },
  large: {
    width: 48,
    height: 48,
  },
  icon: {
    color: colors.primary[500],
    fontWeight: "600",
  },
  iconSmall: {
    fontSize: 14,
  },
  iconMedium: {
    fontSize: 16,
  },
  iconLarge: {
    fontSize: 18,
  },
});
