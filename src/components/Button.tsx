import React from "react";
import {
  Pressable,
  PressableProps,
  StyleSheet,
  ViewStyle,
  StyleProp,
  ActivityIndicator,
  TextStyle,
  View,
} from "react-native";
import { Text } from "./Text";
import { colors } from "@theme/colors";

interface ButtonProps extends PressableProps {
  variant?: "primary" | "secondary" | "outline" | "fun" | "glow";
  size?: "small" | "medium" | "large" | "extraLarge";
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  children: string;
}

type ButtonTheme = {
  background: string;
  text: string;
  pressed: string;
  disabled: string;
};

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "medium",
  loading = false,
  style,
  textStyle,
  children,
  disabled,
  ...props
}) => {
  // Theme-based color selection
  const themeColors: ButtonTheme =
    (colors.button[variant as keyof typeof colors.button] as ButtonTheme) ||
    (colors.button.primary as ButtonTheme);
  const backgroundColor: string = disabled
    ? themeColors.disabled
    : themeColors.background;
  const textColor: string = themeColors.text;
  const pressedColor: string = themeColors.pressed;

  // Get appropriate text variant based on button size and variant
  const getTextVariant = () => {
    if (variant === "fun" || variant === "glow") {
      return size === "extraLarge" ? "funHeading" : "funText";
    }
    switch (size) {
      case "small":
        return "buttonSmall";
      case "large":
      case "extraLarge":
        return "buttonLarge";
      default:
        return "button";
    }
  };

  const textVariant = getTextVariant();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        styles[size],
        {
          backgroundColor:
            variant === "outline"
              ? colors.common.transparent
              : pressed && !disabled
                ? pressedColor
                : backgroundColor,
          borderColor:
            variant === "outline"
              ? colors.button.primary.background
              : undefined,
          borderWidth: variant === "outline" ? 1 : undefined,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <View
          testID="button-loading"
          accessible
          accessibilityState={{ disabled: !!disabled }}
        >
          <ActivityIndicator color={textColor} />
        </View>
      ) : (
        <Text
          variant={textVariant}
          fun={variant === "fun"}
          glow={variant === "glow"}
          style={[
            {
              color:
                variant === "outline"
                  ? colors.button.primary.background
                  : textColor,
            },
            textStyle,
          ]}
        >
          {children}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  primary: {},
  secondary: {},
  outline: {},
  fun: {
    borderRadius: 20,
    shadowColor: colors.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  glow: {
    borderRadius: 16,
    shadowColor: colors.primary[400],
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  extraLarge: {
    paddingVertical: 20,
    paddingHorizontal: 40,
  },
});
