import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@components/Text';
import { Achievement } from '@constants/rewards';
import { colors } from '@theme/colors';
import { textStyles } from '@theme/typography';

interface AchievementListProps {
  achievements: Achievement[];
}

const AchievementList: React.FC<AchievementListProps> = ({ achievements }) => (
  <View style={styles.achievementsList}>
    {achievements.map(achievement => {
      const progressPercentage = (achievement.progress / achievement.maxProgress) * 100;
      return (
        <View key={achievement.id} style={styles.achievementItem}>
          <View style={styles.achievementIcon}>
            <Text style={styles.achievementEmoji}>{achievement.icon}</Text>
          </View>
          <View style={styles.achievementInfo}>
            <Text variant="body" style={styles.achievementName}>{achievement.name}</Text>
            <Text variant="caption" style={styles.achievementDescription}>{achievement.description}</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
            </View>
            <Text variant="caption" style={styles.progressText}>
              {achievement.progress}/{achievement.maxProgress}
            </Text>
          </View>
          {achievement.unlocked && (
            <View style={styles.unlockedBadge}>
              <Text style={styles.unlockedText}>✓</Text>
            </View>
          )}
        </View>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  achievementsList: { marginVertical: 8 },
  achievementItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, backgroundColor: '#f9f9f9', borderRadius: 10, padding: 10 },
  achievementIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#eee', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  achievementEmoji: { fontSize: 24 },
  achievementInfo: { flex: 1 },
  achievementName: { fontWeight: 'bold' },
  achievementDescription: { color: '#888' },
  progressBar: { height: 6, backgroundColor: '#eee', borderRadius: 3, marginTop: 4 },
  progressFill: { height: 6, backgroundColor: '#4CAF50', borderRadius: 3 },
  progressText: { fontSize: 10, color: '#888', marginTop: 2 },
  unlockedBadge: { backgroundColor: '#4CAF50', borderRadius: 8, padding: 4, marginLeft: 8 },
  unlockedText: { color: '#fff', fontWeight: 'bold' },
});

export { AchievementList }; 