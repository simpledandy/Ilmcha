// src/utils/islands.ts
import { BackgroundImages } from '@/src/constants';

/**
 * Return topics for a given island, in the order they should be played.
 * If you want to reverse (e.g. bottom-up path), do it here only.
 */
export function getIslandTopics(islandId: keyof typeof BackgroundImages['islands']): string[] {
  const topics = Object.keys(BackgroundImages.islands[islandId] || {});
  return topics; // 👈 one source of truth for ordering
}

/**
 * Get the image for a specific topic.
 */
export function getTopicImage(islandId: keyof typeof BackgroundImages['islands'], topic: string) {
  return BackgroundImages.islands[islandId]?.[topic];
}

/**
 * From progress, find the *current* topic (last unlocked, or first topic if none).
 */
export function getCurrentTopic(islandId: string, unlockedTopics: string[]): string | undefined {
  const topics = getIslandTopics(islandId);
  const unlockedInOrder = topics.filter((t) => unlockedTopics.includes(t));
  return unlockedInOrder[unlockedInOrder.length - 1];
}

/**
 * Given the current topic, find the next one in sequence.
 */
export function getNextTopic(islandId: string, currentTopic: string): string | undefined {
  const topics = getIslandTopics(islandId);
  const idx = topics.indexOf(currentTopic);
  return idx >= 0 ? topics[idx + 1] : undefined;
}
