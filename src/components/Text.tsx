import React from 'react';
import { Text as RNText, TextProps, StyleSheet, Platform } from 'react-native';
import { typography, textStyles } from '@theme/typography';

interface CustomTextProps extends TextProps {
  variant?: keyof typeof textStyles;
  weight?: keyof typeof typography.fontFamily;
  proportional?: boolean;
}

export const Text: React.FC<CustomTextProps> = ({ 
  style, 
  variant = 'body', 
  weight,
  proportional = false,
  children,
  ...props 
}) => {
  // Get the base style for the variant
  const variantStyle = textStyles[variant] || textStyles.body;
  
  // Get the font family
  let fontFamily = variantStyle.fontFamily;
  
  if (weight) {
    try {
      const prefix = proportional ? 'proportional' : '';
      const weightKey = `${prefix}${weight.charAt(0).toUpperCase() + weight.slice(1)}` as keyof typeof typography.fontFamily;
      if (typography.fontFamily[weightKey]) {
        fontFamily = typography.fontFamily[weightKey];
      }
    } catch (error) {
      console.warn(`Invalid font weight: ${weight}`);
    }
  }
  
  return (
    <RNText 
      style={[
        styles.base,
        variantStyle,
        weight && { fontFamily },
        Platform.select({
          android: {
            // Android specific adjustments
            includeFontPadding: false,
            textAlignVertical: 'center',
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

export default Text;
