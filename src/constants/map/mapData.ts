import { Dimensions } from "react-native";
import { ImageSource } from "../../types/common";
import { BackgroundImages } from "@constants/images/images";
import { LessonKey } from "../lessons/lessons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const TILE_SPREAD = 3; // 3 left, 3 right, 3 up, 3 down

const TILE_WIDTH = SCREEN_WIDTH;
const TILE_HEIGHT = SCREEN_WIDTH * 0.5105; // Maintain aspect ratio

const MAP_WIDTH = TILE_WIDTH * (TILE_SPREAD * 2 + 1);
const MAP_HEIGHT = TILE_HEIGHT * (TILE_SPREAD * 2 + 1);

export interface IslandData {
  id: string;
  title: string;
  subtitle: string;
  x: number;
  y: number;
  size: "small" | "medium" | "large";
  status: "locked" | "unlocked" | "completed";
  imageSource?: ImageSource;
  lessons?: string[];
}

export const islands: IslandData[] = [
  {
    id: "numbers",
    title: "islandNumbersTitle",
    subtitle: "islandNumbersSubtitle",
    x: MAP_WIDTH * 0.25,
    y: MAP_HEIGHT * 0.4,
    size: "large",
    status: "unlocked",
    imageSource: BackgroundImages.islands.numeriya,
    lessons: [
      LessonKey.NumberTracing1,
      LessonKey.NumberTracing2,
      LessonKey.NumberTracing3,
      LessonKey.NumberTracing4,
      LessonKey.NumberTracing5,
      LessonKey.NumberTracing6,
      LessonKey.NumberTracing7,
      LessonKey.NumberTracing8,
      LessonKey.NumberTracing9,
      LessonKey.NumberTracing10,
      LessonKey.CountingFish3,
      LessonKey.CountingFish5,
      LessonKey.CountingFish7,
      LessonKey.NumberMatching,
      LessonKey.NumberQuiz,
    ],
  },
  {
    id: "alphabet",
    title: "islandAlphabetTitle",
    subtitle: "islandAlphabetSubtitle",
    x: MAP_WIDTH * 0.3,
    y: MAP_HEIGHT * 0.2,
    size: "large",
    status: "locked",
    imageSource: BackgroundImages.islands.alibo,
    lessons: [
      LessonKey.LetterTracingAEn,
      LessonKey.LetterTracingBEn,
      LessonKey.LetterTracingCEn,
      LessonKey.LetterTracingDEn,
      LessonKey.LetterTracingEEn,
      LessonKey.LetterTracingFEn,
      LessonKey.LetterTracingGEn,
      LessonKey.LetterTracingHEn,
      LessonKey.LetterTracingIEn,
      LessonKey.LetterTracingJEn,
      LessonKey.WordMatchingABC,
      LessonKey.WordMatchingDEF,
      LessonKey.WordMatchingGHI,
      LessonKey.AlphabetQuizABCDE,
      LessonKey.AlphabetQuizFGHIJ,
      LessonKey.ListeningABCDE,
    ],
  },
  {
    id: "basics",
    title: "islandBasicsTitle",
    subtitle: "islandBasicsSubtitle",
    x: MAP_WIDTH * 0.7,
    y: MAP_HEIGHT * 0.3,
    size: "large",
    status: "locked",
    imageSource: BackgroundImages.islands.blank,
    lessons: [
      LessonKey.BasicShapes,
      LessonKey.BasicColors,
      LessonKey.BasicAnimals,
      LessonKey.BasicFood,
      LessonKey.BasicBodyParts,
      LessonKey.BasicMatching,
      LessonKey.BasicQuiz,
    ],
  },
  {
    id: "colors",
    title: "islandColorsTitle",
    subtitle: "islandColorsSubtitle",
    x: MAP_WIDTH * 0.3,
    y: MAP_HEIGHT * 0.6,
    size: "large",
    status: "locked",
    imageSource: BackgroundImages.islands.blank,
    lessons: [
      LessonKey.ColorRed,
      LessonKey.ColorBlue,
      LessonKey.ColorGreen,
      LessonKey.ColorYellow,
      LessonKey.ColorPurple,
      LessonKey.ColorOrange,
      LessonKey.ColorMatching,
      LessonKey.ColorQuiz,
    ],
  },
  {
    id: "shapes",
    title: "islandShapesTitle",
    subtitle: "islandShapesSubtitle",
    x: MAP_WIDTH * 0.6,
    y: MAP_HEIGHT * 0.7,
    size: "large",
    status: "locked",
    imageSource: BackgroundImages.islands.blank,
    lessons: [
      LessonKey.ShapeCircle,
      LessonKey.ShapeSquare,
      LessonKey.ShapeTriangle,
      LessonKey.ShapeRectangle,
      LessonKey.ShapeStar,
      LessonKey.ShapeHeart,
      LessonKey.ShapeMatching,
      LessonKey.ShapeQuiz,
    ],
  },
  {
    id: "family",
    title: "islandFamilyTitle",
    subtitle: "islandFamilySubtitle",
    x: MAP_WIDTH * 0.1,
    y: MAP_HEIGHT * 0.5,
    size: "medium",
    status: "locked",
    imageSource: BackgroundImages.islands.blank,
    lessons: [
      LessonKey.FamilyMembers,
      LessonKey.FamilyRelations,
      LessonKey.FamilyActivities,
      LessonKey.FamilyMatching,
      LessonKey.FamilyQuiz,
    ],
  },
  {
    id: "food",
    title: "islandFoodTitle",
    subtitle: "islandFoodSubtitle",
    x: MAP_WIDTH * 0.8,
    y: MAP_HEIGHT * 0.6,
    size: "medium",
    status: "locked",
    imageSource: BackgroundImages.islands.blank,
    lessons: [
      LessonKey.FoodFruits,
      LessonKey.FoodVegetables,
      LessonKey.FoodMeals,
      LessonKey.FoodMatching,
      LessonKey.FoodQuiz,
    ],
  },
  {
    id: "conversation",
    title: "islandConversationTitle",
    subtitle: "islandConversationSubtitle",
    x: MAP_WIDTH * 0.5,
    y: MAP_HEIGHT * 0.8,
    size: "large",
    status: "locked",
    imageSource: BackgroundImages.islands.blank,
    lessons: [
      LessonKey.Greetings,
      LessonKey.Feelings,
      LessonKey.Weather,
      LessonKey.DailyRoutine,
      LessonKey.ConversationMatching,
      LessonKey.ConversationQuiz,
    ],
  },
];
