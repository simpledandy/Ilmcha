// Jest setup file for React Native testing
import '@testing-library/jest-native/extend-expect';

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock expo-av
jest.mock('expo-av', () => ({
  Audio: {
    Sound: jest.fn().mockImplementation(() => ({
      loadAsync: jest.fn(),
      playAsync: jest.fn(),
      stopAsync: jest.fn(),
      unloadAsync: jest.fn(),
      getStatusAsync: jest.fn().mockResolvedValue({ isLoaded: true }),
    })),
    setAudioModeAsync: jest.fn(),
  },
}));

// Mock expo-font
jest.mock('expo-font', () => ({
  useFonts: jest.fn(() => [true]),
}));

// Mock expo-splash-screen
jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn(),
  hideAsync: jest.fn(),
}));

// Mock expo-constants
jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      enableErrorReporting: true,
    },
  },
}));

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native/Libraries/Components/View/View');
  const Text = require('react-native/Libraries/Text/Text');
  const TouchableOpacity = require('react-native/Libraries/Components/Touchable/TouchableOpacity');
  
  return {
    PanGestureHandler: View,
    TapGestureHandler: TouchableOpacity,
    State: {
      UNDETERMINED: 0,
      FAILED: 1,
      BEGAN: 2,
      CANCELLED: 3,
      ACTIVE: 4,
      END: 5,
    },
    GestureHandlerRootView: View,
  };
});

// Mock react-native-svg
jest.mock('react-native-svg', () => {
  const React = require('react');
  const View = require('react-native/Libraries/Components/View/View');
  
  return {
    Svg: View,
    Path: View,
    Circle: View,
    Rect: View,
    Line: View,
    Polyline: View,
    Polygon: View,
    Defs: View,
    LinearGradient: View,
    RadialGradient: View,
    Stop: View,
  };
});

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
  usePathname: () => '/',
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  },
  Redirect: ({ href }) => null,
  Slot: ({ children }) => children,
  Stack: {
    Screen: ({ children }) => children,
  },
}));

// Mock i18next
jest.mock('i18next', () => ({
  t: jest.fn((key) => key),
  language: 'en',
  changeLanguage: jest.fn(),
}));

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: jest.fn((key) => key),
    i18n: {
      language: 'en',
      changeLanguage: jest.fn(),
    },
  }),
}));

// Global error handler for tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// Suppress specific warnings in tests
const originalWarn = console.warn;
beforeAll(() => {
  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('componentWillReceiveProps') ||
       args[0].includes('componentWillUpdate') ||
       args[0].includes('AsyncStorage has been extracted') ||
       args[0].includes('ProgressBarAndroid has been extracted') ||
       args[0].includes('Clipboard has been extracted') ||
       args[0].includes('PushNotificationIOS has been extracted') ||
       args[0].includes('NativeEventEmitter'))
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.warn = originalWarn;
});

// Mock global fetch
global.fetch = jest.fn();

// Mock global __DEV__
global.__DEV__ = false;

// Setup test environment
beforeEach(() => {
  jest.clearAllMocks();
});

// Custom matchers for testing
expect.extend({
  toBeValidPathData(received) {
    const pass = typeof received === 'string' && received.length > 0;
    if (pass) {
      return {
        message: () => `expected ${received} not to be valid path data`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be valid path data`,
        pass: false,
      };
    }
  },
}); 