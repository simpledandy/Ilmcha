import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import type {
  Station,
  StationTask,
  CountingData,
  QuizData,
  TracingData,
  ListeningData,
} from "../types/common";
import { colors } from "@theme/colors";
import { useAudioPlayer } from "@hooks/useAudioPlayer";
import { useTranslation } from "react-i18next";
import { Button } from "./Button";
import { Text as CustomText } from "./Text";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface StationInteractionProps {
  station: Station;
  currentTaskIndex: number;
  onTaskComplete: (taskId: string, success: boolean, score: number) => void;
  onStationComplete: () => void;
  onBack: () => void;
  onTaskIndexChange: (index: number) => void;
}

export const StationInteraction: React.FC<StationInteractionProps> = ({
  station,
  currentTaskIndex,
  onTaskComplete,
  onStationComplete,
  onBack,
  onTaskIndexChange,
}) => {
  const { t } = useTranslation();
  const [currentTask, setCurrentTask] = useState<StationTask | null>(null);

  // Animation values
  const backgroundScale = useSharedValue(1);
  const taskOpacity = useSharedValue(0);
  const progressWidth = useSharedValue(0);

  // Audio player for station sounds
  const { play: playAudio } = useAudioPlayer();

  useEffect(() => {
    if (station.tasks[currentTaskIndex]) {
      setCurrentTask(station.tasks[currentTaskIndex]);

      // Animate task entrance
      taskOpacity.value = withTiming(1, { duration: 500 });
      progressWidth.value = withTiming(0, { duration: 300 });

      // Play task audio if available
      if (station.tasks[currentTaskIndex].content.audioFile) {
        playAudio(
          station.tasks[currentTaskIndex].content.audioFile as "congrats",
        );
      }
    }
  }, [currentTaskIndex, station, taskOpacity, progressWidth, playAudio]);

  const handleTaskComplete = (success: boolean, score: number) => {
    if (!currentTask) return;

    // Animate progress bar
    progressWidth.value = withTiming(SCREEN_WIDTH * 0.8, { duration: 1000 });

    // Play completion sound
    if (success) {
      playAudio("congrats");
    }

    // Call parent handler
    onTaskComplete(currentTask.id, success, score);

    // Auto-advance after delay
    setTimeout(() => {
      if (currentTaskIndex < station.tasks.length - 1) {
        // Move to next task
        onTaskIndexChange(currentTaskIndex + 1);
      } else {
        // Station complete
        onStationComplete();
      }
    }, 2000);
  };

  const renderTaskContent = () => {
    if (!currentTask) return null;

    const { content } = currentTask;

    switch (content.type) {
      case "listening": {
        return (
          <View style={styles.listeningContainer}>
            <CustomText variant="heading2" style={styles.taskTitle}>
              {currentTask.title}
            </CustomText>
            <CustomText variant="body" style={styles.taskDescription}>
              {(content.data as ListeningData).message}
            </CustomText>
            <Button
              onPress={() => handleTaskComplete(true, currentTask.points)}
              style={styles.completeButton}
            >
              {t("continue")}
            </Button>
          </View>
        );
      }

      case "counting": {
        const countingData = content.data as CountingData;
        return (
          <View style={styles.countingContainer}>
            <CustomText variant="heading2" style={styles.taskTitle}>
              {currentTask.title}
            </CustomText>
            <CustomText variant="body" style={styles.taskDescription}>
              {countingData.question}
            </CustomText>
            <View style={styles.countingArea}>
              {countingData.items.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.countingItem,
                    { left: item.position.x, top: item.position.y },
                  ]}
                  onPress={() => {
                    // Handle item click for counting
                    playAudio("coins");
                  }}
                >
                  <Image
                    source={{ uri: item.image || "default_item" }}
                    style={styles.itemImage}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.answerButtons}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <TouchableOpacity
                  key={num}
                  style={styles.numberButton}
                  onPress={() => {
                    const isCorrect = num === countingData.targetNumber;
                    handleTaskComplete(
                      isCorrect,
                      isCorrect ? currentTask.points : 0,
                    );
                  }}
                >
                  <CustomText variant="heading3">{num}</CustomText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      }

      case "tracing": {
        const tracingData = content.data as TracingData;
        return (
          <View style={styles.tracingContainer}>
            <CustomText variant="heading2" style={styles.taskTitle}>
              {currentTask.title}
            </CustomText>
            <CustomText variant="body" style={styles.taskDescription}>
              {t("traceLetter", { letter: tracingData.target })}
            </CustomText>
            <View style={styles.tracingArea}>
              {/* Tracing component would go here */}
              <CustomText variant="body" style={styles.tracingPlaceholder}>
                {t("tracingInstructions")}
              </CustomText>
            </View>
            <Button
              onPress={() => handleTaskComplete(true, currentTask.points)}
              style={styles.completeButton}
            >
              {t("complete")}
            </Button>
          </View>
        );
      }

      case "quiz": {
        const quizData = content.data as QuizData;
        return (
          <View style={styles.quizContainer}>
            <CustomText variant="heading2" style={styles.taskTitle}>
              {currentTask.title}
            </CustomText>
            <View style={styles.quizQuestions}>
              {quizData.questions.map((question, _index) => (
                <View key={question.id} style={styles.questionContainer}>
                  <CustomText variant="body" style={styles.questionText}>
                    {question.question}
                  </CustomText>
                  <View style={styles.answerOptions}>
                    {question.options.map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={styles.answerOption}
                        onPress={() => {
                          const isCorrect = option === question.correctAnswer;
                          handleTaskComplete(
                            isCorrect,
                            isCorrect ? question.points : 0,
                          );
                        }}
                      >
                        <CustomText variant="body">{option}</CustomText>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </View>
        );
      }

      default:
        return (
          <View style={styles.defaultContainer}>
            <CustomText variant="heading2">
              Task Type Not Implemented
            </CustomText>
          </View>
        );
    }
  };

  const animatedBackgroundStyle = useAnimatedStyle(() => ({
    transform: [{ scale: backgroundScale.value }],
  }));

  const animatedTaskStyle = useAnimatedStyle(() => ({
    opacity: taskOpacity.value,
  }));

  const animatedProgressStyle = useAnimatedStyle(() => ({
    width: progressWidth.value,
  }));

  return (
    <View style={styles.container}>
      {/* Background with station theme */}
      <Animated.View style={[styles.background, animatedBackgroundStyle]}>
        <Image
          source={{ uri: station.backgroundImage }}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
      </Animated.View>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <CustomText variant="body">← {t("back")}</CustomText>
        </TouchableOpacity>
        <CustomText variant="heading1" style={styles.stationName}>
          {station.name}
        </CustomText>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View
              style={[styles.progressFill, animatedProgressStyle]}
            />
          </View>
          <CustomText variant="caption">
            {currentTaskIndex + 1} / {station.tasks.length}
          </CustomText>
        </View>
      </View>

      {/* Task Content */}
      <Animated.View style={[styles.taskContainer, animatedTaskStyle]}>
        {renderTaskContent()}
      </Animated.View>

      {/* Visual Effects */}
      {station.visualEffects && station.visualEffects.particles && (
        <View style={styles.particlesContainer}>
          {/* Particle effects would be implemented here */}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  backButton: {
    padding: 10,
  },
  stationName: {
    flex: 1,
    textAlign: "center",
    marginHorizontal: 20,
  },
  progressContainer: {
    alignItems: "center",
  },
  progressBar: {
    width: 100,
    height: 6,
    backgroundColor: colors.background.tertiary,
    borderRadius: 3,
    marginBottom: 5,
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.success[500],
    borderRadius: 3,
  },
  taskContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  listeningContainer: {
    alignItems: "center",
    padding: 20,
  },
  taskTitle: {
    marginBottom: 10,
    textAlign: "center",
  },
  taskDescription: {
    marginBottom: 20,
    textAlign: "center",
    color: colors.text.secondary,
  },
  completeButton: {
    marginTop: 20,
  },
  countingContainer: {
    flex: 1,
  },
  countingArea: {
    flex: 1,
    position: "relative",
    marginVertical: 20,
  },
  countingItem: {
    position: "absolute",
    width: 60,
    height: 60,
  },
  itemImage: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
  },
  answerButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  numberButton: {
    width: 50,
    height: 50,
    backgroundColor: colors.primary[500],
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  tracingContainer: {
    alignItems: "center",
  },
  tracingArea: {
    width: SCREEN_WIDTH * 0.8,
    height: 200,
    backgroundColor: colors.background.secondary,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  tracingPlaceholder: {
    color: colors.text.tertiary,
  },
  quizContainer: {
    flex: 1,
  },
  quizQuestions: {
    flex: 1,
  },
  questionContainer: {
    marginBottom: 30,
  },
  questionText: {
    marginBottom: 15,
    textAlign: "center",
  },
  answerOptions: {
    gap: 10,
  },
  answerOption: {
    padding: 15,
    backgroundColor: colors.background.secondary,
    borderRadius: 10,
    alignItems: "center",
  },
  defaultContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  particlesContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: "none",
  },
});
