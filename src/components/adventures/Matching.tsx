import { AdventureProps } from '@/src/types/common';
import { AppText } from '@components/AppText';
import { colors } from '@theme/colors';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BOX_SIZE = SCREEN_WIDTH * 0.25;
const DROP_ZONE_HEIGHT = BOX_SIZE + 20;

const getRandomDistractor = (exclude: string) => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'
    .split('')
    .filter(l => l !== exclude.toLowerCase());
  return alphabet[Math.floor(Math.random() * alphabet.length)];
};

export const Matching: React.FC<AdventureProps> = ({ islandId, topic, onComplete }) => {
  const upper = topic.toUpperCase();
  const lower = topic.toLowerCase();
  const distractor = getRandomDistractor(topic);
  const targets = [lower, distractor].sort(() => Math.random() - 0.5);

  const [matched, setMatched] = useState(false);

  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const scale = useSharedValue(1);
  const bgScale = useSharedValue(0);
  const cardColor = useSharedValue(colors.common.white);

  const dragging = useSharedValue(false);

  const getTargetPositions = () => {
    const targetSpacing = BOX_SIZE + 32;
    const targetStartX = (SCREEN_WIDTH - (targets.length * targetSpacing - 32)) / 2;
    const targetY = SCREEN_HEIGHT * 0.6;
    return targets.map((_, idx) => ({
      x: targetStartX + idx * targetSpacing,
      y: targetY,
      index: idx,
    }));
  };

  const resetCard = () => {
    x.value = withSpring(0);
    y.value = withSpring(0);
    scale.value = withSpring(1);
    cardColor.value = colors.common.white;
  };

  const shakeAnimation = () => {
    x.value = withSequence(
      withTiming(x.value - 15, { duration: 80 }),
      withTiming(x.value + 15, { duration: 80 }),
      withTiming(x.value - 10, { duration: 60 }),
      withTiming(x.value + 10, { duration: 60 }),
      withSpring(0)
    );
  };

  const correctAnimation = () => {
    scale.value = withSequence(
      withSpring(1.2),
      withSpring(1)
    );
    bgScale.value = withSequence(
      withTiming(1.5, { duration: 300 }),
      withTiming(0, { duration: 300 })
    );
    cardColor.value = colors.common.brightGreen;
  };

  const checkDrop = (dropX: number, dropY: number) => {
    const targetPositions = getTargetPositions();

    for (const target of targetPositions) {
      const targetCenterX = target.x + BOX_SIZE / 2;
      const targetCenterY = target.y + DROP_ZONE_HEIGHT / 2;
      const padding = 80;

      const distanceX = Math.abs(dropX - targetCenterX);
      const distanceY = Math.abs(dropY - targetCenterY);

      if (distanceX < BOX_SIZE / 2 + padding && distanceY < DROP_ZONE_HEIGHT / 2 + padding) {
        if (targets[target.index] === lower) {
          runOnJS(setMatched)(true);
          correctAnimation();
        } else {
          shakeAnimation();
        }
        return;
      }
    }
    resetCard();
  };

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startX = x.value;
      ctx.startY = y.value;
      dragging.value = true;
    },
    onActive: (event, ctx: any) => {
      x.value = ctx.startX + event.translationX;
      y.value = ctx.startY + event.translationY;
    },
    onEnd: (event) => {
      dragging.value = false;
      runOnJS(checkDrop)(event.absoluteX, event.absoluteY);
    },
  });

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value },
      { translateY: y.value },
      { scale: scale.value },
    ],
    backgroundColor: cardColor.value,
    zIndex: dragging.value ? 10 : 1,
  }));

  const animatedBgStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bgScale.value }],
    opacity: bgScale.value > 0 ? 0.4 : 0,
  }));

  if (islandId !== 'letters') {
    return <AppText>Only available for letters</AppText>;
  }

  return (
    <View style={styles.container}>
      {/* Animated burst background */}
      <Animated.View style={[styles.burstCircle, animatedBgStyle]} />

      {/* Draggable card */}
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.draggableCard, animatedCardStyle]}>
          <AppText weight="Bold" style={styles.letter}>{upper}</AppText>
        </Animated.View>
      </PanGestureHandler>

      {/* Target zones */}
      <View style={styles.targetsRow}>
        {targets.map((t) => (
          <View key={t} style={styles.targetCard}>
            <AppText weight="Bold" style={styles.letter}>{t}</AppText>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.common.adventureBg,
  },
  draggableCard: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: colors.common.playfulPurple,
    shadowColor: colors.common.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  letter: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.common.teal,
  },
  targetsRow: {
    flexDirection: 'row',
    marginTop: 60,
    gap: 16,
  },
  targetCard: {
    width: BOX_SIZE + 40,
    height: DROP_ZONE_HEIGHT + 20,
    backgroundColor: colors.common.lightGray,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: colors.common.playfulOrange,
    borderStyle: 'dashed',
  },
  burstCircle: {
    position: 'absolute',
    width: BOX_SIZE * 3,
    height: BOX_SIZE * 3,
    borderRadius: BOX_SIZE * 1.5,
    backgroundColor: colors.common.brightGreen,
  },
});