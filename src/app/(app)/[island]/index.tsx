import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { BackButton } from "@components/BackButton";
import { IslandPathImages } from "@constants/images/images";
import { lessons as allLessons, LessonData } from "@constants/map/lessonData";
import { useTranslation } from "react-i18next";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const IMAGE_WIDTH = SCREEN_WIDTH;
const IMAGE_HEIGHT = 2532 * (SCREEN_WIDTH / 1170); // Maintain aspect ratio

const ParallaxLessonNode: React.FC<{
  item: LessonData;
  index: number;
  scrollY: Animated.SharedValue<number>;
}> = ({ item, index, scrollY }) => {
  const { t } = useTranslation();
  const animatedStyle = useAnimatedStyle(() => {
    const itemY = index * (SCREEN_HEIGHT / 2.5);
    const inputRange = [itemY - SCREEN_HEIGHT, itemY, itemY + SCREEN_HEIGHT];

    const scale = interpolate(
      scrollY.value,
      inputRange,
      [0.6, 1.2, 0.6],
      Extrapolate.CLAMP,
    );

    const translateY = interpolate(
      scrollY.value,
      inputRange,
      [SCREEN_HEIGHT * 0.2, 0, -SCREEN_HEIGHT * 0.2],
      Extrapolate.CLAMP,
    );

    const side = index % 2 === 0 ? -1 : 1;
    const translateX = interpolate(
      scrollY.value,
      inputRange,
      [
        side * SCREEN_WIDTH * 0.4,
        side * (SCREEN_WIDTH * 0.1),
        side * SCREEN_WIDTH * 0.4,
      ],
      Extrapolate.CLAMP,
    );

    return {
      transform: [{ scale }, { translateY }, { translateX }],
    };
  });

  return (
    <Animated.View style={[styles.lessonNodeContainer, animatedStyle]}>
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/(app)/[island]/lesson/[lesson]",
            params: { island: item.islandId, lesson: item.id },
          })
        }
      >
        <Image source={item.image} style={styles.lessonImage} />
        <Text style={styles.lessonTitle}>{t(item.titleKey)}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const IslandScreen: React.FC = () => {
  const { island } = useLocalSearchParams<{ island: string }>();
  const islandId = island ?? "";
  const lessons = allLessons.filter((l) => l.islandId === islandId).reverse();
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const TOTAL_BACKGROUND_HEIGHT = IMAGE_HEIGHT * 3;
  const TOTAL_SCROLL_HEIGHT = lessons.length * (SCREEN_HEIGHT / 2.5);

  const backgroundStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, TOTAL_SCROLL_HEIGHT],
      [-(TOTAL_BACKGROUND_HEIGHT - SCREEN_HEIGHT), 0],
      Extrapolate.CLAMP,
    );
    return {
      transform: [{ translateY }],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.backgroundImageContainer, backgroundStyle]}>
        <Image source={IslandPathImages.end} style={styles.pathImage} />
        <Image source={IslandPathImages.middle} style={styles.pathImage} />
        <Image source={IslandPathImages.start} style={styles.pathImage} />
      </Animated.View>
      <Animated.FlatList
        inverted
        data={lessons}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <ParallaxLessonNode item={item} index={index} scrollY={scrollY} />
        )}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{
          height: lessons.length * (SCREEN_HEIGHT / 2.5) + SCREEN_HEIGHT * 0.5,
          alignItems: "center",
        }}
        showsVerticalScrollIndicator={false}
      />
      <BackButton
        onPress={() => router.back()}
        size="medium"
        style={styles.backButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6DB5CA",
  },
  backgroundImageContainer: {
    position: "absolute",
    width: IMAGE_WIDTH,
  },
  pathImage: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    resizeMode: "cover",
  },
  lessonNodeContainer: {
    height: SCREEN_HEIGHT / 2.5,
    width: SCREEN_WIDTH,
    justifyContent: "center",
    alignItems: "center",
  },
  lessonImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 6,
    borderColor: "white",
  },
  lessonTitle: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 1,
  },
});

export default IslandScreen;
