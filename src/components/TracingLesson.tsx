import React, { useRef, useState } from 'react';
import { View, Dimensions, Text, TouchableOpacity } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';
import { PanResponder } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface TracingLessonProps {
  pathData: string;
  onComplete?: (accuracy: number) => void;
}

function getPointsFromPath(path: string): [number, number][] {
  // Extracts points from a path string like 'M x,y L x1,y1 ...'
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
  // For each user point, find the closest guide point, average the distances
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

export function TracingLesson({ pathData, onComplete }: TracingLessonProps) {
  const [userSegments, setUserSegments] = useState<string[]>([]); // Array of path segments
  const [currentSegment, setCurrentSegment] = useState<string>('');
  const [completed, setCompleted] = useState(false);
  const [accuracy, setAccuracy] = useState<number | null>(null);

  // Scaling logic
  const svgHeight = screenHeight * 0.6;
  const viewBoxSize = 400; // Paths are in 400x400 coordinate system
  const scale = Math.min(screenWidth / viewBoxSize, svgHeight / viewBoxSize);
  const pathWidth = viewBoxSize * scale;
  const pathHeight = viewBoxSize * scale;
  const translateX = (screenWidth - pathWidth) / 2;
  const translateY = (svgHeight - pathHeight) / 2;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (e, gestureState) => {
        if (completed) return;
        // Use locationX/locationY for coordinates relative to the SVG view
        const x = (e.nativeEvent.locationX - translateX) / scale;
        const y = (e.nativeEvent.locationY - translateY) / scale;
        const seg = `M${x},${y}`;
        setCurrentSegment(seg);
      },
      onPanResponderMove: (e, gestureState) => {
        if (completed) return;
        const x = (e.nativeEvent.locationX - translateX) / scale;
        const y = (e.nativeEvent.locationY - translateY) / scale;
        setCurrentSegment(prev => prev ? `${prev} L${x},${y}` : `M${x},${y}`);
      },
      onPanResponderRelease: () => {
        if (completed) return;
        setUserSegments(prev => currentSegment ? [...prev, currentSegment] : prev);
        setCurrentSegment('');
      },
      onPanResponderTerminate: () => {
        if (completed) return;
        setUserSegments(prev => currentSegment ? [...prev, currentSegment] : prev);
        setCurrentSegment('');
      },
    })
  ).current;

  // Grading logic: check if user path matches guide path
  React.useEffect(() => {
    if (completed) return;
    // Flatten all user points
    const userPoints = userSegments
      .concat(currentSegment)
      .flatMap(getPointsFromPath);
    const guidePoints = getPointsFromPath(pathData);
    if (userPoints.length > 10) {
      const avgDist = averageMinDistance(userPoints, guidePoints);
      // Threshold: 18 is about 5% of 400px viewBox
      if (avgDist < 18) {
        setCompleted(true);
        setAccuracy(Math.max(0, 1 - avgDist / 18));
        if (onComplete) {
          setTimeout(() => onComplete(Math.max(0, 1 - avgDist / 18)), 800);
        }
      }
    }
  }, [userSegments, currentSegment, completed, pathData, onComplete]);

  const resetTracing = () => {
    setUserSegments([]);
    setCurrentSegment('');
    setCompleted(false);
    setAccuracy(null);
  };

  // Progress: percent of guide path covered by user path (estimate)
  const userPoints = userSegments.concat(currentSegment).flatMap(getPointsFromPath);
  const guidePoints = getPointsFromPath(pathData);
  // Progress: percent of guide points that are within a threshold of any user point
  let covered = 0;
  const threshold = 18;
  for (const gp of guidePoints) {
    for (const up of userPoints) {
      if (distance(gp, up) < threshold) {
        covered++;
        break;
      }
    }
  }
  const progress = guidePoints.length > 0 ? Math.round((covered / guidePoints.length) * 100) : 0;

  return (
    <View style={{ flex: 1, backgroundColor: '#f0f8ff' }} {...panResponder.panHandlers}>
      <Svg height={svgHeight} width={screenWidth}>
        <G transform={`translate(${translateX}, ${translateY}) scale(${scale})`}>
          {/* Guide path */}
          <Path
            d={pathData}
            stroke="#ff4081"
            strokeWidth={8}
            fill="none"
            strokeDasharray="15,8"
            opacity={0.9}
          />

          {/* User path: all segments */}
          {userSegments.map((seg, i) => (
            <Path
              key={i}
              d={seg}
              stroke={completed ? '#4CAF50' : '#2196F3'}
              strokeWidth={6}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          ))}
          {/* Current segment */}
          {currentSegment && (
            <Path
              d={currentSegment}
              stroke={completed ? '#4CAF50' : '#2196F3'}
              strokeWidth={6}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          )}
        </G>
      </Svg>

      {/* Progress Bar */}
      <View style={{ height: 20, backgroundColor: '#e3f2fd', margin: 20, borderRadius: 10, borderWidth: 2, borderColor: '#bbdefb' }}>
        <View style={{ width: `${progress}%`, height: '100%', backgroundColor: completed ? '#81c784' : '#64b5f6', borderRadius: 8 }} />
      </View>

      {/* Completion Message */}
      {completed && (
        <View style={{ alignItems: 'center', marginVertical: 20 }}>
          <Text style={{ textAlign: 'center', fontSize: 28, fontWeight: 'bold', color: '#2e7d32' }}>
            🎉 Amazing! You did it! 🎉
          </Text>
          {accuracy !== null && (
            <Text style={{ textAlign: 'center', fontSize: 20, color: '#333', marginTop: 10 }}>
              Accuracy: {(accuracy * 100).toFixed(0)}%
            </Text>
          )}
        </View>
      )}

      {/* Reset Button */}
      <View style={{ marginTop: 20, alignItems: 'center' }}>
        <TouchableOpacity 
          style={{
            backgroundColor: '#ff6b9d',
            paddingVertical: 15,
            paddingHorizontal: 30,
            borderRadius: 25,
            elevation: 3,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
          }}
          onPress={resetTracing}
        >
          <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Try Again</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
