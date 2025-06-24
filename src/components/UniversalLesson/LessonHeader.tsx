import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from '@components/Text';
import { colors } from '@theme/colors';
import { textStyles } from '@theme/typography';

export interface LessonHeaderProps {
  title: string;
  description: string;
  score: number;
  onBack: () => void;
}

export const LessonHeader: React.FC<LessonHeaderProps> = ({ title, description, score, onBack }) => (
  <View style={styles.header}>
    <TouchableOpacity style={styles.backButton} onPress={onBack}>
      <Text style={styles.backButtonText}>←</Text>
    </TouchableOpacity>
    <View style={styles.lessonInfo}>
      <Text variant="heading3" style={[textStyles.heading3, styles.lessonTitle]}>{title}</Text>
      <Text variant="caption" style={[textStyles.caption, styles.lessonDescription]}>{description}</Text>
    </View>
    <View style={styles.scoreContainer}>
      <Text variant="body" style={[textStyles.body, styles.scoreText]}>{score}</Text>
      <Text variant="caption" style={[textStyles.caption, styles.scoreLabel]}>pts</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  backButton: { padding: 8 },
  backButtonText: { fontSize: 24 },
  lessonInfo: { flex: 1, marginHorizontal: 8 },
  lessonTitle: { fontWeight: 'bold' },
  lessonDescription: { color: colors.text.secondary },
  scoreContainer: { alignItems: 'center' },
  scoreText: { fontSize: 18, fontWeight: 'bold' },
  scoreLabel: { fontSize: 12, color: colors.text.secondary },
}); 