export const typography = {
  fontFamily: {
    // Regular Sono variants
    regular: 'Sono-Regular',
    light: 'Sono-Light',
    extraLight: 'Sono-ExtraLight',
    medium: 'Sono-Medium',
    semiBold: 'Sono-SemiBold',
    bold: 'Sono-Bold',
    extraBold: 'Sono-ExtraBold',
    
    // Proportional variants
    proportionalRegular: 'Sono_Proportional-Regular',
    proportionalLight: 'Sono_Proportional-Light',
    proportionalExtraLight: 'Sono_Proportional-ExtraLight',
    proportionalMedium: 'Sono_Proportional-Medium',
    proportionalSemiBold: 'Sono_Proportional-SemiBold',
    proportionalBold: 'Sono_Proportional-Bold',
    proportionalExtraBold: 'Sono_Proportional-ExtraBold',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
    // Absolute values for precise control
    xs: 16,
    sm: 20,
    base: 24,
    lg: 28,
    xl: 32,
    '2xl': 40,
    '3xl': 48,
  },
  letterSpacing: {
    tighter: -0.8,
    tight: -0.4,
    normal: 0,
    wide: 0.4,
    wider: 0.8,
  },
};

// Predefined text styles using Sono fonts
export const textStyles = {
  heading1: {
    fontFamily: typography.fontFamily.proportionalBold,
    fontSize: typography.fontSize['4xl'],
    lineHeight: typography.lineHeight['3xl'], // Increased line height
    letterSpacing: typography.letterSpacing.tight,
    includeFontPadding: false, // Important for Android
    textAlignVertical: 'center', // Important for Android
  },
  heading2: {
    fontFamily: typography.fontFamily.proportionalSemiBold,
    fontSize: typography.fontSize['3xl'],
    lineHeight: typography.lineHeight['2xl'],
    letterSpacing: typography.letterSpacing.tight,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  heading3: {
    fontFamily: typography.fontFamily.proportionalMedium,
    fontSize: typography.fontSize['2xl'],
    lineHeight: typography.lineHeight.xl,
    letterSpacing: typography.letterSpacing.tight,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  body: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.base,
    lineHeight: typography.lineHeight.base,
    letterSpacing: typography.letterSpacing.normal,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  bodyLarge: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.lg,
    lineHeight: typography.lineHeight.lg,
    letterSpacing: typography.letterSpacing.normal,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  caption: {
    fontFamily: typography.fontFamily.light,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
    letterSpacing: typography.letterSpacing.normal,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  button: {
    fontFamily: typography.fontFamily.proportionalMedium,
    fontSize: typography.fontSize.base,
    lineHeight: typography.lineHeight.base,
    letterSpacing: typography.letterSpacing.wide,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  label: {
    fontFamily: typography.fontFamily.proportionalMedium,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
    letterSpacing: typography.letterSpacing.normal,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
};

export default typography;
