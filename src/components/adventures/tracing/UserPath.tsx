// components/adventures/tracing/UserPath.tsx
import React from 'react';
import { Polyline } from 'react-native-svg';

interface UserPathProps {
  path: { x: number; y: number }[];
  color: string;
  opacity: number;
}

export const UserPath: React.FC<UserPathProps> = ({ path, color, opacity }) => {
  if (path.length < 2) return null;
  return (
    <Polyline
      points={path.map((p) => `${p.x},${p.y}`).join(' ')}
      fill="none"
      stroke={color}
      strokeWidth={16}
      strokeLinecap="round"
      opacity={opacity}
    />
  );
};
