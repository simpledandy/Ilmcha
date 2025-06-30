import React from 'react';

const gestureHandler = {
  onGestureEvent: () => {},
  onHandlerStateChange: () => {},
};

export const PanGestureHandler = ({ children }) => <>{children}</>;
export const State = {};
export const Gesture = {
  Pan: () => gestureHandler,
  Fling: () => gestureHandler,
  Tap: () => gestureHandler,
};
export const GestureDetector = ({ children }) => <>{children}</>;
