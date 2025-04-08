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
import Text from './Text';

interface ButtonProps extends PressableProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<ViewStyle>;
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
  return (
    <Pressable 
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        styles[size],
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? 'white' : '#007AFF'} />
      ) : (
        <Text 
          style={[
            styles.text,
            styles[`${variant}Text`],
            textStyle as StyleProp<TextStyle>
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
  primary: {
    backgroundColor: '#007AFF',
  },
  secondary: {
    backgroundColor: 'white',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'white',
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
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
  },
  primaryText: {
    color: 'white',
  },
  secondaryText: {
    color: '#007AFF',
  },
  outlineText: {
    color: 'white',
  },
});

export default Button;