import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { Text } from '@components/Text';
import { colors } from '@theme/colors';
import { textStyles } from '@theme/typography';
import { AnimatedStyle } from '@types/common';

export interface PointsEarnedDisplayProps {
  points: number;
  animatedStyle: AnimatedStyle;
  label: string;
}

export const PointsEarnedDisplay: React.FC<PointsEarnedDisplayProps> = ({ points, animatedStyle, label }) => (
  <Animated.View style={[styles.pointsContainer, animatedStyle]}>
    <Text variant="heading3" style={styles.pointsLabel}>{label}</Text>
    <Text variant="heading1" style={styles.pointsValue}>+{points}</Text>
  </Animated.View>
);

const styles = StyleSheet.create({
  pointsContainer: { alignItems: 'center', marginVertical: 8 },
  pointsLabel: { color: colors.text.secondary },
  pointsValue: { color: colors.success[500], fontWeight: 'bold' },
});

export { PointsEarnedDisplay }; 