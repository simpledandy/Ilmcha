// Tracing segments for all letters (A-Z) and numbers (0-9)
// Each segment: { path, pointer, direction }

export const tracingSegments: Record<string, { path: string, pointer: [number, number], direction: 'left'|'right'|'up'|'down' }[]> = {
  A: [
    { path: 'M200,80 L150,320', pointer: [200,80], direction: 'down' }, // left stroke
    { path: 'M200,80 L250,320', pointer: [200,80], direction: 'down' }, // right stroke
    { path: 'M170,220 L230,220', pointer: [170,220], direction: 'right' }, // crossbar
  ],
  B: [
    { path: 'M150,80 L150,320', pointer: [150,80], direction: 'down' }, // main stem
    { path: 'M150,80 Q230,120 150,200', pointer: [150,80], direction: 'right' }, // upper curve
    { path: 'M150,200 Q230,240 150,320', pointer: [150,200], direction: 'right' }, // lower curve
  ],
  '1': [
    { path: 'M200,100 L200,320', pointer: [200,100], direction: 'down' },
  ],
  '2': [
    { path: 'M150,150 Q200,80 250,150', pointer: [150,150], direction: 'right' },
    { path: 'M250,150 Q250,250 150,320', pointer: [250,150], direction: 'down' },
    { path: 'M150,320 L250,320', pointer: [150,320], direction: 'right' },
  ],
  // Add all other letters and numbers as needed
}; 