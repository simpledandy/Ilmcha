export const typography = {
  fontFamily: {
    // Regular Sono variants
    regular: "Sono-Regular",
    light: "Sono-Light",
    medium: "Sono-Medium",
    semiBold: "Sono-SemiBold",
    bold: "Sono-Bold",
    extraBold: "Sono-ExtraBold",
    extraLight: "Sono-ExtraLight",

    // Proportional variants
    proportionalRegular: "Sono_Proportional-Regular",
    proportionalLight: "Sono_Proportional-Light",
    proportionalExtraLight: "Sono_Proportional-ExtraLight",
    proportionalMedium: "Sono_Proportional-Medium",
    proportionalSemiBold: "Sono_Proportional-SemiBold",
    proportionalBold: "Sono_Proportional-Bold",
    proportionalExtraBold: "Sono_Proportional-ExtraBold",
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
    "4xl": 36,
    "5xl": 48,
    "6xl": 60,
  },
  lineHeight: {
    // Absolute values for precise control
    xs: 16,
    sm: 20,
    base: 24,
    lg: 28,
    xl: 32,
    "2xl": 40,
    "3xl": 48,
    "4xl": 56,
    "5xl": 72,
  },
  letterSpacing: {
    tighter: -0.8,
    tight: -0.4,
    normal: 0,
    wide: 0.4,
    wider: 0.8,
    widest: 1.2,
  },
};

// Predefined text styles using Sono fonts
export const textStyles = {
  // Main heading styles
  heading1: {
    fontFamily: typography.fontFamily.proportionalBold,
    fontSize: typography.fontSize["4xl"],
    lineHeight: typography.lineHeight["3xl"],
    letterSpacing: typography.letterSpacing.tight,
    includeFontPadding: false,
  },
  heading2: {
    fontFamily: typography.fontFamily.proportionalSemiBold,
    fontSize: typography.fontSize["3xl"],
    lineHeight: typography.lineHeight["2xl"],
    letterSpacing: typography.letterSpacing.tight,
    includeFontPadding: false,
  },
  heading3: {
    fontFamily: typography.fontFamily.proportionalMedium,
    fontSize: typography.fontSize["2xl"],
    lineHeight: typography.lineHeight.xl,
    letterSpacing: typography.letterSpacing.tight,
    includeFontPadding: false,
  },

  // Body text styles
  body: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.base,
    lineHeight: typography.lineHeight.base,
    letterSpacing: typography.letterSpacing.normal,
    includeFontPadding: false,
  },
  bodyLarge: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.lg,
    lineHeight: typography.lineHeight.lg,
    letterSpacing: typography.letterSpacing.normal,
    includeFontPadding: false,
  },
  bodySmall: {
    fontFamily: typography.fontFamily.light,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
    letterSpacing: typography.letterSpacing.normal,
    includeFontPadding: false,
  },

  // Caption and helper text
  caption: {
    fontFamily: typography.fontFamily.light,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
    letterSpacing: typography.letterSpacing.normal,
    includeFontPadding: false,
  },
  captionSmall: {
    fontFamily: typography.fontFamily.extraLight,
    fontSize: typography.fontSize.xs,
    lineHeight: typography.lineHeight.xs,
    letterSpacing: typography.letterSpacing.normal,
    includeFontPadding: false,
  },

  // Interactive elements
  button: {
    fontFamily: typography.fontFamily.proportionalMedium,
    fontSize: typography.fontSize.base,
    lineHeight: typography.lineHeight.base,
    letterSpacing: typography.letterSpacing.wide,
    includeFontPadding: false,
  },
  buttonLarge: {
    fontFamily: typography.fontFamily.proportionalSemiBold,
    fontSize: typography.fontSize.lg,
    lineHeight: typography.lineHeight.lg,
    letterSpacing: typography.letterSpacing.wide,
    includeFontPadding: false,
  },
  buttonSmall: {
    fontFamily: typography.fontFamily.proportionalMedium,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
    letterSpacing: typography.letterSpacing.wide,
    includeFontPadding: false,
  },

  // Labels and form elements
  label: {
    fontFamily: typography.fontFamily.proportionalMedium,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
    letterSpacing: typography.letterSpacing.normal,
    includeFontPadding: false,
  },
  input: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.base,
    lineHeight: typography.lineHeight.base,
    letterSpacing: typography.letterSpacing.normal,
    includeFontPadding: false,
  },

  // Children's app specific styles
  display: {
    fontFamily: typography.fontFamily.proportionalExtraBold,
    fontSize: typography.fontSize["5xl"],
    lineHeight: typography.lineHeight["4xl"],
    letterSpacing: typography.letterSpacing.tight,
    includeFontPadding: false,
  },
  displayLarge: {
    fontFamily: typography.fontFamily.proportionalBold,
    fontSize: typography.fontSize["6xl"],
    lineHeight: typography.lineHeight["5xl"],
    letterSpacing: typography.letterSpacing.tight,
    includeFontPadding: false,
  },

  // Fun and engaging styles for children
  funHeading: {
    fontFamily: typography.fontFamily.proportionalBold,
    fontSize: typography.fontSize["3xl"],
    lineHeight: typography.lineHeight["2xl"],
    letterSpacing: typography.letterSpacing.wide,
    includeFontPadding: false,
  },
  funText: {
    fontFamily: typography.fontFamily.proportionalMedium,
    fontSize: typography.fontSize.lg,
    lineHeight: typography.lineHeight.lg,
    letterSpacing: typography.letterSpacing.wide,
    includeFontPadding: false,
  },

  // Score and numbers
  score: {
    fontFamily: typography.fontFamily.proportionalBold,
    fontSize: typography.fontSize.xl,
    lineHeight: typography.lineHeight.xl,
    letterSpacing: typography.letterSpacing.tight,
    includeFontPadding: false,
  },
  scoreLarge: {
    fontFamily: typography.fontFamily.proportionalExtraBold,
    fontSize: typography.fontSize["3xl"],
    lineHeight: typography.lineHeight["2xl"],
    letterSpacing: typography.letterSpacing.tight,
    includeFontPadding: false,
  },

  // Navigation and UI elements
  navTitle: {
    fontFamily: typography.fontFamily.proportionalSemiBold,
    fontSize: typography.fontSize.lg,
    lineHeight: typography.lineHeight.lg,
    letterSpacing: typography.letterSpacing.normal,
    includeFontPadding: false,
  },
  tabLabel: {
    fontFamily: typography.fontFamily.proportionalMedium,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
    letterSpacing: typography.letterSpacing.wide,
    includeFontPadding: false,
  },

  // Special effects
  glow: {
    fontFamily: typography.fontFamily.proportionalBold,
    fontSize: typography.fontSize["2xl"],
    lineHeight: typography.lineHeight.xl,
    letterSpacing: typography.letterSpacing.wider,
    includeFontPadding: false,
  },
  sparkle: {
    fontFamily: typography.fontFamily.proportionalMedium,
    fontSize: typography.fontSize.lg,
    lineHeight: typography.lineHeight.lg,
    letterSpacing: typography.letterSpacing.widest,
    includeFontPadding: false,
  },
};

// Font weight mapping for easy conversion
export const fontWeights = {
  light: typography.fontFamily.light,
  regular: typography.fontFamily.regular,
  medium: typography.fontFamily.medium,
  semiBold: typography.fontFamily.semiBold,
  bold: typography.fontFamily.bold,
  extraBold: typography.fontFamily.extraBold,
  extraLight: typography.fontFamily.extraLight,

  // Proportional variants
  proportionalLight: typography.fontFamily.proportionalLight,
  proportionalRegular: typography.fontFamily.proportionalRegular,
  proportionalMedium: typography.fontFamily.proportionalMedium,
  proportionalSemiBold: typography.fontFamily.proportionalSemiBold,
  proportionalBold: typography.fontFamily.proportionalBold,
  proportionalExtraBold: typography.fontFamily.proportionalExtraBold,
  proportionalExtraLight: typography.fontFamily.proportionalExtraLight,
};
