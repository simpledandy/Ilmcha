import React, { useState, useEffect, useRef } from "react";
import { View, Dimensions, StyleSheet, Vibration } from "react-native";
import Svg, { Path, Circle, Text as SvgText } from "react-native-svg";
import { PanResponder } from "react-native";
import { colors } from "@theme/colors";
import { Button } from "@components/Button";
import { Text } from "@components/Text";
import { useTranslation } from "react-i18next";
import { TracingExercise } from "@constants/lessons/lessonTypes";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface TracingLessonProps {
  exercise: TracingExercise;
  onComplete?: (
    accuracy: number[],
    attempts: number[],
    timeSpent: number,
  ) => void;
}

function getPointsFromPath(path: string): [number, number][] {
  const points: [number, number][] = [];
  const regex = /M\s*([\d.-]+),([\d.-]+)/g;
  let match;
  while ((match = regex.exec(path))) {
    points.push([parseFloat(match[1]), parseFloat(match[2])]);
  }
  return points;
}

function distance(p1: [number, number], p2: [number, number]) {
  return Math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2);
}

function averageMinDistance(
  userPoints: [number, number][],
  guidePoints: [number, number][],
) {
  if (userPoints.length === 0 || guidePoints.length === 0) return 9999;
  let total = 0;
  for (const up of userPoints) {
    let minDist = Infinity;
    for (const gp of guidePoints) {
      const d = distance(up, gp);
      if (d < minDist) minDist = d;
    }
    total += minDist;
  }
  return total / userPoints.length;
}

export function TracingLesson({ exercise, onComplete }: TracingLessonProps) {
  const { t } = useTranslation();

  // State management
  const [currentStrokeIdx, setCurrentStrokeIdx] = useState(0);
  const [userStrokes, setUserStrokes] = useState<string[]>([]);
  const [currentStroke, setCurrentStroke] = useState("");
  const [completedStrokes, setCompletedStrokes] = useState<boolean[]>([]);
  const [strokeAttempts, setStrokeAttempts] = useState<number[]>([]);
  const [strokeAccuracy, setStrokeAccuracy] = useState<number[]>([]);
  const [allCompleted, setAllCompleted] = useState(false);
  const [lastFailedStroke, setLastFailedStroke] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [hintShown, setHintShown] = useState(false);

  // Get segments for the current exercise
  const segments = React.useMemo(() => {
    if (exercise.segments && exercise.segments.length > 0) {
      return exercise.segments;
    }
    // Fallback to old format if needed
    return [];
  }, [exercise.segments]);

  // Initialize state arrays
  useEffect(() => {
    if (segments.length > 0) {
      setUserStrokes(Array(segments.length).fill(""));
      setCompletedStrokes(Array(segments.length).fill(false));
      setStrokeAttempts(Array(segments.length).fill(0));
      setStrokeAccuracy(Array(segments.length).fill(0));
    }
  }, [segments]);

  // Audio feedback
  function playStrokeHint(strokeIndex: number) {
    if (exercise.enableAudioGuidance && segments[strokeIndex]?.audioHint) {
      try {
        // Audio functionality can be implemented here
        console.log("Playing audio hint:", segments[strokeIndex].audioHint);
      } catch {
        console.log(
          "Audio hint not available:",
          segments[strokeIndex].audioHint,
        );
      }
    }
  }

  function playSuccessSound() {
    if (exercise.enableAudioGuidance) {
      try {
        // Audio functionality can be implemented here
        console.log("Playing success sound");
      } catch {
        console.log("Success audio not available");
      }
    }
  }

  function playErrorSound() {
    if (exercise.enableAudioGuidance) {
      try {
        // Audio functionality can be implemented here
        console.log("Playing error sound");
      } catch {
        console.log("Error audio not available");
      }
    }
  }

  // Haptic feedback
  const triggerHapticFeedback = (type: "success" | "error" | "hint") => {
    if (exercise.enableHapticFeedback) {
      switch (type) {
        case "success":
          Vibration.vibrate(100);
          break;
        case "error":
          Vibration.vibrate([0, 50, 100, 50]);
          break;
        case "hint":
          Vibration.vibrate(50);
          break;
      }
    }
  };

  // Adaptive difficulty
  const getAdaptiveThreshold = (baseThreshold: number, strokeIndex: number) => {
    const performanceFactor = strokeAccuracy[strokeIndex] || 0.5;
    const attemptFactor = Math.max(
      0.5,
      1 - (strokeAttempts[strokeIndex] || 0) * 0.1,
    );
    return baseThreshold * (1 + (1 - performanceFactor) * 0.5) * attemptFactor;
  };

  // Child-friendly scaling
  const svgHeight = screenHeight * 0.7;
  const viewBoxSize = exercise.accessibility?.largeTargets ? 400 : 300;
  const scale =
    Math.min(screenWidth / viewBoxSize, svgHeight / viewBoxSize) * 1.2;
  const pathWidth = viewBoxSize * scale;
  const pathHeight = viewBoxSize * scale;
  const translateX = (screenWidth - pathWidth) / 2;
  const translateY = (svgHeight - pathHeight) / 2 + 50;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        if (allCompleted || completedStrokes[currentStrokeIdx]) return;

        const { locationX, locationY } = evt.nativeEvent;
        const adjustedX = (locationX - translateX) / scale;
        const adjustedY = (locationY - translateY) / scale;
        setCurrentStroke(`M${adjustedX},${adjustedY}`);

        // Play stroke hint on first touch
        if (!hintShown && exercise.enableAudioGuidance) {
          playStrokeHint(currentStrokeIdx);
          setHintShown(true);
        }
      },
      onPanResponderMove: (evt) => {
        if (allCompleted || completedStrokes[currentStrokeIdx]) return;

        const { locationX, locationY } = evt.nativeEvent;
        const adjustedX = (locationX - translateX) / scale;
        const adjustedY = (locationY - translateY) / scale;
        setCurrentStroke((prev) => `${prev} L${adjustedX},${adjustedY}`);
      },
      onPanResponderRelease: () => {
        if (allCompleted || completedStrokes[currentStrokeIdx]) return;

        const userPoints = getPointsFromPath(currentStroke);
        const guidePoints = getPointsFromPath(
          segments[currentStrokeIdx]?.path || "",
        );
        const avgDist = averageMinDistance(userPoints, guidePoints);

        // Adaptive threshold based on difficulty and performance
        const baseThreshold = exercise.practiceMode === "guided" ? 20 : 30;
        const threshold = getAdaptiveThreshold(baseThreshold, currentStrokeIdx);

        setStrokeAttempts((prev) => {
          const arr = [...prev];
          arr[currentStrokeIdx]++;
          return arr;
        });
        setTotalAttempts((prev) => prev + 1);

        if (userPoints.length > 3 && avgDist < threshold) {
          // Success!
          const accuracy = Math.max(0, 1 - avgDist / threshold);

          setUserStrokes((prev) => {
            const arr = [...prev];
            arr[currentStrokeIdx] = currentStroke;
            return arr;
          });
          setCompletedStrokes((prev) => {
            const arr = [...prev];
            arr[currentStrokeIdx] = true;
            return arr;
          });
          setStrokeAccuracy((prev) => {
            const arr = [...prev];
            arr[currentStrokeIdx] = accuracy;
            return arr;
          });

          setCurrentStroke("");
          setLastFailedStroke(null);
          setHintShown(false);

          // Audio and haptic feedback
          triggerHapticFeedback("success");
          playSuccessSound();

          // Move to next stroke or finish
          if (currentStrokeIdx < segments.length - 1) {
            setTimeout(() => {
              setCurrentStrokeIdx((idx) => idx + 1);
              // Play next stroke hint
              if (exercise.enableAudioGuidance) {
                playStrokeHint(currentStrokeIdx + 1);
              }
            }, 700);
          } else {
            setAllCompleted(true);
            const timeSpent = (Date.now() - startTime) / 1000;
            if (onComplete) {
              setTimeout(() => {
                onComplete(strokeAccuracy, strokeAttempts, timeSpent);
              }, 900);
            }
          }
        } else {
          // Not accurate enough
          setLastFailedStroke(currentStroke);
          setCurrentStroke("");
          setHintShown(false);

          // Audio and haptic feedback
          triggerHapticFeedback("error");
          playErrorSound();

          // Show hint after multiple failures
          if (strokeAttempts[currentStrokeIdx] >= 2 && !hintShown) {
            setHintShown(true);
            triggerHapticFeedback("hint");
            playStrokeHint(currentStrokeIdx);
          }
        }
      },
      onPanResponderTerminate: () => {
        setCurrentStroke("");
      },
    }),
  ).current;

  const resetTracing = () => {
    setUserStrokes(Array(segments.length).fill(""));
    setCurrentStroke("");
    setCompletedStrokes(Array(segments.length).fill(false));
    setStrokeAttempts(Array(segments.length).fill(0));
    setStrokeAccuracy(Array(segments.length).fill(0));
    setCurrentStrokeIdx(0);
    setAllCompleted(false);
    setLastFailedStroke(null);
    setHintShown(false);
    setStartTime(Date.now());
    setTotalAttempts(0);
  };

  const showHint = () => {
    setHintShown(true);
    triggerHapticFeedback("hint");
    playStrokeHint(currentStrokeIdx);
  };

  const skipStroke = () => {
    if (currentStrokeIdx < segments.length - 1) {
      setCurrentStrokeIdx(currentStrokeIdx + 1);
      setHintShown(false);
    }
  };

  // Render stroke order numbers
  const renderStrokeOrderNumbers = () => {
    if (!exercise.showStrokeOrder) return null;

    return segments.map((segment, index) => (
      <SvgText
        key={`order-${index}`}
        x={segment.pointer[0]}
        y={segment.pointer[1] - 10}
        fontSize="16"
        fill={colors.primary[500]}
        textAnchor="middle"
        fontWeight="bold"
      >
        {segment.strokeOrder}
      </SvgText>
    ));
  };

  // Render direction arrows
  const renderDirectionArrows = () => {
    if (!exercise.showStrokeDirection) return null;

    return segments.map((segment, index) => {
      if (!segment.direction) return null;

      const [x, y] = segment.pointer;
      let arrowPath = "";

      switch (segment.direction) {
        case "up":
          arrowPath = `M${x},${y + 10} L${x - 5},${y + 5} L${x + 5},${y + 5} Z`;
          break;
        case "down":
          arrowPath = `M${x},${y - 10} L${x - 5},${y - 5} L${x + 5},${y - 5} Z`;
          break;
        case "left":
          arrowPath = `M${x + 10},${y} L${x + 5},${y - 5} L${x + 5},${y + 5} Z`;
          break;
        case "right":
          arrowPath = `M${x - 10},${y} L${x - 5},${y - 5} L${x - 5},${y + 5} Z`;
          break;
      }

      return (
        <Path
          key={`arrow-${index}`}
          d={arrowPath}
          fill={colors.warning[500]}
          opacity={0.7}
        />
      );
    });
  };

  // Render dotted guides
  const renderDottedGuides = () => {
    if (!exercise.showDottedGuide) return null;

    return segments.map((segment, index) => (
      <Path
        key={`guide-${index}`}
        d={segment.path}
        stroke={colors.neutral[200]}
        strokeWidth="2"
        strokeDasharray="5,5"
        fill="none"
        opacity={completedStrokes[index] ? 0.3 : 0.7}
      />
    ));
  };

  // Render completed strokes
  const renderCompletedStrokes = () => {
    return userStrokes.map((stroke, index) => (
      <Path
        key={`completed-${index}`}
        d={stroke}
        stroke={colors.success[500]}
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ));
  };

  // Render current stroke
  const renderCurrentStroke = () => {
    if (!currentStroke) return null;

    return (
      <Path
        d={currentStroke}
        stroke={colors.primary[500]}
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    );
  };

  // Render failed stroke
  const renderFailedStroke = () => {
    if (!lastFailedStroke) return null;

    return (
      <Path
        d={lastFailedStroke}
        stroke={colors.error[500]}
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.5}
      />
    );
  };

  // Render target paths
  const renderTargetPaths = () => {
    return segments.map((segment, index) => (
      <Path
        key={`target-${index}`}
        d={segment.path}
        stroke={colors.primary[500]}
        strokeWidth="2"
        fill="none"
        opacity={completedStrokes[index] ? 0.3 : 0.1}
      />
    ));
  };

  if (segments.length === 0) {
    return (
      <View style={styles.container}>
        <Text variant="body" style={styles.errorText}>
          {t("tracingNotAvailable", { target: exercise.target })}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Progress indicator */}
      <View style={styles.progressContainer}>
        <Text variant="caption" style={styles.progressText}>
          {t("strokeProgress", {
            current: currentStrokeIdx + 1,
            total: segments.length,
          })}
        </Text>
        <View style={styles.progressBar}>
          {segments.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                completedStrokes[index] && styles.progressDotCompleted,
                index === currentStrokeIdx && styles.progressDotCurrent,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Tracing canvas */}
      <View style={styles.canvasContainer}>
        <Svg
          width={screenWidth}
          height={svgHeight}
          viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
          style={styles.svg}
        >
          {/* Background */}
          <Circle
            cx={viewBoxSize / 2}
            cy={viewBoxSize / 2}
            r={viewBoxSize / 2 - 20}
            fill={colors.background.primary}
            stroke={colors.neutral[200]}
            strokeWidth="2"
          />

          {/* Dotted guides */}
          {renderDottedGuides()}

          {/* Target paths */}
          {renderTargetPaths()}

          {/* Completed strokes */}
          {renderCompletedStrokes()}

          {/* Current stroke */}
          {renderCurrentStroke()}

          {/* Failed stroke */}
          {renderFailedStroke()}

          {/* Direction arrows */}
          {renderDirectionArrows()}

          {/* Stroke order numbers */}
          {renderStrokeOrderNumbers()}
        </Svg>

        {/* Touch area */}
        <View
          style={[
            styles.touchArea,
            {
              transform: [{ translateX }, { translateY }, { scale }],
            },
          ]}
          {...panResponder.panHandlers}
        />
      </View>

      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <Text variant="heading3" style={styles.instructionText}>
          {segments[currentStrokeIdx]?.visualHint || t("traceHint")}
        </Text>

        {hintShown && (
          <Text variant="body" style={styles.hintText}>
            💡 {segments[currentStrokeIdx]?.visualHint}
          </Text>
        )}
      </View>

      {/* Action buttons */}
      <View style={styles.buttonContainer}>
        {!allCompleted && (
          <>
            <Button
              onPress={showHint}
              variant="secondary"
              style={styles.hintButton}
            >
              {t("hint")}
            </Button>
            {exercise.practiceMode === "guided" && (
              <Button
                onPress={skipStroke}
                variant="outline"
                style={styles.skipButton}
              >
                {t("skip")}
              </Button>
            )}
            <Button
              onPress={resetTracing}
              variant="outline"
              style={styles.resetButton}
            >
              {t("reset")}
            </Button>
          </>
        )}
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <Text variant="caption" style={styles.statsText}>
          {t("attemptsLabel", { count: totalAttempts })}
        </Text>
        <Text variant="caption" style={styles.statsText}>
          {t("accuracyLabel", {
            accuracy: Math.round(
              (strokeAccuracy.reduce((a, b) => a + b, 0) / segments.length) *
                100,
            ),
          })}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  progressContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  progressText: {
    marginBottom: 5,
    color: colors.text.secondary,
  },
  progressBar: {
    flexDirection: "row",
    gap: 8,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.neutral[200],
  },
  progressDotCompleted: {
    backgroundColor: colors.success[500],
  },
  progressDotCurrent: {
    backgroundColor: colors.primary[500],
  },
  canvasContainer: {
    width: "100%",
    flex: 1,
    position: "relative",
  },
  svg: {
    position: "absolute",
  },
  touchArea: {
    position: "absolute",
    width: 300,
    height: 300,
    backgroundColor: "transparent",
  },
  instructionsContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  instructionText: {
    textAlign: "center",
    color: colors.text.primary,
    marginBottom: 5,
  },
  hintText: {
    textAlign: "center",
    color: colors.warning[500],
    fontStyle: "italic",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
    marginVertical: 10,
  },
  hintButton: {
    minWidth: 80,
  },
  skipButton: {
    minWidth: 80,
  },
  resetButton: {
    minWidth: 80,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 20,
  },
  statsText: {
    color: colors.text.secondary,
  },
  errorText: {
    textAlign: "center",
    color: colors.error[500],
  },
});
