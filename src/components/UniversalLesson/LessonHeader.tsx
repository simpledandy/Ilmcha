import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Text } from "@components/Text";
import { colors } from "@theme/colors";

export interface LessonHeaderProps {
  title: string;
  description: string;
  score: number;
  onBack: () => void;
}

export const LessonHeader: React.FC<LessonHeaderProps> = ({
  title,
  description,
  score,
  onBack,
}) => (
  <View style={styles.header}>
    <TouchableOpacity style={styles.backButton} onPress={onBack}>
      <Text style={styles.backButtonText}>←</Text>
    </TouchableOpacity>
    <View style={styles.lessonInfo}>
      <Text
        variant="heading3"
        weight="proportionalBold"
        style={styles.lessonTitle}
      >
        {title}
      </Text>
      <Text variant="caption" style={styles.lessonDescription}>
        {description}
      </Text>
    </View>
    <View style={styles.scoreContainer}>
      <Text variant="score" style={styles.scoreText}>
        {score}
      </Text>
      <Text variant="caption" style={styles.scoreLabel}>
        pts
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.background.secondary,
  },
  backButtonText: {
    fontSize: 24,
    color: colors.primary[500],
  },
  lessonInfo: {
    flex: 1,
    marginHorizontal: 8,
  },
  lessonTitle: {
    color: colors.text.primary,
  },
  lessonDescription: {
    color: colors.text.secondary,
    marginTop: 2,
  },
  scoreContainer: {
    alignItems: "center",
    backgroundColor: colors.primary[50],
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  scoreText: {
    color: colors.primary[500],
  },
  scoreLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
});
