import { Segment } from "@/src/types/common";

export const parallelogram: Segment[] = [
  // Top
  {
    points: [
      { x: 0.3, y: 0.15 },
      { x: 0.9, y: 0.15 }
    ],
    isCritical: true
  },
  // Right diagonal
  {
    points: [
      { x: 0.9, y: 0.15 },
      { x: 0.7, y: 0.85 }
    ]
  },
  // Bottom
  {
    points: [
      { x: 0.7, y: 0.85 },
      { x: 0.1, y: 0.85 }
    ],
    isCritical: true
  },
  // Left diagonal
  {
    points: [
      { x: 0.1, y: 0.85 },
      { x: 0.3, y: 0.15 }
    ]
  }
];