// components/adventures/tracing/StartDot.tsx
import React from 'react';
import { Animated } from 'react-native';
import { Circle, G } from 'react-native-svg';

interface StartDotProps {
  position: { x: number; y: number } | null;
  scale: Animated.Value;
  color: string;
}

// Animated wrapper for SVG Circle
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const StartDot: React.FC<StartDotProps> = ({ position, scale, color }) => {
  if (!position) return null;

  return (
    <G>
      <AnimatedCircle
        cx={position.x}
        cy={position.y}
        r={10}
        fill={color}
        scaleX={scale}
        scaleY={scale}
        originX={position.x}
        originY={position.y}
      />
    </G>
  );
};
