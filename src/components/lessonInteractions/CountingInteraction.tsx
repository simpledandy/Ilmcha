import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { CountingExercise } from "@constants/lessons/lessonTypes";
import { Text } from "@components/Text";
import { useAudioPlayer } from "@hooks/useAudioPlayer";
import { colors } from "@theme/colors";
import { Button } from "@components/Button";
import { useTranslation } from "react-i18next";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface CountingInteractionProps {
  exercise: CountingExercise;
  onComplete: (success: boolean, score: number, accuracy: number) => void;
}

export const CountingInteraction: React.FC<CountingInteractionProps> = ({
  exercise,
  onComplete,
}) => {
  const { t } = useTranslation();
  const [selectedCount, setSelectedCount] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const audioPlayer = useAudioPlayer(exercise.audioFile, { autoPlay: true });

  const handleCountSelect = (count: number) => {
    setSelectedCount(count);
    setIsCorrect(count === exercise.targetNumber);
    setShowResult(true);
    setAttempts((prev) => prev + 1);

    // Play success or error sound
    if (count === exercise.targetNumber) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
      void audioPlayer.play("congratsYouWon");
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
      void audioPlayer.play("unavailable");
    }

    // Auto-advance after showing result
    setTimeout(() => {
      const score = count === exercise.targetNumber ? 10 : 1;
      onComplete(count === exercise.targetNumber, score, 0);
    }, 2000);
  };

  const handleReset = () => {
    setSelectedCount(null);
    setIsCorrect(null);
    setShowResult(false);
    setAttempts((prev) => prev + 1);
  };

  return (
    <View style={styles.container}>
      {/* Child-friendly header */}
      <View style={styles.header}>
        <Text
          variant="funHeading"
          weight="proportionalBold"
          style={styles.questionText}
        >
          🐟 {t("howManyFish")}
        </Text>
        <Text variant="body" style={styles.targetText}>
          {t("countToNumber", { number: exercise.targetNumber })}
        </Text>
      </View>

      {/* Fish display area */}
      <View style={styles.fishContainer}>
        {exercise.items.map((item, _index) => (
          <View key={item.id} style={styles.fishItem}>
            <Text variant="display" style={styles.fishEmoji}>
              🐟
            </Text>
          </View>
        ))}
      </View>

      {/* Number selection buttons - Child-friendly design */}
      <View style={styles.numberContainer}>
        <Text
          variant="body"
          weight="proportionalMedium"
          style={styles.selectText}
        >
          {t("selectCorrectNumber")}
        </Text>
        <View style={styles.numberGrid}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((number) => (
            <TouchableOpacity
              key={number}
              style={[
                styles.numberButton,
                selectedCount === number && styles.selectedNumber,
                selectedCount === number && isCorrect && styles.correctNumber,
                selectedCount === number &&
                  !isCorrect &&
                  styles.incorrectNumber,
              ]}
              onPress={() => handleCountSelect(number)}
              disabled={showResult}
            >
              <Text
                variant="display"
                weight="proportionalBold"
                style={[
                  styles.numberText,
                  selectedCount === number && styles.selectedNumberText,
                ]}
              >
                {number}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Result display */}
      {showResult && (
        <View style={styles.resultContainer}>
          <Text
            variant="funHeading"
            weight="proportionalBold"
            style={[
              styles.resultText,
              isCorrect ? styles.correctText : styles.incorrectText,
            ]}
          >
            {isCorrect ? t("correct") : t("tryAgain")}
          </Text>
          <Text variant="body" style={styles.resultSubtext}>
            {isCorrect
              ? t("countedFishPerfectly", { number: exercise.targetNumber })
              : t("selectedButThereAre", {
                  selected: selectedCount,
                  target: exercise.targetNumber,
                })}
          </Text>
        </View>
      )}

      {/* Action buttons */}
      <View style={styles.buttonContainer}>
        <Button
          variant="secondary"
          onPress={handleReset}
          style={styles.resetButton}
          disabled={!showResult}
        >
          {t("tryAgainButton")}
        </Button>
      </View>

      {/* Progress indicator */}
      <View style={styles.progressContainer}>
        <Text variant="caption" style={styles.progressText}>
          {t("attempts", { count: attempts + 1 })}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: colors.background.primary,
  },
  header: {
    alignItems: "center",
    backgroundColor: colors.background.tertiary,
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    width: "100%",
  },
  questionText: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 10,
    color: colors.text.primary,
  },
  targetText: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  fishContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
    maxWidth: SCREEN_WIDTH * 0.9,
    marginBottom: 20,
  },
  fishItem: {
    width: 70,
    height: 70,
    backgroundColor: colors.background.secondary,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: colors.border.primary,
    position: "relative",
  },
  fishEmoji: {
    fontSize: 48,
    color: colors.primary[500],
  },
  numberContainer: {
    alignItems: "center",
    backgroundColor: colors.background.tertiary,
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    minWidth: 120,
  },
  selectText: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 10,
  },
  numberGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
    maxWidth: SCREEN_WIDTH * 0.9,
  },
  numberButton: {
    width: 70,
    height: 70,
    backgroundColor: colors.background.secondary,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: colors.border.primary,
    position: "relative",
  },
  selectedNumber: {
    borderColor: colors.success[500],
    backgroundColor: colors.success[100],
  },
  correctNumber: {
    borderColor: colors.success[500],
    backgroundColor: colors.success[100],
  },
  incorrectNumber: {
    borderColor: colors.error[500],
    backgroundColor: colors.error[50],
  },
  numberText: {
    fontSize: 48,
    color: colors.primary[500],
  },
  selectedNumberText: {
    color: colors.success[500],
  },
  resultContainer: {
    alignItems: "center",
    backgroundColor: colors.background.tertiary,
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
  },
  resultText: {
    fontSize: 24,
    color: colors.text.primary,
    marginBottom: 10,
  },
  resultSubtext: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
    marginBottom: 15,
    justifyContent: "center",
    width: "100%",
  },
  resetButton: {
    backgroundColor: colors.warning[500],
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 25,
    minWidth: 100,
    alignItems: "center",
    flex: 1,
    maxWidth: 120,
  },
  correctText: {
    color: colors.success[500],
  },
  incorrectText: {
    color: colors.error[500],
  },
  progressContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  progressText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
});
