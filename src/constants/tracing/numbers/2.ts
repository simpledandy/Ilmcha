import { Segment } from "@/src/types/common";

export const two: Segment[] = [
  {
    points: [
      // Top curve
      { x: 0.3, y: 0.2 }, { x: 0.4, y: 0.1 },
      { x: 0.6, y: 0.1 }, { x: 0.7, y: 0.2 },
      // Right curve
      { x: 0.7, y: 0.3 }, { x: 0.7, y: 0.4 },
      // Diagonal 
      { x: 0.3, y: 0.78 }, { x: 0.25, y: 0.9 },
    ],
    isCritical: true
  },
  {
    points: [
      // Bottom line
      { x: 0.25, y: 0.9 }, { x: 0.7, y: 0.9 }
    ],
  }
];