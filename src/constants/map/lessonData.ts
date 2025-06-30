import { LessonImages } from "@constants/images/images";
import { ImageSource } from "@/src/types/common";

export interface LessonData {
  id: string;
  islandId: string;
  titleKey: string;
  descriptionKey: string;
  image: ImageSource;
}

export const lessons: LessonData[] = [
  {
    id: "counting-fish",
    islandId: "numbers",
    titleKey: "lessonCountingFishTitle",
    descriptionKey: "lessonCountingFishDescription",
    image: LessonImages.countingFish,
  },
  {
    id: "lesson-2",
    islandId: "numbers",
    titleKey: "lessonDummyTitle",
    descriptionKey: "lessonDummyDescription",
    image: LessonImages.countingFish,
  },
  {
    id: "lesson-3",
    islandId: "numbers",
    titleKey: "lessonDummyTitle",
    descriptionKey: "lessonDummyDescription",
    image: LessonImages.countingFish,
  },
  {
    id: "lesson-4",
    islandId: "numbers",
    titleKey: "lessonDummyTitle",
    descriptionKey: "lessonDummyDescription",
    image: LessonImages.countingFish,
  },
  {
    id: "lesson-5",
    islandId: "numbers",
    titleKey: "lessonDummyTitle",
    descriptionKey: "lessonDummyDescription",
    image: LessonImages.countingFish,
  },
  {
    id: "lesson-6",
    islandId: "numbers",
    titleKey: "lessonDummyTitle",
    descriptionKey: "lessonDummyDescription",
    image: LessonImages.countingFish,
  },
  {
    id: "lesson-7",
    islandId: "numbers",
    titleKey: "lessonDummyTitle",
    descriptionKey: "lessonDummyDescription",
    image: LessonImages.countingFish,
  },
  {
    id: "lesson-8",
    islandId: "numbers",
    titleKey: "lessonDummyTitle",
    descriptionKey: "lessonDummyDescription",
    image: LessonImages.countingFish,
  },
];
