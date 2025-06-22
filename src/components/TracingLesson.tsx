import React, { useRef, useState } from 'react';
import { View, Dimensions, Button, Text, TouchableOpacity } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';
import { PanResponder } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface TracingLessonProps {
  pathData: string;
  onComplete?: () => void;
}

export function TracingLesson({ pathData, onComplete }: TracingLessonProps) {
  const [userPath, setUserPath] = useState('');
  const [completed, setCompleted] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathRef = useRef('');

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
        const x = (gestureState.x0 - translateX) / scale;
        const y = (gestureState.y0 - translateY) / scale;
        pathRef.current = `M${x},${y}`;
        setUserPath(pathRef.current);
      },
      onPanResponderMove: (e, gestureState) => {
        const x = (gestureState.moveX - translateX) / scale;
        const y = (gestureState.moveY - translateY) / scale;
        const newPath = `${pathRef.current} L${x},${y}`;
        pathRef.current = newPath;
        setUserPath(newPath);
        // Simulate progress
        setProgress(prev => Math.min(prev + 2, 100));
        if (progress > 95 && !completed) {
          setCompleted(true);
          if (onComplete) {
            setTimeout(onComplete, 1000);
          }
        }
      },
    })
  ).current;

  const resetTracing = () => {
    setUserPath('');
    setProgress(0);
    setCompleted(false);
    pathRef.current = '';
  };

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

          {/* User path */}
          <Path
            d={userPath}
            stroke={completed ? '#4CAF50' : '#2196F3'}
            strokeWidth={6}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
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
