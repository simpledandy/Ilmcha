import { Segment } from "@/src/types/common";

export const Q :Segment[] = [
  {
    points: [
    // Top curve
    { x: 0.7, y: 0.3 }, { x: 0.65, y: 0.2 },
    { x: 0.6, y: 0.15 }, { x: 0.4, y: 0.15 },
    { x: 0.35, y: 0.2 }, { x: 0.3, y: 0.3 },
    // Left top to bottom
    { x: 0.25, y: 0.4 }, { x: 0.25, y: 0.6 },
    // Bottom curve
    { x: 0.3, y: 0.7 }, { x: 0.35, y: 0.8 },
    { x: 0.4, y: 0.85 }, { x: 0.6, y: 0.85 },
    { x: 0.65, y: 0.8 }, { x: 0.7, y: 0.7 },
    // Right bottom to top
    { x: 0.75, y: 0.6 }, { x: 0.75, y: 0.4 },

    // Top curve back to start
    { x: 0.7, y: 0.3 }
  ]
},
  { points: [ { x: 0.6, y: 0.7 }, { x: 0.8, y: 0.9 } ] }, // Tail
];