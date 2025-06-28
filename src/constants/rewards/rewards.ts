import chest from "@assets/images/chest.png";

import {
  Treasure as CommonTreasure,
  Achievement as CommonAchievement,
} from "../../types/common";

export type Treasure = CommonTreasure;
export type Achievement = CommonAchievement;

export interface RewardProgress {
  totalTreasures: number;
  totalPoints: number;
  currentStreak: number;
  bestStreak: number;
  islandsUnlocked: number;
  achievementsUnlocked: number;
  lastRewardDate: string;
}

// Treasure definitions
export const treasures: Treasure[] = [
  // Common treasures (frequent rewards)
  {
    id: "gold_coin",
    name: "Gold Coin",
    description: "A shiny gold coin from the treasure chest!",
    rarity: "common",
    type: "currency",
    points: 10,
    image: chest,
  },
  {
    id: "silver_coin",
    name: "Silver Coin",
    description: "A gleaming silver coin!",
    rarity: "common",
    type: "currency",
    points: 5,
    image: chest,
  },
  {
    id: "ruby_gem",
    name: "Ruby Gem",
    description: "A beautiful red ruby!",
    rarity: "common",
    type: "currency",
    points: 15,
    image: chest,
  },

  // Rare treasures (less frequent)
  {
    id: "emerald_gem",
    name: "Emerald Gem",
    description: "A sparkling green emerald!",
    rarity: "rare",
    type: "currency",
    points: 25,
    image: chest,
  },
  {
    id: "treasure_map",
    name: "Treasure Map",
    description: "A mysterious map leading to hidden treasures!",
    rarity: "rare",
    type: "special",
    points: 30,
    image: chest,
  },
  {
    id: "golden_compass",
    name: "Golden Compass",
    description: "A magical compass that always points to adventure!",
    rarity: "rare",
    type: "special",
    points: 35,
    image: chest,
  },

  // Epic treasures (special occasions)
  {
    id: "crown_jewels",
    name: "Crown Jewels",
    description: "The royal crown jewels!",
    rarity: "epic",
    type: "special",
    points: 50,
    image: chest,
  },
  {
    id: "golden_key",
    name: "Golden Key",
    description: "A magical key that unlocks secret passages!",
    rarity: "epic",
    type: "key",
    points: 45,
    image: chest,
  },

  // Legendary treasures (very rare)
  {
    id: "pirate_chest",
    name: "Pirate Chest",
    description: "A legendary chest filled with endless treasures!",
    rarity: "legendary",
    type: "special",
    points: 100,
    image: chest,
  },
  {
    id: "diamond_crown",
    name: "Diamond Crown",
    description: "The most precious crown in all the seas!",
    rarity: "legendary",
    type: "special",
    points: 150,
    image: chest,
  },
];

// Achievement definitions
export const achievements: Achievement[] = [
  // Tracing achievements
  {
    id: "first_letter",
    name: "First Letter",
    description: "Trace your first letter",
    icon: "✏️",
    points: 10,
    isUnlocked: false,
    progress: 0,
    maxProgress: 1,
    category: "learning",
  },
  {
    id: "letter_master",
    name: "Letter Master",
    description: "Trace 10 letters perfectly",
    icon: "📝",
    points: 25,
    isUnlocked: false,
    progress: 0,
    maxProgress: 10,
    category: "learning",
  },
  {
    id: "number_expert",
    name: "Number Expert",
    description: "Trace all numbers 1-10",
    icon: "🔢",
    points: 30,
    isUnlocked: false,
    progress: 0,
    maxProgress: 10,
    category: "learning",
  },

  // Counting achievements
  {
    id: "counting_pro",
    name: "Counting Pro",
    description: "Complete 5 counting lessons",
    icon: "🐟",
    points: 20,
    isUnlocked: false,
    progress: 0,
    maxProgress: 5,
    category: "learning",
  },

  // Exploration achievements
  {
    id: "island_explorer",
    name: "Island Explorer",
    description: "Visit 3 different islands",
    icon: "🏝️",
    points: 15,
    isUnlocked: false,
    progress: 0,
    maxProgress: 3,
    category: "exploration",
  },
  {
    id: "ocean_navigator",
    name: "Ocean Navigator",
    description: "Unlock 5 islands",
    icon: "🧭",
    points: 40,
    isUnlocked: false,
    progress: 0,
    maxProgress: 5,
    category: "exploration",
  },

  // Streak achievements
  {
    id: "daily_adventurer",
    name: "Daily Adventurer",
    description: "Complete lessons for 3 days in a row",
    icon: "📅",
    points: 20,
    isUnlocked: false,
    progress: 0,
    maxProgress: 3,
    category: "streak",
  },
  {
    id: "week_warrior",
    name: "Week Warrior",
    description: "Complete lessons for 7 days in a row",
    icon: "⚔️",
    points: 50,
    isUnlocked: false,
    progress: 0,
    maxProgress: 7,
    category: "streak",
  },
];

// Reward multipliers for different activities
export const rewardMultipliers = {
  perfect_trace: 2.0, // Perfect tracing gets double points
  streak_bonus: 1.5, // Streak bonus
  first_time: 1.3, // First time completing a lesson
  speed_bonus: 1.2, // Completing quickly
  accuracy_bonus: 1.1, // High accuracy
};

// Helper functions
export const getRandomTreasure = (
  rarity?: "common" | "rare" | "epic" | "legendary",
): Treasure => {
  const filteredTreasures = rarity
    ? treasures.filter((t) => t.rarity === rarity)
    : treasures;

  const randomIndex = Math.floor(Math.random() * filteredTreasures.length);
  return filteredTreasures[randomIndex];
};

export const getTreasureByRarity = (
  rarity: "common" | "rare" | "epic" | "legendary",
): Treasure[] => {
  return treasures.filter((t) => t.rarity === rarity);
};

export const calculateRewardPoints = (
  basePoints: number,
  perfect: boolean = false,
  streak: number = 0,
  firstTime: boolean = false,
  speed: number = 1.0,
  accuracy: number = 1.0,
): number => {
  let totalPoints = basePoints;

  if (perfect) totalPoints *= rewardMultipliers.perfect_trace;
  if (streak >= 3) totalPoints *= rewardMultipliers.streak_bonus;
  if (firstTime) totalPoints *= rewardMultipliers.first_time;
  if (speed > 0.8) totalPoints *= rewardMultipliers.speed_bonus;
  if (accuracy > 0.9) totalPoints *= rewardMultipliers.accuracy_bonus;

  return Math.round(totalPoints);
};
