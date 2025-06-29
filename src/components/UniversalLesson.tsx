import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { Lesson, LessonStep } from '../constants/lessonTypes';
import { TreasureReward } from './TreasureReward';
import { TracingInteraction } from './lessonInteractions/TracingInteraction';
import { CountingInteraction } from './lessonInteractions/CountingInteraction';
import { rewardManager } from '../utils/rewardManager';
import { playAudio, cleanupAudio } from '../utils/audio';
import Text from './Text';
import i18n from '@/i18n';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface UniversalLessonProps {
  lesson: Lesson;
  onComplete: (success: boolean, score: number) => void;
  onBack: () => void;
}

export const UniversalLesson: React.FC<UniversalLessonProps> = ({
  lesson,
  onComplete,
  onBack,
}) => {
  const { t } = i18n;
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepCompleted, setStepCompleted] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [rewardData, setRewardData] = useState<any>(null);
  const [lessonScore, setLessonScore] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());

  // Animation values
  const stepOpacity = useSharedValue(0);
  const stepScale = useSharedValue(0.8);
  const progressBarWidth = useSharedValue(0);

  const currentStep = lesson.steps[currentStepIndex];
  const progress = (currentStepIndex / lesson.steps.length) * 100;

  useEffect(() => {
    setStartTime(Date.now());
    playAudio(lesson.audioFile || 'lesson_start');
    
    return () => {
      cleanupAudio();
    };
  }, []);

  useEffect(() => {
    // Animate step entrance
    stepOpacity.value = withTiming(1, { duration: 500 });
    stepScale.value = withSpring(1, { damping: 15, stiffness: 150 });
    
    // Update progress bar
    progressBarWidth.value = withTiming(progress, { duration: 300 });
  }, [currentStepIndex]);

  const handleStepComplete = async (success: boolean, score: number = 0, accuracy: number = 1.0) => {
    setStepCompleted(true);
    setLessonScore(prev => prev + score);

    if (currentStep.type === 'reward') {
      // Calculate final performance
      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000; // in seconds
      const performance = Math.min(1.0, lessonScore / lesson.maxPoints);
      const speed = Math.max(0.5, 1.0 - (duration / (lesson.estimatedDuration * 60)));
      
      try {
        const result = await rewardManager.awardTreasure(
          lesson.category,
          performance,
          performance >= 0.9, // Perfect if 90% or higher
          true, // First time (you can track this in storage)
          speed
        );
        
        setRewardData(result);
        setShowReward(true);
      } catch (error) {
        console.error('Error awarding treasure:', error);
      }
    } else {
      // Auto-advance to next step after delay
      setTimeout(() => {
        if (currentStepIndex < lesson.steps.length - 1) {
          setCurrentStepIndex(prev => prev + 1);
          setStepCompleted(false);
        } else {
          onComplete(true, lessonScore);
        }
      }, 1500);
    }
  };

  const handleRewardClose = () => {
    setShowReward(false);
    setRewardData(null);
    onComplete(true, lessonScore);
  };

  const renderStep = () => {
    switch (currentStep.type) {
      case 'instruction':
        return <InstructionStep step={currentStep} onComplete={handleStepComplete} />;
      case 'interaction':
        return <InteractionStep step={currentStep} onComplete={handleStepComplete} />;
      case 'quiz':
        return <QuizStep step={currentStep} onComplete={handleStepComplete} />;
      case 'reward':
        return <RewardStep step={currentStep} onComplete={handleStepComplete} />;
      default:
        return <Text>Unknown step type</Text>;
    }
  };

  const stepAnimatedStyle = useAnimatedStyle(() => ({
    opacity: stepOpacity.value,
    transform: [{ scale: stepScale.value }],
  }));

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressBarWidth.value}%`,
  }));

  return (
    <ImageBackground
      source={lesson.backgroundImage ? require(`@assets/images/${lesson.backgroundImage}.png`) : require('@assets/images/backgrounds/ocean-bg.png')}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        
        <View style={styles.lessonInfo}>
          <Text variant="heading3" style={styles.lessonTitle}>{lesson.title}</Text>
          <Text variant="caption" style={styles.lessonDescription}>{lesson.description}</Text>
        </View>
        
        <View style={styles.scoreContainer}>
          <Text variant="body" style={styles.scoreText}>{lessonScore}</Text>
          <Text variant="caption" style={styles.scoreLabel}>pts</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <Animated.View style={[styles.progressFill, progressAnimatedStyle]} />
        </View>
        <Text variant="caption" style={styles.progressText}>
          {currentStepIndex + 1} / {lesson.steps.length}
        </Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Animated.View style={[styles.stepContainer, stepAnimatedStyle]}>
          {renderStep()}
        </Animated.View>
      </View>

      {/* Penguin Guide */}
      <View style={styles.penguinContainer}>
        <Animated.Image
          source={require(`@assets/images/penguin/${lesson.penguinPose || 'waving-explorer'}.png`)}
          style={styles.penguin}
          resizeMode="contain"
        />
      </View>

      {/* Treasure Reward Modal */}
      {rewardData && (
        <TreasureReward
          treasure={rewardData.treasure}
          points={rewardData.points}
          streak={rewardData.streak}
          isVisible={showReward}
          onClose={handleRewardClose}
        />
      )}
    </ImageBackground>
  );
};

// Step Components
const InstructionStep: React.FC<{ step: LessonStep; onComplete: (success: boolean, score: number, accuracy?: number) => void }> = ({
  step,
  onComplete,
}) => {
  const { content } = step;
  
  useEffect(() => {
    if (content.audio) {
      playAudio(content.audio);
    }
    
    const timer = setTimeout(() => {
      onComplete(true, 10);
    }, step.duration || 3000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.instructionContainer}>
      {content.text && (
        <Text variant="heading2" style={styles.instructionText}>
          {content.text}
        </Text>
      )}
      {content.image && (
        <View style={styles.instructionImage}>
          {/* Image would be rendered here */}
        </View>
      )}
    </View>
  );
};

const InteractionStep: React.FC<{ step: LessonStep; onComplete: (success: boolean, score: number, accuracy?: number) => void }> = ({
  step,
  onComplete,
}) => {
  const { content } = step;
  
  // Render specific interaction types
  if (content.type === 'tracing' && content.exercise) {
    return (
      <TracingInteraction
        exercise={content.exercise}
        onComplete={onComplete}
      />
    );
  }
  
  if (content.type === 'counting' && content.exercise) {
    return (
      <CountingInteraction
        exercise={content.exercise}
        onComplete={onComplete}
      />
    );
  }
  
  // Fallback for other interaction types
  return (
    <View style={styles.interactionContainer}>
      <Text variant="body" style={styles.interactionText}>
        Complete the activity to continue!
      </Text>
      <TouchableOpacity 
        style={styles.completeButton}
        onPress={() => onComplete(true, 20)}
      >
        <Text variant="button" style={styles.completeButtonText}>
          Complete
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const QuizStep: React.FC<{ step: LessonStep; onComplete: (success: boolean, score: number, accuracy?: number) => void }> = ({
  step,
  onComplete,
}) => {
  const { content } = step;
  
  return (
    <View style={styles.quizContainer}>
      <Text variant="heading3" style={styles.quizText}>
        Quiz time! Answer the questions.
      </Text>
      <TouchableOpacity 
        style={styles.completeButton}
        onPress={() => onComplete(true, 30)}
      >
        <Text variant="button" style={styles.completeButtonText}>
          Take Quiz
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const RewardStep: React.FC<{ step: LessonStep; onComplete: (success: boolean, score: number, accuracy?: number) => void }> = ({
  step,
  onComplete,
}) => {
  const { content } = step;
  
  useEffect(() => {
    if (content.audio) {
      playAudio(content.audio);
    }
    
    const timer = setTimeout(() => {
      onComplete(true, 0);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.rewardContainer}>
      <Text variant="heading2" style={styles.rewardText}>
        {content.message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  lessonInfo: {
    flex: 1,
    alignItems: 'center',
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  lessonDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  scoreContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 10,
    borderRadius: 15,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  scoreLabel: {
    fontSize: 10,
    color: '#666',
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressText: {
    textAlign: 'center',
    marginTop: 5,
    fontSize: 12,
    color: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  stepContainer: {
    width: '100%',
    alignItems: 'center',
  },
  instructionContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 30,
    borderRadius: 20,
    maxWidth: SCREEN_WIDTH * 0.8,
  },
  instructionText: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  instructionImage: {
    width: 100,
    height: 100,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  interactionContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 30,
    borderRadius: 20,
    maxWidth: SCREEN_WIDTH * 0.8,
  },
  interactionText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  completeButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quizContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 30,
    borderRadius: 20,
    maxWidth: SCREEN_WIDTH * 0.8,
  },
  quizText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  rewardContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 30,
    borderRadius: 20,
    maxWidth: SCREEN_WIDTH * 0.8,
  },
  rewardText: {
    fontSize: 24,
    textAlign: 'center',
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  penguinContainer: {
    position: 'absolute',
    bottom: 40,
    right: 40,
  },
  penguin: {
    width: 120,
    height: 120,
  },
}); 