import React, { useRef, useState } from 'react';
import { View, Dimensions, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path, G, Circle, Polygon, Text as SvgText } from 'react-native-svg';
import { PanResponder } from 'react-native';
import { colors } from '@theme/colors';
import { textStyles } from '@theme/typography';
import { useTranslation } from 'react-i18next';
import { Button } from '@components/Button'; // Adjust the path as needed

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

type Segment = {
  path: string;
  pointer: [number, number];
  direction?: 'left' | 'right' | 'down' | 'up';
};

interface TracingLessonProps {
  segments: Segment[];
  onComplete?: (accuracy: number[], attempts: number[]) => void;
}

function getPointsFromPath(path: string): [number, number][] {
  const points: [number, number][] = [];
  const regex = /[ML] ?([\d.\-]+),([\d.\-]+)/g;
  let match;
  while ((match = regex.exec(path))) {
    points.push([parseFloat(match[1]), parseFloat(match[2])]);
  }
  return points;
}

function distance(p1: [number, number], p2: [number, number]) {
  return Math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2);
}

function averageMinDistance(userPoints: [number, number][], guidePoints: [number, number][]) {
  if (userPoints.length === 0 || guidePoints.length === 0) return 9999;
  let total = 0;
  for (const up of userPoints) {
    let minDist = Infinity;
    for (const gp of guidePoints) {
      const d = distance(up, gp);
      if (d < minDist) minDist = d;
    }
    total += minDist;
  }
  return total / userPoints.length;
}

export function TracingLesson({ segments, onComplete }: TracingLessonProps) {
  const { t } = useTranslation();
  const [currentSegmentIdx, setCurrentSegmentIdx] = useState(0);
  const [userSegments, setUserSegments] = useState<string[]>(Array(segments.length).fill(''));
  const [currentStroke, setCurrentStroke] = useState('');
  const [completedSegments, setCompletedSegments] = useState<boolean[]>(Array(segments.length).fill(false));
  const [segmentAttempts, setSegmentAttempts] = useState<number[]>(Array(segments.length).fill(0));
  const [segmentAccuracy, setSegmentAccuracy] = useState<number[]>(Array(segments.length).fill(0));
  const [allCompleted, setAllCompleted] = useState(false);
  const [lastFailedStroke, setLastFailedStroke] = useState<string | null>(null);

  // Scaling logic
  const svgHeight = screenHeight * 0.6;
  const viewBoxSize = 400;
  const scale = Math.min(screenWidth / viewBoxSize, svgHeight / viewBoxSize);
  const pathWidth = viewBoxSize * scale;
  const pathHeight = viewBoxSize * scale;
  const translateX = (screenWidth - pathWidth) / 2;
  const translateY = (svgHeight - pathHeight) / 2;

  // PanResponder for current segment only
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !allCompleted && !completedSegments[currentSegmentIdx],
      onPanResponderGrant: (e, gestureState) => {
        if (allCompleted || completedSegments[currentSegmentIdx]) return;
        setLastFailedStroke(null); // Clear last failed stroke on new attempt
        const x = (e.nativeEvent.locationX - translateX - 12) / scale;
        const y = (e.nativeEvent.locationY - translateY) / scale;
        setCurrentStroke(`M${x},${y}`);
      },
      onPanResponderMove: (e, gestureState) => {
        if (allCompleted || completedSegments[currentSegmentIdx]) return;
        const x = (e.nativeEvent.locationX - translateX - 12) / scale;
        const y = (e.nativeEvent.locationY - translateY) / scale;
        setCurrentStroke(prev => prev ? `${prev} L${x},${y}` : `M${x},${y}`);
      },
      onPanResponderRelease: () => {
        if (allCompleted || completedSegments[currentSegmentIdx]) return;
        // Grade this stroke
        const userPoints = getPointsFromPath(currentStroke);
        const guidePoints = getPointsFromPath(segments[currentSegmentIdx].path);
        const avgDist = averageMinDistance(userPoints, guidePoints);
        const threshold = 18;
        setSegmentAttempts(prev => {
          const arr = [...prev];
          arr[currentSegmentIdx]++;
          return arr;
        });
        if (userPoints.length > 5 && avgDist < threshold) {
          // Success!
          setUserSegments(prev => {
            const arr = [...prev];
            arr[currentSegmentIdx] = currentStroke;
            return arr;
          });
          setCompletedSegments(prev => {
            const arr = [...prev];
            arr[currentSegmentIdx] = true;
            return arr;
          });
          setSegmentAccuracy(prev => {
            const arr = [...prev];
            arr[currentSegmentIdx] = Math.max(0, 1 - avgDist / threshold);
            return arr;
          });
          setCurrentStroke('');
          setLastFailedStroke(null);
          // Move to next segment or finish
          if (currentSegmentIdx < segments.length - 1) {
            setTimeout(() => setCurrentSegmentIdx(idx => idx + 1), 700);
          } else {
            setAllCompleted(true);
            if (onComplete) {
              setTimeout(() => onComplete(
                [...segmentAccuracy.slice(0, segments.length - 1), Math.max(0, 1 - avgDist / threshold)],
                [...segmentAttempts.slice(0, segments.length - 1), segmentAttempts[currentSegmentIdx] + 1]
              ), 900);
            }
          }
        } else {
          // Not accurate, allow retry, show last failed stroke
          setLastFailedStroke(currentStroke);
          setCurrentStroke('');
        }
      },
      onPanResponderTerminate: () => {
        setCurrentStroke('');
      },
    })
  ).current;

  const resetTracing = () => {
    setUserSegments(Array(segments.length).fill(''));
    setCurrentStroke('');
    setCompletedSegments(Array(segments.length).fill(false));
    setSegmentAttempts(Array(segments.length).fill(0));
    setSegmentAccuracy(Array(segments.length).fill(0));
    setCurrentSegmentIdx(0);
    setAllCompleted(false);
    setLastFailedStroke(null);
  };

  // Progress: percent of segments completed
  const progress = Math.round((completedSegments.filter(Boolean).length / segments.length) * 100);

  // Helper: render pointer (dot and arrow/number)
  function renderPointer(segment: Segment, idx: number) {
    if (!segment.pointer) return null;
    const [x, y] = segment.pointer;
    // Arrow direction
    let arrowPoints = '';
    const size = 18;
    switch (segment.direction) {
      case 'right':
        arrowPoints = `${x + size},${y} ${x + size - 8},${y - 6} ${x + size - 8},${y + 6}`;
        break;
      case 'down':
        arrowPoints = `${x},${y + size} ${x - 6},${y + size - 8} ${x + 6},${y + size - 8}`;
        break;
      case 'left':
        arrowPoints = `${x - size},${y} ${x - size + 8},${y - 6} ${x - size + 8},${y + 6}`;
        break;
      case 'up':
        arrowPoints = `${x},${y - size} ${x - 6},${y - size + 8} ${x + 6},${y - size + 8}`;
        break;
      default:
        arrowPoints = '';
    }
    return (
      <G key={`pointer-${idx}`}>
        <Circle cx={x} cy={y} r={10} fill={colors.warning[100]} stroke={colors.warning[500]} strokeWidth={3} />
        {arrowPoints && <Polygon points={arrowPoints} fill={colors.warning[500]} />}
        {/* Step number for clarity */}
        <SvgText
          x={x}
          y={y + 6}
          fontSize="16"
          fontWeight="bold"
          fill={colors.warning[500]}
          textAnchor="middle"
        >
          {idx + 1}
        </SvgText>
      </G>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.secondary }} {...panResponder.panHandlers}>
      <Svg
        width={screenWidth}
        height={svgHeight}
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        style={{ backgroundColor: colors.background.secondary }}
      >
        {/* Render all completed segments */}
        {userSegments.map((segment, idx) => (
          segment ? (
            <Path
              key={`completed-${idx}`}
              d={segment}
              stroke={colors.success[500]}
              strokeWidth={8}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : null
        ))}

        {/* Render guide paths for remaining segments */}
        {segments.map((segment, idx) => (
          !completedSegments[idx] ? (
            <Path
              key={`guide-${idx}`}
              d={segment.path}
              stroke={colors.primary[300]}
              strokeWidth={6}
              fill="none"
              strokeDasharray="10,5"
              opacity={0.6}
            />
          ) : null
        ))}

        {/* Render current stroke */}
        {currentStroke && (
          <Path
            d={currentStroke}
            stroke={colors.primary[600]}
            strokeWidth={8}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Render last failed stroke */}
        {lastFailedStroke && (
          <Path
            d={lastFailedStroke}
            stroke={colors.error[500]}
            strokeWidth={8}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.7}
          />
        )}

        {/* Render pointers */}
        {segments.map((segment, idx) => renderPointer(segment, idx))}
      </Svg>

      {/* Progress and controls */}
      <View style={styles.controls}>
        <Text style={styles.progressText}>
          {t('progress')}: {progress}%
        </Text>
        <Text style={styles.segmentText}>
          {t('segment')} {currentSegmentIdx + 1} / {segments.length}
        </Text>
        <Button
          title={t('reset')}
          onPress={resetTracing}
          variant="secondary"
          style={styles.resetButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  controls: {
    padding: 20,
    backgroundColor: colors.background.primary,
    alignItems: 'center',
  },
  progressText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 5,
  },
  segmentText: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 15,
  },
  resetButton: {
    minWidth: 100,
  },
});
