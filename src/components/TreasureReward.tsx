import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
  withRepeat,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import { Treasure } from '../constants/rewards';
import { playAudio } from '../utils/audio';
import Text from './Text';
import i18n from '@/i18n';

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
  const { t } = i18n;
  const [showContent, setShowContent] = useState(false);
  
  // Animation values
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const rotation = useSharedValue(0);
  const treasureScale = useSharedValue(0);
  const treasureRotation = useSharedValue(0);
  const pointsScale = useSharedValue(0);
  const streakScale = useSharedValue(0);

  useEffect(() => {
    if (isVisible) {
      // Play treasure sound
      playAudio('congrats');
      
      // Start entrance animation
      scale.value = withSpring(1, { damping: 15, stiffness: 150 });
      opacity.value = withTiming(1, { duration: 300 });
      
      // Show content after modal appears
      setTimeout(() => setShowContent(true), 500);
      
      // Animate treasure
      treasureScale.value = withDelay(800, withSpring(1, { damping: 10, stiffness: 200 }));
      treasureRotation.value = withDelay(800, withRepeat(
        withSequence(
          withTiming(10, { duration: 200 }),
          withTiming(-10, { duration: 200 }),
          withTiming(0, { duration: 200 })
        ),
        3,
        true
      ));
      
      // Animate points
      pointsScale.value = withDelay(1200, withSpring(1, { damping: 8, stiffness: 300 }));
      
      // Animate streak
      streakScale.value = withDelay(1400, withSpring(1, { damping: 8, stiffness: 300 }));
      
      // Auto-hide after 4 seconds
      setTimeout(() => {
        handleClose();
      }, 4000);
    } else {
      // Reset animations
      scale.value = 0;
      opacity.value = 0;
      treasureScale.value = 0;
      treasureRotation.value = 0;
      pointsScale.value = 0;
      streakScale.value = 0;
      setShowContent(false);
    }
  }, [isVisible]);

  const handleClose = () => {
    scale.value = withTiming(0, { duration: 200 });
    opacity.value = withTiming(0, { duration: 200 }, () => {
      runOnJS(onClose)();
    });
  };

  const modalAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const treasureAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: treasureScale.value },
      { rotate: `${treasureRotation.value}deg` }
    ],
  }));

  const pointsAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pointsScale.value }],
  }));

  const streakAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: streakScale.value }],
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
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.modal, modalAnimatedStyle]}>
          {/* Background glow effect */}
          <View style={[styles.glowEffect, { backgroundColor: getRarityColor(treasure.rarity) }]} />
          
          {/* Main content */}
          <View style={styles.content}>
            {/* Rarity badge */}
            <View style={[styles.rarityBadge, { backgroundColor: getRarityColor(treasure.rarity) }]}>
              <Text variant="button" style={styles.rarityText}>
                {getRarityText(treasure.rarity)}
              </Text>
            </View>

            {/* Treasure image */}
            <Animated.View style={[styles.treasureContainer, treasureAnimatedStyle]}>
              <Image
                source={treasure.imageSource}
                style={styles.treasureImage}
                resizeMode="contain"
              />
            </Animated.View>

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
            <Animated.View style={[styles.pointsContainer, pointsAnimatedStyle]}>
              <Text variant="heading3" style={styles.pointsLabel}>
                {t('pointsEarned')}
              </Text>
              <Text variant="heading1" style={styles.pointsValue}>
                +{points}
              </Text>
            </Animated.View>

            {/* Streak info */}
            {streak > 1 && (
              <Animated.View style={[styles.streakContainer, streakAnimatedStyle]}>
                <Text variant="body" style={styles.streakText}>
                  🔥 {t('streak')}: {streak} {t('days')}
                </Text>
              </Animated.View>
            )}

            {/* Close button */}
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Text variant="button" style={styles.closeButtonText}>
                {t('awesome')}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: SCREEN_WIDTH * 0.85,
    maxHeight: SCREEN_HEIGHT * 0.8,
    backgroundColor: '#fff',
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
    color: '#fff',
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  treasureDescription: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    lineHeight: 22,
  },
  pointsContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  pointsLabel: {
    fontSize: 18,
    color: '#666',
    marginBottom: 5,
  },
  pointsValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  streakContainer: {
    marginBottom: 20,
  },
  streakText: {
    fontSize: 16,
    color: '#FF6B35',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 