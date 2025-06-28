import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, ImageBackground, Dimensions } from "react-native";
import Animated from "react-native-reanimated";
import { Lesson } from "@constants/lessons/lessonTypes";
import { TreasureReward } from "./TreasureReward";
import { rewardManager } from "@utils/rewardManager";
import { Text } from "@components/Text";
import { LessonHeader } from "./UniversalLesson/LessonHeader";
import { LessonProgressBar } from "./UniversalLesson/LessonProgressBar";
import { PenguinGuide } from "./UniversalLesson/PenguinGuide";
import { LessonCompletionFlow } from "./UniversalLesson/LessonCompletionFlow";
import { useAudioPlayer } from "@hooks/useAudioPlayer";
import { useStepAnimation } from "@hooks/useStepAnimation";
import { colors } from "@theme/colors";
import { InstructionStep } from "./UniversalLesson/InstructionStep";
import { InteractionStep } from "./UniversalLesson/InteractionStep";
import { QuizStep } from "./UniversalLesson/QuizStep";
import { RewardStep } from "./UniversalLesson/RewardStep";
import { RewardData } from "../types/common";
import { AppIcons, BackgroundImages } from "@constants/images/images";
import { Button } from "@components/Button";
import { useTranslation } from "react-i18next";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface UniversalLessonProps {
  lesson: Lesson;
  onComplete: (success: boolean, score: number, nextLessonId?: string) => void;
  onBack: () => void;
}

export const UniversalLesson: React.FC<UniversalLessonProps> = ({
  lesson,
  onComplete,
  onBack,
}) => {
  const { t } = useTranslation();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [rewardData, setRewardData] = useState<RewardData | null>(null);
  const [lessonScore, setLessonScore] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  const [showCompletionFlow, setShowCompletionFlow] = useState(false);
  const [unlockedItems, setUnlockedItems] = useState<
    Array<{
      type: "lesson" | "island" | "treasure";
      name: string;
      description: string;
    }>
  >([]);
  const [hasNextLesson, setHasNextLesson] = useState(false);
  const [nextLessonId, setNextLessonId] = useState<string | null>(null);
  const startTimeRef = useRef(Date.now());

  // Calculate progress early
  const progress =
    lesson && lesson.steps ? (currentStepIndex / lesson.steps.length) * 100 : 0;

  // Audio for lesson start - call this before any early returns
  useAudioPlayer(lesson?.audioFile || "lesson_start", { autoPlay: true });

  // Step and progress bar animation - call this before any early returns
  const { stepAnimatedStyle, progressAnimatedStyle, animateStep } =
    useStepAnimation(progress);

  useEffect(() => {
    // Animate step entrance and progress bar
    animateStep();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStepIndex]);

  // Safety checks
  if (!lesson || !lesson.steps || lesson.steps.length === 0) {
    console.error("Invalid lesson data:", lesson);
    return (
      <View style={styles.container}>
        <Text>{t("errorInvalidLessonData")}</Text>
        <Button onPress={onBack}>{t("goBack")}</Button>
      </View>
    );
  }

  // Ensure currentStepIndex is within bounds
  if (currentStepIndex >= lesson.steps.length) {
    console.error("Current step index out of bounds, resetting to 0:", {
      currentStepIndex,
      stepsLength: lesson.steps.length,
    });
    setCurrentStepIndex(0);
    return (
      <View style={styles.container}>
        <Text>{t("errorStepIndexOutOfBounds")}</Text>
        <Button onPress={onBack}>{t("goBack")}</Button>
      </View>
    );
  }

  const currentStep = lesson.steps[currentStepIndex];

  // Safety check for currentStep
  if (!currentStep) {
    console.error("Current step is undefined:", {
      currentStepIndex,
      stepsLength: lesson.steps.length,
    });
    return (
      <View style={styles.container}>
        <Text>{t("errorStepNotFound")}</Text>
        <Button onPress={onBack}>{t("goBack")}</Button>
      </View>
    );
  }

  const handleStepComplete = async (success: boolean, score: number = 0) => {
    if (isCompleting) return; // Prevent multiple completions

    setLessonScore((prev) => prev + score);

    if (currentStep.type === "reward") {
      setIsCompleting(true);
      // Calculate final performance
      const endTime = Date.now();
      const duration = (endTime - startTimeRef.current) / 1000; // in seconds
      const performance = Math.min(1.0, lessonScore / lesson.maxPoints);
      const speed = Math.max(
        0.5,
        1.0 - duration / (lesson.estimatedDuration * 60),
      );

      try {
        // Award treasure
        const result = await rewardManager.awardTreasure(
          lesson.category,
          performance,
          performance >= 0.9, // Perfect if 90% or higher
          true, // First time (you can track this in storage)
          speed,
        );
        setRewardData(result);
        setShowReward(true);

        // Determine unlocked items based on lesson completion
        const newUnlockedItems = determineUnlockedItems(lesson, performance);

        // Add treasure to unlocked items
        newUnlockedItems.unshift({
          type: "treasure",
          name: result.treasure.name,
          description: result.treasure.description ?? "A special treasure!",
        });

        setUnlockedItems(newUnlockedItems);

        // Check if there's a next lesson
        const nextLesson = determineNextLesson(lesson);
        setHasNextLesson(!!nextLesson);
        setNextLessonId(nextLesson);

        // Show completion flow after treasure reward
        setTimeout(() => {
          setShowReward(false);
          setShowCompletionFlow(true);
        }, 3000);
      } catch (error) {
        console.error("Error awarding treasure:", error);
        // Still show completion flow even if reward fails
        setShowCompletionFlow(true);
      }
    } else {
      // Auto-advance to next step after delay
      setTimeout(() => {
        // Check if we're at the last step
        if (currentStepIndex >= lesson.steps.length - 1) {
          // We're at the last step, complete the lesson
          setIsCompleting(true);
          setShowCompletionFlow(true);
        } else {
          // Move to next step
          setCurrentStepIndex((prev) => {
            const nextIndex = prev + 1;
            // Safety check to ensure we don't go beyond bounds
            if (nextIndex >= lesson.steps.length) {
              console.warn(
                "Attempting to advance beyond lesson bounds, completing lesson instead",
              );
              setIsCompleting(true);
              setShowCompletionFlow(true);
              return prev; // Stay at current index
            }
            return nextIndex;
          });
        }
      }, 1500);
    }
  };

  const handleRewardClose = () => {
    setShowReward(false);
    setRewardData(null);
    onComplete(true, lessonScore);
  };

  // Helper function to determine unlocked items
  const determineUnlockedItems = (
    completedLesson: Lesson,
    performance: number,
  ) => {
    const unlockedItems: Array<{
      type: "lesson" | "island" | "treasure";
      name: string;
      description: string;
    }> = [];

    // Determine next lesson based on current lesson
    const lessonId = completedLesson.id;
    const lessonNumber = parseInt(lessonId.match(/\d+/)?.[0] || "0");

    // If this is a number tracing lesson, unlock the next one
    if (lessonId.startsWith("number_tracing_") && lessonNumber < 10) {
      const nextLessonNumber = lessonNumber + 1;
      unlockedItems.push({
        type: "lesson",
        name: t("nextNumberTracing", { number: nextLessonNumber }),
        description: t("learnToWriteNumber", { number: nextLessonNumber }),
      });
    }

    // If this is a counting lesson, unlock the next one
    if (lessonId.startsWith("counting_fish_")) {
      const currentCount = parseInt(lessonId.match(/\d+/)?.[0] || "0");
      if (currentCount === 3) {
        unlockedItems.push({
          type: "lesson",
          name: t("countToFish", { count: 5 }),
          description: t("learnToCountFish", { count: 5 }),
        });
      } else if (currentCount === 5) {
        unlockedItems.push({
          type: "lesson",
          name: t("countToFish", { count: 7 }),
          description: t("learnToCountFish", { count: 7 }),
        });
      }
    }

    // If performance is perfect, unlock bonus content
    if (performance >= 0.9) {
      unlockedItems.push({
        type: "lesson",
        name: t("bonusChallenge"),
        description: t("specialChallengeUnlocked"),
      });
    }

    return unlockedItems;
  };

  // Helper function to determine next lesson
  const determineNextLesson = (completedLesson: Lesson) => {
    const lessonId = completedLesson.id;
    const lessonNumber = parseInt(lessonId.match(/\d+/)?.[0] || "0");

    // For number tracing lessons
    if (lessonId.startsWith("number_tracing_") && lessonNumber < 10) {
      return `number_tracing_${lessonNumber + 1}`;
    }

    // For counting lessons
    if (lessonId.startsWith("counting_fish_")) {
      const currentCount = parseInt(lessonId.match(/\d+/)?.[0] || "0");
      if (currentCount === 3) return "counting_fish_5";
      if (currentCount === 5) return "counting_fish_7";
    }

    return null;
  };

  // Completion flow handlers
  const handleContinue = () => {
    setShowCompletionFlow(false);
    onComplete(true, lessonScore);
  };

  const handleBackToIsland = () => {
    setShowCompletionFlow(false);
    onComplete(true, lessonScore);
  };

  const handleNextLesson = () => {
    if (nextLessonId) {
      setShowCompletionFlow(false);
      // Navigate to next lesson
      onComplete(true, lessonScore, nextLessonId);
    }
  };

  const renderStep = () => {
    switch (currentStep.type) {
      case "instruction":
        return (
          <InstructionStep
            step={currentStep}
            onComplete={(success: boolean, score: number) =>
              void handleStepComplete(success, score)
            }
          />
        );
      case "interaction":
        return (
          <InteractionStep
            step={currentStep}
            onComplete={(success: boolean, score: number) =>
              void handleStepComplete(success, score)
            }
          />
        );
      case "quiz":
        return (
          <QuizStep
            onComplete={(success: boolean, score: number) =>
              void handleStepComplete(success, score)
            }
          />
        );
      case "reward":
        return (
          <RewardStep
            onComplete={(success: boolean, score: number) =>
              void handleStepComplete(success, score)
            }
          />
        );
      default:
        return <Text>{t("unknownStepType")}</Text>;
    }
  };

  return (
    <ImageBackground
      source={
        lesson.backgroundImage &&
        Object.prototype.hasOwnProperty.call(AppIcons, lesson.backgroundImage)
          ? AppIcons[lesson.backgroundImage as keyof typeof AppIcons]
          : BackgroundImages.screens.main
      }
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
      <PenguinGuide
        pose={
          (lesson.penguinPose as keyof (typeof PenguinGuide)["defaultProps"]) ??
          "wavingExplorer"
        }
      />

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

      {/* Lesson Completion Flow */}
      <LessonCompletionFlow
        lesson={lesson}
        score={lessonScore}
        maxScore={lesson.maxPoints}
        isVisible={showCompletionFlow}
        onContinue={handleContinue}
        onBackToIsland={handleBackToIsland}
        onNextLesson={hasNextLesson ? handleNextLesson : undefined}
        hasNextLesson={hasNextLesson}
        unlockedItems={unlockedItems}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.tertiary,
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
  lessonInfo: {
    flex: 1,
    alignItems: "center",
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  lessonDescription: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: "center",
  },
  scoreContainer: {
    alignItems: "center",
    backgroundColor: colors.background.tertiary,
    padding: 10,
    borderRadius: 15,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: "bold",
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
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.success[500],
    borderRadius: 4,
  },
  progressText: {
    textAlign: "center",
    marginTop: 5,
    fontSize: 12,
    color: colors.common.white,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  stepContainer: {
    width: "100%",
    alignItems: "center",
  },
  instructionContainer: {
    alignItems: "center",
    backgroundColor: colors.background.tertiary,
    padding: 30,
    borderRadius: 20,
    maxWidth: SCREEN_WIDTH * 0.8,
  },
  instructionText: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  instructionImage: {
    width: 100,
    height: 100,
    backgroundColor: colors.background.tertiary,
    borderRadius: 10,
  },
  interactionContainer: {
    alignItems: "center",
    backgroundColor: colors.background.tertiary,
    padding: 30,
    borderRadius: 20,
    maxWidth: SCREEN_WIDTH * 0.8,
  },
  interactionText: {
    fontSize: 18,
    textAlign: "center",
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
    fontWeight: "bold",
  },
  quizContainer: {
    alignItems: "center",
    backgroundColor: colors.background.tertiary,
    padding: 30,
    borderRadius: 20,
    maxWidth: SCREEN_WIDTH * 0.8,
  },
  quizText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  rewardContainer: {
    alignItems: "center",
    backgroundColor: colors.background.tertiary,
    padding: 30,
    borderRadius: 20,
    maxWidth: SCREEN_WIDTH * 0.8,
  },
  rewardText: {
    fontSize: 24,
    textAlign: "center",
    color: colors.success[500],
    fontWeight: "bold",
  },
  penguinContainer: {
    position: "absolute",
    bottom: 40,
    right: 40,
  },
  penguin: {
    width: 120,
    height: 120,
  },
});
