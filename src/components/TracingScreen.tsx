import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated';
import { TracingLesson } from '@components/TracingLesson';
import { getTracingDataByCategory } from '@constants/tracingData';
import Text from '@components/Text';
import i18n from '@/i18n';

interface TracingScreenProps {
  category: 'number' | 'letter';
  language: 'en' | 'uz';
  onClose: () => void;
}

export function TracingScreen({ category, language, onClose }: TracingScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { t } = i18n;
  const opacity = useSharedValue(1);
  
  const tracingItems = getTracingDataByCategory(category, language);
  const currentItem = tracingItems[currentIndex];

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 400 });
  }, [currentIndex, opacity]);

  const handleComplete = useCallback((accuracy: number) => {
    opacity.value = withTiming(0, { duration: 400 }, (isFinished) => {
      if (isFinished) {
        if (currentIndex < tracingItems.length - 1) {
          runOnJS(setCurrentIndex)(i => i + 1);
        } else {
          runOnJS(Alert.alert)(
            t('tracingComplete'),
            `${t('greatJob')}\n${t('accuracy')}: ${(accuracy * 100).toFixed(0)}%`,
            [
              { text: t('next'), onPress: onClose },
            ]
          );
        }
      }
    });
  }, [currentIndex, tracingItems.length, t, onClose, opacity]);

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
        {category === 'letter' ? t('traceLetter', { letter: currentItem?.value }) : t('traceNumber', { number: currentItem?.value })}
      </Text>

      <View style={styles.canvasContainer}>
        {currentItem && (
          <Animated.View style={animatedStyle}>
            <TracingLesson 
              key={currentIndex}
              pathData={currentItem.pathData}
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