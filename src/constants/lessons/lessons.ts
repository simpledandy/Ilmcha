import { lessonTemplates } from './lessonTypes';

export enum LessonKey {
  NumberTracing1 = 'number_tracing_1',
  NumberTracing2 = 'number_tracing_2',
  CountingFish3 = 'counting_fish_3',
  NumberTracing3 = 'number_tracing_3',
  NumberTracing4 = 'number_tracing_4',
  CountingFish5 = 'counting_fish_5',
  NumberTracing5 = 'number_tracing_5',
  AlphabetQuizNumbers = 'alphabet_quiz_numbers',
  LetterTracingAEn = 'letter_tracing_A_en',
  LetterTracingBEn = 'letter_tracing_B_en',
  LetterTracingCEn = 'letter_tracing_C_en',
  WordMatchingABC = 'word_matching_ABC',
  LetterTracingDEn = 'letter_tracing_D_en',
  LetterTracingEEn = 'letter_tracing_E_en',
  ListeningABCDE = 'listening_ABCDE',
  AlphabetQuizABCDE = 'alphabet_quiz_ABCDE',
}

export const lessons: Record<LessonKey, ReturnType<typeof lessonTemplates[keyof typeof lessonTemplates]>> = {
  [LessonKey.NumberTracing1]: lessonTemplates.numberTracing('1'),
  [LessonKey.NumberTracing2]: lessonTemplates.numberTracing('2'),
  [LessonKey.CountingFish3]: lessonTemplates.countingFish(3),
  [LessonKey.NumberTracing3]: lessonTemplates.numberTracing('3'),
  [LessonKey.NumberTracing4]: lessonTemplates.numberTracing('4'),
  [LessonKey.CountingFish5]: lessonTemplates.countingFish(5),
  [LessonKey.NumberTracing5]: lessonTemplates.numberTracing('5'),
  [LessonKey.AlphabetQuizNumbers]: lessonTemplates.alphabetQuiz(['1','2','3','4','5']),
  [LessonKey.LetterTracingAEn]: lessonTemplates.letterTracing('A', 'en'),
  [LessonKey.LetterTracingBEn]: lessonTemplates.letterTracing('B', 'en'),
  [LessonKey.LetterTracingCEn]: lessonTemplates.letterTracing('C', 'en'),
  [LessonKey.WordMatchingABC]: lessonTemplates.wordMatching([
    { word: 'Apple', image: 'apple.png' },
    { word: 'Ball', image: 'ball.png' },
    { word: 'Cat', image: 'cat.png' },
  ]),
  [LessonKey.LetterTracingDEn]: lessonTemplates.letterTracing('D', 'en'),
  [LessonKey.LetterTracingEEn]: lessonTemplates.letterTracing('E', 'en'),
  [LessonKey.ListeningABCDE]: lessonTemplates.listeningExercise(['Apple', 'Ball', 'Cat', 'Dog', 'Egg']),
  [LessonKey.AlphabetQuizABCDE]: lessonTemplates.alphabetQuiz(['A','B','C','D','E']),
}; 