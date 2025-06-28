import { LessonKey } from "./lessons";

/**
 * Lesson Summary by Island
 *
 * This file provides an overview of all lessons organized by island,
 * including lesson types, difficulty levels, and educational objectives.
 */

export interface IslandLessonSummary {
  islandId: string;
  islandName: string;
  totalLessons: number;
  lessonTypes: {
    tracing: number;
    counting: number;
    matching: number;
    quiz: number;
    listening: number;
  };
  lessons: {
    id: string;
    type: string;
    difficulty: "easy" | "medium" | "hard";
    description: string;
  }[];
}

export const islandLessonSummaries: IslandLessonSummary[] = [
  {
    islandId: "numbers",
    islandName: "Numbers Island",
    totalLessons: 15,
    lessonTypes: {
      tracing: 10,
      counting: 3,
      matching: 1,
      quiz: 1,
      listening: 0,
    },
    lessons: [
      {
        id: LessonKey.NumberTracing1,
        type: "tracing",
        difficulty: "easy",
        description: "Learn to write number 1",
      },
      {
        id: LessonKey.NumberTracing2,
        type: "tracing",
        difficulty: "easy",
        description: "Learn to write number 2",
      },
      {
        id: LessonKey.NumberTracing3,
        type: "tracing",
        difficulty: "easy",
        description: "Learn to write number 3",
      },
      {
        id: LessonKey.NumberTracing4,
        type: "tracing",
        difficulty: "medium",
        description: "Learn to write number 4",
      },
      {
        id: LessonKey.NumberTracing5,
        type: "tracing",
        difficulty: "medium",
        description: "Learn to write number 5",
      },
      {
        id: LessonKey.NumberTracing6,
        type: "tracing",
        difficulty: "medium",
        description: "Learn to write number 6",
      },
      {
        id: LessonKey.NumberTracing7,
        type: "tracing",
        difficulty: "medium",
        description: "Learn to write number 7",
      },
      {
        id: LessonKey.NumberTracing8,
        type: "tracing",
        difficulty: "hard",
        description: "Learn to write number 8",
      },
      {
        id: LessonKey.NumberTracing9,
        type: "tracing",
        difficulty: "hard",
        description: "Learn to write number 9",
      },
      {
        id: LessonKey.NumberTracing10,
        type: "tracing",
        difficulty: "hard",
        description: "Learn to write number 10",
      },
      {
        id: LessonKey.CountingFish3,
        type: "counting",
        difficulty: "easy",
        description: "Count 3 fish",
      },
      {
        id: LessonKey.CountingFish5,
        type: "counting",
        difficulty: "medium",
        description: "Count 5 fish",
      },
      {
        id: LessonKey.CountingFish7,
        type: "counting",
        difficulty: "hard",
        description: "Count 7 fish",
      },
      {
        id: LessonKey.NumberMatching,
        type: "matching",
        difficulty: "medium",
        description: "Match numbers with their representations",
      },
      {
        id: LessonKey.NumberQuiz,
        type: "quiz",
        difficulty: "medium",
        description: "Test knowledge of numbers 1-5",
      },
    ],
  },
  {
    islandId: "alphabet",
    islandName: "Alphabet Island",
    totalLessons: 16,
    lessonTypes: {
      tracing: 10,
      counting: 0,
      matching: 3,
      quiz: 2,
      listening: 1,
    },
    lessons: [
      {
        id: LessonKey.LetterTracingAEn,
        type: "tracing",
        difficulty: "easy",
        description: "Learn to write letter A",
      },
      {
        id: LessonKey.LetterTracingBEn,
        type: "tracing",
        difficulty: "easy",
        description: "Learn to write letter B",
      },
      {
        id: LessonKey.LetterTracingCEn,
        type: "tracing",
        difficulty: "easy",
        description: "Learn to write letter C",
      },
      {
        id: LessonKey.LetterTracingDEn,
        type: "tracing",
        difficulty: "medium",
        description: "Learn to write letter D",
      },
      {
        id: LessonKey.LetterTracingEEn,
        type: "tracing",
        difficulty: "medium",
        description: "Learn to write letter E",
      },
      {
        id: LessonKey.LetterTracingFEn,
        type: "tracing",
        difficulty: "medium",
        description: "Learn to write letter F",
      },
      {
        id: LessonKey.LetterTracingGEn,
        type: "tracing",
        difficulty: "medium",
        description: "Learn to write letter G",
      },
      {
        id: LessonKey.LetterTracingHEn,
        type: "tracing",
        difficulty: "hard",
        description: "Learn to write letter H",
      },
      {
        id: LessonKey.LetterTracingIEn,
        type: "tracing",
        difficulty: "hard",
        description: "Learn to write letter I",
      },
      {
        id: LessonKey.LetterTracingJEn,
        type: "tracing",
        difficulty: "hard",
        description: "Learn to write letter J",
      },
      {
        id: LessonKey.WordMatchingABC,
        type: "matching",
        difficulty: "medium",
        description: "Match words starting with A, B, C",
      },
      {
        id: LessonKey.WordMatchingDEF,
        type: "matching",
        difficulty: "medium",
        description: "Match words starting with D, E, F",
      },
      {
        id: LessonKey.WordMatchingGHI,
        type: "matching",
        difficulty: "hard",
        description: "Match words starting with G, H, I",
      },
      {
        id: LessonKey.AlphabetQuizABCDE,
        type: "quiz",
        difficulty: "medium",
        description: "Test knowledge of letters A-E",
      },
      {
        id: LessonKey.AlphabetQuizFGHIJ,
        type: "quiz",
        difficulty: "hard",
        description: "Test knowledge of letters F-J",
      },
      {
        id: LessonKey.ListeningABCDE,
        type: "listening",
        difficulty: "easy",
        description: "Listen and repeat words A-E",
      },
    ],
  },
  {
    islandId: "basics",
    islandName: "Basics Island",
    totalLessons: 7,
    lessonTypes: {
      tracing: 0,
      counting: 0,
      matching: 1,
      quiz: 1,
      listening: 5,
    },
    lessons: [
      {
        id: LessonKey.BasicShapes,
        type: "listening",
        difficulty: "easy",
        description: "Learn basic shapes",
      },
      {
        id: LessonKey.BasicColors,
        type: "listening",
        difficulty: "easy",
        description: "Learn basic colors",
      },
      {
        id: LessonKey.BasicAnimals,
        type: "listening",
        difficulty: "easy",
        description: "Learn basic animals",
      },
      {
        id: LessonKey.BasicFood,
        type: "listening",
        difficulty: "easy",
        description: "Learn basic food items",
      },
      {
        id: LessonKey.BasicBodyParts,
        type: "listening",
        difficulty: "medium",
        description: "Learn body parts",
      },
      {
        id: LessonKey.BasicMatching,
        type: "matching",
        difficulty: "medium",
        description: "Match basic concepts",
      },
      {
        id: LessonKey.BasicQuiz,
        type: "quiz",
        difficulty: "medium",
        description: "Test basic knowledge",
      },
    ],
  },
  {
    islandId: "colors",
    islandName: "Colors Island",
    totalLessons: 8,
    lessonTypes: {
      tracing: 0,
      counting: 0,
      matching: 1,
      quiz: 1,
      listening: 6,
    },
    lessons: [
      {
        id: LessonKey.ColorRed,
        type: "listening",
        difficulty: "easy",
        description: "Learn the color red",
      },
      {
        id: LessonKey.ColorBlue,
        type: "listening",
        difficulty: "easy",
        description: "Learn the color blue",
      },
      {
        id: LessonKey.ColorGreen,
        type: "listening",
        difficulty: "easy",
        description: "Learn the color green",
      },
      {
        id: LessonKey.ColorYellow,
        type: "listening",
        difficulty: "easy",
        description: "Learn the color yellow",
      },
      {
        id: LessonKey.ColorPurple,
        type: "listening",
        difficulty: "medium",
        description: "Learn the color purple",
      },
      {
        id: LessonKey.ColorOrange,
        type: "listening",
        difficulty: "medium",
        description: "Learn the color orange",
      },
      {
        id: LessonKey.ColorMatching,
        type: "matching",
        difficulty: "medium",
        description: "Match colors with objects",
      },
      {
        id: LessonKey.ColorQuiz,
        type: "quiz",
        difficulty: "medium",
        description: "Test color knowledge",
      },
    ],
  },
  {
    islandId: "shapes",
    islandName: "Shapes Island",
    totalLessons: 8,
    lessonTypes: {
      tracing: 0,
      counting: 0,
      matching: 1,
      quiz: 1,
      listening: 6,
    },
    lessons: [
      {
        id: LessonKey.ShapeCircle,
        type: "listening",
        difficulty: "easy",
        description: "Learn the circle shape",
      },
      {
        id: LessonKey.ShapeSquare,
        type: "listening",
        difficulty: "easy",
        description: "Learn the square shape",
      },
      {
        id: LessonKey.ShapeTriangle,
        type: "listening",
        difficulty: "easy",
        description: "Learn the triangle shape",
      },
      {
        id: LessonKey.ShapeRectangle,
        type: "listening",
        difficulty: "medium",
        description: "Learn the rectangle shape",
      },
      {
        id: LessonKey.ShapeStar,
        type: "listening",
        difficulty: "medium",
        description: "Learn the star shape",
      },
      {
        id: LessonKey.ShapeHeart,
        type: "listening",
        difficulty: "medium",
        description: "Learn the heart shape",
      },
      {
        id: LessonKey.ShapeMatching,
        type: "matching",
        difficulty: "medium",
        description: "Match shapes with objects",
      },
      {
        id: LessonKey.ShapeQuiz,
        type: "quiz",
        difficulty: "medium",
        description: "Test shape knowledge",
      },
    ],
  },
  {
    islandId: "family",
    islandName: "Family Island",
    totalLessons: 5,
    lessonTypes: {
      tracing: 0,
      counting: 0,
      matching: 1,
      quiz: 1,
      listening: 3,
    },
    lessons: [
      {
        id: LessonKey.FamilyMembers,
        type: "listening",
        difficulty: "easy",
        description: "Learn family members",
      },
      {
        id: LessonKey.FamilyRelations,
        type: "listening",
        difficulty: "medium",
        description: "Learn family relationships",
      },
      {
        id: LessonKey.FamilyActivities,
        type: "listening",
        difficulty: "medium",
        description: "Learn family activities",
      },
      {
        id: LessonKey.FamilyMatching,
        type: "matching",
        difficulty: "medium",
        description: "Match family members",
      },
      {
        id: LessonKey.FamilyQuiz,
        type: "quiz",
        difficulty: "medium",
        description: "Test family knowledge",
      },
    ],
  },
  {
    islandId: "food",
    islandName: "Food Island",
    totalLessons: 5,
    lessonTypes: {
      tracing: 0,
      counting: 0,
      matching: 1,
      quiz: 1,
      listening: 3,
    },
    lessons: [
      {
        id: LessonKey.FoodFruits,
        type: "listening",
        difficulty: "easy",
        description: "Learn fruit names",
      },
      {
        id: LessonKey.FoodVegetables,
        type: "listening",
        difficulty: "easy",
        description: "Learn vegetable names",
      },
      {
        id: LessonKey.FoodMeals,
        type: "listening",
        difficulty: "medium",
        description: "Learn meal names",
      },
      {
        id: LessonKey.FoodMatching,
        type: "matching",
        difficulty: "medium",
        description: "Match food items",
      },
      {
        id: LessonKey.FoodQuiz,
        type: "quiz",
        difficulty: "medium",
        description: "Test food knowledge",
      },
    ],
  },
  {
    islandId: "conversation",
    islandName: "Conversation Island",
    totalLessons: 6,
    lessonTypes: {
      tracing: 0,
      counting: 0,
      matching: 1,
      quiz: 1,
      listening: 4,
    },
    lessons: [
      {
        id: LessonKey.ConversationGreetings,
        type: "listening",
        difficulty: "easy",
        description: "Learn greetings",
      },
      {
        id: LessonKey.ConversationQuestions,
        type: "listening",
        difficulty: "medium",
        description: "Learn question words",
      },
      {
        id: LessonKey.ConversationEmotions,
        type: "listening",
        difficulty: "medium",
        description: "Learn emotions",
      },
      {
        id: LessonKey.ConversationDaily,
        type: "listening",
        difficulty: "hard",
        description: "Learn daily conversation",
      },
      {
        id: LessonKey.ConversationMatching,
        type: "matching",
        difficulty: "medium",
        description: "Match conversation phrases",
      },
      {
        id: LessonKey.ConversationQuiz,
        type: "quiz",
        difficulty: "medium",
        description: "Test conversation knowledge",
      },
    ],
  },
];

export function getIslandLessonSummary(
  islandId: string,
): IslandLessonSummary | null {
  return (
    islandLessonSummaries.find((summary) => summary.islandId === islandId) ||
    null
  );
}

export function getAllLessonTypes(): {
  tracing: number;
  counting: number;
  matching: number;
  quiz: number;
  listening: number;
} {
  return islandLessonSummaries.reduce(
    (
      acc: {
        tracing: number;
        counting: number;
        matching: number;
        quiz: number;
        listening: number;
      },
      summary: IslandLessonSummary,
    ) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const tracing = acc.tracing + summary.lessonTypes.tracing;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const counting = acc.counting + summary.lessonTypes.counting;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const matching = acc.matching + summary.lessonTypes.matching;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const quiz = acc.quiz + summary.lessonTypes.quiz;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const listening = acc.listening + summary.lessonTypes.listening;
      return { tracing, counting, matching, quiz, listening };
    },
    { tracing: 0, counting: 0, matching: 0, quiz: 0, listening: 0 },
  );
}

export function getTotalLessons(): number {
  return islandLessonSummaries.reduce(
    (acc: number, summary: IslandLessonSummary) => {
      const total = acc + summary.totalLessons;
      return total;
    },
    0 as number,
  );
}
