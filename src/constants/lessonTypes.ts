export interface LessonStep {
  id: string;
  type: 'instruction' | 'interaction' | 'quiz' | 'reward';
  content: any;
  duration?: number; // in milliseconds
  required?: boolean;
  skipOnFail?: boolean;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  category: 'tracing' | 'counting' | 'alphabet' | 'quiz' | 'matching' | 'listening' | 'speaking';
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedDuration: number; // in minutes
  steps: LessonStep[];
  prerequisites?: string[]; // lesson IDs that must be completed first
  rewardMultiplier: number;
  maxPoints: number;
  audioFile?: string;
  backgroundImage?: string;
  penguinPose?: string;
}

export interface QuizQuestion {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'matching' | 'fill_blank';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
  audioFile?: string;
  imageFile?: string;
}

export interface TracingExercise {
  id: string;
  target: string; // letter or number
  pathData: string;
  startPoint: { x: number; y: number };
  endPoint: { x: number; y: number };
  difficulty: 'easy' | 'medium' | 'hard';
  hints: string[];
  audioFile?: string;
}

export interface CountingExercise {
  id: string;
  targetNumber: number;
  items: Array<{
    id: string;
    type: 'fish' | 'star' | 'coin' | 'fruit' | 'animal';
    position: { x: number; y: number };
  }>;
  question: string;
  audioFile?: string;
  backgroundImage?: string;
}

export interface MatchingExercise {
  id: string;
  pairs: Array<{
    id: string;
    left: { text: string; image?: string; audio?: string };
    right: { text: string; image?: string; audio?: string };
  }>;
  shuffle: boolean;
  points: number;
}

// Lesson Templates
export const lessonTemplates = {
  // Tracing Lessons
  letterTracing: (letter: string, language: 'en' | 'uz' = 'en'): Lesson => ({
    id: `letter_tracing_${letter}_${language}`,
    title: `Trace Letter ${letter}`,
    description: `Learn to write the letter ${letter}`,
    category: 'tracing',
    difficulty: 'medium',
    estimatedDuration: 3,
    rewardMultiplier: 1.0,
    maxPoints: 50,
    audioFile: `letter_${letter.toLowerCase()}`,
    penguinPose: 'pointing-to-board-green',
    steps: [
      {
        id: 'intro',
        type: 'instruction',
        content: {
          text: `Let's learn to write the letter ${letter}!`,
          image: `letter_${letter.toLowerCase()}`,
          audio: `letter_${letter.toLowerCase()}`
        },
        duration: 3000
      },
      {
        id: 'demonstration',
        type: 'instruction',
        content: {
          text: 'Watch how I trace it, then you try!',
          animation: 'tracing_demo',
          audio: 'tracing_instruction'
        },
        duration: 4000
      },
      {
        id: 'practice',
        type: 'interaction',
        content: {
          type: 'tracing',
          exercise: {
            target: letter,
            pathData: '', // Will be filled from tracingData
            startPoint: { x: 0, y: 0 },
            endPoint: { x: 0, y: 0 },
            difficulty: 'medium',
            hints: ['Start at the top', 'Follow the dotted line', 'Take your time']
          }
        },
        required: true
      },
      {
        id: 'reward',
        type: 'reward',
        content: {
          message: `Great job writing ${letter}!`,
          audio: 'congrats'
        }
      }
    ]
  }),

  numberTracing: (number: string): Lesson => ({
    id: `number_tracing_${number}`,
    title: `Trace Number ${number}`,
    description: `Learn to write the number ${number}`,
    category: 'tracing',
    difficulty: 'medium',
    estimatedDuration: 3,
    rewardMultiplier: 1.0,
    maxPoints: 50,
    audioFile: `number_${number}`,
    penguinPose: 'pointing-to-board-green',
    steps: [
      {
        id: 'intro',
        type: 'instruction',
        content: {
          text: `Let's learn to write the number ${number}!`,
          image: `number_${number}`,
          audio: `number_${number}`
        },
        duration: 3000
      },
      {
        id: 'demonstration',
        type: 'instruction',
        content: {
          text: 'Watch how I trace it, then you try!',
          animation: 'tracing_demo',
          audio: 'tracing_instruction'
        },
        duration: 4000
      },
      {
        id: 'practice',
        type: 'interaction',
        content: {
          type: 'tracing',
          exercise: {
            target: number,
            pathData: '', // Will be filled from tracingData
            startPoint: { x: 0, y: 0 },
            endPoint: { x: 0, y: 0 },
            difficulty: 'medium',
            hints: ['Start at the top', 'Follow the dotted line', 'Take your time']
          }
        },
        required: true
      },
      {
        id: 'reward',
        type: 'reward',
        content: {
          message: `Excellent! You wrote ${number} perfectly!`,
          audio: 'congrats'
        }
      }
    ]
  }),

  // Counting Lessons
  countingFish: (targetNumber: number): Lesson => ({
    id: `counting_fish_${targetNumber}`,
    title: `Count to ${targetNumber}`,
    description: `Learn to count ${targetNumber} fish`,
    category: 'counting',
    difficulty: targetNumber <= 5 ? 'easy' : targetNumber <= 8 ? 'medium' : 'hard',
    estimatedDuration: 4,
    rewardMultiplier: 1.2,
    maxPoints: 60,
    audioFile: 'counting_fish',
    backgroundImage: 'counting_bg',
    penguinPose: 'waving-explorer',
    steps: [
      {
        id: 'intro',
        type: 'instruction',
        content: {
          text: `Let's count fish together! Can you find ${targetNumber} fish?`,
          audio: 'counting_fish'
        },
        duration: 3000
      },
      {
        id: 'counting',
        type: 'interaction',
        content: {
          type: 'counting',
          exercise: {
            targetNumber,
            items: Array.from({ length: targetNumber }, (_, i) => ({
              id: `fish_${i}`,
              type: 'fish' as const,
              position: { x: 50 + (i * 60), y: 200 + (i % 2 * 40) }
            })),
            question: `How many fish do you see?`,
            audioFile: `number_${targetNumber}`
          }
        },
        required: true
      },
      {
        id: 'reward',
        type: 'reward',
        content: {
          message: `Perfect! You counted ${targetNumber} fish!`,
          audio: 'congrats'
        }
      }
    ]
  }),

  // Quiz Lessons
  alphabetQuiz: (letters: string[]): Lesson => ({
    id: `alphabet_quiz_${letters.join('_')}`,
    title: 'Alphabet Quiz',
    description: 'Test your knowledge of letters',
    category: 'quiz',
    difficulty: 'medium',
    estimatedDuration: 5,
    rewardMultiplier: 1.5,
    maxPoints: 100,
    audioFile: 'quiz_intro',
    penguinPose: 'with-laptop-questioning-green',
    steps: [
      {
        id: 'intro',
        type: 'instruction',
        content: {
          text: 'Let\'s test what you\'ve learned!',
          audio: 'quiz_intro'
        },
        duration: 2000
      },
      {
        id: 'quiz',
        type: 'interaction',
        content: {
          type: 'quiz',
          questions: letters.map((letter, index) => ({
            id: `question_${index}`,
            type: 'multiple_choice' as const,
            question: `What letter is this?`,
            options: [letter, String.fromCharCode(letter.charCodeAt(0) + 1), String.fromCharCode(letter.charCodeAt(0) - 1), 'I don\'t know'],
            correctAnswer: letter,
            points: 20,
            audioFile: `letter_${letter.toLowerCase()}`,
            imageFile: `letter_${letter.toLowerCase()}`
          }))
        },
        required: true
      },
      {
        id: 'reward',
        type: 'reward',
        content: {
          message: 'Amazing! You know your letters!',
          audio: 'congrats'
        }
      }
    ]
  }),

  // Matching Lessons
  wordMatching: (pairs: Array<{ word: string; image: string }>): Lesson => ({
    id: `word_matching_${pairs.map(p => p.word).join('_')}`,
    title: 'Word Matching',
    description: 'Match words with their pictures',
    category: 'matching',
    difficulty: 'medium',
    estimatedDuration: 4,
    rewardMultiplier: 1.3,
    maxPoints: 80,
    audioFile: 'matching_intro',
    penguinPose: 'pointing-to-board-pink',
    steps: [
      {
        id: 'intro',
        type: 'instruction',
        content: {
          text: 'Match each word with its picture!',
          audio: 'matching_intro'
        },
        duration: 2000
      },
      {
        id: 'matching',
        type: 'interaction',
        content: {
          type: 'matching',
          exercise: {
            pairs: pairs.map((pair, index) => ({
              id: `pair_${index}`,
              left: { text: pair.word, audio: `word_${pair.word.toLowerCase()}` },
              right: { text: '', image: pair.image }
            })),
            shuffle: true,
            points: 20
          }
        },
        required: true
      },
      {
        id: 'reward',
        type: 'reward',
        content: {
          message: 'Perfect matching! You\'re amazing!',
          audio: 'congrats'
        }
      }
    ]
  }),

  // Listening Lessons
  listeningExercise: (words: string[]): Lesson => ({
    id: `listening_${words.join('_')}`,
    title: 'Listening Practice',
    description: 'Listen and repeat the words',
    category: 'listening',
    difficulty: 'easy',
    estimatedDuration: 3,
    rewardMultiplier: 1.1,
    maxPoints: 40,
    audioFile: 'listening_intro',
    penguinPose: 'waving-green',
    steps: [
      {
        id: 'intro',
        type: 'instruction',
        content: {
          text: 'Listen carefully and repeat after me!',
          audio: 'listening_intro'
        },
        duration: 2000
      },
      {
        id: 'listening',
        type: 'interaction',
        content: {
          type: 'listening',
          words: words.map(word => ({
            word,
            audio: `word_${word.toLowerCase()}`,
            image: `word_${word.toLowerCase()}`
          }))
        },
        required: true
      },
      {
        id: 'reward',
        type: 'reward',
        content: {
          message: 'Great listening skills!',
          audio: 'congrats'
        }
      }
    ]
  })
};

// Helper function to create lesson instances
export const createLesson = (template: keyof typeof lessonTemplates, params: any): Lesson => {
  return lessonTemplates[template](params);
};

// Lesson progression system
export const lessonProgression = {
  numbers: [
    'number_tracing_1',
    'number_tracing_2',
    'counting_fish_3',
    'number_tracing_3',
    'number_tracing_4',
    'counting_fish_5',
    'number_tracing_5',
    'alphabet_quiz_numbers'
  ],
  alphabet: [
    'letter_tracing_A_en',
    'letter_tracing_B_en',
    'letter_tracing_C_en',
    'word_matching_ABC',
    'letter_tracing_D_en',
    'letter_tracing_E_en',
    'listening_ABCDE',
    'alphabet_quiz_ABCDE'
  ]
}; 