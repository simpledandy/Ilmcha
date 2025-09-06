// components/adventures/tracing/index.tsx
import React, { useMemo, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg from 'react-native-svg';
import { letters, numbers, shapes } from '@/src/constants/tracing';
import { GuidePath } from './GuidePath';
import { StartDot } from './StartDot';
import { UserPath } from './UserPath';
import { useTracingLogic } from './useTracingLogic';
import type { AdventureProps, Segment } from '@/src/types/common';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CANVAS_SIZE = SCREEN_WIDTH * 0.8;

const COLORS = {
  guide: '#C0E8FF',
  currentGuide: '#FFD166',
  completedPalette: ['#06D6A0', '#e4ff6bff', '#8E44AD', '#2ECC71', '#E67E22'],
  userPath: '#118AB2',
  startDot: '#ff8808ff',
  background: '#FAFAFF',
};

export const Tracing: React.FC<AdventureProps> = ({ islandId, topic, onComplete }) => {
  const segmentMap: Record<string, any> = { numbers, letters, shapes };
  const segments = useMemo(() => segmentMap[islandId]?.[topic] ?? [], [islandId, topic]);
  const [canvasLayout, setCanvasLayout] = useState({ width: CANVAS_SIZE, height: CANVAS_SIZE });

  const {
    currentSegment,
    completedSegments,
    userPath,
    dashOffset,
    startDotScale,
    pathOpacity,
    flashAnim,
    panResponder,
    getCanvasPoint,
  } = useTracingLogic(topic, segments, onComplete, canvasLayout);

  if (!segments) return null;

  const startDotPos =
    segments[currentSegment]?.points?.[0] &&
    getCanvasPoint(segments[currentSegment].points[0]);

  return (
    <View style={[styles.container, { backgroundColor: COLORS.background }]}>
      <View
        style={styles.tracingBox}
        onLayout={(e) => setCanvasLayout(e.nativeEvent.layout)}
        {...panResponder.panHandlers}
      >
        <Svg width={canvasLayout.width} height={canvasLayout.height}>
          {segments.map((seg: Segment, idx: number) => (
            <GuidePath
              key={idx}
              segment={seg}
              index={idx}
              currentSegment={currentSegment}
              completed={completedSegments[idx]}
              flashAnim={flashAnim}
              dashOffset={dashOffset}
              colors={COLORS}
              getCanvasPoint={getCanvasPoint}
            />
          ))}

          <UserPath
            path={userPath}
            color={COLORS.userPath}
            opacity={pathOpacity as unknown as number}
          />

          <StartDot
            position={startDotPos}
            scale={(startDotScale as any)._value ?? 1}
            color={COLORS.startDot}
          />
        </Svg>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  tracingBox: {
    width: CANVAS_SIZE,
    height: CANVAS_SIZE,
    backgroundColor: 'white',
    borderRadius: 24,
    elevation: 8,
    overflow: 'hidden',
  },
});