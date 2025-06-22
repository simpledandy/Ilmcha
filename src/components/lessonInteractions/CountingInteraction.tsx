import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  withRepeat,
} from 'react-native-reanimated';
import { CountingExercise } from '../../constants/lessonTypes';
import { playAudio } from '../../utils/audio';
import Text from '../Text';
import i18n from '@/i18n';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface CountingInteractionProps {
  exercise: CountingExercise;
  onComplete: (success: boolean, score: number, accuracy: number) => void;
}

export const CountingInteraction: React.FC<CountingInteractionProps> = ({
  exercise,
  onComplete,
}) => {
  const { t } = i18n;
  const [selectedCount, setSelectedCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [attempts, setAttempts] = useState(0);
  
  // Animation values
  const itemScales = useSharedValue(Array(exercise.items.length).fill(1));
  const feedbackScale = useSharedValue(0);
  const successScale = useSharedValue(0);

  useEffect(() => {
    if (exercise.audioFile) {
      playAudio(exercise.audioFile);
    }
  }, []);

  const handleItemPress = (index: number) => {
    const newScales = [...itemScales.value];
    newScales[index] = withSequence(
      withTiming(1.3, { duration: 150 }),
      withTiming(1, { duration: 150 })
    );
    itemScales.value = newScales;
    
    setSelectedCount(prev => prev + 1);
    playAudio('counting_fish');
  };

  const handleSubmit = () => {
    const isCorrect = selectedCount === exercise.targetNumber;
    const accuracy = isCorrect ? 1.0 : Math.max(0, 1 - Math.abs(selectedCount - exercise.targetNumber) / exercise.targetNumber);
    
    if (isCorrect) {
      setIsCompleted(true);
      successScale.value = withSpring(1, { damping: 10, stiffness: 200 });
      playAudio('congrats');
      
      setTimeout(() => {
        onComplete(true, 60, accuracy);
      }, 2000);
    } else {
      setShowFeedback(true);
      feedbackScale.value = withSpring(1, { damping: 10, stiffness: 200 });
      setAttempts(prev => prev + 1);
      
      setTimeout(() => {
        feedbackScale.value = withTiming(0, { duration: 300 });
        setShowFeedback(false);
      }, 2000);
    }
  };

  const handleReset = () => {
    setSelectedCount(0);
    setShowFeedback(false);
    feedbackScale.value = 0;
    setAttempts(prev => prev + 1);
  };

  const getItemImage = (type: string) => {
    switch (type) {
      case 'fish':
        return require('@assets/images/counting_bg.png'); // Placeholder
      case 'star':
        return require('@assets/images/light.png');
      case 'coin':
        return require('@assets/images/chest.png');
      default:
        return require('@assets/images/chest.png');
    }
  };

  const feedbackAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: feedbackScale.value }],
  }));

  const successAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: successScale.value }],
  }));

  return (
    <View style={styles.container}>
      {/* Question */}
      <View style={styles.questionContainer}>
        <Text variant="heading2" style={styles.questionText}>
          {exercise.question}
        </Text>
        <Text variant="body" style={styles.targetText}>
          Target: {exercise.targetNumber}
        </Text>
      </View>

      {/* Items to Count */}
      <View style={styles.itemsContainer}>
        {exercise.items.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.item,
              selectedCount > index && styles.itemSelected
            ]}
            onPress={() => handleItemPress(index)}
            disabled={isCompleted}
          >
            <Image
              source={getItemImage(item.type)}
              style={styles.itemImage}
              resizeMode="contain"
            />
            {selectedCount > index && (
              <View style={styles.checkmark}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Counter */}
      <View style={styles.counterContainer}>
        <Text variant="heading1" style={styles.counterText}>
          {selectedCount}
        </Text>
        <Text variant="body" style={styles.counterLabel}>
          {t('counted')}
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        {!isCompleted ? (
          <>
            <TouchableOpacity 
              style={[
                styles.submitButton,
                selectedCount === 0 && styles.submitButtonDisabled
              ]}
              onPress={handleSubmit}
              disabled={selectedCount === 0}
            >
              <Text variant="button" style={styles.submitButtonText}>
                {t('submit')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.resetButton}
              onPress={handleReset}
            >
              <Text variant="button" style={styles.resetButtonText}>
                {t('reset')}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <Animated.View style={[styles.successContainer, successAnimatedStyle]}>
            <Text variant="heading2" style={styles.successText}>
              ✨ {t('excellent')}! ✨
            </Text>
            <Text variant="body" style={styles.successSubtext}>
              {t('youCountedCorrectly')} {exercise.targetNumber} {t('items')}
            </Text>
          </Animated.View>
        )}
      </View>

      {/* Feedback */}
      {showFeedback && (
        <Animated.View style={[styles.feedbackContainer, feedbackAnimatedStyle]}>
          <Text variant="heading3" style={styles.feedbackText}>
            {selectedCount > exercise.targetNumber 
              ? t('tooMany') 
              : t('notEnough')}
          </Text>
          <Text variant="body" style={styles.feedbackSubtext}>
            {t('tryAgain')}
          </Text>
        </Animated.View>
      )}

      {/* Progress */}
      <View style={styles.progressContainer}>
        <Text variant="caption" style={styles.progressText}>
          {t('attempts')}: {attempts + 1}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  questionContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  questionText: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  targetText: {
    fontSize: 16,
    color: '#666',
  },
  itemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 15,
    maxWidth: SCREEN_WIDTH * 0.9,
  },
  item: {
    width: 80,
    height: 80,
    backgroundColor: '#f0f8ff',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
    position: 'relative',
  },
  itemSelected: {
    borderColor: '#4CAF50',
    backgroundColor: '#e8f5e8',
  },
  itemImage: {
    width: 50,
    height: 50,
  },
  checkmark: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 25,
    height: 25,
    borderRadius: 12.5,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  counterContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 15,
  },
  counterText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  counterLabel: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 25,
    minWidth: 100,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  successContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
    padding: 20,
    borderRadius: 15,
  },
  successText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  successSubtext: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 5,
  },
  feedbackContainer: {
    position: 'absolute',
    top: '50%',
    left: 20,
    right: 20,
    backgroundColor: '#ffebee',
    padding: 20,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#f44336',
    alignItems: 'center',
  },
  feedbackText: {
    color: '#d32f2f',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  feedbackSubtext: {
    color: '#d32f2f',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
    color: '#666',
  },
}); 