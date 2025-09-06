// src/hooks/useProgress.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { getIslandTopics } from "@/src/utils/islands";
import { IslandId } from "../types/common";

type Progress = {
  unlockedTopics: string[];
};

const STORAGE_KEY = "progress";

export function useProgress(islandId: IslandId) {
  const [progress, setProgress] = useState<Progress>({ unlockedTopics: [] });

  useEffect(() => {
    let mounted = true;

    (async () => {
      const raw = await AsyncStorage.getItem(`${STORAGE_KEY}:${islandId}`);
      if (!mounted) return;

      const topics = getIslandTopics(islandId);
      const firstTopic = topics[0];

      if (raw) {
        const parsed = JSON.parse(raw) as Progress;
        // Always guarantee first topic is unlocked
        const ensured = {
          unlockedTopics: [...new Set([firstTopic, ...parsed.unlockedTopics])],
        };
        setProgress(ensured);
      } else {
        // First time visiting → unlock first topic by default
        setProgress({ unlockedTopics: [firstTopic] });
      }
    })();

    return () => {
      mounted = false;
    };
  }, [islandId]);

  const unlockTopic = async (topic: string) => {
    const updated = {
      unlockedTopics: [...new Set([...progress.unlockedTopics, topic])],
    };
    setProgress(updated);
    await AsyncStorage.setItem(
      `${STORAGE_KEY}:${islandId}`,
      JSON.stringify(updated)
    );
  };

  const resetProgress = async () => {
    setProgress({ unlockedTopics: [] });
    await AsyncStorage.removeItem(`${STORAGE_KEY}:${islandId}`);
  };

  return { progress, unlockTopic, resetProgress };
}
