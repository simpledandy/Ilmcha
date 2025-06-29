// Jest setup file for React Native testing
import '@testing-library/jest-native/extend-expect';

// Mock all image and asset imports
jest.mock('@assets/images/icon.png', () => 'icon.png');
jest.mock('@assets/images/favicon.png', () => 'favicon.png');
jest.mock('@assets/images/adaptive-icon.png', () => 'adaptive-icon.png');
jest.mock('@assets/images/splash-icon.png', () => 'splash-icon.png');
jest.mock('@assets/images/tale-icon.png', () => 'tale-icon.png');
jest.mock('@assets/images/lock-icon.png', () => 'lock-icon.png');
jest.mock('@assets/images/chest.png', () => 'chest.png');
jest.mock('@assets/images/chest-open.png', () => 'chest-open.png');
jest.mock('@assets/images/light.png', () => 'light.png');
jest.mock('@assets/images/number-five.png', () => 'number-five.png');
jest.mock('@assets/images/cloud-left.png', () => 'cloud-left.png');
jest.mock('@assets/images/cloud-right.png', () => 'cloud-right.png');
jest.mock('@assets/images/counting_bg.png', () => 'counting_bg.png');
jest.mock('@assets/images/boy-avatar.png', () => 'boy-avatar.png');
jest.mock('@assets/images/girl-avatar.png', () => 'girl-avatar.png');
jest.mock('@assets/images/add-icon.png', () => 'add-icon.png');
jest.mock('@assets/images/empty-avatar.png', () => 'empty-avatar.png');
jest.mock('@assets/images/island.png', () => 'island.png');
jest.mock('@assets/images/backgrounds/stories_bg.png', () => 'stories_bg.png');
jest.mock('@assets/images/penguin/waving-pink.png', () => 'waving-pink.png');
jest.mock('@assets/images/penguin/waving-gray.png', () => 'waving-gray.png');
jest.mock('@assets/images/penguin/with-laptop-questioning-pink.png', () => 'with-laptop-questioning-pink.png');
jest.mock('@assets/images/penguin/with-laptop-questioning-green.png', () => 'with-laptop-questioning-green.png');
jest.mock('@assets/images/penguin/holding-pencil-pink.png', () => 'holding-pencil-pink.png');
jest.mock('@assets/images/penguin/holding-pencil-green.png', () => 'holding-pencil-green.png');
jest.mock('@assets/images/penguin/flying-open-eye-pink.png', () => 'flying-open-eye-pink.png');
jest.mock('@assets/images/penguin/waving-explorer.png', () => 'waving-explorer.png');
jest.mock('@assets/images/backgrounds/islands/numeriya.png', () => 'numeriya.png');
jest.mock('@assets/images/backgrounds/islands/alifbo.png', () => 'alifbo.png');
jest.mock('@assets/images/backgrounds/islands/blank.png', () => 'blank.png');
jest.mock('@assets/images/backgrounds/auth/white.png', () => 'white.png');
jest.mock('@assets/images/backgrounds/auth/blue.png', () => 'blue.png');
jest.mock('@assets/images/backgrounds/ocean-bg.png', () => 'ocean-bg.png');
jest.mock('@assets/images/backgrounds/islands/adventure/numeriya-island-bg.png', () => 'numeriya-island-bg.png');
jest.mock('@assets/images/backgrounds/islands/adventure/alifbo-island-bg.png', () => 'alifbo-island-bg.png');
jest.mock('@assets/images/backgrounds/islands/adventure/basics-island-bg.png', () => 'basics-island-bg.png');
jest.mock('@assets/images/backgrounds/islands/adventure/colors-island-bg.png', () => 'colors-island-bg.png');
jest.mock('@assets/images/backgrounds/islands/adventure/shapes-island-bg.png', () => 'shapes-island-bg.png');
jest.mock('@assets/images/backgrounds/islands/adventure/family-island-bg.png', () => 'family-island-bg.png');
jest.mock('@assets/images/backgrounds/islands/adventure/food-island-bg.png', () => 'food-island-bg.png');
jest.mock('@assets/images/backgrounds/islands/adventure/conversation-island-bg.png', () => 'conversation-island-bg.png');
jest.mock('@assets/images/backgrounds/islands/adventure/default-island-bg.png', () => 'default-island-bg.png');
jest.mock('@assets/images/backgrounds/islands/adventure/lesson-node.png', () => 'lesson-node.png');
jest.mock('@assets/images/backgrounds/islands/adventure/lake-node.png', () => 'lake-node.png');
jest.mock('@assets/images/backgrounds/islands/adventure/cave-node.png', () => 'cave-node.png');
jest.mock('@assets/images/backgrounds/islands/adventure/forest-node.png', () => 'forest-node.png');
jest.mock('@assets/images/backgrounds/islands/adventure/garden-node.png', () => 'garden-node.png');
jest.mock('@assets/images/backgrounds/islands/adventure/yard-node.png', () => 'yard-node.png');
jest.mock('@assets/images/backgrounds/islands/adventure/castle-node.png', () => 'castle-node.png');
jest.mock('@assets/images/backgrounds/islands/adventure/beach-node.png', () => 'beach-node.png');
jest.mock('@assets/images/backgrounds/islands/adventure/mountain-node.png', () => 'mountain-node.png');

// Mock all audio files
jest.mock('@assets/audios/en/butterfly-tale-en.mp3', () => 'butterfly-tale-en.mp3');
jest.mock('@assets/audios/en/clouds-tale-en.mp3', () => 'clouds-tale-en.mp3');
jest.mock('@assets/audios/en/coins-en.mp3', () => 'coins-en.mp3');
jest.mock('@assets/audios/en/congrats-en.mp3', () => 'congrats-en.mp3');
jest.mock('@assets/audios/en/congrats-you-won-en.mp3', () => 'congrats-you-won-en.mp3');
jest.mock('@assets/audios/en/counting-fish-en.mp3', () => 'counting-fish-en.mp3');
jest.mock('@assets/audios/en/daily-gift-en.mp3', () => 'daily-gift-en.mp3');
jest.mock('@assets/audios/en/eight-en.aac', () => 'eight-en.aac');
jest.mock('@assets/audios/en/five-en.aac', () => 'five-en.aac');
jest.mock('@assets/audios/en/four-en.aac', () => 'four-en.aac');
jest.mock('@assets/audios/en/friend-tale-en.mp3', () => 'friend-tale-en.mp3');
jest.mock('@assets/audios/en/gift-wheel-en.mp3', () => 'gift-wheel-en.mp3');
jest.mock('@assets/audios/en/hero-tale-en.mp3', () => 'hero-tale-en.mp3');
jest.mock('@assets/audios/en/island-numeriya-en.mp3', () => 'island-numeriya-en.mp3');
jest.mock('@assets/audios/en/lets-go-en.mp3', () => 'lets-go-en.mp3');
jest.mock('@assets/audios/en/navigation-en.mp3', () => 'navigation-en.mp3');
jest.mock('@assets/audios/en/nine-en.aac', () => 'nine-en.aac');
jest.mock('@assets/audios/en/one-en.aac', () => 'one-en.aac');
jest.mock('@assets/audios/en/profile-en.mp3', () => 'profile-en.mp3');
jest.mock('@assets/audios/en/seven-en.aac', () => 'seven-en.aac');
jest.mock('@assets/audios/en/six-en.aac', () => 'six-en.aac');
jest.mock('@assets/audios/en/sleep-reminder-en.mp3', () => 'sleep-reminder-en.mp3');
jest.mock('@assets/audios/en/store-en.mp3', () => 'store-en.mp3');
jest.mock('@assets/audios/en/ten-en.aac', () => 'ten-en.aac');
jest.mock('@assets/audios/en/three-en.aac', () => 'three-en.aac');
jest.mock('@assets/audios/en/tracker-en.mp3', () => 'tracker-en.mp3');
jest.mock('@assets/audios/en/two-en.aac', () => 'two-en.aac');
jest.mock('@assets/audios/en/unavailable-en.mp3', () => 'unavailable-en.mp3');
jest.mock('@assets/audios/en/welcome-tales-en.mp3', () => 'welcome-tales-en.mp3');
jest.mock('@assets/audios/en/where-to-fly-en.mp3', () => 'where-to-fly-en.mp3');

// Mock Uzbek audio files
jest.mock('@assets/audios/uz/butterfly-tale-uz.mp3', () => 'butterfly-tale-uz.mp3');
jest.mock('@assets/audios/uz/clouds-tale-uz.mp3', () => 'clouds-tale-uz.mp3');
jest.mock('@assets/audios/uz/coins-uz.m4a', () => 'coins-uz.m4a');
jest.mock('@assets/audios/uz/congrats-uz.m4a', () => 'congrats-uz.m4a');
jest.mock('@assets/audios/uz/congrats-you-won-uz.m4a', () => 'congrats-you-won-uz.m4a');
jest.mock('@assets/audios/uz/counting-fish-uz.m4a', () => 'counting-fish-uz.m4a');
jest.mock('@assets/audios/uz/daily-gift-uz.m4a', () => 'daily-gift-uz.m4a');
jest.mock('@assets/audios/uz/eight-uz.mp3', () => 'eight-uz.mp3');
jest.mock('@assets/audios/uz/five-count-uz.m4a', () => 'five-count-uz.m4a');
jest.mock('@assets/audios/uz/five-uz.m4a', () => 'five-uz.m4a');
jest.mock('@assets/audios/uz/four-uz.mp3', () => 'four-uz.mp3');
jest.mock('@assets/audios/uz/friend-tale-uz.mp3', () => 'friend-tale-uz.mp3');
jest.mock('@assets/audios/uz/gift-wheel-uz.m4a', () => 'gift-wheel-uz.m4a');
jest.mock('@assets/audios/uz/hero-tale-uz.mp3', () => 'hero-tale-uz.mp3');
jest.mock('@assets/audios/uz/home-uz.m4a', () => 'home-uz.m4a');
jest.mock('@assets/audios/uz/island-numeriya-uz.m4a', () => 'island-numeriya-uz.m4a');
jest.mock('@assets/audios/uz/lets-go-uz.m4a', () => 'lets-go-uz.m4a');
jest.mock('@assets/audios/uz/letter-a-uz.m4a', () => 'letter-a-uz.m4a');
jest.mock('@assets/audios/uz/navigation-uz.m4a', () => 'navigation-uz.m4a');
jest.mock('@assets/audios/uz/nine-uz.mp3', () => 'nine-uz.mp3');
jest.mock('@assets/audios/uz/one-uz.mp3', () => 'one-uz.mp3');
jest.mock('@assets/audios/uz/profile-uz.m4a', () => 'profile-uz.m4a');
jest.mock('@assets/audios/uz/seven-uz.mp3', () => 'seven-uz.mp3');
jest.mock('@assets/audios/uz/six-uz.mp3', () => 'six-uz.mp3');
jest.mock('@assets/audios/uz/sleep-reminder-uz.m4a', () => 'sleep-reminder-uz.m4a');
jest.mock('@assets/audios/uz/store-uz.m4a', () => 'store-uz.m4a');
jest.mock('@assets/audios/uz/ten-uz.mp3', () => 'ten-uz.mp3');
jest.mock('@assets/audios/uz/three-uz.mp3', () => 'three-uz.mp3');
jest.mock('@assets/audios/uz/tracker-uz.m4a', () => 'tracker-uz.m4a');
jest.mock('@assets/audios/uz/two-uz.mp3', () => 'two-uz.mp3');
jest.mock('@assets/audios/uz/welcome-tales-uz.m4a', () => 'welcome-tales-uz.m4a');
jest.mock('@assets/audios/uz/where-to-fly-uz.m4a', () => 'where-to-fly-uz.m4a');

// Mock font files
jest.mock('@assets/fonts/Sono_Proportional-Bold.ttf', () => 'Sono_Proportional-Bold.ttf');
jest.mock('@assets/fonts/Sono_Proportional-ExtraBold.ttf', () => 'Sono_Proportional-ExtraBold.ttf');
jest.mock('@assets/fonts/Sono_Proportional-ExtraLight.ttf', () => 'Sono_Proportional-ExtraLight.ttf');
jest.mock('@assets/fonts/Sono_Proportional-Light.ttf', () => 'Sono_Proportional-Light.ttf');
jest.mock('@assets/fonts/Sono_Proportional-Medium.ttf', () => 'Sono_Proportional-Medium.ttf');
jest.mock('@assets/fonts/Sono_Proportional-Regular.ttf', () => 'Sono_Proportional-Regular.ttf');
jest.mock('@assets/fonts/Sono_Proportional-SemiBold.ttf', () => 'Sono_Proportional-SemiBold.ttf');
jest.mock('@assets/fonts/Sono-Bold.ttf', () => 'Sono-Bold.ttf');
jest.mock('@assets/fonts/Sono-ExtraBold.ttf', () => 'Sono-ExtraBold.ttf');
jest.mock('@assets/fonts/Sono-ExtraLight.ttf', () => 'Sono-ExtraLight.ttf');
jest.mock('@assets/fonts/Sono-Light.ttf', () => 'Sono-Light.ttf');
jest.mock('@assets/fonts/Sono-Medium.ttf', () => 'Sono-Medium.ttf');
jest.mock('@assets/fonts/Sono-Regular.ttf', () => 'Sono-Regular.ttf');
jest.mock('@assets/fonts/Sono-SemiBold.ttf', () => 'Sono-SemiBold.ttf');

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

// Mock expo-image
jest.mock('expo-image', () => {
  const React = require('react');
  const { Image } = require('react-native');
  return {
    Image: Image,
  };
});

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