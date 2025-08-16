import { Segment } from "@/src/types/common";

export const U: Segment[] = [
  {
    points: [
      // Left side
      { x: 0.25, y: 0.1 },
      { x: 0.25, y: 0.7 },
      // Bottom curve
      { x: 0.25, y: 0.8 }, { x: 0.4, y: 0.9 },
      { x: 0.6, y: 0.9 }, { x: 0.75, y: 0.8 },
      // Right side
      { x: 0.75, y: 0.7 },
      { x: 0.75, y: 0.1 }
    ],
    isCritical: true
  }
];