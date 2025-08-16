// Defines the activity and adventure flow for each island type
export type TopicAdventure = 'intro' | 'tracing' | 'matching' | 'arranging';
export type ReviewAdventure = 'counting' | 'hunting' | 'sequencing';
export const positions = [
  [ {x:0.2,y:0.5}, {x:0.4,y:0.6}, {x:0.6,y:0.4} ],
  [ {x:0.3,y:0.7}, {x:0.5,y:0.5}, {x:0.7,y:0.3} ],
  [ {x:0.1,y:0.2}, {x:0.8,y:0.6}, {x:0.5,y:0.8} ],
  [ {x:0.6,y:0.2}, {x:0.2,y:0.8}, {x:0.4,y:0.4} ],
  [ {x:0.7,y:0.5}, {x:0.3,y:0.3}, {x:0.5,y:0.7} ],
  [ {x:0.5,y:0.5}, {x:0.6,y:0.6}, {x:0.4,y:0.4} ], // for matching
];
export const intervals = [2, 3, 2, 4, 3, 2];

export const numbersAdventureTypes = [
  'counting-fish', 'counting-flowers', 'counting-apples', 'counting-birds', 'counting-stars',
] as const;
export const numbersAdventureScenes = ['lake', 'garden', 'tree', 'sky', 'night', 'classroom'];
export const numbersAdventureItems = ['fish', 'flower', 'apple', 'bird', 'star', 'number'];

// Letters Island
export const lettersAdventureTypes = [
  'find-letters-in-forest', 'match-uppercase-lowercase', 'alphabet-train', 'letter-sound-hunt', 'missing-letter-quest', 'match-letters'
] as const;
export const lettersAdventureScenes = ['forest', 'train', 'classroom', 'garden', 'clouds', 'classroom'];
export const lettersAdventureItems = ['letter', 'train-car', 'flower', 'cloud', 'book', 'letter'];

// Shapes Island
export const shapesAdventureTypes = [
  'shape-hunt', 'shape-sorting', 'shape-building', 'real-world-match', 'shape-maze', 'match-shapes'
] as const;
export const shapesAdventureScenes = ['playground', 'puzzle-room', 'city', 'park', 'maze', 'classroom'];
export const shapesAdventureItems = ['circle', 'triangle', 'square', 'rectangle', 'star', 'shape'];

// Colors Island
export const colorsAdventureTypes = [
  'color-hunt', 'color-mixing', 'rainbow-builder', 'color-sorting', 'find-odd-color', 'match-colors'
] as const;
export const colorsAdventureScenes = ['art-room', 'garden', 'rainbow', 'studio', 'park', 'classroom'];
export const colorsAdventureItems = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'purple'];

// Time Island
export const timeAdventureTypes = [
  'day-sequence', 'month-hunt', 'season-match', 'clock-builder', 'routine-builder', 'match-time'
] as const;
export const timeAdventureScenes = ['calendar', 'garden', 'classroom', 'park', 'home', 'classroom'];
export const timeAdventureItems = ['day', 'month', 'season', 'clock', 'activity', 'time'];