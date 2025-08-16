import { Segment } from "@/src/types/common";

export const trapezium: Segment[] = [
  // Top
  {
    points: [
      { x: 0.3, y: 0.2 },
      { x: 0.7, y: 0.2 }
    ],
    isCritical: true
  },
  // Right
  {
    points: [
      { x: 0.7, y: 0.2 },
      { x: 0.8, y: 0.8 }
    ]
  },
  // Bottom
  {
    points: [
      { x: 0.8, y: 0.8 },
      { x: 0.2, y: 0.8 }
    ],
    isCritical: true
  },
  // Left
  {
    points: [
      { x: 0.2, y: 0.8 },
      { x: 0.3, y: 0.2 }
    ]
  }
];