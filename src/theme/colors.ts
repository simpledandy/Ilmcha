export const colors = {
  // Brand colors
  primary: {
    50: '#E6F0FF',
    100: '#CCE0FF',
    200: '#99C2FF',
    300: '#66A3FF',
    400: '#3385FF',
    500: '#007AFF', // Main primary color
    600: '#0062CC',
    700: '#004999',
    800: '#003166',
    900: '#001833',
  },

  // Neutral colors
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  // Semantic colors
  success: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    500: '#10B981',
    600: '#059669',
  },

  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    500: '#EF4444',
    600: '#DC2626',
  },

  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    500: '#F59E0B',
    600: '#D97706',
  },

  info: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    500: '#3B82F6',
    600: '#2563EB',
  },

  // Common colors
  common: {
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',
  },

  // Background colors
  background: {
    primary: '#FFFFFF',
    secondary: '#F9FAFB',
    tertiary: '#F3F4F6',
  },

  // Text colors
  text: {
    primary: '#1F2937',
    secondary: '#4B5563',
    tertiary: '#6B7280',
    disabled: '#9CA3AF',
    inverse: '#FFFFFF',
  },

  // Border colors
  border: {
    light: '#E5E7EB',
    default: '#D1D5DB',
    dark: '#9CA3AF',
  },

  // Input colors
  input: {
    background: '#FFFFFF',
    border: '#E5E7EB',
    placeholder: '#9CA3AF',
    focused: '#007AFF',
    error: '#EF4444',
  },

  // Button colors
  button: {
    primary: {
      background: '#007AFF',
      text: '#FFFFFF',
      pressed: '#0062CC',
      disabled: '#CCE0FF',
    },
    secondary: {
      background: '#F3F4F6',
      text: '#1F2937',
      pressed: '#E5E7EB',
      disabled: '#F9FAFB',
    },
  },
};

// Theme-specific colors
export const lightTheme = {
  ...colors,
  // Add any light theme specific overrides
};

export const darkTheme = {
  ...colors,
  // Add dark theme specific overrides when needed
  background: {
    primary: '#111827',
    secondary: '#1F2937',
    tertiary: '#374151',
  },
  text: {
    primary: '#F9FAFB',
    secondary: '#E5E7EB',
    tertiary: '#D1D5DB',
    disabled: '#6B7280',
    inverse: '#111827',
  },
  // ... other dark theme overrides
};

export type Colors = typeof colors;
export default colors; 