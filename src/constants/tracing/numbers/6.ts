import { Segment } from "@/src/types/common";

export const six: Segment[] = [
  {
    points: [
      // Top curve
      { x: 0.6, y: 0.2 }, { x: 0.5, y: 0.2 },
      { x: 0.4, y: 0.25 }, { x: 0.35, y: 0.3 },
      // Left side
      { x: 0.3, y: 0.4 }, { x: 0.25, y: 0.7 },
      // Bottom curve
      { x: 0.3, y: 0.8 }, { x: 0.4, y: 0.9 },
      { x: 0.5, y: 0.9 }, { x: 0.6, y: 0.8 },
      // Right side up to middle
      { x: 0.65, y: 0.7 }, { x: 0.65, y: 0.6 },
      // Inner curve
      { x: 0.55, y: 0.5 }, { x: 0.5, y: 0.5 },
      { x: 0.4, y: 0.5 }, { x: 0.3, y: 0.6 },
      //{ x: 0.5, y: 0.7 }, { x: 0.6, y: 0.7 },
      //{ x: 0.65, y: 0.6 }
    ],
    isCritical: true
  }
];