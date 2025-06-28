import React from "react";
import { Text as RNText, TextProps, StyleSheet, Platform } from "react-native";
import { typography, textStyles, fontWeights } from "@theme/typography";

interface CustomTextProps extends TextProps {
  variant?: keyof typeof textStyles;
  weight?: keyof typeof fontWeights;
  fun?: boolean; // For children's app fun styling
  glow?: boolean; // For special effects
  sparkle?: boolean; // For extra special effects
}

export const Text: React.FC<CustomTextProps> = ({
  style,
  variant = "body",
  weight,
  fun = false,
  glow = false,
  sparkle = false,
  children,
  ...props
}) => {
  // Get the base style for the variant
  const variantStyle = textStyles[variant] || textStyles.body;

  // Get the font family
  let fontFamily = variantStyle.fontFamily;

  // Handle special effects
  if (glow) {
    fontFamily = textStyles.glow.fontFamily;
  } else if (sparkle) {
    fontFamily = textStyles.sparkle.fontFamily;
  } else if (fun) {
    fontFamily = textStyles.funText.fontFamily;
  } else if (weight) {
    try {
      const weightKey = weight;
      if (fontWeights[weightKey]) {
        fontFamily = fontWeights[weightKey];
      }
    } catch {
      // Invalid font weight - use default
    }
  }

  // Apply special effect styles
  let specialStyle = {};
  if (glow) {
    specialStyle = textStyles.glow;
  } else if (sparkle) {
    specialStyle = textStyles.sparkle;
  } else if (fun) {
    specialStyle = textStyles.funText;
  }

  return (
    <RNText
      style={[
        styles.base,
        variantStyle,
        specialStyle,
        weight && { fontFamily },
        Platform.select({
          android: {
            // Android specific adjustments
            includeFontPadding: false,
            textAlignVertical: "center",
          },
          ios: {
            // Add extra padding for iOS if needed
            paddingVertical: 2,
          },
        }),
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  base: {
    fontFamily: typography.fontFamily.regular,
  },
});
