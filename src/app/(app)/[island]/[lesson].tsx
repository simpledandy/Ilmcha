import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Text } from "@components/Text";
import { UniversalLesson } from "@components/UniversalLesson";
import { useTranslation } from "react-i18next";
import { lessons, LessonKey } from "@constants/lessons/lessons";
import { lessonManager } from "@utils/lessonManager";
import { colors } from "@theme/colors";
import { Lesson } from "@constants/lessons/lessonTypes";

const LessonScreen: React.FC = () => {
  const { island, lesson: lessonId } = useLocalSearchParams();
  const { t } = useTranslation();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const islandId = typeof island === "string" ? island : "";
  const lessonKey = typeof lessonId === "string" ? lessonId : "";

  useEffect(() => {
    const loadLesson = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get the lesson from our lessons constant
        const lessonData = lessons[lessonKey as LessonKey];

        if (!lessonData) {
          setError("Lesson not found");
          return;
        }

        // Create island lessons to get the lesson with proper path data
        const islandLessons = await lessonManager.createIslandLessons(islandId);

        const islandLesson = islandLessons.find((l) => l.id === lessonKey);

        if (islandLesson) {
          setLesson(islandLesson);
        } else {
          setLesson(lessonData);
        }
      } catch {
        setError("Failed to load lesson");
      } finally {
        setIsLoading(false);
      }
    };

    void loadLesson();
  }, [islandId, lessonKey]);

  const handleLessonComplete = async (
    success: boolean,
    score: number,
    nextLessonId?: string,
  ) => {
    if (!lesson) return;

    try {
      // Calculate time spent (you might want to track this more accurately)
      const timeSpent = 60; // Default 1 minute
      const accuracy = success ? 0.9 : 0.5; // You can calculate this from the interaction

      // Complete the lesson in the lesson manager
      await lessonManager.completeLesson(lesson.id, score, accuracy, timeSpent);

      // If there's a next lesson, navigate to it
      if (nextLessonId) {
        router.replace(`/(app)/${islandId}/${nextLessonId}`);
      } else {
        // Show success message and navigate back to island
        Alert.alert(
          t("excellent"),
          `${t("greatJob")}! ${t("pointsEarned")}: ${score}`,
          [
            {
              text: t("next"),
              onPress: () => {
                // Navigate back to island
                router.back();
              },
            },
          ],
        );
      }
    } catch {
      Alert.alert("Error", "Failed to save lesson progress");
    }
  };

  const handleLessonCompleteWrapper = (
    success: boolean,
    score: number,
    nextLessonId?: string,
  ) => {
    void handleLessonComplete(success, score, nextLessonId);
  };

  const handleBackPress = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text variant="heading2" style={styles.loadingText}>
          {t("loading")}...
        </Text>
      </View>
    );
  }

  if (error || !lesson) {
    return (
      <View style={styles.errorContainer}>
        <Text variant="heading2" style={styles.errorText}>
          {error || "Lesson not found"}
        </Text>
        <Text variant="body" style={styles.errorSubtext}>
          {t("lessonNotFound")}
        </Text>
      </View>
    );
  }

  return (
    <UniversalLesson
      lesson={lesson}
      onComplete={handleLessonCompleteWrapper}
      onBack={handleBackPress}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background.primary,
  },
  loadingText: {
    color: colors.text.primary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background.primary,
    padding: 20,
  },
  errorText: {
    color: colors.error[500],
    textAlign: "center",
    marginBottom: 10,
  },
  errorSubtext: {
    color: colors.text.secondary,
    textAlign: "center",
  },
});

export default LessonScreen;
