import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "@components/Text";
import { Button } from "@components/Button";
import { TracingInteraction } from "@components/lessonInteractions/TracingInteraction";
import { CountingInteraction } from "@components/lessonInteractions/CountingInteraction";
import { colors } from "@theme/colors";
import { LessonStep } from "@constants/lessons/lessonTypes";
import { useTranslation } from "react-i18next";
import {
  LessonContent,
  TracingContent,
  CountingContent,
} from "../../types/common";

interface InteractionStepProps {
  step: LessonStep;
  onComplete: (success: boolean, score: number, accuracy?: number) => void;
}

function isTracingContent(content: LessonContent): content is TracingContent {
  return (
    (content as TracingContent).type === "tracing" &&
    !!(content as TracingContent).exercise
  );
}
function isCountingContent(content: LessonContent): content is CountingContent {
  return (
    (content as CountingContent).type === "counting" &&
    !!(content as CountingContent).exercise
  );
}

export const InteractionStep: React.FC<InteractionStepProps> = ({
  step,
  onComplete,
}) => {
  const { content } = step;
  const { t } = useTranslation();

  if (isTracingContent(content)) {
    const tracing = content;
    return (
      <TracingInteraction exercise={tracing.exercise} onComplete={onComplete} />
    );
  }
  if (isCountingContent(content)) {
    const counting = content;
    return (
      <CountingInteraction
        exercise={counting.exercise}
        onComplete={onComplete}
      />
    );
  }

  return (
    <View style={styles.interactionContainer}>
      <Text variant="body" style={styles.interactionText}>
        {t("completeActivity")}
      </Text>
      <Button onPress={() => onComplete(true, 20)} variant="primary">
        {t("complete")}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  interactionContainer: {
    alignItems: "center",
    backgroundColor: colors.background.tertiary,
    padding: 30,
    borderRadius: 20,
    maxWidth: 350,
  },
  interactionText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
});
