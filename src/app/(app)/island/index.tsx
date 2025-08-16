// src/app/(app)/island/index.tsx
import { BackgroundImages, IslandPathImages } from "@/src/constants";
import { useProgress } from "@/src/hooks/useProgress";
import { AppImage } from "@components";
import { colors } from "@theme/colors";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const ADV_HEIGHT = SCREEN_HEIGHT * 0.5;

export default function Island() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const scrollY = useSharedValue(0);
  const { progress } = useProgress(id);

  const topics = getIslandTopics(id as keyof typeof BackgroundImages['islands']);
  const lastUnlocked = getCurrentTopic(id, progress.unlockedTopics);

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
        transform: [
          { translateY: scrollY.value }, // 👈 move with list
          { scale },
        ],
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
          StyleSheet.absoluteFill,   // full screen box
          { zIndex: 0, bottom: 0 },  // anchor to bottom edge
          bgStyle,
        ]}
      >
        {pieces.map((img, idx) => (
          <AppImage
            key={idx}
            source={img}
            style={[
              styles.pathImage,
              { position: "absolute", bottom: idx * pathMiddleHeight }, // 👈 stack upward from bottom
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
        data={topics}
        keyExtractor={(topic) => topic}
        inverted
        renderItem={({ item: topic, index }) => {
          const unlocked = progress.unlockedTopics.includes(topic) || index === 0;
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
