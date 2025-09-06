// src/app/(app)/island/index.tsx
import { BackgroundImages, IslandPathImages } from "@/src/constants";
import { useProgress } from "@/src/hooks/useProgress";
import { AppImage } from "@components";
import { colors } from "@theme/colors";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { Adventure } from "@/src/components/Adventure";
import { getIslandTopics, getCurrentTopic } from "@/src/utils/islands";
import { IslandId } from "@/src/types/common";
import { CelebrationOverlay, ParticleShape } from "@components/CelebrationOverlay";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const ADV_HEIGHT = SCREEN_HEIGHT * 0.5;

export default function Island() {
  const { id } = useLocalSearchParams<{ id: IslandId }>();
  const router = useRouter();
  const scrollY = useSharedValue(0);
  const { progress } = useProgress(id);

  const topics = getIslandTopics(id as keyof typeof BackgroundImages["islands"]);
  const lastUnlocked = getCurrentTopic(id, progress.unlockedTopics);

  const listRef = useRef<Animated.FlatList<string>>(null);

  // 🔑 Local state to trigger overlay
  const [showCelebration, setShowCelebration] = useState(false);
  const [newlyUnlocked, setNewlyUnlocked] = useState<string | null>(null);

  // detect when a new topic was unlocked
  useEffect(() => {
    if (!lastUnlocked) return;

    // Only animate if it's the *latest addition* in progress
    if (progress.unlockedTopics.length > 1) {
      const justUnlocked = progress.unlockedTopics[progress.unlockedTopics.length - 1];
      if (justUnlocked === lastUnlocked) {
        setNewlyUnlocked(justUnlocked);
        setShowCelebration(true);
      }
    }

    // scroll near the unlocked topic
    const index = topics.findIndex((t) => t === lastUnlocked);
    if (index !== -1) {
      listRef.current?.scrollToIndex({
        index: Math.max(0, index - 1),
        animated: false,
      });
    }
  }, [lastUnlocked, progress.unlockedTopics, topics]);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Path dimensions
  const pathMiddleHeight = SCREEN_WIDTH * (1536 / 1024);
  const totalActivityHeight = topics.length * ADV_HEIGHT;
  const numPathMiddles = Math.round(totalActivityHeight / pathMiddleHeight);

  const Background = () => {
    const bgStyle = useAnimatedStyle(() => {
      const scale = interpolate(
        scrollY.value,
        [0, SCREEN_HEIGHT],
        [1, 1.8],
        Extrapolate.CLAMP
      );
      return {
        transform: [{ translateY: scrollY.value }, { scale }],
      };
    });

    const pieces = [
      IslandPathImages.start,
      ...Array(numPathMiddles).fill(IslandPathImages.middle),
      IslandPathImages.end,
    ];

    return (
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          { zIndex: 0, bottom: 0 },
          bgStyle,
        ]}
      >
        {pieces.map((img, idx) => (
          <AppImage
            key={idx}
            source={img}
            style={[
              styles.pathImage,
              { position: "absolute", bottom: idx * pathMiddleHeight },
            ]}
          />
        ))}
      </Animated.View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
      {/* Path behind adventures */}
      <Background />

      {/* Foreground adventures */}
      <Animated.FlatList
        ref={listRef}
        data={topics}
        keyExtractor={(topic) => topic}
        inverted
        renderItem={({ item: topic, index }) => {
          const unlocked = progress.unlockedTopics.includes(topic);
          const highlighted = lastUnlocked === topic;

          return (
            <Adventure
              key={topic}
              img={BackgroundImages.islands[id][topic]}
              idx={index}
              scrollY={scrollY}
              side={index % 2 === 0 ? "left" : "right"}
              onPress={() => {
                router.push({
                  pathname: `../island/adventure`,
                  params: { island: id, topic },
                });
              }}
              unlocked={unlocked}
              highlighted={highlighted}
            />
          );
        }}
        getItemLayout={(_, index) => ({
          length: ADV_HEIGHT,
          offset: ADV_HEIGHT * index,
          index,
        })}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      />

      {/* Celebration when a new lesson is unlocked */}
      {showCelebration && (
        <CelebrationOverlay
          shape={"star" as ParticleShape}
          onFinish={() => {
            setShowCelebration(false);
            setNewlyUnlocked(null);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingBottom: 200,
  },
  pathImage: {
    width: SCREEN_WIDTH,
    aspectRatio: 1024 / 1536,
    resizeMode: "cover",
  },
});