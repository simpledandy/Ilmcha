// components/adventures/tracing/GuidePath.tsx
import React from 'react';
import { Polyline, G } from 'react-native-svg';
import { Animated } from 'react-native';
import type { Segment, } from '@/src/types/common';

interface GuidePathProps {
  segment: Segment;
  index: number;
  currentSegment: number;
  completed: boolean;
  flashAnim: any;
  dashOffset: any;
  colors: any;
  getCanvasPoint: (pt: { x: number; y: number }) => { x: number; y: number } | null;
}

const AnimatedPolyline = Animated.createAnimatedComponent(Polyline);
const AnimatedG = Animated.createAnimatedComponent(G);

export const GuidePath: React.FC<GuidePathProps> = ({
  segment, index, currentSegment, completed, flashAnim, dashOffset, colors, getCanvasPoint,
}) => {
  if (!segment || !Array.isArray(segment.points) || segment.points.length === 0) {
    return null;
  }

  const scaledPoints = segment.points
    .map((pt, i) => {
      if (pt == null || typeof pt.x !== 'number' || typeof pt.y !== 'number') {
        return null;
      }
      const canvasPt = getCanvasPoint(pt);
      if (!canvasPt || typeof canvasPt.x !== 'number' || typeof canvasPt.y !== 'number') {
        return null;
      }
      return canvasPt;
    })
    .filter(Boolean) as { x: number; y: number }[];

  if (scaledPoints.length < 2) {
    return null;
  }

  const pointsStr = scaledPoints.map((p) => `${p.x},${p.y}`).join(' ');
  if (!pointsStr || /NaN|undefined/.test(pointsStr)) {
    return null;
  }

  if (completed) {
    const color = colors.completedPalette[index % colors.completedPalette.length];
    // Use an animated SVG group for the scale "flash"
    return (
      <AnimatedG
        // RN-SVG supports transform objects; Animated value works via AnimatedG
        // Fallback to no transform when not current
        transform={index === currentSegment ? [{ scale: flashAnim }] : undefined}
      >
        <Polyline
          points={pointsStr}
          fill="none"
          stroke={color}
          strokeWidth={16}
          strokeLinecap="round"
        />
      </AnimatedG>
    );
  }

  if (index === currentSegment) {
    // Make dashOffset actually animate by using AnimatedPolyline
    return (
      <AnimatedPolyline
        points={pointsStr}
        fill="none"
        stroke={colors.currentGuide}
        strokeWidth={16}
        strokeDasharray="25,20"
        strokeDashoffset={dashOffset} // no casting; it's an Animated.Value
        strokeLinecap="round"
      />
    );
  }

  return (
    <Polyline
      points={pointsStr}
      fill="none"
      stroke={colors.guide}
      strokeWidth={16}
      strokeDasharray="25,20"
      opacity={0.4}
      strokeLinecap="round"
    />
  );
};
