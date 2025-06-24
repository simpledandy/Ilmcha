import React from 'react';
import { 
  Pressable, 
  PressableProps, 
  StyleSheet, 
  ViewStyle,
  StyleProp,
  ActivityIndicator,
  TextStyle,
} from 'react-native';
import { Text } from './Text';
import { colors } from '@theme/colors';
import { textStyles } from '@theme/typography';

interface ButtonProps extends PressableProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  children: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary',
  size = 'medium',
  loading = false,
  style,
  textStyle,
  children,
  disabled,
  ...props 
}) => {
  // Theme-based color selection
  const themeColors = colors.button[variant] || colors.button.primary;
  const backgroundColor = disabled
    ? themeColors.disabled
    : themeColors.background;
  const textColor = themeColors.text;
  const pressedColor = themeColors.pressed;

  return (
    <Pressable 
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        styles[size],
        {
          backgroundColor:
            variant === 'outline'
              ? colors.common.transparent
              : pressed && !disabled
              ? pressedColor
              : backgroundColor,
          borderColor: variant === 'outline' ? colors.button.primary.background : undefined,
          borderWidth: variant === 'outline' ? 1 : undefined,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text 
          style={[
            textStyles.button,
            { color: variant === 'outline' ? colors.button.primary.background : textColor },
            textStyle as StyleProp<TextStyle>,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {},
  secondary: {},
  outline: {},
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
});