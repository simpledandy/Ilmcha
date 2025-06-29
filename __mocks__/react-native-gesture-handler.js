const React = require("react");

const chain = {
  onUpdate: () => chain,
  onEnd: () => chain,
  onStart: () => chain,
  minPointers: () => chain,
  maxPointers: () => chain,
  enabled: () => chain,
  simultaneousWithExternalGesture: () => chain,
  requireExternalGestureToFail: () => chain,
};

module.exports = {
  GestureDetector: ({ children }) =>
    React.createElement("View", null, children),
  Gesture: {
    Pinch: () => chain,
    Pan: () => chain,
    Simultaneous: () => chain,
  },
};
