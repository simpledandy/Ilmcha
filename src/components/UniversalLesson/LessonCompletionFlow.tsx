import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
} from "react-native-reanimated";
import { Text } from "@components/Text";
import { Button } from "@components/Button";
import { colors } from "@theme/colors";
import { Lesson } from "@constants/lessons/lessonTypes";
import { useTranslation } from "react-i18next";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface LessonCompletionFlowProps {
  lesson: Lesson;
  score: number;
  maxScore: number;
  isVisible: boolean;
  onContinue: () => void;
  onBackToIsland: () => void;
  onNextLesson?: () => void;
  hasNextLesson?: boolean;
  unlockedItems?: Array<{
    type: "lesson" | "island" | "treasure";
    name: string;
    description: string;
  }>;
}

export const LessonCompletionFlow: React.FC<LessonCompletionFlowProps> = ({
  score,
  maxScore,
  isVisible,
  onContinue,
  onBackToIsland,
  onNextLesson,
  hasNextLesson = false,
  unlockedItems = [],
}) => {
  const { t } = useTranslation();
  const [showUnlocks, setShowUnlocks] = useState(false);

  // Animation values
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const confettiOpacity = useSharedValue(0);
  const unlockScale = useSharedValue(0);

  const scorePercentage = Math.round((score / maxScore) * 100);
  const isPerfect = scorePercentage >= 90;
  const isGood = scorePercentage >= 70;

  useEffect(() => {
    if (isVisible) {
      // Start celebration animation
      scale.value = withSequence(
        withTiming(1.1, { duration: 300 }),
        withTiming(1, { duration: 200 }),
      );
      opacity.value = withTiming(1, { duration: 500 });

      // Show confetti
      confettiOpacity.value = withDelay(200, withTiming(1, { duration: 300 }));

      // Show unlocks after celebration
      if (unlockedItems.length > 0) {
        unlockScale.value = withDelay(1000, withTiming(1, { duration: 400 }));
        setShowUnlocks(true);
      }
    } else {
      scale.value = withTiming(0, { duration: 200 });
      opacity.value = withTiming(0, { duration: 200 });
      confettiOpacity.value = withTiming(0, { duration: 200 });
      unlockScale.value = withTiming(0, { duration: 200 });
      setShowUnlocks(false);
    }
  }, [
    isVisible,
    unlockedItems.length,
    scale,
    opacity,
    confettiOpacity,
    unlockScale,
  ]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const confettiStyle = useAnimatedStyle(() => ({
    opacity: confettiOpacity.value,
  }));

  const unlockStyle = useAnimatedStyle(() => ({
    transform: [{ scale: unlockScale.value }],
  }));

  const getScoreMessage = () => {
    if (isPerfect) return t("perfectScore");
    if (isGood) return t("greatWork");
    return t("goodEffort");
  };

  const getScoreColor = () => {
    if (isPerfect) return colors.success[500];
    if (isGood) return colors.primary[500];
    return colors.warning[500];
  };

  return (
    <>
      {isVisible && (
        <View style={styles.overlay}>
          <Animated.View style={[styles.container, containerStyle]}>
            {/* Confetti effect */}
            <Animated.View style={[styles.confetti, confettiStyle]}>
              <Text style={styles.confettiText}>🎉</Text>
              <Text style={[styles.confettiText, styles.confettiText2]}>
                ✨
              </Text>
              <Text style={[styles.confettiText, styles.confettiText3]}>
                🌟
              </Text>
            </Animated.View>

            {/* Main completion content */}
            <View style={styles.content}>
              {/* Success icon */}
              <View
                style={[
                  styles.successIcon,
                  { backgroundColor: getScoreColor() },
                ]}
              >
                <Text style={styles.successText}>✓</Text>
              </View>

              {/* Completion message */}
              <Text variant="heading1" style={styles.completionTitle}>
                {t("lessonComplete")}
              </Text>

              {/* Score display */}
              <View style={styles.scoreContainer}>
                <Text variant="heading2" style={styles.scoreText}>
                  {score} / {maxScore}
                </Text>
                <Text variant="body" style={styles.scorePercentage}>
                  {scorePercentage}%
                </Text>
                <Text
                  variant="body"
                  style={[styles.scoreMessage, { color: getScoreColor() }]}
                >
                  {getScoreMessage()}
                </Text>
              </View>

              {/* Unlocked items */}
              {showUnlocks && unlockedItems.length > 0 && (
                <Animated.View style={[styles.unlockContainer, unlockStyle]}>
                  <Text variant="heading3" style={styles.unlockTitle}>
                    {t("newUnlocks")}
                  </Text>
                  {unlockedItems.map((item, index) => (
                    <View key={index} style={styles.unlockItem}>
                      <Text variant="body" style={styles.unlockName}>
                        {item.name}
                      </Text>
                      <Text variant="caption" style={styles.unlockDescription}>
                        {item.description}
                      </Text>
                    </View>
                  ))}
                </Animated.View>
              )}

              {/* Action buttons */}
              <View style={styles.buttonContainer}>
                {hasNextLesson && onNextLesson ? (
                  <Button
                    variant="primary"
                    size="large"
                    style={styles.nextButton}
                    onPress={onNextLesson}
                  >
                    {t("nextLessonButton")}
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="large"
                    style={styles.continueButton}
                    onPress={onContinue}
                  >
                    {t("backToIslandButton")}
                  </Button>
                )}

                <Button
                  variant="secondary"
                  size="medium"
                  style={styles.backButton}
                  onPress={onBackToIsland}
                >
                  {t("islandMapButton")}
                </Button>
              </View>
            </View>
          </Animated.View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  container: {
    width: SCREEN_WIDTH * 0.9,
    maxWidth: 400,
    backgroundColor: colors.background.primary,
    borderRadius: 25,
    padding: 30,
    alignItems: "center",
    elevation: 10,
    shadowColor: colors.common.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  confetti: {
    position: "absolute",
    top: -20,
    left: -20,
    right: -20,
    bottom: -20,
    justifyContent: "center",
    alignItems: "center",
  },
  confettiText: {
    fontSize: 40,
    position: "absolute",
  },
  confettiText2: {
    top: 20,
    right: 30,
  },
  confettiText3: {
    bottom: 30,
    left: 40,
  },
  content: {
    alignItems: "center",
    width: "100%",
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  successText: {
    fontSize: 40,
    color: colors.common.white,
    fontWeight: "bold",
  },
  completionTitle: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: colors.text.primary,
  },
  scoreContainer: {
    alignItems: "center",
    marginBottom: 25,
  },
  scoreText: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.text.primary,
  },
  scorePercentage: {
    fontSize: 18,
    color: colors.text.secondary,
    marginTop: 5,
  },
  scoreMessage: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 8,
    textAlign: "center",
  },
  unlockContainer: {
    backgroundColor: colors.background.secondary,
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
    width: "100%",
  },
  unlockTitle: {
    textAlign: "center",
    marginBottom: 15,
    color: colors.primary[500],
    fontWeight: "bold",
  },
  unlockItem: {
    marginBottom: 10,
  },
  unlockName: {
    fontWeight: "600",
    color: colors.text.primary,
  },
  unlockDescription: {
    color: colors.text.secondary,
    marginTop: 2,
  },
  buttonContainer: {
    width: "100%",
    gap: 12,
  },
  nextButton: {
    backgroundColor: colors.success[500],
  },
  continueButton: {
    backgroundColor: colors.primary[500],
  },
  backButton: {
    backgroundColor: colors.background.secondary,
  },
});
