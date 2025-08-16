import React, { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { View, StyleSheet, TouchableOpacity } from "react-native";

import i18n from '@i18n';
import { AppText } from '@components/AppText';
import { AppImage } from '@components/AppImage';
import { useAudioPlayer } from "@hooks/useAudioPlayer";
import { tales } from "@constants/tales";
import { AudioControl } from "@components/AudioControl";
import { audioMap } from "@constants/audio/audioMap";
import { useFocusEffect } from '@react-navigation/native';

export default function TaleScreen() {
  const { tale } = useLocalSearchParams<{ tale: string }>();
  const story = tales.find((t) => t.id === tale);
  // Move hooks to top level
  const [currentChunk, setCurrentChunk] = useState(0);
  // Use stable references from useAudioPlayer
  const { play, stop, pause, resume, isPlaying, isPaused, isLoading, durationMillis, positionMillis } = useAudioPlayer();
  useFocusEffect(
    React.useCallback(() => {
      if (story?.audio) play(story.audio, true);
      return () => {
        stop();
      };
    }, [play, stop, story?.audio])
  );
  // Type-safe language access
  const lang = story && (i18n.language in story.title) ? i18n.language as keyof typeof story.title : 'en';

  if (!story) {
    return (
      <View style={styles.center}>
        <AppText variant="body" style={styles.error}>
          {i18n.t("taleNotFound", { defaultValue: "Tale not found" })}
        </AppText>
      </View>
    );
  }

  const title = i18n.t(`tales.${story.id}.title`, { defaultValue: story.title[lang] || story.title.en });
  const text = i18n.t(`tales.${story.id}.text`, { defaultValue: story.text[lang] || story.text.en });
  // Split the text into chunks (sentences or paragraphs)
  const chunks = text.split(/\n+|(?<=[.!?])\s+/).filter(Boolean);

  return (
    <View style={styles.container}>
      <AppImage source={story.image} style={styles.image} contentFit="contain" />
      <AppText variant="heading2" style={styles.title}>{title}</AppText>
      {/* Audio Controls for current chunk (future: per-chunk audio) */}
      <View style={styles.audioControls}>
        <AudioControl
          variant={isPlaying ? "pause" : "play"}
          size="small"
          style={styles.audioButton}
          onPress={() => {
            if (isPlaying) {
              void pause();
            } else if (isPaused) {
              void resume();
            } else {
              void play(story.audio);
            }
          }}
          disabled={isLoading}
          loading={isLoading}
        />
        {/* Progress Bar */}
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: durationMillis > 0 ? `${(positionMillis / durationMillis) * 100}%` : '0%' }]} />
        </View>
        <AppText style={styles.progressText}>
          {Math.floor(positionMillis / 1000)}s / {Math.floor(durationMillis / 1000)}s
        </AppText>
      </View>
      <AppText variant="body" style={styles.text}>
        {chunks[currentChunk]}
      </AppText>
      <View style={{ flexDirection: 'row', marginTop: 24 }}>
        <TouchableOpacity
          style={[styles.navButton, { opacity: currentChunk === 0 ? 0.5 : 1 }]}
          disabled={currentChunk === 0}
          onPress={() => setCurrentChunk((c) => Math.max(0, c - 1))}
        >
          <AppText style={styles.navButtonText}>{i18n.t('previousArrow', { defaultValue: '←' })}</AppText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navButton, { opacity: currentChunk === chunks.length - 1 ? 0.5 : 1 }]}
          disabled={currentChunk === chunks.length - 1}
          onPress={() => setCurrentChunk((c) => Math.min(chunks.length - 1, c + 1))}
        >
          <AppText style={styles.navButtonText}>{i18n.t('nextArrow', { defaultValue: '→' })}</AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

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
  audioButton: {
    marginHorizontal: 8,
    minWidth: 80,
  },
  navButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#00c853',
    borderRadius: 8,
    marginHorizontal: 10,
  },
  navButtonText: {
    color: '#fff',
    fontSize: 20,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    marginBottom: 5,
    width: '80%',
    alignSelf: 'center',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
});
