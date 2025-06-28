import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StationInteraction } from "@components/StationInteraction";
import { stationManager } from "@utils/stationManager";
import { getStationById } from "@constants/stations/stations";
import type { Station } from "../../../types/common";
import { colors } from "@theme/colors";
import { useTranslation } from "react-i18next";
import { Text as CustomText } from "@components/Text";

export default function StationScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { station: stationId } = useLocalSearchParams<{
    station: string;
  }>();

  const [station, setStation] = useState<Station | null>(null);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initializeStation = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!stationId) {
        setError("Station ID is required");
        return;
      }

      const foundStation = getStationById(stationId);
      if (!foundStation) {
        setError("Station not found");
        return;
      }

      setStation(foundStation);

      // Initialize station manager if needed
      await stationManager.initialize();
    } catch (err) {
      setError("Failed to load station");
      console.error("Station initialization error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [stationId]);

  useEffect(() => {
    void initializeStation();
  }, [initializeStation]);

  const handleTaskComplete = useCallback(
    async (taskId: string, success: boolean, score: number) => {
      try {
        if (!station) return;

        await stationManager.completeTask(station.id, taskId, success, score);

        // Show feedback based on success
        if (success) {
          // Success feedback is handled by the StationInteraction component
        } else {
          // Could show retry encouragement here
        }
      } catch (err) {
        console.error("Task completion error:", err);
        Alert.alert(t("error"), t("taskCompletionError"));
      }
    },
    [station, t],
  );

  const handleTaskCompleteWrapper = useCallback(
    (taskId: string, success: boolean, score: number) => {
      void handleTaskComplete(taskId, success, score);
    },
    [handleTaskComplete],
  );

  const handleStationComplete = useCallback(() => {
    Alert.alert(t("congratulations"), t("stationCompleteMessage"), [
      {
        text: t("continue"),
        onPress: () => {
          // Navigate back to island or to next station
          void router.back();
        },
      },
    ]);
  }, [t, router]);

  const handleBack = () => {
    Alert.alert(t("leaveStation"), t("leaveStationMessage"), [
      {
        text: t("cancel"),
        style: "cancel",
      },
      {
        text: t("leave"),
        style: "destructive",
        onPress: () => router.back(),
      },
    ]);
  };

  const handleTaskIndexChange = (index: number) => {
    setCurrentTaskIndex(index);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <CustomText variant="heading2">{t("loading")}</CustomText>
      </View>
    );
  }

  if (error || !station) {
    return (
      <View style={styles.errorContainer}>
        <CustomText variant="heading2" style={styles.errorTitle}>
          {t("error")}
        </CustomText>
        <CustomText variant="body" style={styles.errorMessage}>
          {error || t("stationNotFound")}
        </CustomText>
        <CustomText
          variant="body"
          style={styles.backLink}
          onPress={() => {
            void router.back();
          }}
        >
          {t("goBack")}
        </CustomText>
      </View>
    );
  }

  return (
    <StationInteraction
      station={station}
      currentTaskIndex={currentTaskIndex}
      onTaskComplete={handleTaskCompleteWrapper}
      onStationComplete={handleStationComplete}
      onBack={handleBack}
      onTaskIndexChange={handleTaskIndexChange}
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background.primary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background.primary,
    padding: 20,
  },
  errorTitle: {
    marginBottom: 10,
    color: colors.error[500],
  },
  errorMessage: {
    textAlign: "center",
    marginBottom: 20,
    color: colors.text.secondary,
  },
  backLink: {
    color: colors.primary[500],
    textDecorationLine: "underline",
  },
});
