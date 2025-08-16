import React, { ReactNode } from 'react';
import { 
  Pressable, 
  PressableProps, 
  StyleSheet, 
  ViewStyle,
  StyleProp,
  ActivityIndicator,
  TextStyle,
} from 'react-native';
import { AppText } from './AppText';
import { colors } from '@theme/colors';
import { textStyles } from '@theme/typography';

interface AppButtonProps extends PressableProps {
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  children: ReactNode;
}

export const AppButton: React.FC<AppButtonProps> = ({ 
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
            pressed && !disabled
              ? pressedColor
              : backgroundColor,
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
        typeof children === 'string' ? (
          <AppText 
            style={[
              textStyles.button,
              { color: textColor },
              textStyle as StyleProp<TextStyle>,
            ].filter(Boolean)}
          >
            {children}
          </AppText>
        ) : (
          children
        )
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

export default AppButton;