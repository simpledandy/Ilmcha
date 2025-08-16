// src/hooks/useProgress.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

type Progress = {
  unlockedTopics: string[];
};

const STORAGE_KEY = "progress";

export function useProgress(islandId: string) {
  const [progress, setProgress] = useState<Progress>({ unlockedTopics: [] });

  useEffect(() => {
    let mounted = true;

    (async () => {
      const raw = await AsyncStorage.getItem(`${STORAGE_KEY}:${islandId}`);
      if (!mounted) return;

      if (raw) {
        setProgress(JSON.parse(raw));
      } else {
        // First time visiting → ensure first topic unlocked
        setProgress({ unlockedTopics: [] });
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
