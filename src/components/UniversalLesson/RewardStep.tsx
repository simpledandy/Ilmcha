import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "@components/Text";
import { colors } from "@theme/colors";
import { playCongratsSequence } from "@hooks/useAudioPlayer";

function isErrorWithMessage(err: unknown): err is { message: string } {
  return (
    typeof err === "object" &&
    err !== null &&
    "message" in err &&
    typeof (err as { message: unknown }).message === "string"
  );
}

// For lint safety, we do not use any props or external data. Message and coins are hardcoded.
export const RewardStep: React.FC<{
  onComplete: (success: boolean, score: number, accuracy?: number) => void;
}> = ({ onComplete }) => {
  const [hasCompleted, setHasCompleted] = useState(false);

  // Calculate coins based on a fixed formula instead of random
  const coins = 5; // Fixed amount for consistency
  const message = "Congratulations!";

  useEffect(() => {
    if (hasCompleted) return; // Prevent multiple executions

    setHasCompleted(true);

    void playCongratsSequence(coins).catch((err: unknown) => {
      if (isErrorWithMessage(err)) {
        // removed console.warn
      } else if (typeof err === "string") {
        // removed console.warn
      } else {
        // removed console.warn and errorMessage
      }
    });

    const timer = setTimeout(() => {
      onComplete(true, 0);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete, coins, hasCompleted]);

  return (
    <View style={styles.rewardContainer}>
      <Text variant="heading2" style={styles.rewardText}>
        {message}
      </Text>
      <Text variant="heading2" style={styles.coinsText}>
        +{coins} coins
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  rewardContainer: {
    alignItems: "center",
    backgroundColor: colors.background.tertiary,
    padding: 30,
    borderRadius: 20,
    maxWidth: 350,
  },
  rewardText: {
    fontSize: 24,
    textAlign: "center",
    color: colors.success[500],
    fontWeight: "bold",
  },
  coinsText: {
    fontSize: 32,
    textAlign: "center",
    color: colors.success[600],
    fontWeight: "bold",
    marginTop: 12,
  },
});
