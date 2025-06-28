import React from "react";
import Animated from "react-native-reanimated";
import { View, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { TracingExercise } from "@constants/lessons/lessonTypes";
import { Text } from "@components/Text";
import { useTranslation } from "react-i18next";
import { TracingLesson } from "@components/TracingLesson";
import { tracingSegments } from "@constants/tracing/tracingSegments";
import { useTracingAnimation } from "@hooks/useTracingAnimation";
import { colors } from "@theme/colors";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface TracingInteractionProps {
  exercise: TracingExercise;
  onComplete: (success: boolean, score: number, accuracy: number) => void;
}

export const TracingInteraction: React.FC<TracingInteractionProps> = ({
  exercise,
  onComplete,
}) => {
  const { t } = useTranslation();
  const [isCompleted, setIsCompleted] = React.useState(false);
  const [showHint, setShowHint] = React.useState(false);
  const [attempts, setAttempts] = React.useState(0);

  // Animation logic
  const {
    targetAnimatedStyle,
    successAnimatedStyle,
    hintAnimatedStyle,
    animateSuccess,
    animateHint,
    resetSuccess,
    resetHint,
  } = useTracingAnimation();

  // Get segments for the current exercise and enhance the exercise
  const enhancedExercise = React.useMemo(() => {
    const target = exercise.target;
    const availableSegments = tracingSegments[target];

    if (!availableSegments) {
      return {
        ...exercise,
        segments: [],
        // Provide default values for enhanced features
        practiceMode: exercise.practiceMode || "guided",
        showDottedGuide: exercise.showDottedGuide ?? true,
        showStrokeDirection: exercise.showStrokeDirection ?? true,
        showStrokeOrder: exercise.showStrokeOrder ?? true,
        enableHapticFeedback: exercise.enableHapticFeedback ?? true,
        enableAudioGuidance: exercise.enableAudioGuidance ?? true,
        adaptiveThreshold: exercise.adaptiveThreshold ?? 0.8,
        maxAttempts: exercise.maxAttempts ?? 5,
        successCriteria: exercise.successCriteria || {
          accuracyThreshold: 0.7,
          strokeOrderMatters: true,
          speedBonus: true,
        },
        accessibility: exercise.accessibility || {
          highContrast: false,
          largeTargets: false,
          extraGuidance: false,
          reducedMotion: false,
        },
      };
    }

    return {
      ...exercise,
      segments: availableSegments,
      // Provide default values for enhanced features
      practiceMode: exercise.practiceMode || "guided",
      showDottedGuide: exercise.showDottedGuide ?? true,
      showStrokeDirection: exercise.showStrokeDirection ?? true,
      showStrokeOrder: exercise.showStrokeOrder ?? true,
      enableHapticFeedback: exercise.enableHapticFeedback ?? true,
      enableAudioGuidance: exercise.enableAudioGuidance ?? true,
      adaptiveThreshold: exercise.adaptiveThreshold ?? 0.8,
      maxAttempts: exercise.maxAttempts ?? 5,
      successCriteria: exercise.successCriteria || {
        accuracyThreshold: 0.7,
        strokeOrderMatters: true,
        speedBonus: true,
      },
      accessibility: exercise.accessibility || {
        highContrast: false,
        largeTargets: false,
        extraGuidance: false,
        reducedMotion: false,
      },
    };
  }, [exercise]);

  const handleTracingComplete = (
    accuracyArr: number[],
    _attemptsArr: number[],
    _timeSpent: number,
  ) => {
    setIsCompleted(true);
    const accuracy =
      accuracyArr && accuracyArr.length > 0
        ? accuracyArr.reduce((a, b) => a + b, 0) / accuracyArr.length
        : 0;
    const isPerfect = accuracy >= 0.9;
    const score = isPerfect ? 5 : Math.max(1, Math.round(accuracy * 5));
    animateSuccess();
    setTimeout(() => {
      onComplete(true, score, accuracy);
    }, 2000);
  };

  const handleShowHint = () => {
    setShowHint(true);
    animateHint();
    setAttempts((prev) => prev + 1);
  };

  const handleRetry = () => {
    setIsCompleted(false);
    setShowHint(false);
    resetSuccess();
    resetHint();
    setAttempts((prev) => prev + 1);
  };

  // Show error state if no segments found
  if (enhancedExercise.segments.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.targetContainer}>
          <Animated.View style={[styles.target, targetAnimatedStyle]}>
            <Text variant="heading1" style={styles.targetText}>
              {exercise.target}
            </Text>
          </Animated.View>
        </View>
        <View style={styles.errorContainer}>
          <Text variant="body" style={styles.errorText}>
            {t("tracingNotAvailable", { target: exercise.target })}
          </Text>
          <Text variant="caption" style={styles.errorSubtext}>
            {t("tracingNotSupported")}
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => onComplete(true, 3, 0.5)}
          >
            <Text variant="button" style={styles.skipButtonText}>
              {t("skipThis")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Target Display */}
      <View style={styles.targetContainer}>
        <Animated.View style={[styles.target, targetAnimatedStyle]}>
          <Text variant="heading1" style={styles.targetText}>
            {exercise.target}
          </Text>
        </Animated.View>
        {isCompleted && (
          <Animated.View style={[styles.successOverlay, successAnimatedStyle]}>
            <Text variant="heading2" style={styles.successText}>
              {t("perfect")}
            </Text>
          </Animated.View>
        )}
      </View>
      {/* Tracing Canvas */}
      {!isCompleted && (
        <View style={{ width: "100%", flex: 1, marginVertical: 20 }}>
          <TracingLesson
            exercise={enhancedExercise}
            onComplete={handleTracingComplete}
          />
        </View>
      )}
      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <Text variant="heading3" style={styles.instructionText}>
          {t("traceHint")}
        </Text>
        {showHint && (
          <Animated.View style={[styles.hintContainer, hintAnimatedStyle]}>
            <Text variant="body" style={styles.hintText}>
              💡 {exercise.hints[attempts % exercise.hints.length]}
            </Text>
          </Animated.View>
        )}
      </View>
      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        {!isCompleted ? (
          <TouchableOpacity style={styles.hintButton} onPress={handleShowHint}>
            <Text variant="button" style={styles.hintButtonText}>
              {t("hint")}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text variant="button" style={styles.retryButtonText}>
              {t("tryAgain")}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <Text variant="caption" style={styles.progressText}>
          {t("attemptsLabel", { count: attempts + 1 })}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  targetContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_HEIGHT * 0.4,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    position: "relative",
  },
  target: {
    alignItems: "center",
    justifyContent: "center",
    width: 200,
    height: 200,
    backgroundColor: "#f0f8ff",
    borderRadius: 100,
    borderWidth: 3,
    borderColor: "#4CAF50",
  },
  targetText: {
    fontSize: 80,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  successOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(76, 175, 80, 0.9)",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  successText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
  instructionsContainer: {
    alignItems: "center",
    maxWidth: SCREEN_WIDTH * 0.8,
  },
  instructionText: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 10,
    color: "#333",
  },
  hintContainer: {
    backgroundColor: "#fff3cd",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ffeaa7",
  },
  hintText: {
    fontSize: 16,
    textAlign: "center",
    color: "#856404",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
  },
  traceButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    minWidth: 120,
    alignItems: "center",
  },
  traceButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  hintButton: {
    backgroundColor: colors.warning[500],
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 25,
    minWidth: 100,
    alignItems: "center",
  },
  hintButtonText: {
    color: colors.common.white,
    fontSize: 14,
    fontWeight: "bold",
  },
  retryButton: {
    backgroundColor: colors.primary[500],
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    minWidth: 120,
    alignItems: "center",
  },
  retryButtonText: {
    color: colors.common.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  progressContainer: {
    alignItems: "center",
  },
  progressText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  errorText: {
    color: colors.error[500],
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  errorSubtext: {
    color: colors.text.secondary,
    fontSize: 14,
  },
  skipButton: {
    backgroundColor: colors.primary[500],
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    minWidth: 120,
    alignItems: "center",
  },
  skipButtonText: {
    color: colors.common.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});
