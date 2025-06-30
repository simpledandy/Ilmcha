import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { lessons } from "@constants/map/lessonData";
import { BackButton } from "@components/BackButton";
import { useTranslation } from "react-i18next";

const LessonScreen: React.FC = () => {
  const { island, lesson } = useLocalSearchParams<{
    island: string;
    lesson: string;
  }>();
  const { t } = useTranslation();
  const lessonData = lessons.find(
    (l) => l.id === lesson && l.islandId === island,
  );

  if (!lessonData) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Lesson not found</Text>
        <BackButton
          onPress={() => router.back()}
          size="medium"
          style={styles.backButton}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={lessonData.image} style={styles.lessonImage} />
      <Text style={styles.title}>{t(lessonData.titleKey)}</Text>
      <Text style={styles.description}>{t(lessonData.descriptionKey)}</Text>
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
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f8ff",
    padding: 24,
  },
  lessonImage: {
    width: 200,
    height: 200,
    marginBottom: 24,
    borderRadius: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  description: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 32,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  error: {
    color: "red",
    fontSize: 18,
    marginBottom: 16,
  },
});

export default LessonScreen;
