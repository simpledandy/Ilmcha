import React from 'react';
import {
  TextInput,
  TextInputProps,
  StyleSheet,
  View,
  Platform,
} from 'react-native';
import { typography } from '@theme/typography';
import { inputVariants } from '@theme/input';
import { Text } from './Text';
import { colors } from '@theme/colors';

interface CustomInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: any;
  variant?: keyof typeof inputVariants;
  size?: 'small' | 'default' | 'large';
}

export const Input: React.FC<CustomInputProps> = ({
  label,
  error,
  style,
  containerStyle,
  placeholder,
  placeholderTextColor,
  variant = 'default',
  size = 'default',
  ...props
}) => {
  const variantStyle = inputVariants[variant];
  
  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text 
          variant="label" 
          style={[
            styles.label,
            error && { color: colors.error[500] }
          ]}
        >
          {label}
        </Text>
      )}
      <TextInput
        style={[
          variantStyle.input,
          size === 'large' && styles.inputLarge,
          size === 'small' && styles.inputSmall,
          {
            fontFamily: variantStyle.font,
          },
          error && { 
            borderColor: colors.input.error,
            borderWidth: 1,
          },
          style,
        ]}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor || colors.input.placeholder}
        {...props}
      />
      {error && (
        <Text 
          variant="caption" 
          style={[styles.error, { color: colors.error[500] }]}
        >
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
  },
  inputLarge: {
    height: 56,
    fontSize: typography.fontSize.lg,
    paddingHorizontal: 16,
  },
  inputSmall: {
    height: 40,
    fontSize: typography.fontSize.sm,
    paddingHorizontal: 10,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  error: {
    color: '#EF4444',
    marginTop: 4,
  },
});

export default Input;