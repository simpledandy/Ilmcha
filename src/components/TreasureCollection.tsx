import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { Treasure, Achievement } from '@constants/rewards/rewards';
import { rewardManager } from '@utils/rewardManager';
import { Text } from './Text';
import { useTranslation } from 'react-i18next';
import { TreasureTabs } from './TreasureCollection/TreasureTabs';
import { TreasureGrid } from './TreasureCollection/TreasureGrid';
import { AchievementList } from './TreasureCollection/AchievementList';
import { useAnimatedModal } from '@hooks/useAnimatedModal';
import { colors } from '@theme/colors';
import { textStyles } from '@theme/typography';
import { ProgressData } from '@types/common';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface TreasureCollectionProps {
  isVisible: boolean;
  onClose: () => void;
}

export const TreasureCollection: React.FC<TreasureCollectionProps> = ({
  isVisible,
  onClose,
}) => {
  const { t } = useTranslation();
  const [treasures, setTreasures] = useState<Treasure[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [progress, setProgress] = useState<ProgressData>({
    totalTreasures: 0,
    totalPoints: 0,
    currentStreak: 0,
    bestStreak: 0,
    islandsUnlocked: 0,
    achievementsUnlocked: 0,
    lastRewardDate: '',
  });
  const [activeTab, setActiveTab] = useState<'treasures' | 'achievements' | 'stats'>('treasures');

  // Modal animation
  const { modalAnimatedStyle } = useAnimatedModal(isVisible);

  useEffect(() => {
    if (isVisible) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  const loadData = async () => {
    setTreasures(rewardManager.getCollectedTreasures() || []);
    setAchievements(rewardManager.getAchievements() || []);
    setProgress(rewardManager.getProgress() || {
      totalTreasures: 0,
      totalPoints: 0,
      currentStreak: 0,
      bestStreak: 0,
      islandsUnlocked: 0,
      achievementsUnlocked: 0,
      lastRewardDate: '',
    });
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return colors.rarity.gold;
      case 'epic': return colors.rarity.purple;
      case 'rare': return colors.rarity.blue;
      case 'common': return colors.rarity.green;
      default: return colors.rarity.gold;
    }
  };

  const getRarityCount = (rarity: string) => {
    return (treasures || []).filter(t => t.rarity === rarity).length;
  };

  const renderTreasureItem = (treasure: Treasure) => (
    <View key={treasure.id} style={styles.treasureItem}>
      <View style={[styles.rarityIndicator, { backgroundColor: getRarityColor(treasure.rarity) }]} />
      <Image source={treasure.imageSource} style={styles.treasureImage} resizeMode="contain" />
      <View style={styles.treasureInfo}>
        <Text variant="body" style={styles.treasureName}>{treasure.name}</Text>
        <Text variant="caption" style={styles.treasureValue}>+{treasure.value} pts</Text>
      </View>
    </View>
  );

  const renderAchievementItem = (achievement: Achievement) => {
    const progressPercentage = (achievement.progress / achievement.maxProgress) * 100;
    return (
      <View key={achievement.id} style={styles.achievementItem}>
        <View style={styles.achievementIcon}>
          <Text style={styles.achievementEmoji}>{achievement.icon}</Text>
        </View>
        <View style={styles.achievementInfo}>
          <Text variant="body" style={styles.achievementName}>{achievement.name}</Text>
          <Text variant="caption" style={styles.achievementDescription}>
            {achievement.description}
          </Text>
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
  };

  const renderStats = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statCard}>
        <Text variant="heading2" style={styles.statValue}>{progress.totalTreasures || 0}</Text>
        <Text variant="body" style={styles.statLabel}>{t('totalTreasures')}</Text>
      </View>
      <View style={styles.statCard}>
        <Text variant="heading2" style={styles.statValue}>{progress.totalPoints || 0}</Text>
        <Text variant="body" style={styles.statLabel}>{t('totalPoints')}</Text>
      </View>
      <View style={styles.statCard}>
        <Text variant="heading2" style={styles.statValue}>{progress.bestStreak || 0}</Text>
        <Text variant="body" style={styles.statLabel}>{t('bestStreak')}</Text>
      </View>
      <View style={styles.statCard}>
        <Text variant="heading2" style={styles.statValue}>{progress.achievementsUnlocked || 0}</Text>
        <Text variant="body" style={styles.statLabel}>{t('achievements')}</Text>
      </View>
      <View style={styles.rarityStats}>
        <Text variant="heading3" style={styles.rarityTitle}>{t('treasureBreakdown')}</Text>
        <View style={styles.rarityRow}>
          <View style={[styles.rarityDot, { backgroundColor: colors.rarity.green }]} />
          <Text variant="body">{t('common')}: {getRarityCount('common')}</Text>
        </View>
        <View style={styles.rarityRow}>
          <View style={[styles.rarityDot, { backgroundColor: colors.rarity.blue }]} />
          <Text variant="body">{t('rare')}: {getRarityCount('rare')}</Text>
        </View>
        <View style={styles.rarityRow}>
          <View style={[styles.rarityDot, { backgroundColor: colors.rarity.purple }]} />
          <Text variant="body">{t('epic')}: {getRarityCount('epic')}</Text>
        </View>
        <View style={styles.rarityRow}>
          <View style={[styles.rarityDot, { backgroundColor: colors.rarity.gold }]} />
          <Text variant="body">{t('legendary')}: {getRarityCount('legendary')}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { display: isVisible ? 'flex' : 'none' }]}> 
      <View style={styles.overlay} />
      <Animated.View style={[styles.modal, modalAnimatedStyle]}>
        {/* Header */}
        <View style={styles.header}>
          <Text variant="heading1" style={styles.title}>{t('treasureCollection')}</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>
        {/* Tabs */}
        <TreasureTabs activeTab={activeTab} setActiveTab={setActiveTab} t={t} />
        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {activeTab === 'treasures' && (
            <TreasureGrid treasures={treasures} getRarityColor={getRarityColor} />
          )}
          {activeTab === 'achievements' && (
            <AchievementList achievements={achievements} />
          )}
          {activeTab === 'stats' && renderStats()}
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modal: {
    flex: 1,
    backgroundColor: colors.common.white,
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.background.tertiary,
  },
  title: {
    fontSize: textStyles.heading1.fontSize,
    fontWeight: textStyles.heading1.fontWeight,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: textStyles.caption.fontSize,
    color: colors.text.secondary,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.background.tertiary,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: colors.success[500],
  },
  tabText: {
    fontSize: textStyles.body.fontSize,
    color: colors.text.secondary,
  },
  activeTabText: {
    color: colors.success[500],
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  treasuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  treasureItem: {
    width: (SCREEN_WIDTH - 80) / 2 - 10,
    backgroundColor: colors.background.tertiary,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    position: 'relative',
  },
  rarityIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  treasureImage: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  treasureInfo: {
    alignItems: 'center',
  },
  treasureName: {
    fontSize: textStyles.body.fontSize,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  treasureValue: {
    fontSize: textStyles.caption.fontSize,
    color: colors.rarity.gold,
    fontWeight: 'bold',
  },
  achievementsList: {
    gap: 15,
  },
  achievementItem: {
    flexDirection: 'row',
    backgroundColor: colors.background.tertiary,
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
  },
  achievementIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.common.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  achievementEmoji: {
    fontSize: textStyles.body.fontSize,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementName: {
    fontSize: textStyles.body.fontSize,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  achievementDescription: {
    fontSize: textStyles.caption.fontSize,
    color: colors.text.secondary,
    marginBottom: 10,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.background.tertiary,
    borderRadius: 3,
    marginBottom: 5,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.success[500],
    borderRadius: 3,
  },
  progressText: {
    fontSize: textStyles.caption.fontSize,
    color: colors.text.secondary,
  },
  unlockedBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.success[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  unlockedText: {
    color: colors.common.white,
    fontSize: textStyles.body.fontSize,
    fontWeight: 'bold',
  },
  statsContainer: {
    gap: 20,
  },
  statCard: {
    backgroundColor: colors.background.tertiary,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  statValue: {
    fontSize: textStyles.heading2.fontSize,
    fontWeight: 'bold',
    color: colors.success[500],
    marginBottom: 5,
  },
  statLabel: {
    fontSize: textStyles.body.fontSize,
    color: colors.text.secondary,
  },
  rarityStats: {
    backgroundColor: colors.background.tertiary,
    borderRadius: 15,
    padding: 20,
  },
  rarityTitle: {
    fontSize: textStyles.heading3.fontSize,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  rarityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  rarityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: textStyles.body.fontSize,
    fontWeight: 'bold',
    color: colors.text.secondary,
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: textStyles.caption.fontSize,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
}); 