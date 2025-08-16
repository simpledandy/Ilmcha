import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  StyleProp,
  ActivityIndicator,
} from "react-native";
import { AppText } from '@components/AppText';
import { colors } from "@theme/colors";

interface AudioControlProps {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  variant?: "play" | "pause" | "replay" | "stop" | "volume" | "mute";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
}

export const AudioControl: React.FC<AudioControlProps> = ({
  onPress,
  style,
  variant = "play",
  size = "medium",
  disabled = false,
  loading = false,
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

  const getIcon = () => {
    switch (variant) {
      case "play":
        return "▶️";
      case "pause":
        return "⏸️";
      case "replay":
        return "🔁";
      case "stop":
        return "⏹️";
      case "volume":
        return "🔊";
      case "mute":
        return "🔇";
      default:
        return "▶️";
    }
  };

  if (loading) {
    return (
      <TouchableOpacity
        style={[getButtonStyle(), styles.disabled, style]}
        disabled={true}
      >
        <ActivityIndicator size="small" color={colors.primary[500]} />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[getButtonStyle(), disabled && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled}
    >
      <AppText style={[styles.icon, getIconStyle()]}>{getIcon()}</AppText>
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
    borderColor: colors.border.light,
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
  disabled: {
    opacity: 0.5,
  },
});
