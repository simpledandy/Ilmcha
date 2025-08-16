import { Segment } from "@/src/types/common";

export const J: Segment[] = [
  // Top bar
  {
    points: [
      { x: 0.45, y: 0.1 },
      { x: 0.65, y: 0.1 }
    ]
  },
  // Vertical line
  {
    points: [
      { x: 0.55, y: 0.1 },
      { x: 0.6, y: 0.7 }
    ],
    isCritical: true
  },
  // Curve
  {
    points: [
      // Bottom curve
      { x: 0.35, y: 0.7 }, { x: 0.4, y: 0.8 },
      { x: 0.55, y: 0.8 }, { x: 0.6, y: 0.7 },
    ]
  }
];
