import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Text } from "@components/Text";
import { useTranslation } from "react-i18next";
import { lessonManager } from "@utils/lessonManager";
import { colors } from "@theme/colors";
import { PenguinImages } from "@constants/images/images";
import { islands } from "@constants/map/mapData";
import { Lesson } from "@constants/lessons/lessonTypes";

interface LessonCardProps {
  lesson: Lesson;
  onPress: () => void;
  isCompleted: boolean;
  score?: number;
}

const LessonCard: React.FC<LessonCardProps> = ({
  lesson,
  onPress,
  isCompleted,
  score,
}) => {
  const { t } = useTranslation();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "tracing":
        return "✏️";
      case "counting":
        return "🔢";
      case "matching":
        return "🔗";
      case "quiz":
        return "❓";
      case "listening":
        return "👂";
      case "speaking":
        return "🗣️";
      default:
        return "📚";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "#4CAF50";
      case "medium":
        return "#FF9800";
      case "hard":
        return "#F44336";
      default:
        return "#9E9E9E";
    }
  };

  return (
    <TouchableOpacity style={styles.lessonCard} onPress={onPress}>
      <View style={styles.lessonHeader}>
        <Text style={styles.categoryIcon}>
          {getCategoryIcon(lesson.category)}
        </Text>
        <View
          style={[
            styles.difficultyBadge,
            { backgroundColor: getDifficultyColor(lesson.difficulty) },
          ]}
        >
          <Text style={styles.difficultyText}>{t(lesson.difficulty)}</Text>
        </View>
      </View>

      <Text
        variant="heading3"
        weight="proportionalMedium"
        style={styles.lessonTitle}
      >
        {lesson.title}
      </Text>
      <Text variant="body" style={styles.lessonDescription}>
        {lesson.description}
      </Text>

      <View style={styles.lessonFooter}>
        <Text variant="caption" style={styles.lessonDuration}>
          {lesson.estimatedDuration} min
        </Text>
        {isCompleted && score !== undefined && (
          <View style={styles.scoreContainer}>
            <Text
              variant="score"
              weight="proportionalMedium"
              style={styles.scoreText}
            >
              {score} pts
            </Text>
            <Text style={styles.completedIcon}>✅</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const IslandScreen: React.FC = () => {
  const { island } = useLocalSearchParams();
  const { t } = useTranslation();
  const [islandData, setIslandData] = useState<(typeof islands)[0] | null>(
    null,
  );
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const islandId = typeof island === "string" ? island : "";

  useEffect(() => {
    const loadIslandData = async () => {
      try {
        setIsLoading(true);

        // Get island data from map
        const currentIsland = islands.find((i) => i.id === islandId);
        if (!currentIsland) {
          return;
        }

        setIslandData(currentIsland);

        // Get lessons for this island
        const islandLessons = await lessonManager.createIslandLessons(islandId);
        setLessons(islandLessons);
      } catch {
        // Silent fail - island data will show as not found
      } finally {
        setIsLoading(false);
      }
    };

    void loadIslandData();
  }, [islandId]);

  const handleLessonPress = (lessonId: string) => {
    router.push(`/(app)/${islandId}/${lessonId}`);
  };

  const getLessonProgress = (lessonId: string) => {
    const progress = lessonManager.getLessonProgress(lessonId);
    return {
      isCompleted: progress?.completed ?? false,
      score: progress?.score,
    };
  };

  const getIslandStats = () => {
    const completedLessons = lessons.filter((lesson) => {
      const progress = lessonManager.getLessonProgress(lesson.id);
      return progress?.completed ?? false;
    });

    const totalScore = completedLessons.reduce((sum, lesson) => {
      const progress = lessonManager.getLessonProgress(lesson.id);
      return sum + (progress?.score ?? 0);
    }, 0);

    return {
      completed: completedLessons.length,
      total: lessons.length,
      totalScore,
    };
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text
          variant="heading2"
          weight="proportionalBold"
          style={styles.loadingText}
        >
          {t("loading")}...
        </Text>
      </View>
    );
  }

  if (!islandData) {
    return (
      <View style={styles.errorContainer}>
        <Text
          variant="heading2"
          weight="proportionalBold"
          style={styles.errorText}
        >
          Island not found
        </Text>
      </View>
    );
  }

  const stats = getIslandStats();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text
            variant="heading1"
            weight="proportionalBold"
            style={styles.islandTitle}
          >
            {t(islandData.title)}
          </Text>
          <Text variant="body" style={styles.islandSubtitle}>
            {t(islandData.subtitle)}
          </Text>
        </View>
        <Image
          source={PenguinImages.poses.wavingExplorer}
          style={styles.penguin}
        />
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text
            variant="scoreLarge"
            weight="proportionalBold"
            style={styles.statNumber}
          >
            {stats.completed}/{stats.total}
          </Text>
          <Text variant="caption" style={styles.statLabel}>
            {t("lessons")}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text
            variant="scoreLarge"
            weight="proportionalBold"
            style={styles.statNumber}
          >
            {stats.totalScore}
          </Text>
          <Text variant="caption" style={styles.statLabel}>
            {t("points")}
          </Text>
        </View>
      </View>

      {/* Lessons */}
      <ScrollView
        style={styles.lessonsContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text
          variant="heading2"
          weight="proportionalBold"
          style={styles.lessonsTitle}
        >
          {t("lessons")}
        </Text>
        <View style={styles.lessonsGrid}>
          {lessons.map((lesson) => {
            const progress = getLessonProgress(lesson.id);
            return (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                onPress={() => handleLessonPress(lesson.id)}
                isCompleted={progress.isCompleted}
                score={progress.score}
              />
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.tertiary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  backButtonText: {
    fontSize: 20,
    color: colors.text.primary,
  },
  headerContent: {
    flex: 1,
  },
  islandTitle: {
    color: colors.text.primary,
  },
  islandSubtitle: {
    color: colors.text.secondary,
    marginTop: 5,
  },
  penguin: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 15,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 15,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    color: colors.primary[500],
  },
  statLabel: {
    color: colors.text.secondary,
    marginTop: 5,
  },
  lessonsContainer: {
    flex: 1,
    padding: 20,
  },
  lessonsTitle: {
    color: colors.text.primary,
    marginBottom: 20,
    textAlign: "center",
  },
  lessonCard: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  lessonHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 5,
  },
  difficultyText: {
    color: colors.common.white,
    fontSize: 10,
  },
  lessonFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lessonDuration: {
    color: colors.text.secondary,
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  scoreText: {
    color: colors.success[500],
    fontSize: 16,
  },
  completedIcon: {
    color: colors.success[500],
    fontSize: 16,
    marginLeft: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background.primary,
  },
  loadingText: {
    color: colors.text.primary,
    fontSize: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background.primary,
  },
  errorText: {
    color: colors.text.primary,
    fontSize: 20,
  },
  lessonsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  lessonTitle: {
    color: colors.text.primary,
    marginBottom: 5,
    marginTop: 10,
  },
  lessonDescription: {
    color: colors.text.secondary,
    marginBottom: 10,
  },
});

export default IslandScreen;
