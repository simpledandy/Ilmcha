import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CANVAS_SIZE = SCREEN_WIDTH * 0.8;

interface BasicTracingCanvasProps {
  type: 'number' | 'letter';
  value: string;
  strokeColor?: string;
  backgroundColor?: string;
  onComplete?: () => void;
  showGuide?: boolean;
}

export default function BasicTracingCanvas({
  type,
  value,
  strokeColor = '#4CAF50',
  backgroundColor = '#F0F8FF',
  onComplete,
  showGuide = true,
}: BasicTracingCanvasProps) {
  const [isCompleted, setIsCompleted] = useState(false);
  const [progress, setProgress] = useState(0);

  const handlePress = () => {
    if (!isCompleted) {
      setProgress(100);
      setIsCompleted(true);
      onComplete?.();
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.canvas, { backgroundColor }]}>
        <TouchableOpacity 
          style={styles.gestureArea} 
          onPress={handlePress}
          activeOpacity={0.8}
        >
          {/* Character display */}
          <View style={styles.characterContainer}>
            <Text style={[styles.character, { color: strokeColor }]}>
              {value}
            </Text>
          </View>
          
          {/* Simple tracing guide */}
          <View style={styles.tracingGuide}>
            <View style={[styles.guideLine, { backgroundColor: showGuide ? '#E0E0E0' : strokeColor }]} />
          </View>
          
          {/* Instructions */}
          {showGuide && (
            <View style={styles.instructionContainer}>
              <Text style={styles.instructionText}>
                Tap to trace the {type === 'number' ? 'number' : 'letter'}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      
      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {Math.round(progress)}%
        </Text>
      </View>
      
      {/* Completion indicator */}
      {isCompleted && (
        <View style={styles.completionIndicator}>
          <Text style={styles.completionText}>✓</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  canvas: {
    width: CANVAS_SIZE,
    height: CANVAS_SIZE,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  gestureArea: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  characterContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  character: {
    fontSize: 40,
    fontWeight: 'bold',
    opacity: 0.3,
  },
  tracingGuide: {
    position: 'absolute',
    top: '20%',
    left: '20%',
    right: '20%',
    bottom: '20%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  guideLine: {
    width: 60,
    height: 4,
    borderRadius: 2,
  },
  instructionContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    gap: 10,
  },
  progressBar: {
    width: 200,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    minWidth: 40,
  },
  completionIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  completionText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
}); 