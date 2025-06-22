export interface TracingItem {
  id: string;
  pathData: string;
  startPoint: { x: number; y: number };
  endPoint: { x: number; y: number };
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'number' | 'letter';
  language: 'en' | 'uz';
  value: string;
}

// SVG path data for numbers 1-10
export const numberPaths: { [key: string]: string } = {
  '0': 'M200 200 Q150 250 200 300 Q250 350 200 400 Q150 350 200 300 Q250 250 200 200',
  '1': 'M175 250 L200 200 V400',
  '2': 'M150 250 Q200 200 250 250 Q250 300 150 400 H250',
  '3': 'M150 250 Q200 200 250 250 Q200 300 250 350 Q200 400 150 350',
  '4': 'M250 350 V200 L150 350 H250',
  '5': 'M250 200 H150 V300 Q200 300 250 350 Q200 400 150 350',
  '6': 'M250 250 Q200 200 150 250 Q100 300 150 350 Q200 400 250 350 Q200 300 150 350',
  '7': 'M150 200 H250 L150 400',
  '8': 'M200 300 Q250 250 200 200 Q150 250 200 300 Q250 350 200 400 Q150 350 200 300',
  '9': 'M250 350 Q200 400 150 350 Q100 300 150 250 Q200 200 250 250 Q300 300 250 350'
};

// SVG path data for English letters A-Z
export const englishLetterPaths: { [key: string]: string } = {
  'A': 'M150 400 L200 200 L250 400 M175 300 L225 300',
  'B': 'M150 200 L150 400 M150 200 Q225 250 150 300 M150 300 Q225 350 150 400',
  'C': 'M250 250 Q200 200 150 250 Q100 300 150 350 Q200 400 250 350',
  'D': 'M150 200 L150 400 Q250 300 150 200',
  'E': 'M250 200 H150 V400 H250 M150 300 H225',
  'F': 'M250 200 H150 V400 M150 300 H225',
  'G': 'M250 250 Q200 200 150 250 Q100 300 150 350 Q200 400 250 350 M200 350 H250',
  'H': 'M150 200 V400 M250 200 V400 M150 300 H250',
  'I': 'M150 200 H250 M200 200 V400 M150 400 H250',
  'J': 'M250 200 H200 V350 Q200 400 150 350',
  'K': 'M150 200 V400 M250 200 L150 300 L250 400',
  'L': 'M150 200 V400 H250',
  'M': 'M150 400 V200 L200 300 L250 200 V400',
  'N': 'M150 400 V200 L250 400 V200',
  'O': 'M150 250 Q200 200 250 250 Q300 300 250 350 Q200 400 150 350 Q100 300 150 250',
  'P': 'M150 200 V400 M150 200 Q250 225 150 250',
  'Q': 'M150 250 Q200 200 250 250 Q300 300 250 350 Q200 400 150 350 Q100 300 150 250 M225 325 L275 375',
  'R': 'M150 200 V400 M150 200 Q250 225 150 250 M150 250 L250 400',
  'S': 'M250 200 Q150 200 150 300 Q150 400 250 400',
  'T': 'M150 200 H250 M200 200 V400',
  'U': 'M150 200 V350 Q200 400 250 350 V200',
  'V': 'M150 200 L200 400 L250 200',
  'W': 'M150 200 L175 400 L200 300 L225 400 L250 200',
  'X': 'M150 200 L250 400 M150 400 L250 200',
  'Y': 'M150 200 L200 300 L250 200 M200 300 V400',
  'Z': 'M150 200 H250 L150 400 H250',
};

// SVG path data for Uzbek letters (Cyrillic)
export const uzbekLetterPaths: { [key: string]: string } = {
  'A': 'M150 400 L200 200 L250 400 M175 300 L225 300',
  'B': 'M150 200 L150 400 M150 200 Q225 250 150 300 M150 300 Q225 350 150 400',
  'C': 'M250 250 Q200 200 150 250 Q100 300 150 350 Q200 400 250 350',
  'D': 'M150 200 L150 400 Q250 300 150 200',
  'E': 'M250 200 H150 V400 H250 M150 300 H225',
  'F': 'M250 200 H150 V400 M150 300 H225',
  'G': 'M250 250 Q200 200 150 250 Q100 300 150 350 Q200 400 250 350 M200 350 H250',
  'H': 'M150 200 V400 M250 200 V400 M150 300 H250',
  'I': 'M150 200 H250 M200 200 V400 M150 400 H250',
  'J': 'M250 200 H200 V350 Q200 400 150 350',
  'K': 'M150 200 V400 M250 200 L150 300 L250 400',
  'L': 'M150 200 V400 H250',
  'M': 'M150 400 V200 L200 300 L250 200 V400',
  'N': 'M150 400 V200 L250 400 V200',
  'O': 'M150 250 Q200 200 250 250 Q300 300 250 350 Q200 400 150 350 Q100 300 150 250',
  'P': 'M150 200 V400 M150 200 Q250 225 150 250',
  'Q': 'M150 250 Q200 200 250 250 Q300 300 250 350 Q200 400 150 350 Q100 300 150 250 M225 325 L275 375',
  'R': 'M150 200 V400 M150 200 Q250 225 150 250 M150 250 L250 400',
  'S': 'M250 200 Q150 200 150 300 Q150 400 250 400',
  'T': 'M150 200 H250 M200 200 V400',
  'U': 'M150 200 V350 Q200 400 250 350 V200',
  'V': 'M150 200 L200 400 L250 200',
  'W': 'M150 200 L175 400 L200 300 L225 400 L250 200',
  'X': 'M150 200 L250 400 M150 400 L250 200',
  'Y': 'M150 200 L200 300 L250 200 M200 300 V400',
  'Z': 'M150 200 H250 L150 400 H250',
};

// Helper function to get tracing data by category and language
export const getTracingDataByCategory = (category: 'number' | 'letter', language: 'en' | 'uz' = 'en') => {
  if (category === 'number') {
    return Object.entries(numberPaths).map(([value, pathData]) => ({
      id: `number-${value}`,
      pathData,
      startPoint: { x: 0, y: 0 },
      endPoint: { x: 0, y: 0 },
      difficulty: 'medium' as const,
      category: 'number' as const,
      language: 'en' as const,
      value
    }));
  } else {
    const letterPaths = language === 'en' ? englishLetterPaths : uzbekLetterPaths;
    return Object.entries(letterPaths).map(([value, pathData]) => ({
      id: `letter-${language}-${value}`,
      pathData,
      startPoint: { x: 0, y: 0 },
      endPoint: { x: 0, y: 0 },
      difficulty: 'medium' as const,
      category: 'letter' as const,
      language,
      value
    }));
  }
};