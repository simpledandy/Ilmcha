// components/adventures/tracing/StartDot.tsx
import React from 'react';
import { Circle } from 'react-native-svg';

interface StartDotProps {
  position: { x: number; y: number } | null;
  scale: number;
  color: string;
}

export const StartDot: React.FC<StartDotProps> = ({ position, scale, color }) => {
  if (!position) return null;
  return (
    <Circle
      cx={position.x}
      cy={position.y}
      r={20 * scale}
      fill={color}
    />
  );
};
