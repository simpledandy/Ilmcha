import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated';
import { TracingLesson } from '@components/TracingLesson';
import { Text } from '@components/Text';
import { useTranslation } from 'react-i18next';
import { tracingSegments } from '@constants/tracing/tracingSegments';

interface TracingScreenProps {
  category: 'number' | 'letter';
  language: 'en' | 'uz';
  onClose: () => void;
}

export function TracingScreen({ category, language, onClose }: TracingScreenProps) {
  // Get the list of values (letters or numbers) you want to show
  const tracingValues = category === 'letter'
    ? Object.keys(tracingSegments).filter(k => isNaN(Number(k))) // A-Z
    : Object.keys(tracingSegments).filter(k => !isNaN(Number(k))); // 0-9

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentValue = tracingValues[currentIndex];
  const currentSegments = tracingSegments[currentValue];

  const { t } = useTranslation();
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 400 });
  }, [currentIndex, opacity]);

  const handleComplete = useCallback((accuracyArr: number[]) => {
    const accuracy = accuracyArr && accuracyArr.length > 0 ? accuracyArr.reduce((a, b) => a + b, 0) / accuracyArr.length : 0;
    opacity.value = withTiming(0, { duration: 400 }, (isFinished) => {
      if (isFinished) {
        if (currentIndex < tracingValues.length - 1) {
          runOnJS(setCurrentIndex)(i => i + 1);
        } else {
          runOnJS(Alert.alert)(
            t('tracingComplete'),
            `${t('greatJob')}
${t('accuracy')}: ${(accuracy * 100).toFixed(0)}%`,
            [
              { text: t('next'), onPress: onClose },
            ]
          );
        }
      }
    });
  }, [currentIndex, tracingValues.length, t, onClose, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    flex: 1,
    width: '100%',
  }));

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>
      <Text variant="heading1" style={styles.title}>
        {category === 'letter' ? t('traceLetter', { letter: currentValue }) : t('traceNumber', { number: currentValue })}
      </Text>
      <View style={styles.canvasContainer}>
        {currentSegments && (
          <Animated.View style={animatedStyle}>
            <TracingLesson 
              key={currentIndex}
              segments={currentSegments}
              onComplete={handleComplete}
            />
          </Animated.View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    padding: 10,
    zIndex: 10,
  },
  closeText: {
    fontSize: 24,
    color: '#333',
    fontWeight: 'bold',
  },
  title: {
    color: '#333',
    marginBottom: 20,
    fontSize: 32,
    textAlign: 'center',
    marginTop: 60,
  },
  canvasContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: 'white',
  },
}); 