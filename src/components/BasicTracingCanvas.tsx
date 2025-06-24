import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  AccessibilityInfo,
  Vibration,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { colors } from '@theme/colors';
import { textStyles } from '@theme/typography';
import { logger } from '@utils/logger';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CANVAS_SIZE = SCREEN_WIDTH * 0.8;

interface BasicTracingCanvasProps {
  type: 'number' | 'letter';
  value: string;
  strokeColor?: string;
  backgroundColor?: string;
  onComplete?: () => void;
  showGuide?: boolean;
  hapticFeedback?: boolean;
  accessibilityEnabled?: boolean;
}

export const BasicTracingCanvas: React.FC<BasicTracingCanvasProps> = ({
  type,
  value,
  strokeColor = colors.success[500],
  backgroundColor = colors.background.tertiary,
  onComplete,
  showGuide = true,
  hapticFeedback = true,
  accessibilityEnabled = true,
}) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [attempts, setAttempts] = useState(0);

  // Animation values
  const characterScale = useSharedValue(1);
  const guideOpacity = useSharedValue(showGuide ? 0.6 : 0);
  const progressScale = useSharedValue(0);
  const completionScale = useSharedValue(0);
  const canvasShake = useSharedValue(0);

  const handlePress = useCallback(() => {
    if (isCompleted) return;

    setAttempts(prev => prev + 1);
    
    // Haptic feedback
    if (hapticFeedback) {
      Vibration.vibrate(50);
    }

    // Animate character scale
    characterScale.value = withSequence(
      withTiming(1.2, { duration: 150 }),
      withTiming(1, { duration: 150 })
    );

    // Update progress
    const newProgress = Math.min(progress + 25, 100);
    setProgress(newProgress);

    if (newProgress >= 100) {
      setIsCompleted(true);
      
      // Success animations
      completionScale.value = withSpring(1, { damping: 10, stiffness: 200 });
      progressScale.value = withSpring(1.1, { damping: 8, stiffness: 300 });
      
      // Hide guide
      guideOpacity.value = withTiming(0, { duration: 300 });
      
      // Log completion
      logger.tracing(`Tracing completed for ${type}: ${value}`, attempts + 1);
      
      // Accessibility announcement
      if (accessibilityEnabled) {
        AccessibilityInfo.announceForAccessibility(`Great job! You traced the ${type} ${value}`);
      }
      
      onComplete?.();
    } else {
      // Progress animation
      progressScale.value = withSequence(
        withTiming(1.1, { duration: 200 }),
        withTiming(1, { duration: 200 })
      );
      
      // Shake animation for encouragement
      if (newProgress < 50) {
        canvasShake.value = withSequence(
          withTiming(-5, { duration: 100 }),
          withTiming(5, { duration: 100 }),
          withTiming(0, { duration: 100 })
        );
      }
    }
  }, [isCompleted, progress, attempts, type, value, hapticFeedback, accessibilityEnabled, onComplete]);

  const resetTracing = useCallback(() => {
    setIsCompleted(false);
    setProgress(0);
    setAttempts(0);
    
    // Reset animations
    characterScale.value = withSpring(1);
    guideOpacity.value = withTiming(showGuide ? 0.6 : 0, { duration: 300 });
    progressScale.value = withSpring(0);
    completionScale.value = withSpring(0);
    canvasShake.value = withSpring(0);
    
    logger.tracing(`Tracing reset for ${type}: ${value}`);
  }, [type, value, showGuide]);

  // Animated styles
  const characterAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: characterScale.value }],
  }));

  const guideAnimatedStyle = useAnimatedStyle(() => ({
    opacity: guideOpacity.value,
  }));

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: progressScale.value }],
  }));

  const completionAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: completionScale.value }],
  }));

  const canvasAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: canvasShake.value }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.canvas, { backgroundColor }, canvasAnimatedStyle]}>
        <TouchableOpacity 
          style={styles.gestureArea} 
          onPress={handlePress}
          activeOpacity={0.8}
          accessible={accessibilityEnabled}
          accessibilityLabel={`Trace the ${type} ${value}`}
          accessibilityHint={`Tap to trace the ${type}. You've completed ${progress}%`}
          accessibilityRole="button"
        >
          {/* Character display */}
          <Animated.View style={[styles.characterContainer, characterAnimatedStyle]}>
            <Text style={[styles.character, { color: strokeColor }]}>
              {value}
            </Text>
          </Animated.View>
          
          {/* Tracing guide */}
          <Animated.View style={[styles.tracingGuide, guideAnimatedStyle]}>
            <View style={[styles.guideLine, { backgroundColor: strokeColor }]} />
          </Animated.View>
          
          {/* Instructions */}
          {showGuide && !isCompleted && (
            <View style={styles.instructionContainer}>
              <Text style={styles.instructionText}>
                Tap to trace the {type === 'number' ? 'number' : 'letter'}
              </Text>
              {attempts > 0 && (
                <Text style={styles.attemptsText}>
                  Attempts: {attempts}
                </Text>
              )}
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
      
      {/* Progress bar */}
      <Animated.View style={[styles.progressContainer, progressAnimatedStyle]}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {Math.round(progress)}%
        </Text>
      </Animated.View>
      
      {/* Completion indicator */}
      {isCompleted && (
        <Animated.View style={[styles.completionIndicator, completionAnimatedStyle]}>
          <Text style={styles.completionText}>✓</Text>
        </Animated.View>
      )}
      
      {/* Reset button */}
      {isCompleted && (
        <TouchableOpacity style={styles.resetButton} onPress={resetTracing}>
          <Text style={styles.resetButtonText}>Try Again</Text>
        </TouchableOpacity>
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
    borderColor: colors.background.tertiary,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: colors.common.black,
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
    color: colors.text.secondary,
    textAlign: 'center',
  },
  attemptsText: {
    fontSize: 12,
    color: colors.text.disabled,
    marginTop: 4,
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
    backgroundColor: colors.background.tertiary,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.success[500],
    borderRadius: 4,
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
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
    backgroundColor: colors.success[500],
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: colors.common.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  completionText: {
    fontSize: 24,
    color: colors.common.white,
    fontWeight: 'bold',
  },
  resetButton: {
    marginTop: 15,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.primary[100],
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary[300],
  },
  resetButtonText: {
    fontSize: 14,
    color: colors.primary[700],
    fontWeight: '600',
  },
}); 