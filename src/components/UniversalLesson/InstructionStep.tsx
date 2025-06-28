import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { Text } from "@components/Text";
import { useAudioPlayer } from "@hooks/useAudioPlayer";
import { colors } from "@theme/colors";
import { LessonStep } from "@constants/lessons/lessonTypes";
import { audioMap } from "@constants/audio/audioMap";
import { Button } from "@components/Button";
import { useTranslation } from "react-i18next";

interface InstructionStepProps {
  step: LessonStep;
  onComplete: (success: boolean, score: number, accuracy?: number) => void;
}

function hasAudio(content: unknown): content is { audio?: string } {
  return (
    typeof content === "object" &&
    content !== null &&
    Object.prototype.hasOwnProperty.call(content, "audio") &&
    (typeof (content as { audio?: unknown }).audio === "string" ||
      typeof (content as { audio?: unknown }).audio === "undefined")
  );
}

export const InstructionStep: React.FC<InstructionStepProps> = ({
  step,
  onComplete,
}) => {
  const { t } = useTranslation();
  const { content } = step;
  const [timeRemaining, setTimeRemaining] = useState(step.duration || 3000);

  // Narrow content type for instruction steps
  const isInstructionContent = !("type" in content);

  const audioPlayer = useAudioPlayer(
    isInstructionContent &&
      hasAudio(content) &&
      typeof content.audio === "string"
      ? content.audio
      : undefined,
    { autoPlay: false },
  );

  useEffect(() => {
    // Countdown timer for visual feedback
    const countdownInterval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 100) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 100;
      });
    }, 100);

    return () => {
      clearInterval(countdownInterval);
    };
  }, []);

  const handleNext = () => {
    // Immediately complete the step
    onComplete(true, 10);
  };

  const handleSkip = () => {
    // Immediately complete the step with fewer points
    onComplete(true, 5);
  };

  const progressPercentage =
    (((step.duration || 3000) - timeRemaining) / (step.duration || 3000)) * 100;

  return (
    <View style={styles.instructionContainer}>
      {isInstructionContent && content.text && (
        <Text variant="heading2" style={styles.instructionText}>
          {content.text}
        </Text>
      )}
      {isInstructionContent && content.image && (
        <View style={styles.instructionImage}>
          {/* Image would be rendered here */}
        </View>
      )}

      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[styles.progressFill, { width: `${progressPercentage}%` }]}
          />
        </View>
        <Text variant="caption" style={styles.progressText}>
          {t("instructionProgress", { time: Math.ceil(timeRemaining / 1000) })}
        </Text>
      </View>

      {/* Audio Loading/Playing Indicator */}
      {(audioPlayer.isLoading || audioPlayer.isPlaying) && (
        <View style={styles.audioIndicator}>
          <ActivityIndicator size="small" color={colors.primary[500]} />
        </View>
      )}

      {/* Navigation Buttons - Child-friendly design */}
      <View style={styles.buttonContainer}>
        <Button
          variant="secondary"
          size="large"
          style={styles.skipButton}
          onPress={handleSkip}
        >
          {t("instructionSkip")}
        </Button>

        <Button
          variant="primary"
          size="large"
          style={styles.nextButton}
          onPress={handleNext}
        >
          {t("instructionNext")}
        </Button>
      </View>

      {/* Replay Button - Separate row for audio */}
      {isInstructionContent &&
        hasAudio(content) &&
        typeof content.audio === "string" &&
        content.audio in audioMap.en && (
          <Button
            variant="secondary"
            size="small"
            style={styles.replayButton}
            onPress={() =>
              audioPlayer.play(content.audio as keyof (typeof audioMap)["en"])
            }
            disabled={audioPlayer.isPlaying}
          >
            {t("instructionReplay")}
          </Button>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  instructionContainer: {
    alignItems: "center",
    backgroundColor: colors.background.tertiary,
    padding: 30,
    borderRadius: 20,
    maxWidth: 350,
  },
  instructionText: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  instructionImage: {
    width: 100,
    height: 100,
    backgroundColor: colors.background.secondary,
    borderRadius: 10,
  },
  progressContainer: {
    width: "100%",
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.background.secondary,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary[500],
    borderRadius: 4,
  },
  progressText: {
    textAlign: "center",
    color: colors.text.secondary,
    fontSize: 12,
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: 16,
    marginBottom: 8,
    gap: 15,
  },
  skipButton: {
    flex: 1,
    marginRight: 0,
    backgroundColor: colors.background.secondary,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 25,
    minHeight: 50,
  },
  nextButton: {
    flex: 1,
    marginLeft: 0,
    backgroundColor: colors.primary[500],
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 25,
    minHeight: 50,
  },
  replayButton: {
    alignSelf: "center",
    marginTop: 8,
    backgroundColor: colors.background.secondary,
  },
  audioIndicator: {
    marginTop: 8,
    marginBottom: 4,
    alignItems: "center",
    justifyContent: "center",
  },
});
