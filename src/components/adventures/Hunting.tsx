// components/AdventureHunt.tsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Pressable,
  LayoutRectangle,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
  runOnJS,
  withSequence,
} from 'react-native-reanimated';
import { IconButton } from '../IconButton';
import { AppImage } from '../AppImage';
import { colors as themeColors } from '@theme/colors';

type AssetNumber = number;

/** Single object that appears in the scene */
export interface HuntItem {
  id: string;
  asset: AssetNumber; // require(...) number
  meta?: string; // optional metadata (e.g., 'circle','A','3','red')
  /** optional visual size multiplier (1 = base size) */
  size?: number;
}

/** props for the universal hunt */
export interface HuntingProps {
  items: HuntItem[]; // all objects placed in the scene
  targetIds: string[]; // which item ids are targets to find this round
  /** background image asset (require(...)) */
  background?: AssetNumber;
  /** Number of maximum interactive objects shown (clamped) */
  maxObjectsShown?: number;
  /** layout padding inside play area to avoid edges (px) */
  safePadding?: number;
  onComplete?: () => void;
  /** optional seed for deterministic random placement */
  seed?: number;
}

/** internal layout sizes */
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const DEFAULT_ITEM_SIZE = Math.round(Math.min(SCREEN_WIDTH, SCREEN_HEIGHT) * 0.16);

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

/** simple deterministic PRNG so placements can be repeatable if seed provided */
function seededRand(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/**
 * Generate positions that try to avoid heavy overlaps.
 * Returns positions in format { x, y, size } top-left coordinates relative to container.
 */
function generatePositions(
  count: number,
  size: number,
  padding: number,
  seed?: number
): { x: number; y: number; size: number }[] {
  const playW = SCREEN_WIDTH - padding * 2;
  const playH = SCREEN_HEIGHT * 0.65 - padding * 2; // limit to ~65% of height for UI safety
  const rand = seed !== undefined ? seededRand(seed) : Math.random;
  const positions: { x: number; y: number; size: number }[] = [];

  let attempts = 0;
  while (positions.length < count && attempts < count * 60) {
    attempts += 1;
    const s = size * (0.9 + rand() * 0.4); // small variety in sizes
    const x = padding + rand() * (playW - s);
    const y = padding + rand() * (playH - s);

    // check overlap
    const minDist = Math.min(s, size) * 0.9;
    const collides = positions.some((p) => {
      const dx = p.x - x;
      const dy = p.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      return dist < minDist;
    });

    if (!collides) positions.push({ x, y, size: s });
  }

  // fallback: if not enough positions, fill grid
  if (positions.length < count) {
    positions.length = 0;
    const cols = Math.ceil(Math.sqrt(count));
    const rows = Math.ceil(count / cols);
    const gapX = (playW - size) / Math.max(1, cols - 1);
    const gapY = (playH - size) / Math.max(1, rows - 1);
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols && positions.length < count; c += 1) {
        positions.push({
          x: padding + c * gapX,
          y: padding + r * gapY,
          size,
        });
      }
    }
  }

  return positions.slice(0, count);
}

/**
 * AdventureHunt component
 */
const AnimatedView = Animated.View;

export const Hunting = (props: HuntingProps) => {
  const {
    items,
    targetIds,
    background,
    maxObjectsShown = 8,
    safePadding = 20,
    onComplete,
    seed,
  } = props;

  // pick which items to display (random subset if more than max)
  const shownItems = useMemo(() => {
    const shuffled = [...items];
    if (seed !== undefined) {
      const rand = seededRand(seed);
      shuffled.sort(() => rand() - 0.5);
    } else {
      shuffled.sort(() => Math.random() - 0.5);
    }
    return shuffled.slice(0, clamp(maxObjectsShown, 3, items.length));
  }, [items, maxObjectsShown, seed]);

  // generate positions stable per mount
  const positions = useMemo(
    () =>
      generatePositions(
        shownItems.length,
        DEFAULT_ITEM_SIZE,
        safePadding,
        seed ?? Math.floor(Math.random() * 999999)
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // map id -> pos
  const idToPos = useMemo(() => {
    const map = new Map<string, { x: number; y: number; size: number }>();
    shownItems.forEach((it, idx) => map.set(it.id, positions[idx]));
    return map;
  }, [shownItems, positions]);

  const [foundSet, setFoundSet] = useState<Set<string>>(new Set());
  const [wrongFeedbackId, setWrongFeedbackId] = useState<string | null>(null);
  const [collectionOrder, setCollectionOrder] = useState<string[]>([]);

  // id -> refs for animations
  const scaleMap = useRef<Map<string, Animated.SharedValue<number>>>(new Map());
  const opacityMap = useRef<Map<string, Animated.SharedValue<number>>>(new Map());
  const shakeMap = useRef<Map<string, Animated.SharedValue<number>>>(new Map());
  const hintPulseMap = useRef<Map<string, Animated.SharedValue<number>>>(new Map());

  // initialize shared values
  useEffect(() => {
    shownItems.forEach((it) => {
      if (!scaleMap.current.has(it.id)) scaleMap.current.set(it.id, useSharedValue(1));
      if (!opacityMap.current.has(it.id)) opacityMap.current.set(it.id, useSharedValue(1));
      if (!shakeMap.current.has(it.id)) shakeMap.current.set(it.id, useSharedValue(0));
      if (!hintPulseMap.current.has(it.id)) hintPulseMap.current.set(it.id, useSharedValue(1));
    });
    // cleanup on unmount
    return () => {
      scaleMap.current.clear();
      opacityMap.current.clear();
      shakeMap.current.clear();
      hintPulseMap.current.clear();
    };
    // shownItems is stable (useMemo), safe to ignore exhaustive-deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // track completion: when all targetIds that are shown are found
  useEffect(() => {
    const shownTargets = targetIds.filter((id) => idToPos.has(id));
    const done = shownTargets.every((id) => foundSet.has(id));
    if (done && shownTargets.length > 0) {
      // slight delay for celebration
      const t = setTimeout(() => onComplete?.(), 600);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [foundSet, targetIds, idToPos, onComplete]);

  // helper to mark found with animations
  const markFound = useCallback((id: string) => {
    const scale = scaleMap.current.get(id);
    const opacity = opacityMap.current.get(id);
    const shake = shakeMap.current.get(id);
    if (!scale || !opacity || !shake) return;

    // bounce + scale down + fade
    scale.value = withSequence(
      withSpring(1.25, { damping: 10, stiffness: 200 }),
      withSpring(1, { damping: 12, stiffness: 300 })
    );
    opacity.value = withTiming(0, { duration: 500, easing: Easing.out(Easing.quad) });

    // push to collection visually after fade
    const addAfter = setTimeout(() => {
      runOnJS(setFoundSet)((prev) => {
        const next = new Set(prev);
        next.add(id);
        return next;
      });
      runOnJS(setCollectionOrder)((prev) => [...prev, id]);
      // reset hint pulse so it doesn't continue
      const hint = hintPulseMap.current.get(id);
      if (hint) hint.value = 1;
    }, 240);

    return () => clearTimeout(addAfter);
  }, []);

  // wrong tap animation
  const playWrong = useCallback((id: string) => {
    const shake = shakeMap.current.get(id);
    if (!shake) return;
    // small wiggle using timing
    shake.value = withSequence(
      withTiming(1, { duration: 80 }),
      withTiming(-1, { duration: 80 }),
      withTiming(0, { duration: 80 })
    );
    runOnJS(setWrongFeedbackId)(id);
    // clear marker after short time
    setTimeout(() => {
      runOnJS(setWrongFeedbackId)(null);
    }, 420);
  }, []);

  // after idle, pulse target items
  useEffect(() => {
    const idleMs = 3000;
    let idleTimer: number | undefined;
    const schedule = () => {
      idleTimer = (setTimeout(() => {
        // pulse targets that are not yet found and are shown
        targetIds.forEach((tid) => {
          if (foundSet.has(tid)) return;
          const hint = hintPulseMap.current.get(tid);
          if (!hint) return;
          hint.value = withSequence(
            withTiming(1.15, { duration: 450 }),
            withTiming(1, { duration: 450 })
          );
        });
        schedule();
      }, idleMs) as unknown) as number;
    };
    schedule();
    return () => {
      if (idleTimer) clearTimeout(idleTimer);
    };
  }, [targetIds, foundSet]);

  // handle tap on an item
  const handleTap = useCallback(
    (id: string) => {
      if (foundSet.has(id)) return; // already collected
      const isTarget = targetIds.includes(id);
      if (isTarget) {
        markFound(id);
      } else {
        playWrong(id);
      }
    },
    [foundSet, markFound, playWrong, targetIds]
  );

  // build animated styles for each item during render
  const renderItems = shownItems.map((it) => {
    const pos = idToPos.get(it.id);
    const scale = scaleMap.current.get(it.id) ?? useSharedValue(1);
    const opacity = opacityMap.current.get(it.id) ?? useSharedValue(1);
    const shake = shakeMap.current.get(it.id) ?? useSharedValue(0);
    const hintPulse = hintPulseMap.current.get(it.id) ?? useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
      // shake: small horizontal offset
      const shakeOffset = shake.value * 8;
      // hintPulse scales slightly
      const hintScale = hintPulse.value;
      return {
        transform: [
          { translateX: shakeOffset },
          { scale: hintScale * scale.value },
        ],
        opacity: opacity.value,
      };
    }, []);

    const posStyle = pos
      ? {
          position: 'absolute' as const,
          left: pos.x,
          top: pos.y,
          width: pos.size,
          height: pos.size,
          alignItems: 'center' as const,
          justifyContent: 'center' as const,
      }
      : {};

    const isFound = foundSet.has(it.id);

    return (
      <AnimatedView key={it.id} style={[posStyle, animatedStyle]}>
        {/* using IconButton so your AppImage pipeline is used */}
        <Pressable
          onPress={() => handleTap(it.id)}
          android_ripple={{ color: '#ffffff22' }}
          style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}
        >
          <IconButton
            icon={it.asset}
            // IconButton renders an AppImage inside; we style wrapper to be full-size
            style={[
              styles.itemButton,
              { width: pos?.size ?? DEFAULT_ITEM_SIZE, height: pos?.size ?? DEFAULT_ITEM_SIZE, borderRadius: (pos?.size ?? DEFAULT_ITEM_SIZE) / 2 },
              isFound && styles.hiddenItem,
            ]}
          />
        </Pressable>
      </AnimatedView>
    );
  });

  // collection HUD - visual row of collected items
  const collectionNodes = collectionOrder.map((id) => {
    const item = shownItems.find((s) => s.id === id);
    if (!item) return null;
    return (
      <View key={id} style={styles.collectionSlot}>
        <AppImage source={item.asset} style={styles.collectionIcon} contentFit="contain" />
      </View>
    );
  });

  return (
    <View style={styles.root}>
      {background && (
        <AppImage source={background} style={styles.background} contentFit="cover" />
      )}

      {/* Items layer */}
      <View style={styles.playArea}>{renderItems}</View>

      {/* Collection HUD - bottom row, no text (visual only) */}
      <View style={styles.collectionHud}>
        <View style={styles.collectionRow}>{collectionNodes}</View>
      </View>
    </View>
  );
}

/** Styles */
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: themeColors.common.adventureBg,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
  playArea: {
    flex: 1,
    zIndex: 1,
    // keep padding so items don't touch edges
    paddingTop: Platform.OS === 'android' ? 12 : 24,
  },
  itemButton: {
    // IconButton wraps AppImage; make background neutral so assets look crisp
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hiddenItem: {
    opacity: 0, // we've faded via animation and then hide to avoid hit
  },
  collectionHud: {
    height: Math.round(SCREEN_HEIGHT * 0.14),
    zIndex: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 8,
    backgroundColor: 'transparent',
  },
  collectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 12,
  },
  collectionSlot: {
    width: Math.round(DEFAULT_ITEM_SIZE * 0.72),
    height: Math.round(DEFAULT_ITEM_SIZE * 0.72),
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    elevation: 3,
  },
  collectionIcon: {
    width: '78%',
    height: '78%',
    contentFit: 'contain',
  },
});