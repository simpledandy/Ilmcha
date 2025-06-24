import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { Lesson, LessonStep } from '@constants/lessons/lessonTypes';
import { TreasureReward } from './TreasureReward';
import { TracingInteraction } from './lessonInteractions/TracingInteraction';
import { CountingInteraction } from './lessonInteractions/CountingInteraction';
import { rewardManager } from '@utils/rewardManager';
import { Text } from './Text';
import { useTranslation } from 'react-i18next';
import { LessonHeader } from './UniversalLesson/LessonHeader';
import { LessonProgressBar } from './UniversalLesson/LessonProgressBar';
import { PenguinGuide } from './UniversalLesson/PenguinGuide';
import { useAudioPlayer } from '@hooks/useAudioPlayer';
import { useStepAnimation } from '@hooks/useStepAnimation';
import { colors } from '@theme/colors';
import { textStyles } from '@theme/typography';
import { RewardData } from '@types/common';

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
  const { t } = useTranslation();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepCompleted, setStepCompleted] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [rewardData, setRewardData] = useState<RewardData | null>(null);
  const [lessonScore, setLessonScore] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());

  const currentStep = lesson.steps[currentStepIndex];
  const progress = (currentStepIndex / lesson.steps.length) * 100;

  // Audio for lesson start
  useAudioPlayer(lesson.audioFile || 'lesson_start', { autoPlay: true });

  // Step and progress bar animation
  const { stepAnimatedStyle, progressAnimatedStyle, animateStep } = useStepAnimation(progress);

  useEffect(() => {
    setStartTime(Date.now());
    // Animate step entrance and progress bar
    animateStep();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  return (
    <ImageBackground
      source={lesson.backgroundImage ? require(`@assets/images/${lesson.backgroundImage}.png`) : require('@assets/images/backgrounds/ocean-bg.png')}
      style={styles.container}
    >
      {/* Header */}
      <LessonHeader
        title={lesson.title}
        description={lesson.description}
        score={lessonScore}
        onBack={onBack}
      />

      {/* Progress Bar */}
      <LessonProgressBar
        progressAnimatedStyle={progressAnimatedStyle}
        currentStep={currentStepIndex + 1}
        totalSteps={lesson.steps.length}
      />

      {/* Main Content */}
      <View style={styles.content}>
        <Animated.View style={[styles.stepContainer, stepAnimatedStyle]}>
          {renderStep()}
        </Animated.View>
      </View>

      {/* Penguin Guide */}
      <PenguinGuide pose={lesson.penguinPose} />

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
      useAudioPlayer(content.audio, { autoPlay: true });
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
      useAudioPlayer(content.audio, { autoPlay: true });
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
    backgroundColor: colors.background.tertiary,
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
    color: colors.text.secondary,
    textAlign: 'center',
  },
  scoreContainer: {
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
    padding: 10,
    borderRadius: 15,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.success[500],
  },
  scoreLabel: {
    fontSize: 10,
    color: colors.text.secondary,
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressBar: {
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
    textAlign: 'center',
    marginTop: 5,
    fontSize: 12,
    color: colors.common.white,
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
    backgroundColor: colors.background.tertiary,
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
    backgroundColor: colors.background.tertiary,
    borderRadius: 10,
  },
  interactionContainer: {
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
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
    backgroundColor: colors.success[500],
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  completeButtonText: {
    color: colors.common.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  quizContainer: {
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
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
    backgroundColor: colors.background.tertiary,
    padding: 30,
    borderRadius: 20,
    maxWidth: SCREEN_WIDTH * 0.8,
  },
  rewardText: {
    fontSize: 24,
    textAlign: 'center',
    color: colors.success[500],
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