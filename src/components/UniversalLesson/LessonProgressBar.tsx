import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { Text } from '@components/Text';
import { colors } from '@theme/colors';
import { textStyles } from '@theme/typography';
import { AnimatedStyle } from '@types/common';

export interface LessonProgressBarProps {
  progressAnimatedStyle: AnimatedStyle;
  currentStep: number;
  totalSteps: number;
}

export const LessonProgressBar: React.FC<LessonProgressBarProps> = ({ progressAnimatedStyle, currentStep, totalSteps }) => (
  <View style={styles.progressContainer}>
    <View style={styles.progressBar}>
      <Animated.View style={[styles.progressFill, progressAnimatedStyle]} />
    </View>
    <Text variant="caption" style={styles.progressText}>
      {currentStep} / {totalSteps}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  progressContainer: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginBottom: 8 },
  progressBar: { flex: 1, height: 8, backgroundColor: colors.background.tertiary, borderRadius: 4, marginRight: 8 },
  progressFill: { height: 8, backgroundColor: colors.success[500], borderRadius: 4 },
  progressText: { ...textStyles.caption, minWidth: 50, textAlign: 'right' },
}); 