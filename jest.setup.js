// Jest setup file for React Native testing
import '@testing-library/jest-native/extend-expect';

// Mock react-native-reanimated at the very top
jest.mock('react-native-reanimated', () => {
  const mockSharedValue = (initialValue) => {
    let value = initialValue;
    const sharedValue = {
      get value() { return value; },
      set value(newValue) { value = newValue; },
    };
    return sharedValue;
  };

  const mockModule = {
    default: {
      View: 'Animated.View',
      Text: 'Animated.Text',
      Image: 'Animated.Image',
      ScrollView: 'Animated.ScrollView',
      createAnimatedComponent: (component) => component,
      call: () => {},
      addWhitelistedNativeProps: jest.fn(),
    },
    // Named exports
    useSharedValue: jest.fn(mockSharedValue),
    useDerivedValue: jest.fn((callback) => mockSharedValue(callback())),
    useAnimatedStyle: jest.fn((callback) => callback()),
    withTiming: jest.fn((toValue) => toValue),
    withSpring: jest.fn((toValue) => toValue),
    withRepeat: jest.fn((toValue) => toValue),
    withDelay: jest.fn((delay, toValue) => toValue),
    runOnJS: jest.fn((fn) => fn),
    clamp: jest.fn((value, min, max) => Math.min(Math.max(value, min), max)),
    interpolate: jest.fn((value, input, output) => output[0]),
    Extrapolate: {
      CLAMP: 'clamp',
      EXTEND: 'extend',
      IDENTITY: 'identity',
    },
  };

  return mockModule;
});

// Mock react-native-redash
jest.mock('react-native-redash', () => ({
  clamp: jest.fn((value, min, max) => Math.min(Math.max(value, min), max)),
}));

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {
  const React = require('react');
  console.log('[jest.mock] react-native-gesture-handler mock applied');
  const createGestureMock = () => {
    const self = {};
    self.onUpdate = jest.fn(() => self);
    self.onStart = jest.fn(() => self);
    self.onEnd = jest.fn(() => self);
    self.onTouchesDown = jest.fn(() => self);
    self.onTouchesUp = jest.fn(() => self);
    self.onFinalize = jest.fn(() => self);
    self.minPointers = jest.fn(() => self);
    self.maxPointers = jest.fn(() => self);
    self.enabled = jest.fn(() => self);
    self.simultaneousWithExternalGesture = jest.fn(() => self);
    self.requireExternalGestureToFail = jest.fn(() => self);
    return self;
  };

  const GestureDetector = ({ children }) => React.createElement(React.Fragment, null, children);

  return {
    Gesture: {
      Pinch: createGestureMock,
      Pan: createGestureMock,
      Simultaneous: (...gestures) => createGestureMock(),
    },
    GestureDetector,
  };
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
    Text: View,
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
    t: (key) => key,
    i18n: {
      changeLanguage: jest.fn(),
      language: 'en',
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

// Suppress console warnings for known issues
const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  const message = args[0];
  if (
    typeof message === "string" &&
    (message.includes("NativeEventEmitter") ||
      message.includes("SettingsManager") ||
      message.includes("PushNotificationIOS") ||
      message.includes("ProgressBarAndroid") ||
      message.includes("Clipboard"))
  ) {
    return;
  }
  originalConsoleWarn(...args);
};

// Suppress console.error for expected error reporting in tests
const originalConsoleError = console.error;
console.error = (...args) => {
  const message = args[0];
  if (
    typeof message === "string" &&
    (message.includes("Production error report:") ||
      message.includes("Error captured:"))
  ) {
    return;
  }
  originalConsoleError(...args);
};

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

// Mock expo-image
jest.mock('expo-image', () => ({
  Image: 'Image',
}));

// Mock expo-av
jest.mock("expo-av", () => ({
  Audio: {
    Sound: jest.fn(),
    setAudioModeAsync: jest.fn(),
  },
}));

// Mock React Native Settings module to prevent native module errors
jest.mock("react-native/Libraries/Settings/Settings", () => ({
  get: jest.fn(),
  set: jest.fn(),
}));

// Mock NativeEventEmitter to prevent listener warnings
jest.mock("react-native/Libraries/EventEmitter/NativeEventEmitter", () => {
  return jest.fn().mockImplementation(() => ({
    addListener: jest.fn(),
    removeListeners: jest.fn(),
  }));
});

// Mock DevSettings to prevent native module errors
jest.mock("react-native/Libraries/Utilities/DevSettings", () => ({
  addMenuItem: jest.fn(),
  reload: jest.fn(),
}));

// Mock React Native
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    PanResponder: {
      create: jest.fn((config) => ({
        panHandlers: {
          onStartShouldSetResponder: config.onStartShouldSetPanResponder || (() => false),
          onMoveShouldSetResponder: config.onMoveShouldSetPanResponder || (() => false),
          onResponderGrant: config.onPanResponderGrant || (() => {}),
          onResponderMove: config.onPanResponderMove || (() => {}),
          onResponderRelease: config.onPanResponderRelease || (() => {}),
          onResponderTerminate: config.onPanResponderTerminate || (() => {}),
        },
      })),
    },
  };
});

// Mock AsyncStorage to prevent storage-related errors
jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn().mockResolvedValue(undefined),
  getItem: jest.fn().mockResolvedValue(null),
  removeItem: jest.fn().mockResolvedValue(undefined),
  multiRemove: jest.fn().mockResolvedValue(undefined),
  clear: jest.fn().mockResolvedValue(undefined),
  getAllKeys: jest.fn().mockResolvedValue([]),
}));

// Mock i18next to prevent translation errors
jest.mock("i18next", () => ({
  t: jest.fn((key) => key),
  language: "en",
  changeLanguage: jest.fn(),
}));

// Mock expo-router to prevent navigation errors
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  useSegments: () => [],
}));

// Mock expo-constants to prevent app config errors
jest.mock("expo-constants", () => ({
  expoConfig: {
    extra: {
      apiUrl: "http://localhost:3000",
    },
  },
}));

// Global test setup
beforeEach(() => {
  jest.clearAllMocks();
});

// Global test teardown
afterEach(() => {
  jest.clearAllMocks();
}); 