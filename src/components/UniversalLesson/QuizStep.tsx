import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "@components/Text";
import { Button } from "@components/Button";
import { colors } from "@/src/theme/colors";

interface QuizStepProps {
  onComplete: (success: boolean, score: number, accuracy?: number) => void;
}

export const QuizStep: React.FC<QuizStepProps> = ({ onComplete }) => {
  return (
    <View style={styles.quizContainer}>
      <Text variant="heading3" style={styles.quizText}>
        Quiz time! Answer the questions.
      </Text>
      <Button onPress={() => onComplete(true, 30)} variant="primary">
        Take Quiz
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  quizContainer: {
    alignItems: "center",
    backgroundColor: colors.background.tertiary,
    padding: 30,
    borderRadius: 20,
    maxWidth: 350,
  },
  quizText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
});
