import type { Station } from "../../types/common";

// Station Types and Themes
export const StationTypes = {
  LAKE: "lake",
  CAVE: "cave",
  FOREST: "forest",
  GARDEN: "garden",
  YARD: "yard",
  CASTLE: "castle",
  BEACH: "beach",
  MOUNTAIN: "mountain",
} as const;

// Station Themes for Numbers Island
export const NumbersIslandStations: Station[] = [
  {
    id: "lake_counting",
    name: "Counting Lake",
    type: "lake",
    theme: "water_animals",
    description: "Count the fish swimming in the lake!",
    backgroundImage: "lake_bg",
    isUnlocked: true,
    requiredKeys: 0,
    position: { x: 50, y: 100 },
    visualEffects: {
      particles: true,
      ambientSound: "water_ambient",
      lighting: "day",
    },
    tasks: [
      {
        id: "lake_warmup",
        type: "warmup",
        title: "Fish Friends",
        description: "Say hello to the fish!",
        difficulty: "easy",
        estimatedDuration: 1,
        points: 10,
        rewards: [
          {
            type: "coins",
            value: 5,
            message: "Great start! You earned 5 coins!",
            audioFile: "coins_earned",
          },
        ],
        isCompleted: false,
        isUnlocked: true,
        content: {
          type: "listening",
          data: {
            message:
              "Welcome to the Counting Lake! Let's meet our fish friends.",
            audioFile: "lake_welcome",
          },
          audioFile: "lake_welcome",
          backgroundImage: "lake_bg",
        },
      },
    ],
  },
];

// Export all station configurations
export const AllStations = {
  numbers: NumbersIslandStations,
};

// Helper functions
export const getStationById = (stationId: string): Station | undefined => {
  return NumbersIslandStations.find((station) => station.id === stationId);
};

export const getStationsByIsland = (islandId: string): Station[] => {
  switch (islandId) {
    case "numbers":
      return NumbersIslandStations;
    default:
      return [];
  }
};
