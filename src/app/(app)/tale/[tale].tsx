import React from "react";
import { useLocalSearchParams } from "expo-router";
import { View, StyleSheet, ScrollView, Image } from "react-native";

import { i18n } from "i18n";
import { Text } from "@components/Text";
import { useAudioPlayer } from "@/src/hooks/useAudioPlayer";
import { tales } from "@/src/constants/tales/tales";
import { Button } from "@components/Button";

export const TaleScreen: React.FC = () => {
  const { tale } = useLocalSearchParams<{ tale: string }>();
  const story = tales.find((t) => t.id === tale);

  // Play story audio on mount
  const audioPlayer = useAudioPlayer(story?.audio, {
    autoPlay: !!story?.audio,
  });

  if (!story) {
    return (
      <View style={styles.center}>
        <Text variant="body" style={styles.error}>
          {i18n.t("taleNotFound", { defaultValue: "Tale not found" })}
        </Text>
      </View>
    );
  }

  const title = i18n.language === "uz" ? story.title.uz : story.title.en;
  const text = i18n.language === "uz" ? story.text.uz : story.text.en;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={story.image} style={styles.image} resizeMode="contain" />
      {/* Audio Controls and Progress */}
      {story.audio && (
        <View style={styles.audioControls}>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: audioPlayer.durationMillis
                      ? `${(audioPlayer.positionMillis / audioPlayer.durationMillis) * 100}%`
                      : "0%",
                  },
                ]}
              />
            </View>
            <Text style={styles.timer}>
              {formatMillis(audioPlayer.positionMillis)} /{" "}
              {formatMillis(audioPlayer.durationMillis)}
            </Text>
          </View>
          <View style={styles.buttonRow}>
            {audioPlayer.isPaused || !audioPlayer.isPlaying ? (
              <Button
                variant="primary"
                size="small"
                style={styles.audioButton}
                onPress={audioPlayer.resume}
                disabled={audioPlayer.isLoading}
              >
                {"▶️ " + i18n.t("play", { defaultValue: "Play" })}
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="small"
                style={styles.audioButton}
                onPress={audioPlayer.pause}
                disabled={audioPlayer.isLoading}
              >
                {"⏸️ " + i18n.t("pause", { defaultValue: "Pause" })}
              </Button>
            )}
          </View>
        </View>
      )}
      <Text variant="heading1" style={styles.title}>
        {title}
      </Text>
      <Text variant="body" style={styles.text}>
        {text}
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fffaf5",
    alignItems: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    fontSize: 18,
    color: "red",
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    color: "#3b3b3b",
    marginBottom: 10,
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: "#444",
    textAlign: "justify",
  },
  audioControls: {
    width: "100%",
    alignItems: "center",
    marginBottom: 16,
  },
  progressBarContainer: {
    width: "90%",
    alignItems: "center",
    marginBottom: 8,
  },
  progressBarBg: {
    width: "100%",
    height: 8,
    backgroundColor: "#eee",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 4,
  },
  progressBarFill: {
    height: 8,
    backgroundColor: "#00c853",
    borderRadius: 4,
  },
  timer: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },
  audioButton: {
    marginHorizontal: 8,
    minWidth: 80,
  },
});

// Helper to format ms to mm:ss
function formatMillis(ms: number) {
  if (!ms || isNaN(ms)) return "0:00";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default TaleScreen;
