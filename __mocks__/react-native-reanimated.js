const React = require("react");

module.exports = {
  useSharedValue: (initialValue) => ({ value: initialValue }),
  useDerivedValue: (callback) => ({ value: callback() }),
  useAnimatedStyle: (callback) => callback(),
  withTiming: (value) => value,
  withSpring: (value) => value,
  withRepeat: (value) => value,
  runOnJS: (fn) => fn,
  Animated: {
    View: ({ children, style, ...props }) =>
      React.createElement("View", { style, ...props }, children),
  },
};
