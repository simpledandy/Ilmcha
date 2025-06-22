import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { Treasure, Achievement } from '../constants/rewards';
import { rewardManager } from '../utils/rewardManager';
import Text from './Text';
import i18n from '@/i18n';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface TreasureCollectionProps {
  isVisible: boolean;
  onClose: () => void;
}

export const TreasureCollection: React.FC<TreasureCollectionProps> = ({
  isVisible,
  onClose,
}) => {
  const { t } = i18n;
  const [treasures, setTreasures] = useState<Treasure[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [progress, setProgress] = useState<any>({});
  const [activeTab, setActiveTab] = useState<'treasures' | 'achievements' | 'stats'>('treasures');

  // Animation values
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (isVisible) {
      loadData();
      scale.value = withSpring(1, { damping: 15, stiffness: 150 });
      opacity.value = withTiming(1, { duration: 300 });
    } else {
      scale.value = 0;
      opacity.value = 0;
    }
  }, [isVisible]);

  const loadData = async () => {
    const collectedTreasures = rewardManager.getCollectedTreasures();
    const userAchievements = rewardManager.getAchievements();
    const userProgress = rewardManager.getProgress();
    
    setTreasures(collectedTreasures);
    setAchievements(userAchievements);
    setProgress(userProgress);
  };

  const modalAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return '#FFD700';
      case 'epic': return '#9932CC';
      case 'rare': return '#4169E1';
      case 'common': return '#32CD32';
      default: return '#FFD700';
    }
  };

  const getRarityCount = (rarity: string) => {
    return treasures.filter(t => t.rarity === rarity).length;
  };

  const renderTreasureItem = (treasure: Treasure, index: number) => {
    const itemScale = useSharedValue(0);
    
    useEffect(() => {
      if (isVisible) {
        itemScale.value = withDelay(index * 100, withSpring(1, { damping: 10, stiffness: 200 }));
      }
    }, [isVisible]);

    const itemAnimatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: itemScale.value }],
    }));

    return (
      <Animated.View key={treasure.id} style={[styles.treasureItem, itemAnimatedStyle]}>
        <View style={[styles.rarityIndicator, { backgroundColor: getRarityColor(treasure.rarity) }]} />
        <Image source={treasure.imageSource} style={styles.treasureImage} resizeMode="contain" />
        <View style={styles.treasureInfo}>
          <Text variant="body" style={styles.treasureName}>{treasure.name}</Text>
          <Text variant="caption" style={styles.treasureValue}>+{treasure.value} pts</Text>
        </View>
      </Animated.View>
    );
  };

  const renderAchievementItem = (achievement: Achievement, index: number) => {
    const itemScale = useSharedValue(0);
    
    useEffect(() => {
      if (isVisible) {
        itemScale.value = withDelay(index * 100, withSpring(1, { damping: 10, stiffness: 200 }));
      }
    }, [isVisible]);

    const itemAnimatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: itemScale.value }],
    }));

    const progressPercentage = (achievement.progress / achievement.maxProgress) * 100;

    return (
      <Animated.View key={achievement.id} style={[styles.achievementItem, itemAnimatedStyle]}>
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
      </Animated.View>
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
          <View style={[styles.rarityDot, { backgroundColor: '#32CD32' }]} />
          <Text variant="body">{t('common')}: {getRarityCount('common')}</Text>
        </View>
        <View style={styles.rarityRow}>
          <View style={[styles.rarityDot, { backgroundColor: '#4169E1' }]} />
          <Text variant="body">{t('rare')}: {getRarityCount('rare')}</Text>
        </View>
        <View style={styles.rarityRow}>
          <View style={[styles.rarityDot, { backgroundColor: '#9932CC' }]} />
          <Text variant="body">{t('epic')}: {getRarityCount('epic')}</Text>
        </View>
        <View style={styles.rarityRow}>
          <View style={[styles.rarityDot, { backgroundColor: '#FFD700' }]} />
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
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'treasures' && styles.activeTab]}
            onPress={() => setActiveTab('treasures')}
          >
            <Text variant="button" style={[styles.tabText, activeTab === 'treasures' && styles.activeTabText]}>
              💎 {t('treasures')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'achievements' && styles.activeTab]}
            onPress={() => setActiveTab('achievements')}
          >
            <Text variant="button" style={[styles.tabText, activeTab === 'achievements' && styles.activeTabText]}>
              🏆 {t('achievements')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'stats' && styles.activeTab]}
            onPress={() => setActiveTab('stats')}
          >
            <Text variant="button" style={[styles.tabText, activeTab === 'stats' && styles.activeTabText]}>
              📊 {t('stats')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {activeTab === 'treasures' && (
            <View style={styles.treasuresGrid}>
              {treasures.length > 0 ? (
                treasures.map(renderTreasureItem)
              ) : (
                <View style={styles.emptyState}>
                  <Text variant="heading3" style={styles.emptyText}>{t('noTreasuresYet')}</Text>
                  <Text variant="body" style={styles.emptySubtext}>{t('completeLessonsToEarn')}</Text>
                </View>
              )}
            </View>
          )}

          {activeTab === 'achievements' && (
            <View style={styles.achievementsList}>
              {achievements.length > 0 ? (
                achievements.map(renderAchievementItem)
              ) : (
                <View style={styles.emptyState}>
                  <Text variant="heading3" style={styles.emptyText}>{t('noAchievementsYet')}</Text>
                  <Text variant="body" style={styles.emptySubtext}>{t('keepLearningToUnlock')}</Text>
                </View>
              )}
            </View>
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
    backgroundColor: '#fff',
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
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 18,
    color: '#666',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#4CAF50',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#4CAF50',
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
    backgroundColor: '#f9f9f9',
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
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  treasureValue: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  achievementsList: {
    gap: 15,
  },
  achievementItem: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
  },
  achievementIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  achievementEmoji: {
    fontSize: 24,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    marginBottom: 5,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
  },
  unlockedBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  unlockedText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsContainer: {
    gap: 20,
  },
  statCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 16,
    color: '#666',
  },
  rarityStats: {
    backgroundColor: '#f9f9f9',
    borderRadius: 15,
    padding: 20,
  },
  rarityTitle: {
    fontSize: 18,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
}); 