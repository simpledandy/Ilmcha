import { Segment } from "@/src/types/common";

export const rectangle: Segment[] = [
  // Top
  {
    points: [
      { x: 0.1, y: 0.2 },
      { x: 0.9, y: 0.2 }
    ],
    isCritical: true
  },
  // Right
  {
    points: [
      { x: 0.9, y: 0.2 },
      { x: 0.9, y: 0.8 }
    ]
  },
  // Bottom
  {
    points: [
      { x: 0.9, y: 0.8 },
      { x: 0.1, y: 0.8 }
    ],
    isCritical: true
  },
  // Left
  {
    points: [
      { x: 0.1, y: 0.8 },
      { x: 0.1, y: 0.2 }
    ]
  }
];