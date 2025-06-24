import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { runOnJS, withTiming } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Treasure } from '@constants/rewards/rewards';
import { Text } from './Text';
import { useTranslation } from 'react-i18next';
import { TreasureRewardModal } from './TreasureReward/TreasureRewardModal';
import { TreasureImageDisplay } from './TreasureReward/TreasureImageDisplay';
import { RarityBadge } from './TreasureReward/RarityBadge';
import { PointsEarnedDisplay } from './TreasureReward/PointsEarnedDisplay';
import { StreakInfo } from './TreasureReward/StreakInfo';
import { RewardCloseButton } from './TreasureReward/RewardCloseButton';
import { useAnimatedModal } from '@hooks/useAnimatedModal';
import { useRewardAnimation } from '@hooks/useRewardAnimation';
import { useAudioPlayer } from '@hooks/useAudioPlayer';
import { colors } from '@theme/colors';
import { textStyles } from '@theme/typography';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface TreasureRewardProps {
  treasure: Treasure;
  points: number;
  streak: number;
  isVisible: boolean;
  onClose: () => void;
}

export const TreasureReward: React.FC<TreasureRewardProps> = ({
  treasure,
  points,
  streak,
  isVisible,
  onClose,
}) => {
  const { t } = useTranslation();
  // Modal animation
  const { modalAnimatedStyle, scale, opacity } = useAnimatedModal(isVisible);
  // Reward animation
  const {
    showContent,
    treasureAnimatedStyle,
    pointsAnimatedStyle,
    streakAnimatedStyle,
  } = useRewardAnimation(isVisible, 4000, handleClose);
  // Audio
  useAudioPlayer(isVisible ? 'congrats' : undefined, isVisible);

  function handleClose() {
    scale.value = withTiming(0, { duration: 200 });
    opacity.value = withTiming(0, { duration: 200 }, () => {
      runOnJS(onClose)();
    });
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return colors.rarity.gold;
      case 'epic': return colors.rarity.purple;
      case 'rare': return colors.rarity.blue;
      case 'common': return colors.rarity.green;
      default: return colors.rarity.gold;
    }
  };

  const getRarityText = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'LEGENDARY!';
      case 'epic': return 'EPIC!';
      case 'rare': return 'RARE!';
      case 'common': return 'TREASURE!';
      default: return 'TREASURE!';
    }
  };

  return (
    <TreasureRewardModal
      isVisible={isVisible}
      modalAnimatedStyle={modalAnimatedStyle}
      onRequestClose={handleClose}
    >
      {/* Background glow effect */}
      <View style={[styles.glowEffect, { backgroundColor: getRarityColor(treasure.rarity) }]} />

      {/* Rarity badge */}
      <RarityBadge
        rarity={treasure.rarity}
        color={getRarityColor(treasure.rarity)}
        text={getRarityText(treasure.rarity)}
      />

      {/* Treasure image */}
      <TreasureImageDisplay
        imageSource={treasure.imageSource}
        animatedStyle={treasureAnimatedStyle}
      />

      {/* Treasure info */}
      <View style={styles.treasureInfo}>
        <Text variant="heading2" style={styles.treasureName}>
          {treasure.name}
        </Text>
        <Text variant="body" style={styles.treasureDescription}>
          {treasure.description}
        </Text>
      </View>

      {/* Points earned */}
      <PointsEarnedDisplay
        points={points}
        animatedStyle={pointsAnimatedStyle}
        label={t('pointsEarned')}
      />

      {/* Streak info */}
      {streak > 1 && (
        <StreakInfo
          streak={streak}
          animatedStyle={streakAnimatedStyle}
          label={t('streak')}
          daysLabel={t('days')}
        />
      )}

      {/* Close button */}
      <RewardCloseButton onPress={handleClose} label={t('awesome')} />
    </TreasureRewardModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: SCREEN_WIDTH * 0.85,
    maxHeight: SCREEN_HEIGHT * 0.8,
    backgroundColor: colors.common.white,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    position: 'relative',
  },
  glowEffect: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: 30,
    opacity: 0.3,
    zIndex: -1,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  rarityBadge: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  rarityText: {
    color: colors.common.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  treasureContainer: {
    marginBottom: 20,
  },
  treasureImage: {
    width: 120,
    height: 120,
  },
  treasureInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  treasureName: {
    fontSize: textStyles.heading2.fontSize,
    fontWeight: textStyles.heading2.fontWeight,
    marginBottom: 8,
    textAlign: 'center',
  },
  treasureDescription: {
    fontSize: textStyles.body.fontSize,
    textAlign: 'center',
    color: colors.text.secondary,
    lineHeight: 22,
  },
  pointsContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  pointsLabel: {
    fontSize: textStyles.body.fontSize,
    color: colors.text.secondary,
    marginBottom: 5,
  },
  pointsValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.rarity.gold,
  },
  streakContainer: {
    marginBottom: 20,
  },
  streakText: {
    fontSize: textStyles.body.fontSize,
    color: colors.warning[500],
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: colors.success[500],
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 10,
  },
  closeButtonText: {
    color: colors.common.white,
    fontSize: textStyles.button.fontSize,
    fontWeight: textStyles.button.fontWeight,
  },
}); 