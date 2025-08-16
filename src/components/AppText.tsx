import React from 'react';
import { Text, TextProps, StyleProp, TextStyle } from 'react-native';
import { textStyles, typography } from '../theme/typography';

export type AppTextVariant = 'body' | 'heading1' | 'heading2' | 'heading3' | 'button';

export interface AppTextProps extends TextProps {
  children: React.ReactNode;
  weight?: 'Regular' | 'Medium' | 'SemiBold' | 'Bold' | 'Light';
  style?: StyleProp<TextStyle>;
  variant?: AppTextVariant;
}

export const AppText = ({ children, weight, style, variant = 'body', ...props }: AppTextProps) => {
  const variantStyle = textStyles[variant] || textStyles.body;
  // Remove textAlignVertical and textTransform if present
  const { textAlignVertical, textTransform, ...safeVariantStyle } = variantStyle as any;
  
  // Apply font weight if specified (overrides the variant's font family)
  const fontFamily = weight ? typography.fontFamily[weight.toLowerCase() as keyof typeof typography.fontFamily] : undefined;
  
  return (
    <Text 
      style={[
        safeVariantStyle, 
        fontFamily && { fontFamily },
        style
      ]} 
      {...props}
    >
      {children}
    </Text>
  );
}; 