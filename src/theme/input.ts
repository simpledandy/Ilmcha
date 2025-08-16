import { colors } from './colors';
import { typography } from './typography';
import { StyleSheet } from 'react-native';

export const inputStyles = StyleSheet.create({
  base: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.input.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.primary,
    backgroundColor: colors.input.background,
  },
  large: {
    height: 56,
    fontSize: typography.fontSize.lg,
    paddingHorizontal: 16,
  },
  small: {
    height: 40,
    fontSize: typography.fontSize.sm,
    paddingHorizontal: 10,
  },
});

export const inputVariants = {
  default: {
    input: inputStyles.base,
    font: typography.fontFamily.regular,
    placeholder: typography.fontFamily.light,
    colors: {
      border: colors.input.border,
      background: colors.input.background,
      text: colors.text.primary,
      placeholder: colors.input.placeholder,
      focused: colors.input.focused,
      error: colors.input.error,
    },
  },
  filled: {
    input: {
      ...inputStyles.base,
      backgroundColor: colors.background.tertiary,
      borderWidth: 0,
    },
    font: typography.fontFamily.medium,
    placeholder: typography.fontFamily.regular,
    colors: {
      border: 'transparent',
      background: colors.background.tertiary,
      text: colors.text.primary,
      placeholder: colors.input.placeholder,
      focused: colors.input.focused,
      error: colors.input.error,
    },
  },
  outlined: {
    input: {
      ...inputStyles.base,
      borderWidth: 2,
    },
    font: typography.fontFamily.medium,
    placeholder: typography.fontFamily.regular,
  },
}; 